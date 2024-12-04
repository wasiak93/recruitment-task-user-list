import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount, flushPromises, RouterLinkStub } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import AddUser from "../AddUser.vue";

const mockAddUser = vi.fn();
const mockRouter = {
  push: vi.fn(),
};

vi.mock("vue-router", () => ({
  useRouter: () => mockRouter,
}));

vi.mock("@/stores/userStore", () => ({
  useUserStore: () => ({
    addUser: mockAddUser,
  }),
}));

describe("AddUser", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  const mountComponent = () => {
    return mount(AddUser, {
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
    expect(pageTitle.text()).toBe("Add user");
  });

  it("adds user and redirects on successful submit", async () => {
    const wrapper = mountComponent();
    const userData = {
      first_name: "John",
      last_name: "Smith",
      avatar: "https://example.com/avatar.jpg",
    };

    await wrapper
      .findComponent({ name: "UserForm" })
      .vm.$emit("submit", userData);
    await flushPromises();

    expect(mockAddUser).toHaveBeenCalledWith(userData);
    expect(mockRouter.push).toHaveBeenCalledWith("/");
  });

  it("uses BaseView with correct title", () => {
    const wrapper = mountComponent();
    const baseView = wrapper.findComponent({ name: "BaseView" });

    expect(baseView.exists()).toBe(true);
    expect(baseView.props("title")).toBe("Add user");
  });

  it("renders UserForm inside BaseView", () => {
    const wrapper = mountComponent();
    const userForm = wrapper.findComponent({ name: "UserForm" });

    expect(userForm.exists()).toBe(true);
  });
});
