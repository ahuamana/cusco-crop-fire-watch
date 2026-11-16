import { describe, expect, it } from "vitest";
import { demoRisk, emergencyNumbers, normalizePeruMobile } from "@/lib/chakra-demo";

describe("Chakra demo rules", () => {
  it("accepts nine-digit Peru mobile numbers with optional +51", () => {
    expect(normalizePeruMobile("987 654 321")).toBe("+51987654321");
    expect(normalizePeruMobile("+51 987 654 321")).toBe("+51987654321");
    expect(normalizePeruMobile("+52 987654321")).toBeNull();
    expect(normalizePeruMobile("887654321")).toBeNull();
    expect(normalizePeruMobile("98765432")).toBeNull();
    expect(normalizePeruMobile("9876543210")).toBeNull();
  });
  it("uses the requested Peru emergency numbers", () => {
    expect(emergencyNumbers).toEqual({ civilDefense: "115", firefighters: "116" });
  });
  it("keeps the illustrative high-risk level within the four-level scale", () => {
    expect(demoRisk.level).toBe(3);
    expect(demoRisk.maximum).toBe(4);
  });
});