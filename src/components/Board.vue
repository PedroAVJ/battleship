<template>
  <div class="board-wrapper">
    <div class="board">
      <div v-for="(row, rowIndex) in props.board" :key="rowIndex" class="board-row">
        <div v-for="(col, colIndex) in row" :key="colIndex" class="board-cell">
          <PlayerSquare :tile="col" :row="rowIndex" :col="colIndex" v-if="props.user === 'player'" />
          <EnemySquare :tile="col" :row="rowIndex" :col="colIndex" v-if="props.user === 'computer'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PlayerSquare from '@/components/PlayerSquare.vue';
import EnemySquare from './EnemySquare.vue';
import Tile from '@/types/Tile';


interface Props {
  board: Tile[][];
  user: 'player' | 'computer';
}

const props = defineProps<Props>();
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