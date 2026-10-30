//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, layout shell, and reusable auth form
//==================================================================================================================
import React from 'react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { LoginForm } from '../../components/common/auth/LoginForm';

//==================================================================================================================
//    SALES LOGIN PAGE COMPONENT
//    Dedicated entry route for Sales team members (/sales/login)
//==================================================================================================================
const SalesLogin = () => {
  return (
    <AuthLayout>
      <LoginForm
        role="sales"
        dashboardPath="/sales/dashboard"
        forgotPasswordPath="/sales/forgot-password"
      />
    </AuthLayout>
  );
};

//==================================================================================================================
//    DEFAULT & NAMED EXPORTS
//==================================================================================================================
export default SalesLogin;
export { SalesLogin };
