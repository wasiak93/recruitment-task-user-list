import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import BaseView from "../BaseView.vue";

describe("BaseView", () => {
  const mountComponent = (props = {}) => {
    return mount(BaseView, {
      props: {
        title: "Test Title",
        ...props,
      },
      slots: {
        default: '<div data-test="test-content">Test Content</div>',
      },
    });
  };

  it("renders title using PageTitle component", () => {
    const title = "Custom Title";
    const wrapper = mountComponent({ title });
    const pageTitle = wrapper.find('[data-test="page-title"]');

    expect(pageTitle.exists()).toBe(true);
    expect(pageTitle.text()).toBe(title);
  });

  it("renders slot content", () => {
    const wrapper = mountComponent();
    const content = wrapper.find('[data-test="test-content"]');

    expect(content.exists()).toBe(true);
    expect(content.text()).toBe("Test Content");
  });

  it("applies correct container classes", () => {
    const wrapper = mountComponent();
    const container = wrapper.find("div").element;

    expect(container.classList.contains("container")).toBe(true);
    expect(container.classList.contains("mx-auto")).toBe(true);
    expect(container.classList.contains("px-4")).toBe(true);
  });
});
