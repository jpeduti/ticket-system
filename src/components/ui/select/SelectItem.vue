<script setup>
import { reactiveOmit } from "@vueuse/core";
import { Check } from "lucide-vue-next";
import {
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  useForwardProps,
} from "reka-ui";
import { cn } from "@/lib/utils";

const props = defineProps({
  value: { type: null, required: true },
  disabled: { type: Boolean, required: false },
  textValue: { type: String, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
  class: { type: null, required: false },
});

const delegatedProps = reactiveOmit(props, "class");
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectItem
    v-bind="forwardedProps"
    class="custom-select-item"
  >
    <div class="select-item-content">
      <SelectItemText class="select-item-text">
        <slot />
      </SelectItemText>
      
      <SelectItemIndicator class="select-item-check">
        <Check class="h-4 w-4" />
      </SelectItemIndicator>
    </div>
  </SelectItem>
</template>

<style scoped>
.custom-select-item {
  position: relative;
  display: block;
  width: 100%;
  cursor: pointer;
  user-select: none;
  border-radius: 4px;
  padding: 12px 32px 12px 12px;
  font-size: 14px;
  line-height: 20px;
  outline: none;
  background-color: white;
  color: #1f2937;
  border: none;
  min-height: 44px;
  box-sizing: border-box;
}

.custom-select-item:hover {
  background-color: #f3f4f6 !important;
  color: #1f2937 !important;
}

.custom-select-item:focus {
  background-color: #e5e7eb !important;
  color: #1f2937 !important;
}

.custom-select-item[data-state="checked"] {
  background-color: #dbeafe !important;
  color: #1e40af !important;
}

.custom-select-item[data-disabled] {
  pointer-events: none;
  opacity: 0.5;
}

.select-item-content {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
  min-height: 20px;
}

.select-item-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 400;
  line-height: 20px;
}

.select-item-check {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: #059669;
}
</style>
