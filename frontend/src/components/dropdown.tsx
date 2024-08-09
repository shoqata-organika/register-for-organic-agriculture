'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
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
import { useTranslation } from 'react-i18next';

interface DropdownProps {
  items: Array<{ value: string; label?: string; id?: string }>;
  resourceValues?: Array<{ name: string; id?: string }>;
  searchPlaceholder?: string;
  emptyResultsLabel?: string;
  selectItemLabel?: string;
  defaultValue?: number;
  disabled?: boolean;
  resourceInput?: boolean;
  value?: string;
  onChange: (value: any) => void;
}

export function Dropdown(props: DropdownProps) {
  const [open, setOpen] = React.useState(false);

  const { t } = useTranslation();

  const {
    items,
    emptyResultsLabel,
    value,
    onChange,
    disabled,
    resourceInput,
    resourceValues,
  } = props;

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled}
          aria-expanded={open}
          className="w-full justify-between"
        >
          {resourceInput ? (
            <span className="truncate">
              {value && value !== '0'
                ? resourceValues?.map((item) => item.name).join(', ')
                : t('Select an item...')}
            </span>
          ) : (
            <span className="truncate">
              {value && value !== '0'
                ? items.find((item) => item.value === value)?.label
                : t('Select an item...')}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 z-[9999]">
        <Command>
          <CommandInput placeholder={t('Search items...')} />
          <CommandList>
            <CommandEmpty>
              {emptyResultsLabel || 'No results found'}
            </CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? '' : item.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === item.value ? 'opacity-100' : 'opacity-0',
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
  );
}
