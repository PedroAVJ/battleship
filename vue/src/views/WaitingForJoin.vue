<template>
    Waiting For Join
    <span>Your code is: {{ code }}</span>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { onMounted } from 'vue';
import { ref } from 'vue'


const router = useRouter()

const code = ref('')

// Listen for a response from the server that the other player has joined using websockets
onMounted(() => {
    router.push({ name: 'Board' })
})
</script>