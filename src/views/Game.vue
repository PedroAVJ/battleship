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
      <AbilityButtons />
    </div>

  </div>

</template>

<script lang="ts" setup>
import PlayerSquare from '../components/PlayerSquare.vue';
import EnemySquare from '../components/EnemySquare.vue';
import AbilityButtons from '../components/AbilityButtons.vue';
import MatchResultModal from '../components/MatchResultModal.vue';
import { useStore } from '../store'


const store = useStore()
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
</style>