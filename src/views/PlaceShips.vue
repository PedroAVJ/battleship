<template>
  <div class="view-wrapper">
    <h1 class="primary-text" v-if="allShipsPlaced(store.player)">
      Start Game
    </h1>
    <h1 class="primary-text" v-else>
      Place Your Ships
    </h1>
    <PlayerBoard />

    <!-- Display if all ships have been placed -->
    <button @click="startGame" class="primary-button mt-5"
      v-if="allShipsPlaced(store.player)">
      Start Game
    </button>

    <!-- Display if there are still ships to place -->
    <div v-else class="gui">
      <h2 class="primary-text mt-5" v-if="isMobile">
        Tap on a ship and tap the board to place it
      </h2>
      <h2 class="primary-text mt-5" v-else>
        Drag a ship and drop it on the board to place it
      </h2>
      <div class="ship-container">
        <ShipItem :ship-name="ShipName.AIRCRAFT_CARRIER">
          <AircraftCarrier />
        </ShipItem>
        <ShipItem :ship-name="ShipName.SUBMARINE">
          <Submarine />
        </ShipItem>
        <ShipItem :ship-name="ShipName.DESTROYER">
          <Destroyer />
        </ShipItem>
        <ShipItem :ship-name="ShipName.BATTLESHIP">
          <Battleship />
        </ShipItem>
        <ShipItem :ship-name="ShipName.FRIGATE">
          <Frigate />
        </ShipItem>
        <ShipItem :ship-name="ShipName.SUPPLY_BOAT">
          <SupplyBoat />
        </ShipItem>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ShipItem from '@/components/ShipItem.vue'
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import PlayerBoard from '@/components/PlayerBoard.vue';
import { allShipsPlaced, randomlyPlaceShips } from '@/utils/Game';
import { ShipName } from '@/utils/Enums';
import { Tile } from '@/utils/Interfaces';
import { computed } from 'vue';

// SVG's
import Submarine from '@/components/SVGs/Ships/Submarine.vue'
import SupplyBoat from '@/components/SVGs/Ships/SupplyBoat.vue'
import Destroyer from '@/components/SVGs/Ships/Destroyer.vue'
import Battleship from '@/components/SVGs/Ships/Battleship.vue'
import Frigate from '@/components/SVGs/Ships/Frigate.vue'
import AircraftCarrier from '@/components/SVGs/Ships/AircraftCarrier.vue'

const store = useStore()
const router = useRouter()

// This determines if the user is on a mobile device
const isMobile = computed(() => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))

function startGame() {

  // Save the current board state, as it will be reset when the game starts
  const player_board_tiles = JSON.parse(JSON.stringify(store.player.board)) as Tile[][]
  const computer_board_tiles = JSON.parse(JSON.stringify(store.computer.board)) as Tile[][]

  store.$reset()

  // Restore the board state
  store.setPlayerBoard(player_board_tiles)
  store.setComputerBoard(computer_board_tiles)

  randomlyPlaceShips(store.computer.board)
  store.setPlayerHasCurrentTurn(true)
  router.push({ name: 'Game' })
}
</script>

<style scoped>
.gui {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 500px;
}
.view-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
}

.ship-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-row-gap: 10px;
  grid-column-gap: 10px;
  justify-items: center;
}
</style>
