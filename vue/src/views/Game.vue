<template>
  <div class="container">
    <h1>Battleship Game</h1>
    <div class="boards">
      <div class="board-wrapper">
        <h2>Enemy Board</h2>
        <Board :board="store.state.enemyBoard" />
      </div>
      <div class="board-wrapper">
        <h2>Player Board</h2>
        <Board :board="store.state.playerBoard" />
      </div>
    </div>
    <div class="gui">
      <h2>GUI</h2>
      <!-- Add your GUI components here -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import Board from '@/components/Board.vue'
import { useStore } from '@/store'
import { onMounted } from 'vue';

const store = useStore()

onMounted(() => {
    store.dispatch('initializeBoards')
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
</style>
