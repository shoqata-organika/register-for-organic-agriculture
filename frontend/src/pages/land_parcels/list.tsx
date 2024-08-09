import { LandParcelCrop } from '@/api/types/land_parcel';
import { Code } from '@/api/types/code_category';
import { ta } from '@/utils/localized_attribute';
import { formatDate } from '@/utils/formatDate';
import { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatArea } from '@/utils/formatArea';

interface Props {
  parcelCrops: Array<LandParcelCrop>;
  crops: Array<Code>;
  onEdit: (collectionActivity: LandParcelCrop) => void;
}

function ParcelCropList({ parcelCrops, crops, onEdit }: Props) {
  const { t, i18n } = useTranslation();

  const indexedCrops = useMemo(
    () =>
      crops
        .map((crop) => ({ [crop.id]: crop }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
    [crops],
  );

  const getDisplayName = (entity: any) => {
    return entity ? ta(entity, 'name', i18n.language) : '';
  };

  return (
    <Fragment>
      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-start">
          <span className="bg-white pr-3 text-base font-semibold leading-6 text-gray-900">
            {t('List of crops')}
          </span>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    {t('Crop')}
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    {t('Area')}
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    {t('Planting Date')}
                  </th>
                  <th
                    scope="col"
                    className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-0"
                  >
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {(parcelCrops || []).map((crop) => (
                  <tr key={crop.id || crop._tempId}>
                    <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                      {getDisplayName(indexedCrops[crop.crop_id])}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {formatArea(crop.area)}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {formatDate(new Date(crop.planting_date))}
                    </td>
                    <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onEdit(crop);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
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

export default ParcelCropList;
