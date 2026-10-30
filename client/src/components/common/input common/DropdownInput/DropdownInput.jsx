//==================================================================================================================
//    COMMON DROPDOWN / SELECT INPUT COMPONENT
//    Standardized searchable combobox dropdown component used across all panel modules
// ==================================================================================================================
import React, { memo, useState, useRef, useMemo, useCallback } from 'react';
import { useClickOutside } from '../../../../hooks/useClickOutside';

// ==================================================================================================================
//    Dropdown Chevron Down Icon
// ==================================================================================================================
const ChevronDown = ({ className = 'w-4 h-4 text-primary' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

//==================================================================================================================
//    DROPDOWN INPUT COMPONENT
//==================================================================================================================
export const DropdownInput = memo(({
  label,
  value,
  defaultValue,
  name,
  id,
  options = [],
  placeholder = '',
  disabled = false,
  required = false,
  onChange,
  className = '',
  containerClassName = 'flex flex-col gap-1 w-full',
  labelClassName = 'text-xs font-semibold text-[#101828]',
  selectClassName = 'w-full h-[40px] px-3 pr-8 bg-[#F8F9FC] border border-[#D0D5DD] rounded-lg text-xs text-[#101828] font-normal focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 cursor-pointer transition-all disabled:bg-[#F2F4F8] disabled:cursor-not-allowed',
  chevronClassName = 'w-4 h-4 text-primary',
  showChevron,
  children,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Active value handling
  const currentValue = value !== undefined ? value : internalValue;
  const isValueEmpty = currentValue === '' || currentValue === null || currentValue === undefined;

  // Close dropdown and clear search state when clicking outside
  useClickOutside(dropdownRef, () => {
    if (isOpen) {
      setIsOpen(false);
      setIsSearching(false);
      setSearchTerm('');
    }
  });

  //==================================================================================================================
  //    Normalize Options (Array of strings, objects, or React children)
  //==================================================================================================================
  const normalizedOptions = useMemo(() => {
    let list = [];
    if (options && options.length > 0) {
      list = options.map((opt) => {
        if (typeof opt === 'object' && opt !== null) {
          return {
            value: String(opt.value ?? opt.id ?? ''),
            label: String(opt.label ?? opt.name ?? opt.value ?? ''),
          };
        }
        return { value: String(opt), label: String(opt) };
      });
    } else if (children) {
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child)) {
          list.push({
            value: String(child.props.value ?? child.props.children ?? ''),
            label: String(child.props.children ?? child.props.value ?? ''),
          });
        }
      });
    }
    return list;
  }, [options, children]);

  // Determine effective placeholder
  const effectivePlaceholder = useMemo(() => {
    if (placeholder) return placeholder;
    const emptyOpt = normalizedOptions.find((opt) => opt.value === '');
    return emptyOpt ? emptyOpt.label : '';
  }, [placeholder, normalizedOptions]);

  // Find currently selected option
  const selectedOption = useMemo(() => {
    if (isValueEmpty) return null;
    return normalizedOptions.find((opt) => String(opt.value) === String(currentValue)) || null;
  }, [isValueEmpty, currentValue, normalizedOptions]);

  // Include default placeholder item if defined and not already present
  const allOptionsWithPlaceholder = useMemo(() => {
    if (!effectivePlaceholder) return normalizedOptions;
    const hasEmptyOption = normalizedOptions.some((opt) => opt.value === '');
    if (hasEmptyOption) return normalizedOptions;
    return [{ value: '', label: effectivePlaceholder }, ...normalizedOptions];
  }, [effectivePlaceholder, normalizedOptions]);

  // Filter options based on real-time search query
  const filteredOptions = useMemo(() => {
    if (!isSearching || !searchTerm.trim()) {
      return allOptionsWithPlaceholder;
    }
    const query = searchTerm.toLowerCase().trim();
    return allOptionsWithPlaceholder.filter((opt) =>
      opt.label.toLowerCase().includes(query)
    );
  }, [allOptionsWithPlaceholder, isSearching, searchTerm]);

  //==================================================================================================================
  //    Handle Option Selection
  //==================================================================================================================
  const handleSelectOption = useCallback((opt) => {
    setInternalValue(opt.value);
    setIsSearching(false);
    setSearchTerm('');
    setIsOpen(false);

    if (onChange) {
      onChange({
        target: {
          name: name || id || '',
          value: opt.value,
        },
      });
    }
  }, [onChange, name, id]);

  //==================================================================================================================
  //    Input Change & Interaction Handlers
  //==================================================================================================================
  const handleInputChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setIsSearching(true);
    if (!isOpen) setIsOpen(true);
  }, [isOpen]);

  const handleInputClick = useCallback(() => {
    if (!disabled) {
      if (!isOpen) {
        setIsOpen(true);
        setTimeout(() => inputRef.current?.select(), 0);
      }
    }
  }, [disabled, isOpen]);

  const handleChevronClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      if (isOpen) {
        setIsOpen(false);
        setIsSearching(false);
        setSearchTerm('');
      } else {
        setIsOpen(true);
        inputRef.current?.focus();
        setTimeout(() => inputRef.current?.select(), 0);
      }
    }
  }, [disabled, isOpen]);

  //==================================================================================================================
  //    Keyboard Navigation
  //==================================================================================================================
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setIsSearching(false);
      setSearchTerm('');
      inputRef.current?.blur();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && filteredOptions.length > 0) {
        handleSelectOption(filteredOptions[0]);
      }
    } else if (e.key === 'ArrowDown' && !isOpen) {
      e.preventDefault();
      setIsOpen(true);
    }
  }, [isOpen, filteredOptions, handleSelectOption]);

  // Display value logic
  const displayValue = isSearching
    ? searchTerm
    : (selectedOption ? selectedOption.label : '');

  return (
    <div className={`relative ${containerClassName}`} ref={dropdownRef}>
      {label && (
        <label htmlFor={id || name} className={labelClassName}>
          {label}
        </label>
      )}

      {/* Hidden input for native form compatibility */}
      <input
        type="hidden"
        name={name}
        id={id}
        value={currentValue ?? ''}
        required={required}
      />

      {/* Main Searchable Input Box */}
      <div className="relative w-full flex items-center">
        <input
          ref={inputRef}
          type="text"
          id={id ? `${id}-search` : undefined}
          value={displayValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onFocus={handleInputClick}
          onKeyDown={handleKeyDown}
          placeholder={effectivePlaceholder}
          disabled={disabled}
          autoComplete="off"
          className={`
            ${selectClassName}
            ${isOpen ? 'border-primary ring-1 ring-primary/20' : ''}
            ${className}
          `.trim()}
          {...props}
        />

        {/* Chevron Down / Up Icon */}
        {(showChevron ?? !disabled) && (
          <button
            type="button"
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleChevronClick}
            disabled={disabled}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-0.5 focus:outline-none"
          >
            <ChevronDown
              className={`${chevronClassName} transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                }`}
            />
          </button>
        )}
      </div>

      {/* Floating Options Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white-100 border border-[#D0D5DD] rounded-lg shadow-lg overflow-hidden animate-in fade-in-50 duration-100">
          <div className="max-h-60 overflow-y-auto slim-scrollbar py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => {
                const isSelected = String(opt.value) === String(currentValue);
                return (
                  <div
                    key={`dropdown-opt-${idx}-${opt.value}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelectOption(opt)}
                    className={`
                      w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer select-none
                      ${isSelected
                        ? 'bg-[#1570EF] text-white-100 font-medium'
                        : 'text-[#101828] hover:bg-[#F2F4F8]'
                      }
                    `}
                  >
                    {opt.label}
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-3 text-xs text-black-90/50 text-center select-none">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default DropdownInput;
