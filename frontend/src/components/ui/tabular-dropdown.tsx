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
    NakedCommandItem,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import cx from '@/utils/cx';
// import { ScrollArea } from './ui/scroll-area';

type Column = {
    displayName: string;
    key: string;
};

// Use a generic type that extends Column to ensure keys are from the columns
type DropdownItem<T extends Column> = {
    [P in T['key']]?: string;
} & {
    id: string;
    displayName: string;
}

interface DropdownProps<T extends Column> {
    items: DropdownItem<T>[];
    columns: T[];
    searchPlaceholder?: string;
    emptyResultsLabel?: string;
    selectItemLabel?: string;
    value?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}
export function TabularDropdown<T extends Column>(props: DropdownProps<T>) {
    const [open, setOpen] = React.useState(false);

    const {
        items,
        searchPlaceholder,
        emptyResultsLabel,
        selectItemLabel,
        value,
        onChange,
    } = props;

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={props.disabled}
                >
                    <span className="truncate">
                        {value
                            ? items.find((item) => item.id === value)?.displayName
                            : selectItemLabel || 'Select an item...'}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder={searchPlaceholder || 'Search items...'} />
                    <CommandList>
                        <div className="max-w-2xl bg-white py-4">

                            <div className="grid gap-4 px-6 py-3.5 bg-gray-200 text-left text-sm font-semibold text-gray-900" style={{ gridTemplateColumns: `repeat(${props.columns.length}, minmax(0, 1fr))` }}>
                                {props.columns.map((column) => <div>{column.displayName}</div>)}
                            </div>
                            <div className="divide-y divide-gray-200">
                                <CommandEmpty>
                                    <div className="flex">
                                        <div className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{emptyResultsLabel || "No results found"}</div>
                                    </div>
                                </CommandEmpty>
                                <CommandGroup>
                                    {items.map((item) => (
                                        <NakedCommandItem
                                            key={item.id}
                                        >
                                            <div
                                                className={cx(
                                                    "grid", "gap-4", "px-6", "py-4", "text-sm", "hover:bg-gray-100", "hover:text-gray-900", "cursor-pointer",
                                                    value === item.id ? "bg-gray-100" : undefined,
                                                    value === item.id ? "text-gray-900" : undefined,
                                                )}
                                                style={{ gridTemplateColumns: `repeat(${props.columns.length}, minmax(0, 1fr))` }}
                                                onClick={() => {
                                                    onChange(item.id);
                                                    setOpen(false);
                                                }}
                                            >
                                                {props.columns.map((column) => (
                                                    <div className="text-gray-900">{item[column.key as keyof typeof item]}</div>
                                                ))}
                                            </div>

                                        </NakedCommandItem>
                                    ))}

                                </CommandGroup>
                            </div>
                        </div>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
