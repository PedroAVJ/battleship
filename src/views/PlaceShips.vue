<template>
  <div class="view-wrapper">
    <h1 class="text">
      Battleship Game
    </h1>
    <PlayerBoard :tiles="store.player.board.tiles"  />

    <!-- Display if all ships have been placed -->
    <button @click="startGame" class="primary-button mt-5"
      v-if="store.player.allShipsPlaced()">
      Start Game
    </button>

    <!-- Display if there are still ships to place -->
    <div v-else class="gui">
      <h2 class="text mt-5">
        Drag and drop ships to place them on the board
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
import ShipName from '@/types/ShipName';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import Tile from '@/types/Tile';
import PlayerBoard from '@/components/PlayerBoard.vue';

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

  // Save the current board state, as it will be reset when the game starts
  const player_board_tiles = JSON.parse(JSON.stringify(store.player.board.tiles)) as Tile[][]
  const computer_board_tiles = JSON.parse(JSON.stringify(store.computer.board.tiles)) as Tile[][]

  store.$reset()

  // Restore the board state
  store.setPlayerBoardTiles(player_board_tiles)
  store.setComputerBoardTiles(computer_board_tiles)

  store.computer.board.randomlyPlaceShips()
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
