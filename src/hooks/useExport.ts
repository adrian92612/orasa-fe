import { useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "sonner";

import { apiClient } from "@/lib/api-client";

import { API_ROUTES } from "@/constants/routes";
import { ENV } from "@/constants/config";
import type { ExportProgressMessage } from "@/types/export";

export const useExport = (businessId: string | null) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<ExportProgressMessage["status"] | null>(null);
  const clientRef = useRef<Client | null>(null);
  const toastIdRef = useRef<string | number | null>(null);

  const disconnect = () => {
    if (clientRef.current?.connected) {
      clientRef.current.deactivate();
    }
    clientRef.current = null;
  };

  const triggerDownload = (base64Data: string, month: number, year: number) => {
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appointments-${year}-${String(month).padStart(2, "0")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const triggerExport = async (month: number, year: number) => {
    if (!businessId || isExporting) return;

    setIsExporting(true);
    setProgress(0);
    setStatus(null);

    toastIdRef.current = toast.loading("Starting export...", { duration: Infinity });

    const wsUrl = ENV.IS_PROD ? ENV.API_URL.replace("/api", "/ws/") : `${ENV.API_URL}/ws`;

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 0,
      onConnect: () => {
        client.subscribe(`/topic/export/${businessId}`, (message) => {
          const data: ExportProgressMessage = JSON.parse(message.body);
          setProgress(data.progressPercent);
          setStatus(data.status);

          if (data.status === "COMPLETE" && data.csvData) {
            toast.success("Export complete! Downloading...", {
              id: toastIdRef.current!,
              duration: 3000,
            });
            triggerDownload(data.csvData, month, year);
            setIsExporting(false);
            disconnect();
          } else if (data.status === "ERROR") {
            toast.error(data.message || "Export failed", {
              id: toastIdRef.current!,
              duration: 5000,
            });
            setIsExporting(false);
            disconnect();
          } else {
            toast.loading(data.message || "Exporting...", {
              id: toastIdRef.current!,
              duration: Infinity,
            });
          }
        });

        apiClient.post(API_ROUTES.EXPORT.APPOINTMENTS, { month, year }).catch((err) => {
          toast.error(err.message || "Failed to start export", {
            id: toastIdRef.current!,
            duration: 5000,
          });
          setIsExporting(false);
          disconnect();
        });
      },
      onStompError: (frame) => {
        toast.error("Connection error: " + (frame.headers?.message || "Unknown error"), {
          id: toastIdRef.current!,
          duration: 5000,
        });
        setIsExporting(false);
        disconnect();
      },
      onWebSocketClose: () => {
        if (isExporting) {
          setIsExporting(false);
        }
      },
    });

    clientRef.current = client;
    client.activate();
  };

  return {
    triggerExport,
    isExporting,
    progress,
    status,
  };
};
