//===========================================================================================
//    NEW PASSWORD FORM SUBCOMPONENT (AUTH MODULE)
//    Password reset form for establishing a secure new credential
//===========================================================================================

import React, { useState, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../common/inputs/PasswordInput';
import Button from '../../common/buttons/Button';

export const NewPasswordForm = memo(() => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!password.trim()) {
        setError('Please enter a new password.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      setSubmitted(true);
      setError('');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1200);
    },
    [password, confirmPassword, navigate]
  );

  return (
    <div className="flex flex-col pt-[40px] pb-[72px] px-[24px] sm:px-[48px] gap-[30px] w-full">
      <div className="text-center">
        <h1 className="text-[26px] md:text-[28px] font-bold text-black-90 tracking-tight leading-tight">
          Reset Password
        </h1>
        <p className="text-xs sm:text-sm text-black-90/60 font-medium mt-1">
          Enter your new password to regain account access.
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
            Password updated successfully! Redirecting to sign in...
          </div>
        )}

        <PasswordInput
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError('');
          }}
          placeholder="New password"
          required
        />

        <PasswordInput
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (error) setError('');
          }}
          placeholder="Confirm new password"
          required
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
