import { Input } from '@/components/ui/input';
import { cn } from '@/utils';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  value: number;
  onChange: (value: number) => void;
}

const TimeSpent = ({ value, onChange }: Props) => {
  const [hours, setHours] = useState(Math.floor(value / 60));
  const [minutes, setMinutes] = useState(value % 60);

  useEffect(() => {
    onChange(hours * 60 + minutes);
  }, [hours, minutes]);

  const { t } = useTranslation();

  return (
    <div className={cn('flex items-center gap-x-1')}>
      <Input
        type="number"
        value={hours}
        onChange={(evt: ChangeEvent<HTMLInputElement>) =>
          setHours(+evt.target.value)
        }
      />
      <span className={cn('font-bold text-xs')}>{t('Hours')}</span>

      <Input
        type="number"
        value={minutes}
        onChange={(evt: ChangeEvent<HTMLInputElement>) =>
          setMinutes(+evt.target.value)
        }
      />
      <span className={cn('font-bold text-xs')}>{t('Minutes')}</span>
    </div>
  );
};

export default TimeSpent;
