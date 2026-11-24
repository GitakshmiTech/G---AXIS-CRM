//==================================================================================================================
//    React & Assets Imports
//==================================================================================================================
import { QuoteIcon } from "../components/common/icons/QuoteIcon";
import bgPattern from "../assets/Frame 172.png";
import logo from "../assets/Group 4.png";

//==================================================================================================================
//    Auth Layout Component
//==================================================================================================================
export const AuthLayout = ({ children }) => {
  return (
    <div className="flex w-full h-screen min-h-[560px] overflow-hidden bg-white-100 font-sans">
      {/* ================================================================================================================== */}
      {/* Left Column (Brand & Architecture Illustration) */}
      {/* ================================================================================================================== */}
      <div
        className="hidden lg:flex flex-1 bg-primary relative flex-col justify-between p-8 xl:p-12 2xl:p-14 text-white-100 overflow-hidden"
        style={{
          backgroundImage: `url('${bgPattern}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Subtle overlay so text has high contrast and buildings look crisp */}
        <div className="absolute inset-0 bg-primary/30 mix-blend-multiply pointer-events-none" />

        {/* Top Branding Block */}
        <div className="z-10">
          <img
            src={logo}
            alt="g-axis ai suites"
            className="h-10 xl:h-12 mb-3 xl:mb-4 object-contain select-none"
          />
          <h1 className="text-2xl sm:text-3xl xl:text-4xl 2xl:text-[42px] font-bold leading-tight tracking-tight">
            Empowering <br />
            <span className="text-secondary/80">Enterprise Intelligence..</span>
          </h1>
        </div>

        {/* Compact Glassmorphism Quote Card - Fully visible without overflowing or clipping */}
        <div className="z-10 bg-black/25 backdrop-blur-md border border-white-100/20 p-5 xl:p-6 2xl:p-7 rounded-2xl xl:rounded-3xl max-w-xl flex flex-col shadow-none">
          <div className="w-full flex justify-start mb-2 text-white-100/40">
            <QuoteIcon size={24} className="rotate-180" />
          </div>

          <p className="text-xs sm:text-sm xl:text-base 2xl:text-lg font-medium leading-relaxed text-center px-2 text-white-100/95">
            Seamlessly{" "}
            <span className="text-secondary font-semibold">
              manage, monitor, and scale your operations
            </span>{" "}
            from a single enterprise cockpit. Welcome to{" "}
            <span className="text-secondary font-semibold">g-Axis Suites</span>, where
            data-driven execution meets organizational clarity.
          </p>

          <div className="w-full flex justify-end mt-2 text-white-100/40">
            <QuoteIcon size={24} />
          </div>
        </div>
      </div>

      {/* ================================================================================================================== */}
      {/* Right Column (Form & Footer Panel) */}
      {/* ================================================================================================================== */}
      <div className="flex flex-col w-full lg:w-[480px] xl:w-[540px] shrink-0 h-full relative bg-white-100 justify-between">
        <div className="auth-form-scroll-container flex-1 flex flex-col justify-center overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {children}
        </div>

        <div className="w-full text-center py-4 px-6 text-xs text-black-90/60 shrink-0">
          Copyright © 2026,{" "}
          <a
            href="https://gitakshmi.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold hover:underline"
          >
            Gitakshmi Group
          </a>
          . All Rights Reserved.
        </div>
      </div>
    </div>
  );
};
