<template>
    <div class="game-board">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        :width="boardSize"
        :height="boardSize"
        viewBox="0 0 500 500"
      >
        <!-- Background -->
        <rect width="100%" height="100%" fill="lightblue" />
  
        <!-- Grid lines -->
        <path
          v-for="(line, index) in gridLines"
          :key="index"
          :d="line.path"
          stroke="rgba(255, 255, 255, 0.3)"
          stroke-width="1"
        />
  
        <!-- Islands -->
        <circle
          v-for="(island, index) in islands"
          :key="index"
          :cx="island.x"
          :cy="island.y"
          :r="island.radius"
          fill="green"
        />
  
        <!-- Ships -->
        <rect
          v-for="(ship, index) in ships"
          :key="index"
          :x="ship.x"
          :y="ship.y"
          :width="ship.width"
          :height="ship.height"
          fill="gray"
        />
      </svg>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        boardSize: 500,
        gridSize: 10,
        islands: [
          { x: 100, y: 100, radius: 20 },
          { x: 400, y: 300, radius: 25 },
        ],
        ships: [
          { x: 50, y: 400, width: 10, height: 50 },
          { x: 200, y: 200, width: 50, height: 10 },
        ],
      };
    },
    computed: {
      gridLines() {
        const lines = [];
        const step = this.boardSize / this.gridSize;
  
        for (let i = 1; i < this.gridSize; i++) {
          const pos = i * step;
          lines.push({ path: `M0 ${pos} h${this.boardSize}` });
          lines.push({ path: `M${pos} 0 v${this.boardSize}` });
        }
  
        return lines;
      },
    },
  };
  </script>
  
  <style scoped>
  .game-board {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    background-color: #f0f0f0;
  }
  </style>
  