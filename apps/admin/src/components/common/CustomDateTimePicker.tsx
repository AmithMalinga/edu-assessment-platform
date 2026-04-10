import React, { useRef } from 'react';
import { Calendar, Clock, ChevronDown } from 'lucide-react';

interface CustomDateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  icon?: React.ReactNode;
  min?: string;
}

const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
  value,
  onChange,
  className = '',
  icon,
  min
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return 'Select date & time...';
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return dateStr;
    }
  };

  const handleContainerClick = () => {
    if (inputRef.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        try {
          inputRef.current.showPicker();
        } catch (e) {
          inputRef.current.focus();
        }
      } else {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleContainerClick}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm transition-all hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.98] group"
      >
        <div className="flex items-center gap-3">
          <div className="text-slate-500 group-hover:text-indigo-400 transition-colors">
            {icon || <Calendar size={18} />}
          </div>
          <span className={value ? 'text-white font-medium' : 'text-slate-500'}>
            {formatDisplayDate(value)}
          </span>
        </div>
        <div className="flex items-center gap-2">
            <div className="h-4 w-[1px] bg-white/5 mx-1" />
            <Clock size={14} className="text-slate-600" />
        </div>
      </button>

      {/* Hidden native picker that is triggered by the button click */}
      <input
        ref={inputRef}
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
        style={{ clipPath: 'inset(50%)' }} // Keep it "present" for showPicker but invisible
      />
    </div>
  );
};

export default CustomDateTimePicker;
