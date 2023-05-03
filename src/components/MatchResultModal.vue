<template>
  <div class="winner-modal">
    <div class="winner-modal-content">
      <h2 v-if="store.state.player.hasWonTheGame">
        You Win!
      </h2>
      <h2 v-else-if="store.state.computer.hasWonTheGame">
        You Lose!
      </h2>
      <button @click="newGame">
        New Game
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import { useRouter } from 'vue-router';
import { Mutation } from '@/store/enums';


const store = useStore();
const router = useRouter();

/**
 * Resets the root state to the initial state and redirects to the home page
 */
function newGame() {
  store.commit(Mutation.SET_GAME_IS_IN_PROGRESS, false);
  store.commit(Mutation.SET_GAME_MAP_NAME, undefined);
  store.commit(Mutation.SET_GAME_IS_MOVE_IN_PROGRESS, false);

  store.commit(Mutation.SET_GUI_SUBMARINE_COUNT, 0);
  store.commit(Mutation.SET_GUI_SUPPLY_BOAT_COUNT, 0);
  store.commit(Mutation.SET_GUI_DESTROYER_COUNT, 0);
  store.commit(Mutation.SET_GUI_BATTLESHIP_COUNT, 0);
  store.commit(Mutation.SET_GUI_AIRCRAFT_CARRIER_COUNT, 0);

  store.commit(Mutation.SET_PLAYER_IS_USING_SUBMARINE_ABILITY, false)
  store.commit(Mutation.SET_PLAYER_IS_USING_AIRCRAFT_CARRIER_ABILITY, false)
  store.commit(Mutation.SET_PLAYER_IS_USING_BATTLESHIP_ABILITY, false)

  store.commit(Mutation.SET_PLAYER_HAS_USED_SUBMARINE_ABILITY, false)
  store.commit(Mutation.SET_PLAYER_HAS_USED_AIRCRAFT_CARRIER_ABILITY, false)
  store.commit(Mutation.SET_PLAYER_HAS_USED_BATTLESHIP_ABILITY, false)

  store.commit(Mutation.SET_PLAYER_AIRCRAFT_CARRIER_HEALTH, 10)
  store.commit(Mutation.SET_PLAYER_BATTLESHIP_HEALTH, 4)

  store.commit(Mutation.SET_PLAYER_AIRCRAFT_CARRIER_SHOTS, 0)

  store.commit(Mutation.SET_PLAYER_HAS_CURRENT_TURN, false)
  store.commit(Mutation.SET_PLAYER_HAS_WON_THE_GAME, false)

  store.commit(Mutation.SET_PLAYER_BOARD, [[]])

  store.commit(Mutation.SET_COMPUTER_IS_USING_SUBMARINE_ABILITY, false)
  store.commit(Mutation.SET_COMPUTER_IS_USING_AIRCRAFT_CARRIER_ABILITY, false)
  store.commit(Mutation.SET_COMPUTER_IS_USING_BATTLESHIP_ABILITY, false)

  store.commit(Mutation.SET_COMPUTER_HAS_USED_SUBMARINE_ABILITY, false)
  store.commit(Mutation.SET_COMPUTER_HAS_USED_AIRCRAFT_CARRIER_ABILITY, false)
  store.commit(Mutation.SET_COMPUTER_HAS_USED_BATTLESHIP_ABILITY, false)

  store.commit(Mutation.SET_COMPUTER_AIRCRAFT_CARRIER_HEALTH, 10)
  store.commit(Mutation.SET_COMPUTER_BATTLESHIP_HEALTH, 4)

  store.commit(Mutation.SET_COMPUTER_AIRCRAFT_CARRIER_SHOTS, 0)

  store.commit(Mutation.SET_COMPUTER_HAS_CURRENT_TURN, false)
  store.commit(Mutation.SET_COMPUTER_HAS_WON_THE_GAME, false)

  store.commit(Mutation.SET_COMPUTER_BOARD, [[]])

  router.push({ name: 'Index' })
}
</script>

<style scoped>
.winner-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.winner-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}
</style>