<template>
    <div class="ship-selection-container">
      <h2 class="ship-selection-title">Select Your Ships</h2>
      <div class="ship-cards">
        <div class="ship-card">
          <h3 class="ship-name">Aircraft Carrier</h3>
          <p class="ship-info">
            <span class="ship-count">Count: 1</span>
            <span class="ship-description">Size: 5x2</span>
          </p>
          <p class="ship-special-ability">
            Special Ability: Once per game, attack with a 3x3 blast radius. Discloses ship location. Inaccessible after ship destruction.
          </p>
        </div>
        <div class="ship-card">
          <h3 class="ship-name">Submarine</h3>
          <p class="ship-info">
            <span class="ship-count">Count: 1</span>
            <span class="ship-description">Size: 1x1</span>
          </p>
          <p class="ship-special-ability">
            Special Ability: Once per game, scan a 5x5 area. Discloses ship location. Inaccessible after ship destruction.
          </p>
        </div>
        <div class="ship-inputs">
          <div class="ship-input">
            <label for="supplyBoatCount" class="ship-name">Supply Boat</label>
            <input type="number" id="supplyBoatCount" class="ship-count-input" v-model="supplyBoatCount" max="5" min="0" />
            <span class="ship-description">Size: 2x1</span>
          </div>
          <div class="ship-input">
            <label for="destroyerCount" class="ship-name">Destroyer</label>
            <input type="number" id="destroyerCount" class="ship-count-input" v-model="destroyerCount" max="5" min="0" />
            <span class="ship-description">Size: 3x1</span>
          </div>
          <div class="ship-input">
            <label for="battleshipCount" class="ship-name">Battleship</label>
            <input type="number" id="battleshipCount" class="ship-count-input" v-model="battleshipCount" max="5" min="0" />
            <span class="ship-description">Size: 4x1</span>
          </div>
          <div class="ship-input">
            <label for="frigateCount" class="ship-name">Frigate</label>
            <input type="number" id="frigateCount" class="ship-count-input" v-model="frigateCount" max="5" min="0" />
            <span class="ship-description">Size: 5x1</span>
          </div>
        </div>
      </div>
      <button class="start-room-button" @click="setShipCounts">Start Room</button>
    </div>
  </template>

<script lang="ts" setup>
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { MutationType } from '@/types/store.interface'


const router = useRouter()
const store = useStore()

const supplyBoatCount = ref(0)
const destroyerCount = ref(0)
const battleshipCount = ref(0)
const frigateCount = ref(0)

function setShipCounts() {

    store.commit(MutationType.SET_GAME_SUBMARINE_COUNT, 1)
    store.commit(MutationType.SET_GAME_SUPPLY_BOAT_COUNT, supplyBoatCount.value)
    store.commit(MutationType.SET_GAME_DESTROYER_COUNT, destroyerCount.value)
    store.commit(MutationType.SET_GAME_BATTLESHIP_COUNT, battleshipCount.value)
    store.commit(MutationType.SET_GAME_FRIGATE_COUNT, frigateCount.value)
    store.commit(MutationType.SET_GAME_AIRCRAFT_CARRIER_COUNT, 1)

    store.commit(MutationType.SET_GUI_SUBMARINE_COUNT, 1)
    store.commit(MutationType.SET_GUI_SUPPLY_BOAT_COUNT, supplyBoatCount.value)
    store.commit(MutationType.SET_GUI_DESTROYER_COUNT, destroyerCount.value)
    store.commit(MutationType.SET_GUI_BATTLESHIP_COUNT, battleshipCount.value)
    store.commit(MutationType.SET_GUI_FRIGATE_COUNT, frigateCount.value)
    store.commit(MutationType.SET_GUI_AIRCRAFT_CARRIER_COUNT, 1)
    
    store.commit(MutationType.SET_PLAYER_HAS_USED_SUBMARINE_ABILITY, false)
    store.commit(MutationType.SET_PLAYER_HAS_USED_AIRCRAFT_CARRIER_ABILITY, false)
    store.commit(MutationType.SET_PLAYER_IS_USING_SUBMARINE_ABILITY, false)
    store.commit(MutationType.SET_PLAYER_IS_USING_AIRCRAFT_CARRIER_ABILITY, false)

    router.push({ name: 'Game' })
}
</script>

<style scoped>
.ship-selection-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  text-align: center;
}

.ship-selection-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.ship-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: stretch;
}
.ship-card {
  background-color: #bdc3c7;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  flex-basis: 45%;
  box-sizing: border-box;
}

.ship-name {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #34495e;
}

.ship-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.ship-description {
  font-weight: 600;
}

.ship-special-ability {
  text-align: left;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.ship-inputs {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: stretch;
}

.ship-input {
  flex-basis: 45%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.ship-count-input {
  width: 50px;
}

.start-room-button {
  background-color: #3498db;
  color: #ffffff;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.start-room-button:hover {
  background-color: #2980b9;
}
</style>

