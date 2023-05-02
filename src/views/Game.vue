<template>

  <!-- Modal displayed if player or computer wins -->
  <MatchResultModal v-if="store.state.player.hasWonTheGame || store.state.computer.hasWonTheGame" />

  <!-- GUI -->
  <div class="container">
    <h1>
      Battleship Game
    </h1>

    <!-- Boards -->
    <div class="boards">
      <div class="board-wrapper">
        <h2>
          Enemy Board
        </h2>
        <div class="board">
          <div v-for="(row, rowIndex) in store.state.computer.board" :key="rowIndex" class="board-row">
            <div v-for="(col, colIndex) in row" :key="colIndex" class="board-cell">
              <EnemySquare :tile="col" :row="rowIndex" :col="colIndex" />
            </div>
          </div>
        </div>
      </div>
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

    <!-- Ability Buttons -->
    <div class="gui">
      <h2>
        GUI
      </h2>
      <h3 v-if="store.state.player.hasCurrentTurn">
        Your Turn
      </h3>
      <h3 v-else>
        Enemy's Turn
      </h3>

      <!-- Display what ability is selected -->
      <div v-if="store.state.player.hasCurrentTurn">
        <h3>
          Current Attack Type: {{ selectedPlayerAbility }}
        </h3>
      </div>
      <div v-else-if="store.state.computer.hasCurrentTurn">
        <h3>
          Current Attack Type: {{ selectedComputerAbility }}
        </h3>
      </div>

      <h3>
        Click to use an ability
      </h3>
      <AbilityButtons v-if="store.state.player.hasCurrentTurn" />
      <div class="ability-button-container" v-else-if="store.state.computer.hasCurrentTurn">
        <!-- Player button for using the submarine ability -->
        <button
          :disabled="isSubmarineAbilityButtonDisabled"
          :class="['ability-button', store.state.computer.isUsingSubmarineAbility ? 'highlighted' : '']"
        >
          <Submarine class="ability-icon" />
        </button>

        <!-- Player button for using the aircraft carrier ability -->
        <button
          :disabled="isAircraftCarrierAbilityButtonDisabled"
          :class="['ability-button', store.state.computer.isUsingAircraftCarrierAbility ? 'highlighted' : '']"
        >
          <AircraftCarrier class="ability-icon" />
        </button>

        <!-- Player button for using the battleship ability -->
        <button
          :disabled="isBattleshipAbilityButtonDisabled"
          :class="['ability-button', store.state.computer.isUsingBattleshipAbility ? 'highlighted' : '']"
        >
          <Battleship class="ability-icon" />
        </button>
      </div>
    </div>

  </div>

</template>

<script lang="ts" setup>
import PlayerSquare from '@/components/PlayerSquare.vue';
import EnemySquare from '@/components/EnemySquare.vue';
import AbilityButtons from '@/components/AbilityButtons.vue';
import MatchResultModal from '@/components/MatchResultModal.vue';
import { useStore } from '@/store'
import { computed } from 'vue';

// SVGs
import Submarine from '@/components/SVGs/Ships/Submarine.vue';
import AircraftCarrier from '@/components/SVGs/Ships/AircraftCarrier.vue';
import Battleship from '@/components/SVGs/Ships/Battleship.vue';


const store = useStore()

const selectedPlayerAbility = computed(() => {
  if (store.state.player.isUsingAircraftCarrierAbility) return 'Aircraft Carrier Attack';
  if (store.state.player.isUsingBattleshipAbility) return 'Battleship Attack';
  if (store.state.player.isUsingSubmarineAbility) return 'Submarine Attack';
  return 'Normal Attack';
});

const selectedComputerAbility = computed(() => {
  if (store.state.computer.isUsingAircraftCarrierAbility) return 'Aircraft Carrier Attack';
  if (store.state.computer.isUsingBattleshipAbility) return 'Battleship Attack';
  if (store.state.computer.isUsingSubmarineAbility) return 'Submarine Attack';
  return 'Normal Attack';
});

const isSubmarineAbilityButtonDisabled = computed(() => {
  return (
    store.state.player.hasCurrentTurn
    || store.state.computer.hasUsedSubmarineAbility
    || store.state.computer.isUsingSubmarineAbility
    || store.state.computer.isUsingAircraftCarrierAbility
    || store.state.computer.isUsingBattleshipAbility
  )
})

const isAircraftCarrierAbilityButtonDisabled = computed(() => {
  return (
    store.state.player.hasCurrentTurn
    || store.state.computer.hasUsedAircraftCarrierAbility
    || store.state.computer.isUsingSubmarineAbility
    || store.state.computer.isUsingAircraftCarrierAbility
    || store.state.computer.isUsingBattleshipAbility
  )
})

const isBattleshipAbilityButtonDisabled = computed(() => {
  return (
    store.state.player.hasCurrentTurn
    || store.state.computer.hasUsedBattleshipAbility
    || store.state.computer.isUsingSubmarineAbility
    || store.state.computer.isUsingAircraftCarrierAbility
    || store.state.computer.isUsingBattleshipAbility
  )
})
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

.ability-button-container {
  display: flex;
  justify-content: space-between;
}

.ability-button {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  border: 2px solid #000000;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.ability-button:hover:not(:disabled) {
  background-color: #dddddd;
}

.ability-button:disabled {
  background-color: #cccccc;
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
</style>