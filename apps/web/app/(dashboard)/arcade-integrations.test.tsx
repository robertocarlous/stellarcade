import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import React from "react";

import RewardsPage from "./rewards/page";
import SettingsPage from "./settings/page";
import PortfolioPage from "./portfolio/page";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

describe("Arcade Platform Dashboard Integrations", () => {
  it("renders StreakMultiplierWidget on RewardsPage", () => {
    render(<RewardsPage />);
    expect(screen.getByTestId("streak-multiplier-widget")).toBeInTheDocument();
    expect(screen.getByText(/No active streak yet/i)).toBeInTheDocument();
  });

  it("allows starting streak via check-in on RewardsPage", async () => {
    render(<RewardsPage />);
    const checkInBtn = screen.getByTestId("streak-checkin-btn");
    expect(checkInBtn).toBeInTheDocument();
    fireEvent.click(checkInBtn);
    expect(await screen.findByText(/Checking in…/i)).toBeInTheDocument();
  });

  it("opens AmbientSoundMixer dialog on SettingsPage", () => {
    render(<SettingsPage />);
    expect(screen.queryByTestId("ambient-sound-mixer")).not.toBeInTheDocument();

    const openBtn = screen.getByRole("button", { name: /Open Sound Mixer/i });
    expect(openBtn).toBeInTheDocument();
    fireEvent.click(openBtn);

    expect(screen.getByTestId("ambient-sound-mixer")).toBeInTheDocument();
  });

  it("renders TokenSwapRateCalculator on PortfolioPage", () => {
    render(<PortfolioPage />);
    expect(screen.getByTestId("token-swap-rate-calculator")).toBeInTheDocument();
    expect(screen.getByText(/Instant Token Swap Calculator/i)).toBeInTheDocument();
  });
});
