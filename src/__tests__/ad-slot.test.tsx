import { act, fireEvent, render, screen } from "@testing-library/react";
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

  it("dismissible cascades to the default BannerAd renderer", () => {
    render(<AdSlot ads={ads} dismissible />);
    expect(screen.getByRole("button", { name: "Dismiss ad" })).toBeInTheDocument();
  });

  it("per-ad config.dismissible wins over slot.dismissible (false override)", () => {
    const overridden = [{ ...ads[0]!, dismissible: false }, ads[1]!, ads[2]!];
    render(<AdSlot ads={overridden} dismissible />);
    expect(screen.queryByRole("button", { name: "Dismiss ad" })).toBeNull();
  });

  it("storage prop cascades to the default BannerAd renderer", () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v);
      },
      removeItem: (k: string) => {
        store.delete(k);
      },
    };
    render(<AdSlot ads={ads} dismissible storage={storage} />);
    fireEvent.click(screen.getByRole("button", { name: "Dismiss ad" }));
    expect(store.get("bba-dismissed:1")).toBe("1");
  });

  it("storageKey acts as a per-slot namespace prefix on the resolved key", () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v);
      },
      removeItem: (k: string) => {
        store.delete(k);
      },
    };
    render(
      <AdSlot ads={ads} dismissible storage={storage} storageKey="footer-slot" />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Dismiss ad" }));
    expect(store.get("footer-slot:bba-dismissed:1")).toBe("1");
    expect(store.get("bba-dismissed:1")).toBeUndefined();
  });

  it("children-as-function still receives the slot-merged dismissible default", () => {
    let seen: { id?: string; dismissible?: boolean } = {};
    render(
      <AdSlot ads={ads} dismissible>
        {(config) => {
          seen = config;
          return <div data-testid="rendered">{config.title}</div>;
        }}
      </AdSlot>,
    );
    expect(seen.dismissible).toBe(true);
    expect(seen.id).toBe("1");
  });
});
