//===========================================================================================
//    FORGOT PASSWORD FORM SUBCOMPONENT (AUTH MODULE)
//    Password recovery form allowing users to submit email for reset instruction
//===========================================================================================

import React, { useState, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmailInput from '../../common/inputs/EmailInput';
import Button from '../../common/buttons/Button';

export const ForgotPasswordForm = memo(() => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!email.trim()) {
        setError('Please enter your email address.');
        return;
      }
      setSubmitted(true);
      setError('');
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
        {error && (
          <div className="p-3 text-xs font-semibold text-alert bg-alert/10 border-b-2 border-stroke/80 rounded-[7px] text-center">
            {error}
          </div>
        )}

        {submitted && (
          <div className="p-3 text-xs font-semibold text-success bg-success/10 border-b-2 border-stroke/80 rounded-[7px] text-center">
            Password reset link sent! Redirecting...
          </div>
        )}

        <EmailInput
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          placeholder="name@example.com"
          required
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
