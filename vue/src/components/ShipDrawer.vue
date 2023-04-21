<template>
  <div class="ship-container">
    <ShipItem :shipName="ShipName.AIRCRAFT_CARRIER" shipTitle="Aircraft Carrier" :count="store.state.gui.aircraftCarrierCount">
      <AircraftCarrier class="svg" />
    </ShipItem>
    <ShipItem :shipName="ShipName.SUBMARINE" shipTitle="Submarine" :count="store.state.gui.submarineCount">
      <Submarine class="svg" />
    </ShipItem>
    <ShipItem :shipName="ShipName.DESTROYER" shipTitle="Destroyer" :count="store.state.gui.destroyerCount">
      <Destroyer class="svg" />
    </ShipItem>
    <ShipItem :shipName="ShipName.BATTLESHIP" shipTitle="Battleship" :count="store.state.gui.battleshipCount">
      <Battleship class="svg" />
    </ShipItem>
    <ShipItem :shipName="ShipName.FRIGATE" shipTitle="Frigate" :count="store.state.gui.frigateCount">
      <Frigate class="svg" />
    </ShipItem>
    <ShipItem :shipName="ShipName.SUPPLY_BOAT" shipTitle="Supply Boat" :count="store.state.gui.supplyBoatCount">
      <SupplyBoat class="svg" />
    </ShipItem>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import { ShipName } from '@/types/store.interface'
import ShipItem from '@/components/ShipItem.vue'

import Submarine from '@/components/SVG\'s/Ships/Submarine.vue'
import SupplyBoat from '@/components/SVG\'s/Ships/SupplyBoat.vue'
import Destroyer from '@/components/SVG\'s/Ships/Destroyer.vue'
import Battleship from '@/components/SVG\'s/Ships/Battleship.vue'
import Frigate from '@/components/SVG\'s/Ships/Frigate.vue'
import AircraftCarrier from '@/components/SVG\'s/Ships/AircraftCarrier.vue'

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