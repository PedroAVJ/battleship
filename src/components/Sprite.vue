<template>
  <Hit v-if="tile.contains.successfulShot" class="hit" />
  <Miss v-if="tile.contains.missedShot" class="miss" />

  <!-- Only show uncovered ship if the tile hasn't been shot at yet -->
  <Uncovered 
    v-if="displayUncoveredShip"
    class="uncovered"
  />

  <div v-if="tile.shipSprite">
    <Submarine v-if="displaySubmarine" :class="submarineClass" />
    <SupplyBoat v-if="displaySupplyBoat" :class="supplyBoatClass" />
    <Destroyer v-if="displayDestroyer" :class="destroyerClass" />
    <Battleship v-if="displayBattleship" :class="battleshipClass" />
    <Frigate v-if="displayFrigate" :class="frigateClass" />
    <AircraftCarrier v-if="displayAircraftCarrier" :class="aircraftCarrierClass" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ShipName, Orientation } from '@/utils/Enums'
import { Tile } from '@/utils/Interfaces'
import { useStore } from '@/store'

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


const props = defineProps<{
  tile: Tile;
  isEnemyBoard?: boolean;
}>();
const store = useStore();

const displayUncoveredShip = computed(() => {
  if (props.isEnemyBoard) {
    return props.tile.contains.uncoveredShip && !props.tile.contains.successfulShot
  } else {
    return props.tile.contains.uncoveredShip && !props.tile.contains.successfulShot && !props.tile.shipHitbox
  }
});

const displaySubmarine = computed(() => {
  if (props.isEnemyBoard) {
    return props.tile.shipSprite?.name === ShipName.SUBMARINE
      && store.computer[ShipName.SUBMARINE].health === 0
  } else {
    return props.tile.shipSprite?.name === ShipName.SUBMARINE
  }
});

const displaySupplyBoat = computed(() => {
  if (props.isEnemyBoard) {
    return props.tile.shipSprite?.name === ShipName.SUPPLY_BOAT
      && store.computer[ShipName.SUPPLY_BOAT].health === 0
  } else {
    return props.tile.shipSprite?.name === ShipName.SUPPLY_BOAT
  }
});

const displayDestroyer = computed(() => {
  if (props.isEnemyBoard) {
    return props.tile.shipSprite?.name === ShipName.DESTROYER
      && store.computer[ShipName.DESTROYER].health === 0
  } else {
    return props.tile.shipSprite?.name === ShipName.DESTROYER
  }
});

const displayBattleship = computed(() => {
  if (props.isEnemyBoard) {
    return props.tile.shipSprite?.name === ShipName.BATTLESHIP
      && store.computer[ShipName.BATTLESHIP].health === 0
  } else {
    return props.tile.shipSprite?.name === ShipName.BATTLESHIP
  }
});

const displayFrigate = computed(() => {
  if (props.isEnemyBoard) {
    return props.tile.shipSprite?.name === ShipName.FRIGATE
      && store.computer[ShipName.FRIGATE].health === 0
  } else {
    return props.tile.shipSprite?.name === ShipName.FRIGATE
  }
});

const displayAircraftCarrier = computed(() => {
  if (props.isEnemyBoard) {
    return props.tile.shipSprite?.name === ShipName.AIRCRAFT_CARRIER
      && store.computer[ShipName.AIRCRAFT_CARRIER].health === 0
  } else {
    return props.tile.shipSprite?.name === ShipName.AIRCRAFT_CARRIER
  }
});

const submarineClass = computed(() => {
  const classes = ['submarine'];
  if (props.tile.shipSprite?.orientation === Orientation.VERTICAL) {
    classes.push('rotated');
  }
  if (props.tile.shipSprite?.isPreview) {
    classes.push('ship-preview');
  }
  return classes;
});

const supplyBoatClass = computed(() => {
  const classes = ['supply-boat'];
  if (props.tile.shipSprite?.orientation === Orientation.VERTICAL) {
    classes.push('rotated');
  }
  if (props.tile.shipSprite?.isPreview) {
    classes.push('ship-preview');
  }
  return classes;
});

const destroyerClass = computed(() => {
  const classes = ['destroyer'];
  if (props.tile.shipSprite?.orientation === Orientation.VERTICAL) {
    classes.push('rotated');
  }
  if (props.tile.shipSprite?.isPreview) {
    classes.push('ship-preview');
  }
  return classes;
});

const battleshipClass = computed(() => {
  const classes = ['battleship'];
  if (props.tile.shipSprite?.orientation === Orientation.VERTICAL) {
    classes.push('rotated');
  }
  if (props.tile.shipSprite?.isPreview) {
    classes.push('ship-preview');
  }
  return classes;
});

const frigateClass = computed(() => {
  const classes = ['frigate'];
  if (props.tile.shipSprite?.orientation === Orientation.VERTICAL) {
    classes.push('rotated');
  }
  if (props.tile.shipSprite?.isPreview) {
    classes.push('ship-preview');
  }
  return classes;
});

const aircraftCarrierClass = computed(() => {
  const classes = ['aircraft-carrier'];
  if (props.tile.shipSprite?.orientation === Orientation.VERTICAL) {
    classes.push('rotated');
  }
  if (props.tile.shipSprite?.isPreview) {
    classes.push('ship-preview');
  }
  return classes;
});
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