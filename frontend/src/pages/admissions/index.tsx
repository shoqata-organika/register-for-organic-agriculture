import { useEffect, useState, useMemo } from 'react';
import { withActionColumns } from '../../components/withActionColumns';
import DataTable from '../../components/TableComponent';
import { Zone } from '@/api/types/zone';
import { HarvesterView } from '@/api/types/harvester';
import { getHarvesters, getZones } from '@/api/user';
import { useTranslation } from 'react-i18next';
import { filterPipeline } from '@/utils/filterPipeline';
import { Filter } from '@/components/filter';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/datepicker';
import { unique } from '@/utils';
import AddButton from '@/components/AddButton';
import useCustomState, { State } from '@/hooks/useCustomState';
import { SlidersHorizontal } from 'lucide-react';
import { ta } from '@/utils/localized_attribute';
import ExportButton from '@/components/ExportButton';
import AdmissionForm from './admission-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { getMemberCrops } from '@/api/members';
import {
  Admission,
  AdmissionEntry,
  AdmissionEntryView,
  AdmissionType,
} from '@/api/types/admission';
import { getAdmissions, exportAdmissions } from '@/api/admission';
import { LandParcelView } from '@/api/types/land_parcel';
import { ContractedFarmerView } from '@/api/types/contracted_farmers';
import { Code } from '@/api/types/code_category';
import { getAllContractedFarmers } from '@/api/contracted_farmers';
import { CropType } from '@/api/types/crop';
import columns from './columns';

interface LocalState {
  crops: Array<Code>;
  zones: Array<Zone>;
  landParcels: Array<LandParcelView>;
  harvesters: Array<HarvesterView>;
  contractedFarmers: Array<ContractedFarmerView>;
  entries: Array<AdmissionEntryView>;
  currentEntry: AdmissionEntryView | null;
}

interface Props {
  type: AdmissionType;
}

const getAdmissionEntries = (admission: Admission): AdmissionEntryView[] => {
  return ((admission.entries || []) as AdmissionEntryView[]).map((entry) => {
    return {
      ...entry,
      admission_no: admission.admission_no,
      zone: admission.zone,
      landParcel: admission.landParcel,
      harvester: admission.harvester,
      contractedFarmer: admission.contractedFarmer,
      date: admission.date,
    } as AdmissionEntryView;
  });
};

const state = new State<Admission, LocalState>({
  crops: [],
  zones: [],
  landParcels: [],
  harvesters: [],
  contractedFarmers: [],
  entries: [],
  currentEntry: null,
}).getState();

type Filters = {
  zone?: string;
  harvester?: string;
  contracted_farmer?: string;
  from_date?: Date;
  land_parcel?: string;
  to_date?: Date;
  crop?: string;
};

function filterBy(type: keyof Filters, val?: any, locale?: string | null) {
  return (array: AdmissionEntryView[]): AdmissionEntryView[] => {
    if (!array.length) return [];

    if (!val) return array;

    switch (type) {
      case 'zone': {
        return array.filter((item) => {
          if (!item.zone) return item;

          return item.zone.id === +val;
        });
      }

      case 'from_date': {
        const filterDate = new Date(val).getTime();

        return array.filter((item) => {
          return new Date(item.date).getTime() >= filterDate;
        });
      }

      case 'to_date': {
        const filterDate = new Date(val).getTime();

        return array.filter((item) => {
          return new Date(item.date).getTime() <= filterDate;
        });
      }

      case 'crop': {
        if (!locale) {
          throw new Error(
            'Please specify the language when you try to filter threw items that might be tranlsated to other languages',
          );
        }

        return array.filter((item) => {
          return item.crop.id === +val;
        });
      }

      case 'land_parcel': {
        return array.filter((item) => {
          return item.landParcel!.id === +val;
        });
      }

      case 'harvester': {
        return array.filter((item) => {
          if (!item.harvester) return item;

          return item.harvester.id === +val;
        });
      }

      case 'contracted_farmer': {
        return array.filter((item) => {
          return item.contractedFarmer.id === +val;
        });
      }

      default:
        return array;
    }
  };
}

const filterState: Filters = {
  zone: undefined,
  harvester: undefined,
  from_date: undefined,
  to_date: undefined,
  crop: undefined,
};

function Admissions({ type }: Props) {
  const { state: admissions, dispatch, onClose } = useCustomState(state);
  const [filter, setFilter] = useState(filterState);
  const [showFilters, setShowFilter] = useState<boolean>(false);
  const { t, i18n } = useTranslation();
  const isCollectionPage = type === AdmissionType.COLLECTION;

  function handleEdit(itemId: number, entry: AdmissionEntryView): void {
    dispatch({
      type: 'UPDATE_STATE',
      payload: {
        item: admissions.list.find((it) => it.id === itemId),
        currentEntry: entry,
        overlay: true,
      },
    });
  }

  useEffect(() => {
    (async function () {
      const admissions = (await getAdmissions(type)).data;
      const memberCrops = await getMemberCrops(
        isCollectionPage ? CropType.CROPS : CropType.BMA_CROPS,
      );
      const zonesResponse = await getZones();
      const harvestersResponse = await getHarvesters();
      const contractedFarmersResponse = await getAllContractedFarmers();

      Promise.all([
        admissions,
        memberCrops,
        zonesResponse,
        harvestersResponse,
        contractedFarmersResponse,
      ])
        .then((response) => {
          const [collection, m_crops, zones, harvesters, contractedFarmers] =
            response;

          const entries = collection.map(getAdmissionEntries).flat();

          dispatch({
            type: 'UPDATE_STATE',
            payload: {
              list: collection,
              crops: m_crops.map((cp) => cp.crop),
              entries,
              zones,
              harvesters,
              contractedFarmers,
            },
          });
        })
        .catch((error: Error) => console.log(error));
    })();
  }, []);

  useEffect(() => {
    getAdmissions(type).then((data) => {
      const collection = data.data;
      const entries = collection.map(getAdmissionEntries).flat();
      dispatch({
        type: 'UPDATE_STATE',
        payload: { list: collection, entries },
      });
    });
  }, [admissions.rerender]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function deleteFn(admissionEntry: AdmissionEntry): Promise<void> {}

  const filteredList = filterPipeline(
    filterBy('from_date', filter.from_date),
    filterBy('to_date', filter.to_date),
    filterBy('zone', filter.zone),
    filterBy('contracted_farmer', filter.contracted_farmer),
    filterBy('land_parcel', filter.land_parcel),
    filterBy('harvester', filter.harvester),
    filterBy('crop', filter.crop, i18n.language),
  )(admissions.entries);

  const availableCrops = useMemo(() => {
    const listOfCropIds = admissions.entries.map((entry) => entry.crop_id);

    return unique(
      admissions?.crops
        ?.filter((crop) => {
          return listOfCropIds.includes(crop.id);
        })
        .map((crop) => ({
          value: crop.id,
          label: ta(crop, 'name', i18n.language),
        })) || [],
    );
  }, [admissions.entries]);

  const availableZones = useMemo(() => {
    if (!isCollectionPage) return [];

    return unique(
      admissions.entries
        ?.map((entry) => entry.zone)
        .filter((zone) => zone)
        .map((zone) => ({
          value: zone!.id as number,
          label: `${t('Code')} - ${zone!.code}`,
        })) || [],
    );
  }, [admissions.entries, type]);

  const availableParcels = useMemo(() => {
    if (isCollectionPage) return [];

    return unique(
      admissions.entries
        ?.map((entry) => entry.landParcel)
        .filter((parcel) => parcel)
        .map((parcel) => ({
          value: parcel!.id as number,
          label: `${t('Code')} - ${parcel!.code}`,
        })) || [],
    );
  }, [admissions.entries, type]);

  const availableHarvesters = useMemo(() => {
    if (!isCollectionPage) return [];

    const harvesters = admissions.entries.map((entry) => entry.harvester?.id);

    return unique(
      admissions.harvesters
        ?.filter((harvester) => harvesters.includes(harvester.id))
        .map((harvester) => ({
          value: harvester.id,
          label: `${harvester.code} - ${harvester.first_name}`,
        })),
    );
  }, [admissions.entries, type]);

  const availableFarmers = useMemo(() => {
    if (isCollectionPage) return [];

    const farmers = admissions.entries.map(
      (entry) => entry.contractedFarmer?.id,
    );

    return unique(
      admissions.contractedFarmers
        ?.filter((farmer) => farmers.includes(farmer.id))
        .map((farmer) => ({
          value: farmer.id,
          label: `${farmer.code} - ${farmer.name}`,
        })),
    );
  }, [admissions.entries, type]);

  return (
    <div className="collection_container">
      {admissions.overlay && (
        <AdmissionForm
          zones={admissions.zones}
          landParcels={admissions.landParcels}
          harvesters={admissions.harvesters}
          crops={admissions.crops}
          onClose={onClose}
          currentAdmission={admissions.item}
          currentEntry={admissions.currentEntry}
          contractedFarmers={admissions.contractedFarmers}
          type={type}
        />
      )}

      <div>
        <div className="flex justify-between">
          <AddButton
            title={t('New Item')}
            onClick={() =>
              dispatch({ type: 'UPDATE_OVERLAY', payload: { overlay: true } })
            }
          />

          <ExportButton
            onClick={() =>
              exportAdmissions(
                type,
                i18n.language,
                filteredList.map((item) => item.admission_id!),
              )
            }
            title={t('Download')}
          />
        </div>

        <Button
          className="flex mt-8 mb-4 bg-gray-800 items-center gap-4"
          onClick={() => setShowFilter((prev) => !prev)}
        >
          <span className="text-lg">{t('Filter Data')}</span>
          <SlidersHorizontal className="h-4" />
        </Button>

        {showFilters && (
          <div className="flex gap-2 flex-wrap">
            <div>
              <p className="text-sm font-semibold">{t('From Date')}:</p>
              <div className="flex items-center gap-1">
                <DatePicker
                  date={filter.from_date}
                  onChange={(value) =>
                    setFilter((prev) => ({ ...prev, from_date: value }))
                  }
                />

                {filter.from_date && (
                  <Button
                    type="button"
                    className="bg-transparent hover:bg-transparent p-0"
                    onClick={() =>
                      setFilter((prev) => ({ ...prev, from_date: undefined }))
                    }
                  >
                    <XMarkIcon
                      className="h-5 w-5 text-red-500 hover:text-red-700"
                      aria-hidden="true"
                    />
                  </Button>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold">{t('To Date')}:</p>
              <div className="flex items-center gap-1">
                <DatePicker
                  date={filter.to_date}
                  onChange={(value) =>
                    setFilter((prev) => ({ ...prev, to_date: value }))
                  }
                />

                {filter.to_date && (
                  <Button
                    type="button"
                    className="bg-transparent hover:bg-transparent p-0"
                    onClick={() =>
                      setFilter((prev) => ({ ...prev, to_date: undefined }))
                    }
                  >
                    <XMarkIcon
                      className="h-5 w-5 text-red-500 hover:text-red-700"
                      aria-hidden="true"
                    />
                  </Button>
                )}
              </div>
            </div>

            {isCollectionPage ? (
              <Filter
                label={t('Zone')}
                items={availableZones}
                value={filter.zone}
                onChange={(value) => {
                  setFilter((prev) => ({ ...prev, zone: value }));
                }}
              />
            ) : (
              <Filter
                label={t('Land Parcel')}
                items={availableParcels}
                value={filter.land_parcel}
                onChange={(value) => {
                  setFilter((prev) => ({
                    ...prev,
                    land_parcel: value,
                  }));
                }}
              />
            )}

            {isCollectionPage ? (
              <Filter
                label={t('Harvester')}
                items={availableHarvesters}
                value={filter.harvester}
                onChange={(value) =>
                  setFilter((prev) => ({ ...prev, harvester: value }))
                }
              />
            ) : (
              <Filter
                label={t('Farmer')}
                items={availableFarmers}
                value={filter.contracted_farmer}
                onChange={(value) =>
                  setFilter((prev) => ({ ...prev, contracted_farmer: value }))
                }
              />
            )}

            <Filter
              label={t('Crop')}
              items={availableCrops}
              value={filter.crop}
              onChange={(value) =>
                setFilter((prev) => ({ ...prev, crop: value }))
              }
            />
          </div>
        )}
      </div>

      <DataTable
        columns={withActionColumns({
          onDelete: deleteFn,
          onEdit: (id: number) => {
            const admissionEntry = admissions.entries.find(
              (entry) => entry.id === id,
            );
            console.log('editing', admissionEntry, admissions.list);
            handleEdit(admissionEntry!.admission_id!, admissionEntry!);
          },
          canEdit: () => false,
          canDelete: () => false,
          columns: isCollectionPage
            ? columns.collection(t, i18n, filteredList)
            : columns.purchased(t, i18n, filteredList),
        })}
        data={filteredList}
      />
    </div>
  );
}

export default Admissions;
