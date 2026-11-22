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
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dateStr.trim());
  if (!match) return false;
  const [, day, month, year] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return date.getUTCFullYear() === Number(year) && date.getUTCMonth() === Number(month) - 1 && date.getUTCDate() === Number(day);
};

/** Convert a valid DD/MM/YYYY input to the YYYY-MM-DD format expected by CRM APIs. */
export const toApiDate = (dateStr) => {
  if (!isValidDDMMYYYY(dateStr)) return '';
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
};

/** Convert an API date into the project's DD/MM/YYYY display format without timezone shifts. */
export const fromApiDate = (dateStr) => {
  if (!dateStr) return '';
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(dateStr));
  if (!match) return formatDateDDMMYYYY(dateStr);
  return `${match[3]}/${match[2]}/${match[1]}`;
};

