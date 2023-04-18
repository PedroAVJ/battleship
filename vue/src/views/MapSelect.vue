<template>
  <div class="map-selection-container">
    <h2 class="map-selection-title">Select Map</h2>
    <div class="map-buttons">
      <button class="map-button" @click="setMap(MapType.MAP1)">Small Map</button>
      <button class="map-button" @click="setMap(MapType.MAP2)">Medium Map</button>
      <button class="map-button" @click="setMap(MapType.MAP3)">Large Map</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import { RootState } from '@/types/store';
import { MapType } from '@/types/store';

const router = useRouter();
const store = useStore();

function setMap(map: RootState['map']) {
  store.commit('setMap', map);
  router.push({ name: 'ShipSelect' });
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
