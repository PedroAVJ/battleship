<template>
    <Hit v-if="tile.contains.successfulShot" class="hit" />
    <Miss v-if="tile.contains.missedShot" />

    <!-- Only show uncovered ship if it's the enemy board -->
    <Uncovered v-if="tile.contains.uncoveredShip && !isPlayerBoard && !tile.contains.successfulShot" />

    <div v-if="tile.ship !== undefined">
      <Submarine
        v-if="tile.ship.name === ShipName.SUBMARINE && tile.ship.orientation"
        :class="['submarine', tile.ship.orientation === Orientation.VERTICAL ? 'rotated' : '']"
      />
      <SupplyBoat
        v-if="tile.ship.name === ShipName.SUPPLY_BOAT && tile.ship.orientation"
        :class="['supply-boat', tile.ship.orientation === Orientation.VERTICAL ? 'rotated' : '']"
      />
      <Destroyer
        v-if="tile.ship.name === ShipName.DESTROYER && tile.ship.orientation"
        :class="['destroyer', tile.ship.orientation === Orientation.VERTICAL ? 'rotated' : '']"
      />
      <Battleship
        v-if="tile.ship.name === ShipName.BATTLESHIP && tile.ship.orientation"
        :class="['battleship', tile.ship.orientation === Orientation.VERTICAL ? 'rotated' : '']"
      />
      <Frigate
        v-if="tile.ship.name === ShipName.FRIGATE && tile.ship.orientation"
        :class="['frigate', tile.ship.orientation === Orientation.VERTICAL ? 'rotated' : '']"
      />
      <AircraftCarrier
        v-if="tile.ship.name === ShipName.AIRCRAFT_CARRIER && tile.ship.orientation"
        :class="['aircraft-carrier', tile.ship.orientation === Orientation.VERTICAL ? 'rotated' : '']"
      />
    </div>
</template>

<script setup lang="ts">
import { ShipName, Tile, Orientation } from '@/types/store.interface';

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
  tile: Tile;
  isPlayerBoard: boolean;
}

const props = defineProps<CellProps>();
</script>

<style scoped>
.hit {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  z-index: 2;
}

.submarine {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  z-index: 1;
  pointer-events: none;
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
  pointer-events: none;
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
  pointer-events: none;
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
  pointer-events: none;
}

.frigate {
  position: absolute;
  top: 0;
  left: 0;
  width: 500%;
  height: 100%;
  overflow: visible;
  z-index: 1;
  transform: scaleX(5) scaleY(2);
  pointer-events: none;
}

.aircraft-carrier {
  position: absolute;
  top: 0;
  left: 0;
  width: 500%;
  height: 100%;
  overflow: visible;
  z-index: 1;
  pointer-events: none;
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