<template>
  <div class="map-selection-container">
    <h2 class="map-selection-title">
      Select Map
    </h2>
    <div id="carouselExample" class="carousel slide">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="0" class="active" aria-current="true"
          aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="2" aria-label="Slide 3"></button>
        <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="3" aria-label="Slide 4"></button>
      </div>
      <div class="boards">
        <div class="carousel-item active">
          <CarouselItemContent :mapName="MapName.CLASSIC" />
        </div>
        <div class="carousel-item">
          <CarouselItemContent :mapName="MapName.THE_GREAT_DIVIDE" />
        </div>
        <div class="carousel-item">
          <CarouselItemContent :mapName="MapName.ARCHIPELAGO_ASSAULT" />
        </div>
        <div class="carousel-item">
          <CarouselItemContent :mapName="MapName.PACMAN" />
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CarouselItemContent from '@/components/CarouselItemContent.vue';
import MapName from '@/types/MapName';
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
  color: #e0e0e0;
}

.carousel-item {
  width: 100%;
  /* Set the width to 100% to fit the container */
}
</style>
