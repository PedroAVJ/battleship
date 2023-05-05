<template>
  <div class="ability-button-container">
    <button data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Uncover a 3x3 area of the computer's board"
      ref="submarine" :disabled="isSubmarineAbilityButtonDisabled" @click="useSubmarineAbility"
      :class="submarineAbilityButtonClasses">
      <Submarine class="ability-icon" />
    </button>
    <button data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Gives you 2 extra turns" ref="aircraftCarrier"
      :disabled="isAircraftCarrierAbilityButtonDisabled" @click="useAircraftCarrierAbility"
      :class="aircraftCarrierAbilityButtonClasses">
      <AircraftCarrier class="ability-icon" />
    </button>
    <button data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Hits a 3x3 area of the computer's board"
      ref="battleship" :disabled="isBattleshipAbilityButtonDisabled" @click="useBattleshipAbility"
      :class="battleshipAbilityButtonClasses">
      <Battleship class="ability-icon" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { onMounted, ref, Ref } from 'vue';
import { Tooltip } from 'bootstrap';

// SVGs
import Submarine from '@/components/SVGs/Ships/Submarine.vue';
import AircraftCarrier from '@/components/SVGs/Ships/AircraftCarrier.vue';
import Battleship from '@/components/SVGs/Ships/Battleship.vue';


const store = useStore()
const router = useRouter()

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
  if (store.player.hasCurrentTurn) {
    return (
      store.player.submarine.hasUsedAbility

      || store.player.submarine.isUsingAbility
      || store.player.aircraftCarrier.isUsingAbility
      || store.player.battleship.isUsingAbility
    )
  } else {
    return (
      store.computer.submarine.hasUsedAbility

      || store.computer.submarine.isUsingAbility
      || store.computer.aircraftCarrier.isUsingAbility
      || store.computer.battleship.isUsingAbility
    )
  }
})

const isAircraftCarrierAbilityButtonDisabled = computed(() => {
  if (store.player.hasCurrentTurn) {
    return (
      store.player.aircraftCarrier.hasUsedAbility

      || store.player.submarine.isUsingAbility
      || store.player.aircraftCarrier.isUsingAbility
      || store.player.battleship.isUsingAbility
    )
  } else {
    return (
      store.computer.aircraftCarrier.hasUsedAbility

      || store.computer.submarine.isUsingAbility
      || store.computer.aircraftCarrier.isUsingAbility
      || store.computer.battleship.isUsingAbility
    )
  }
})

const isBattleshipAbilityButtonDisabled = computed(() => {
  if (store.player.hasCurrentTurn) {
    return (
      store.player.battleship.hasUsedAbility

      || store.player.submarine.isUsingAbility
      || store.player.aircraftCarrier.isUsingAbility
      || store.player.battleship.isUsingAbility
    )
  } else {
    return (
      store.computer.battleship.hasUsedAbility

      || store.computer.submarine.isUsingAbility
      || store.computer.aircraftCarrier.isUsingAbility
      || store.computer.battleship.isUsingAbility
    )
  }
})

const submarineAbilityButtonClasses = computed(() => {
  return [
    'ability-button',
    store.player.submarine.isUsingAbility || store.computer.submarine.isUsingAbility ? 'highlighted' : ''
  ]
})

const aircraftCarrierAbilityButtonClasses = computed(() => {
  return [
    'ability-button',
    store.player.aircraftCarrier.isUsingAbility || store.computer.aircraftCarrier.isUsingAbility ? 'highlighted' : ''
  ]
})

const battleshipAbilityButtonClasses = computed(() => {
  return [
    'ability-button',
    store.player.battleship.isUsingAbility || store.computer.battleship.isUsingAbility ? 'highlighted' : ''
  ]
})

function useSubmarineAbility() {
  if (store.player.hasCurrentTurn) {
    store.setPlayerSubmarineIsUsingAbility(true);
  } else if (store.computer.hasCurrentTurn) {
    store.setComputerSubmarineIsUsingAbility(true);
  }
}

function useAircraftCarrierAbility() {
  if (store.player.hasCurrentTurn) {
    store.setPlayerAircraftCarrierIsUsingAbility(true);
  } else if (store.computer.hasCurrentTurn) {
    store.setComputerAircraftCarrierIsUsingAbility(true);
  }
}

function useBattleshipAbility() {
  if (store.player.hasCurrentTurn) {
    store.setPlayerBattleshipIsUsingAbility(true);
  } else if (store.computer.hasCurrentTurn) {
    store.setComputerBattleshipIsUsingAbility(true);
  }
}
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
