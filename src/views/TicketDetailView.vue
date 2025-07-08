<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />
    
    <main class="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="mb-8">
          <div class="flex items-center space-x-4">
            <Button variant="ghost" @click="$router.push('/tickets')">
              <ArrowLeft class="h-4 w-4 mr-2" />
              Volver a Tickets
            </Button>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">
                Ticket #{{ $route.params.id }}
              </h1>
              <p class="text-gray-600">Detalle del ticket</p>
            </div>
          </div>
        </div>

        <Card>
          <CardContent class="p-6">
            <p class="text-gray-600">Vista de detalle del ticket en construcción...</p>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ArrowLeft } from 'lucide-vue-next'
import NavBar from '@/components/NavBar.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
</script> 