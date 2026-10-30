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
    <div className="flex w-full h-screen overflow-hidden bg-white-100 font-sans">
      {/* ================================================================================================================== */}

      {/* ================================================================================================================== */}
      <div
        className="hidden lg:flex flex-1 bg-primary relative flex-col justify-between p-16 text-white-100"
        style={{
          backgroundImage: `url('${bgPattern}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* ================================================================================================================== */}

        {/* ================================================================================================================== */}
        <div className="z-10">
          <img
            src={logo}
            alt="g-axis ai suites"
            className="h-14 mb-5 object-contain"
          />
          <h1 className="text-[48px] font-bold leading-tight">
            Empowering <br />
            <span className="text-secondary/70">Enterprise Intelligence..</span>
          </h1>
        </div>

        {/* ================================================================================================================== */}

        {/* ================================================================================================================== */}
        <div className="z-10 bg-black/15 backdrop-blur-lg border border-white-100/20 p-10 md:p-12 rounded-3xl max-w-[auto] flex flex-col shadow-2xl">
          {/* ================================================================================================================== */}

          {/* ================================================================================================================== */}
          <div className="w-full flex justify-start mb-4 text-white-100/20">
            <QuoteIcon size={45} className="rotate-180" />
          </div>

          <p className="text-[22px] md:text-[24px] font-medium leading-[1.6] text-center px-4">
            Seamlessly{" "}
            <span className="text-secondary">
              manage, monitor, and scale your operations
            </span>{" "}
            from a single enterprise cockpit. Welcome to{" "}
            <span className="text-secondary">g-Axis Suites</span>, where
            data-driven execution meets organizational clarity.
          </p>

          {/* ================================================================================================================== */}

          {/* ================================================================================================================== */}
          <div className="w-full flex justify-end mt-4 text-white-100/20">
            <QuoteIcon size={45} />
          </div>
        </div>
      </div>

      {/* ================================================================================================================== */}

      {/* ================================================================================================================== */}
      <div className="flex flex-col w-full lg:w-[550px] shrink-0 h-full relative bg-white-100">
        {/* ================================================================================================================== */}

        {/* ================================================================================================================== */}
        <div className="auth-form-scroll-container flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {children}
        </div>

        {/* ================================================================================================================== */}

        {/* ================================================================================================================== */}
        <div className="w-full text-center p-6 text-sm font-bold text-black-90/70 shrink-0">
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