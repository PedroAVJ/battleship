<template>
  <!-- Modal -->
<div ref="modal" class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel" v-if="store.player.hasLost()">
          Game Over!
        </h1>
        <h1 class="modal-title fs-5" id="staticBackdropLabel" v-else-if="store.computer.hasLost()">
          Congratulations!
        </h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <h2 v-if="store.player.hasLost()">
          You Lose!
        </h2>
        <h2 v-else-if="store.computer.hasLost()">
          You Win!
        </h2>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" @click="store.resetState()">Start New Game</button>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import { ref, Ref, watch } from 'vue';
import { Modal } from 'bootstrap';


const store = useStore();

const modal: Ref<HTMLElement | null> = ref(null);

// This will only run once either player or computer has lost
watch(() => store.player.hasLost(), (hasLost) => {
  if (hasLost) {
    if (modal.value) {
      const modalInstance = new Modal(modal.value);
      modalInstance.show();
    }
  }
});

watch(() => store.computer.hasLost(), (hasLost) => {
  if (hasLost) {
    if (modal.value) {
      const modalInstance = new Modal(modal.value);
      modalInstance.show();
    }
  }
});
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