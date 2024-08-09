import { Code } from '@/api/types/code_category';
import { ProcessingActivityEntry } from '@/api/types/processing_activity';
import { ta } from '@/utils/localized_attribute';
import { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  entries: Array<ProcessingActivityEntry>;
  crops: Array<Code>;
  onEdit: (entry: ProcessingActivityEntry) => void;
}
function ProcessingActivityEntryList({ entries, crops, onEdit }: Props) {
  const { t, i18n } = useTranslation();

  const indexedCrops = useMemo(
    () =>
      crops
        .map((crop) => ({ [crop.id]: crop }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
    [crops],
  );

  const indexedPoC = useMemo(
    () =>
      crops
        .map((crop) => crop.subCodes)
        .flat()
        .filter((crop) => crop !== undefined)
        .map((crop) => ({ [crop!.id]: crop }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
    [crops],
  );

  const getDisplayName = (entity: any) => {
    return entity ? ta(entity, 'name', i18n.language) : '';
  };

  return (
    <Fragment>
      <div className="relative">
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
                    {t('Part of crop')}
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    {t('Crop state')}
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    {t('Crop status')}
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    {t('Gross quantity')}
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    {t('Net quantity')}
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
                {(entries || []).map((entry) => (
                  <tr key={entry.id || entry._tempId}>
                    <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                      {getDisplayName(indexedCrops[entry.crop_id as any])}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {getDisplayName(indexedPoC[entry.part_of_crop_id as any])}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {t(entry.cropState)}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {t(entry.cropStatus)}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {Number(entry.gross_quantity)}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                      {Number(entry.net_quantity)}
                    </td>
                    <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();

                          onEdit(entry);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        {t('Edit')}
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

export default ProcessingActivityEntryList;
