<template>
  <div class="board-wrapper">
    <div v-for="(row, rowIndex) in props.tiles" :key="rowIndex" class="board-row">
      <div v-for="(col, colIndex) in row" :key="colIndex" class="board-cell">
        <div :class="getBackground(col)">
          <Sprite :tile="col" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Sprite from '@/components/Sprite.vue';
import { Tile } from '@/utils/Interfaces';

const props = defineProps<{
  tiles: ReadonlyArray<ReadonlyArray<Readonly<Tile>>>;
}>();

function getBackground(tile: Tile) {
  if (tile.background.isWater) return 'water';
  if (tile.background.isLand) return 'land';
  if (tile.background.isOutOfBounds) return 'out-of-bounds';
}
</script>