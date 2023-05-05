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
import Tile from '@/types/Tile';
import { useStore } from '@/store';
import Sprite from '@/components/Sprite.vue';
import { computed } from 'vue';
import Ship from '@/types/Ship';
import ShipName from '@/types/ShipName';


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
  
  // Get the ship name and orientation from the global state
  const shipName = store.currentlyDraggedShip?.name;
  const shipOrientation = store.currentlyDraggedShip?.orientation;

  // If the data is invalid, return
  if (!shipName || !shipOrientation) return;
  
  // If the ship placement is invalid, return
  const ship = new Ship(shipName, shipOrientation);
  if (store.player.board.isInvalidShipPlacement(ship, props.row, props.col)) return;
  
  // Set the ship preview and add the darken class
  store.player.board.tiles[props.row][props.col].contains.previewSprite = true;
  e.target.classList.add('darken');

}

function dragLeave(e: DragEvent) {
  if (!(e.target instanceof HTMLElement)) return;
  
  // Get the ship name and orientation from the global state
  const shipName = store.currentlyDraggedShip?.name;
  const shipOrientation = store.currentlyDraggedShip?.orientation;
  
  // If the data is invalid, return
  if (!shipName || !shipOrientation) return;
  
  // If the ship placement is invalid, return
  const ship = new Ship(shipName, shipOrientation);
  if (store.player.board.isInvalidShipPlacement(ship, props.row, props.col)) return;
  
  // Remove the ship preview and the darken class
  store.player.board.tiles[props.row][props.col].contains.previewSprite = false;
  e.target.classList.remove('darken');

}

function drop(e: DragEvent) {
  if (!(e.target instanceof HTMLElement)) return;

  // Get the ship name and orientation from the global state
  const shipName = store.currentlyDraggedShip?.name;
  const shipOrientation = store.currentlyDraggedShip?.orientation;
  
  // If the data is invalid, return
  if (!shipName || !shipOrientation) return;
  
  // If the ship placement is invalid, return
  const ship = new Ship(shipName, shipOrientation);
  if (store.player.board.isInvalidShipPlacement(ship, props.row, props.col)) return;

  store.player.board.placeShip(ship, props.row, props.col);

  // Reduce the count of the ship in the GUI
  if (shipName === ShipName.SUBMARINE) {
    store.setGuiSubmarineCount(store.gui.submarineCount - 1)
  } else if (shipName === ShipName.SUPPLY_BOAT) {
    store.setGuiSupplyBoatCount(store.gui.supplyBoatCount - 1)
  } else if (shipName === ShipName.DESTROYER) {
    store.setGuiDestroyerCount(store.gui.destroyerCount - 1)
  } else if (shipName === ShipName.BATTLESHIP) {
    store.setGuiBattleshipCount(store.gui.battleshipCount - 1)
  } else if (shipName === ShipName.FRIGATE) {
    store.setGuiFrigateCount(store.gui.frigateCount - 1)
  } else if (shipName === ShipName.AIRCRAFT_CARRIER) {
    store.setGuiAircraftCarrierCount(store.gui.aircraftCarrierCount - 1)
  }

};
</script>

<style scoped>
.water {
  width: 100%;
  height: 100%;
  border: 1px solid #2c3e50;
  position: relative;
  background-color: #4a6a85;
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
  position: relative;
  background-color: #3c6e8f;
}

.water.darken {
  background-color: #2c3e50;
}
</style>
