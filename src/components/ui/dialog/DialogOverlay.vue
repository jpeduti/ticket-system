<script setup>
import { reactiveOmit } from "@vueuse/core";
import { DialogOverlay } from "reka-ui";
import { cn } from "@/lib/utils";

const props = defineProps({
  forceMount: { type: Boolean, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
  class: { type: null, required: false },
});

const delegatedProps = reactiveOmit(props, "class");
</script>

<template>
  <DialogOverlay
    v-bind="delegatedProps"
    class="custom-dialog-overlay"
    :class="props.class"
  >
    <slot />
  </DialogOverlay>
</template>

<style scoped>
.custom-dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.8);
  animation-duration: 200ms;
  animation-timing-function: ease-out;
}

.custom-dialog-overlay[data-state="open"] {
  animation-name: overlayOpen;
}

.custom-dialog-overlay[data-state="closed"] {
  animation-name: overlayClose;
}

@keyframes overlayOpen {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes overlayClose {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
