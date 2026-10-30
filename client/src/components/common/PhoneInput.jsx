//==================================================================================================================
//    PHONE INPUT COMPONENT
//    Standardized country dial code selector with flag images and phone number input field matching design tokens
//==================================================================================================================
import React, { useState, useRef, useEffect, memo } from 'react';
import { ChevronDown } from 'lucide-react';

//==================================================================================================================
//    COUNTRY DIAL CODES (ISO 3166-1 alpha-2 codes for flagcdn.com images)
//==================================================================================================================
const COUNTRIES = [
  { code: 'IN', name: 'India', dial: '+91' },
  { code: 'US', name: 'United States', dial: '+1' },
  { code: 'GB', name: 'United Kingdom', dial: '+44' },
  { code: 'CA', name: 'Canada', dial: '+1' },
  { code: 'AU', name: 'Australia', dial: '+61' },
  { code: 'DE', name: 'Germany', dial: '+49' },
  { code: 'FR', name: 'France', dial: '+33' },
  { code: 'JP', name: 'Japan', dial: '+81' },
  { code: 'CN', name: 'China', dial: '+86' },
  { code: 'BR', name: 'Brazil', dial: '+55' },
  { code: 'ZA', name: 'South Africa', dial: '+27' },
  { code: 'MX', name: 'Mexico', dial: '+52' },
  { code: 'IT', name: 'Italy', dial: '+39' },
  { code: 'ES', name: 'Spain', dial: '+34' },
  { code: 'RU', name: 'Russia', dial: '+7' },
  { code: 'KR', name: 'South Korea', dial: '+82' },
  { code: 'SG', name: 'Singapore', dial: '+65' },
  { code: 'AE', name: 'UAE', dial: '+971' },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966' },
  { code: 'PK', name: 'Pakistan', dial: '+92' },
  { code: 'BD', name: 'Bangladesh', dial: '+880' },
  { code: 'NP', name: 'Nepal', dial: '+977' },
  { code: 'LK', name: 'Sri Lanka', dial: '+94' },
  { code: 'MY', name: 'Malaysia', dial: '+60' },
  { code: 'ID', name: 'Indonesia', dial: '+62' },
  { code: 'TH', name: 'Thailand', dial: '+66' },
  { code: 'VN', name: 'Vietnam', dial: '+84' },
  { code: 'PH', name: 'Philippines', dial: '+63' },
  { code: 'NZ', name: 'New Zealand', dial: '+64' },
  { code: 'NG', name: 'Nigeria', dial: '+234' },
  { code: 'EG', name: 'Egypt', dial: '+20' },
  { code: 'KE', name: 'Kenya', dial: '+254' },
  { code: 'GH', name: 'Ghana', dial: '+233' },
  { code: 'QA', name: 'Qatar', dial: '+974' },
  { code: 'KW', name: 'Kuwait', dial: '+965' },
  { code: 'BH', name: 'Bahrain', dial: '+973' },
  { code: 'OM', name: 'Oman', dial: '+968' },
  { code: 'TR', name: 'Turkey', dial: '+90' },
  { code: 'PL', name: 'Poland', dial: '+48' },
  { code: 'NL', name: 'Netherlands', dial: '+31' },
  { code: 'SE', name: 'Sweden', dial: '+46' },
  { code: 'NO', name: 'Norway', dial: '+47' },
  { code: 'DK', name: 'Denmark', dial: '+45' },
  { code: 'FI', name: 'Finland', dial: '+358' },
  { code: 'CH', name: 'Switzerland', dial: '+41' },
  { code: 'AT', name: 'Austria', dial: '+43' },
  { code: 'BE', name: 'Belgium', dial: '+32' },
  { code: 'PT', name: 'Portugal', dial: '+351' },
  { code: 'GR', name: 'Greece', dial: '+30' },
  { code: 'AR', name: 'Argentina', dial: '+54' },
  { code: 'CL', name: 'Chile', dial: '+56' },
  { code: 'CO', name: 'Colombia', dial: '+57' },
  { code: 'IL', name: 'Israel', dial: '+972' },
  { code: 'IR', name: 'Iran', dial: '+98' },
  { code: 'IQ', name: 'Iraq', dial: '+964' },
  { code: 'AF', name: 'Afghanistan', dial: '+93' },
  { code: 'MM', name: 'Myanmar', dial: '+95' },
  { code: 'KH', name: 'Cambodia', dial: '+855' },
  { code: 'ET', name: 'Ethiopia', dial: '+251' },
  { code: 'TZ', name: 'Tanzania', dial: '+255' },
  { code: 'UG', name: 'Uganda', dial: '+256' },
  { code: 'ZW', name: 'Zimbabwe', dial: '+263' },
  { code: 'MA', name: 'Morocco', dial: '+212' },
  { code: 'DZ', name: 'Algeria', dial: '+213' },
  { code: 'TN', name: 'Tunisia', dial: '+216' },
];

//==================================================================================================================
//    FLAG IMAGE SUBCOMPONENT WITH RESILIENT EMOJI FALLBACK
//==================================================================================================================
const getFlagEmoji = (countryCode) => {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const FlagImage = memo(({ code }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !code) {
    return (
      <span className="text-sm leading-none shrink-0 inline-flex items-center justify-center w-5 h-3.5 select-none">
        {getFlagEmoji(code)}
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      alt={code}
      width={20}
      height={14}
      onError={() => setHasError(true)}
      className="w-5 h-3.5 rounded-[2px] shadow-2xs border border-black/10 object-cover shrink-0"
      style={{ display: 'block' }}
      loading="lazy"
    />
  );
});

FlagImage.displayName = 'FlagImage';

//==================================================================================================================
//    MAIN PHONE INPUT COMPONENT
//==================================================================================================================
export const PhoneInput = memo(({
  value = '',
  onChange,
  name = 'mobile',
  placeholder = '98765 43210',
  required = false,
  disabled = false,
  className = '',
}) => {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]); // Default: India (+91)
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sync selected country if value starts with a known dial code
  useEffect(() => {
    if (typeof value === 'string' && value.startsWith('+')) {
      const match = COUNTRIES.find((c) => value.startsWith(c.dial));
      if (match && match.code !== selectedCountry.code) {
        setSelectedCountry(match);
      }
    }
  }, [value, selectedCountry.code]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Handle selecting a country from the dropdown
  const handleSelect = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    if (onChange) {
      let rawNumber = typeof value === 'string' ? value : '';
      if (rawNumber.startsWith('+')) {
        const prevDial = selectedCountry.dial;
        if (rawNumber.startsWith(prevDial)) {
          rawNumber = rawNumber.slice(prevDial.length).trim();
        } else {
          rawNumber = rawNumber.replace(/^\+\d+\s*/, '');
        }
      }
      const updatedValue = rawNumber ? `${country.dial} ${rawNumber}` : country.dial;
      const syntheticEvent = {
        target: { name, value: updatedValue },
        currentTarget: { name, value: updatedValue },
      };
      onChange(syntheticEvent);
    }
  };

  // Handle manual typing into phone input field
  const handleInputChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div
      className={`w-full h-[40px] px-3.5 bg-[#F8F9FC] border border-[#D0D5DD] rounded-lg text-xs text-[#101828] flex items-center relative transition-all ${
        disabled
          ? 'bg-[#F2F4F8] cursor-not-allowed opacity-75'
          : 'focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20'
      } ${className}`.trim()}
    >
      {/* ==============================================================================================================
          FLAG SELECTOR BUTTON & POPUP DROPDOWN
      ============================================================================================================== */}
      <div ref={dropdownRef} className="relative shrink-0 flex items-center h-full">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex items-center gap-1.5 pr-2 select-none h-full ${
            disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:opacity-80'
          }`}
          title={`Country: ${selectedCountry.name} (${selectedCountry.dial})`}
        >
          <FlagImage code={selectedCountry.code} size={20} />
          <ChevronDown size={14} className="text-[#2E90FA] shrink-0" strokeWidth={2.5} />
        </button>

        <span className="text-[#D0D5DD] pr-2.5 select-none font-light">|</span>

        {/* Dropdown Panel matching screenshot specification */}
        {isOpen && (
          <div className="absolute top-[calc(100%+6px)] left-[-6px] w-[82px] bg-white-100 border border-[#D0D5DD] rounded-lg shadow-lg z-[9999] overflow-hidden">
            <ul className="max-h-[220px] overflow-y-auto slim-scrollbar py-1">
              {COUNTRIES.map((country) => (
                <li
                  key={country.code}
                  onClick={() => handleSelect(country)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 text-xs cursor-pointer hover:bg-gray/60 transition-colors ${
                    selectedCountry.code === country.code
                      ? 'bg-[#F0F4FE] text-primary font-semibold'
                      : 'text-black-90 font-medium'
                  }`}
                >
                  <FlagImage code={country.code} />
                  <span className="text-xs shrink-0">{country.dial}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ==============================================================================================================
          TELEPHONE INPUT
      ============================================================================================================== */}
      <input
        type="tel"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        required={required}
        disabled={disabled}
        className="w-full h-full bg-transparent text-xs text-[#101828] placeholder:text-[#475467] font-normal focus:outline-none min-w-0"
      />
    </div>
  );
});

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
