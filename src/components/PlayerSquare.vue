<template>
  <div
    :class="background"

    @dragenter="dragEnter"
    @dragleave="dragLeave"
    @dragover.prevent
    @drop="drop"
  >
    <Sprite :tile="tile" :isPlayerSquare="true" />
  </div>
</template>

<script setup lang="ts">
import { ShipName, Orientation, Mutation } from '@/store/enums';
import { Tile } from '@/store/interfaces';
import { isInvalidShipPlacement, placeShip } from '@/utils/shipUtils';
import { useStore } from '@/store';
import Sprite from '@/components/Sprite.vue';
import { computed } from 'vue';


interface SquareProps {
  tile: Tile;
  row: number;
  col: number;
}

const props = defineProps<SquareProps>();
const store = useStore();

const background = computed(() => {
  if (props.tile.background.isWater) return 'water';
  if (props.tile.background.isLand) return 'land';
  if (props.tile.background.isOutOfBounds) return 'out-of-bounds';
});

function dragEnter(e: DragEvent) {
  if (!(e.target instanceof HTMLElement)) return;
  e.target.classList.add('darken');
}

function dragLeave(e: DragEvent) {
  if (!(e.target instanceof HTMLElement)) return;
  e.target.classList.remove('darken');
}

function drop(e: DragEvent) {
  if (!(e.target instanceof HTMLElement)) return;
  e.target.classList.remove('darken');
  
  const shipName = e.dataTransfer?.getData('shipName');
  const shipOrientation = e.dataTransfer?.getData('orientation');

  if (!shipName || !shipOrientation) return;
  if (!isOrientation(shipOrientation)) return;
  if (!isShipName(shipName)) return;
  if (isInvalidShipPlacement(shipName, shipOrientation, props.row, props.col, store.state.player.board)) return;

  // Here 'player' refers to what board the ship is being placed on
  placeShip(store, shipName, shipOrientation, props.row, props.col, 'player');

  // Reduce the count of the ship in the GUI
  if (shipName === ShipName.SUBMARINE) {
    store.commit(Mutation.SET_GUI_SUBMARINE_COUNT, store.state.gui.submarineCount - 1);
  } else if (shipName === ShipName.AIRCRAFT_CARRIER) {
    store.commit(Mutation.SET_GUI_AIRCRAFT_CARRIER_COUNT, store.state.gui.aircraftCarrierCount - 1);
  } else if (shipName === ShipName.DESTROYER) {
    store.commit(Mutation.SET_GUI_DESTROYER_COUNT, store.state.gui.destroyerCount - 1);
  } else if (shipName === ShipName.FRIGATE) {
    store.commit(Mutation.SET_GUI_FRIGATE_COUNT, store.state.gui.frigateCount - 1);
  } else if (shipName === ShipName.SUPPLY_BOAT) {
    store.commit(Mutation.SET_GUI_SUPPLY_BOAT_COUNT, store.state.gui.supplyBoatCount - 1);
  } else if (shipName === ShipName.BATTLESHIP) {
    store.commit(Mutation.SET_GUI_BATTLESHIP_COUNT, store.state.gui.battleshipCount - 1);
  }
};

// Type guards only work on functions, otherwise TS won't infer the type
function isOrientation(input: string): input is Orientation {
  return Object.values(Orientation).includes(input as Orientation);
}

// Type guards only work on functions, otherwise TS won't infer the type
function isShipName(input: string): input is ShipName {
  return Object.values(ShipName).includes(input as ShipName);
}
</script>

<style scoped>
.water {
  width: 100%;
  height: 100%;
  border: 1px solid #2c3e50;
  position: relative;
  background-color: #34495e;
}

.land {
  width: 100%;
  height: 100%;
  border: 1px solid #2c3e50;
  position: relative;
  background-color: #2ecc71;
}

.out-of-bounds {
  width: 100%;
  height: 100%;
  border: 1px solid #2c3e50;
  position: relative;
  background-color: #ffffff;
}

.water.darken {
  background-color: #2c3e50;
}

.land.darken {
  background-color: #27ae60;
}

.out-of-bounds.darken {
  background-color: #ffffff;
}
</style>
