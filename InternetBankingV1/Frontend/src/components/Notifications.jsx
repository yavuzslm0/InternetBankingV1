// src/components/Notifications.jsx
import { useEffect, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import { socket, connectSocket, disconnectSocket } from "../services/socket";
import { getMe } from "../services/authService";

export default function Notifications() {
  const prevBalanceRef = useRef(0); // önceki bakiye
  const socketConnectedRef = useRef(false); // aynı socket’in birden fazla bağlanmasını önler

  useEffect(() => {
    let isMounted = true;

    const setupNotifications = async () => {
      try {
        const user = await getMe();
        if (!isMounted) return;

        prevBalanceRef.current = user.balance ?? 0;

        // Socket zaten bağlı değilse bağlan
        if (!socketConnectedRef.current) {
          connectSocket(user._id);
          socketConnectedRef.current = true;
        }

        // Gelen balanceUpdate eventlerini dinle
        socket.on("balanceUpdate", (newBalance) => {
          const delta = newBalance - (prevBalanceRef.current ?? 0);

          if (delta > 0) {
            toast.success(`Hesabınıza ${delta} ₺ yatırıldı 💸`);
          }

          // prevBalance her zaman güncellenir
          prevBalanceRef.current = newBalance;
        });
      } catch (err) {
        console.error("Notifications setup error:", err);
      }
    };

    setupNotifications();

    return () => {
      isMounted = false;
      socket.off("balanceUpdate");
      disconnectSocket();
      socketConnectedRef.current = false;
    };
  }, []);

  return <Toaster position="top-right" />;
}
