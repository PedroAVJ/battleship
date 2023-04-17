<template>
    Select Map
    <button @click="setMap('map1')">Small Map</button>
    <button @click="setMap('map2')">Medium Map</button>
    <button @click="setMap('map3')">Large Map</button>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import { RootState } from '@/types/store';


const router = useRouter()
const store = useStore()

function setMap(map: RootState['map']) {
    store.commit('setMap', map)
    router.push({ name: 'ShipSelect' })
}
</script>