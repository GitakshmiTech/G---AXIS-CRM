/** Convert a user-facing DD/MM/YYYY date to the API's YYYY-MM-DD format. */
export const parseDealCloseDate = (value = '') => {
  const dateText = value.trim();
  if (!dateText) return { value: '', error: '' };
  const match = dateText.match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/);
  if (!match) return { value: '', error: 'Enter the expected close date as DD/MM/YYYY.' };
  const [, day, month, year] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (date.getUTCFullYear() !== Number(year) || date.getUTCMonth() !== Number(month) - 1 || date.getUTCDate() !== Number(day)) {
    return { value: '', error: 'Enter a valid expected close date.' };
  }
  return { value: `${year}-${month}-${day}`, error: '' };
};
