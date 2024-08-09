import { useTranslation } from 'react-i18next';

export default function Policy() {
  const { t } = useTranslation();

  return (
    <div className="pb-20 pt-10">
      <div className="w-full md:w-6/12 mx-auto">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm mb-8">
          <img
            className="mx-auto h-20 w-auto"
            src={`${process.env.PUBLIC_URL}/logo.png`}
            alt="Your Company"
          />
        </div>

        <h1 className="text-4xl text-center mb-10">{t('Privacy Policy')}</h1>

        <div className="bg-gray-200 rounded-md mb-8" style={{ height: 1 }} />

        <div className="mb-8">
          <h3 className="text-xl font-bold">1. {t('Preface')}</h3>
          <p className="mt-1 pl-4">{t('policy 1')}</p>
        </div>

        <div className="bg-gray-200 rounded-md mb-8" style={{ height: 1 }} />

        <div className="mb-8">
          <h3 className="text-xl font-bold">2. {t('Who is Responsible')}</h3>
          <p className="mt-1 pl-4">{t('policy 2')}</p>
        </div>

        <div className="bg-gray-200 rounded-md mb-8" style={{ height: 1 }} />

        <div className="mb-8">
          <h3 className="text-xl font-bold">
            3. {t('Types of Data Collected')}
          </h3>
          <ul className="mt-1 pl-3">
            <li className="policy-list-item">{t('policy 3.1')}</li>
            <li className="policy-list-item">{t('policy 3.2')}</li>
            <li className="policy-list-item">{t('policy 3.3')}</li>
            <li className="policy-list-item">{t('policy 3.4')}</li>
          </ul>
        </div>

        <div className="bg-gray-200 rounded-md mb-8" style={{ height: 1 }} />

        <div className="mb-8">
          <h3 className="text-xl font-bold">
            4. {t('Purpose of Data Processing')}
          </h3>
          <p className="mt-1 pl-4">
            {t('policy 4.1')}: <br />
            <ul>
              <li className="policy-list-item pl-3">{t('policy 4.2')}</li>
              <li className="policy-list-item pl-3">{t('policy 4.3')}</li>
              <li className="policy-list-item pl-3">{t('policy 4.4')}</li>
              <li className="policy-list-item pl-3">{t('policy 4.5')}</li>
              <li className="policy-list-item pl-3">{t('policy 4.6')}</li>
            </ul>
          </p>
        </div>

        <div className="bg-gray-200 rounded-md mb-8" style={{ height: 1 }} />

        <div className="mb-8">
          <h3 className="text-xl font-bold">
            5. {t('Rights of Data Subjects')}
          </h3>
          <p className="mt-1 pl-4">{t('policy 5')}</p>
        </div>

        <div className="bg-gray-200 rounded-md mb-8" style={{ height: 1 }} />

        <div className="mb-8">
          <h3 className="text-xl font-bold">6. {t('Data Security')}</h3>
          <p className="mt-1 pl-4">{t('policy 6')}</p>
        </div>

        <div className="bg-gray-200 rounded-md mb-8" style={{ height: 1 }} />

        <div className="mb-8">
          <h3 className="text-xl font-bold">7. {t('Data Transfer')}</h3>
          <p className="mt-1 pl-4">{t('policy 7')}</p>
        </div>

        <div className="bg-gray-200 rounded-md mb-8" style={{ height: 1 }} />

        <div className="mb-8">
          <h3 className="text-xl font-bold">
            8. {t('Interaction with Third Parties')}
          </h3>
          <p className="mt-1 pl-4">{t('policy 8')}</p>
        </div>

        <div className="bg-gray-200 rounded-md mb-8" style={{ height: 1 }} />

        <div className="mb-8">
          <h3 className="text-xl font-bold">9. {t('Data Retention Period')}</h3>
          <p className="mt-1 pl-4">{t('policy 9')}</p>
        </div>

        <div className="bg-gray-200 rounded-md mb-8" style={{ height: 1 }} />

        <div className="mb-8">
          <h3 className="text-xl font-bold">
            10. {t('Changes to the Privacy Policy')}
          </h3>
          <p className="mt-1 pl-4">{t('policy 10')}</p>
        </div>

        <div className="bg-gray-200 rounded-md mb-8" style={{ height: 1 }} />

        <div className="mb-8">
          <h3 className="text-xl font-bold">11. {t('Contact')}</h3>
          <p className="mt-1 pl-4">
            {t('policy 11')}
            <span className="underline text-blue-600 pl-1 font-bold">
              info@organika-ks.com.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
