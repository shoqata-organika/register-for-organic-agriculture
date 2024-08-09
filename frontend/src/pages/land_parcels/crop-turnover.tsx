import { Code } from '@/api/types/code_category';
import { LandParcelCrop, SubParcel } from '@/api/types/land_parcel';
import { FixedYearPicker } from '@/components/yearpicker';
import { Dropdown } from '@/components/dropdown';
import classNames from '@/utils/classNames';
import { formatArea } from '@/utils/formatArea';
import { ta } from '@/utils/localized_attribute';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  parcelCrops: LandParcelCrop[];
  subParcels: SubParcel[];
  crops: Code[];
  onChange: (parcelCrops: LandParcelCrop[]) => void;
}
function CropTurnover({ subParcels, crops, parcelCrops, onChange }: Props) {
  const { t, i18n } = useTranslation();

  const years = [2023, 2024, 2025, 2026, 2027];
  const [currentYear, setCurrentYear] = useState(years[1]);

  const handleChange = (
    parcelCrop: LandParcelCrop,
    newValues: Partial<LandParcelCrop>,
  ) => {
    const newParcelCrops = parcelCrops.map((pc) => {
      if (
        (parcelCrop.id !== undefined && pc.id === parcelCrop.id) ||
        (pc._tempId && pc._tempId === parcelCrop._tempId)
      ) {
        return { ...pc, ...newValues };
      }

      return pc;
    });

    onChange(newParcelCrops);
  };

  const handleAdd = () => {
    onChange([
      ...parcelCrops,
      {
        order: 1,
        _tempId: Math.random(),
        year: currentYear,
      } as LandParcelCrop,
    ]);
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            {t('Crop Turnover')}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            {t('CROP_TURN_OVER_MESSAGE')}
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={handleAdd}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {t('Add Crop')}
          </button>
        </div>
      </div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {years.map((year) => (
            <a
              key={year}
              onClick={() => setCurrentYear(year)}
              className={classNames(
                currentYear === year
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium cursor-pointer',
              )}
              aria-current={currentYear === year ? 'page' : undefined}
            >
              {year}
            </a>
          ))}
        </nav>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    {t('Crop Order')}
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    {t('Crop')}
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    {t('Sub Parcel')}
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
                    <span className="sr-only">{t('Delete')}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {parcelCrops
                  .filter(
                    (crop) =>
                      crop.year === currentYear && crop._delete !== true,
                  )
                  .map((parcelCrop) => (
                    <tr key={parcelCrop.id || parcelCrop._tempId}>
                      <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
                        <Dropdown
                          items={[1, 2].map((order) => ({
                            value: order.toString(),
                            label: `${t('Crop')} ${order}`,
                          }))}
                          value={parcelCrop.order.toString()}
                          onChange={(value) =>
                            handleChange(parcelCrop, {
                              order: +value,
                            })
                          }
                        />
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
                        <Dropdown
                          items={(crops || []).map((crop) => ({
                            value: crop.id.toString(),
                            label: ta(crop, 'name', i18n.language),
                          }))}
                          value={parcelCrop.crop_id?.toString()}
                          onChange={(value) =>
                            handleChange(parcelCrop, {
                              crop_id: value,
                            })
                          }
                        />
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
                        <Dropdown
                          items={subParcels.map((subParcel) => ({
                            value: subParcel.id,
                            label: `${subParcel.code} - ${formatArea(subParcel.area)}`,
                          }))}
                          value={parcelCrop.sub_parcel_id}
                          onChange={(value) =>
                            handleChange(parcelCrop, {
                              sub_parcel_id: value,
                            })
                          }
                        />
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
                        <FixedYearPicker
                          initialYear={currentYear}
                          date={parcelCrop.planting_date}
                          onChange={(value) =>
                            handleChange(parcelCrop, {
                              planting_date: value as Date,
                            })
                          }
                        />
                      </td>
                      <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <a
                          href="#"
                          onClick={() =>
                            handleChange(parcelCrop, { _delete: true })
                          }
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          {t('Delete')}
                        </a>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CropTurnover;
