<template>
  <div class="ship-container">
    <ShipItem shipType="aircraftCarrier" shipName="Aircraft Carrier" :count="store.state.guiShipCounts.aircraftCarrierCount">
      <AircraftCarrier class="svg" />
    </ShipItem>
    <ShipItem shipType="submarine" shipName="Submarine" :count="store.state.guiShipCounts.submarineCount">
      <Submarine class="svg" />
    </ShipItem>
    <ShipItem shipType="destroyer" shipName="Destroyer" :count="store.state.guiShipCounts.destroyerCount">
      <Destroyer class="svg" />
    </ShipItem>
    <ShipItem shipType="battleship" shipName="Battleship" :count="store.state.guiShipCounts.battleshipCount">
      <Battleship class="svg" />
    </ShipItem>
    <ShipItem shipType="frigate" shipName="Frigate" :count="store.state.guiShipCounts.frigateCount">
      <Frigate class="svg" />
    </ShipItem>
    <ShipItem shipType="supplyBoat" shipName="Supply Boat" :count="store.state.guiShipCounts.supplyBoatCount">
      <SupplyBoat class="svg" />
    </ShipItem>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'

// SVG imports
import Submarine from './Submarine.vue';
import SupplyBoat from './SupplyBoat.vue';
import Destroyer from './Destroyer.vue';
import Battleship from './Battleship.vue';
import Frigate from './Frigate.vue';
import AircraftCarrier from './AircraftCarrier.vue';
import ShipItem from './ShipItem.vue';

const store = useStore()
</script>

<style scoped>
.ship-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.svg {
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
}
</style>