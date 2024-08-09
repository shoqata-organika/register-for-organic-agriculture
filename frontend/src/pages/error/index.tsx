import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen bg-primary flex items-center justify-center">
      <div>
        <div className="flex items-center gap-3 text-white">
          <AlertTriangle className="h-8 w-8" />
          <h2 className="text-3xl font-bold">{t('Oops, Page not found !')}</h2>
        </div>

        <div className="mt-4">
          <Button
            className="bg-white hover:bg-gray-300 text-black block mx-auto"
            onClick={() => {
              navigate('/');
            }}
          >
            {t('Go Back')}
          </Button>
        </div>
      </div>
    </div>
  );
}
