//==================================================================================================================
//    React & Router Imports
//==================================================================================================================
import { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';

//==================================================================================================================
//    Layout, Input & Common Components
//==================================================================================================================
import { AuthLayout } from '../../layouts/AuthLayout';
import PasswordInput from '../../components/common/input common/passwordInput/PasswordInput';
import Button from '../../components/common/buttons/Button';

//==================================================================================================================
//    NEW PASSWORD COMPONENT
//    Allows setting and confirming a new password for BDE & Sales users
//==================================================================================================================
const NewPassword = ({ role: roleProp }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Dynamically resolve whether current context is Admin, Sales or BDE
  const isAdmin = useMemo(() => {
    return (
      roleProp === 'admin' ||
      roleProp === 'super-admin' ||
      location.pathname.startsWith('/admin') ||
      location.pathname.startsWith('/super-admin') ||
      location.state?.from === 'admin' ||
      location.state?.from === 'super-admin' ||
      searchParams.get('from') === 'admin' ||
      searchParams.get('from') === 'super-admin' ||
      sessionStorage.getItem('last_login_type') === 'admin'
    );
  }, [roleProp, location.pathname, location.state, searchParams]);

  // Dynamically resolve whether current context is Sales or BDE
  const isSales = useMemo(() => {
    return (
      roleProp === 'sales' ||
      location.pathname.startsWith('/sales') ||
      location.state?.from === 'sales' ||
      searchParams.get('from') === 'sales' ||
      sessionStorage.getItem('last_login_type') === 'sales'
    );
  }, [roleProp, location.pathname, location.state, searchParams]);

  const loginPath = isAdmin ? '/admin/login' : isSales ? '/sales/login' : '/bde/login';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  //==================================================================================================================
  //    Handle Password Reset Submission
  //==================================================================================================================
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newPassword.trim()) {
      setError('Please enter your new password.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    console.log(`Password updated successfully for (${isSales ? 'Sales' : 'BDE'})`);
    setSuccess('Password updated successfully! Redirecting...');
    setTimeout(() => {
      navigate(loginPath);
    }, 1500);
  }, [newPassword, confirmPassword, navigate, loginPath, isSales]);

  return (
    <AuthLayout>
      <div className="flex flex-col pt-[40px] pb-[72px] px-[48px] gap-[30px] w-full">
        {/* ==============================================================================================================
            New Password Heading
        ============================================================================================================== */}
        <div className="text-center mb-5">
          <h1 className="text-[26px] md:text-[28px] font-bold text-black-90 tracking-tight leading-tight">
            New Password
          </h1>
          <p className="text-xs md:text-sm font-medium text-black-90/70 mt-1">
            Enter a new password
          </p>
        </div>

        {/* ==============================================================================================================
            New Password Form
        ============================================================================================================== */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
          <PasswordInput
            label="New Password"
            name="newPassword"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setError('');
            }}
            required
            inputClassName="w-full h-[40px] px-3 py-2 pr-10 bg-gray border border-stroke rounded-lg focus:outline-none focus:border-primary text-sm font-medium placeholder:text-black-90/50"
          />

          <PasswordInput
            label="Re-enter New Password"
            name="confirmPassword"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError('');
            }}
            required
            inputClassName="w-full h-[40px] px-3 py-2 pr-10 bg-gray border border-stroke rounded-lg focus:outline-none focus:border-primary text-sm font-medium placeholder:text-black-90/50"
          />

          {error && (
            <p className="text-alert text-xs font-medium">
              {error}
            </p>
          )}

          {success && (
            <p className="text-success text-xs font-medium">
              {success}
            </p>
          )}

          <Button type="submit">
            Change Password
          </Button>

          <div className="text-center mt-1">
            <span className="text-xs font-medium text-black-90/80">
              Back to{' '}
            </span>
            <Link
              to={loginPath}
              className="text-xs font-medium text-secondary underline hover:opacity-80"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

//==================================================================================================================
//    Default & Named Exports
//==================================================================================================================
export default NewPassword;
export { NewPassword };
