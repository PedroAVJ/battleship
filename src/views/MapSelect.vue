<template>
  <div class="map-selection-container">
    <h2 class="map-selection-title">
      Select Map
    </h2>
    <div class="map-buttons">
      <button class="map-button" @click="setMap(MapName.MAP1)">
        Small Map
      </button>
      <button class="map-button" @click="setMap(MapName.MAP2)">
        Medium Map
      </button>
      <button class="map-button" @click="setMap(MapName.MAP3)">
        Large Map
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import { MapName, Mutation, ShipName } from '@/store/enums';
import { MAPS, SHIP_COUNTS } from '@/store/constants';
import { Tile } from '@/store/interfaces';


const router = useRouter();
const store = useStore();

function setMap(mapName: MapName) {
  store.commit(Mutation.SET_GAME_MAP_NAME, mapName);

  store.commit(Mutation.SET_GUI_SUBMARINE_COUNT, SHIP_COUNTS[ShipName.SUBMARINE]);
  store.commit(Mutation.SET_GUI_SUPPLY_BOAT_COUNT, SHIP_COUNTS[ShipName.SUPPLY_BOAT]);
  store.commit(Mutation.SET_GUI_DESTROYER_COUNT, SHIP_COUNTS[ShipName.DESTROYER]);
  store.commit(Mutation.SET_GUI_BATTLESHIP_COUNT, SHIP_COUNTS[ShipName.BATTLESHIP]);
  store.commit(Mutation.SET_GUI_FRIGATE_COUNT, SHIP_COUNTS[ShipName.FRIGATE]);
  store.commit(Mutation.SET_GUI_AIRCRAFT_CARRIER_COUNT, SHIP_COUNTS[ShipName.AIRCRAFT_CARRIER]);

  const map = MAPS[mapName];

  // Deep copy the map, as MAPS uses the same object reference for each tile
  const computerBoard = JSON.parse(JSON.stringify(map)) as Tile[][];
  const playerBoard = JSON.parse(JSON.stringify(map)) as Tile[][];

  store.commit(Mutation.SET_PLAYER_BOARD, playerBoard);
  store.commit(Mutation.SET_COMPUTER_BOARD, computerBoard);

  router.push({ name: 'PlaceShips' });
}
</script>

<style scoped>
.map-selection-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.map-selection-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.map-buttons {
  display: flex;
  gap: 1rem;
}

.map-button {
  background-color: #42b983;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  transition: background-color 0.3s;
}

.map-button:hover {
  background-color: #2a9657;
}
</style>
