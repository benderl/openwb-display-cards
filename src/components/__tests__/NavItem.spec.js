import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import NavItem from "../NavItem.vue";

describe("NavItem", () => {
  it("renders properly", () => {
    const wrapper = mount(
      NavItem,
      {
        props: {
          to: {
            name: 'status'
          },
        },
        slots: {
          default: "Status",
        },
      }
    );
    expect(wrapper.text()).toContain("Status");
  });
});
