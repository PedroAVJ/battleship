<!-- Cell.vue -->
<template>
  <div :class="cellClass"></div>
</template>

<script setup lang="ts">
import { Tile } from '@/types/store';
import { computed } from 'vue';

interface CellProps {
  tile: Tile;
}

const props = defineProps<CellProps>();

const cellClass = computed(() => {
  const classes = ['cell'];
  if (props.tile === Tile.WATER) {
    classes.push('water');
  } else if (props.tile === Tile.LAND) {
    classes.push('land');
  }
  return classes;
});
</script>

<style scoped>
.cell {
  width: 100%;
  height: 100%;
  border: 1px solid #2c3e50;
  position: relative;
}

.water {
  background-color: #34495e;
}

.land {
  background-color: #2ecc71;
}
</style>
