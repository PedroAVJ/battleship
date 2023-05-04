<template>

  <!-- Modal displayed if player or computer wins -->
  <MatchResultModal v-if="store.state.player.hasWonTheGame || store.state.computer.hasWonTheGame" />

  <!-- GUI -->
  <div class="containerrr">
    <h1 class="text">
      Battleship Game
    </h1>

    <!-- Boards -->
    <div class="boards">
      <div class="board-wrapper">
        <h2 class="computer-text">
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
        <h2 class="player-text">
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

      <!-- Button to start new Game -->
      <button class="btn btn-primary" @click="newGame" v-if="store.state.player.hasWonTheGame || store.state.computer.hasWonTheGame">
        Start New Game
      </button>
      <div v-else>

        <h3 v-if="store.state.player.hasCurrentTurn" class="player-text">
          Your Turn
        </h3>
        <h3 v-else class="computer-text">
          Enemy's Turn
        </h3>
  
        <!-- Display what ability is selected -->
        <div v-if="store.state.player.hasCurrentTurn">
          <h3 class="text">
            {{ selectedPlayerAbility }}
          </h3>
        </div>
        <div v-else-if="store.state.computer.hasCurrentTurn">
          <h3 class="text">
            {{ selectedComputerAbility }}
          </h3>
        </div>
  
        <!-- Display if it's the players turn and if any ability can be used -->
        <h3 v-if="store.state.player.hasCurrentTurn && (!store.state.player.hasUsedSubmarineAbility || !store.state.player.hasUsedAircraftCarrierAbility || !store.state.player.hasUsedBattleshipAbility)"
        class="text">
          Click to use an ability.
        </h3>
        <AbilityButtons v-if="store.state.player.hasCurrentTurn && (!store.state.player.hasUsedSubmarineAbility || !store.state.player.hasUsedAircraftCarrierAbility || !store.state.player.hasUsedBattleshipAbility)" />
        <div class="ability-button-container" v-else-if="store.state.computer.hasCurrentTurn && (!store.state.computer.hasUsedSubmarineAbility || !store.state.computer.hasUsedAircraftCarrierAbility || !store.state.computer.hasUsedBattleshipAbility)">
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

  </div>

</template>

<script lang="ts" setup>
import PlayerSquare from '@/components/PlayerSquare.vue';
import EnemySquare from '@/components/EnemySquare.vue';
import AbilityButtons from '@/components/AbilityButtons.vue';
import MatchResultModal from '@/components/MatchResultModal.vue';
import { useStore } from '@/store'
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { Mutation } from '@/store/enums';

// SVGs
import Submarine from '@/components/SVGs/Ships/Submarine.vue';
import AircraftCarrier from '@/components/SVGs/Ships/AircraftCarrier.vue';
import Battleship from '@/components/SVGs/Ships/Battleship.vue';


const store = useStore()
const router = useRouter()

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

function newGame() {
  store.commit(Mutation.SET_GAME_IS_IN_PROGRESS, false);
  store.commit(Mutation.SET_GAME_MAP_NAME, undefined);
  store.commit(Mutation.SET_GAME_IS_MOVE_IN_PROGRESS, false);

  store.commit(Mutation.SET_GUI_SUBMARINE_COUNT, 0);
  store.commit(Mutation.SET_GUI_SUPPLY_BOAT_COUNT, 0);
  store.commit(Mutation.SET_GUI_DESTROYER_COUNT, 0);
  store.commit(Mutation.SET_GUI_BATTLESHIP_COUNT, 0);
  store.commit(Mutation.SET_GUI_AIRCRAFT_CARRIER_COUNT, 0);

  store.commit(Mutation.SET_PLAYER_IS_USING_SUBMARINE_ABILITY, false)
  store.commit(Mutation.SET_PLAYER_IS_USING_AIRCRAFT_CARRIER_ABILITY, false)
  store.commit(Mutation.SET_PLAYER_IS_USING_BATTLESHIP_ABILITY, false)

  store.commit(Mutation.SET_PLAYER_HAS_USED_SUBMARINE_ABILITY, false)
  store.commit(Mutation.SET_PLAYER_HAS_USED_AIRCRAFT_CARRIER_ABILITY, false)
  store.commit(Mutation.SET_PLAYER_HAS_USED_BATTLESHIP_ABILITY, false)

  store.commit(Mutation.SET_PLAYER_AIRCRAFT_CARRIER_HEALTH, 10)
  store.commit(Mutation.SET_PLAYER_BATTLESHIP_HEALTH, 4)

  store.commit(Mutation.SET_PLAYER_AIRCRAFT_CARRIER_SHOTS, 0)

  store.commit(Mutation.SET_PLAYER_HAS_CURRENT_TURN, false)
  store.commit(Mutation.SET_PLAYER_HAS_WON_THE_GAME, false)

  store.commit(Mutation.SET_PLAYER_BOARD, [[]])

  store.commit(Mutation.SET_COMPUTER_IS_USING_SUBMARINE_ABILITY, false)
  store.commit(Mutation.SET_COMPUTER_IS_USING_AIRCRAFT_CARRIER_ABILITY, false)
  store.commit(Mutation.SET_COMPUTER_IS_USING_BATTLESHIP_ABILITY, false)

  store.commit(Mutation.SET_COMPUTER_HAS_USED_SUBMARINE_ABILITY, false)
  store.commit(Mutation.SET_COMPUTER_HAS_USED_AIRCRAFT_CARRIER_ABILITY, false)
  store.commit(Mutation.SET_COMPUTER_HAS_USED_BATTLESHIP_ABILITY, false)

  store.commit(Mutation.SET_COMPUTER_AIRCRAFT_CARRIER_HEALTH, 10)
  store.commit(Mutation.SET_COMPUTER_BATTLESHIP_HEALTH, 4)

  store.commit(Mutation.SET_COMPUTER_AIRCRAFT_CARRIER_SHOTS, 0)

  store.commit(Mutation.SET_COMPUTER_HAS_CURRENT_TURN, false)
  store.commit(Mutation.SET_COMPUTER_HAS_WON_THE_GAME, false)

  store.commit(Mutation.SET_COMPUTER_BOARD, [[]])

  router.push({ name: 'Index' })
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