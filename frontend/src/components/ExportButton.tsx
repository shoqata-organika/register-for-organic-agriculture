import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { Button } from './ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

interface Props {
  onClick: () => void;
  title: string;
}

export default function ExportButton({ title, onClick }: Props) {
  const [disabled, setDisabled] = useState(false);

  const handleOnClick = async () => {
    setDisabled(true);
    await onClick();
    setDisabled(false);
  };

  return (
    <Button
      className="border border-opacity-60 border-gray-700 bg-transparent hover:bg-gray-700 hover:text-white text-gray-700 text-base"
      disabled={disabled}
      onClick={handleOnClick}
    >
      <FontAwesomeIcon icon={faFileExcel} className="-ml-0.5 mr-1 h-5 w-5" />
      {title}
    </Button>
  );
}
