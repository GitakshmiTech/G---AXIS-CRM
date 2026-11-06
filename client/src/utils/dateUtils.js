//==================================================================================================================
//    DATE UTILITIES (PROJECT-WIDE DD/MM/YYYY STRICT FORMATTING)
//==================================================================================================================

/**
 * Formats any Date object, ISO string, or timestamp to strict DD/MM/YYYY
 * @param {string | Date | number} dateInput
 * @returns {string} Formatted date string in DD/MM/YYYY
 */
export const formatDateDDMMYYYY = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Checks if a string conforms to DD/MM/YYYY
 * @param {string} dateStr
 * @returns {boolean}
 */
export const isValidDDMMYYYY = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return false;
  return /^\d{2}\/\d{2}\/\d{4}$/.test(dateStr.trim());
};

