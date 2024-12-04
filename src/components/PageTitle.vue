<template>
  <h1 data-test="page-title" class="text-2xl pt-12 mb-6">{{ title }}</h1>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>
