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
import { ShipName, Orientation, Mutation } from '../store/enums';
import { Tile } from '../store/interfaces';
import { SHIP_DIMENSIONS } from '../store/constants';
import { useStore } from '../store';
import Sprite from './Sprite.vue';
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
  const target = e.target as HTMLElement;
  target.classList.add('darken');
}

function dragLeave(e: DragEvent) {
  const target = e.target as HTMLElement;
  target.classList.remove('darken');
}

function drop(e: DragEvent) {
  const target = e.target as HTMLElement;
  target.classList.remove('darken');
  
  const shipName = e.dataTransfer?.getData('shipName');
  const shipOrientation = e.dataTransfer?.getData('orientation');

  if (!shipName || !shipOrientation) return;
  if (!isOrientation(shipOrientation)) return;
  if (!isShipName(shipName)) return;
  if (isInvalidMove(shipName, shipOrientation)) return;

  // If it passes all the checks, place the ship
  placeShip(shipName, shipOrientation);

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

function isInvalidMove(shipName: ShipName, shipOrientation: Orientation): boolean {
  const shipHitboxes = getShipHitboxes(shipName, shipOrientation);
  const board = store.state.player.board;

  for (const hitbox of shipHitboxes) {
    const row = hitbox.row;
    const col = hitbox.col;

    // Row and column beyond the board check
    if (row < 0 || row >= board.length) return true;
    if (col < 0 || col >= board[0].length) return true;

    // Land and out of bounds check
    if (board[row][col].background.isLand) return true;
    if (board[row][col].background.isOutOfBounds) return true;

    // Ship hitbox check
    if (board[row][col].ship) return true;

    return false;
  }

  return false;
}

function getShipHitboxes(shipName: ShipName, shipOrientation: Orientation): { row: number, col: number }[] {
  const length = SHIP_DIMENSIONS[shipName].length;
  const width = SHIP_DIMENSIONS[shipName].width;
  const shipHitboxes: { row: number, col: number }[] = [];

  // The coordinates marked by row and col are the top left corner of the ship
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < width; j++) {

      // If the ship is horizontal, i represents the column and j represents the row
      // This is because the length moves horizontally and the width moves vertically
      // X X X X X
      // X X X X X
      if (shipOrientation === Orientation.HORIZONTAL) {
        shipHitboxes.push({
          row: props.row + j,
          col: props.col + i,
        });
      }

      // If the ship is vertical, i represents the row and j represents the column
      // This is because the length moves vertically and the width moves horizontally
      // X X
      // X X
      // X X
      // X X
      if (shipOrientation === Orientation.VERTICAL) {
        shipHitboxes.push({
          row: props.row + i,
          col: props.col + j,
        });
      }
    }
  }

  return shipHitboxes;
}

function placeShip(shipName: ShipName, shipOrientation: Orientation) {
  const shipHitboxes = getShipHitboxes(shipName, shipOrientation);
  const board = store.state.player.board;

  for (const hitbox of shipHitboxes) {
    const row = hitbox.row;
    const col = hitbox.col;

    const tile: Tile = {
      ...board[row][col],
      ship: {
        name: shipName,
      },
    };

    // If this is the first tile, set the ship orientation
    // This is because the ship orientation defines were we start drawing the ship sprite
    if (row === props.row && col === props.col && tile.ship) {
      tile.ship.orientation = shipOrientation;
    }

    store.commit(Mutation.SET_PLAYER_TILE, {
      row: row,
      col: col,
      tile: tile,
    });
  }
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
