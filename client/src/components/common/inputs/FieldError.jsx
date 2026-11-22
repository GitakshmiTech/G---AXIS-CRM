import { memo } from 'react';

/** Show one accessible validation message beside its associated form field. */
export const FieldError = memo(({ name, error }) => error ? (
  <p id={`${name}-error`} role="alert" aria-live="polite" className="mt-1 text-xs text-alert">{error}</p>
) : null);

FieldError.displayName = 'FieldError';
export default FieldError;
