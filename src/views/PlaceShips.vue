<template>
  <div class="container">
    <h1>
      Battleship Game
    </h1>
    <div class="boards">
      <div class="board-wrapper">
        <h2>
          Player Board
        </h2>
        <div class="board">
          <div v-for="(row, rowIndex) in store.state.player.board" :key="rowIndex" class="board-row">
            <div v-for="(col, colIndex) in row" :key="colIndex" class="board-cell">
              <PlayerSquare :tile="col" :row="rowIndex" :col="colIndex" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="gui">
      <h2>
        GUI
      </h2>

      <!-- Display if all ships have been placed -->
      <button v-if="Object.values(store.state.gui).reduce((sum, value) => sum + value, 0) === 0" @click="startGame">
        Start Game
      </button>

      <!-- Display if there are still ships to place -->
      <div class="ship-container" v-if="Object.values(store.state.gui).reduce((sum, value) => sum + value, 0) !== 0">
        <ShipItem :shipName="ShipName.AIRCRAFT_CARRIER" shipTitle="Aircraft Carrier"
          :count="store.state.gui.aircraftCarrierCount">
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

    </div>
  </div>
</template>

<script lang="ts" setup>
import ShipItem from '@/components/ShipItem.vue'
import PlayerSquare from '@/components/PlayerSquare.vue';
import { useStore } from '@/store'
import { Mutation, ShipName } from '@/store/enums';
import { useRouter } from 'vue-router';

// SVG's
import Submarine from '@/components/SVGs/Ships/Submarine.vue'
import SupplyBoat from '@/components/SVGs/Ships/SupplyBoat.vue'
import Destroyer from '@/components/SVGs/Ships/Destroyer.vue'
import Battleship from '@/components/SVGs/Ships/Battleship.vue'
import Frigate from '@/components/SVGs/Ships/Frigate.vue'
import AircraftCarrier from '@/components/SVGs/Ships/AircraftCarrier.vue'


const store = useStore()
const router = useRouter()

function startGame() {
  store.commit(Mutation.SET_GAME_IS_IN_PROGRESS, true)

  store.commit(Mutation.SET_PLAYER_IS_USING_SUBMARINE_ABILITY, false)
  store.commit(Mutation.SET_PLAYER_IS_USING_AIRCRAFT_CARRIER_ABILITY, false)
  store.commit(Mutation.SET_PLAYER_IS_USING_BATTLESHIP_ABILITY, false)

  store.commit(Mutation.SET_PLAYER_HAS_USED_SUBMARINE_ABILITY, false)
  store.commit(Mutation.SET_PLAYER_HAS_USED_AIRCRAFT_CARRIER_ABILITY, false)
  store.commit(Mutation.SET_PLAYER_HAS_USED_BATTLESHIP_ABILITY, false)

  store.commit(Mutation.SET_PLAYER_AIRCRAFT_CARRIER_HEALTH, 10)
  store.commit(Mutation.SET_PLAYER_BATTLESHIP_HEALTH, 4)

  // The player makes the first move
  store.commit(Mutation.SET_PLAYER_HAS_CURRENT_TURN, true)
  store.commit(Mutation.SET_PLAYER_HAS_WON_THE_GAME, false)

  store.commit(Mutation.SET_COMPUTER_IS_USING_SUBMARINE_ABILITY, false)
  store.commit(Mutation.SET_COMPUTER_IS_USING_AIRCRAFT_CARRIER_ABILITY, false)
  store.commit(Mutation.SET_COMPUTER_IS_USING_BATTLESHIP_ABILITY, false)

  store.commit(Mutation.SET_COMPUTER_HAS_USED_SUBMARINE_ABILITY, false)
  store.commit(Mutation.SET_COMPUTER_HAS_USED_AIRCRAFT_CARRIER_ABILITY, false)
  store.commit(Mutation.SET_COMPUTER_HAS_USED_BATTLESHIP_ABILITY, false)

  store.commit(Mutation.SET_COMPUTER_AIRCRAFT_CARRIER_HEALTH, 10)
  store.commit(Mutation.SET_COMPUTER_BATTLESHIP_HEALTH, 4)

  store.commit(Mutation.SET_COMPUTER_HAS_CURRENT_TURN, false)
  store.commit(Mutation.SET_COMPUTER_HAS_WON_THE_GAME, false)

  router.push({ name: 'Game' })
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Arial', sans-serif;
  margin: 20px;
}

h1 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.boards {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.board-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.gui {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.board {
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 500px;
  background-color: #2c3e50;
}

.board-row {
  display: flex;
  flex: 1;
}

.board-cell {
  flex: 1;
  position: relative;
  border: 1px solid #2c3e50;
  box-sizing: border-box;
}

.ship-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.svg {
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
}
</style>