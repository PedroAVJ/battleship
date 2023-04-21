<template>
  <div
    :class="['cell', tile.background.isWater ? 'water' : 'land']"

    @dragenter="dragEnter"
    @dragleave="dragLeave"
    @dragover.prevent
    @drop="drop"

    @click="click"
  >

    <Hit v-if="tile.contains.successfulShot" />
    <Miss v-if="tile.contains.missedShot" />
    <Uncovered v-if="tile.contains.uncoveredShip" />

    <div v-if="tile.ship !== undefined">
      <Submarine
        v-if="tile.ship.name === ShipName.SUBMARINE"
        :class="['submarine', tile.ship.orientation === Orientation.VERTICAL ? 'rotated' : '']"
      />
      <SupplyBoat
        v-if="tile.ship.name === ShipName.SUPPLY_BOAT"
        :class="['supply-boat', tile.ship.orientation === Orientation.VERTICAL ? 'rotated' : '']"
      />
      <Destroyer
        v-if="tile.ship.name === ShipName.DESTROYER"
        :class="['destroyer', tile.ship.orientation === Orientation.VERTICAL ? 'rotated' : '']"
      />
      <Battleship
        v-if="tile.ship.name === ShipName.BATTLESHIP"
        :class="['battleship', tile.ship.orientation === Orientation.VERTICAL ? 'rotated' : '']"
      />
      <Frigate
        v-if="tile.ship.name === ShipName.FRIGATE"
        :class="['frigate', tile.ship.orientation === Orientation.VERTICAL ? 'rotated' : '']"
      />
      <AircraftCarrier
        v-if="tile.ship.name === ShipName.AIRCRAFT_CARRIER"
        :class="['aircraft-carrier', tile.ship.orientation === Orientation.VERTICAL ? 'rotated' : '']"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ShipName, Tile, Orientation, SHIP_LENGTHS } from '@/types/store.interface';
import { useStore } from '@/store';

import Miss from '@/components/SVG\'s/Miss.vue'
import Hit from '@/components/SVG\'s/Hit.vue'
import Uncovered from '@/components/SVG\'s/Uncovered.vue'
import Submarine from '@/components/SVG\'s/Ships/Submarine.vue'
import SupplyBoat from '@/components/SVG\'s/Ships/SupplyBoat.vue'
import Destroyer from '@/components/SVG\'s/Ships/Destroyer.vue'
import Battleship from '@/components/SVG\'s/Ships/Battleship.vue'
import Frigate from '@/components/SVG\'s/Ships/Frigate.vue'
import AircraftCarrier from '@/components/SVG\'s/Ships/AircraftCarrier.vue'


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
  const shipHitboxes = getShipHitboxes(shipName, shipOrientation);
  for (const hitbox of shipHitboxes) {
    const row = hitbox.row;
    const col = hitbox.col;
    new_board[row][col].contains.shipHitbox = true;
  }
  const new_ship = {
    name: shipName,
    length: SHIP_LENGTHS[shipName],
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
  const shipHitboxes = getShipHitboxes(shipName, shipOrientation);
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

function getShipHitboxes(shipName: ShipName, shipOrientation: Orientation): { row: number, col: number }[] {
  const shipLength = SHIP_LENGTHS[shipName];
  const shipHitboxes: { row: number, col: number }[] = [];

  if (shipOrientation === Orientation.HORIZONTAL) {
    for (let col = 0; col < shipLength; col++) {
      shipHitboxes.push({ row: props.row, col: props.col + col });

      // If it is an aircraft carrier, add the extra hitbox below
      if (shipName === ShipName.AIRCRAFT_CARRIER) {
        shipHitboxes.push({ row: props.row + 1, col: props.col + col });
      }
    }
  } else {
    for (let row = 0; row < shipLength; row++) {
      shipHitboxes.push({ row: props.row + row, col: props.col });

      // If it is an aircraft carrier, add the extra hitbox to the right
      if (shipName === ShipName.AIRCRAFT_CARRIER) {
        shipHitboxes.push({ row: props.row + row, col: props.col + 1 });
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

  if (store.state.player.isUsingAircraftCarrierAbility) {
    store.commit('setPlayerIsUsingAircraftCarrierAbility', false);
    store.commit('setPlayerHasUsedAircraftCarrierAbility', true);
  } else if (store.state.player.isUsingSubmarineAbility) {
    store.commit('setPlayerIsUsingSubmarineAbility', false);
    store.commit('setPlayerHasUsedSubmarineAbility', true);
  } else {
    console.log('Attacking');
  }

  store.commit('setGameIsPlayersTurn', false);
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

.submarine {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  z-index: 1;
}

.supply-boat {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
  overflow: visible;
  z-index: 1;
  transform: scaleX(2);
}

.destroyer {
  position: absolute;
  top: 0;
  left: 0;
  width: 300%;
  height: 100%;
  overflow: visible;
  z-index: 1;
  transform: scaleX(3);
}

.battleship {
  position: absolute;
  top: 0;
  left: 0;
  width: 400%;
  height: 100%;
  overflow: visible;
  z-index: 1;
  transform: scaleX(4);
}

.frigate {
  position: absolute;
  top: 0;
  left: 0;
  width: 500%;
  height: 100%;
  overflow: visible;
  z-index: 1;
  transform: scaleX(5) scaleY(2)
}

.aircraft-carrier {
  position: absolute;
  top: 0;
  left: 0;
  width: 500%;
  height: 100%;
  overflow: visible;
  z-index: 1;
  transform: scaleX(4.5) scaleY(5) translate(-2.5%, 30%);
}

/* Transformations for rotated ships */
.submarine.rotated {
  transform: rotate(90deg);
}

.supply-boat.rotated {
  transform: rotate(90deg) scaleX(2) translate(14%, 50%);
}

.destroyer.rotated {
  transform: rotate(90deg) scaleX(3) translate(12%, 100%);
}

.battleship.rotated {
  transform: rotate(90deg) scaleX(4) translate(10%, 150%);
}

.frigate.rotated {
  transform: rotate(90deg) scaleX(5) scaleY(2) translate(8.5%, 100%);
}

.aircraft-carrier.rotated {
  transform: rotate(90deg) scaleX(4.5) scaleY(5) translate(6%, 50%);
}

</style>
