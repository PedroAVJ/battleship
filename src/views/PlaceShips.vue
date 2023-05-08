<template>
  <div class="containerrr">
    <h1 class="text">
      Battleship Game
    </h1>
    <div class="boards">
      <PlayerBoard :tiles="store.player.board.tiles" user="player" />
    </div>
    <div class="gui">

      <!-- Display if all ships have been placed -->
      <button @click="startGame" class="primary-button"
        v-if="store.player.allShipsPlaced()">
        Start Game
      </button>

      <!-- Display if there are still ships to place -->
      <div v-else>
        <h2 class="text">
          Drag and drop ships to place them on the board
        </h2>
        <div class="ship-container">
          <ShipItem :ship-name="ShipName.AIRCRAFT_CARRIER">
            <AircraftCarrier class="svg" />
          </ShipItem>
          <ShipItem :ship-name="ShipName.SUBMARINE">
            <Submarine class="svg" />
          </ShipItem>
          <ShipItem :ship-name="ShipName.DESTROYER">
            <Destroyer class="svg" />
          </ShipItem>
          <ShipItem :ship-name="ShipName.BATTLESHIP">
            <Battleship class="svg" />
          </ShipItem>
          <ShipItem :ship-name="ShipName.FRIGATE">
            <Frigate class="svg" />
          </ShipItem>
          <ShipItem :ship-name="ShipName.SUPPLY_BOAT">
            <SupplyBoat class="svg" />
          </ShipItem>
        </div>
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
  store.player.board.tiles = player_board_tiles
  store.computer.board.tiles = computer_board_tiles

  store.computer.board.randomlyPlaceShips()
  router.push({ name: 'Game' })
}
</script>

<style scoped>
.containerrr {
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
  background-color: #3c6e8f;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 15px;
  border: 2px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
}

.board-row {
  display: flex;
  flex: 1;
}

.board-cell {
  flex: 1;
  position: relative;
  box-sizing: border-box;
}

.ship-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  justify-items: center;
}

.svg {
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
}

.text {
  color: #e0e0e0;
  display: inline-block;
  padding: 5px 10px;
  border-radius: 5px;
}

.start-game {
  background-color: #ff9800;
  border-radius: 4px;
  color: #e0e0e0;
  display: inline-block;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s;
  font-size: large;
}

.start-game:hover {
  background-color: #f57c00;
}
</style>
