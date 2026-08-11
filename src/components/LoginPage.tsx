import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  ArrowRight,
  KeyRound,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertTriangle,
  Check,
  Phone,
  Send,
  RefreshCw,
  Smartphone,
  Sparkles
} from 'lucide-react';
import { FacultyUser } from '../types';
import { storageService } from '../services/storage';

interface LoginPageProps {
  onLoginSuccess: (user: FacultyUser) => void;
  onShowToast: (msg: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state (Supports both Email and Mobile Phone)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Security Lockout State
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDept, setRegDept] = useState('Computer Science & Engineering');
  const [regDesignation, setRegDesignation] = useState('Assistant Professor');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // New Registration OTP Verification Modal state
  const [showRegisterOtpModal, setShowRegisterOtpModal] = useState(false);
  const [pendingRegisterUser, setPendingRegisterUser] = useState<FacultyUser | null>(null);
  const [pendingRegisterPassword, setPendingRegisterPassword] = useState('');
  const [registerOtpCode, setRegisterOtpCode] = useState('');
  const [userEnteredRegisterOtp, setUserEnteredRegisterOtp] = useState('');

  // Forgot Password / Email Push OTP State
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<'request' | 'otp' | 'new_password'>('request');
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userEnteredOtp, setUserEnteredOtp] = useState('');
  const [otpResendTimer, setOtpResendTimer] = useState(0);
  const [emailPushNotification, setEmailPushNotification] = useState<{
    visible: boolean;
    sender: string;
    recipient: string;
    subject: string;
    otpCode: string;
    timestamp: string;
  } | null>(null);

  // New Password State for Forgot Password flow
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Lockout Countdown Timer Effect
  useEffect(() => {
    let timer: any = null;
    if (lockoutTimeLeft > 0) {
      timer = setInterval(() => {
        setLockoutTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (lockoutTimeLeft === 0 && failedAttempts >= 5) {
      setFailedAttempts(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [lockoutTimeLeft, failedAttempts]);

  // OTP Resend Countdown Effect
  useEffect(() => {
    let timer: any = null;
    if (otpResendTimer > 0) {
      timer = setInterval(() => {
        setOtpResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [otpResendTimer]);

  // Email validation regex
  const isValidEmail = (str: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim());
  };

  // Phone validation (digits check)
  const isValidPhone = (str: string) => {
    const digits = str.replace(/\D/g, '');
    return digits.length >= 8 && digits.length <= 15;
  };

  // Password Strength Requirements calculation
  const getPasswordCriteria = (pwd: string) => {
    return {
      minLength: pwd.length >= 8,
      hasUpper: /[A-Z]/.test(pwd),
      hasLower: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecial: /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(pwd),
    };
  };

  const getPasswordStrength = (pwd: string) => {
    const c = getPasswordCriteria(pwd);
    let score = 0;
    if (c.minLength) score += 1;
    if (c.hasUpper && c.hasLower) score += 1;
    if (c.hasNumber) score += 1;
    if (c.hasSpecial) score += 1;
    return score; // 0..4
  };

  const regPwdCriteria = getPasswordCriteria(regPassword);
  const regPwdScore = getPasswordStrength(regPassword);
  const isRegPwdStrong = regPwdScore >= 4;

  const newPwdCriteria = getPasswordCriteria(newPassword);
  const newPwdScore = getPasswordStrength(newPassword);
  const isNewPwdStrong = newPwdScore >= 4;

  // Handle Standard Login (Supports Email OR Mobile Phone)
  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimeLeft > 0) {
      onShowToast(`Account locked due to multiple failed attempts. Please wait ${lockoutTimeLeft}s.`, 'error');
      return;
    }

    const cleanInput = loginIdentifier.trim();
    if (!cleanInput || !password) {
      onShowToast('Please enter both Email / Mobile Phone and Password.', 'error');
      return;
    }

    // STRICT CHECK: Verify existing account in storage by Email OR Phone
    const registeredAccount = storageService.findAccount(cleanInput);

    if (!registeredAccount) {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      if (nextAttempts >= 5) {
        setLockoutTimeLeft(30);
        onShowToast('5 consecutive failed login attempts! Login locked for 30 seconds for security.', 'error');
      } else {
        onShowToast(`No account found matching "${cleanInput}". Enter a registered Email or Mobile Number. (${5 - nextAttempts} attempts left)`, 'error');
      }
      return;
    }

    if (registeredAccount.passwordHash !== password) {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      if (nextAttempts >= 5) {
        setLockoutTimeLeft(30);
        onShowToast('5 consecutive failed login attempts! Login locked for 30 seconds for security.', 'error');
      } else {
        onShowToast(`Incorrect password for ${registeredAccount.user.fullName}. Please check password. (${5 - nextAttempts} attempts left)`, 'error');
      }
      return;
    }

    // Success! Reset failed attempts
    setFailedAttempts(0);
    onShowToast(`Welcome back, ${registeredAccount.user.fullName}!`, 'success');
    onLoginSuccess(registeredAccount.user);
  };

  // Handle Registration with OTP Verification
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = regEmail.trim().toLowerCase();
    const cleanPhone = regPhone.trim();

    if (!regFullName.trim() || !cleanEmail || !regPassword) {
      onShowToast('Please fill in all required fields.', 'error');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      onShowToast('Please enter a valid email address.', 'warning');
      return;
    }

    if (cleanPhone && !isValidPhone(cleanPhone)) {
      onShowToast('Please enter a valid mobile phone number.', 'warning');
      return;
    }

    // Validate strong password policy
    if (!isRegPwdStrong) {
      onShowToast('Please create a strong password meeting all security requirements.', 'warning');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      onShowToast('Passwords do not match.', 'error');
      return;
    }

    // Check if account already exists by Email or Phone
    const existing = storageService.findAccount(cleanEmail) || (cleanPhone ? storageService.findAccount(cleanPhone) : undefined);
    if (existing) {
      onShowToast(`An account with this email or mobile number already exists. Please sign in instead.`, 'warning');
      setActiveTab('login');
      setLoginIdentifier(cleanEmail);
      return;
    }

    const newUser: FacultyUser = {
      id: Date.now(),
      fullName: regFullName.trim(),
      email: cleanEmail,
      phone: cleanPhone || '+91 98765 43210',
      designation: regDesignation,
      department: regDept,
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    };

    // Generate 6-digit OTP code for verifying new account
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setRegisterOtpCode(code);
    setUserEnteredRegisterOtp('');
    setPendingRegisterUser(newUser);
    setPendingRegisterPassword(regPassword);
    setShowRegisterOtpModal(true);
    setOtpResendTimer(30);

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Dispatch real email via backend API if SMTP configured
    dispatchOtpEmail(cleanEmail, regFullName.trim(), code, 'registration');
  };

  // Helper function to call backend API for sending real OTP emails
  const dispatchOtpEmail = async (email: string, name: string, code: string, purpose: 'registration' | 'reset') => {
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: email,
          recipientName: name,
          otpCode: code,
          purpose: purpose,
        }),
      });
      const data = await response.json();
      if (data.deliveredToInbox) {
        onShowToast(`Real confirmation email delivered directly to ${email}! Check your inbox.`, 'success');
      } else {
        onShowToast(`OTP code sent to ${email}.`, 'info');
      }
    } catch (err) {
      console.error('OTP API call error:', err);
    }
  };

  // Complete Registration after verifying OTP
  const handleVerifyRegisterOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingRegisterUser) return;

    const cleanUserOtp = userEnteredRegisterOtp.trim();
    if (!cleanUserOtp) {
      onShowToast('Please enter the 6-digit OTP verification code.', 'warning');
      return;
    }

    if (cleanUserOtp !== registerOtpCode) {
      onShowToast('Invalid OTP code. Please check your email and try again.', 'error');
      return;
    }

    // Store the verified account in local storage
    storageService.registerAccount(pendingRegisterUser, pendingRegisterPassword);

    setShowRegisterOtpModal(false);
    setEmailPushNotification(null);
    onShowToast(`Email verified successfully! Welcome, ${pendingRegisterUser.fullName}!`, 'success');
    onLoginSuccess(pendingRegisterUser);
  };

  const handleResendRegisterOtp = () => {
    if (!pendingRegisterUser) return;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setRegisterOtpCode(code);
    setUserEnteredRegisterOtp('');
    setOtpResendTimer(30);

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setEmailPushNotification({
      visible: true,
      sender: 'auth-verify@college.edu',
      recipient: pendingRegisterUser.email,
      subject: '🔐 Resent Verification OTP Code',
      otpCode: code,
      timestamp: nowStr,
    });

    dispatchOtpEmail(pendingRegisterUser.email, pendingRegisterUser.fullName, code, 'registration');
  };

  // FORGOT PASSWORD - STEP 1: Dispatch Email Push / SMS OTP
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanIdentifier = forgotIdentifier.trim();
    if (!cleanIdentifier) {
      onShowToast('Please enter your registered Email or Mobile Number.', 'warning');
      return;
    }

    const account = storageService.findAccount(cleanIdentifier);
    if (!account) {
      onShowToast(`No account registered with "${cleanIdentifier}". Please check your input.`, 'error');
      return;
    }

    // Generate random 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setUserEnteredOtp('');
    setForgotStep('otp');
    setOtpResendTimer(30);

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Trigger Email Push Notification payload
    setEmailPushNotification({
      visible: true,
      sender: 'auth-security@college.edu',
      recipient: account.user.email,
      subject: '🔐 Security Verification: OTP Password Reset',
      otpCode: code,
      timestamp: nowStr,
    });

    dispatchOtpEmail(account.user.email, account.user.fullName, code, 'reset');
  };

  // FORGOT PASSWORD - STEP 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUserOtp = userEnteredOtp.trim();

    if (!cleanUserOtp) {
      onShowToast('Please enter the 6-digit OTP code.', 'warning');
      return;
    }

    if (cleanUserOtp !== generatedOtp) {
      onShowToast('Invalid OTP code. Please check the Email Push notification and try again.', 'error');
      return;
    }

    onShowToast('OTP verified successfully! Set your new password.', 'success');
    setForgotStep('new_password');
  };

  // FORGOT PASSWORD - STEP 3: Reset Password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isNewPwdStrong) {
      onShowToast('New password must meet all security requirements.', 'warning');
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      onShowToast('Passwords do not match.', 'error');
      return;
    }

    const updated = storageService.updatePassword(forgotIdentifier, newPassword);

    if (updated) {
      onShowToast('Password updated successfully! Log in with your new credentials.', 'success');
      setShowForgotPassword(false);
      setForgotStep('request');
      setLoginIdentifier(forgotIdentifier);
      setPassword(newPassword);
      setNewPassword('');
      setNewPasswordConfirm('');
      setEmailPushNotification(null);
    } else {
      onShowToast('Failed to update password. Please try again.', 'error');
    }
  };

  // Simulated Email Inbox Viewer Modal (to test receiving actual emails without spoiling code on login page)
  const [showSimulatedInbox, setShowSimulatedInbox] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* SIMULATED WEBMAIL INBOX CLIENT MODAL (Simulates opening user's Gmail/Webmail inbox) */}
      {showSimulatedInbox && emailPushNotification && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setShowSimulatedInbox(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Webmail Header */}
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Webmail Inbox Service</span>
                  <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                    {emailPushNotification.recipient}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">Incoming Mail Server Simulation</p>
              </div>
            </div>

            {/* Email Message Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-start text-xs border-b border-slate-800/80 pb-2.5">
                <div>
                  <p className="font-semibold text-slate-200">From: <span className="text-blue-400">{emailPushNotification.sender}</span></p>
                  <p className="text-slate-400 text-[11px]">To: {emailPushNotification.recipient}</p>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">{emailPushNotification.timestamp}</span>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">{emailPushNotification.subject}</h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Hello, thank you for verifying your email address. Here is your official 6-digit confirmation OTP code to proceed with authentication:
                </p>

                <div className="my-3 p-3 bg-blue-950/60 border border-blue-500/30 rounded-xl text-center">
                  <span className="text-[11px] text-blue-300 uppercase font-semibold block mb-1">Your 6-Digit OTP Code</span>
                  <span className="font-mono text-2xl font-extrabold text-amber-400 tracking-widest bg-slate-900 px-4 py-1 rounded-lg inline-block border border-amber-500/30">
                    {emailPushNotification.otpCode}
                  </span>
                </div>

                <p className="text-slate-400 text-[11px]">
                  If you did not request this verification code, please ignore this email.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-slate-500">Copy this code and paste it into the login verification screen.</span>
              <button
                type="button"
                onClick={() => setShowSimulatedInbox(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all"
              >
                Close Inbox & Enter Code
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative z-10 my-8">
        {/* Header Branding */}
        <div className="p-8 text-center border-b border-slate-800 bg-slate-900/60">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 text-[11px] font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Strict Authenticated Portal</span>
          </div>
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-blue-600/20 text-blue-400 rounded-2xl ring-1 ring-blue-500/30">
              <GraduationCap className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Student Attendance System
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            B.Tech Academic Portal &bull; Verified Faculty Gateway
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 text-xs font-bold text-center">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3.5 transition-all ${
              activeTab === 'login'
                ? 'bg-slate-900 text-blue-400 border-b-2 border-blue-500'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            Faculty Sign In
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3.5 transition-all ${
              activeTab === 'register'
                ? 'bg-slate-900 text-blue-400 border-b-2 border-blue-500'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            Register Account
          </button>
        </div>

        {/* Lockout Warning Banner */}
        {lockoutTimeLeft > 0 && (
          <div className="p-4 bg-red-950/80 border-b border-red-800 flex items-center gap-3 text-red-200 text-xs">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <p className="font-bold">Security Lockout Active</p>
              <p className="text-[11px] text-red-300">
                Too many failed login attempts. Retry in <span className="font-mono font-bold text-white">{lockoutTimeLeft}s</span>.
              </p>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          {/* TAB 1: LOGIN FORM */}
          {activeTab === 'login' ? (
            <form onSubmit={handleStandardLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Faculty Email or Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="text-slate-600">/</span>
                    <Smartphone className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="Email or Mobile (e.g. 9876543210)"
                    required
                    disabled={lockoutTimeLeft > 0}
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setForgotStep('request');
                      setForgotIdentifier(loginIdentifier);
                    }}
                    className="text-blue-400 hover:underline text-[11px]"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={lockoutTimeLeft > 0}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-100 focus:outline-none focus:text-blue-400 rounded-lg transition-colors"
                    title={showLoginPassword ? "Hide password" : "Show password"}
                    aria-label={showLoginPassword ? "Hide password" : "Show password"}
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-800 text-blue-600 focus:ring-blue-500 bg-slate-950"
                  />
                  <span>Keep me logged in</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={lockoutTimeLeft > 0}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Authenticate & Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* TAB 2: REGISTER FORM WITH MOBILE PHONE & STRONG PASSWORD POLICY */
            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Dr. Priya Nair"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. priya.nair@college.edu"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Mobile Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Department</label>
                  <select
                    value={regDept}
                    onChange={(e) => setRegDept(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="Computer Science & Engineering">CSE</option>
                    <option value="Information Technology">IT</option>
                    <option value="Electronics & Comm. Engineering">ECE</option>
                    <option value="Electrical Engineering">EE</option>
                    <option value="Mechanical Engineering">ME</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Designation</label>
                  <input
                    type="text"
                    value={regDesignation}
                    onChange={(e) => setRegDesignation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>

              {/* REGISTER PASSWORD INPUT WITH TOGGLE */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Create Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a strong password"
                    required
                    className="w-full pl-10 pr-10 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* PASSWORD STRENGTH BAR & CHECKLIST */}
                {regPassword.length > 0 && (
                  <div className="mt-2 p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Password Strength:</span>
                      <span className={`font-bold ${
                        regPwdScore <= 1 ? 'text-red-400' :
                        regPwdScore === 2 ? 'text-amber-400' :
                        regPwdScore === 3 ? 'text-yellow-400' : 'text-emerald-400'
                      }`}>
                        {regPwdScore <= 1 ? 'Weak' : regPwdScore === 2 ? 'Fair' : regPwdScore === 3 ? 'Good' : 'Strong'}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 transition-all ${regPwdScore >= 1 ? (regPwdScore === 1 ? 'bg-red-500' : regPwdScore === 2 ? 'bg-amber-500' : regPwdScore === 3 ? 'bg-yellow-500' : 'bg-emerald-500') : 'bg-slate-800'}`} />
                      <div className={`h-full flex-1 transition-all ${regPwdScore >= 2 ? (regPwdScore === 2 ? 'bg-amber-500' : regPwdScore === 3 ? 'bg-yellow-500' : 'bg-emerald-500') : 'bg-slate-800'}`} />
                      <div className={`h-full flex-1 transition-all ${regPwdScore >= 3 ? (regPwdScore === 3 ? 'bg-yellow-500' : 'bg-emerald-500') : 'bg-slate-800'}`} />
                      <div className={`h-full flex-1 transition-all ${regPwdScore >= 4 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                    </div>

                    {/* Checklist */}
                    <div className="grid grid-cols-2 gap-1 text-[10px] pt-1">
                      <div className={`flex items-center gap-1 ${regPwdCriteria.minLength ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {regPwdCriteria.minLength ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        <span>8+ Characters</span>
                      </div>
                      <div className={`flex items-center gap-1 ${regPwdCriteria.hasUpper && regPwdCriteria.hasLower ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {regPwdCriteria.hasUpper && regPwdCriteria.hasLower ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3 text-slate-500" />}
                        <span>Upper & Lowercase</span>
                      </div>
                      <div className={`flex items-center gap-1 ${regPwdCriteria.hasNumber ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {regPwdCriteria.hasNumber ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        <span>At least 1 Number</span>
                      </div>
                      <div className={`flex items-center gap-1 ${regPwdCriteria.hasSpecial ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {regPwdCriteria.hasSpecial ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        <span>Special Char (!@#$)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CONFIRM PASSWORD INPUT */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="w-full pl-10 pr-10 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {regConfirmPassword.length > 0 && (
                  <p className={`text-[10px] mt-1 ${regPassword === regConfirmPassword ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}`}>
                    {regPassword === regConfirmPassword ? '✓ Passwords match' : '✕ Passwords do not match'}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isRegPwdStrong || regPassword !== regConfirmPassword}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Register & Sign In</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* EMAIL PUSH OTP FORGOT PASSWORD MODAL */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 relative">
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setForgotStep('request');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Password Recovery Gateway</h3>
                <p className="text-xs text-slate-400">Email Push OTP & Security Verification</p>
              </div>
            </div>

            {/* Step Progress Pills */}
            <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold text-center">
              <div className={`py-1.5 rounded-lg border transition-all ${
                forgotStep === 'request'
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}>
                1. Identifier
              </div>
              <div className={`py-1.5 rounded-lg border transition-all ${
                forgotStep === 'otp'
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}>
                2. Enter OTP
              </div>
              <div className={`py-1.5 rounded-lg border transition-all ${
                forgotStep === 'new_password'
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}>
                3. New Password
              </div>
            </div>

            {/* STEP 1: REQUEST OTP */}
            {forgotStep === 'request' && (
              <form onSubmit={handleRequestOtp} className="space-y-4 text-xs">
                <p className="text-slate-300">
                  Enter your registered <strong className="text-white">Email Address</strong> or <strong className="text-white">Mobile Phone Number</strong> to receive a 6-digit verification OTP.
                </p>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Email Address or Mobile Phone
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="e.g. rajesh.sharma@college.edu or 9876543210"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Dispatch Email Push OTP</span>
                </button>
              </form>
            )}

            {/* STEP 2: ENTER & VERIFY OTP */}
            {forgotStep === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-xl text-blue-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      <span>OTP Sent to Registered Email</span>
                    </p>
                  </div>
                  <p className="text-[11px] text-blue-300">
                    A 6-digit confirmation OTP has been dispatched to <span className="font-bold text-white">{forgotIdentifier}</span> to confirm email ownership.
                  </p>
                  {emailPushNotification && (
                    <button
                      type="button"
                      onClick={() => setShowSimulatedInbox(true)}
                      className="mt-1 w-full py-2 bg-blue-900/80 hover:bg-blue-800 text-blue-200 border border-blue-700/60 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-300" />
                      <span>📩 Open Webmail Inbox to View Received OTP</span>
                    </button>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Enter 6-Digit OTP Code
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      value={userEnteredOtp}
                      onChange={(e) => setUserEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 784920"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-center text-lg tracking-widest placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Didn't receive code?</span>
                  {otpResendTimer > 0 ? (
                    <span className="text-slate-500 font-mono">Resend in {otpResendTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleRequestOtp(e as any)}
                      className="text-blue-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Resend Email OTP</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify OTP Code</span>
                </button>
              </form>
            )}

            {/* STEP 3: SET NEW STRONG PASSWORD */}
            {forgotStep === 'new_password' && (
              <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new strong password"
                      required
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Checklist */}
                  {newPassword.length > 0 && (
                    <div className="mt-2 p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-medium">Strength:</span>
                        <span className={`font-bold ${
                          newPwdScore <= 1 ? 'text-red-400' :
                          newPwdScore === 2 ? 'text-amber-400' :
                          newPwdScore === 3 ? 'text-yellow-400' : 'text-emerald-400'
                        }`}>
                          {newPwdScore <= 1 ? 'Weak' : newPwdScore === 2 ? 'Fair' : newPwdScore === 3 ? 'Good' : 'Strong'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[10px]">
                        <div className={`flex items-center gap-1 ${newPwdCriteria.minLength ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {newPwdCriteria.minLength ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          <span>8+ Chars</span>
                        </div>
                        <div className={`flex items-center gap-1 ${newPwdCriteria.hasUpper && newPwdCriteria.hasLower ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {newPwdCriteria.hasUpper && newPwdCriteria.hasLower ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          <span>Upper & Lower</span>
                        </div>
                        <div className={`flex items-center gap-1 ${newPwdCriteria.hasNumber ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {newPwdCriteria.hasNumber ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          <span>1+ Number</span>
                        </div>
                        <div className={`flex items-center gap-1 ${newPwdCriteria.hasSpecial ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {newPwdCriteria.hasSpecial ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          <span>Special Char</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPasswordConfirm}
                      onChange={(e) => setNewPasswordConfirm(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  {newPasswordConfirm.length > 0 && (
                    <p className={`text-[10px] mt-1 ${newPassword === newPasswordConfirm ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}`}>
                      {newPassword === newPasswordConfirm ? '✓ Passwords match' : '✕ Passwords do not match'}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!isNewPwdStrong || newPassword !== newPasswordConfirm}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Update Password & Complete Reset</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* NEW ACCOUNT REGISTRATION OTP VERIFICATION MODAL */}
      {showRegisterOtpModal && pendingRegisterUser && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setShowRegisterOtpModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Verify New Credentials</h3>
                <p className="text-xs text-slate-400">Email & Mobile Phone Security Check</p>
              </div>
            </div>

            <form onSubmit={handleVerifyRegisterOtp} className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-200 text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>OTP Sent to New Email & Mobile</span>
                </p>
                <p className="text-[11px] text-slate-300">
                  A 6-digit OTP code has been dispatched to:
                </p>
                <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800 text-[11px] font-mono text-emerald-300 space-y-0.5">
                  <div>📧 {pendingRegisterUser.email}</div>
                  <div>📱 {pendingRegisterUser.phone}</div>
                </div>
              </div>

              {/* Simulated Webmail Button */}
              {emailPushNotification && (
                <button
                  type="button"
                  onClick={() => setShowSimulatedInbox(true)}
                  className="w-full py-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60 rounded-xl text-[11px] font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>📩 Open Webmail Inbox to View Received OTP</span>
                </button>
              )}

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Enter 6-Digit OTP Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={6}
                    value={userEnteredRegisterOtp}
                    onChange={(e) => setUserEnteredRegisterOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 592831"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-center text-lg tracking-widest placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Didn't receive code?</span>
                {otpResendTimer > 0 ? (
                  <span className="text-slate-500 font-mono">Resend in {otpResendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendRegisterOtp}
                    className="text-emerald-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend OTP Code</span>
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify OTP & Complete Registration</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
