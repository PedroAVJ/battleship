<template>
  <!-- Modal displayed if player or computer wins -->
  <MatchResultModal />

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
      <Board :tiles="store.computer.board.tiles" user="computer" />
      <h2 class="player-text">
        Player Board
      </h2>
      <Board :tiles="store.player.board.tiles" user="player" />
    </div>

    <!-- GUI -->
    <div class="gui">
      <button class="btn btn-primary" @click="newGame" v-if="store.player.hasLost() || store.computer.hasLost()">
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
import Board from '@/components/Board.vue';
import MatchResultModal from '@/components/MatchResultModal.vue';
import { useStore } from '@/store'
import { useRouter } from 'vue-router';
import { computed } from 'vue';


const store = useStore()
const router = useRouter()

function newGame() {
  store.resetState();
  router.push({ name: 'Index' });
}

const selectedAbility = computed(() => {
  if (store.player.aircraftCarrier.isUsingAbility || store.computer.aircraftCarrier.isUsingAbility) return 'Aircraft Carrier Attack';
  if (store.player.battleship.isUsingAbility || store.computer.battleship.isUsingAbility) return 'Battleship Attack';
  if (store.player.submarine.isUsingAbility || store.computer.submarine.isUsingAbility) return 'Submarine Attack';
  return 'Normal Attack';
});
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