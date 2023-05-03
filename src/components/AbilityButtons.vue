<template>
  <div class="ability-button-container">
    <!-- Player button for using the submarine ability -->
    <button
      :disabled="isSubmarineAbilityButtonDisabled"
      @click="store.commit(Mutation.SET_PLAYER_IS_USING_SUBMARINE_ABILITY, true)"
      :class="['ability-button', store.state.player.isUsingSubmarineAbility ? 'highlighted' : '']"
    >
      <Submarine class="ability-icon" />
    </button>

    <!-- Player button for using the aircraft carrier ability -->
    <button
      :disabled="isAircraftCarrierAbilityButtonDisabled"
      @click="store.commit(Mutation.SET_PLAYER_IS_USING_AIRCRAFT_CARRIER_ABILITY, true)"
      :class="['ability-button', store.state.player.isUsingAircraftCarrierAbility ? 'highlighted' : '']"
    >
      <AircraftCarrier class="ability-icon" />
    </button>

    <!-- Player button for using the battleship ability -->
    <button
      :disabled="isBattleshipAbilityButtonDisabled"
      @click="store.commit(Mutation.SET_PLAYER_IS_USING_BATTLESHIP_ABILITY, true)"
      :class="['ability-button', store.state.player.isUsingBattleshipAbility ? 'highlighted' : '']"
    >
      <Battleship class="ability-icon" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import { Mutation } from '@/store/enums';
import { computed } from 'vue';

// SVGs
import Submarine from '@/components/SVGs/Ships/Submarine.vue';
import AircraftCarrier from '@/components/SVGs/Ships/AircraftCarrier.vue';
import Battleship from '@/components/SVGs/Ships/Battleship.vue';


const store = useStore()

const isSubmarineAbilityButtonDisabled = computed(() => {
  return (
    store.state.computer.hasCurrentTurn
    || store.state.player.hasUsedSubmarineAbility
    || store.state.player.isUsingSubmarineAbility
    || store.state.player.isUsingAircraftCarrierAbility
    || store.state.player.isUsingBattleshipAbility
  )
})

const isAircraftCarrierAbilityButtonDisabled = computed(() => {
  return (
    store.state.computer.hasCurrentTurn
    || store.state.player.hasUsedAircraftCarrierAbility
    || store.state.player.isUsingSubmarineAbility
    || store.state.player.isUsingAircraftCarrierAbility
    || store.state.player.isUsingBattleshipAbility
  )
})

const isBattleshipAbilityButtonDisabled = computed(() => {
  return (
    store.state.computer.hasCurrentTurn
    || store.state.player.hasUsedBattleshipAbility
    || store.state.player.isUsingSubmarineAbility
    || store.state.player.isUsingAircraftCarrierAbility
    || store.state.player.isUsingBattleshipAbility
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
