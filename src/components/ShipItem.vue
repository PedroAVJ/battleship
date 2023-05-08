<template>
  <div :id="shipName" class="secondary-background" v-if="store.player[shipName].guiCount > 0">
    <h2 class="secondary-text">
      {{ shipName }}
    </h2>
    <div class="svg-container" draggable="true" @dragstart="dragStart">

      <!-- This is where the SVG is inserted from the parent component -->
      <slot></slot>

    </div>
    <span class="secondary-text">
      Size: {{ SHIPS[props.shipName].length }} x {{ SHIPS[props.shipName].width }}
    </span>
    <button :class="['primary-button', orientation]" @click="toggleOrientation">
      {{ orientation }}
    </button>
    <span class="secondary-text">
      Count: x{{ store.player[shipName].guiCount }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import ShipName from '@/types/ShipName';
import Orientation from '@/types/Orientation';
import SHIPS from '@/utils/Ships';
import { useStore } from '@/store';


const props = defineProps<{
  shipName: ShipName,
}>();
const store = useStore();

const orientation = ref<Orientation>(Orientation.HORIZONTAL);

function dragStart(e: DragEvent) {
  if (!(e.target instanceof HTMLElement)) return;
  store.setCurrentlyDraggedShip(props.shipName, orientation.value);
}

function toggleOrientation() {
  if (orientation.value === Orientation.HORIZONTAL) {
    orientation.value = Orientation.VERTICAL;
  } else {
    orientation.value = Orientation.HORIZONTAL;
  }
}
</script>

<style scoped>
.svg-container {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.primary-button.Horizontal {
  background-color: #007bff;
}

.primary-button.Vertical {
  background-color: #ff3b30;
}
</style>