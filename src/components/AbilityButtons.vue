<template>
  <!-- Player button for using the submarine ability -->
  <button
    :disabled="isSubmarineAbilityButtonDisabled"
    @click="store.commit(Mutation.SET_PLAYER_HAS_USED_SUBMARINE_ABILITY, true)"
  >
    {{ submarineAbilityButtonText }}
  </button>

  <!-- Player button for using the aircraft carrier ability -->
  <button
    :disabled="isAircraftCarrierAbilityButtonDisabled"
    @click="store.commit(Mutation.SET_PLAYER_HAS_USED_AIRCRAFT_CARRIER_ABILITY, true)"
  >
    {{ aircraftCarrierAbilityButtonText }}
  </button>

  <!-- Player button for using the battleship ability -->
  <button
    :disabled="isBattleshipAbilityButtonDisabled"
    @click="store.commit(Mutation.SET_PLAYER_HAS_USED_BATTLESHIP_ABILITY, true)"
  >
    {{ battleshipAbilityButtonText }}
  </button>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import { Mutation } from '@/store/enums';
import { computed } from 'vue';


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

const submarineAbilityButtonText = computed(() => {
  return store.state.player.isUsingSubmarineAbility
    ? 'Using Submarine Ability'
    : 'Use Submarine Ability'
})

const aircraftCarrierAbilityButtonText = computed(() => {
  return store.state.player.isUsingAircraftCarrierAbility
    ? 'Using Aircraft Carrier Ability'
    : 'Use Aircraft Carrier Ability'
})

const battleshipAbilityButtonText = computed(() => {
  return store.state.player.isUsingBattleshipAbility
    ? 'Using Battleship Ability'
    : 'Use Battleship Ability'
})
</script>