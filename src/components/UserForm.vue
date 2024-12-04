<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div
      class="md:col-span-2 bg-white p-6 rounded-lg shadow flex flex-col md:justify-between"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs text-gray-900 font-medium mb-2"
            >First Name</label
          >
          <input
            data-test="first-name-input"
            v-model="formData.first_name"
            type="text"
            class="w-full pl-4 pr-10 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-gray-300 text-xs"
            :class="{ 'border-red-500': errors.first_name }"
            placeholder="First Name"
          />
          <p v-if="errors.first_name" class="text-red-500 text-xs mt-1">
            {{ errors.first_name }}
          </p>
        </div>
        <div>
          <label class="block text-xs text-gray-900 font-medium mb-2"
            >Last Name</label
          >
          <input
            data-test="last-name-input"
            v-model="formData.last_name"
            type="text"
            class="w-full pl-4 pr-10 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-gray-300 text-xs"
            :class="{ 'border-red-500': errors.last_name }"
            placeholder="Last Name"
          />
          <p v-if="errors.last_name" class="text-red-500 text-xs mt-1">
            {{ errors.last_name }}
          </p>
        </div>
      </div>
      <div class="flex md:justify-start justify-center">
        <button
          data-test="submit-button"
          @click="handleSubmit"
          class="bg-emerald-600 text-white px-6 py-3 rounded-md flex items-center justify-center hover:bg-emerald-700 text-xs mt-8 md:mt-0"
        >
          {{ submitButtonText }}
        </button>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
      <div class="flex flex-col items-center">
        <div
          class="mb-4 rounded-full p-0.5 border border-white ring-1 ring-gray-200"
        >
          <div
            class="w-32 h-32 rounded-full bg-gray-100 bg-cover bg-center bg-no-repeat"
            :style="
              formData.avatar ? `background-image: url(${formData.avatar})` : ''
            "
          ></div>
        </div>
        <div class="w-full mt-16">
          <div v-if="!isEditingAvatar">
            <button
              data-test="avatar-button"
              @click="isEditingAvatar = true"
              class="w-full text-gray-500 hover:text-gray-600 border border-gray-500 rounded-md py-2 px-4 flex items-center justify-center gap-2 text-xs"
            >
              <i class="fas fa-camera"></i>
              <span>{{ isDefaultAvatar ? "Add Photo" : "Change Photo" }}</span>
            </button>
          </div>
          <div v-else>
            <div
              class="flex flex-col xs:flex-row md:flex-col lg:flex-row gap-2"
            >
              <input
                data-test="avatar-url-input"
                v-model="avatarUrl"
                type="text"
                placeholder="Paste avatar URL"
                class="flex-1 pl-4 pr-10 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-gray-300 text-xs"
              />
              <button
                data-test="save-avatar-button"
                @click="handleSaveAvatar"
                class="bg-emerald-600 text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-emerald-700 text-xs w-1/2 mx-auto xs:w-auto xs:mx-0 md:w-1/2 md:mx-auto lg:w-auto lg:mx-0"
              >
                Save
              </button>
            </div>
          </div>
        </div>
        <p v-if="errors.avatar" class="text-red-500 text-xs mt-1">
          {{ errors.avatar }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { User } from "@/types/User";

const props = defineProps<{
  initialData?: Partial<User>;
  submitButtonText: string;
  defaultAvatar?: string;
}>();

const emit = defineEmits<{
  (e: "submit", data: Partial<User>): void;
}>();

const formData = ref<Partial<User>>({
  first_name: "",
  last_name: "",
  avatar: props.defaultAvatar || "",
  ...props.initialData,
});

const errors = ref({
  first_name: "",
  last_name: "",
  avatar: "",
});

const isEditingAvatar = ref(false);
const avatarUrl = ref("");

const isDefaultAvatar = computed(
  () => formData.value.avatar === props.defaultAvatar
);

const validateForm = () => {
  let isValid = true;
  errors.value = {
    first_name: "",
    last_name: "",
    avatar: "",
  };

  if (!formData.value.first_name?.trim()) {
    errors.value.first_name = "First name is required";
    isValid = false;
  }

  if (!formData.value.last_name?.trim()) {
    errors.value.last_name = "Last name is required";
    isValid = false;
  }

  if (props.defaultAvatar && formData.value.avatar === props.defaultAvatar) {
    errors.value.avatar = "Avatar is required";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = () => {
  if (!validateForm()) return;
  emit("submit", formData.value);
};

const handleSaveAvatar = () => {
  if (avatarUrl.value) {
    formData.value.avatar = avatarUrl.value;
    isEditingAvatar.value = false;
    avatarUrl.value = "";
  } else if (props.defaultAvatar) {
    formData.value.avatar = props.defaultAvatar;
  }
};
</script>
