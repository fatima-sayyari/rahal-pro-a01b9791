import { MessageCircle } from "lucide-react";
import { WHATSAPP } from "@/data/services";

export function WhatsAppFab() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP}`}
      target="_blank"
      rel="noreferrer"
      aria-label="تواصل عبر واتساب"
      className="fixed bottom-5 left-5 z-50 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition"
      style={{ background: "linear-gradient(135deg,#25D366,#128C7E)" }}
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
