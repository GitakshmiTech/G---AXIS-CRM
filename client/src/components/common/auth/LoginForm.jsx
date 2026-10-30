//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, router navigation, and common form inputs
//==================================================================================================================
import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import EmailInput from '../input common/emailInput/EmailInput';
import PasswordInput from '../input common/passwordInput/PasswordInput';
import Button from '../buttons/Button';

//==================================================================================================================
//    REUSABLE LOGIN FORM COMPONENT
//    Configurable form supporting multi-role authentication (BDE, Sales, etc.)
//==================================================================================================================
export const LoginForm = memo(({
  role = 'bde',
  title = 'Sign in to your account',
  subtitle = 'Welcome back! Please enter your details.',
  dashboardPath,
  forgotPasswordPath,
  onLogin,
}) => {
  const navigate = useNavigate();

  // Determine paths and session key based on role
  const resolvedDashboardPath = dashboardPath || `/${role}/dashboard`;
  const resolvedForgotPasswordPath = forgotPasswordPath || `/${role}/forgot-password`;

  //==================================================================================================================
  //    Lifecycle: Record Login Type in Session
  //==================================================================================================================
  useEffect(() => {
    sessionStorage.setItem('last_login_type', role);
  }, [role]);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  //==================================================================================================================
  //    Handle Form Submit
  //==================================================================================================================
  const handleSubmit = useCallback((e) => {
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

    if (onLogin) {
      onLogin({ email: trimmedEmail, password: trimmedPassword, rememberMe });
      return;
    }

    console.log(`${role.toUpperCase()} Login:`, { email: trimmedEmail, password: trimmedPassword, rememberMe });
    navigate(resolvedDashboardPath);
  }, [email, password, rememberMe, role, onLogin, navigate, resolvedDashboardPath]);

  return (
    <div className="flex flex-col pt-[40px] pb-[72px] px-[48px] gap-[30px] w-full">
      {/* ==============================================================================================================
          Sign in Heading
      ============================================================================================================== */}
      <div className="text-center mb-5">
        <h1 className="text-[26px] md:text-[28px] font-bold text-black-90 tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-xs md:text-sm font-medium text-black-90/70 mt-1">
          {subtitle}
        </p>
      </div>

      {/* ==============================================================================================================
          Sign in Form
      ============================================================================================================== */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
        <EmailInput
          label="Email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          required
          inputClassName="w-full h-[40px] px-3 py-2 pr-10 bg-gray border border-stroke rounded-lg focus:outline-none focus:border-primary text-sm font-medium placeholder:text-black-90/50"
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
          forgotPasswordLink={resolvedForgotPasswordPath}
          forgotPasswordState={{ from: role }}
          inputClassName="w-full h-[40px] px-3 py-2 pr-10 bg-gray border border-stroke rounded-lg focus:outline-none focus:border-primary text-sm font-medium placeholder:text-black-90/50"
        />

        {error && (
          <p className="text-alert text-xs font-medium">
            {error}
          </p>
        )}

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`rememberMe-${role}`}
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-stroke text-primary focus:ring-primary cursor-pointer accent-primary"
          />
          <label
            htmlFor={`rememberMe-${role}`}
            className="text-xs font-medium text-black-90 cursor-pointer select-none"
          >
            Remember me
          </label>
        </div>

        <Button type="submit">
          Sign in
        </Button>
      </form>
    </div>
  );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm;
