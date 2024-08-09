import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import DatePicker from 'react-datepicker';
import { formatDate } from '@/utils/formatDate';
import { useTranslation } from 'react-i18next';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  date?: Date;
  onChange: (val: Date) => void;
  disabled?: boolean;
  initialYear?: number;
}

export function YearPicker({ date, disabled, onChange }: Props) {
  const { t } = useTranslation();
  const [format, setFormat] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  function handleTriggerPosition() {
    if (popupRef.current && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popupRect = popupRef.current.getBoundingClientRect();

      if (triggerRect.bottom + popupRect.height >= window.innerHeight) {
        if (popupRef.current.classList.contains('show_on_top')) return;

        popupRef.current.classList.add('show_on_top', 'right-7');
      }
    }
  }

  const handleClick = (event: any) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleTriggerPosition();
      document.addEventListener('click', handleClick, true);
    }

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [isOpen]);

  const disabledClass = disabled ? 'disabled-datepicker' : '';
  const buttonText = format ? t('Show Years Only') : t('Show Years & Months');

  return (
    <div className="relative w-full">
      <Button
        type="button"
        ref={triggerRef}
        className={`inline-flex justify-start text-black cursor-pointer whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full ${disabledClass}`}
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        {date ? formatDate(date) : t('Pick a date')}
      </Button>
      {isOpen && (
        <div
          ref={popupRef}
          className="border border-input mt-2 rounded-md absolute w-full bg-white px-2 py-3 shadow-xl z-[999999]"
        >
          <DatePicker
            selected={date}
            onChange={(date: Date) => {
              onChange(date);
              setIsOpen(false);
            }}
            showYearPicker={format === false}
            showMonthYearPicker={format}
            inline
            dateFormat={format ? 'MM/yyyy' : 'yyyy'}
          />
          <div className="w-full mt-2">
            <Button
              className="w-full"
              type="button"
              onClick={() => setFormat((prev) => !prev)}
            >
              {buttonText}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function FixedYearPicker({
  date,
  disabled,
  onChange,
  initialYear,
}: Props) {
  const { t } = useTranslation();
  const [format, setFormat] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [triggerPos, setTriggerPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const popupRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  function handleTriggerPosition() {
    if (popupRef.current && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popupRect = popupRef.current.getBoundingClientRect();

      if (triggerRect.bottom + popupRect.height >= window.innerHeight) {
        setTriggerPos({
          top:
            triggerRect.top -
            popupRect.height -
            triggerRect.height / 2 +
            window.scrollY,
          left: triggerRect.left - popupRect.width / 2 + window.scrollX,
        });
      } else {
        setTriggerPos({
          top: triggerRect.top + triggerRect.height + window.scrollY,
          left: triggerRect.left + window.scrollX,
        });
      }
    }
  }

  const handleClick = (event: any) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  function handleScroll() {
    if (triggerRef.current && popupRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popupRect = popupRef.current.getBoundingClientRect();

      setTriggerPos((prev) => ({
        ...prev,
        top:
          triggerRect.top -
          popupRect.height -
          triggerRect.height / 2 +
          window.scrollY,
      }));
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleTriggerPosition);
    sidebarRef.current = document.querySelector('.slideover-container');

    if (sidebarRef.current && isOpen) {
      sidebarRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('resize', handleTriggerPosition);

      if (sidebarRef.current) {
        sidebarRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [triggerPos]);

  useEffect(() => {
    if (isOpen) {
      handleTriggerPosition();
      document.addEventListener('click', handleClick, true);
    }

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [isOpen]);

  const disabledClass = disabled ? 'disabled-datepicker' : '';
  const buttonText = format ? t('Show Years Only') : t('Show Years & Months');
  let currentDate;

  if (date) {
    currentDate = date;
  } else if (initialYear) {
    currentDate = new Date(initialYear, 0);
  }

  return (
    <div className="relative w-full">
      <Button
        type="button"
        ref={triggerRef}
        className={`inline-flex justify-start text-black cursor-pointer whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full ${disabledClass}`}
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        {date ? formatDate(date) : t('Pick a date')}
      </Button>
      {isOpen && (
        <div
          ref={popupRef}
          className="border border-input mt-2 rounded-md fixed w-64 bg-white px-2 py-3 shadow-xl z-[999999]"
          style={triggerPos}
        >
          <DatePicker
            selected={currentDate}
            onChange={(date: Date) => {
              onChange(date);
              setIsOpen(false);
            }}
            showYearPicker={format === false}
            showMonthYearPicker={format}
            inline
            dateFormat={format ? 'MM/yyyy' : 'yyyy'}
          />
          <div className="w-full mt-2">
            <Button
              className="w-full"
              type="button"
              onClick={() => setFormat((prev) => !prev)}
            >
              {buttonText}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
