//==================================================================================================================
//    TEXT & NUMBER FORMATTING UTILITIES
//==================================================================================================================

/**
 * Formats a number or string into standard currency format
 * @param {number | string} amount
 * @param {string} currencySymbol
 * @returns {string}
 */
export const formatCurrency = (amount, currencySymbol = '₹') => {
  if (amount === undefined || amount === null || amount === '') return '';
  const num = Number(String(amount).replace(/[^0-9.-]+/g, ''));
  if (isNaN(num)) return `${currencySymbol}${amount}`;
  return `${currencySymbol}${num.toLocaleString('en-IN')}`;
};

/**
 * Capitalizes the first letter of a string
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

