import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

const TOAST_STYLES = {
  success: { Icon: CheckCircle2, color: 'text-success', borderBottom: 'border-b-success', label: 'Success' },
  error: { Icon: AlertCircle, color: 'text-alert', borderBottom: 'border-b-alert', label: 'Error' },
  info: { Icon: Info, color: 'text-primary', borderBottom: 'border-b-stroke/80', label: 'Information' },
};

/** Render accessible app-wide notifications with explicit dismiss controls. */
export const ToastViewport = ({ toasts = [], onDismiss }) => (
    <div
      className="fixed right-4 top-4 z-[9999] flex w-[min(25rem,calc(100vw-2rem))] flex-col gap-2.5 pointer-events-none"
      aria-live="polite"
      aria-relevant="additions"
    >
      {toasts.map((item) => {
        const config = TOAST_STYLES[item.type] || TOAST_STYLES.info;
        const Icon = config.Icon;
        return (
            <div
              key={item.id}
              role={item.type === 'error' ? 'alert' : 'status'}
              className={`pointer-events-auto flex items-start gap-3 rounded-[7px] border-b-2 ${config.borderBottom} bg-white-100 px-4 py-3.5 text-xs sm:text-sm text-black-90 transition-all`}
            >
              <Icon size={18} className={`${config.color} mt-0.5 shrink-0`} aria-label={config.label} />
              <p className="min-w-0 flex-1 break-words font-medium">{item.message}</p>
              <button
                type="button"
                onClick={() => onDismiss(item.id)}
                className="cursor-pointer rounded-[7px] p-1 text-black-90/60 transition-colors hover:bg-gray shrink-0"
                title="Dismiss notification"
                aria-label="Dismiss notification"
              >
                <X size={15} />
              </button>
            </div>
            );
    })}
          </div>
        );

        export default ToastViewport;
