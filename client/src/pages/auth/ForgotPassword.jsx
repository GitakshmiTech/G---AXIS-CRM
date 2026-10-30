//==================================================================================================================
//    React & Router Imports
//==================================================================================================================
import { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';

//==================================================================================================================
//    Layout, Input & Common Components
//==================================================================================================================
import { AuthLayout } from '../../layouts/AuthLayout';
import EmailInput from '../../components/common/input common/emailInput/EmailInput';
import Button from '../../components/common/buttons/Button';

//==================================================================================================================
//    FORGOT PASSWORD COMPONENT
//    Allows BDE & Sales users to request a password reset link
//==================================================================================================================
const ForgotPassword = ({ role: roleProp }) => {
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
  const newPasswordPath = isAdmin ? '/admin/new-password' : isSales ? '/sales/new-password' : '/bde/new-password';

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  //==================================================================================================================
  //    Handle Password Reset Form Submission
  //==================================================================================================================
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    console.log(`Password reset requested for (${isSales ? 'Sales' : 'BDE'}):`, email);
    setSuccess('Password reset link sent to your email.');
  }, [email, isSales]);

  return (
    <AuthLayout>
      <div className="flex flex-col pt-[40px] pb-[72px] px-[48px] gap-[30px] w-full">
        {/* ==============================================================================================================
            Forgot Password Heading
        ============================================================================================================== */}
        <div className="text-center mb-5">
          <h1 className="text-[26px] md:text-[28px] font-bold text-black-90 tracking-tight leading-tight">
            Forgot Password
          </h1>
          <p className="text-xs md:text-sm font-medium text-black-90/70 mt-1">
            Enter your registered email
          </p>
        </div>

        {/* ==============================================================================================================
            Forgot Password Form
        ============================================================================================================== */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
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
            Send Reset Link
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
export default ForgotPassword;
export { ForgotPassword };
