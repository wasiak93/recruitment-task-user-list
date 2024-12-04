<template>
  <BaseView title="Edit user">
    <UserForm
      v-if="user"
      :initial-data="user"
      submit-button-text="Save Changes"
      @submit="handleSubmit"
    />
  </BaseView>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import UserForm from "@/components/UserForm.vue";
import BaseView from "@/components/BaseView.vue";
import type { User } from "@/types/User";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const user = ref<User | null>(null);

onMounted(() => {
  const userId = Number(route.params.id);
  const currentUser = userStore.allUsers.find((u) => u.id === userId);
  if (currentUser) {
    user.value = { ...currentUser };
  }
});

const handleSubmit = async (userData: Partial<User>) => {
  try {
    if (user.value?.id) {
      await userStore.updateUser({ ...userData, id: user.value.id } as User);
      router.push("/");
    }
  } catch (error) {
    console.error("Error updating user:", error);
  }
};
</script>
