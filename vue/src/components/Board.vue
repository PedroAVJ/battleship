<template>
  <div class="board">
    <div v-for="(row, rowIndex) in board" :key="rowIndex" class="board-row">
      <div v-for="(col, colIndex) in row" :key="colIndex" class="board-cell">
        <Square :tile="col" :row="rowIndex" :col="colIndex" :isPlayerBoard="isPlayerBoard" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Square from '@/components/Square.vue';
import { Tile } from '@/types/store.interface';


interface BoardProps {
  board: Tile[][];
  isPlayerBoard: boolean;
}

const props = defineProps<BoardProps>();
</script>

<style scoped>
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
