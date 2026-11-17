//===========================================================================================
//    LOGIN FORM SUBCOMPONENT (AUTH MODULE)
//    Form for credentials entry, automatic role determination, and Redux login
//===========================================================================================

import React, { useState, useCallback, memo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import EmailInput from '../../common/inputs/EmailInput';
import PasswordInput from '../../common/inputs/PasswordInput';
import Button from '../../common/buttons/Button';
import { loginSuccess } from '../../../store/slices/authSlice';
import { resolveUserByCredentials } from '../../../constants/authConstants';

export const LoginForm = memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Strict Rule #23: Form inputs MUST initialize completely empty, displaying only placeholders
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  // Form submission & automatic role determination from user credentials
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setError('');

      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      if (!trimmedEmail) {
        setError('Please enter your email address.');
        return;
      }

      if (!trimmedPassword) {
        setError('Please enter your password.');
        return;
      }

      // Automatic role resolution from credentials
      const { role: resolvedRole, user } = resolveUserByCredentials(trimmedEmail);

      dispatch(
        loginSuccess({
          role: resolvedRole,
          user,
          token: `token-${resolvedRole}-${Date.now()}`,
        })
      );

      navigate('/dashboard', { replace: true });
    },
    [email, password, dispatch, navigate]
  );

  return (
    <div className="flex flex-col pt-[40px] pb-[72px] px-[24px] sm:px-[48px] gap-[30px] w-full">
      {/* Header / Titles */}
      <div className="text-center">
        <h1 className="text-[26px] md:text-[28px] font-bold text-black-90 tracking-tight leading-tight">
          Sign in to your account
        </h1>
        <p className="text-xs sm:text-sm text-black-90/60 font-medium mt-1">
          Welcome back! Enter credentials to proceed.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
        {/* Error Alert */}
        {error && (
          <div className="p-3 text-xs font-semibold text-alert bg-alert/10 border-b-2 border-stroke/80 rounded-[7px] text-center">
            {error}
          </div>
        )}

        {/* Email Input */}
        <EmailInput
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          placeholder="name@example.com"
          required
        />

        {/* Password Input */}
        <PasswordInput
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError('');
          }}
          placeholder="••••••"
          required
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-xs font-medium">
          <label className="flex items-center gap-2 cursor-pointer select-text text-black-90/70">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded-[4px] border-b-2 border-stroke/80 text-primary accent-primary cursor-pointer"
            />
            <span>Remember me</span>
          </label>

          <Link
            to="/forgot-password"
            className="text-primary hover:underline cursor-pointer font-semibold"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <div className="mt-2">
          <Button
            type="submit"
            className="w-full h-[44px] bg-primary hover:bg-primary/95 text-white-100 font-semibold text-sm rounded-[7px] border-b-2 border-stroke/80 transition-all cursor-pointer"
          >
            Sign In
          </Button>
        </div>
      </form>
    </div>
  );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm;
