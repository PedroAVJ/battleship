<!-- Cell.vue -->
<template>
  <div :class="cellClass"
  @dragenter="dragEnter"
  @dragleave="dragLeave"
  @dragover.prevent
  @drop="drop"
  >
   <!-- HIT goes first, as the tile could have a hit, and a ship at the same time -->
   <Hit v-if="cell === Tile.HIT" />
   <Miss v-if="cell === Tile.MISS" />
   <Uncovered v-if="cell === Tile.UNCOVERED_SHIP" />

   <!-- If the cell is an object, it's a ship -->
   <div v-if="typeof cell === 'object'">
     <Submarine v-if="cell.type === ShipType.SUBMARINE" />
     <SupplyBoat v-if="cell.type === ShipType.SUPPLY_BOAT" />
     <Destroyer v-if="cell.type === ShipType.DESTROYER" />
     <Battleship v-if="cell.type === ShipType.BATTLESHIP" />
     <Frigate v-if="cell.type === ShipType.FRIGATE" />
     <AircraftCarrier v-if="cell.type === ShipType.AIRCRAFT_CARRIER" />
   </div>
  </div>
</template>

<script setup lang="ts">
import { Tile, ShipType, Ship } from '@/types/store';
import { ref } from 'vue';
import { useStore } from '@/store';
import { Orientation } from '@/types/store';

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
  tile: (Tile | Ship)
  row: number;
  col: number;
}

const props = defineProps<CellProps>();
const store = useStore();

const cell = ref(store.state.playerBoard[props.row][props.col]);

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
  
  // Set the ship on the board
  const board = store.state.playerBoard;
  board[props.row][props.col] = {

    // Hacky way to get around the fact that shipType is a string
    type: shipType as ShipType,
    orientation: orientation === Orientation.HORIZONTAL ? Orientation.HORIZONTAL : Orientation.VERTICAL,
  };
  store.commit('setPlayerBoard', board);

  // Decrement the count on the GUI
  if (shipType === ShipType.SUBMARINE) {
    store.commit('setGuiSubmarineCount', store.state.guiSubmarineCount - 1);
  } else if (shipType === ShipType.AIRCRAFT_CARRIER) {
    store.commit('setGuiAircraftCarrierCount', store.state.guiAircraftCarrierCount - 1);
  } else if (shipType === ShipType.DESTROYER) {
    store.commit('setGuiDestroyerCount', store.state.guiDestroyerCount - 1);
  } else if (shipType === ShipType.FRIGATE) {
    store.commit('setGuiFrigateCount', store.state.guiFrigateCount - 1);
  } else if (shipType === ShipType.SUPPLY_BOAT) {
    store.commit('setGuiSupplyBoatCount', store.state.guiSupplyBoatCount - 1);
  } else if (shipType === ShipType.BATTLESHIP) {
    store.commit('setGuiBattleshipCount', store.state.guiBattleshipCount - 1);
  }
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
