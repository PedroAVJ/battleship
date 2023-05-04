<template>
  <!-- Modal -->
<div ref="modal" class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">
          {{ title }}
        </h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <h2>
          {{ body }}
        </h2>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" @click="newGame">Start New Game</button>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import { useRouter } from 'vue-router';
import Mutation from '@/types/Mutation';
import { ref, Ref, watch } from 'vue';
import { Modal } from 'bootstrap';


const store = useStore();
const router = useRouter();

const modal: Ref<HTMLElement | null> = ref(null);
const title = ref('');
const body = ref('');

watch(() => store.state.player.hasLost(), (hasLost) => {
  if (hasLost) {
    title.value = 'Game Over!';
    body.value = 'You Lose!';
    if (modal.value) {
      const modalInstance = new Modal(modal.value);
      modalInstance.show();
    }
  }
});

watch(() => store.state.computer.hasLost(), (hasLost) => {
  if (hasLost) {
    title.value = 'Congratulations!';
    body.value = 'You Win!';
    if (modal.value) {
      const modalInstance = new Modal(modal.value);
      modalInstance.show();
    }
  }
});

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