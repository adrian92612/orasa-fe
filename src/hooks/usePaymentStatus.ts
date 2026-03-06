import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useUser } from "@/context/UserContext";
import { paymentService } from "@/services/payment.service";
import { ENV } from "@/constants/config";
import type { PaymentStatusUpdate } from "@/types/payment";

export const usePaymentStatus = (enabled: boolean, platOrderNo?: string | null) => {
  const { user } = useUser();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusUpdate | null>(null);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!enabled || !user?.businessId) return;

    // Defined inside the effect so it's never a missing dependency,
    // and setState is only ever called inside an async callback — not
    // synchronously in the effect body — which satisfies the linter.
    const checkStatusViaRest = async () => {
      if (!platOrderNo) return;
      try {
        const response = await paymentService.checkPaymentStatus(platOrderNo);
        if (response.success && response.data) {
          const update = response.data;
          if (update.status === "SUCCESS" || update.status === "FAILED" || update.status === "EXPIRED") {
            setPaymentStatus(update);
          }
        }
      } catch {
        // Silently ignore — WebSocket is the primary channel
      }
    };

    const wsUrl = ENV.API_URL.replace("/api", "/api/ws");

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl) as WebSocket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("[WS] Connected to payment status");
        client.subscribe(`/topic/payments/${user.businessId}`, (message) => {
          try {
            const update = JSON.parse(message.body) as PaymentStatusUpdate;
            console.log("[WS] Payment status update:", update);
            setPaymentStatus(update);
          } catch (e) {
            console.error("[WS] Failed to parse message:", e);
          }
        });

        void checkStatusViaRest();
      },
      onStompError: (frame) => {
        console.error("[WS] STOMP error:", frame.headers.message);
      },
      onDisconnect: () => {
        console.log("[WS] Disconnected");
      },
    });

    client.activate();
    clientRef.current = client;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void checkStatusViaRest();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initial REST poll — called via void so the linter knows we're
    // intentionally firing an async function without awaiting it here.
    void checkStatusViaRest();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (clientRef.current?.connected) {
        clientRef.current.deactivate();
      }
      clientRef.current = null;
    };
  }, [enabled, user?.businessId, platOrderNo]);

  const reset = () => setPaymentStatus(null);

  return { paymentStatus, reset };
};
