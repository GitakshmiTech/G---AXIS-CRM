//===========================================================================================
//    CONTACT DISPLAY AND ACTION HELPERS
// ===========================================================================================

/** Return the WhatsApp URL for a phone number with only dialable digits. */
export const getContactWhatsAppUrl = (phone = '') => {
  const digits = String(phone).replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : '';
};
