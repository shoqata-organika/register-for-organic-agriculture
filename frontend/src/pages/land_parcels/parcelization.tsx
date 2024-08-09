import { useEffect } from 'react';
import { SubParcel } from '@/api/types/land_parcel';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { v4 as uuid4 } from 'uuid';

interface Props {
  subParcels: SubParcel[];
  onChange: (subParcels: SubParcel[]) => void;
}
function Parcelization({ subParcels, onChange }: Props) {
  const { t } = useTranslation();

  const handleAdd = () => {
    const code = subParcels.length + 1;
    const newSubParcel = { id: uuid4(), code: code.toString(), area: 0 };
    onChange([...subParcels, newSubParcel]);
  };

  const handleChange = (
    subParcel: SubParcel,
    newValues: Partial<SubParcel>,
  ) => {
    const newSubParcels = subParcels.map((sp) => {
      if (sp.id === subParcel.id) {
        return { ...sp, ...newValues };
      }

      return sp;
    });

    onChange(newSubParcels);
  };

  useEffect(() => {
    onChange(
      subParcels.map((sp, index) => ({ ...sp, code: (index + 1).toString() })),
    );
  }, [subParcels.length]);

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            {t('Sub Parcels')}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            {t('Sub parcels are the smaller parcels within the main parcel')}
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={handleAdd}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {t('Add Sub Parcel')}
          </button>
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
                    className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    {t('Area')}
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
                {subParcels
                  .filter((sp) => !sp._delete)
                  .map((subParcel) => (
                    <tr key={subParcel.id}>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                        {subParcel.code}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
                        <Input
                          type="number"
                          value={subParcel.area}
                          onChange={(evt) => {
                            handleChange(subParcel, {
                              area: +evt.target.value,
                            });
                          }}
                        />
                      </td>
                      <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <a
                          href="#"
                          onClick={() =>
                            handleChange(subParcel, { _delete: true })
                          }
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          {t('Delete')}
                          <span className="sr-only">, {subParcel.id}</span>
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

export default Parcelization;
