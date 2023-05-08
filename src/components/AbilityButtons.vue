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
import { computed } from 'vue';
import { onMounted, ref, Ref } from 'vue';
import { Tooltip } from 'bootstrap';
import ShipName from '@/types/ShipName';

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
  if (store.player.hasCurrentTurn) {
    return (
      store.player[ShipName.SUBMARINE].hasUsedAbility

      || store.player[ShipName.SUBMARINE].isUsingAbility
      || store.player[ShipName.AIRCRAFT_CARRIER].isUsingAbility
      || store.player[ShipName.BATTLESHIP].isUsingAbility
    )
  } else {
    return (
      store.computer[ShipName.SUBMARINE].hasUsedAbility

      || store.computer[ShipName.SUBMARINE].isUsingAbility
      || store.computer[ShipName.AIRCRAFT_CARRIER].isUsingAbility
      || store.computer[ShipName.BATTLESHIP].isUsingAbility
    )
  }
})

const isAircraftCarrierAbilityButtonDisabled = computed(() => {
  if (store.player.hasCurrentTurn) {
    return (
      store.player[ShipName.AIRCRAFT_CARRIER].hasUsedAbility

      || store.player[ShipName.SUBMARINE].isUsingAbility
      || store.player[ShipName.AIRCRAFT_CARRIER].isUsingAbility
      || store.player[ShipName.BATTLESHIP].isUsingAbility
    )
  } else {
    return (
      store.computer[ShipName.AIRCRAFT_CARRIER].hasUsedAbility

      || store.computer[ShipName.SUBMARINE].isUsingAbility
      || store.computer[ShipName.AIRCRAFT_CARRIER].isUsingAbility
      || store.computer[ShipName.BATTLESHIP].isUsingAbility
    )
  }
})

const isBattleshipAbilityButtonDisabled = computed(() => {
  if (store.player.hasCurrentTurn) {
    return (
      store.player[ShipName.BATTLESHIP].hasUsedAbility

      || store.player[ShipName.SUBMARINE].isUsingAbility
      || store.player[ShipName.AIRCRAFT_CARRIER].isUsingAbility
      || store.player[ShipName.BATTLESHIP].isUsingAbility
    )
  } else {
    return (
      store.computer[ShipName.BATTLESHIP].hasUsedAbility

      || store.computer[ShipName.SUBMARINE].isUsingAbility
      || store.computer[ShipName.AIRCRAFT_CARRIER].isUsingAbility
      || store.computer[ShipName.BATTLESHIP].isUsingAbility
    )
  }
})

const submarineAbilityButtonClasses = computed(() => {
  if (store.player[ShipName.SUBMARINE].isUsingAbility || store.computer[ShipName.SUBMARINE].isUsingAbility) {
    return ['ability-button', 'highlighted']
  } else {
    return ['ability-button']
  }
})

const aircraftCarrierAbilityButtonClasses = computed(() => {
  if (store.player[ShipName.AIRCRAFT_CARRIER].isUsingAbility || store.computer[ShipName.AIRCRAFT_CARRIER].isUsingAbility) {
    return ['ability-button', 'highlighted']
  } else {
    return ['ability-button']
  }
})

const battleshipAbilityButtonClasses = computed(() => {
  if (store.player[ShipName.BATTLESHIP].isUsingAbility || store.computer[ShipName.BATTLESHIP].isUsingAbility) {
    return ['ability-button', 'highlighted']
  } else {
    return ['ability-button']
  }
})

function useSubmarineAbility() {
  if (store.player.hasCurrentTurn) {
    store.player[ShipName.SUBMARINE].hasUsedAbility = true;
  } else if (store.computer.hasCurrentTurn) {
    store.computer[ShipName.SUBMARINE].hasUsedAbility = true;
  }
}

function useAircraftCarrierAbility() {
  if (store.player.hasCurrentTurn) {
    store.player[ShipName.AIRCRAFT_CARRIER].hasUsedAbility = true;
  } else if (store.computer.hasCurrentTurn) {
    store.computer[ShipName.AIRCRAFT_CARRIER].hasUsedAbility = true;
  }
}

function useBattleshipAbility() {
  if (store.player.hasCurrentTurn) {
    store.player[ShipName.BATTLESHIP].hasUsedAbility = true;
  } else if (store.computer.hasCurrentTurn) {
    store.computer[ShipName.BATTLESHIP].hasUsedAbility = true;
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
