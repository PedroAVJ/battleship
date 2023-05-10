<template>
  <div class="board-wrapper">
    <div v-for="(row, rowIndex) in store.player.board" :key="rowIndex" class="board-row">
      <div v-for="(col, colIndex) in row" :key="colIndex" class="board-cell">
        <div
          :class="getBackground(col)"

          @dragenter="dragEnter($event, rowIndex, colIndex)"
          @dragleave="dragLeave($event, rowIndex, colIndex)"
          @dragover.prevent
          @drop="drop($event, rowIndex, colIndex)"

          @touchstart="touchStart($event, rowIndex, colIndex)"
          @touchend="touchEnd($event, rowIndex, colIndex)"
        >
          <Sprite :tile="col" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Sprite from '@/components/Sprite.vue';
import { useStore } from '@/store';
import { Tile } from '@/utils/Interfaces';
import { isInvalidShipPlacement, placeShip } from '@/utils/Game.js';

const store = useStore();

let touchedElement: any = null;

function touchStart(e: TouchEvent, row: number, col: number) {
  touchedElement = e.target;
  dragEnter(e, row, col);
}

function touchEnd(e: TouchEvent, row: number, col: number) {
  if (touchedElement === e.target) {
    drop(e, row, col);
    touchedElement = null;
  }
}


function getBackground(tile: Tile) {
  if (tile.background.isWater) return 'water';
  if (tile.background.isLand) return 'land';
  if (tile.background.isOutOfBounds) return 'out-of-bounds';
}

function dragEnter(e: MouseEvent | TouchEvent, row: number, col: number) {
  if (!(e.target instanceof HTMLElement)) return;
  
  // Get the ship name and orientation from the global state
  const shipName = store.currentlyDraggedShip?.name;
  const shipOrientation = store.currentlyDraggedShip?.orientation;

  if (!shipName || !shipOrientation) return;
  const board = store.player.board;
  if (isInvalidShipPlacement(board, shipName, shipOrientation, row, col)) return;
  
  // Set the ship preview and add the darken class
  board[row][col].shipSprite = {
    name: shipName,
    orientation: shipOrientation,
    isPreview: true,
  }
  e.target.classList.add('darken');

}

function dragLeave(e: MouseEvent | TouchEvent, row: number, col: number) {
  if (!(e.target instanceof HTMLElement)) return;
  
  // Get the ship name and orientation from the global state
  const shipName = store.currentlyDraggedShip?.name;
  const shipOrientation = store.currentlyDraggedShip?.orientation;

  if (!shipName || !shipOrientation) return;
  const board = store.player.board;
  if (isInvalidShipPlacement(board, shipName, shipOrientation, row, col)) return;
  
  // Remove the ship preview and the darken class
  board[row][col].shipSprite = undefined;
  e.target.classList.remove('darken');

}

function drop(e: MouseEvent | TouchEvent, row: number, col: number) {
  if (!(e.target instanceof HTMLElement)) return;
  
  // Get the ship name and orientation from the global state
  const shipName = store.currentlyDraggedShip?.name;
  const shipOrientation = store.currentlyDraggedShip?.orientation;

  if (!shipName || !shipOrientation) return;
  const board = store.player.board;
  if (isInvalidShipPlacement(board, shipName, shipOrientation, row, col)) return;

  placeShip(board, shipName, shipOrientation, row, col);
  store.setPlayerShipGUICount(shipName, store.player[shipName].guiCount - 1);

  // Remove the darken class
  e.target.classList.remove('darken');

};
</script>

<style scoped>
.water.darken {
  background-color: #2c3e50;
}
</style>