// TimeDropdown.tsx
import React, { useState, useRef, useEffect } from 'react';
import {  FiChevronDown } from 'react-icons/fi';

interface TimeDropdownProps {
  selectedTime: string | null;
  onChange: (time: string) => void;
}

export const TimeDropdown: React.FC<TimeDropdownProps> = ({
  selectedTime,
  onChange,
}) => {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close when clicking outside
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShow(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // static list of slots
  const slots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '11:30 AM',
    '01:00 PM', '02:00 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '06:00 PM', '06:30 PM', '07:30 PM',
    '08:00 PM', '09:00 PM',
  ];

  return (
    <div className="relative inline-block w-full" ref={ref}>
      {/* trigger */}
      <div
        className="flex items-center justify-between py-2  rounded-lg cursor-pointer"
        onClick={() => setShow((s) => !s)}
      >
        <div className="flex items-center space-x-2">
          {/* <FiClock className="text-gray-500" /> */}
          <span className="text-sm text-gray-700">
            {selectedTime ?? 'Select time'}
          </span>
        </div>
        <FiChevronDown className="text-gray-500" />
      </div>


      {/* dropdown */}
      {show && (
        <div className="absolute z-50 mt-2 bg-white w-96 rounded-lg shadow-lg p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 ">
            {slots.map((t) => (
              <button
                key={t}
                onClick={() => { onChange(t); setShow(false); }}
                className={`px-2 py-2 text-sm rounded-lg border self-stretch 
                  ${
                    t === selectedTime
                      ? 'bg-teal-700 border-teal-700 text-white'
                      : 'border-teal-700 text-teal-700 hover:bg-teal-50'
                  }
                `}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
