//==================================================================================================================
//    TABLE FILTER SELECT COMPONENT
//    100% Flat, Square-Surface & Figma-Aligned Searchable Dropdown Menu (Rule 21)
//==================================================================================================================

import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const TableFilterSelect = React.memo(({
  value = '',
  onChange,
  placeholder = 'Select',
  options = [],
  className = '',
  selectClassName = '',
  disabled = false,
  name,
  id,
  showAllOption,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [typeaheadBuffer, setTypeaheadBuffer] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const typeTimeoutRef = useRef(null);

  // Check if options contains an 'All' entry like { value: 'All', label: 'By Stage' }
  const existingAllEntry = useMemo(() => {
    return options.find(
      (opt) => typeof opt === 'object' && (opt?.value === 'All' || opt?.value === '' || (typeof opt?.label === 'string' && opt.label.startsWith('By ')))
    );
  }, [options]);

  const effectivePlaceholder = useMemo(() => {
    if (placeholder && placeholder !== 'Select') return placeholder;
    if (existingAllEntry?.label && typeof existingAllEntry.label === 'string' && existingAllEntry.label.startsWith('By ')) {
      return existingAllEntry.label;
    }
    return placeholder;
  }, [placeholder, existingAllEntry]);

  const allValue = useMemo(() => {
    if (existingAllEntry && existingAllEntry.value !== undefined) return existingAllEntry.value;
    return '';
  }, [existingAllEntry]);

  const shouldShowAll = typeof showAllOption === 'boolean'
    ? showAllOption
    : Boolean(
        existingAllEntry ||
        (effectivePlaceholder && effectivePlaceholder.toLowerCase().startsWith('by '))
      );

  const filterId = id || name || (effectivePlaceholder ? effectivePlaceholder.toLowerCase().replace(/\s+/g, '-') : 'filter-select');

  // Close on outside click
  useEffect(() => {
    const handleDocClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setTypeaheadBuffer('');
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, []);

  const normalizedOptions = useMemo(() => {
    return options
      .map((opt) => {
        const val = typeof opt === 'string' ? opt : opt?.value;
        const lbl = typeof opt === 'string' ? opt : opt?.label;
        return { value: val, label: lbl };
      })
      .filter((opt) => {
        // If shouldShowAll is active, filter out duplicate placeholder options like { value: 'All', label: 'By Stage' }
        if (shouldShowAll) {
          if (opt.value === 'All' && String(opt.label).toLowerCase().startsWith('by ')) return false;
          if (opt.value === '' && String(opt.label).toLowerCase().startsWith('by ')) return false;
        }
        return true;
      });
  }, [options, shouldShowAll]);

  const handleSelect = useCallback(
    (optVal) => {
      if (disabled) return;
      if (typeof onChange === 'function') {
        const syntheticEvent = {
          target: { value: optVal, name: name || '' },
          currentTarget: { value: optVal, name: name || '' },
        };
        onChange(syntheticEvent);
      }
      setIsOpen(false);
      setTypeaheadBuffer('');
      setHighlightedIndex(-1);
    },
    [onChange, disabled, name]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (disabled) return;
      if (!isOpen) {
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
          e.preventDefault();
          setIsOpen(true);
        }
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < normalizedOptions.length - 1 ? prev + 1 : 0));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : normalizedOptions.length - 1));
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < normalizedOptions.length) {
          handleSelect(normalizedOptions[highlightedIndex].value);
        } else if (shouldShowAll && highlightedIndex === -1) {
          handleSelect(allValue);
        }
        return;
      }
      // Instant typeahead jump
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const nextQuery = typeaheadBuffer + e.key.toLowerCase();
        setTypeaheadBuffer(nextQuery);
        if (typeTimeoutRef.current) clearTimeout(typeTimeoutRef.current);
        typeTimeoutRef.current = setTimeout(() => setTypeaheadBuffer(''), 800);

        const matchIdx = normalizedOptions.findIndex((opt) =>
          String(opt.label).toLowerCase().startsWith(nextQuery)
        );
        if (matchIdx !== -1) {
          setHighlightedIndex(matchIdx);
          document.getElementById(`${filterId}-item-${matchIdx}`)?.scrollIntoView({ block: 'nearest' });
        }
      }
    },
    [disabled, isOpen, normalizedOptions, highlightedIndex, handleSelect, typeaheadBuffer, filterId, shouldShowAll, allValue]
  );

  const isAllActive = !value || value === '' || value === 'All' || value === allValue;

  const displayLabel = useMemo(() => {
    if (isAllActive) return effectivePlaceholder;
    const match = normalizedOptions.find((opt) => opt.value === value);
    return match ? match.label : value;
  }, [value, normalizedOptions, effectivePlaceholder, isAllActive]);

  const allLabel = useMemo(() => {
    const suffix = effectivePlaceholder.replace(/^By\s+/i, '').trim();
    return suffix ? `All ${suffix}` : 'All';
  }, [effectivePlaceholder]);

  return (
    <div
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
      className={`relative w-full sm:w-auto inline-block ${className}`.trim()}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        title={`Filter by: ${displayLabel}`}
        className={`w-full sm:w-auto h-8 bg-gray border-b-2 border-stroke/80 rounded-[7px] pl-3 pr-2.5 text-xs font-medium text-black-90 flex items-center justify-between gap-2 outline-none hover:bg-gray/80 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${selectClassName}`.trim()}
      >
        <span className="truncate max-w-[120px] text-left">{displayLabel}</span>
        <ChevronDown
          size={14}
          className={`text-black-90/50 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Floating Menu Panel */}
      {isOpen && (
        <div
          data-ui-style="dropdown-menu"
          data-ui-width="trigger"
          className="absolute top-full left-0 right-0 w-full min-w-full mt-1 bg-gray border-none rounded-none p-0 z-50 shadow-none animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="max-h-48 overflow-y-auto no-scrollbar flex flex-col gap-0.5 w-full">
            {shouldShowAll && (
              <button
                type="button"
                onClick={() => handleSelect(allValue)}
                className={`flex items-center justify-between w-full px-2.5 py-1.5 text-xs rounded-none transition-colors cursor-pointer text-left ${
                  isAllActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-black-90/70 hover:bg-white-100'
                }`}
              >
                <span className="truncate whitespace-nowrap">{allLabel}</span>
                {isAllActive && <Check size={12} className="text-primary shrink-0 ml-1.5" />}
              </button>
            )}

            {normalizedOptions.map((opt, idx) => {
              const isSelected = opt.value === value;
              const isHighlighted = idx === highlightedIndex;
              return (
                <button
                  key={opt.value}
                  id={`${filterId}-item-${idx}`}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`flex items-center justify-between w-full px-2.5 py-1.5 text-xs rounded-none transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'bg-primary/10 text-primary font-semibold'
                      : isHighlighted
                      ? 'bg-white-100 text-black-90'
                      : 'text-black-90 hover:bg-white-100'
                  }`}
                >
                  <span className="truncate whitespace-nowrap">{opt.label}</span>
                  {isSelected && <Check size={12} className="text-primary shrink-0 ml-1.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});

export default TableFilterSelect;

