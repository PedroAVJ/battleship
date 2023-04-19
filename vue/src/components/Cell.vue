<!-- Cell.vue -->
<template>
  <div :class="cellClass"
  @dragenter="dragEnter"
  @dragleave="dragLeave"
  @dragover.prevent
  @drop="drop"
  ></div>
</template>

<script setup lang="ts">
import { Tile } from '@/types/store';
import { ref } from 'vue';
import { useStore } from '@/store';

// SVG imports
import Miss from './Miss.vue';
import Hit from './Hit.vue';
import Uncovered from './Uncovered.vue';
import Submarine from './Submarine.vue';
import SupplyBoat from './SupplyBoat.vue';
import Destroyer from './Destroyer.vue';
import Battleship from './Battleship.vue';
import Frigate from './Frigate.vue';
import AircraftCarrier from './AircraftCarrier.vue';


interface CellProps {
  tile: Tile;
  row: number;
  col: number;
}

const props = defineProps<CellProps>();

const cellClass = ref([
  'cell',
  props.tile === Tile.WATER ? 'water' : 'land',
]);

const dragEnter = (e: DragEvent) => {
  const target = e.target as HTMLElement;
  target.classList.add('darken');
};

const dragLeave = (e: DragEvent) => {
  const target = e.target as HTMLElement;
  target.classList.remove('darken');
};

const drop = (e: DragEvent) => {
  const target = e.target as HTMLElement;
  target.classList.remove('darken');
  
  // Read the data using the correct keys
  const shipType = e.dataTransfer?.getData('shipType');
  const orientation = e.dataTransfer?.getData('orientation');
  
  console.log(shipType, orientation);
  console.log('drop');
};
</script>

<style scoped>
.cell {
  width: 100%;
  height: 100%;
  border: 1px solid #2c3e50;
  position: relative;
}

.water {
  background-color: #34495e;
}

.land {
  background-color: #2ecc71;
}

.water.darken {
  background-color: #2c3e50;
}

.land.darken {
  background-color: #27ae60;
}

.svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  z-index: 1;

  /* Higher z-index means it will be on top of other elements */
  /* Use transform to manipulate the SVG's position, size, and orientation */
}
</style>
