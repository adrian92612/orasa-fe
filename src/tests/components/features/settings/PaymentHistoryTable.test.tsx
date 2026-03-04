import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import PaymentHistoryTable from "@/components/features/settings/PaymentHistoryTable";
import { usePaymentHistory } from "@/hooks/usePayments";

import type { PaymentHistoryResponse } from "@/types/payment";
import type { UseQueryResult } from "@tanstack/react-query";

vi.mock("@/hooks/usePayments", () => ({
  usePaymentHistory: vi.fn(),
}));

const mockPayments: PaymentHistoryResponse[] = [
  {
    id: "pay-1",
    merchantOrderNo: "SUB-ABC12345",
    platOrderNo: "PLAT-001",
    amount: 299,
    description: "Orasa Subscription Renewal - 1 Month",
    method: "gcash",
    type: "SUBSCRIPTION_RENEWAL",
    status: "SUCCESS",
    createdAt: "2026-03-01T10:00:00+08:00",
  },
  {
    id: "pay-2",
    merchantOrderNo: "CRD-DEF67890",
    platOrderNo: "PLAT-002",
    amount: 100,
    description: "Orasa SMS Credits - 100 units",
    method: "gcash",
    type: "CREDIT_TOPUP",
    status: "SUCCESS",
    createdAt: "2026-03-02T14:30:00+08:00",
  },
];

describe("PaymentHistoryTable", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("renders loading state", () => {
    vi.mocked(usePaymentHistory).mockReturnValue({
      data: [],
      isLoading: true,
    } as unknown as UseQueryResult<PaymentHistoryResponse[]>);

    render(<PaymentHistoryTable />, { wrapper });

    expect(screen.getByText("Payment History")).toBeInTheDocument();
    // Loader2 spin icon should be present (rendered as svg)
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders empty state when no payments exist", () => {
    vi.mocked(usePaymentHistory).mockReturnValue({
      data: [],
      isLoading: false,
    } as unknown as UseQueryResult<PaymentHistoryResponse[]>);

    render(<PaymentHistoryTable />, { wrapper });

    expect(screen.getByText("Payment History")).toBeInTheDocument();
    expect(screen.getByText("No payment history found.")).toBeInTheDocument();
  });

  it("renders payment rows with correct data", () => {
    vi.mocked(usePaymentHistory).mockReturnValue({
      data: mockPayments,
      isLoading: false,
    } as unknown as UseQueryResult<PaymentHistoryResponse[]>);

    render(<PaymentHistoryTable />, { wrapper });

    // Header
    expect(screen.getByText("Payment History")).toBeInTheDocument();

    // Column headers
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Order No.")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();

    // Row 1 — Subscription
    expect(screen.getByText("SUB-ABC12345")).toBeInTheDocument();
    expect(screen.getByText("Orasa Subscription Renewal - 1 Month")).toBeInTheDocument();
    expect(screen.getByText("₱299.00")).toBeInTheDocument();

    // Row 2 — Credits
    expect(screen.getByText("CRD-DEF67890")).toBeInTheDocument();
    expect(screen.getByText("Orasa SMS Credits - 100 units")).toBeInTheDocument();
    expect(screen.getByText("₱100.00")).toBeInTheDocument();

    // Both should show Success badges
    const successBadges = screen.getAllByText("Success");
    expect(successBadges).toHaveLength(2);
  });

  it("renders correct badge for different payment statuses", () => {
    const mixedPayments: PaymentHistoryResponse[] = [
      {
        ...mockPayments[0],
        id: "pay-failed",
        status: "FAILED",
      },
      {
        ...mockPayments[1],
        id: "pay-expired",
        status: "EXPIRED",
      },
    ];

    vi.mocked(usePaymentHistory).mockReturnValue({
      data: mixedPayments,
      isLoading: false,
    } as unknown as UseQueryResult<PaymentHistoryResponse[]>);

    render(<PaymentHistoryTable />, { wrapper });

    expect(screen.getByText("Failed")).toBeInTheDocument();
    expect(screen.getByText("Expired")).toBeInTheDocument();
  });
});
