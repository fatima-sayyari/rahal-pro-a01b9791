import { WHATSAPP } from "@/data/services";

export function WhatsAppFab() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل عبر واتساب"
      className="fixed bottom-5 left-5 z-50 flex h-14 w-14 items-center justify-center rounded-full text-[#16130F] shadow-lg transition-opacity duration-200 hover:opacity-90"
      style={{ background: "linear-gradient(135deg, #F4E4BC, #C9963A 55%, #8A5E28)" }}
    >
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.41a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.76 13.9c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.42-.14-.95-.31-1.64-.6-2.88-1.24-4.76-4.14-4.9-4.33-.14-.19-1.16-1.54-1.16-2.94s.73-2.08 1-2.37c.24-.27.64-.39.85-.39h.61c.2 0 .46-.07.72.55.27.64.91 2.22.99 2.38.08.16.13.35.03.56-.1.22-.15.35-.3.54-.14.19-.3.42-.43.56-.14.14-.29.3-.12.58.16.27.73 1.2 1.57 1.95 1.08.96 1.99 1.26 2.27 1.4.28.14.44.12.6-.07.16-.19.7-.81.88-1.09.19-.27.37-.23.62-.14.26.08 1.62.76 1.9.9.27.14.46.21.53.32.07.12.07.68-.17 1.36z" />
      </svg>
    </a>
  );
}
