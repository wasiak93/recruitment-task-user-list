<template>
  <div class="container mx-auto px-4">
    <PageTitle :title="title" />
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import PageTitle from "./PageTitle.vue";

defineProps<{
  title: string;
}>();
</script>
