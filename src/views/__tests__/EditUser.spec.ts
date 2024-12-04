import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount, flushPromises, RouterLinkStub } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import EditUser from "../EditUser.vue";

const mockUpdateUser = vi.fn();
const mockRouter = {
  push: vi.fn(),
};

const mockUser = {
  id: 1,
  first_name: "John",
  last_name: "Smith",
  avatar: "https://example.com/avatar.jpg",
};

vi.mock("vue-router", () => ({
  useRouter: () => mockRouter,
  useRoute: () => ({
    params: { id: "1" },
  }),
}));

vi.mock("@/stores/userStore", () => ({
  useUserStore: () => ({
    updateUser: mockUpdateUser,
    allUsers: [mockUser],
  }),
}));

describe("EditUser", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  const mountComponent = () => {
    return mount(EditUser, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
  };

  it("displays correct page title", () => {
    const wrapper = mountComponent();
    const pageTitle = wrapper.find('[data-test="page-title"]');
    expect(pageTitle.exists()).toBe(true);
    expect(pageTitle.text()).toBe("Edit user");
  });

  it("updates user and redirects on successful submit", async () => {
    const wrapper = mountComponent();
    await flushPromises();

    const userData = {
      first_name: "John",
      last_name: "Smith",
      avatar: "https://example.com/new-avatar.jpg",
    };

    await wrapper
      .findComponent({ name: "UserForm" })
      .vm.$emit("submit", userData);
    await flushPromises();

    expect(mockUpdateUser).toHaveBeenCalledWith({
      ...userData,
      id: mockUser.id,
    });
    expect(mockRouter.push).toHaveBeenCalledWith("/");
  });

  it("uses BaseView with correct title", () => {
    const wrapper = mountComponent();
    const baseView = wrapper.findComponent({ name: "BaseView" });

    expect(baseView.exists()).toBe(true);
    expect(baseView.props("title")).toBe("Edit user");
  });

  it("renders UserForm inside BaseView when user data is loaded", async () => {
    const wrapper = mountComponent();
    await flushPromises();
    const userForm = wrapper.findComponent({ name: "UserForm" });

    expect(userForm.exists()).toBe(true);
  });
});
