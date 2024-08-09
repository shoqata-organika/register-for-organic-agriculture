import React from "react";
import {
  Command,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import { type Tag as TagType } from "./tag-input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ChevronsUpDown, X } from "lucide-react";
import { Button } from "./button";

type AutocompleteProps = {
  tags: TagType[];
  setTags: React.Dispatch<React.SetStateAction<TagType[]>>;
  autocompleteOptions: TagType[];
  maxTags?: number;
  onTagAdd?: (tag: string) => void;
  allowDuplicates: boolean;
  children: React.ReactNode;
  onRemove: () => void;
};

export const Autocomplete: React.FC<AutocompleteProps> = ({
  tags,
  setTags,
  autocompleteOptions,
  maxTags,
  onTagAdd,
  allowDuplicates,
  onRemove,
  children,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate">
            {tags.length > 0 ? tags.map((tag) => tag.text).join(", ") : "Select an item..."}
          </span>
          <span className="flex">
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            {tags.length > 0 && <X className="ml-4 h-4 w-4 shrink-0 text-red-500 opacity-50" onClick={(evt) => {
              onRemove();
              evt.stopPropagation();
            }} />}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 z-[9999]">
        <Command className="border">
          {children}
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {autocompleteOptions.map((option) => (
                <CommandItem key={option.id}>
                  <div
                    className="w-full"
                    onClick={() => {
                      if (maxTags && tags.length >= maxTags) return;
                      if (
                        !allowDuplicates &&
                        tags.some((tag) => tag.text === option.text)
                      )
                        return;
                      setTags([...tags, option]);
                      onTagAdd?.(option.text);
                    }}
                  >
                    {option.text}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
