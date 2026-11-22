//===========================================================================================
//    FORGOT PASSWORD FORM SUBCOMPONENT (AUTH MODULE)
//    Password recovery form allowing users to submit email for reset instruction
//===========================================================================================

import { useState, useCallback, memo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmailInput from '../../common/inputs/EmailInput';
import Button from '../../common/buttons/Button';
import { forgotPasswordSchema } from '../../../utils/validationSchemas';
import { clearFieldError, focusFirstInvalidField, validateForm } from '../../../utils/validationUtils';

export const ForgotPasswordForm = memo(() => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const formRef = useRef(null);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const validation = await validateForm(forgotPasswordSchema, { email });
      if (Object.keys(validation.errors).length) {
        setFieldErrors(validation.errors);
        focusFirstInvalidField(formRef.current, validation.errors);
        return;
      }
      setSubmitted(true);
      setFieldErrors({});
      setTimeout(() => {
        navigate('/new-password');
      }, 1200);
    },
    [email, navigate]
  );

  return (
    <div className="flex flex-col pt-[40px] pb-[72px] px-[24px] sm:px-[48px] gap-[30px] w-full">
      <div className="text-center">
        <h1 className="text-[26px] md:text-[28px] font-bold text-black-90 tracking-tight leading-tight">
          Forgot Password
        </h1>
        <p className="text-xs sm:text-sm text-black-90/60 font-medium mt-1">
          Enter your email to receive recovery instructions.
        </p>
      </div>

      <form ref={formRef} noValidate onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">

        {submitted && (
          <div className="p-3 text-xs font-semibold text-success bg-success/10 border-b-2 border-stroke/80 rounded-[7px] text-center">
            Password reset link sent! Redirecting...
          </div>
        )}

        <EmailInput
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearFieldError(setFieldErrors, 'email');
          }}
          placeholder="name@example.com"
          required
          error={fieldErrors.email}
        />

        <div className="mt-2 flex flex-col gap-3">
          <Button
            type="submit"
            className="w-full h-[44px] bg-primary hover:bg-primary/95 text-white-100 font-semibold text-sm rounded-[7px] border-b-2 border-stroke/80 transition-all cursor-pointer"
          >
            Send Reset Link
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

ForgotPasswordForm.displayName = 'ForgotPasswordForm';

export default ForgotPasswordForm;
