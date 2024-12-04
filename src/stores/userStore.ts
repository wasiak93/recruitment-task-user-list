import { defineStore } from "pinia";
import type { User } from "@/types/User";
import axios from "axios";

interface State {
  allUsers: User[];
  filteredUsers: User[];
  displayedUsers: User[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  searchQuery: string;
}

const api = axios.create({
  baseURL: "https://reqres.in/api",
  validateStatus: (status) => status < 300,
});

export const useUserStore = defineStore("user", {
  state: (): State => ({
    allUsers: [],
    filteredUsers: [],
    displayedUsers: [],
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 8,
    searchQuery: "",
  }),

  actions: {
    async fetchAllUsers(): Promise<void> {
      try {
        const initialResponse = await axios.get("https://reqres.in/api/users", {
          params: { per_page: 100, page: 1 },
        });

        if (initialResponse.data.total <= 100) {
          this.allUsers = initialResponse.data.data;
        } else {
          const fullResponse = await axios.get("https://reqres.in/api/users", {
            params: { per_page: initialResponse.data.total, page: 1 },
          });
          this.allUsers = fullResponse.data.data;
        }

        this.filterUsers();
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    },

    filterUsers(): void {
      const query = this.searchQuery.toLowerCase();
      this.filteredUsers = query
        ? this.allUsers.filter(
            (user) =>
              user.first_name.toLowerCase().includes(query) ||
              user.last_name.toLowerCase().includes(query)
          )
        : [...this.allUsers];

      this.totalPages = Math.ceil(
        this.filteredUsers.length / this.itemsPerPage
      );

      if (this.currentPage > this.totalPages) {
        this.currentPage = 1;
      }

      this.updateDisplayedUsers();
    },

    updateDisplayedUsers(): void {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      this.displayedUsers = this.filteredUsers.slice(start, end);
    },

    setSearchQuery(query: string): void {
      this.searchQuery = query;
      this.filterUsers();
    },

    setPage(page: number): void {
      this.currentPage = page;
      this.updateDisplayedUsers();
    },

    async addUser(user: Omit<User, "id">): Promise<void> {
      try {
        const response = await api.post("/users", user);
        // in a normally working API, here I would fetch the new users list
        // await this.fetchAllUsers();

        // make add user local instead of fetching from API and filter
        const newUser = {
          ...user,
          id: response.data.id,
        };
        this.allUsers = [...this.allUsers, newUser];
        this.filterUsers();
      } catch (error) {
        console.error("Error adding user:", error);
        throw error;
      }
    },

    async updateUser(user: User): Promise<void> {
      try {
        await api.put(`/users/${user.id}`, user);
        // in a normally working API, here I would fetch the new users list
        // await this.fetchAllUsers();

        // make update local instead of fetching from API and filter
        this.allUsers = this.allUsers.map((u) => (u.id === user.id ? user : u));
        this.filterUsers();
      } catch (error) {
        console.error("Error updating user:", error);
        throw error;
      }
    },

    async deleteUser(id: number): Promise<void> {
      try {
        await api.delete(`/users/${id}`);
        // in a normally working API, here I would fetch the new users list
        // await this.fetchAllUsers();

        // make filter local instead of fetching from API and filter
        this.allUsers = this.allUsers.filter((u) => u.id !== id);
        this.filterUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
      }
    },
  },
});
