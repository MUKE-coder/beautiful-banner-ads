import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AdSlot } from "../components/AdSlot";
import { BannerAd } from "../components/BannerAd";

const ads = [
  { id: "1", title: "Ad One", cta: { label: "Go 1", href: "/1" } },
  { id: "2", title: "Ad Two", cta: { label: "Go 2", href: "/2" } },
  { id: "3", title: "Ad Three", cta: { label: "Go 3", href: "/3" } },
];

describe("AdSlot", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the first ad statically when no rotate is set", () => {
    render(<AdSlot ads={ads} />);
    expect(screen.getByText("Ad One")).toBeInTheDocument();
    expect(screen.queryByText("Ad Two")).toBeNull();
  });

  it("renders at the `initial` index when provided", () => {
    render(<AdSlot ads={ads} initial={1} />);
    expect(screen.getByText("Ad Two")).toBeInTheDocument();
  });

  it("advances ads on the rotate interval", () => {
    render(<AdSlot ads={ads} rotate={{ interval: 5000 }} />);
    expect(screen.getByText("Ad One")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText("Ad Two")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText("Ad Three")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText("Ad One")).toBeInTheDocument();
  });

  it("renders custom children-as-function when given", () => {
    render(
      <AdSlot ads={ads}>
        {(config) => <BannerAd config={config} className="custom-render" />}
      </AdSlot>,
    );
    expect(screen.getByRole("complementary")).toHaveClass("custom-render");
  });

  it("acts as a placement wrapper when given a single child element", () => {
    render(
      <AdSlot position="bottom" sticky>
        <BannerAd id="x" title="Single" cta={{ label: "Go", href: "/x" }} />
      </AdSlot>,
    );
    const slot = document.querySelector(".bba-ad-slot");
    expect(slot).toHaveAttribute("data-bba-position", "bottom");
    expect(slot).toHaveAttribute("data-bba-sticky", "true");
    expect(screen.getByText("Single")).toBeInTheDocument();
  });

  it("sets data-bba-rotating='true' when rotate is configured", () => {
    render(<AdSlot ads={ads} rotate={{ interval: 1000 }} />);
    expect(document.querySelector(".bba-ad-slot")).toHaveAttribute(
      "data-bba-rotating",
      "true",
    );
  });

  it("supports the BannerRotator alias", async () => {
    const { BannerRotator } = await import("../components/AdSlot");
    render(<BannerRotator ads={ads} />);
    expect(screen.getByText("Ad One")).toBeInTheDocument();
  });

  it("does not advance when ads has fewer than two entries", () => {
    render(<AdSlot ads={[ads[0]!]} rotate={{ interval: 1000 }} />);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText("Ad One")).toBeInTheDocument();
  });
});
