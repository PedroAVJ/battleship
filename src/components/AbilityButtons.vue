<template>
  <div class="ability-button-container">
    <button data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Descubre un área de 3x3 del tablero del enemigo"
      ref="submarine" :disabled="isSubmarineAbilityButtonDisabled" @click="useSubmarineAbility"
      :class="submarineAbilityButtonClasses">
      <Submarine class="ability-icon" />
    </button>
    <button data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Te da 2 turnos extra" ref="aircraftCarrier"
      :disabled="isAircraftCarrierAbilityButtonDisabled" @click="useAircraftCarrierAbility"
      :class="aircraftCarrierAbilityButtonClasses">
      <AircraftCarrier class="ability-icon" />
    </button>
    <button data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Golpea un área de 3x3 del tablero del enemigo"
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
import { ShipName } from '@/utils/Enums';

// SVGs
import Submarine from '@/components/SVGs/Ships/Submarine.vue';
import AircraftCarrier from '@/components/SVGs/Ships/AircraftCarrier.vue';
import Battleship from '@/components/SVGs/Ships/Battleship.vue';


const store = useStore()

// This determines if the user is on a mobile device
const isMobile = computed(() => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))

// Tooltip
const submarine: Ref<HTMLElement | null> = ref(null)
const aircraftCarrier: Ref<HTMLElement | null> = ref(null)
const battleship: Ref<HTMLElement | null> = ref(null)

const submarineTooltip: Ref<Tooltip | null> = ref(null)
const aircraftCarrierTooltip: Ref<Tooltip | null> = ref(null)
const battleshipTooltip: Ref<Tooltip | null> = ref(null)

onMounted(() => {
  if (isMobile.value) return;
  if (submarine.value) {
    submarineTooltip.value = new Tooltip(submarine.value)
  }
  if (aircraftCarrier.value) {
    aircraftCarrierTooltip.value = new Tooltip(aircraftCarrier.value)
  }
  if (battleship.value) {
    battleshipTooltip.value = new Tooltip(battleship.value)
  }
})

function hideTooltips() {
  if (submarineTooltip.value) {
    submarineTooltip.value.hide();
  }
  if (aircraftCarrierTooltip.value) {
    aircraftCarrierTooltip.value.hide();
  }
  if (battleshipTooltip.value) {
    battleshipTooltip.value.hide();
  }
}

const isSubmarineAbilityButtonDisabled = computed(() => {
  if (store.player.hasCurrentTurn) {
    return (
      store.player.isMakingMove
      || store.player[ShipName.SUBMARINE].hasUsedAbility
      || store.player[ShipName.SUBMARINE].isUsingAbility
      || store.player[ShipName.AIRCRAFT_CARRIER].isUsingAbility
      || store.player[ShipName.BATTLESHIP].isUsingAbility
    )
  } else {
    return (
      store.computer.isMakingMove
      || store.computer[ShipName.SUBMARINE].hasUsedAbility
      || store.computer[ShipName.SUBMARINE].isUsingAbility
      || store.computer[ShipName.AIRCRAFT_CARRIER].isUsingAbility
      || store.computer[ShipName.BATTLESHIP].isUsingAbility
    )
  }
})

const isAircraftCarrierAbilityButtonDisabled = computed(() => {
  if (store.player.hasCurrentTurn) {
    return (
      store.player.isMakingMove
      || store.player[ShipName.AIRCRAFT_CARRIER].hasUsedAbility
      || store.player[ShipName.SUBMARINE].isUsingAbility
      || store.player[ShipName.AIRCRAFT_CARRIER].isUsingAbility
      || store.player[ShipName.BATTLESHIP].isUsingAbility
    )
  } else {
    return (
      store.computer.isMakingMove
      || store.computer[ShipName.AIRCRAFT_CARRIER].hasUsedAbility
      || store.computer[ShipName.SUBMARINE].isUsingAbility
      || store.computer[ShipName.AIRCRAFT_CARRIER].isUsingAbility
      || store.computer[ShipName.BATTLESHIP].isUsingAbility
    )
  }
})

const isBattleshipAbilityButtonDisabled = computed(() => {
  if (store.player.hasCurrentTurn) {
    return (
      store.player.isMakingMove
      || store.player[ShipName.BATTLESHIP].hasUsedAbility
      || store.player[ShipName.SUBMARINE].isUsingAbility
      || store.player[ShipName.AIRCRAFT_CARRIER].isUsingAbility
      || store.player[ShipName.BATTLESHIP].isUsingAbility
    )
  } else {
    return (
      store.computer.isMakingMove
      || store.computer[ShipName.BATTLESHIP].hasUsedAbility
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
    store.player[ShipName.SUBMARINE].isUsingAbility = true;
  }
  hideTooltips();
}

function useAircraftCarrierAbility() {
  if (store.player.hasCurrentTurn) {
    store.player[ShipName.AIRCRAFT_CARRIER].isUsingAbility = true;
  }
  hideTooltips();
}

function useBattleshipAbility() {
  if (store.player.hasCurrentTurn) {
    store.player[ShipName.BATTLESHIP].isUsingAbility = true;
  }
  hideTooltips();
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
