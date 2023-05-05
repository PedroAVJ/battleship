<template>

  <!-- Modal displayed if player or computer wins -->
  <MatchResultModal />

  <!-- GUI -->
  <div class="containerrr">
    <h1 class="text">
      Battleship Game
    </h1>

    <!-- Boards -->
    <div class="boards">
      <h2 class="computer-text">
        Enemy Board
      </h2>
      <Board :board="store.computer.board" user="computer" />
      <h2 class="player-text">
        Player Board
      </h2>
      <Board :board="store.player.board" user="player" />
    </div>

    <!-- Ability Buttons -->
    <div class="gui">

      <!-- Button to start new Game -->
      <button class="btn btn-primary" @click="store.resetState()" v-if="store.player.hasLost() || store.computer.hasLost()">
        Start New Game
      </button>
      <div v-else>

        <h3 v-if="store.player.hasCurrentTurn" class="player-text">
          Your Turn
        </h3>
        <h3 v-else class="computer-text">
          Enemy's Turn
        </h3>
  
        <!-- Display what ability is selected -->
        <div v-if="store.player.hasCurrentTurn">
          <h3 class="text">
            {{ selectedPlayerAbility }}
          </h3>
        </div>
        <div v-else-if="store.computer.hasCurrentTurn">
          <h3 class="text">
            {{ selectedComputerAbility }}
          </h3>
        </div>
  
        <!-- Display if it's the players turn and if any ability can be used -->
        <h3 v-if="store.player.hasCurrentTurn && (!store.player.submarine.hasUsedAbility || !store.player.aircraftCarrier.hasUsedAbility || !store.player.battleship.hasUsedAbility)"
        class="text">
          Click to use an ability.
        </h3>
        <AbilityButtons v-if="store.player.hasCurrentTurn && (!store.player.submarine.hasUsedAbility || !store.player.aircraftCarrier.hasUsedAbility || !store.player.battleship.hasUsedAbility)" />
        <div class="ability-button-container" v-else-if="store.computer.hasCurrentTurn && (!store.computer.submarine.hasUsedAbility || !store.computer.aircraftCarrier.hasUsedAbility || !store.computer.battleship.hasUsedAbility)">
          <!-- Player button for using the submarine ability -->
          <button
            :disabled="isSubmarineAbilityButtonDisabled"
            :class="['ability-button', store.computer.submarine.isUsingAbility ? 'highlighted' : '']"
          >
            <Submarine class="ability-icon" />
          </button>
  
          <!-- Player button for using the aircraft carrier ability -->
          <button
            :disabled="isAircraftCarrierAbilityButtonDisabled"
            :class="['ability-button', store.computer.aircraftCarrier.isUsingAbility ? 'highlighted' : '']"
          >
            <AircraftCarrier class="ability-icon" />
          </button>
  
          <!-- Player button for using the battleship ability -->
          <button
            :disabled="isBattleshipAbilityButtonDisabled"
            :class="['ability-button', store.computer.battleship.isUsingAbility ? 'highlighted' : '']"
          >
            <Battleship class="ability-icon" />
          </button>
        </div>
      </div>
    </div>

  </div>

</template>

<script lang="ts" setup>
import Board from '@/components/Board.vue';
import AbilityButtons from '@/components/AbilityButtons.vue';
import MatchResultModal from '@/components/MatchResultModal.vue';
import { useStore } from '@/store'
import { useRouter } from 'vue-router';
import { computed } from 'vue';

// SVGs
import Submarine from '@/components/SVGs/Ships/Submarine.vue';
import AircraftCarrier from '@/components/SVGs/Ships/AircraftCarrier.vue';
import Battleship from '@/components/SVGs/Ships/Battleship.vue';


const store = useStore()
const router = useRouter()

const selectedPlayerAbility = computed(() => {
  if (store.player.aircraftCarrier.isUsingAbility) return 'Aircraft Carrier Attack';
  if (store.player.battleship.isUsingAbility) return 'Battleship Attack';
  if (store.player.submarine.isUsingAbility) return 'Submarine Attack';
  return 'Normal Attack';
});

const selectedComputerAbility = computed(() => {
  if (store.computer.aircraftCarrier.isUsingAbility) return 'Aircraft Carrier Attack';
  if (store.computer.battleship.isUsingAbility) return 'Battleship Attack';
  if (store.computer.submarine.isUsingAbility) return 'Submarine Attack';
  return 'Normal Attack';
});

const isSubmarineAbilityButtonDisabled = computed(() => {
  return (
    store.player.hasCurrentTurn
    || store.computer.submarine.hasUsedAbility
    || store.computer.submarine.isUsingAbility
    || store.computer.aircraftCarrier.isUsingAbility
    || store.computer.battleship.isUsingAbility
  )
})

const isAircraftCarrierAbilityButtonDisabled = computed(() => {
  return (
    store.player.hasCurrentTurn
    || store.computer.aircraftCarrier.hasUsedAbility
    || store.computer.submarine.isUsingAbility
    || store.computer.aircraftCarrier.isUsingAbility
    || store.computer.battleship.isUsingAbility
  )
})

const isBattleshipAbilityButtonDisabled = computed(() => {
  return (
    store.player.hasCurrentTurn
    || store.computer.battleship.hasUsedAbility
    || store.computer.submarine.isUsingAbility
    || store.computer.aircraftCarrier.isUsingAbility
    || store.computer.battleship.isUsingAbility
  )
})
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
  box-sizing: border-box;
}

.ability-button-container {
  display: flex;
  justify-content: space-between;
}

.ability-button {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ff9800;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.ability-button:hover:not(:disabled) {
  background-color: #f57c00;
}

.ability-button:disabled {
  /** Way darker orange */
  background-color: #b26a00;
  cursor: not-allowed;
}

.ability-icon {
  width: 50px;
  height: 50px;
}

/** Class for when the button is highlighted, border color should change to a light green */
.ability-button.highlighted {
  border-color: #00ff00;
}

.player-text {
  background-color: #52af52;
  color: #e0e0e0;
  display: inline-block;
  padding: 5px 10px;
  border-radius: 5px;
}
.computer-text {
  background-color: #f44336;
  color: #e0e0e0;
  display: inline-block;
  padding: 5px 10px;
  border-radius: 5px;
}

.text {
  color: #e0e0e0;
  display: inline-block;
  padding: 5px 10px;
  border-radius: 5px;
}

.gui {
  background-color: #3c6e8f;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 250px;
  padding: 15px;
  border: 2px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

.boards {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}
</style>