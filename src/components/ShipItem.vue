<template>
  <div :id="name" class="ship-item">
    <h2 class="text">
      {{ title }}
    </h2>
    <div class="svg-container" :draggable="count > 0" @dragstart="dragStart">

      <!-- This is where the SVG is inserted from the parent component -->
      <slot></slot>

    </div>
    <div class="bottom-wrapper">
      <div class="controls">
        <!-- Size of the ship -->
        <span class="text">
          Size: {{ SHIP_DIMENSIONS[props.name].length }} x {{ SHIP_DIMENSIONS[props.name].width }}
        </span>
        <button :class="['toggle-button', orientation]" @click="toggleOrientation">

          <!-- Title cases the orientation -->
          {{ orientation.charAt(0).toUpperCase() + orientation.slice(1).toLowerCase() }}

        </button>
        <span class="text">
          Count: x{{ count }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import store from '@/store';
import { Orientation, ShipName, Mutation } from '@/store/enums';
import { SHIP_DIMENSIONS } from '@/store/constants';
import { ref } from 'vue';


interface ShipItemProps {
  name: ShipName,
  title: string,
  count: number
}

const props = defineProps<ShipItemProps>();

const orientation = ref<Orientation>(Orientation.HORIZONTAL);

function dragStart(e: DragEvent) {
  if (!(e.target instanceof HTMLElement)) return;

  // Set the data transfer
  e.dataTransfer?.setData('shipName', props.name);
  e.dataTransfer?.setData('orientation', orientation.value);

  // Becuase drag enter and drag leave don't have access to the data transfer, we need to change the global state
  store.commit(Mutation.SET_SHIP_NAME_PREVIEW, props.name);
  store.commit(Mutation.SET_SHIP_ORIENTATION_PREVIEW, orientation.value);
}

function toggleOrientation() {
  if (orientation.value === Orientation.HORIZONTAL) {
    orientation.value = Orientation.VERTICAL;
  } else {
    orientation.value = Orientation.HORIZONTAL;
  }
}
</script>

<style scoped>
.ship-item {
  background-color: #3c6e8f;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  width: 150px;
  padding: 15px;
  border: 2px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.bottom-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  font-size: 1.6rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.svg-container {
  width: 100px;
  height: 100px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toggle-button {
  border: none;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 18px;
  margin: 2px;
  cursor: pointer;
  transition: background-color 0.3s;
  color: #e0e0e0;
  padding: 5px 10px;
  border-radius: 5px;
}

.toggle-button.horizontal {
  background-color: #007bff;
}

.toggle-button.vertical {
  background-color: #ff3b30;
}

.toggle-button:hover {
  opacity: 0.8;
}

.text {
  color: #e0e0e0;
  display: inline-block;
  padding: 5px 10px;
  border-radius: 5px;
}
</style>