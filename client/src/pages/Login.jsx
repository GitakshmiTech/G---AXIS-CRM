//===========================================================================================
//    SINGLE UNIFIED LOGIN PAGE
//    Central authentication entry point dynamically hosting sign-in, recovery, and reset views
//===========================================================================================

import React, { memo } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { LoginForm } from '../components/modules/auth/LoginForm';
import { ForgotPasswordForm } from '../components/modules/auth/ForgotPasswordForm';
import { NewPasswordForm } from '../components/modules/auth/NewPasswordForm';

export const Login = memo(({ mode }) => {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  // Determine active view based on prop or current URL path
  const isForgotPassword = mode === 'forgot' || currentPath.includes('forgot-password');
  const isNewPassword =
    mode === 'new-password' ||
    currentPath.includes('new-password') ||
    currentPath.includes('reset-password');

  return (
    <AuthLayout>
      {isForgotPassword && <ForgotPasswordForm />}
      {isNewPassword && <NewPasswordForm />}
      {!isForgotPassword && !isNewPassword && <LoginForm />}
    </AuthLayout>
  );
});

Login.displayName = 'Login';

export default Login;
