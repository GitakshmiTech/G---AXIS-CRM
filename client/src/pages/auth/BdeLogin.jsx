//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, layout shell, and reusable auth form
//==================================================================================================================
import React from 'react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { LoginForm } from '../../components/common/auth/LoginForm';

//==================================================================================================================
//    BDE LOGIN PAGE COMPONENT
//==================================================================================================================
const BdeLogin = () => {
  return (
    <AuthLayout>
      <LoginForm
        role="bde"
        dashboardPath="/bde/dashboard"
        forgotPasswordPath="/bde/forgot-password"
      />
    </AuthLayout>
  );
};

//==================================================================================================================
//    DEFAULT & NAMED EXPORTS
//==================================================================================================================
export default BdeLogin;
export { BdeLogin };