<template>
  <div :id="name" class="ship-item">
    <h2 class="text">
      {{ name }}
    </h2>
    <div class="svg-container" draggable="true" @dragstart="dragStart">

      <!-- This is where the SVG is inserted from the parent component -->
      <slot></slot>

    </div>
    <div class="bottom-wrapper">
      <div class="controls">
        <!-- Size of the ship -->
        <span class="text">
          Size: {{ SHIPS[props.name].length }} x {{ SHIPS[props.name].width }}
        </span>
        <button :class="['toggle-button', orientation]" @click="toggleOrientation">
          {{ orientation }}
        </button>
        <span class="text">
          Count: x{{ guiCount }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import ShipName from '@/types/ShipName';
import Orientation from '@/types/Orientation';
import SHIPS from '@/constants/Ships';
import Ship from '@/types/Ship';
import { useStore } from '@/store';


interface ShipItemProps {
  name: ShipName,
  guiCount: number,
}

const props = defineProps<ShipItemProps>();
const store = useStore();

const orientation = ref<Orientation>(Orientation.HORIZONTAL);

function dragStart(e: DragEvent) {
  if (!(e.target instanceof HTMLElement)) return;

  const ship = new Ship(props.name, orientation.value);
  store.setCurrentlyDraggedShip(ship);
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
.ship-item {
  background-color: #3c6e8f;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  width: 150px;
  padding: 15px;
  border: 2px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.bottom-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  font-size: 1.6rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.svg-container {
  width: 100px;
  height: 100px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toggle-button {
  border: none;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 18px;
  margin: 2px;
  cursor: pointer;
  transition: background-color 0.3s;
  color: #e0e0e0;
  padding: 5px 10px;
  border-radius: 5px;
}

.toggle-button.horizontal {
  background-color: #007bff;
}

.toggle-button.vertical {
  background-color: #ff3b30;
}

.toggle-button:hover {
  opacity: 0.8;
}

.text {
  color: #e0e0e0;
  display: inline-block;
  padding: 5px 10px;
  border-radius: 5px;
}
</style>