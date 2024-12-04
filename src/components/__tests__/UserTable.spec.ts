import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount, flushPromises, RouterLinkStub } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import UserTable from "../UserTable.vue";

const mockDeleteUser = vi.fn();
const mockSetSearchQuery = vi.fn();

let mockState = {
  allUsers: [],
  displayedUsers: [],
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 10,
  searchQuery: "",
};

const mockStore = {
  deleteUser: mockDeleteUser,
  setSearchQuery: mockSetSearchQuery,
  setPage: vi.fn(),
  filterUsers: vi.fn(),
  updateDisplayedUsers: vi.fn(),
  fetchAllUsers: vi.fn(),
  $state: mockState,
  displayedUsers: [],
  currentPage: 1,
  totalPages: 1,
};

vi.mock("@/stores/userStore", () => ({
  useUserStore: () => mockStore,
}));

vi.mock("@vueuse/core", () => ({
  useDebounceFn: (fn: Function) => fn,
}));

describe("UserTable", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockState = {
      allUsers: [],
      displayedUsers: [],
      currentPage: 1,
      totalPages: 1,
      itemsPerPage: 10,
      searchQuery: "",
    };
    Object.assign(mockStore, {
      displayedUsers: mockState.displayedUsers,
      currentPage: mockState.currentPage,
      totalPages: mockState.totalPages,
    });
    mockStore.setPage.mockReset();
  });

  const mountComponent = () => {
    return mount(UserTable, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
  };

  it("nie wyświetla paginacji gdy jest tylko jedna strona", async () => {
    mockState.displayedUsers = [
      { id: 1, first_name: "Jan", last_name: "Kowalski", avatar: "url" },
    ];
    mockStore.displayedUsers = mockState.displayedUsers;
    mockState.totalPages = 1;
    mockStore.totalPages = 1;

    const wrapper = mountComponent();
    await flushPromises();

    expect(wrapper.find('[data-test="prev-page"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="next-page"]').exists()).toBe(false);
  });

  it("wyświetla paginację gdy jest więcej niż jedna strona", async () => {
    mockState.displayedUsers = [
      { id: 1, first_name: "Jan", last_name: "Kowalski", avatar: "url" },
    ];
    mockStore.displayedUsers = mockState.displayedUsers;
    mockState.totalPages = 2;
    mockStore.totalPages = 2;

    const wrapper = mountComponent();
    await flushPromises();

    expect(wrapper.find('[data-test="prev-page"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="next-page"]').exists()).toBe(true);
  });

  it("displays list of users", async () => {
    const users = [
      {
        id: 1,
        first_name: "John",
        last_name: "Smith",
        avatar: "https://example.com/avatar1.jpg",
      },
      {
        id: 2,
        first_name: "Anna",
        last_name: "Brown",
        avatar: "https://example.com/avatar2.jpg",
      },
    ];

    mockState.displayedUsers = users;
    mockStore.displayedUsers = users;

    const wrapper = mountComponent();
    await flushPromises();

    expect(wrapper.findAll('[data-test="user-card"]')).toHaveLength(2);
    expect(wrapper.text()).toContain("John Smith");
    expect(wrapper.text()).toContain("Anna Brown");
  });

  it("deletes user after clicking Delete", async () => {
    const users = [
      {
        id: 1,
        first_name: "John",
        last_name: "Smith",
        avatar: "https://example.com/avatar1.jpg",
      },
    ];

    mockState.displayedUsers = users;
    mockStore.displayedUsers = users;

    const wrapper = mountComponent();
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    await wrapper.find('[data-test="delete-button"]').trigger("click");
    await flushPromises();

    expect(mockDeleteUser).toHaveBeenCalledWith(1);
    expect(confirmSpy).toHaveBeenCalled();
  });

  it("filters users after typing in search", async () => {
    const users = [
      {
        id: 1,
        first_name: "John",
        last_name: "Smith",
        avatar: "https://example.com/avatar1.jpg",
      },
    ];

    mockState.displayedUsers = users;
    mockStore.displayedUsers = users;

    const wrapper = mountComponent();
    await wrapper.find('[data-test="search-input"]').setValue("John");
    await flushPromises();

    expect(mockSetSearchQuery).toHaveBeenCalledWith("John");
  });

  it("shows no users message when list is empty", () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain("No users found");
  });

  it("has working pagination", async () => {
    const users = [
      {
        id: 1,
        first_name: "John",
        last_name: "Smith",
        avatar: "https://example.com/avatar1.jpg",
      },
    ];

    mockState.displayedUsers = users;
    mockStore.displayedUsers = users;
    mockState.totalPages = 3;
    mockStore.totalPages = 3;
    mockState.currentPage = 2;
    mockStore.currentPage = 2;

    const wrapper = mountComponent();
    await flushPromises();

    await wrapper.find('[data-test="prev-page"]').trigger("click");
    await flushPromises();
    expect(mockStore.setPage).toHaveBeenLastCalledWith(1);
    mockStore.setPage.mockClear();

    await wrapper.find('[data-test="next-page"]').trigger("click");
    await flushPromises();
    expect(mockStore.setPage).toHaveBeenLastCalledWith(3);
    mockStore.setPage.mockClear();

    await wrapper.find('[data-test="page-2"]').trigger("click");
    await flushPromises();
    expect(mockStore.setPage).toHaveBeenLastCalledWith(2);
  });
});
