<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="p-6">
      <div class="flex justify-between gap-4 items-center">
        <div class="w-1/4 min-w-[160px] relative">
          <input
            data-test="search-input"
            v-model="searchQuery"
            type="text"
            placeholder="Search for users..."
            class="w-full pl-4 pr-10 py-2 rounded-md bg-gray-50 focus:outline-none text-xs"
            @input="handleSearch"
          />
          <div
            class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
          >
            <i class="fas fa-search text-gray-400"></i>
          </div>
        </div>
        <router-link
          to="/add"
          class="bg-emerald-600 text-white w-[100px] py-1.5 rounded-full flex items-center justify-center gap-2 hover:bg-emerald-700 text-xs ml-auto"
        >
          <span
            class="text-lg leading-none flex items-center font-bold translate-y-[-1px]"
            >+</span
          >
          <span>Add User</span>
        </router-link>
      </div>
    </div>

    <div class="mx-6">
      <div class="border-t border-gray-200">
        <div class="pt-2 pb-6">
          <table v-if="userStore.displayedUsers.length" class="w-full">
            <thead>
              <tr class="bg-white h-[48px]">
                <th
                  class="text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20"
                ></th>
                <th
                  class="text-left text-xs font-medium text-gray-900 uppercase tracking-wider font-medium"
                >
                  <span class="font-bold normal-case">Full name</span>
                </th>
                <th
                  class="text-left text-xs font-medium text-gray-900 uppercase tracking-wider font-medium w-[100px]"
                >
                  <span class="font-bold normal-case">Action</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr
                v-for="(user, index) in userStore.displayedUsers"
                :key="user.id"
                data-test="user-card"
                :class="[
                  'hover:bg-gray-100',
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white',
                ]"
              >
                <td class="py-2.5 whitespace-nowrap text-center">
                  <div class="flex-shrink-0 h-10 w-10 mx-auto">
                    <img
                      :src="user.avatar"
                      :alt="user.first_name"
                      class="h-10 w-10 rounded-full"
                    />
                  </div>
                </td>
                <td class="py-2.5 whitespace-nowrap">
                  <div class="text-xs text-gray-900">
                    {{ user.first_name }} {{ user.last_name }}
                  </div>
                </td>
                <td
                  class="py-2.5 whitespace-nowrap text-left text-sm font-medium"
                >
                  <div class="flex gap-4">
                    <router-link
                      data-test="edit-button"
                      :to="`/edit/${user.id}`"
                      class="text-gray-400 hover:text-gray-600"
                    >
                      <i class="fas fa-edit"></i>
                    </router-link>
                    <button
                      data-test="delete-button"
                      @click="handleDelete(user.id)"
                      class="text-gray-400 hover:text-gray-600"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="text-center py-8 text-gray-500">
            No users found
          </div>
        </div>
      </div>
    </div>

    <div v-if="userStore.displayedUsers.length" class="flex mt-6 mb-12">
      <button
        data-test="prev-page"
        class="w-8 h-8 flex items-center justify-center border border-gray-200 bg-white text-emerald-600 hover:bg-gray-100 rounded-l disabled:text-gray-400 disabled:hover:bg-white"
        @click="loadPage(userStore.currentPage - 1)"
        :disabled="userStore.currentPage === 1"
      >
        «
      </button>
      <button
        v-for="page in userStore.totalPages"
        :key="page"
        :data-test="`page-${page}`"
        @click="loadPage(page)"
        :class="[
          'w-8 h-8 flex items-center justify-center border -ml-[1px]',
          page === userStore.currentPage
            ? 'bg-emerald-600 text-white border-emerald-600'
            : 'bg-white text-emerald-600 hover:bg-gray-100 border-gray-200',
        ]"
      >
        {{ page }}
      </button>
      <button
        data-test="next-page"
        class="w-8 h-8 flex items-center justify-center border border-gray-200 bg-white text-emerald-600 hover:bg-gray-100 -ml-[1px] rounded-r disabled:text-gray-400 disabled:hover:bg-white"
        @click="loadPage(userStore.currentPage + 1)"
        :disabled="userStore.currentPage === userStore.totalPages"
      >
        »
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useDebounceFn } from "@vueuse/core";

const userStore = useUserStore();
const searchQuery = ref<string>("");

const handleSearch = useDebounceFn(() => {
  userStore.setSearchQuery(searchQuery.value);
}, 300);

const loadPage = (page: number): void => {
  userStore.setPage(page);
};

const handleDelete = async (id: number): Promise<void> => {
  if (confirm("Are you sure you want to delete this user?")) {
    try {
      await userStore.deleteUser(id);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }
};
</script>
