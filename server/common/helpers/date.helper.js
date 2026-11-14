//    DATE FORMATTER HELPER (STRICT DD/MM/YYYY FORMAT PER RULE 22)

/**
 * @param {Date|string|number} dateInput
 * @returns {string} Formatted date string (e.g. 12/11/2026)
 */
const formatDateDDMMYYYY = (dateInput) => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * @param {Date|string|number} dateInput
 * @returns {string} Formats time in 12-hour AM/PM format (e.g. 04:30 PM)
 */
const formatTimeAMPM = (dateInput) => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * @param {string} dateString - Format DD/MM/YYYY
 * @returns {string|null} ISO date string YYYY-MM-DD
 */
const parseDDMMYYYYtoSQL = (dateString) => {
  if (!dateString) return null;
  const parts = dateString.trim().split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return dateString;
};

module.exports = {
  formatDateDDMMYYYY,
  formatTimeAMPM,
  parseDDMMYYYYtoSQL,
};

