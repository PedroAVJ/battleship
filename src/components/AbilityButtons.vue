<template>
  <div class="ability-button-container">
    <!-- Player button for using the submarine ability -->
    <button
    data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Uncover a 3x3 area of the computer's board"
    ref="submarine"
      :disabled="isSubmarineAbilityButtonDisabled"
      @click="store.setPlayerSubmarineIsUsingAbility(true)"
      :class="['ability-button', store.player.submarine.isUsingAbility ? 'highlighted' : '']"
    >
      <Submarine class="ability-icon" />
    </button>

    <!-- Player button for using the aircraft carrier ability -->
    <button
      data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Gives you 2 extra turns"
      ref="aircraftCarrier"
      :disabled="isAircraftCarrierAbilityButtonDisabled"
      @click="store.setPlayerAircraftCarrierIsUsingAbility(true)"
      :class="['ability-button', store.player.aircraftCarrier.isUsingAbility
       ? 'highlighted' : '']"
    >
      <AircraftCarrier class="ability-icon" />
    </button>

    <!-- Player button for using the battleship ability -->
    <button
      data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Hits a 3x3 area of the computer's board"
      ref="battleship"
      :disabled="isBattleshipAbilityButtonDisabled"
      @click="store.setPlayerBattleshipIsUsingAbility(true)"
      :class="['ability-button', store.player.battleship.isUsingAbility
       ? 'highlighted' : '']"
    >
      <Battleship class="ability-icon" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import { computed } from 'vue';
import { onMounted, ref, Ref } from 'vue';
import { Tooltip } from 'bootstrap';

// SVGs
import Submarine from '@/components/SVGs/Ships/Submarine.vue';
import AircraftCarrier from '@/components/SVGs/Ships/AircraftCarrier.vue';
import Battleship from '@/components/SVGs/Ships/Battleship.vue';


const store = useStore()

// Tooltip
const submarine: Ref<HTMLElement | null> = ref(null)
const aircraftCarrier: Ref<HTMLElement | null> = ref(null)
const battleship: Ref<HTMLElement | null> = ref(null)

onMounted(() => {
  if (submarine.value) {
    const tooltipInstance = new Tooltip(submarine.value)
  }
  if (aircraftCarrier.value) {
    const tooltipInstance = new Tooltip(aircraftCarrier.value)
  }
  if (battleship.value) {
    const tooltipInstance = new Tooltip(battleship.value)
  }
})
const isSubmarineAbilityButtonDisabled = computed(() => {
  return (
    store.computer.hasCurrentTurn
    || store.player.submarine.hasUsedAbility
    || store.player.submarine.isUsingAbility
    || store.player.aircraftCarrier.isUsingAbility
    || store.player.battleship.isUsingAbility
  )
})

const isAircraftCarrierAbilityButtonDisabled = computed(() => {
  return (
    store.computer.hasCurrentTurn
    || store.player.aircraftCarrier.hasUsedAbility
    || store.player.submarine.isUsingAbility
    || store.player.aircraftCarrier.isUsingAbility
    || store.player.battleship.isUsingAbility
  )
})

const isBattleshipAbilityButtonDisabled = computed(() => {
  return (
    store.computer.hasCurrentTurn
    || store.player.battleship.hasUsedAbility
    || store.player.submarine.isUsingAbility
    || store.player.aircraftCarrier.isUsingAbility
    || store.player.battleship.isUsingAbility
  )
})
</script>

<style scoped>
.ability-button-container {
  display: flex;
  justify-content: space-between;
}

.ability-button {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ff9800;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.ability-button:hover:not(:disabled) {
  background-color: #f57c00;
}

.ability-button:disabled {
  /** Way darker orange */
  background-color: #b26a00;
  cursor: not-allowed;
}

.ability-icon {
  width: 50px;
  height: 50px;
}

/** Class for when the button is highlighted, border color should change to a light green */
.ability-button.highlighted {
  border-color: #00ff00;
}
</style>
