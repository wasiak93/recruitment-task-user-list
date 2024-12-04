import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import UserForm from "../UserForm.vue";

describe("UserForm", () => {
  const defaultAvatar = "https://example.com/default.jpg";

  const mountComponent = (props = {}) => {
    return mount(UserForm, {
      props: {
        submitButtonText: "Submit",
        defaultAvatar,
        ...props,
      },
    });
  };

  it("displays form with correct fields", () => {
    const wrapper = mountComponent();
    expect(wrapper.find('[data-test="first-name-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="last-name-input"]').exists()).toBe(true);
  });

  it("shows validation errors when fields are empty", async () => {
    const wrapper = mountComponent();
    await wrapper.find('[data-test="submit-button"]').trigger("click");

    expect(wrapper.text()).toContain("First name is required");
    expect(wrapper.text()).toContain("Last name is required");
    expect(wrapper.text()).toContain("Avatar is required");
  });

  it('changes button text from "Add Photo" to "Change Photo" after adding avatar', async () => {
    const wrapper = mountComponent();

    expect(wrapper.find('[data-test="avatar-button"]').text()).toBe(
      "Add Photo"
    );

    await wrapper.find('[data-test="avatar-button"]').trigger("click");
    await wrapper
      .find('[data-test="avatar-url-input"]')
      .setValue("https://example.com/avatar.jpg");
    await wrapper.find('[data-test="save-avatar-button"]').trigger("click");

    expect(wrapper.find('[data-test="avatar-button"]').text()).toBe(
      "Change Photo"
    );
  });

  it("emits submit event with form data", async () => {
    const wrapper = mountComponent();

    await wrapper.find('[data-test="first-name-input"]').setValue("John");
    await wrapper.find('[data-test="last-name-input"]').setValue("Smith");
    await wrapper.find('[data-test="avatar-button"]').trigger("click");
    await wrapper
      .find('[data-test="avatar-url-input"]')
      .setValue("https://example.com/avatar.jpg");
    await wrapper.find('[data-test="save-avatar-button"]').trigger("click");

    await wrapper.find('[data-test="submit-button"]').trigger("click");

    expect(wrapper.emitted("submit")?.[0][0]).toEqual({
      first_name: "John",
      last_name: "Smith",
      avatar: "https://example.com/avatar.jpg",
    });
  });

  it("loads initial data correctly", async () => {
    const initialData = {
      first_name: "John",
      last_name: "Smith",
      avatar: "https://example.com/avatar.jpg",
    };

    const wrapper = mountComponent({
      initialData,
    });

    expect(
      (
        wrapper.find('[data-test="first-name-input"]')
          .element as HTMLInputElement
      ).value
    ).toBe("John");
    expect(
      (
        wrapper.find('[data-test="last-name-input"]')
          .element as HTMLInputElement
      ).value
    ).toBe("Smith");
    expect(wrapper.find('[data-test="avatar-button"]').text()).toBe(
      "Change Photo"
    );
  });
});
