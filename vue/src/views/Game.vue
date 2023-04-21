<template>
  <div class="container">
    <h1>Battleship Game</h1>
    <div class="boards">
      <div class="board-wrapper" v-if="store.state.game.isInProgress">
        <h2>Enemy Board</h2>
        <Board :board="store.state.enemy.board" :is-player-board="false" />
      </div>
      <div class="board-wrapper">
        <h2>Player Board</h2>
        <Board :board="store.state.player.board" :is-player-board="true" />
      </div>
    </div>
    <div class="gui">
      <h2>GUI</h2>
      <div v-if="!store.state.game.isInProgress">
        <ShipDrawer />

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
        <button @click="store.commit('setGameIsInProgress', false)">End Game</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Board from '@/components/Board.vue'
import ShipDrawer from '@/components/ShipDrawer.vue';
import { useStore } from '@/store'

const store = useStore()

function startGame() {
  store.commit('setGameIsInProgress', true)
  store.commit('setGameIsPlayersTurn', true)
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
</style>