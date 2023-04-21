<template>
  <div :class="cellClass"
  @dragenter="dragEnter"
  @dragleave="dragLeave"
  @dragover.prevent
  @drop="drop"
  >
   <!-- Tiles -->
   <Hit v-if="cell.hit" />
   <Miss v-if="cell.miss" />
   <Uncovered v-if="cell.uncoveredShip" />

   <!-- Ships -->
   <div v-if="cell.ship !== undefined">
     <Submarine v-if="cell.ship_sprite?.type === ShipType.SUBMARINE" :class="['submarine', cell.ship_sprite?.orientation === Orientation.VERTICAL ? 'rotated' : '']" />
     <SupplyBoat v-if="cell.ship_sprite?.type === ShipType.SUPPLY_BOAT" :class="['supply-boat', cell.ship_sprite?.orientation === Orientation.VERTICAL ? 'rotated' : '']" />
     <Destroyer v-if="cell.ship_sprite?.type === ShipType.DESTROYER" :class="['destroyer', cell.ship_sprite?.orientation === Orientation.VERTICAL ? 'rotated' : '']" />
     <Battleship v-if="cell.ship_sprite?.type === ShipType.BATTLESHIP" :class="['battleship', cell.ship_sprite?.orientation === Orientation.VERTICAL ? 'rotated' : '']" />
     <Frigate v-if="cell.ship_sprite?.type === ShipType.FRIGATE" :class="['frigate', cell.ship_sprite?.orientation === Orientation.VERTICAL ? 'rotated' : '']" />
     <AircraftCarrier v-if="cell.ship_sprite?.type === ShipType.AIRCRAFT_CARRIER" :class="['aircraft-carrier', cell.ship_sprite?.orientation === Orientation.VERTICAL ? 'rotated' : '']" />
   </div>
  </div>
</template>

<script setup lang="ts">
import { ShipType, Cell, SHIP_TYPES } from '@/types/store.interface';
import { ref } from 'vue';
import { useStore } from '@/store';
import { Orientation } from '@/types/store.interface';

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
  cell: Cell;
  row: number;
  col: number;
}

const props = defineProps<CellProps>();
const store = useStore();

const board = ref(store.state.playerBoard);
const cell = ref(board.value[props.row][props.col]);

const cellClass = ref([
  'cell',
  props.cell.water ? 'water' : 'land',
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

  // If cell is land, don't drop
  if (props.cell.land) {
    console.log('land');
    return;
  }
  
  // Read the data using the correct keys
  const shipType = e.dataTransfer?.getData('shipType');
  const orientation = e.dataTransfer?.getData('orientation');

  // If shipType or orientation is undefined, don't drop
  if (shipType === undefined || orientation === undefined) {
    return;
  }

  // If orientation is not a valid orientation, don't drop
  if (orientation !== Orientation.HORIZONTAL && orientation !== Orientation.VERTICAL) {
    return;
  }

  // If shipType is not a valid shipType, don't drop
  if (!Object.keys(SHIP_TYPES).includes(shipType)) {
    return;
  }

  // Cast shipType to a valid shipType, as TypeScript doesn't know that it's valid
  const currentShip = SHIP_TYPES[shipType as keyof typeof SHIP_TYPES];

  // If the ship would touch land or other ships, don't drop
  if (wouldTouchLandOrShip(currentShip, orientation)) {
    console.log('would touch land or ship');
    return;
  }
  
  // Set the ship_sprite on the board
  const buf_board = JSON.parse(JSON.stringify(store.state.playerBoard));
  buf_board[props.row][props.col].ship_sprite = {
    type: currentShip,
    orientation: orientation === Orientation.HORIZONTAL ? Orientation.HORIZONTAL : Orientation.VERTICAL,
  };

  // Set the space the ship takes up on the board
  for (let i = 0; i < currentShip.length; i++) {

    // If the ship is horizontal, check the cells to the right
    // If the ship is vertical, check the cells below
    if (orientation === Orientation.HORIZONTAL) {
      buf_board[props.row][props.col + i].ship = true;

      // If the ship is an aircraft carrier check one cell below also
      if (shipType === currentShip.name) {
        buf_board[props.row + 1][props.col + i].ship = true;
      }
    } else {
      buf_board[props.row + i][props.col].ship = true;

      // If the ship is an aircraft carrier check one cell to the right also
      if (shipType === currentShip.name) {
        buf_board[props.row + i][props.col + 1].ship = true;
      }
    }
  }
  store.commit('setPlayerBoard', buf_board);

  // Decrement the count on the GUI
  // Get gui counts
  const guiCounts = JSON.parse(JSON.stringify(store.state.guiShipCounts));
  if (shipType === currentShip.name) {
    store.commit('setGuiSubmarineCount', store.state.guiSubmarineCount - 1);
    guiCounts[shipType] -= 1;
  } else if (shipType === currentShip.name) {
    store.commit('setGuiAircraftCarrierCount', store.state.guiAircraftCarrierCount - 1);
  } else if (shipType === currentShip.name) {
    store.commit('setGuiDestroyerCount', store.state.guiDestroyerCount - 1);
  } else if (shipType === currentShip.name) {
    store.commit('setGuiFrigateCount', store.state.guiFrigateCount - 1);
  } else if (shipType === currentShip.name) {
    store.commit('setGuiSupplyBoatCount', store.state.guiSupplyBoatCount - 1);
  } else if (shipType === currentShip.name) {
    store.commit('setGuiBattleshipCount', store.state.guiBattleshipCount - 1);
  }
};

// Function the given a ship, and an orientation, returns true if the ship would touch land
const wouldTouchLandOrShip = (ship: ShipType, orientation: Orientation) => {
  const shipLengths = {
    [ShipType.SUBMARINE]: 1,
    [ShipType.SUPPLY_BOAT]: 2,
    [ShipType.DESTROYER]: 3,
    [ShipType.BATTLESHIP]: 4,
    [ShipType.FRIGATE]: 5,
    [ShipType.AIRCRAFT_CARRIER]: 5,
  };

  // If the ship would go out of bounds, return true
  console.log(props.col + shipLengths[ship]);
  console.log(props.row + shipLengths[ship]);
  if (orientation === Orientation.HORIZONTAL) {
    if (props.row + shipLengths[ship] > 10) {
      return true;
    }
  } else {
    if (props.row + shipLengths[ship] > 10) {
      return true;
    }
    if (props.col + shipLengths[ship] > 10) {
      return true;
    }
  }

  for (let i = 0; i < shipLengths[ship]; i++) {

    // If the ship is horizontal, check the cells to the right
    // If the ship is vertical, check the cells below
    if (orientation === Orientation.HORIZONTAL) {
      // Make sure the index is in bounds
      if (props.col + i > 10) {
        return true;
      }
      if (board.value[props.row][props.col + i].land) {
        return true;
      } else if (board.value[props.row][props.col + i].ship) {
        return true;
      }

      // If the ship is an aircraft carrier check one cell below also
      if (ship === ShipType.AIRCRAFT_CARRIER) {
        if (board.value[props.row + 1][props.col + i].land) {
          return true;
        } else if (board.value[props.row + 1][props.col + i].ship) {
          return true;
        }
      }
    } else {
      if (board.value[props.row + i][props.col].land) {
        return true;
      } else if (board.value[props.row + i][props.col].ship) {
        return true;
      }

      // If the ship is an aircraft carrier check one cell to the right also
      if (ship === ShipType.AIRCRAFT_CARRIER) {
        if (board.value[props.row + i][props.col + 1].land) {
          return true;
        } else if (board.value[props.row + i][props.col + 1].ship) {
          return true;
        }
      }
    }
  }

  return false;
};
</script>

<style scoped>

/* Styles for cells */
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

/* Styles for ships SVGs */
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
