import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import VideoPlayer from "./VideoPlayer";

describe("VideoPlayer", () => {
  it("renders the title", () => {
    render(<VideoPlayer videoId="abc123" title="Mi video" />);
    expect(screen.getByText("Mi video")).toBeInTheDocument();
  });

  it("renders an iframe with the correct YouTube embed URL", () => {
    render(<VideoPlayer videoId="abc123" title="Mi video" />);
    const iframe = screen.getByTitle("Mi video");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/abc123"
    );
  });
});
