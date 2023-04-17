<template>
    Select Ships
    <div>
        <span>Name: Aircraft Carrier</span>
        <span>Count: 1</span>
        <span>Description: 5x2</span>
        <span>Special Ability: Once per game, you may attack a cell with a 3x3 blast radius. This will disclose the location of your ship, so use it wisely. If the ship is destroyed, you cannot use this ability.</span>
    </div>
    <div>
        <span>Name: Submarine</span>
        <span>Count: 1</span>
        <span>Description: 1x1</span>
        <span>Special Ability: Once per game, you can scan a 5x5 area around your ship. This will disclose the location of your ship, so use it wisely. If the ship is destroyed, you cannot use this ability.</span>
    </div>
    <div>
        <span>Name: Supply Boat</span>
        <input type="number" v-model="supplyBoatCount" />
        <span>Description: 2x1</span>
    </div>
    <div>
        <span>Name: Destroyer</span>
        <input type="number" v-model="destroyerCount" />
        <span>Description: 3x1</span>
    </div>
    <div>
        <span>Name: Battleship</span>
        <input type="number" v-model="battleshipCount" />
        <span>Description: 4x1</span>
    </div>
    <div>
        <span>Name: Frigate</span>
        <input type="number" v-model="frigateCount" />
        <span>Description: 5x1</span>
    </div>

    <button @click="setShips">Start Room</button>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import { ref } from 'vue'


const router = useRouter()
const store = useStore()

const supplyBoatCount = ref(0)
const destroyerCount = ref(0)
const battleshipCount = ref(0)
const frigateCount = ref(0)

function setShips() {
    store.commit('setSupplyBoatCount', supplyBoatCount.value)
    store.commit('setDestroyerCount', destroyerCount.value)
    store.commit('setBattleshipCount', battleshipCount.value)
    store.commit('setFrigateCount', frigateCount.value)
    router.push({ name: 'WaitingForJoin' })
}
</script>