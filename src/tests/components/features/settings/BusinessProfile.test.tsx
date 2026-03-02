import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import BusinessProfile from "@/components/features/settings/BusinessProfile";
import { useSuspenseMyBusiness } from "@/hooks/useBusiness";
import { useUser } from "@/context/UserContext";

// Mock hooks
vi.mock("@/hooks/useBusiness", () => ({
  useSuspenseMyBusiness: vi.fn(),
}));

vi.mock("@/context/UserContext", () => ({
  useUser: vi.fn(),
}));

describe("BusinessProfile", () => {
  const mockBusiness = {
    id: "biz-1",
    name: "Test Business",
    ownerId: "owner-1",
    subscriptionStatus: "ACTIVE",
    createdAt: "",
    updatedAt: "",
  };

  const mockUser = {
    id: "user-1",
    username: "testowner",
    role: "OWNER",
    businessId: "biz-1",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSuspenseMyBusiness).mockReturnValue({
      data: mockBusiness,
    } as unknown as ReturnType<typeof useSuspenseMyBusiness>);
    vi.mocked(useUser).mockReturnValue({
      user: mockUser as any, // User type is complex, using any here for the user object but typing the hook return
      logout: vi.fn(),
      refetchUser: vi.fn(),
      selectedBranchId: null,
      setSelectedBranchId: vi.fn(),
      isLoading: false,
    } as unknown as ReturnType<typeof useUser>);
  });

  it("renders business name and owner username correctly", () => {
    render(<BusinessProfile />);

    expect(screen.getByText("Business Profile")).toBeInTheDocument();
    expect(screen.getByText("Test Business")).toBeInTheDocument();
    expect(screen.getByText("testowner")).toBeInTheDocument();
  });

  it("renders billing description text", () => {
    render(<BusinessProfile />);

    expect(screen.getByText(/Looking to manage your subscription or SMS credits?/i)).toBeInTheDocument();
    expect(screen.getByText("Billing & Plans")).toBeInTheDocument();
  });
});
