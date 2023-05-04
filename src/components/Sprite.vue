<template>
  <Hit v-if="tile.contains.successfulShot" class="hit" />
  <Miss v-if="tile.contains.missedShot" class="miss" />

  <!-- Only show uncovered ship if it's the enemy board and the tile hasn't been shot at yet -->
  <Uncovered 
    v-if="
      tile.contains.uncoveredShip
      && !tile.contains.successfulShot
      && !isPlayerSquare"
    class="uncovered"
  />

  <!-- Only show ship if it's the player board and the tile hasn't been shot at yet -->
  <div v-if="tile.ship !== undefined && isPlayerSquare">
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

  <!-- This display a ship preview when the player is placing a ship -->
  <div v-if="tile.ship_preview !== undefined && isPlayerSquare">
    <Submarine
      v-if="tile.ship_preview.name === ShipName.SUBMARINE && tile.ship_preview.orientation"
      :class="['submarine', tile.ship_preview.orientation === Orientation.VERTICAL ? 'rotated' : '', 'ship-preview', 'svg-container']"
    />
    <SupplyBoat
      v-if="tile.ship_preview.name === ShipName.SUPPLY_BOAT && tile.ship_preview.orientation"
      :class="['supply-boat', tile.ship_preview.orientation === Orientation.VERTICAL ? 'rotated' : '', 'ship-preview']"
    />
    <Destroyer
      v-if="tile.ship_preview.name === ShipName.DESTROYER && tile.ship_preview.orientation"
      :class="['destroyer', tile.ship_preview.orientation === Orientation.VERTICAL ? 'rotated' : '', 'ship-preview']"
    />
    <Battleship
      v-if="tile.ship_preview.name === ShipName.BATTLESHIP && tile.ship_preview.orientation"
      :class="['battleship', tile.ship_preview.orientation === Orientation.VERTICAL ? 'rotated' : '', 'ship-preview']"
    />
    <Frigate
      v-if="tile.ship_preview.name === ShipName.FRIGATE && tile.ship_preview.orientation"
      :class="['frigate', tile.ship_preview.orientation === Orientation.VERTICAL ? 'rotated' : '', 'ship-preview']"
    />
    <AircraftCarrier
      v-if="tile.ship_preview.name === ShipName.AIRCRAFT_CARRIER && tile.ship_preview.orientation"
      :class="['aircraft-carrier', tile.ship_preview.orientation === Orientation.VERTICAL ? 'rotated' : '', 'ship-preview']"
    />
  </div>

</template>

<script setup lang="ts">
import { ShipName, Orientation } from '@/types/enums.js'
import { Tile } from '@/types/interfaces.js'

// SVG's
import Miss from '@/components/SVGs/Miss.vue'
import Hit from '@/components/SVGs/Hit.vue'
import Uncovered from '@/components/SVGs/Uncovered.vue'
import Submarine from '@/components/SVGs/Ships/Submarine.vue'
import SupplyBoat from '@/components/SVGs/Ships/SupplyBoat.vue'
import Destroyer from '@/components/SVGs/Ships/Destroyer.vue'
import Battleship from '@/components/SVGs/Ships/Battleship.vue'
import Frigate from '@/components/SVGs/Ships/Frigate.vue'
import AircraftCarrier from '@/components/SVGs/Ships/AircraftCarrier.vue'


interface SpriteProps {
  tile: Tile;
  isPlayerSquare: boolean;
}

const props = defineProps<SpriteProps>();
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

.miss {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  z-index: 1;
}

.uncovered {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  z-index: 1;
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
  transform: scaleX(2) scaleY(2.5);
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
  transform: rotate(90deg) scaleX(2) scaleY(2.5) translate(18%, 50%);
}

/* Class for ship preview sprites, so that they are slightly transparent */
.ship-preview {
  opacity: 0.5;
}
</style>