import { Button } from './ui/button';
import { PlusIcon } from '@heroicons/react/20/solid';

interface Props {
  onClick: () => void;
  title: string;
}

export default function AddButton({ title, onClick }: Props) {
  return (
    <Button
      className="border border-opacity-60 border-green-600 bg-transparent hover:bg-green-700 hover:text-white text-green-600 text-base shadow-md"
      onClick={onClick}
    >
      <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
      {title}
    </Button>
  );
}
