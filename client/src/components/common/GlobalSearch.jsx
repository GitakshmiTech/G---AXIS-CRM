import React, { useState, useRef } from 'react';
import { ChevronDown, ArrowUpRight, Search } from 'lucide-react';
import { SearchIcon } from './icons/SearchIcon';
import { useClickOutside } from '../../hooks/useClickOutside';
import { NAV_SECTIONS } from './Sidebar';

//==================================================================================================================
//    R E C E N T_ S E A R C H E S
//==================================================================================================================
const RECENT_SEARCHES = [
  'Recent Search 1',
  'Recent Search 2',
  'Recent Search 3',
  'Recent Search 4',
  'Recent Search 5',
];

//==================================================================================================================
//    M O D U L E_ O P T I O N S
//==================================================================================================================
const MODULE_OPTIONS = [
  'Global',
  ...NAV_SECTIONS.flatMap(section => section.items.map(item => item.label))
];

//==================================================================================================================
//    GLOBAL SEARCH
//==================================================================================================================
export const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('Global');
  const searchRef = useRef(null);

  useClickOutside(searchRef, () => setIsOpen(false));

  return (
    <div className={`flex-1 w-full max-w-2xl relative ${isOpen ? 'z-[100] search-open' : 'z-50'}`} ref={searchRef}>
      <div 
        className={`relative w-full transition-opacity duration-200 flex justify-end sm:justify-start ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <button 
          className="sm:hidden relative p-2.5 text-black-90/70 hover:text-black-90 rounded-full bg-white-100 border border-stroke shadow-2xs hover:bg-gray/50 transition-colors cursor-pointer"
          onClick={() => setIsOpen(true)}
          aria-label="Open search"
        >
          <SearchIcon size={20} />
        </button>
        <div className="hidden sm:block relative w-full">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2" size={20} />
          <input 
            type="text" 
            placeholder="Search Tenants or Employees..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white-100 border border-stroke rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 text-black-90 placeholder:text-black-90/40 cursor-text transition-all shadow-2xs"
            onFocus={() => setIsOpen(true)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 w-screen h-screen bg-black-90/20 backdrop-blur-[8px] animate-in fade-in duration-200 cursor-default"
            style={{ zIndex: -1 }}
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed sm:absolute top-[70px] sm:top-0 left-4 right-4 sm:left-0 sm:right-auto sm:w-full bg-white-100 rounded-[14px] shadow-[0px_8px_30px_rgba(0,0,0,0.12)] border border-stroke/20 p-2.5 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-10">
          
          <div className="flex items-center h-[46px] w-full bg-[#F4F6F9] border border-[#E2E8F0] rounded-[10px] px-2 sm:px-3 overflow-hidden focus-within:ring-1 focus-within:ring-primary/30 transition-all">
            
            <div className="relative flex items-center h-full group">
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="h-full bg-transparent text-[11px] sm:text-sm text-black-90 font-medium whitespace-nowrap group-hover:text-primary transition-colors pr-5 sm:pr-6 text-center appearance-none cursor-pointer focus:outline-none max-w-[60px] sm:max-w-none text-ellipsis overflow-hidden"
                style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
              >
                {MODULE_OPTIONS.map((opt, i) => (
                  <option key={i} value={opt} className="text-black-90 bg-white-100 font-normal text-center">
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="text-primary absolute right-1 pointer-events-none" />
            </div>
            
            <div className="w-[1px] h-6 bg-[#CBD5E1] mx-2 flex-shrink-0" />
            
            <div className="flex-1 flex items-center h-full pl-1 sm:pl-2">
              <SearchIcon className="mr-1.5 sm:mr-2 flex-shrink-0" size={18} />
              <input
                autoFocus
                type="text"
                className="w-full h-full bg-transparent text-[12px] sm:text-sm text-black-90 placeholder:text-black-90/40 focus:outline-none min-w-0"
                placeholder="Search anything..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-5 px-1 pb-1">
            <h3 className="text-[11px] font-semibold text-black-90/40 uppercase tracking-wider mb-3">
              Recent Searchs
            </h3>
            
            <div className="flex flex-col gap-2">
              {RECENT_SEARCHES.map((item, index) => (
                <button
                  key={index}
                  className="flex items-center justify-between w-full py-2.5 px-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Search size={18} className="text-[#475569]" />
                    <span className="text-sm font-medium text-[#475569]">
                      {item}
                    </span>
                  </div>
                  <ArrowUpRight size={18} className="text-primary transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              ))}
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default GlobalSearch;
