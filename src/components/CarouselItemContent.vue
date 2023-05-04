<template>
  <div class="carousel-item-content">
    <button class="map-button" @click="setMap">
      {{ MAPS[props.mapName].name }}
    </button>
    <Board :board="board" user="player" />
  </div>
</template>

<script lang="ts" setup>
import Board from './Board.vue';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import MAPS from '@/constants/Maps';
import MapName from '@/types/MapName';
import Tile from '@/types/Tile';
import Mutation from '@/types/Mutation';
import SHIPS from '@/constants/Ships';


interface Props {
  mapName: MapName;
}

const props: Props = defineProps<Props>();

const router = useRouter();
const store = useStore();

const board = JSON.parse(JSON.stringify(MAPS[props.mapName].map)) as Tile[][];

function setMap() {
  store.commit(Mutation.SET_GUI_SUBMARINE_COUNT, SHIPS['Submarine'].count);
  store.commit(Mutation.SET_GUI_SUPPLY_BOAT_COUNT, SHIPS['Supply Boat'].count);
  store.commit(Mutation.SET_GUI_DESTROYER_COUNT, SHIPS['Destroyer'].count);
  store.commit(Mutation.SET_GUI_BATTLESHIP_COUNT, SHIPS['Battleship'].count);
  store.commit(Mutation.SET_GUI_FRIGATE_COUNT, SHIPS['Frigate'].count);
  store.commit(Mutation.SET_GUI_AIRCRAFT_CARRIER_COUNT, SHIPS['Aircraft Carrier'].count);

  // Deep copy the map, as MAPS uses the same object reference for each tile
  const computerBoard = JSON.parse(JSON.stringify(board)) as Tile[][]
  const playerBoard = JSON.parse(JSON.stringify(board)) as Tile[][]

  store.commit(Mutation.SET_PLAYER_BOARD, playerBoard);
  store.commit(Mutation.SET_COMPUTER_BOARD, computerBoard);

  router.push({ name: 'PlaceShips' });
}
</script>

<style scoped>
.map-button {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.map-button {
  background-color: #ff9800;
  border: none;
  border-radius: 4px;
  color: #e0e0e0;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  transition: background-color 0.3s;
}

.map-button:hover {
  background-color: #f57c00;
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

.carousel-item-content {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>