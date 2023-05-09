<template>
  <!-- Modal displayed if player or computer wins -->
  <div ref="modal" class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel" v-if="isGameOver(store.player.board)">
            Game Over!
          </h1>
          <h1 class="modal-title fs-5" id="staticBackdropLabel" v-else-if="isGameOver(store.computer.board)">
            Congratulations!
          </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <h2 v-if="isGameOver(store.player.board)" class="secondary-text">
            You Lose!
          </h2>
          <h2 v-else-if="isGameOver(store.computer.board)" class="secondary-text">
            You Win!
          </h2>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click="startNewGame()" data-bs-dismiss="modal">Start New
            Game</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Actual View -->
  <div class="view-wrapper">

    <!-- Boards -->
    <h2 class="player-text" v-if="store.computer.hasCurrentTurn">
      Player Board
    </h2>
    <PlayerBoard v-if="store.computer.hasCurrentTurn" />
    <h2 class="computer-text" v-if="store.player.hasCurrentTurn">
      Enemy Board
    </h2>
    <EnemyBoard v-if="store.player.hasCurrentTurn" />

    <!-- GUI -->
    <div class="gui mt-3 mb-3">
      <div v-if="!isGameOver(store.player.board) || !isGameOver(store.computer.board)">
        <h3 v-if="store.player.hasCurrentTurn" class="player-text">
          Your Turn
        </h3>
        <h3 v-else-if="store.computer.hasCurrentTurn" class="computer-text">
          Enemy's Turn
        </h3>
        <div>
          <h3 class="secondary-text">
            {{ selectedAbility }}
          </h3>
        </div>
        <AbilityButtons />
      </div>
      <button class="primary-button mt-3" @click="startNewGame" v-if="store.player.hasCurrentTurn">
        Start New Game
      </button>
    </div>

    <!-- Ship ability descriptions -->
    <div class="gui" v-if="!isGameOver(store.player.board) || !isGameOver(store.computer.board)">
      <div class="accordion" id="accordionExample">
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
              Submarine Ability
            </button>
          </h2>
          <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div class="accordion-body">
              Uncovers a 3x3 area of the board
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
              Battleship Ability
            </button>
          </h2>
          <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div class="accordion-body">
              Hits a 3x3 area of the board
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
              Aircraft Carrier Ability
            </button>
          </h2>
          <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div class="accordion-body">
              Grants you 2 extra shots to use on the board
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import AbilityButtons from '@/components/AbilityButtons.vue';
import { useStore } from '@/store'
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { ref, Ref, watch } from 'vue';
import { Modal } from 'bootstrap';
import PlayerBoard from '@/components/PlayerBoard.vue';
import EnemyBoard from '@/components/EnemyBoard.vue';
import { isGameOver } from '@/utils/Game';
import { ShipName } from '@/utils/Enums';

const store = useStore()
const router = useRouter()
const modal: Ref<HTMLElement | null> = ref(null);

watch(() => store.player.board, () => {
  if (isGameOver(store.player.board)) {
    if (modal.value) {
      const bsModal = new Modal(modal.value);
      bsModal.show();
    }
  }
});

watch(() => store.computer.board, () => {
  if (isGameOver(store.computer.board)) {
    if (modal.value) {
      const bsModal = new Modal(modal.value);
      bsModal.show();
    }
  }
});


const selectedAbility = computed(() => {
  if (store.player[ShipName.AIRCRAFT_CARRIER].isUsingAbility) {
    if (store.player[ShipName.AIRCRAFT_CARRIER].shots > 0) {
      return 'Shots Remaining: ' + store.player[ShipName.AIRCRAFT_CARRIER].shots;
    }
    return 'Aircraft Carrier Attack';
  }
  if (store.computer[ShipName.AIRCRAFT_CARRIER].isUsingAbility) {
    if (store.computer[ShipName.AIRCRAFT_CARRIER].shots > 0) {
      return 'Shots Remaining: ' + store.computer[ShipName.AIRCRAFT_CARRIER].shots;
    }
    return 'Aircraft Carrier Attack';
  }
  if (store.player[ShipName.SUBMARINE].isUsingAbility || store.computer[ShipName.SUBMARINE].isUsingAbility) return 'Submarine Attack';
  if (store.player[ShipName.BATTLESHIP].isUsingAbility || store.computer[ShipName.BATTLESHIP].isUsingAbility) return 'Battleship Attack';
  return 'Normal Attack';
});

async function startNewGame() {
  store.$reset();
  router.push({ name: 'Index' });
}
</script>

<style scoped>
.view-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
}

.player-text {
  background-color: #52af52;
  color: #e0e0e0;
  display: inline-block;
  padding: 5px 10px;
  border-radius: 5px;
}

.computer-text {
  background-color: #f44336;
  color: #e0e0e0;
  display: inline-block;
  padding: 5px 10px;
  border-radius: 5px;
}

.gui {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #3c6e8f;
  text-align: center;
  width: 250px;
  padding: 15px;
  border: 2px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}</style>