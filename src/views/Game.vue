<template>

  <!-- Modal displayed if player or computer wins -->
  <div ref="modal" class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel" v-if="store.player.board.isGameOver()">
            Game Over!
          </h1>
          <h1 class="modal-title fs-5" id="staticBackdropLabel" v-else-if="store.computer.board.isGameOver()">
            Congratulations!
          </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <h2 v-if="store.player.board.isGameOver()">
            You Lose!
          </h2>
          <h2 v-else-if="store.computer.board.isGameOver()">
            You Win!
          </h2>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click="startNewGame()">Start New Game</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Actual View -->
  <div class="containerrr">

    <!-- Title -->
    <h1 class="text">
      Battleship Game
    </h1>

    <!-- Boards -->
    <div class="boards">
      <h2 class="computer-text">
        Enemy Board
      </h2>
      <EnemyBoard :tiles="store.computer.board.tiles" user="computer" />
      <h2 class="player-text">
        Player Board
      </h2>
      <PlayerBoard :tiles="store.player.board.tiles" user="player" />
    </div>

    <!-- GUI -->
    <div class="gui">
      <button class="btn btn-primary" @click="startNewGame" v-if="store.player.board.isGameOver() || store.computer.board.isGameOver()">
        Start New Game
      </button>
      <div v-else>
        <h3 v-if="store.player.hasCurrentTurn" class="player-text">
          Your Turn
        </h3>
        <h3 v-else-if="store.computer.hasCurrentTurn" class="computer-text">
          Enemy's Turn
        </h3>
        <div>
          <h3 class="text">
            {{ selectedAbility }}
          </h3>
        </div>
        <h3 v-if="store.player.hasCurrentTurn" class="text">
          Click to use an ability.
        </h3>
        <AbilityButtons />
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import AbilityButtons from '@/components/AbilityButtons.vue';
import ShipName from '@/types/ShipName';
import { useStore } from '@/store'
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { ref, Ref, watch } from 'vue';
import { Modal } from 'bootstrap';
import PlayerBoard from '@/components/PlayerBoard.vue';
import EnemyBoard from '@/components/EnemyBoard.vue';


const store = useStore()
const router = useRouter()
const modal: Ref<HTMLElement | null> = ref(null);

const selectedAbility = computed(() => {
  if (store.player[ShipName.AIRCRAFT_CARRIER].isUsingAbility || store.computer[ShipName.AIRCRAFT_CARRIER].isUsingAbility) return 'Aircraft Carrier Attack';
  if (store.player[ShipName.SUBMARINE].isUsingAbility || store.computer[ShipName.SUBMARINE].isUsingAbility) return 'Submarine Attack';
  if (store.player[ShipName.BATTLESHIP].isUsingAbility || store.computer[ShipName.BATTLESHIP].isUsingAbility) return 'Battleship Attack';
  return 'Normal Attack';
});

// This will show the modal if the computer has won
watch(() => store.player.board.isGameOver(), (hasLost) => {
  if (hasLost) {
    if (modal.value) {
      const modalInstance = new Modal(modal.value);
      modalInstance.show();
    }
  }
});

// This will show the modal if the player has won
watch(() => store.computer.board.isGameOver(), (hasLost) => {
  if (hasLost) {
    if (modal.value) {
      const modalInstance = new Modal(modal.value);
      modalInstance.show();
    }
  }
});

function startNewGame() {
  store.setDefaultState();
  router.push({ name: 'Index' });
}
</script>

<style scoped>
.containerrr {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Arial', sans-serif;
  margin: 20px;
}

h1 {
  font-size: 2rem;
  margin-bottom: 20px;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.gui {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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

.text {
  color: #e0e0e0;
  display: inline-block;
  padding: 5px 10px;
  border-radius: 5px;
}

.gui {
  background-color: #3c6e8f;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 250px;
  padding: 15px;
  border: 2px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.boards {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}
</style>