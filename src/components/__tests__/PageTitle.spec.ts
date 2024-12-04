import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import PageTitle from "../PageTitle.vue";

describe("PageTitle", () => {
  it("renders title correctly", () => {
    const title = "Test Title";
    const wrapper = mount(PageTitle, {
      props: {
        title,
      },
    });

    const titleElement = wrapper.find('[data-test="page-title"]');
    expect(titleElement.exists()).toBe(true);
    expect(titleElement.text()).toBe(title);
  });

  it("applies correct classes", () => {
    const wrapper = mount(PageTitle, {
      props: {
        title: "Test",
      },
    });

    const titleElement = wrapper.find('[data-test="page-title"]');
    expect(titleElement.classes()).toContain("text-2xl");
    expect(titleElement.classes()).toContain("pt-12");
    expect(titleElement.classes()).toContain("mb-6");
  });
});
