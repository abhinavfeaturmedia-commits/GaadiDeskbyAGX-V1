import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Zap,
  MessageCircle,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Check,
  ShieldAlert
} from 'lucide-react';

export const LandingPage = () => {
  const {
    openAuthModal,
    quickDemoLogin,
    language,
    toggleLanguage
  } = useApp();

  const isHindi = language === 'hi';
  const [openFaq, setOpenFaq] = useState(null);
  const [fleetSizeSlider, setFleetSizeSlider] = useState(10);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: isHindi ? 'क्या यह ऐप सामान्य ₹7,000 वाले बेसिक एंड्रॉइड फोन पर चलेगा?' : 'Will this app run smoothly on basic ₹7,000 Android phones?',
      a: isHindi
        ? 'हाँ, बिल्कुल! GaadiDesk को बेहद हल्का व सुपर-फास्ट बनाया गया है। यह 2GB RAM वाले फोन और कमजोर 4G इंटरनेट पर भी बिना अटके तेज़ी से चलता है।'
        : 'Yes, absolutely. GaadiDesk is engineered to be ultra-lightweight, running smoothly on entry-level Android smartphones and 4G networks with instant touch responsiveness.'
    },
    {
      q: isHindi ? '14-दिन का निःशुल्क ट्रायल कैसे काम करता है?' : 'How does the 14-Day Free Trial work?',
      a: isHindi
        ? 'रजिस्टर करते ही आपको 14 दिनों के लिए सभी प्रीमियम फीचर्स (बुकिंग्स, GST इनवॉइस, क्लैश चेकर, एक्सपायरी अलर्ट्स) का पूरा एक्सेस बिना किसी क्रेडिट कार्ड के मिलता है।'
        : 'Upon signing up, you get complete, unrestricted access to all fleet features for 14 days with zero upfront payment or credit card required.'
    },
    {
      q: isHindi ? 'क्या दो बुकिंग में एक ही गाड़ी टकराने (Double Booking) से रुकेगी?' : 'Does the app prevent double booking collisions?',
      a: isHindi
        ? 'हाँ! स्मार्ट क्लैश इंजन तुरंत ट्रिप के समय की जांच करता है और ओवरलैपिंग समय पर गाड़ी को दूसरी ट्रिप में बुक होने से पूरी तरह रोकता है।'
        : 'Yes! The built-in clash detection engine continuously validates vehicle schedules, instantly flagging and preventing duplicate car commitments.'
    },
    {
      q: isHindi ? 'क्या मैं सीधे ग्राहक और ड्राइवर को व्हाट्सएप स्लिप भेज सकता हूँ?' : 'Can I dispatch duty slips and GST bills via WhatsApp?',
      a: isHindi
        ? 'हाँ! एक टैप में ग्राहक के लिए कन्फर्मेशन स्लिप, ड्राइवर के लिए ड्यूटी कार्ड और पार्टी के लिए GST इनवॉइस सीधे व्हाट्सएप पर भेजा जा सकता है।'
        : 'Yes! With a single tap, generate formatted booking confirmations for customers, duty cards for drivers, and professional GST invoices for corporate clients.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#111827] font-sans antialiased selection:bg-[#EA580C] selection:text-white">
      
      {/* ---------------------------------------------------- */}
      {/* 1. TOP NAVIGATION BAR */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-[#F8F6F0]/95 backdrop-blur-md border-b border-[#E5DFD3]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#111827] flex items-center justify-center text-white font-black text-lg shadow-sm">
              G
            </div>
            <div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-lg font-black tracking-tight text-[#111827]">Gaadi<span className="text-[#EA580C]">Desk</span></span>
                <span className="text-[10px] font-bold text-[#4B5563] tracking-normal">by AGX</span>
              </div>
            </div>
          </div>

          {/* Nav Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Switch */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 sm:px-3 py-1.5 rounded-full bg-white border border-[#E5DFD3] hover:border-gray-400 text-xs font-black text-[#111827] transition tap-active shadow-xs flex items-center space-x-1"
              title="Toggle English / हिन्दी"
            >
              <span>🌐</span>
              <span className="hidden sm:inline">{isHindi ? 'हिंदी' : 'English'}</span>
            </button>

            {/* Quick Demo Button */}
            <button
              onClick={quickDemoLogin}
              className="flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#D4F05B] hover:bg-[#c2de4a] border border-[#BFDD38] text-[#111827] text-xs font-black transition tap-active shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#111827]" />
              <span>{isHindi ? 'लाइव डेमो' : 'Live Demo'}</span>
            </button>

            {/* Login Button */}
            <button
              onClick={() => openAuthModal('login')}
              className="hidden sm:block px-3.5 py-1.5 rounded-full bg-white hover:bg-gray-50 border border-[#E5DFD3] text-xs font-black text-[#111827] transition tap-active shadow-xs"
            >
              {isHindi ? 'लॉगिन' : 'Login'}
            </button>

            {/* Free Trial Button */}
            <button
              onClick={() => openAuthModal('register')}
              className="px-3.5 sm:px-4 py-1.5 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-black shadow-md transition tap-active"
            >
              {isHindi ? 'फ्री ट्रायल' : 'Start Trial'}
            </button>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* 2. HERO SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="relative z-10 pt-10 sm:pt-16 pb-12 px-4 sm:px-6 max-w-6xl mx-auto text-center">
        {/* Micro Pill Badge */}
        <div className="inline-flex items-center space-x-2 bg-white border border-[#E5DFD3] px-4 py-1 rounded-full shadow-xs mb-4">
          <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse" />
          <span className="text-xs font-black text-[#111827] tracking-wide">
            {isHindi ? '🇮🇳 भारतीय कैब व कार रेंटल ऑपरेटरों के लिए विशेष' : '🇮🇳 Tailored for Indian Fleet & Cab Operators'}
          </span>
        </div>

        {/* Main Display Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#111827] tracking-tight leading-[1.14] max-w-4xl mx-auto">
          {isHindi ? (
            <>
              गाड़ी और बुकिंग्स का पूरा ऑफिस, <br />
              <span className="text-[#EA580C]">अब आपके मोबाइल में।</span>
            </>
          ) : (
            <>
              Balance Your Fleet and Business, <br />
              <span className="text-[#EA580C]">Right in Your Pocket.</span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-sm sm:text-base text-[#374151] max-w-xl mx-auto font-semibold leading-relaxed">
          {isHindi
            ? 'डायरी छोड़ें। गाड़ियों की डबल बुकिंग रोकें, 30 सेकंड में GST इनवॉइस व व्हाट्सऐप स्लिप बनाएं और रोज़ का हिसाब रखें।'
            : 'Stop double-booking cars. Generate instant 30-sec WhatsApp slips, GST invoices, and track daily driver cash with zero stress.'}
        </p>

        {/* High-Contrast Action CTAs */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={() => openAuthModal('register')}
            className="px-7 py-3.5 rounded-full bg-[#111827] hover:bg-black text-white font-black text-sm shadow-lg transition tap-active flex items-center space-x-2"
          >
            <span>{isHindi ? '🚀 14-दिन का निःशुल्क ट्रायल शुरू करें' : '🚀 Launch 14-Day Free Trial'}</span>
            <ArrowRight className="w-4 h-4 text-[#D4F05B]" />
          </button>

          <button
            onClick={quickDemoLogin}
            className="px-6 py-3.5 rounded-full bg-white hover:bg-gray-50 border-2 border-[#E5DFD3] text-[#111827] font-black text-sm shadow-xs transition tap-active flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-[#EA580C]" />
            <span>{isHindi ? '⚡ लाइव डेमो चलाकर देखें' : '⚡ Explore Live Demo'}</span>
          </button>
        </div>

        {/* High-Contrast Trust Points */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-black text-[#111827]">
          <span className="flex items-center space-x-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#E5DFD3] shadow-xs">
            <Check className="w-3.5 h-3.5 text-green-700 stroke-[3.5]" />
            <span>No Credit Card</span>
          </span>
          <span className="flex items-center space-x-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#E5DFD3] shadow-xs">
            <Check className="w-3.5 h-3.5 text-green-700 stroke-[3.5]" />
            <span>2-Min Instant Setup</span>
          </span>
          <span className="flex items-center space-x-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#E5DFD3] shadow-xs">
            <Check className="w-3.5 h-3.5 text-green-700 stroke-[3.5]" />
            <span>Works 100% Offline</span>
          </span>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 3. THE 4 CORE HORMOZI SYSTEMS (HIGH CONTRAST BENTO GRID) */}
      {/* ---------------------------------------------------- */}
      <section className="py-14 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#E5DFD3]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-black text-[#EA580C]">Fleet Power Engine</span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#111827] tracking-tight mt-1">
            {isHindi ? '4 मुख्य सिस्टम जो आपका व्यापार आसान बनाते हैं' : '4 Core Systems Built to Grow Your Fleet Profit'}
          </h2>
          <p className="text-xs sm:text-sm text-[#374151] mt-2 font-semibold">
            {isHindi
              ? 'हर ट्रिप, गाड़ी, ड्राइवर और पाई-पाई के हिसाब को बिना किसी गलती के ऑटोमेट करें।'
              : 'Automate vehicle clashes, instant WhatsApp dispatching, cash reconciliation, and RTO fines.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bento Card 1: Clash Guard */}
          <div className="bg-white rounded-4xl p-6 sm:p-8 border-2 border-[#E5DFD3] shadow-md hover:shadow-lg transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-950 flex items-center justify-center text-xl shadow-xs border border-emerald-200">
              🛡️
            </div>
            <div>
              <h3 className="text-lg font-black text-[#111827]">
                {isHindi ? '1. डबल बुकिंग क्लैश गार्ड' : '1. Smart Double-Booking Clash Guard'}
              </h3>
              <p className="text-xs sm:text-sm text-[#374151] mt-1 font-semibold leading-relaxed">
                {isHindi
                  ? 'एक गाड़ी एक समय में दो ट्रिप्स में बुक नहीं हो सकती। सिस्टम तुरंत समय ओवरलैप पकड़कर गलती रोकता है।'
                  : 'Never face driver or car duplicate assignment chaos again. Our smart engine actively validates overlapping schedules.'}
              </p>
            </div>
            <div className="p-3 bg-[#F8F6F0] rounded-2xl border border-[#E5DFD3] text-xs text-emerald-950 font-black flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>0% Customer Embarrassment & Zero Duplicate Vehicle Commitments</span>
            </div>
          </div>

          {/* Bento Card 2: 30-Sec WhatsApp & GST Billing */}
          <div className="bg-white rounded-4xl p-6 sm:p-8 border-2 border-[#E5DFD3] shadow-md hover:shadow-lg transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-950 flex items-center justify-center text-xl shadow-xs border border-amber-200">
              ⚡
            </div>
            <div>
              <h3 className="text-lg font-black text-[#111827]">
                {isHindi ? '2. 30 सेकंड में व्हाट्सएप स्लिप व GST इनवॉइस' : '2. 30-Sec WhatsApp Slips & GST Invoices'}
              </h3>
              <p className="text-xs sm:text-sm text-[#374151] mt-1 font-semibold leading-relaxed">
                {isHindi
                  ? 'ग्राहक के लिए बुकिंग स्लिप, ड्राइवर के लिए ड्यूटी कार्ड और कॉर्पोरेट पार्टी के लिए पक्का GST बिल 1 टैप में।'
                  : 'Dispatch formatted confirmation slips to clients, clean duty slips to drivers, and download professional GST invoices.'}
              </p>
            </div>
            <div className="p-3 bg-[#F8F6F0] rounded-2xl border border-[#E5DFD3] text-xs text-amber-950 font-black flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 text-[#EA580C] shrink-0" />
              <span>1-Tap Direct WhatsApp Share without saving phone contacts</span>
            </div>
          </div>

          {/* Bento Card 3: Daily Driver Cash Reconciliation */}
          <div className="bg-white rounded-4xl p-6 sm:p-8 border-2 border-[#E5DFD3] shadow-md hover:shadow-lg transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-950 flex items-center justify-center text-xl shadow-xs border border-blue-200">
              💰
            </div>
            <div>
              <h3 className="text-lg font-black text-[#111827]">
                {isHindi ? '3. रोज़ाना ड्राइवर कैश व UPI हिसाब' : '3. Daily Driver Cash & Ledger Reconciliation'}
              </h3>
              <p className="text-xs sm:text-sm text-[#374151] mt-1 font-semibold leading-relaxed">
                {isHindi
                  ? 'ड्राइवर ने कितना कैश लिया, कितना डीजल भरा और ऑफिस में कितना जमा कराया — पाई-पाई का हिसाब साफ़।'
                  : 'Track how much cash each driver collected, toll/fuel spent, and exact net pending balance from customer accounts.'}
              </p>
            </div>
            <div className="p-3 bg-[#F8F6F0] rounded-2xl border border-[#E5DFD3] text-xs text-blue-950 font-black flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-700 shrink-0" />
              <span>Know your exact daily net profit across all vehicles at 9 PM</span>
            </div>
          </div>

          {/* Bento Card 4: 15-Day RTO Expiry Radar */}
          <div className="bg-white rounded-4xl p-6 sm:p-8 border-2 border-[#E5DFD3] shadow-md hover:shadow-lg transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-950 flex items-center justify-center text-xl shadow-xs border border-rose-200">
              🚨
            </div>
            <div>
              <h3 className="text-lg font-black text-[#111827]">
                {isHindi ? '4. 15-दिन पहले RTO पेपर एक्सपायरी अलर्ट' : '4. Proactive 15-Day RTO Expiry Radar'}
              </h3>
              <p className="text-xs sm:text-sm text-[#374151] mt-1 font-semibold leading-relaxed">
                {isHindi
                  ? 'Insurance, PUC, Fitness और Permit खत्म होने से 15 दिन पहले अलर्ट। पुलिस और RTO के भारी चालान से बचें।'
                  : 'Smart radar tracks Insurance, PUC, Fitness, and Permit dates, alerting you 15 days ahead of expiration.'}
              </p>
            </div>
            <div className="p-3 bg-[#F8F6F0] rounded-2xl border border-[#E5DFD3] text-xs text-rose-950 font-black flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0" />
              <span>Zero vehicle downtime and no surprise police fines on highways</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 4. INTERACTIVE FLEET ROI CALCULATOR */}
      {/* ---------------------------------------------------- */}
      <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-4xl p-6 sm:p-10 border-2 border-[#E5DFD3] shadow-lg text-center">
          <span className="text-xs uppercase font-black text-[#EA580C] tracking-wider">Interactive ROI Calculator</span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#111827] mt-1">
            {isHindi ? 'देखें आप हर महीने कितना समय व पैसा बचाएंगे' : 'Calculate Your Monthly Time & Money Saved'}
          </h3>

          <div className="mt-8 max-w-lg mx-auto space-y-3 text-left">
            <div className="flex justify-between items-center text-sm font-black text-[#111827]">
              <span>Fleet Size / गाड़ियों की संख्या:</span>
              <span className="px-3.5 py-1 bg-[#111827] text-white rounded-full text-xs font-black shadow-xs">
                {fleetSizeSlider} {fleetSizeSlider === 1 ? 'Car' : 'Cars'}
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="40"
              value={fleetSizeSlider}
              onChange={(e) => setFleetSizeSlider(Number(e.target.value))}
              className="w-full accent-[#111827] h-2.5 bg-gray-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-xs text-[#4B5563] font-bold">
              <span>2 Cars</span>
              <span>15 Cars</span>
              <span>40 Cars</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-[#F8F6F0] p-4 rounded-3xl border border-[#E5DFD3]">
              <span className="text-xs text-[#4B5563] font-black block">Hours Saved / Month</span>
              <span className="text-2xl font-black text-emerald-700 mt-1 block">~{fleetSizeSlider * 4.5} hrs</span>
              <span className="text-[10px] text-[#4B5563] font-semibold">Zero manual diary work</span>
            </div>
            <div className="bg-[#F8F6F0] p-4 rounded-3xl border border-[#E5DFD3]">
              <span className="text-xs text-[#4B5563] font-black block">Recovered Pending Cash</span>
              <span className="text-2xl font-black text-[#EA580C] mt-1 block">₹{(fleetSizeSlider * 4200).toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-[#4B5563] font-semibold">Via 1-click ledger reminders</span>
            </div>
            <div className="bg-[#F8F6F0] p-4 rounded-3xl border border-[#E5DFD3]">
              <span className="text-xs text-[#4B5563] font-black block">RTO Fines Prevented</span>
              <span className="text-2xl font-black text-blue-700 mt-1 block">₹{(fleetSizeSlider * 1500).toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-[#4B5563] font-semibold">Timely expiry renewal radar</span>
            </div>
          </div>

          <button
            onClick={() => openAuthModal('register')}
            className="mt-8 px-8 py-3.5 rounded-full bg-[#111827] hover:bg-black text-white font-black text-sm shadow-md transition tap-active"
          >
            {isHindi ? '🚀 फ्री 14-दिन ट्रायल में अपना फ्लीट जोड़ें' : '🚀 Start Free 14-Day Trial & Connect Fleet'}
          </button>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 5. FAQ ACCORDION */}
      {/* ---------------------------------------------------- */}
      <section className="py-12 px-4 sm:px-6 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-black text-[#111827]">
            {isHindi ? 'अक्सर पूछे जाने वाले सवाल (FAQ)' : 'Frequently Asked Questions'}
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border-2 border-[#E5DFD3] shadow-xs overflow-hidden transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left tap-active"
                >
                  <span className="text-xs sm:text-sm font-black text-[#111827]">{faq.q}</span>
                  <div className={`w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[#111827] transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#374151] leading-relaxed border-t border-gray-100 animate-fade-in font-semibold">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 6. FOOTER */}
      {/* ---------------------------------------------------- */}
      <footer className="bg-white border-t border-[#E5DFD3] py-10 px-4 sm:px-6 text-center text-xs text-[#4B5563] font-semibold">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-xl bg-[#111827] flex items-center justify-center text-white font-black text-xs">
              G
            </div>
            <span className="font-black text-[#111827]">GaadiDesk <span className="text-[11px] font-bold text-[#4B5563]">by AGX</span></span>
            <span>— The Indian Fleet Operating System</span>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={toggleLanguage} className="hover:text-[#111827] tap-active">
              {isHindi ? 'Switch to English' : 'हिंदी में बदलें'}
            </button>
            <span>•</span>
            <button onClick={() => openAuthModal('login')} className="hover:text-[#111827] tap-active">
              Login
            </button>
            <span>•</span>
            <button onClick={() => openAuthModal('register')} className="hover:text-[#111827] tap-active">
              14-Day Free Trial
            </button>
          </div>
        </div>
        <p className="mt-5 text-[10px] text-[#4B5563]">
          © 2026 GaadiDesk Inc. All rights reserved. Designed with ❤️ for Indian Cab & Fleet Owners.
        </p>
      </footer>
    </div>
  );
};
