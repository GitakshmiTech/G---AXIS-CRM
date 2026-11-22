/** Run a Yup schema and return a normalized field-error map for form components. */
export const validateForm = async (schema, values) => {
  try {
    await schema.validate(values, { abortEarly: false, stripUnknown: true });
    return { values, errors: {} };
  } catch (error) {
    if (error.name !== 'ValidationError') throw error;
    const errors = {};
    for (const issue of error.inner.length ? error.inner : [error]) {
      if (issue.path && !errors[issue.path]) errors[issue.path] = issue.message;
    }
    return { values: null, errors };
  }
};

/** Focus and scroll to the first invalid field after a form submission. */
export const focusFirstInvalidField = (form, errors) => {
  const firstName = Object.keys(errors)[0];
  if (!form || !firstName) return;
  const field = Array.from(form.elements).find((element) => element.name === firstName);
  const target = field?.type === 'hidden'
    ? field.parentElement?.querySelector('input:not([type="hidden"])')
    : field;
  target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  target?.focus({ preventScroll: true });
};

/** Clear the changed field's message without hiding other validation feedback. */
export const clearFieldError = (setErrors, name) => {
  setErrors((current) => {
    if (!current[name]) return current;
    const next = { ...current };
    delete next[name];
    return next;
  });
};

/** Convert Joi's structured response into inline field errors for form UI. */
export const mapApiValidationErrors = (issues = [], fieldMap = {}) => issues.reduce((result, issue) => {
  const key = fieldMap[issue.field] || fieldMap[issue.field?.split('.')[0]] || issue.field;
  if (key && !result[key]) result[key] = issue.message;
  return result;
}, {});
