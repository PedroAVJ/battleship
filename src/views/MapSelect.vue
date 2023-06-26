<template>
  <div class="map-selection-container">
    <h2 class="primary-text">
      Elige un mapa
    </h2>
    <div id="carouselExample" class="carousel slide">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="2"></button>
        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="3"></button>
      </div>
      <div class="carousel-item active">
        <div class="carousel-item-content">
          <button class="primary-button" @click="setMap(MapName.CLASSIC)">
            {{ MapName.CLASSIC }}
          </button>
          <MapBoard :tiles="MAPS[MapName.CLASSIC]" user="player" />
        </div>
      </div>
      <div class="carousel-item">
        <div class="carousel-item-content">
          <button class="primary-button" @click="setMap(MapName.THE_GREAT_DIVIDE)">
            {{ MapName.THE_GREAT_DIVIDE }}
          </button>
          <MapBoard :tiles="MAPS[MapName.THE_GREAT_DIVIDE]" user="player" />
        </div>
      </div>
      <div class="carousel-item">
        <div class="carousel-item-content">
          <button class="primary-button" @click="setMap(MapName.ARCHIPELAGO_ASSAULT)">
            {{ MapName.ARCHIPELAGO_ASSAULT }}
          </button>
          <MapBoard :tiles="MAPS[MapName.ARCHIPELAGO_ASSAULT]" user="player" />
        </div>
      </div>
      <div class="carousel-item">
        <div class="carousel-item-content">
          <button class="primary-button" @click="setMap(MapName.PACMAN)">
            {{ MapName.PACMAN }}
          </button>
          <MapBoard :tiles="MAPS[MapName.PACMAN]" user="player" />
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
        <span class="visually-hidden">Anterior</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
        <span class="visually-hidden">Siguiente</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import MapBoard from '@/components/MapBoard.vue';
import { MapName } from '@/utils/Enums';
import { MAPS } from '@/utils/Constants';

const router = useRouter();
const store = useStore();

function setMap(mapName: MapName) {
  const tiles = MAPS[mapName];

  // First reset the store
  store.$reset();

  // Then set the tiles
  store.setPlayerBoard(tiles);
  store.setComputerBoard(tiles);

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

.carousel-item {
  width: 100%;
}

.carousel-item-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
