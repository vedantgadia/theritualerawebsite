/* The studio's customer contact details (confirmed 21 Nov 2026). */
export const CONTACT_EMAIL = "info@theritualera.com";
export const PHONE_DISPLAY = "+91 97697 28791";
export const WHATSAPP_NUMBER = "919769728791";

export const whatsappLink = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
