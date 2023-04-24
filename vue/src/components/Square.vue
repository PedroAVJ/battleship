<template>
  <div
    :class="['cell', tile.background.isWater ? 'water' : 'land']"

    @dragenter="dragEnter"
    @dragleave="dragLeave"
    @dragover.prevent
    @drop="drop"

    @click="click"
  >
    <Sprite :tile="tile" />
  </div>
</template>

<script setup lang="ts">
import { ShipName, Tile, Orientation, SHIP_LENGTHS } from '@/types/store.interface';
import { useStore } from '@/store';
import Sprite from './Sprite.vue';


interface CellProps {
  isPlayerBoard: boolean;
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
  if (!props.isPlayerBoard) return;

  const target = e.target as HTMLElement;
  target.classList.remove('darken');
  
  const shipName = e.dataTransfer?.getData('shipName');
  const shipOrientation = e.dataTransfer?.getData('orientation');

  if (!shipName || !shipOrientation) return;
  if (!isOrientation(shipOrientation)) return;
  if (!isShipName(shipName)) return;
  if (isInvalidMove(shipName, shipOrientation)) return;

  const new_board = JSON.parse(JSON.stringify(store.state.player.board)) as Tile[][];
  const shipHitboxes = getShipHitboxes(shipName, shipOrientation, props.row, props.col);
  for (const hitbox of shipHitboxes) {
    const row = hitbox.row;
    const col = hitbox.col;
    new_board[row][col].contains.shipHitbox = true;
  }
  const new_ship = {
    name: shipName,
    length: SHIP_LENGTHS[shipName],
    health: SHIP_LENGTHS[shipName],
    orientation: shipOrientation,
  };
  new_board[props.row][props.col].ship = new_ship;
  store.commit('setPlayerBoard', new_board);

  if (shipName === ShipName.SUBMARINE) {
    store.commit('setGuiSubmarineCount', store.state.gui.submarineCount - 1);
  } else if (shipName === ShipName.AIRCRAFT_CARRIER) {
    store.commit('setGuiAircraftCarrierCount', store.state.gui.aircraftCarrierCount - 1);
  } else if (shipName === ShipName.DESTROYER) {
    store.commit('setGuiDestroyerCount', store.state.gui.destroyerCount - 1);
  } else if (shipName === ShipName.FRIGATE) {
    store.commit('setGuiFrigateCount', store.state.gui.frigateCount - 1);
  } else if (shipName === ShipName.SUPPLY_BOAT) {
    store.commit('setGuiSupplyBoatCount', store.state.gui.supplyBoatCount - 1);
  } else if (shipName === ShipName.BATTLESHIP) {
    store.commit('setGuiBattleshipCount', store.state.gui.battleshipCount - 1);
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
  if (board[row][col].contains.shipHitbox) return true;
  if (board[row][col].contains.missedShot) return true;
  if (board[row][col].contains.successfulShot) return true;

  return false;
}

function getShipHitboxes(shipName: ShipName, shipOrientation: Orientation, row_origin: number, col_origin: number): { row: number, col: number }[] {
  const shipLength = SHIP_LENGTHS[shipName];
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

function click() {
  if (props.isPlayerBoard) return;
  if (!store.state.game.isInProgress) return;
  if (!store.state.game.isPlayersTurn) return;
  if (isInvalidSquare(store.state.enemy.board, props.row, props.col)) return;

  store.commit('setGameIsPlayersTurn', false);

  const uncovered_tiles = [];
  if (store.state.player.isUsingAircraftCarrierAbility) {
    uncovered_tiles.push(...getAircraftCarrierTiles());
  } else if (store.state.player.isUsingSubmarineAbility) {
    uncovered_tiles.push(...getSubmarineTiles());
  }

  const player_board = JSON.parse(JSON.stringify(store.state.player.board));

  fetch('http://localhost:8000/api/make_move/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      game_id: store.state.game.id,
      row: props.row,
      col: props.col,
      move_is_submarine_ability: store.state.player.isUsingSubmarineAbility,
      move_is_aircraft_carrier_ability: store.state.player.isUsingAircraftCarrierAbility,
      uncovered_tiles: uncovered_tiles,
    })
  })
  .then(response => response.json())
  .then(data => {
    const board = store.state.enemy.board;
    for (const result of data.results_from_player_move) {
      if (result.action === 'successfulShot') {
        board[result.row][result.col].contains.successfulShot = true;
      } else if (result.action === 'missedShot') {
        board[result.row][result.col].contains.missedShot = true;
      } else if (result.action === 'uncoveredShip') {
        board[result.row][result.col].contains.uncoveredShip = true;
      }
    }
  });

  if (store.state.player.isUsingAircraftCarrierAbility) {
    store.commit('setPlayerIsUsingAircraftCarrierAbility', false);
    store.commit('setPlayerHasUsedAircraftCarrierAbility', true);
  } else if (store.state.player.isUsingSubmarineAbility) {
    store.commit('setPlayerIsUsingSubmarineAbility', false);
    store.commit('setPlayerHasUsedSubmarineAbility', true);
  }
}

function getAircraftCarrierTiles(): { row: number, col: number }[] {
  for (let row = 0; row < store.state.player.board.length; row++) {
    for (let col = 0; col < store.state.player.board[0].length; col++) {
      if (store.state.player.board[row][col].ship?.name === ShipName.AIRCRAFT_CARRIER) {
        const orientation = store.state.player.board[row][col].ship?.orientation;
        if (orientation === undefined) continue;
        return getShipHitboxes(ShipName.AIRCRAFT_CARRIER, orientation, row, col);
      }
    }
  }

  return [];
}

function getSubmarineTiles(): { row: number, col: number }[] {
  const tiles: { row: number, col: number }[] = [];

  for (let row = 0; row < store.state.player.board.length; row++) {
    for (let col = 0; col < store.state.player.board[0].length; col++) {
      if (store.state.player.board[row][col].ship?.name === ShipName.SUBMARINE) {
        const orientation = store.state.player.board[row][col].ship?.orientation;
        if (orientation === undefined) continue;
        tiles.push(...getShipHitboxes(ShipName.SUBMARINE, orientation, row, col));
      }
    }
  }

  return tiles;
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
