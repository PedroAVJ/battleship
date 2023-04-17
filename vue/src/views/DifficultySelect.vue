<template>
    Choose Difficulty
    <div>
        <button @click="setDifficulty('easy')">Easy</button>
        <button @click="setDifficulty('medium')">Medium</button>
        <button @click="setDifficulty('hard')">Hard</button>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import { RootState } from '@/types/store';


const router = useRouter()
const store = useStore()

function setDifficulty(difficulty: RootState['difficulty']) {
    store.commit('setDifficulty', difficulty)
    router.push({ name: 'MapSelect' })
}
</script>