//===========================================================================================
//    LOGIN FORM SUBCOMPONENT (AUTH MODULE)
//    Form for credentials entry, automatic role determination, and Redux login
//===========================================================================================

import { useState, useCallback, memo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import EmailInput from '../../common/inputs/EmailInput';
import PasswordInput from '../../common/inputs/PasswordInput';
import Button from '../../common/buttons/Button';
import { loginSuccess } from '../../../store/slices/authSlice';
import { loginSchema } from '../../../utils/validationSchemas';
import { clearFieldError, focusFirstInvalidField, validateForm } from '../../../utils/validationUtils';
import { authenticate } from '../../../services/profileService';
import { useToast } from '../../../hooks/useToast';

export const LoginForm = memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  // Strict Rule #23: Form inputs MUST initialize completely empty, displaying only placeholders
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  // Form submission & automatic role determination from user credentials
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const validation = await validateForm(loginSchema, { email, password });
      if (Object.keys(validation.errors).length) {
        setFieldErrors(validation.errors);
        focusFirstInvalidField(formRef.current, validation.errors);
        return;
      }
      setFieldErrors({});
      const trimmedEmail = email.trim();

      setIsSubmitting(true);
      try {
        const session = await authenticate({ email: trimmedEmail, password });
        dispatch(loginSuccess(session));
        navigate('/dashboard', { replace: true });
      } catch (error) {
        toast(error.message || 'Invalid email or password. Please check your credentials.', 'error');
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, password, dispatch, navigate, toast]
  );

  return (
    <div className="flex flex-col py-6 px-6 sm:px-12 gap-6 w-full max-w-[440px] mx-auto">
      {/* Header / Titles */}
      <div className="text-center">
        <h1 className="text-2xl md:text-[26px] font-bold text-black-90 tracking-tight leading-tight">
          Sign in to your account
        </h1>
        <p className="text-xs sm:text-sm text-black-90/60 font-medium mt-1">
          Welcome back! Enter credentials to proceed.
        </p>
      </div>

      {/* Form Card */}
      <form ref={formRef} noValidate onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        {/* Email Input */}
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

        {/* Password Input */}
        <PasswordInput
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearFieldError(setFieldErrors, 'password');
          }}
          placeholder="••••••"
          required
          error={fieldErrors.password}
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
            disabled={isSubmitting}
            className="w-full h-[44px] bg-primary hover:bg-primary/95 text-white-100 font-semibold text-sm rounded-[7px] border-b-2 border-stroke/80 transition-all cursor-pointer disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </Button>
        </div>
      </form>
    </div>
  );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm;
