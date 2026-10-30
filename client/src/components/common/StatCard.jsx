//==================================================================================================================
//    IMPORTS AND DEPENDENCIES
//    React primitives, Lucide trend icons, and default status category glyphs.
// ==================================================================================================================
import {
  TrendingUp,
  TrendingDown,
  Package,
  Layers,
  Users,
  UserCheck,
} from 'lucide-react';

//==================================================================================================================
//    DEFAULT COLOR STYLES MAPPING
//    Uniform color tokens for icon badge background and text colors.
// ==================================================================================================================
const COLOR_MAP = {
  secondary: {
    bg: 'bg-secondary/15',
    text: 'text-secondary',
    defaultIcon: Package,
  },
  success: {
    bg: 'bg-success/15',
    text: 'text-success',
    defaultIcon: Layers,
  },
  alert: {
    bg: 'bg-alert/15',
    text: 'text-alert',
    defaultIcon: Users,
  },
  purple: {
    bg: 'bg-purple/15',
    text: 'text-purple',
    defaultIcon: UserCheck,
  },
};

//==================================================================================================================
//    COMMON STAT CARD COMPONENT
//    Universal metric card tile displaying key value, icon asset/glyph, and period comparison trend.
// ==================================================================================================================
export const StatCard = ({
  item,
  title,
  value,
  subText,
  trendType,
  isPositive,
  colorKey,
  icon: CustomIcon,
  iconSrc,
  className = '',
}) => {
  // Resolve item object or individual props
  const resolvedTitle = item?.title ?? title;
  const resolvedValue = item?.value ?? value;
  const resolvedSubText = item?.subText ?? subText;
  const resolvedColorKey = item?.colorKey ?? colorKey ?? 'secondary';
  const resolvedIconSrc = item?.iconSrc ?? iconSrc;
  const ResolvedIcon = item?.icon ?? CustomIcon;

  // Determine trend state: 'positive' | 'negative' | 'neutral'
  const resolvedTrendType =
    item?.trendType ??
    trendType ??
    (item?.isPositive !== undefined
      ? item.isPositive
        ? 'positive'
        : 'negative'
      : isPositive !== undefined
        ? isPositive
          ? 'positive'
          : 'negative'
        : 'neutral');

  const colorConfig = COLOR_MAP[resolvedColorKey] || COLOR_MAP.secondary;
  const FallbackIcon = colorConfig.defaultIcon;

  //==================================================================================================================
  //    ICON RENDERING LOGIC
  //    Supports PNG image assets, custom Lucide icons, or theme fallback icons.
  // ==================================================================================================================
  const renderIcon = () => {
    if (resolvedIconSrc) {
      return (
        <img
          src={resolvedIconSrc}
          alt={resolvedTitle || 'Stat Icon'}
          className="w-8 h-8 sm:w-10 sm:h-10 object-contain flex-shrink-0 select-none"
        />
      );
    }

    const IconToRender = ResolvedIcon || FallbackIcon;
    return (
      <div
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${colorConfig.bg} ${colorConfig.text} flex items-center justify-center flex-shrink-0`}
      >
        <IconToRender size={17} className="sm:hidden" />
        <IconToRender size={20} className="hidden sm:block" />
      </div>
    );
  };

  //==================================================================================================================
  //    TREND PILL BADGE RENDERING
  //    Displays period comparison indicator with standardized bg-gray background token.
  // ==================================================================================================================
  const renderTrend = () => {
    if (!resolvedSubText) return null;

    if (resolvedTrendType === 'positive') {
      return (
        <div className="w-full flex items-center justify-center sm:justify-start gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-gray text-success">
          <TrendingUp size={12} className="flex-shrink-0 sm:hidden self-center" />
          <TrendingUp size={14} className="flex-shrink-0 hidden sm:block" />
          <span className="leading-tight text-center sm:text-left break-words whitespace-normal sm:truncate">{resolvedSubText}</span>
        </div>
      );
    }

    if (resolvedTrendType === 'negative') {
      return (
        <div className="w-full flex items-center justify-center sm:justify-start gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-gray text-alert">
          <TrendingDown size={12} className="flex-shrink-0 sm:hidden self-center" />
          <TrendingDown size={14} className="flex-shrink-0 hidden sm:block" />
          <span className="leading-tight text-center sm:text-left break-words whitespace-normal sm:truncate">{resolvedSubText}</span>
        </div>
      );
    }

    return (
      <div className="w-full flex items-center justify-center sm:justify-start px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold bg-gray text-black-90/70">
        <span className="leading-tight text-center sm:text-left break-words whitespace-normal sm:truncate">{resolvedSubText}</span>
      </div>
    );
  };

  return (
    <div
      className={`bg-white-100 rounded-xl p-3 sm:p-5 border border-stroke flex flex-col justify-between shadow-2xs ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 sm:mb-3 gap-1 sm:gap-2">
        <div className="flex justify-center sm:justify-end w-full sm:w-auto order-1 sm:order-2">
          {renderIcon()}
        </div>
        <h4 className="text-black-90/60 font-medium text-xs sm:text-sm leading-snug line-clamp-2 text-center sm:text-left order-2 sm:order-1 mt-1 sm:mt-0">
          {resolvedTitle}
        </h4>
      </div>

      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-3xl font-bold text-black-90 mb-1.5 sm:mb-2 leading-none tracking-tight">
          {resolvedValue}
        </h2>
        {renderTrend()}
      </div>
    </div>
  );
};

//==================================================================================================================
//    DEFAULT EXPORT
// ==================================================================================================================
export default StatCard;
