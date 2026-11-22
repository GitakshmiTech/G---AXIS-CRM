import * as yup from 'yup';

const email = yup.string().trim().email('Please enter a valid email address.');
const optionalEmail = email.nullable().transform((value) => value || null);
const optionalPhone = yup.string().trim().matches(/^$|^[+\d][\d\s().-]{5,24}$/, 'Please enter a valid phone number.');
const amountPattern = /^(?:\d+|\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})+,\d{3})(?:\.\d{1,2})?$/;
const amountNumberTransform = (value, original) => original === '' ? undefined : Number(String(original).replaceAll(',', ''));

/** Shared Yup rules for authentication and CRM data entry forms. */
export const loginSchema = yup.object({
  email: email.required('Email is required.'),
  password: yup.string().required('Password is required.'),
});

export const forgotPasswordSchema = yup.object({
  email: email.required('Email is required.'),
});

export const resetPasswordSchema = yup.object({
  password: yup.string().min(8, 'Password must contain at least 8 characters.').required('Password is required.'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords do not match.').required('Please confirm your password.'),
});

export const leadSchema = yup.object({
  name: yup.string().trim().max(150).required('Full name is required.'),
  companyName: yup.string().trim().max(200).required('Company name is required.'),
  email: email.required('Email is required.'),
  phone: yup.string().trim().required('Phone number is required.').matches(/^[+\d][\d\s().-]{5,24}$/, 'Please enter a valid phone number.'),
  website: yup.string().trim().test('url', 'Please enter a valid website URL.', (value) => !value || yup.string().url().isValidSync(value)),
  expectedValue: yup.number().transform((value, original) => original === '' ? undefined : value).typeError('Expected value must be a number.').min(0, 'Expected value cannot be negative.').nullable(),
});

/** Validate and normalize close dates entered as DD/MM/YYYY or DD-MM-YYYY. */
export const dealConversionSchema = yup.object({
  title: yup.string().trim().max(200).required('Deal title is required.'),
  amount: yup.number().transform(amountNumberTransform).typeError('Enter a valid deal amount.').min(0, 'Deal amount cannot be negative.').nullable(),
  stage: yup.string().oneOf(['', 'prospect', 'qualification', 'proposal', 'negotiation', 'closed won', 'closed lost'], 'Select a valid deal stage.'),
  closeDate: yup.string().trim().test('date-format', 'Enter the expected close date as DD/MM/YYYY.', (value) => !value || /^\d{2}[/-]\d{2}[/-]\d{4}$/.test(value)).test('valid-date', 'Enter a valid expected close date.', (value) => {
    if (!value) return true;
    const [, day, month, year] = value.match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/) || [];
    if (!day) return false;
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    return date.getUTCFullYear() === Number(year) && date.getUTCMonth() === Number(month) - 1 && date.getUTCDate() === Number(day);
  }),
});

export const dealDetailsSchema = yup.object({
  amount: yup.string().trim().matches(new RegExp(`^$|${amountPattern.source.slice(1, -1)}$`), 'Enter a valid non-negative deal amount.'),
  startDate: dealConversionSchema.fields.closeDate,
  closeDate: dealConversionSchema.fields.closeDate,
});

export const contactSchema = yup.object({
  name: yup.string().trim().max(150).required('Contact name is required.'),
  designation: yup.string().trim().max(150),
  email: optionalEmail,
  phone: optionalPhone,
});

export const accountSchema = yup.object({
  company: yup.string().trim().max(200).required('Company name is required.'),
  email: optionalEmail,
  phone: optionalPhone,
  gstNo: yup.string().trim().max(32),
});

export const clientSchema = yup.object({
  name: yup.string().trim().max(200).required('Client name is required.'),
  email: optionalEmail,
  phone: optionalPhone,
  website: yup.string().trim().test('url', 'Please enter a valid website URL.', (value) => !value || yup.string().url().isValidSync(value)),
  postalCode: yup.string().trim().matches(/^$|^[\p{L}\d\s-]{3,12}$/u, 'Please enter a valid postal code.'),
});

export const editDealSchema = yup.object({
  dealName: yup.string().trim().max(200).required('Deal name is required.'),
  dealAmount: yup.string().trim().matches(new RegExp(`^$|${amountPattern.source.slice(1, -1)}$`), 'Enter a valid non-negative deal amount.'),
  probability: yup.number().transform((value, original) => original === '' ? undefined : value).typeError('Probability must be a number.').integer('Probability must be a whole number.').min(0, 'Probability cannot be below 0.').max(100, 'Probability cannot exceed 100.').nullable(),
  userCount: yup.number().transform((value, original) => original === '' ? undefined : value).typeError('User count must be a number.').integer('User count must be a whole number.').min(0, 'User count cannot be negative.').nullable(),
  closeDate: dealConversionSchema.fields.closeDate,
  lostReason: yup.string().trim().max(255, 'Lost reason cannot exceed 255 characters.'),
});

export const quotationSchema = yup.object({
  selectDeal: yup.string().trim().required('Select a deal.'),
  closeDate: dealConversionSchema.fields.closeDate,
  dealAmount: yup.string().trim().matches(new RegExp(`^$|${amountPattern.source.slice(1, -1)}$`), 'Enter a valid non-negative deal amount.'),
});

export const editContactSchema = yup.object({
  firstName: yup.string().trim().max(100).required('First name is required.'),
  lastName: yup.string().trim().max(100).required('Last name is required.'),
  email: optionalEmail,
  phone: optionalPhone,
});
