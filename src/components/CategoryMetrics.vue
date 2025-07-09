<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">
        Métricas por Categoría de Tickets
      </h3>
      <Button @click="refreshData" variant="outline" size="sm" :disabled="loading">
        <RefreshCw class="h-4 w-4 mr-2" :class="{ 'animate-spin': loading }" />
        Actualizar
      </Button>
    </div>

    <!-- Gráfico de Barras -->
    <div class="bg-white p-6 rounded-lg border border-gray-200">
      <h4 class="text-md font-medium text-gray-700 mb-4">Distribución por Categorías</h4>
      <div class="space-y-3">
        <div 
          v-for="(item, index) in categoriesSorted" 
          :key="index"
          class="flex items-center justify-between"
        >
          <div class="flex items-center space-x-3 flex-1">
            <div class="flex items-center space-x-2 min-w-[200px]">
              <span :class="getCategoryIcon(item.key)"></span>
              <span class="text-sm font-medium text-gray-700">
                {{ getCategoryLabel(item.key) }}
              </span>
            </div>
            <div class="flex-1 max-w-xs">
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  :class="getCategoryColor(item.key)"
                  class="h-2.5 rounded-full transition-all duration-300"
                  :style="{ width: getPercentage(item.count) + '%' }"
                ></div>
              </div>
            </div>
          </div>
          <div class="text-sm font-semibold text-gray-900 min-w-[60px] text-right">
            {{ item.count }}
            <span class="text-gray-500 font-normal">
              ({{ ((item.count / totalTickets) * 100).toFixed(1) }}%)
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Cards Resumen -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="(item, index) in categoriesSorted.slice(0, 4)" 
        :key="index"
        class="bg-white p-4 rounded-lg border border-gray-200"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">
              {{ getCategoryLabel(item.key) }}
            </p>
            <p class="text-2xl font-bold text-gray-900">
              {{ item.count }}
            </p>
          </div>
          <div :class="getCategoryIcon(item.key) + ' text-2xl'"></div>
        </div>
      </div>
    </div>

    <!-- Estadísticas Adicionales -->
    <div class="bg-gray-50 p-4 rounded-lg">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-sm text-gray-600">Total de Tickets</p>
          <p class="text-xl font-bold text-gray-900">{{ totalTickets }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">Categoría Más Común</p>
          <p class="text-xl font-bold text-blue-600">
            {{ getMostCommonCategory() }}
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-600">Categorías Activas</p>
          <p class="text-xl font-bold text-green-600">
            {{ getActiveCategoriesCount() }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineEmits, defineProps } from 'vue'
import { RefreshCw } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  categoryStats?: Record<string, number> | null
}>()

const emit = defineEmits<{
  refresh: []
}>()

const loading = ref(false)

const categoryLabels = {
  login_problem: 'Problemas de Acceso',
  new_user: 'Nuevos Usuarios',
  user_modification: 'Modificación de Usuario',
  usability_problem: 'Problemas de Usabilidad',
  technical_issue: 'Problemas Técnicos',
  feature_request: 'Solicitudes de Funcionalidad',
  other: 'Otros'
}

const categoryIcons = {
  login_problem: '🔐',
  new_user: '👤',
  user_modification: '✏️',
  usability_problem: '🤔',
  technical_issue: '⚠️',
  feature_request: '💡',
  other: '📋'
}

const categoryColors = {
  login_problem: 'bg-red-500',
  new_user: 'bg-green-500',
  user_modification: 'bg-blue-500',
  usability_problem: 'bg-yellow-500',
  technical_issue: 'bg-red-600',
  feature_request: 'bg-purple-500',
  other: 'bg-gray-500'
}

const categoriesSorted = computed(() => {
  if (!props.categoryStats) return []
  
  return Object.entries(props.categoryStats)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
})

const totalTickets = computed(() => {
  if (!props.categoryStats) return 0
  return Object.values(props.categoryStats).reduce((sum, count) => sum + count, 0)
})

const getCategoryLabel = (key: string) => {
  return categoryLabels[key as keyof typeof categoryLabels] || key
}

const getCategoryIcon = (key: string) => {
  return categoryIcons[key as keyof typeof categoryIcons] || '📋'
}

const getCategoryColor = (key: string) => {
  return categoryColors[key as keyof typeof categoryColors] || 'bg-gray-500'
}

const getPercentage = (count: number) => {
  if (totalTickets.value === 0) return 0
  return (count / totalTickets.value) * 100
}

const getMostCommonCategory = () => {
  if (categoriesSorted.value.length === 0) return 'N/A'
  const mostCommon = categoriesSorted.value[0]
  return getCategoryLabel(mostCommon.key)
}

const getActiveCategoriesCount = () => {
  return categoriesSorted.value.filter(item => item.count > 0).length
}

const refreshData = async () => {
  loading.value = true
  try {
    emit('refresh')
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 500)
  }
}
</script> 