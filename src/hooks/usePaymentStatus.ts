import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useUser } from "@/context/UserContext";
import { ENV } from "@/constants/config";
import type { PaymentStatusUpdate } from "@/types/payment";

export const usePaymentStatus = (enabled: boolean) => {
  const { user } = useUser();
  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatusUpdate | null>(null);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!enabled || !user?.businessId) return;

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

    return () => {
      if (clientRef.current?.connected) {
        clientRef.current.deactivate();
      }
      clientRef.current = null;
    };
  }, [enabled, user?.businessId]);

  const reset = () => setPaymentStatus(null);

  return { paymentStatus, reset };
};
