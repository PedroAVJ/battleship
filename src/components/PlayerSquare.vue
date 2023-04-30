<template>
  <div
    :class="['cell', tile.background.isWater ? 'water' : 'land']"

    @dragenter="dragEnter"
    @dragleave="dragLeave"
    @dragover.prevent
    @drop="drop"
  >
    <Sprite :tile="tile" :isPlayerBoard="true" />
  </div>
</template>

<script setup lang="ts">
import { ShipName, Tile, Orientation, SHIP_DIMENSIONS, MutationType } from '@/types/store.interface';
import { useStore } from '@/store';
import Sprite from './Sprite.vue';


interface CellProps {
  tile: Tile;
  row: number;
  col: number;
}

const props = defineProps<CellProps>();
const store = useStore();

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

  const new_board = JSON.parse(JSON.stringify(store.state.player.board)) as Tile[][]; // Deep copy of the board
  const shipHitboxes = getShipHitboxes(shipName, shipOrientation, props.row, props.col);
  for (const hitbox of shipHitboxes) {
    const row = hitbox.row;
    const col = hitbox.col;
    new_board[row][col].ship = {
      name: shipName,

      // This defines the origin of where the ship sprite will be drawn
      orientation: props.row === row && props.col === col ? shipOrientation : undefined,
    };
  }
  store.commit(MutationType.SET_PLAYER_BOARD, new_board);

  if (shipName === ShipName.SUBMARINE) {
    store.commit(MutationType.SET_GUI_SUBMARINE_COUNT, store.state.gui.submarineCount - 1);
  } else if (shipName === ShipName.AIRCRAFT_CARRIER) {
    store.commit(MutationType.SET_GUI_AIRCRAFT_CARRIER_COUNT, store.state.gui.aircraftCarrierCount - 1);
  } else if (shipName === ShipName.DESTROYER) {
    store.commit(MutationType.SET_GUI_DESTROYER_COUNT, store.state.gui.destroyerCount - 1);
  } else if (shipName === ShipName.FRIGATE) {
    store.commit(MutationType.SET_GUI_FRIGATE_COUNT, store.state.gui.frigateCount - 1);
  } else if (shipName === ShipName.SUPPLY_BOAT) {
    store.commit(MutationType.SET_GUI_SUPPLY_BOAT_COUNT, store.state.gui.supplyBoatCount - 1);
  } else if (shipName === ShipName.BATTLESHIP) {
    store.commit(MutationType.SET_GUI_BATTLESHIP_COUNT, store.state.gui.battleshipCount - 1);
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
  const shipHitboxes = getShipHitboxes(shipName, shipOrientation, props.row, props.col);
  const board = store.state.player.board;

  for (const hitbox of shipHitboxes) {
    const row = hitbox.row;
    const col = hitbox.col;

    if (isInvalidSquare(board, row, col)) return true;
  }

  return false;
}

function isInvalidSquare(board: Tile[][], row: number, col: number): boolean {

  // Out of bounds check
  if (row < 0 || row >= board.length) return true;
  if (col < 0 || col >= board[0].length) return true;

  if (board[row][col].background.isLand) return true;
  if (board[row][col].contains.missedShot) return true;
  if (board[row][col].contains.successfulShot) return true;

  // Ship hitbox check
  if (board[row][col].ship) return true;

  return false;
}

function getShipHitboxes(shipName: ShipName, shipOrientation: Orientation, row_origin: number, col_origin: number): { row: number, col: number }[] {
  const shipLength = SHIP_DIMENSIONS[shipName].length;
  const shipHitboxes: { row: number, col: number }[] = [];

  if (shipOrientation === Orientation.HORIZONTAL) {
    for (let col = 0; col < shipLength; col++) {
      shipHitboxes.push({ row: row_origin, col: col_origin + col });

      // If it is an aircraft carrier, add the extra hitbox below
      if (shipName === ShipName.AIRCRAFT_CARRIER) {
        shipHitboxes.push({ row: row_origin + 1, col: col_origin + col });
      }
    }
  } else {
    for (let row = 0; row < shipLength; row++) {
      shipHitboxes.push({ row: row_origin + row, col: col_origin });

      // If it is an aircraft carrier, add the extra hitbox to the right
      if (shipName === ShipName.AIRCRAFT_CARRIER) {
        shipHitboxes.push({ row: row_origin + row, col: col_origin + 1 });
      }
    }
  }

  return shipHitboxes;
}
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
</style>
