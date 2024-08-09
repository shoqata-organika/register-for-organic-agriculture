'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/utils';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DropdownProps {
  label?: string;
  items: Array<{ value: number | string; label: string }>;
  value?: string;
  onChange: (value?: string) => void;
  className?: string;
}

export function Filter(props: DropdownProps) {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();

  const { items, label, value, onChange, className } = props;

  return (
    <div className={className}>
      {label && <p className="text-sm font-semibold">{label}:</p>}
      <div className="flex gap-1 items-center">
        <Popover open={open} onOpenChange={setOpen} modal={true}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              <span className="truncate">
                {value && value !== '0'
                  ? items.find((item) => {
                      if (Number(item.value)) {
                        return item.value === +value;
                      } else {
                        return item.value === value;
                      }
                    })?.label
                  : t('Select...')}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 z-[9999]">
            <Command>
              <CommandInput placeholder={label} />
              <CommandList>
                <CommandGroup>
                  {items.map((item) => (
                    <CommandItem
                      key={item.label}
                      value={item.value.toString()}
                      onSelect={(currentValue) => {
                        onChange(
                          currentValue === value?.toString()
                            ? ''
                            : item.value.toString(),
                        );
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === item.value.toString()
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {value && (
          <Button
            type="button"
            className="bg-transparent hover:bg-transparent p-0"
            onClick={() => onChange()}
          >
            <XMarkIcon
              className="h-5 w-5 text-red-500 hover:text-red-700"
              aria-hidden="true"
            />
          </Button>
        )}
      </div>
    </div>
  );
}
