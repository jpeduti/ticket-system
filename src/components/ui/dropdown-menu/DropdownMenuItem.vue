<script setup>
import { reactiveOmit } from "@vueuse/core";
import { DropdownMenuItem, useForwardProps } from "reka-ui";
import { cn } from "@/lib/utils";

const props = defineProps({
  disabled: { type: Boolean, required: false },
  textValue: { type: String, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
  class: { type: null, required: false },
  inset: { type: Boolean, required: false },
  variant: { type: String, required: false, default: "default" },
});

const delegatedProps = reactiveOmit(props, "inset", "variant", "class");

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <DropdownMenuItem
    v-bind="forwardedProps"
    class="custom-dropdown-item"
    :class="[
      props.class,
      {
        'custom-dropdown-item-destructive': variant === 'destructive',
        'custom-dropdown-item-inset': inset
      }
    ]"
  >
    <slot />
  </DropdownMenuItem>
</template>

<style scoped>
.custom-dropdown-item {
  position: relative;
  display: flex;
  width: 100%;
  cursor: pointer;
  user-select: none;
  align-items: center;
  gap: 8px;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 20px;
  outline: none;
  background-color: white;
  color: #374151;
  border: none;
  min-height: 36px;
  box-sizing: border-box;
  transition: all 0.15s ease;
}

.custom-dropdown-item:hover {
  background-color: #f9fafb !important;
  color: #111827 !important;
}

.custom-dropdown-item:focus {
  background-color: #f3f4f6 !important;
  color: #111827 !important;
}

.custom-dropdown-item-destructive {
  color: #dc2626 !important;
}

.custom-dropdown-item-destructive:hover {
  background-color: #fef2f2 !important;
  color: #dc2626 !important;
}

.custom-dropdown-item-destructive:focus {
  background-color: #fee2e2 !important;
  color: #dc2626 !important;
}

.custom-dropdown-item-inset {
  padding-left: 32px;
}

.custom-dropdown-item[data-disabled] {
  pointer-events: none;
  opacity: 0.5;
}

/* Asegurar que los iconos se vean correctamente */
.custom-dropdown-item :deep(svg) {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  pointer-events: none;
}
</style>
