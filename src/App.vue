<template>
  <div class="min-h-screen bg-gray-50">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();

onMounted(async () => {
  await userStore.fetchAllUsers();
});
</script>
