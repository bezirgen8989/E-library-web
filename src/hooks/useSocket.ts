import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

interface I_UseSocket {
  url: string;
  getAuthToken: () => Promise<string>;
  isSocketAvailable?: boolean;
}

export const useSocket = ({
  url,
  getAuthToken,
  isSocketAvailable = true,
}: I_UseSocket) => {
  const [connected, setConnected] = useState(false);
  const eventHandlers = useRef<Record<string, any>>({});
  const socketRef = useRef<Socket<DefaultEventsMap> | null>(null);

  useEffect(() => {
    const initializeSocket = async () => {
      if (!isSocketAvailable) return;

      const authToken = await getAuthToken();
      console.log("Access Token:", authToken);

      socketRef.current = io(url, {
        transports: ["websocket"],
        query: { token: authToken },
      });

      if (!socketRef.current) return;

      socketRef.current.on("connect", () => {
        setConnected(true);
        socketRef.current?.emit("authenticate", {});
      });

      socketRef.current.on("disconnect", () => {
        setConnected(false);
      });

      socketRef.current.on("authenticated", () => {
        console.log("Authentication successful! Setting up event listeners...");
      });

      socketRef.current.onAny((event: string, ...args: any[]) => {
        console.log(`Event received: ${event}`, args);
      });
    };

    initializeSocket();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [isSocketAvailable]);

  const subscribeToEvent = useCallback(
    (event: string, callback: (...args: any[]) => void) => {
      if (!socketRef.current) return;
      eventHandlers.current[event] = callback;
      socketRef.current.on(event, callback);
    },
    []
  );

  const unsubscribeFromEvent = useCallback((event: string) => {
    if (!socketRef.current) return;

    if (eventHandlers.current[event]) {
      socketRef.current.off(event, eventHandlers.current[event]);
      delete eventHandlers.current[event];
    }
  }, []);

  const emitEvent = useCallback(
    (event: string, data: any) => {
      if (connected && socketRef.current) {
        socketRef.current.emit(event, data);
      }
    },
    [connected]
  );

  return {
    connected,
    subscribeToEvent,
    unsubscribeFromEvent,
    emitEvent,
    socket: socketRef.current,
  };
};
