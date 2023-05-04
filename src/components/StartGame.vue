<template>
  <button @click="startGame" class="primary-button">
    Start Game
  </button>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import { useRouter } from 'vue-router';
import Mutation from '@/types/Mutation';
import ShipName from '@/types/ShipName';
import SHIPS from '@/constants/Ships';
import Orientation from '@/types/Orientation';
import Ship from '@/types/Ship';


const store = useStore()
const router = useRouter()

function startGame() {

  // Player
  store.commit(Mutation.SET_PLAYER_SUBMARINE_IS_USING_ABILITY, false)
  store.commit(Mutation.SET_PLAYER_SUBMARINE_HAS_USED_ABILITY, false)
  store.commit(Mutation.SET_PLAYER_BATTLESHIP_IS_USING_ABILITY, false)
  store.commit(Mutation.SET_PLAYER_BATTLESHIP_HAS_USED_ABILITY, false)
  store.commit(Mutation.SET_PLAYER_BATTLESHIP_HEALTH, 4)
  store.commit(Mutation.SET_PLAYER_AIRCRAFT_CARRIER_IS_USING_ABILITY, false)
  store.commit(Mutation.SET_PLAYER_AIRCRAFT_CARRIER_HAS_USED_ABILITY, false)
  store.commit(Mutation.SET_PLAYER_AIRCRAFT_CARRIER_HEALTH, 10)
  store.commit(Mutation.SET_PLAYER_AIRCRAFT_CARRIER_SHOTS, 3)

  // Computer
  store.commit(Mutation.SET_COMPUTER_SUBMARINE_IS_USING_ABILITY, false)
  store.commit(Mutation.SET_COMPUTER_SUBMARINE_HAS_USED_ABILITY, false)
  store.commit(Mutation.SET_COMPUTER_BATTLESHIP_IS_USING_ABILITY, false)
  store.commit(Mutation.SET_COMPUTER_BATTLESHIP_HAS_USED_ABILITY, false)
  store.commit(Mutation.SET_COMPUTER_BATTLESHIP_HEALTH, 4)
  store.commit(Mutation.SET_COMPUTER_AIRCRAFT_CARRIER_IS_USING_ABILITY, false)
  store.commit(Mutation.SET_COMPUTER_AIRCRAFT_CARRIER_HAS_USED_ABILITY, false)
  store.commit(Mutation.SET_COMPUTER_AIRCRAFT_CARRIER_HEALTH, 10)
  store.commit(Mutation.SET_COMPUTER_AIRCRAFT_CARRIER_SHOTS, 3)

  // The player makes the first move
  store.commit(Mutation.SET_PLAYER_HAS_CURRENT_TURN, true)
  store.commit(Mutation.SET_COMPUTER_HAS_CURRENT_TURN, false)

  randomlyPlaceComputerShips()

  router.push({ name: 'Game' })
}

function randomlyPlaceComputerShips() {
  const computer = store.state.computer

  // Since TS doesn't infer the type in a for loop, we need to uses Object.values
  Object.values(ShipName).forEach((shipName) => {

    // For each ship's count
    for (let i = 0; i < SHIPS[shipName].count; i++) {

      // Randomly choose a row, column, and orientation until we find a valid placement
      while (true) {
        const row = Math.floor(Math.random() * computer.board.length)
        const col = Math.floor(Math.random() * computer.board[0].length)
        const orientation = Math.random() < 0.5 ? Orientation.HORIZONTAL : Orientation.VERTICAL

        //Create the ship
        const ship = new Ship(shipName, orientation)

        if (computer.isInvalidShipPlacement(ship, row, col)) {
          continue;
        }

        computer.placeShip(ship, row, col)
        break;
      }

    }

  });

}
</script>