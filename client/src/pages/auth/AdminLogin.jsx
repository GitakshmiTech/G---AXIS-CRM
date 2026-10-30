//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, layout shell, and reusable auth form
//==================================================================================================================
import React from 'react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { LoginForm } from '../../components/common/auth/LoginForm';

//==================================================================================================================
//    SUPER ADMIN LOGIN PAGE COMPONENT
//    Dedicated entry route for Super Admin (/admin/login, /super-admin/login)
//==================================================================================================================
const AdminLogin = () => {
  return (
    <AuthLayout>
      <LoginForm
        role="admin"
        title="Sign in to your account"
        subtitle="Welcome back! Please enter your details."
        dashboardPath="/admin/dashboard"
        forgotPasswordPath="/admin/forgot-password"
      />
    </AuthLayout>
  );
};

//==================================================================================================================
//    DEFAULT & NAMED EXPORTS
//==================================================================================================================
export default AdminLogin;
export { AdminLogin };
