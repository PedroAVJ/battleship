<template>
    <input type="number" placeholder="Enter code" v-model="code" />
    <button @click="joinRoom" >Join</button>
  </template>
  
<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'


const router = useRouter()
const code = ref('')

function joinRoom() {
    router.push({ name: 'Board' })
}
</script>
  