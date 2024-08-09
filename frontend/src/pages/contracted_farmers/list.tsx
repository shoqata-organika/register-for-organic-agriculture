import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  parcelCodes: Array<{ code: string }>;
  onRemove: (arg: string) => void;
}

function LandParcelsList({ parcelCodes, onRemove }: Props) {
  const { t } = useTranslation();

  return (
    <Fragment>
      <div className="relative mt-8">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-start">
          <span className="bg-white pr-3 text-base font-semibold leading-6 text-gray-900">
            {t('List of Land Parcels')}
          </span>
        </div>
      </div>
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    {t('Code')}
                  </th>
                  <th
                    scope="col"
                    className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-0"
                  >
                    <span className="sr-only">Remove</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {(parcelCodes || []).map((parcel) => (
                  <tr key={parcel.code}>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {parcel.code}
                    </td>
                    <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();

                          onRemove(parcel.code);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        {t('Remove')}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default LandParcelsList;
