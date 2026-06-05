import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrandedBanner } from "../components/BrandedBanner";

describe("BrandedBanner", () => {
  it("renders title + image + cta with zero styling props", () => {
    render(
      <BrandedBanner
        id="b1"
        title="Save 50% on ink"
        image="https://example.com/ink.png"
        cta={{ label: "Shop", href: "/ink" }}
      />,
    );
    const banner = screen.getByRole("complementary");
    expect(banner).toHaveClass("bba-banner-branded");
    expect(banner).toHaveAttribute("data-bba-size", "leaderboard");
    const img = document.querySelector<HTMLImageElement>(".bba-banner-branded__image");
    expect(img).not.toBeNull();
    expect(img?.getAttribute("src")).toBe("https://example.com/ink.png");
    expect(screen.getByRole("link", { name: "Shop" })).toHaveAttribute("href", "/ink");
  });

  it("default layout is image-right (maps to mediaPosition=right)", () => {
    render(<BrandedBanner id="b2" title="t" />);
    expect(screen.getByRole("complementary")).toHaveAttribute(
      "data-bba-media-pos",
      "right",
    );
  });

  it("layout=image-left maps to mediaPosition=left", () => {
    render(<BrandedBanner id="b3" title="t" layout="image-left" />);
    expect(screen.getByRole("complementary")).toHaveAttribute(
      "data-bba-media-pos",
      "left",
    );
  });

  it("layout=image-bg maps to mediaPosition=background", () => {
    render(<BrandedBanner id="b4" title="t" layout="image-bg" />);
    expect(screen.getByRole("complementary")).toHaveAttribute(
      "data-bba-media-pos",
      "background",
    );
  });

  it("accepts image as { src, alt } object", () => {
    render(
      <BrandedBanner id="b5" title="t" image={{ src: "/x.png", alt: "Product" }} />,
    );
    expect(screen.getByRole("img", { name: "Product" })).toHaveAttribute("src", "/x.png");
  });

  it("brandColors override CSS variables via inline style", () => {
    render(
      <BrandedBanner
        id="b6"
        title="t"
        brandColors={{ bg: "#FF0000", accent: "#00FF00", text: "#FFFFFF" }}
      />,
    );
    const banner = screen.getByRole("complementary");
    const style = banner.getAttribute("style") ?? "";
    expect(style).toMatch(/--bba-brand-800:\s*#FF0000/);
    expect(style).toMatch(/--bba-accent-500:\s*#00FF00/);
    expect(style).toMatch(/--bba-on-brand:\s*#FFFFFF/);
  });

  it("componentType in adMeta is 'BrandedBanner'", () => {
    const calls: unknown[] = [];
    render(
      <BrandedBanner id="b7" title="t" onView={(m) => calls.push(m)} />,
    );
    expect(calls[0]).toMatchObject({ id: "b7", type: "BrandedBanner" });
  });

  it("works from config object alone", () => {
    render(
      <BrandedBanner
        id="b8"
        config={{
          title: "From config",
          eyebrow: "NEW",
          cta: { label: "Buy", href: "/x" },
        }}
      />,
    );
    expect(screen.getByText("From config")).toBeInTheDocument();
    expect(screen.getByText("NEW")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Buy" })).toHaveAttribute("href", "/x");
  });
});
