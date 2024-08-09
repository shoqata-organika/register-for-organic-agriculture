import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { v4 as uuid4 } from 'uuid';
import { Tag, TagInput } from '@/components/ui/tag-input';
import { PlusIcon } from 'lucide-react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Resource {
  id: string;
  name: string;
}

interface Props {
  onChange: (resources: Resource[]) => void;
  isTextInput?: boolean;
  form?: UseFormReturn;
  type?: string;
  setTextInput?: (arg: boolean) => void;
  maxTags?: number;
  options?: Resource[];
  selectedOptions?: Resource[];
}

function ResourceInput({ onChange, maxTags, selectedOptions, options }: Props) {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [currentText, setCurrentText] = useState<string>('');

  selectedOptions =
    selectedOptions && selectedOptions[0] ? selectedOptions : [];

  return isAdding ? (
    <div className="flex items-center w-full">
      <Input
        type="text"
        value={currentText}
        onChange={(evt) => setCurrentText(evt.target.value)}
      />
      <div className="ml-2">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => {
              setIsAdding(false);

              if (currentText.trim() === '') return;

              onChange(
                maxTags && maxTags == 1
                  ? [{ id: uuid4(), name: currentText }]
                  : [
                      ...(selectedOptions || []),
                      { id: uuid4(), name: currentText },
                    ],
              );
              setCurrentText('');
            }}
            className="rounded-full bg-green-600 p-1 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <CheckIcon className="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => {
              setIsAdding(false);
              setCurrentText('');
            }}
            className="ml-2 rounded-full bg-red-600 p-1 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center  w-full">
      <TagInput
        tags={(selectedOptions || [])
          .filter((option) => option !== null && option !== undefined)
          .map((option) => ({
            id: option.id,
            text: option.name,
          }))}
        maxTags={maxTags}
        enableAutocomplete={true}
        autocompleteOptions={(options || []).map((option) => ({
          id: option.id,
          text: option.name,
        }))}
        setTags={(newTags) => {
          onChange(
            (newTags as [Tag, ...Tag[]]).map((tag) => {
              return {
                name: tag.text,
                id: tag.id,
              };
            }),
          );
        }}
      />
      <div className="ml-2">
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="rounded-full bg-green-600 p-1 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <PlusIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default ResourceInput;
