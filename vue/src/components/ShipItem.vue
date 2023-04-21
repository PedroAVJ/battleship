<template>
  <div :id="shipName" class="ship-item">
    <h2>{{ shipTitle }}</h2>
    <div class="svg-container" :draggable="count > 0" @dragstart="dragStart">
      <slot></slot>
    </div>
    <div class="controls">
      <button :class="['toggle-button', orientation]" @click="toggleOrientation">

        <!-- Title cases the orientation -->
        {{ orientation.charAt(0).toUpperCase() + orientation.slice(1).toLowerCase() }}

      </button>
      <span>x{{ count }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Orientation, ShipName } from '@/types/store.interface';
import { ref } from 'vue';


interface ShipItemProps {
  shipName: ShipName,
  shipTitle: string,
  count: number
}

const props = defineProps<ShipItemProps>();

const orientation = ref<Orientation>(Orientation.HORIZONTAL);

function dragStart(e: DragEvent) {
  e.dataTransfer?.setData('shipName', props.shipName);
  e.dataTransfer?.setData('orientation', orientation.value);
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
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 150px;
  padding: 15px;
  border: 2px solid #ccc;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 1.6rem;
  margin-bottom: 10px;
  color: #333;
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
    background-color: #007bff;
    border: none;
    color: white;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    padding: 8px 16px;
    margin: 2px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s;
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

.info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
}

.controls span {
  color: #333;
  font-weight: 500;
}
</style>