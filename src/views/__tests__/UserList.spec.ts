import { describe, it, expect, beforeEach } from "vitest";
import { mount, RouterLinkStub } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import UserList from "../UserList.vue";

describe("UserList", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const mountComponent = () => {
    return mount(UserList, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
  };

  it("uses BaseView with correct title", () => {
    const wrapper = mountComponent();
    const baseView = wrapper.findComponent({ name: "BaseView" });

    expect(baseView.exists()).toBe(true);
    expect(baseView.props("title")).toBe("User list");
  });

  it("renders UserTable inside BaseView", () => {
    const wrapper = mountComponent();
    const userTable = wrapper.findComponent({ name: "UserTable" });

    expect(userTable.exists()).toBe(true);
  });
});
