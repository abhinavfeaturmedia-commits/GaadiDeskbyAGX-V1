import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authMode,
    setAuthMode,
    loginUser,
    registerUser,
    quickDemoLogin,
    quickDriverLogin,
    drivers,
    language,
    toggleLanguage
  } = useApp();

  const isHindi = language === 'hi';

  // Step state: 1: Phone, 2: OTP, 3: Business Profile (Register only), 4: Plan Choice
  const [step, setStep] = useState(1);
  const [slideDirection, setSlideDirection] = useState('right'); // 'right' | 'left'
  const [phoneRaw, setPhoneRaw] = useState('9822012345');
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  // Business Profile Form (For Register)
  const [businessName, setBusinessName] = useState('Shree Ganesh Tours & Travels');
  const [ownerName, setOwnerName] = useState('Ramesh Gaikwad');
  const [city, setCity] = useState('Pune');
  const [gstin, setGstin] = useState('');
  const [selectedTypes, setSelectedTypes] = useState(['Sedan', 'MUV', 'Airport Drops']);
  const [selectedPlan, setSelectedPlan] = useState('Growth (15 Cars)');

  if (!isAuthModalOpen) return null;

  // Format Phone with space grouping (e.g. 98220 12345)
  const formatPhoneDisplay = (digits) => {
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)} ${digits.slice(5, 10)}`;
  };

  const handlePhoneInputChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneRaw(raw);
  };

  const goToNextStep = (nextStepNumber) => {
    setSlideDirection('right');
    setStep(nextStepNumber);
  };

  const goToPrevStep = (prevStepNumber) => {
    setSlideDirection('left');
    setStep(prevStepNumber);
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phoneRaw.length < 10) {
      setErrorMsg(isHindi ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    setErrorMsg('');
    goToNextStep(2);
  };

  // OTP Input Change
  const handleOtpChange = (index, value) => {
    const cleanDigit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = cleanDigit;
    setOtp(newOtp);

    // Auto-advance to next input if digit entered
    if (cleanDigit && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // OTP KeyDown (Backspace Reverse Navigation)
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
          const newOtp = [...otp];
          newOtp[index - 1] = '';
          setOtp(newOtp);
        }
      }
    }
  };

  // OTP Paste Handling (Auto distribute 6 digits)
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length > 0) {
      const digits = pastedData.split('');
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = digits[i] || '';
      }
      setOtp(newOtp);
      const lastIndex = Math.min(digits.length - 1, 5);
      const targetInput = document.getElementById(`otp-input-${lastIndex}`);
      if (targetInput) targetInput.focus();

      if (pastedData.length === 6) {
        setTimeout(() => {
          verifyAndProceed(pastedData);
        }, 150);
      }
    }
  };

  const handleAutoFillOtp = () => {
    const defaultDemoOtp = ['1', '2', '3', '4', '5', '6'];
    setOtp(defaultDemoOtp);
  };

  const verifyAndProceed = (codeString) => {
    if (codeString.length !== 6) {
      setErrorMsg(isHindi ? 'कृपया 6 अंकों का OTP दर्ज करें' : 'Please enter 6-digit OTP');
      return;
    }
    setErrorMsg('');
    if (authMode === 'login') {
      loginUser({
        phone: phoneRaw,
        name: ownerName || 'Ramesh Gaikwad',
        businessName: businessName || 'Shree Ganesh Tours & Travels',
        city: city || 'Pune'
      });
    } else {
      goToNextStep(3);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    verifyAndProceed(otp.join(''));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!businessName.trim() || !ownerName.trim()) {
      setErrorMsg(isHindi ? 'कृपया व्यापार और मालिक का नाम भरें' : 'Please provide business & owner name');
      return;
    }
    setErrorMsg('');
    goToNextStep(4);
  };

  const handleFinalRegister = () => {
    registerUser({
      phone: phoneRaw,
      businessName,
      ownerName,
      city,
      gstin,
      businessTypes: selectedTypes,
      plan: selectedPlan
    });
  };

  const handleTriggerDemo = () => {
    setIsDemoLoading(true);
    setTimeout(() => {
      quickDemoLogin();
      setIsDemoLoading(false);
    }, 400);
  };

  const toggleBusinessType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-white border-2 border-[#E5DFD3] rounded-3.5xl p-5 sm:p-7 text-[#111827] shadow-2xl my-auto max-h-[92vh] overflow-y-auto no-scrollbar">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 border border-[#E5DFD3] text-[#111827] hover:bg-gray-200 transition tap-active shadow-xs font-black"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header Badge */}
        <div className="flex items-center justify-between pr-10 mb-4">
          <div className="flex items-center space-x-3">
            <img
              src="/gaadidesk_logo.png"
              alt="GaadiDesk by AGX"
              className="w-10 h-10 rounded-2xl object-cover shadow-sm ring-1 ring-black/5"
            />
            <div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-base font-black tracking-tight text-[#111827]">Gaadi<span className="text-[#22C55E]">Desk</span></span>
                <span className="text-[10px] font-bold text-[#4B5563]">by AGX</span>
              </div>
              <span className="text-[11px] block text-[#4B5563] font-bold">Fleet & Cab Office</span>
            </div>
          </div>

          <button
            onClick={toggleLanguage}
            className="text-xs font-black bg-gray-50 text-[#111827] px-2.5 py-1 rounded-full border border-[#E5DFD3] shadow-xs tap-active"
          >
            {language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
          </button>
        </div>

        {/* Mode Switch Tabs (Login vs Register) */}
        {step <= 2 && (
          <div className="flex bg-gray-100 p-1 rounded-full border border-[#E5DFD3] shadow-xs mb-5">
            <button
              onClick={() => { setAuthMode('register'); setStep(1); }}
              className={`flex-1 py-2 rounded-full text-xs font-black transition-all tap-active ${
                authMode === 'register'
                  ? 'bg-[#111827] text-white shadow-xs'
                  : 'text-[#4B5563] hover:text-[#111827]'
              }`}
            >
              {isHindi ? 'नया खाता (14-दिन फ्री)' : 'Register (14-Day Free)'}
            </button>
            <button
              onClick={() => { setAuthMode('login'); setStep(1); }}
              className={`flex-1 py-2 rounded-full text-xs font-black transition-all tap-active ${
                authMode === 'login'
                  ? 'bg-[#111827] text-white shadow-xs'
                  : 'text-[#4B5563] hover:text-[#111827]'
              }`}
            >
              {isHindi ? 'लॉगिन करें' : 'Login'}
            </button>
          </div>
        )}

        {/* Step Indicator Pills (When in Register Mode) */}
        {authMode === 'register' && (
          <div className="flex items-center justify-between mb-5 px-1">
            {[
              { num: 1, label: isHindi ? 'फोन' : 'Phone' },
              { num: 2, label: 'OTP' },
              { num: 3, label: isHindi ? 'प्रोफाइल' : 'Profile' },
              { num: 4, label: isHindi ? 'प्लान' : 'Plan' },
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center space-x-1">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                      step >= s.num
                        ? 'bg-[#111827] text-white'
                        : 'bg-gray-100 text-gray-400 border border-[#E5DFD3]'
                    }`}
                  >
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span className={`text-[10px] font-black ${step >= s.num ? 'text-[#111827]' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div className={`flex-1 h-0.5 mx-1 ${step > s.num ? 'bg-[#111827]' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs font-black rounded-2xl flex items-center space-x-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ===================================================== */}
        {/* STEP 1: MOBILE NUMBER ENTRY (ZERO TEXT OVERLAP) */}
        {/* ===================================================== */}
        {step === 1 && (
          <form
            onSubmit={handlePhoneSubmit}
            className={`space-y-4 ${slideDirection === 'right' ? 'slide-in-right' : 'slide-in-left'}`}
          >
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#111827]">
                {authMode === 'register'
                  ? (isHindi ? '14-दिन का निःशुल्क ट्रायल शुरू करें' : 'Start Your 14-Day Free Fleet Trial')
                  : (isHindi ? 'अपने GaadiDesk अकाउंट में लॉगिन करें' : 'Login to Your GaadiDesk Office')}
              </h3>
              <p className="text-xs text-[#4B5563] mt-0.5 font-semibold">
                {isHindi ? '10-अंकों का मोबाइल नंबर दर्ज करें। तुरंत OTP भेजा जाएगा।' : 'Enter your 10-digit mobile number for instant verification.'}
              </p>
            </div>

            <div className="space-y-1">
              <label htmlFor="mobile-number-input" className="text-xs font-black text-[#111827] block">
                {isHindi ? 'मोबाइल नंबर / WhatsApp Number' : 'Mobile / WhatsApp Number'}
              </label>
              {/* Rock-solid Segmented Flex Input Group (Zero Overlap Guaranteed) */}
              <div className="flex items-center rounded-2xl border-2 border-[#E5DFD3] bg-white overflow-hidden shadow-xs focus-within:border-[#111827]">
                <div className="px-3 py-3 bg-gray-50 border-r border-[#E5DFD3] flex items-center space-x-1.5 text-xs font-black text-[#111827] select-none shrink-0">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  id="mobile-number-input"
                  type="tel"
                  maxLength={11}
                  value={formatPhoneDisplay(phoneRaw)}
                  onChange={handlePhoneInputChange}
                  placeholder="98220 12345"
                  className="w-full px-3 py-3 bg-white text-sm font-black text-[#111827] placeholder-gray-400 focus:outline-none tracking-wide"
                  autoFocus
                />
              </div>

              {/* Real-time Driver / Owner Detection Badge */}
              {(() => {
                const rawDigits = phoneRaw.replace(/\D/g, '');
                const detectedDriver = drivers.find(d => {
                  const cleanDrv = (d.phone || '').replace(/\D/g, '');
                  return cleanDrv.endsWith(rawDigits.slice(-10)) || (rawDigits.length >= 10 && cleanDrv.includes(rawDigits.slice(-10)));
                });

                if (detectedDriver) {
                  return (
                    <div className="p-2.5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center justify-between animate-fade-in shadow-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-black">
                          🚗
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase text-emerald-800 tracking-wide block">
                            {isHindi ? 'ड्राइवर प्रोफाइल पहचानी गई' : 'Driver Profile Auto-Detected'}
                          </span>
                          <span className="text-xs font-black text-emerald-950">
                            {detectedDriver.name} ({detectedDriver.phone})
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-black bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                        Driver Cockpit
                      </span>
                    </div>
                  );
                } else if (rawDigits.length >= 10) {
                  return (
                    <div className="p-2.5 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-center justify-between animate-fade-in shadow-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-xl bg-amber-600 text-white flex items-center justify-center text-xs font-black">
                          🏢
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase text-amber-800 tracking-wide block">
                            {isHindi ? 'फ्लीट मालिक अकाउंट' : 'Fleet Owner Account'}
                          </span>
                          <span className="text-xs font-black text-amber-950">
                            {authMode === 'login' ? 'Owner / Admin Console' : 'New Fleet Registration'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-black bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                        Admin Role
                      </span>
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#111827] hover:bg-black text-white font-black text-sm shadow-md transition tap-active flex items-center justify-center space-x-2"
            >
              <span>{isHindi ? 'OTP भेजें' : 'Send Verification OTP'}</span>
              <ArrowRight className="w-4 h-4 text-[#D4F05B]" />
            </button>

            {/* Quick Demo Logins Section */}
            <div className="pt-1 text-center space-y-2">
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-gray-200" />
                <span className="flex-shrink mx-2 text-[10px] font-black text-[#4B5563] uppercase">
                  {isHindi ? 'या त्वरित 1-क्लिक टेस्ट करें' : 'Or Instant 1-Click Role Testing'}
                </span>
                <div className="flex-grow border-t border-gray-200" />
              </div>

              {/* Owner Demo Login */}
              <button
                type="button"
                onClick={handleTriggerDemo}
                disabled={isDemoLoading}
                className="w-full py-2 px-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-black text-xs shadow-xs transition tap-active flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm">🏢</span>
                  <span className="text-left font-bold">{isHindi ? 'फ्लीट मालिक डेमो (रमेश)' : 'Fleet Owner Demo (Ramesh)'}</span>
                </div>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-black">
                  Admin
                </span>
              </button>

              {/* Driver 1 Demo Login (Sachin Shinde - Available) */}
              <button
                type="button"
                onClick={() => {
                  setIsDemoLoading(true);
                  setTimeout(() => {
                    quickDriverLogin('drv-01');
                    setIsDemoLoading(false);
                  }, 300);
                }}
                disabled={isDemoLoading}
                className="w-full py-2 px-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-950 font-black text-xs shadow-xs transition tap-active flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm">🚗</span>
                  <div className="text-left">
                    <span className="font-bold block leading-tight">{isHindi ? 'ड्राइवर डेमो (सचिन शिंदे)' : 'Driver Demo (Sachin Shinde)'}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">{isHindi ? 'ड्यूटी के लिए उपलब्ध' : 'Ready for Duty • Dzire VXi'}</span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-black">
                  Driver
                </span>
              </button>

              {/* Driver 2 Demo Login (Santosh More - On Trip) */}
              <button
                type="button"
                onClick={() => {
                  setIsDemoLoading(true);
                  setTimeout(() => {
                    quickDriverLogin('drv-02');
                    setIsDemoLoading(false);
                  }, 300);
                }}
                disabled={isDemoLoading}
                className="w-full py-2 px-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-950 font-black text-xs shadow-xs transition tap-active flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm">🛣️</span>
                  <div className="text-left">
                    <span className="font-bold block leading-tight">{isHindi ? 'ड्राइवर डेमो (संतोष मोरे)' : 'Driver Demo (Santosh More)'}</span>
                    <span className="text-[10px] text-blue-700 font-semibold">{isHindi ? 'महाबलेश्वर ट्रिप पर' : 'Active Duty • Mahabaleshwar'}</span>
                  </div>
                </div>
                <span className="text-[10px] bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full font-black">
                  On Duty
                </span>
              </button>
            </div>
          </form>
        )}

        {/* ===================================================== */}
        {/* STEP 2: 6-DIGIT OTP VERIFICATION WITH PASTE & BACKSPACE */}
        {/* ===================================================== */}
        {step === 2 && (
          <form
            onSubmit={handleVerifyOtp}
            className={`space-y-4 ${slideDirection === 'right' ? 'slide-in-right' : 'slide-in-left'}`}
          >
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => goToPrevStep(1)}
                className="text-xs font-black text-[#4B5563] hover:text-[#111827] flex items-center space-x-1 tap-active"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isHindi ? 'नंबर बदलें' : 'Change Phone'}</span>
              </button>
              <span className="text-xs font-black text-[#EA580C]">+91 {formatPhoneDisplay(phoneRaw)}</span>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-black text-[#111827]">
                {isHindi ? 'OTP सत्यापन' : 'Enter 6-Digit OTP'}
              </h3>
              <p className="text-xs text-[#4B5563] mt-0.5 font-semibold">
                {isHindi ? 'आपके नंबर पर 6-अंकों का कोड भेजा गया है।' : 'Paste or enter the 6-digit code sent to your phone.'}
              </p>
            </div>

            {/* OTP 6 Boxes */}
            <div className="grid grid-cols-6 gap-1.5 sm:gap-2 py-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={handleOtpPaste}
                  className="w-full h-11 sm:h-12 text-center text-lg font-black bg-white border-2 border-[#E5DFD3] rounded-xl text-[#111827] focus:outline-none focus:border-[#111827] shadow-xs"
                />
              ))}
            </div>

            {/* Auto-fill Helper */}
            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleAutoFillOtp}
                className="px-3 py-1 rounded-full bg-[#D4F05B] text-[#111827] font-black border border-[#BFDD38] hover:bg-[#c4e048] tap-active"
              >
                ⚡ Auto-fill Demo (123456)
              </button>
              <span className="text-[10px] text-[#4B5563] font-bold">Resend in 24s</span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#111827] hover:bg-black text-white font-black text-sm shadow-md transition tap-active flex items-center justify-center space-x-2"
            >
              <span>{authMode === 'login' ? (isHindi ? 'लॉगिन करें' : 'Verify & Enter Dashboard') : (isHindi ? 'आगे बढ़ें (प्रोफाइल)' : 'Continue to Profile')}</span>
              <ArrowRight className="w-4 h-4 text-[#D4F05B]" />
            </button>
          </form>
        )}

        {/* ===================================================== */}
        {/* STEP 3: BUSINESS PROFILE SETUP (REGISTER ONLY) */}
        {/* ===================================================== */}
        {step === 3 && (
          <form
            onSubmit={handleProfileSubmit}
            className={`space-y-3.5 ${slideDirection === 'right' ? 'slide-in-right' : 'slide-in-left'}`}
          >
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => goToPrevStep(2)}
                className="text-xs font-black text-[#4B5563] hover:text-[#111827] flex items-center space-x-1 tap-active"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <span className="text-xs font-black text-[#4B5563]">Step 3 of 4</span>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-black text-[#111827]">
                {isHindi ? 'अपने ट्रेवल्स/फ्लीट का विवरण भरें' : 'Set Up Your Fleet Business'}
              </h3>
              <p className="text-xs text-[#4B5563] mt-0.5 font-semibold">
                {isHindi ? 'यह जानकारी आपके इनवॉइस और ड्यूटी स्लिप पर दिखाई देगी।' : 'This information will appear on your GST invoices & duty slips.'}
              </p>
            </div>

            <div className="space-y-2.5">
              <div>
                <label htmlFor="business-name-input" className="text-xs font-black text-[#111827] block mb-1">
                  {isHindi ? 'एजेंसी / कंपनी का नाम *' : 'Travels / Fleet Name *'}
                </label>
                <input
                  id="business-name-input"
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Shree Ganesh Tours & Travels"
                  className="w-full px-3.5 py-2 bg-white border-2 border-[#E5DFD3] rounded-2xl text-xs font-black text-[#111827] focus:outline-none focus:border-[#111827] shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="owner-name-input" className="text-xs font-black text-[#111827] block mb-1">
                    {isHindi ? 'मालिक का नाम *' : 'Owner Name *'}
                  </label>
                  <input
                    id="owner-name-input"
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Ramesh Gaikwad"
                    className="w-full px-3.5 py-2 bg-white border-2 border-[#E5DFD3] rounded-2xl text-xs font-black text-[#111827] focus:outline-none focus:border-[#111827] shadow-xs"
                  />
                </div>
                <div>
                  <label htmlFor="city-select-input" className="text-xs font-black text-[#111827] block mb-1">
                    {isHindi ? 'शहर / बेस सिटी *' : 'Base City *'}
                  </label>
                  <select
                    id="city-select-input"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border-2 border-[#E5DFD3] rounded-2xl text-xs font-black text-[#111827] focus:outline-none focus:border-[#111827] shadow-xs"
                  >
                    <option value="Pune">Pune</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Kolhapur">Kolhapur</option>
                    <option value="Nagpur">Nagpur</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Jaipur">Jaipur</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-[#111827] block mb-1">
                  {isHindi ? 'गाड़ियों के प्रकार (Categories)' : 'Vehicle Categories in Your Fleet'}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Sedan', icon: '🚗' },
                    { label: 'MUV', icon: '🚙' },
                    { label: 'SUV', icon: '🏎️' },
                    { label: 'Luxury', icon: '✨' },
                    { label: 'Airport Drops', icon: '✈️' },
                    { label: 'Outstation', icon: '🛣️' },
                  ].map((cat) => {
                    const isSelected = selectedTypes.includes(cat.label);
                    return (
                      <button
                        key={cat.label}
                        type="button"
                        onClick={() => toggleBusinessType(cat.label)}
                        className={`px-3 py-1.5 rounded-full text-xs font-black transition-all tap-bounce flex items-center space-x-1 ${
                          isSelected
                            ? 'bg-[#111827] text-white shadow-xs'
                            : 'bg-gray-100 border border-[#E5DFD3] text-[#374151] hover:bg-gray-200'
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                        {isSelected && <span className="ml-0.5 text-[#D4F05B]">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#111827] hover:bg-black text-white font-black text-sm shadow-md transition tap-active flex items-center justify-center space-x-2"
            >
              <span>{isHindi ? 'आगे बढ़ें (प्लान चुनें)' : 'Continue to Plan Selection'}</span>
              <ArrowRight className="w-4 h-4 text-[#D4F05B]" />
            </button>
          </form>
        )}

        {/* ===================================================== */}
        {/* STEP 4: PLAN SELECTION & 14-DAY TRIAL CONFIRMATION */}
        {/* ===================================================== */}
        {step === 4 && (
          <div className={`space-y-3.5 ${slideDirection === 'right' ? 'slide-in-right' : 'slide-in-left'}`}>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => goToPrevStep(3)}
                className="text-xs font-black text-[#4B5563] hover:text-[#111827] flex items-center space-x-1 tap-active"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <span className="text-xs font-black text-[#4B5563]">Step 4 of 4</span>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-black text-[#111827]">
                {isHindi ? '14-दिन का फ्री ट्रायल एक्टिवेट करें' : 'Activate 14-Day Free Fleet Access'}
              </h3>
              <p className="text-xs text-[#4B5563] mt-0.5 font-semibold">
                {isHindi ? 'कोई अग्रिम भुगतान या क्रेडिट कार्ड नहीं। 14 दिन पूरी तरह मुफ्त।' : 'No credit card needed. Full access to all fleet tools.'}
              </p>
            </div>

            {/* Plan Cards */}
            <div className="space-y-2">
              {[
                { name: 'Starter (5 Cars)', price: '₹499/mo', desc: 'Unlimited bookings, WhatsApp slips, clash guard' },
                { name: 'Growth (15 Cars)', price: '₹999/mo', desc: 'GST tax bills, 15-day RTO expiry radar, cash ledger', popular: true },
                { name: 'Business (35 Cars)', price: '₹1,799/mo', desc: 'Multi-staff access, corporate customer billing' },
              ].map((p) => {
                const isSelected = selectedPlan === p.name;
                return (
                  <div
                    key={p.name}
                    onClick={() => setSelectedPlan(p.name)}
                    className={`p-3 rounded-2.5xl border-2 transition-all cursor-pointer flex items-center justify-between tap-bounce ${
                      isSelected
                        ? 'bg-white border-[#111827] shadow-md'
                        : 'bg-gray-50 border-[#E5DFD3] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#111827] bg-[#111827]' : 'border-gray-400'}`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-xs font-black text-[#111827]">{p.name}</h4>
                          {p.popular && (
                            <span className="text-[9px] font-black uppercase bg-[#D4F05B] text-[#111827] px-1.5 py-0.2 rounded-full border border-[#BFDD38]">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#4B5563] font-semibold">{p.desc}</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#111827]">{p.price}</span>
                  </div>
                );
              })}
            </div>

            {/* Guarantee Tag */}
            <div className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-black flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>14-Day 100% Free Trial Activated • Cancel Anytime</span>
            </div>

            <button
              onClick={handleFinalRegister}
              className="w-full py-3.5 rounded-full bg-[#111827] hover:bg-black text-white font-black text-sm shadow-md transition tap-active flex items-center justify-center space-x-2"
            >
              <span>🚀 {isHindi ? 'ट्रायल शुरू करें और डैशबोर्ड खोलें' : 'Launch 14-Day Free Fleet Office'}</span>
              <ArrowRight className="w-4 h-4 text-[#D4F05B]" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
