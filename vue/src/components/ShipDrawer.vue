<template>
  <div class="ship-container">
    <ShipItem shipType="aircraftCarrier" shipName="Aircraft Carrier" :orientation="aircraftCarrierOrientation" :count="aircraftCarrierCount">
      <AircraftCarrier class="svg" />
    </ShipItem>
    <ShipItem shipType="submarine" shipName="Submarine" :orientation="submarineOrientation" :count="submarineCount">
      <Submarine class="svg" />
    </ShipItem>
    <ShipItem shipType="destroyer" shipName="Destroyer" :orientation="destroyerOrientation" :count="store.state.destroyerCount">
      <Destroyer class="svg" />
    </ShipItem>
    <ShipItem shipType="battleship" shipName="Battleship" :orientation="battleshipOrientation" :count="store.state.battleshipCount">
      <Battleship class="svg" />
    </ShipItem>
    <ShipItem shipType="frigate" shipName="Frigate" :orientation="frigateOrientation" :count="store.state.frigateCount">
      <Frigate class="svg" />
    </ShipItem>
    <ShipItem shipType="supplyBoat" shipName="Supply Boat" :orientation="supplyBoatOrientation" :count="store.state.supplyBoatCount">
      <SupplyBoat class="svg" />
    </ShipItem>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import { onUnmounted, ref } from 'vue'
import { Orientation } from '@/types/store';

// SVG imports
import Submarine from './Submarine.vue';
import SupplyBoat from './SupplyBoat.vue';
import Destroyer from './Destroyer.vue';
import Battleship from './Battleship.vue';
import Frigate from './Frigate.vue';
import AircraftCarrier from './AircraftCarrier.vue';
import ShipItem from './ShipItem.vue';

const store = useStore()

const aircraftCarrierOrientation = ref(Orientation.HORIZONTAL)
const submarineOrientation = ref(Orientation.HORIZONTAL)
const destroyerOrientation = ref(Orientation.HORIZONTAL)
const battleshipOrientation = ref(Orientation.HORIZONTAL)
const frigateOrientation = ref(Orientation.HORIZONTAL)
const supplyBoatOrientation = ref(Orientation.HORIZONTAL)

const aircraftCarrierCount = ref(1)
const submarineCount = ref(1)

// I store the count here, so I can revert to the original count when the component is destroyed
// It was either this or add more global state to the store
const destroyerCount = ref(store.state.destroyerCount)
const battleshipCount = ref(store.state.battleshipCount)
const frigateCount = ref(store.state.frigateCount)
const supplyBoatCount = ref(store.state.supplyBoatCount)

onUnmounted(() => {
    store.commit('setDestroyerCount', destroyerCount.value)
    store.commit('setBattleshipCount', battleshipCount.value)
    store.commit('setFrigateCount', frigateCount.value)
    store.commit('setSupplyBoatCount', supplyBoatCount.value)
})
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