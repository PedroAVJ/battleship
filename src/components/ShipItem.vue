<template>
  <div :id="shipName" class="secondary-background" v-if="store.player[shipName].guiCount > 0">
    <h2 class="secondary-text">
      {{ shipName }}
    </h2>
    <div ref='svgContainer' class="svg-container" draggable="true" @dragstart="dragStart" @touchstart="touchStart" @touchend="touchEnd">

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
import { ref, watch } from 'vue';
import { useStore } from '@/store';
import { ShipName, Orientation } from '@/utils/Enums';
import { SHIPS } from '@/utils/Constants';


const props = defineProps<{
  shipName: ShipName,
}>();
const store = useStore();

const orientation = ref<Orientation>(Orientation.HORIZONTAL);
const svgContainer = ref<HTMLElement | null>(null);

watch(() => store.currentlyDraggedShip?.name, (newVal) => {
  if (newVal === props.shipName) {
    svgContainer.value?.classList.add('selected');
  } else {
    svgContainer.value?.classList.remove('selected');
  }
});

function dragStart(e: DragEvent) {
  if (!(e.target instanceof HTMLElement)) return;
  store.setCurrentlyDraggedShip(props.shipName, orientation.value);
}

function touchStart(e: TouchEvent) {
  if (!(e.target instanceof HTMLElement)) return;
  store.setCurrentlyDraggedShip(props.shipName, orientation.value);
}

function touchEnd(e: TouchEvent) {
  if (!(e.target instanceof HTMLElement)) return;

  // Reset the ship's position style
  e.target.style.position = '';
  e.target.style.left = '';
  e.target.style.top = '';
  e.target.style.zIndex = '';
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

.selected {
  border: 2px solid green;
}
</style>