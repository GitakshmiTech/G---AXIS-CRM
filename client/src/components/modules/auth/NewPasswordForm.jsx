//===========================================================================================
//    NEW PASSWORD FORM SUBCOMPONENT (AUTH MODULE)
//    Password reset form for establishing a secure new credential
//===========================================================================================

import { useState, useCallback, memo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../common/inputs/PasswordInput';
import Button from '../../common/buttons/Button';
import { resetPasswordSchema } from '../../../utils/validationSchemas';
import { clearFieldError, focusFirstInvalidField, validateForm } from '../../../utils/validationUtils';

export const NewPasswordForm = memo(() => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const formRef = useRef(null);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const validation = await validateForm(resetPasswordSchema, { password, confirmPassword });
      if (Object.keys(validation.errors).length) {
        setFieldErrors(validation.errors);
        focusFirstInvalidField(formRef.current, validation.errors);
        return;
      }
      setSubmitted(true);
      setFieldErrors({});
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1200);
    },
    [password, confirmPassword, navigate]
  );

  return (
    <div className="flex flex-col py-6 px-6 sm:px-12 gap-6 w-full max-w-[440px] mx-auto">
      <div className="text-center">
        <h1 className="text-2xl md:text-[26px] font-bold text-black-90 tracking-tight leading-tight">
          Reset Password
        </h1>
        <p className="text-xs sm:text-sm text-black-90/60 font-medium mt-1">
          Enter your new password to regain account access.
        </p>
      </div>

      <form ref={formRef} noValidate onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">

        {submitted && (
          <div className="p-3 text-xs font-semibold text-success bg-success/10 border-b-2 border-stroke/80 rounded-[7px] text-center">
            Password updated successfully! Redirecting to sign in...
          </div>
        )}

        <PasswordInput
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearFieldError(setFieldErrors, 'password');
          }}
          placeholder="New password"
          required
          error={fieldErrors.password}
        />

        <PasswordInput
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            clearFieldError(setFieldErrors, 'confirmPassword');
          }}
          placeholder="Confirm new password"
          required
          name="confirmPassword"
          error={fieldErrors.confirmPassword}
        />

        <div className="mt-2 flex flex-col gap-3">
          <Button
            type="submit"
            className="w-full h-[44px] bg-primary hover:bg-primary/95 text-white-100 font-semibold text-sm rounded-[7px] border-b-2 border-stroke/80 transition-all cursor-pointer"
          >
            Update Password
          </Button>

          <div className="text-center">
            <Link
              to="/login"
              className="text-xs text-primary hover:underline font-semibold cursor-pointer"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
});

NewPasswordForm.displayName = 'NewPasswordForm';

export default NewPasswordForm;
