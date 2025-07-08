<script setup>
import { reactiveOmit } from "@vueuse/core";
import { X } from "lucide-vue-next";
import {
  DialogClose,
  DialogContent,
  DialogPortal,
  useForwardPropsEmits,
} from "reka-ui";
import { cn } from "@/lib/utils";
import DialogOverlay from "./DialogOverlay.vue";

const props = defineProps({
  forceMount: { type: Boolean, required: false },
  disableOutsidePointerEvents: { type: Boolean, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
  class: { type: null, required: false },
});
const emits = defineEmits([
  "escapeKeyDown",
  "pointerDownOutside",
  "focusOutside",
  "interactOutside",
  "openAutoFocus",
  "closeAutoFocus",
]);

const delegatedProps = reactiveOmit(props, "class");

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <DialogPortal>
    <DialogOverlay />
    <DialogContent
      v-bind="forwarded"
      class="custom-dialog-content"
      :class="props.class"
    >
      <slot />

      <DialogClose class="custom-dialog-close">
        <X class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>

<style scoped>
.custom-dialog-content {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 10000;
  display: grid;
  width: 100%;
  max-width: calc(100% - 2rem);
  transform: translate(-50%, -50%);
  gap: 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background-color: white;
  color: #111827;
  padding: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation-duration: 200ms;
  animation-timing-function: ease-out;
}

@media (min-width: 640px) {
  .custom-dialog-content {
    max-width: 32rem;
  }
}

.custom-dialog-content[data-state="open"] {
  animation-name: dialogOpen;
}

.custom-dialog-content[data-state="closed"] {
  animation-name: dialogClose;
}

.custom-dialog-close {
  position: absolute;
  top: 16px;
  right: 16px;
  border-radius: 4px;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #6b7280;
}

.custom-dialog-close:hover {
  opacity: 1;
  background-color: #f9fafb;
}

.custom-dialog-close:focus {
  opacity: 1;
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

@keyframes dialogOpen {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes dialogClose {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
}
</style>
