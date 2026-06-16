import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FieldMessages } from "./FieldMessages.js";

describe("FieldMessages", () => {
  it("renders one item per message, tagged with severity", () => {
    render(
      <FieldMessages
        messages={[
          { code: "x", severity: "error", message: "Bad" },
          { code: "y", severity: "warn", message: "Hmm" },
        ]}
      />,
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]?.getAttribute("data-severity")).toBe("error");
    expect(items[1]?.textContent).toBe("Hmm");
  });
  it("renders nothing when there are no messages", () => {
    const { container } = render(<FieldMessages messages={[]} />);
    expect(container.querySelector('[data-humaneforms="messages"]')).toBeNull();
  });
});
