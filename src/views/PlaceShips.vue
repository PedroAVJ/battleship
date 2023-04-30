<template>

  <!-- Modal displayed if player has won -->
  <div v-if="store.state.player.won" class="winner-modal">
    <div class="winner-modal-content">
      <h2>You Win!</h2>
      <button @click="newGame">New Game</button>
    </div>
  </div>

  <!-- Modal displayed if player has lost -->
  <div v-if="store.state.enemy.won" class="winner-modal">
    <div class="winner-modal-content">
      <h2>You Lose!</h2>
      <button @click="newGame">New Game</button>
    </div>
  </div>

  <!-- Actual game -->
  <div class="container">
    <h1>Battleship Game</h1>
    <div class="boards">

      <!-- Game id not being present means a game is not in progress -->
      <div class="board-wrapper" v-if="store.state.game.id">

        <h2>Enemy Board</h2>
        <div class="board">
          <div v-for="(row, rowIndex) in store.state.enemy.board" :key="rowIndex" class="board-row">
            <div v-for="(col, colIndex) in row" :key="colIndex" class="board-cell">
              <EnemySquare :tile="col" :row="rowIndex" :col="colIndex" :isPlayerBoard="false" />
            </div>
          </div>
        </div>
      </div>
      <div class="board-wrapper">
        <h2>Player Board</h2>
        <div class="board">
          <div v-for="(row, rowIndex) in store.state.player.board" :key="rowIndex" class="board-row">
            <div v-for="(col, colIndex) in row" :key="colIndex" class="board-cell">
              <PlayerSquare :tile="col" :row="rowIndex" :col="colIndex" :isPlayerBoard="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="gui">
      <h2>GUI</h2>

      <!-- Game id not being present means a game is not in progress -->
      <div v-if="!store.state.game.id">
        <ShipDrawer v-if="Object.values(store.state.gui).reduce((sum, value) => sum + value, 0) !== 0" />

        <!-- Display if total number of gui ships is 0 -->
        <button
          v-if="Object.values(store.state.gui).reduce((sum, value) => sum + value, 0) === 0"
          @click="startGame"
        >Start Game</button>

      </div>
      <div v-else>
        <h3 v-if="store.state.game.isPlayersTurn">Your Turn</h3>
        <h3
          v-else
          @click="store.commit('setGameIsPlayersTurn', true)"
        >Enemy's Turn</h3>
        <button
          :disabled="
            store.state.player.hasUsedSubmarineAbility
            || store.state.player.isUsingSubmarineAbility
            || store.state.player.isUsingAircraftCarrierAbility
            || !store.state.game.isPlayersTurn
          "
          @click="store.commit('setPlayerIsUsingSubmarineAbility', true)"
        >
          {{
            store.state.player.isUsingSubmarineAbility
              ? 'Using Submarine Ability'
              : 'Use Submarine Ability'
          }}
        </button>
        <button
          :disabled="
            store.state.player.hasUsedAircraftCarrierAbility
            || store.state.player.isUsingSubmarineAbility
            || store.state.player.isUsingAircraftCarrierAbility
            || !store.state.game.isPlayersTurn
          "
          @click="store.commit('setPlayerIsUsingAircraftCarrierAbility', true)"
        >
          {{
            store.state.player.isUsingAircraftCarrierAbility
              ? 'Using Aircraft Carrier Ability'
              : 'Use Aircraft Carrier Ability'
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ShipDrawer from '@/components/ShipDrawer.vue';
import PlayerSquare from '@/components/PlayerSquare.vue';
import EnemySquare from '@/components/EnemySquare.vue';
import { useStore } from '@/store'
import { MutationType } from '@/types/store.interface';
import { useRouter } from 'vue-router';


const store = useStore()
const router = useRouter()

function startGame() {
  fetch('http://localhost:8000/api/start_game/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      computer_board: JSON.stringify(store.state.enemy.board),
      player_board: JSON.stringify(store.state.player.board),

      submarine_count: store.state.game.submarineCount,
      aircraft_carrier_count: store.state.game.aircraftCarrierCount,
      destroyer_count: store.state.game.destroyerCount,
      frigate_count: store.state.game.frigateCount,
      battleship_count: store.state.game.battleshipCount,
      supply_boat_count: store.state.game.supplyBoatCount,
    })
  })
  .then(response => response.json())
  .then(data => {
    store.commit(MutationType.SET_GAME_IS_PLAYERS_TURN, true)
    store.commit(MutationType.SET_GAME_ID, data.id)
  })
  .catch(error => {
    console.error('Error when starting game:', error)
  })
}

/**
 * Resets the game state to the initial state and redirects to the home page
 */
function newGame() {

  // Dummy game id to indicate that a game is not in progress
  store.commit(MutationType.SET_GAME_ID, -1)

  store.commit(MutationType.SET_GAME_IS_PLAYERS_TURN, true)
  store.commit(MutationType.SET_GAME_AIRCRAFT_CARRIER_HEALTH, 10)

  store.commit(MutationType.SET_GAME_SUBMARINE_COUNT, 0)
  store.commit(MutationType.SET_GAME_AIRCRAFT_CARRIER_COUNT, 0)
  store.commit(MutationType.SET_GAME_DESTROYER_COUNT, 0)
  store.commit(MutationType.SET_GAME_FRIGATE_COUNT, 0)
  store.commit(MutationType.SET_GAME_BATTLESHIP_COUNT, 0)
  store.commit(MutationType.SET_GAME_SUPPLY_BOAT_COUNT, 0)

  store.commit(MutationType.SET_GUI_SUBMARINE_COUNT, 0)
  store.commit(MutationType.SET_GUI_AIRCRAFT_CARRIER_COUNT, 0)
  store.commit(MutationType.SET_GUI_DESTROYER_COUNT, 0)
  store.commit(MutationType.SET_GUI_FRIGATE_COUNT, 0)
  store.commit(MutationType.SET_GUI_BATTLESHIP_COUNT, 0)
  store.commit(MutationType.SET_GUI_SUPPLY_BOAT_COUNT, 0)

  store.commit(MutationType.SET_PLAYER_IS_USING_SUBMARINE_ABILITY, false)
  store.commit(MutationType.SET_PLAYER_IS_USING_AIRCRAFT_CARRIER_ABILITY, false)
  store.commit(MutationType.SET_PLAYER_HAS_USED_SUBMARINE_ABILITY, false)
  store.commit(MutationType.SET_PLAYER_HAS_USED_AIRCRAFT_CARRIER_ABILITY, false)

  store.commit(MutationType.SET_PLAYER_BOARD, [[]])
  store.commit(MutationType.SET_PLAYER_WON, false)
  store.commit(MutationType.SET_ENEMY_BOARD, [[]])
  store.commit(MutationType.SET_ENEMY_WON, false)

  router.push({ name: 'Index' })
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

.winner-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.winner-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}
</style>