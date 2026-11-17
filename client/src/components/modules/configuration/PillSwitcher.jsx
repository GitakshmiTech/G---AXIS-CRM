//==================================================================================================================
//    REUSABLE PILL SWITCHER COMPONENT
//    Segmented pill switch control with hardware-accelerated animated sliding indicator
//==================================================================================================================

import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, memo } from 'react';

export const PillSwitcher = memo(({
  tabs = [],
  activeTab,
  onTabChange,
  className = '',
}) => {
  const containerRef = useRef(null);
  const tabRefs = useRef({});
  const isFirstRender = useRef(true);

  const [sliderStyle, setSliderStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  //==================================================================================================================
  //    UPDATE SLIDER POSITION
  //    Calculates active tab's offset position and dimension relative to container
  //==================================================================================================================
  const updateSliderPosition = useCallback(() => {
    const activeEl = tabRefs.current[activeTab];
    if (activeEl && containerRef.current) {
      setSliderStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        opacity: 1,
      });
    }
  }, [activeTab]);

  // Synchronous layout calculation to prevent initial jump/flicker on first paint
  useLayoutEffect(() => {
    updateSliderPosition();
  }, [updateSliderPosition]);

  // Handle dynamic resizing and subsequent interaction animations
  useEffect(() => {
    updateSliderPosition();
    const rafId = requestAnimationFrame(updateSliderPosition);

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateSliderPosition();
      });
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateSliderPosition);

    // Disable first render flag after initial layout
    const timer = setTimeout(() => {
      isFirstRender.current = false;
    }, 50);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', updateSliderPosition);
    };
  }, [updateSliderPosition]);

  //==================================================================================================================
  //    RENDER SEGMENTED PILL SWITCHER
  //==================================================================================================================
  return (
    <div
      ref={containerRef}
      role="tablist"
      data-ui-style="joined-control"
      className={`relative inline-flex items-center h-[34px] bg-gray p-1 rounded-[7px] border-b-2 border-stroke/80 shrink-0  ${className}`.trim()}
    >
      {/* Hardware-Accelerated Sliding Pill Indicator (Pinned top-1 and bottom-1 for exact vertical centering) */}
      <div
        aria-hidden="true"
        className={`absolute top-1 bottom-1 left-0 rounded-[5px] bg-white-100 border-none pointer-events-none z-0 ${
          isFirstRender.current
            ? ''
            : 'transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]'
        }`}
        style={{
          transform: `translate3d(${sliderStyle.left}px, 0, 0)`,
          width: `${sliderStyle.width}px`,
          opacity: sliderStyle.opacity,
        }}
      />

      {/* Interactive Tab Items */}
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el;
            }}
            type="button"
            role="tab"
            data-ui-style="filter-tab"
            aria-selected={isActive}
            onClick={() => onTabChange && onTabChange(tab.id)}
            className={`relative z-10 h-full flex items-center justify-center px-3.5 text-xs  cursor-pointer outline-none focus:outline-none whitespace-nowrap transition-colors duration-200 ${
              isActive
                ? 'text-primary font-bold'
                : 'text-black-90/70 hover:text-black-90 font-medium'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
});

PillSwitcher.displayName = 'PillSwitcher';
export default PillSwitcher;
