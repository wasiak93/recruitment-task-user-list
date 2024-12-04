<template>
  <BaseView title="Add user">
    <UserForm
      :default-avatar="defaultAvatar"
      submit-button-text="Add User"
      @submit="handleSubmit"
    />
  </BaseView>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import UserForm from "@/components/UserForm.vue";
import BaseView from "@/components/BaseView.vue";
import type { User } from "@/types/User";

const router = useRouter();
const userStore = useUserStore();

const defaultAvatar =
  "https://via.placeholder.com/128/CCCCCC/666666?text=128x128";

const handleSubmit = async (userData: Partial<User>) => {
  try {
    await userStore.addUser(userData as Omit<User, "id">);
    router.push("/");
  } catch (error) {
    console.error("Error adding user:", error);
  }
};
</script>
