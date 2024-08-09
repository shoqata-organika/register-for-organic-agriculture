import { useEffect, useState } from 'react';
import { getCodeCategories } from '../../api/code_category';
import { useTranslation } from 'react-i18next';
import { Filter } from '@/components/filter';
import activityTables from './activityTables';
import {
  FarmActivityType,
  FarmActivityView,
} from '../../api/types/farm_activity';
import { LandParcelView } from '../../api/types/land_parcel';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/datepicker';
import { filterPipeline } from '@/utils/filterPipeline';
import { getLandParcels } from '../../api/land_parcel';
import {
  getFarmActivities,
  exportFarmActivities,
} from '../../api/farm_activities';
import { Code } from '../../api/types/code_category';
import AddButton from '@/components/AddButton';
import DataTable from '@/components/TableComponent';
import useCustomState, { State } from '@/hooks/useCustomState';
import { SlidersHorizontal } from 'lucide-react';
import { withActionColumns } from '@/components/withActionColumns';
import { deleteFarmActivity } from '@/api/farm_activities';
import ExportButton from '@/components/ExportButton';
import FarmActivityForm from './form';
import Tabs from '@/components/ui/tabs';

interface LocalState {
  cropDiseases: Array<Code>;
  landParcels: Array<LandParcelView>;
}

export type FilterTypes = FarmActivityType | 'all_items' | 'land_preparation';

interface Filters {
  from_date?: Date;
  to_date?: Date;
  land_parcel?: string;
}

const filters: Filters = {
  from_date: undefined,
  to_date: undefined,
  land_parcel: undefined,
};

const state = new State<FarmActivityView, LocalState>({
  cropDiseases: [],
  landParcels: [],
}).getState();

function filterBy(type: keyof Filters, val?: any) {
  return (array: FarmActivityView[]): FarmActivityView[] => {
    if (!array.length) return [];

    if (!val) return array;

    switch (type) {
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

      case 'land_parcel': {
        return array.filter((item) => {
          return item.landParcel.id === +val;
        });
      }

      default:
        return array;
    }
  };
}

const subTabs = ['land_ploughing', 'milling', 'bed_preparation'];

const FarmActivities = () => {
  const {
    state: activities,
    dispatch,
    onClose,
    onEdit,
  } = useCustomState(state);

  const [currentTab, setCurrentTab] = useState<FilterTypes>('all_items');
  const [filter, setFilter] = useState<Filters>(filters);
  const [showFilters, setShowFilter] = useState<boolean>(false);
  const [subTabOpen, setSubTabOpen] = useState<boolean>(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    (async function () {
      const farmActivitiesRes = await getFarmActivities();

      const codeCategoriesRes = await getCodeCategories(['CROP_DISEASES']).then(
        (response) => {
          const cropDiseases =
            response.find((r) => r.api_name === 'CROP_DISEASES')?.codes || [];

          return [cropDiseases];
        },
      );

      const landParcelRes = await getLandParcels();

      Promise.all([
        farmActivitiesRes,
        codeCategoriesRes, // this returns [actCodes, orgCodes]
        landParcelRes,
      ])
        .then((data) => {
          dispatch({
            type: 'UPDATE_STATE',
            payload: {
              list: data[0], // farmActivities
              cropDiseases: data[1][0],
              landParcels: data[2],
            },
          });
        })
        .catch((error: Error) => console.log(error));
    })();
  }, []);

  useEffect(() => {
    getFarmActivities().then((data) => {
      dispatch({ type: 'UPDATE_LIST', payload: { list: data } });
    });
  }, [activities.rerender]);

  async function deleteFn(activity: FarmActivityView): Promise<void> {
    deleteFarmActivity(activity.id)
      .then(() =>
        dispatch({
          type: 'UPDATE_LIST',
          payload: {
            list: activities.list.filter((item) => item.id !== activity.id),
          },
        }),
      )
      .catch((error) => console.error(error));
  }

  const currentTabList = activities.list.filter((activity) => {
    if (currentTab === 'all_items') {
      return activity;
    }

    return activity.activity_type === currentTab;
  });

  const currentTabParcels = activities.list.map(
    (activity) => activity.landParcel.id,
  );

  const currentLandParcels = activities.landParcels.filter((parcel) => {
    return currentTabParcels.includes(parcel.id);
  });

  const filteredList = filterPipeline(
    filterBy('from_date', filter.from_date),
    filterBy('to_date', filter.to_date),
    filterBy('land_parcel', filter.land_parcel),
  )(currentTabList);

  const mainTabs = ['all_items', 'land_preparation']
    .concat(Object.values(FarmActivityType))
    .filter((item) => !subTabs.includes(item));

  return (
    <div>
      {activities.overlay && (
        <FarmActivityForm
          filter={currentTab}
          activity={activities.item}
          landParcels={activities.landParcels}
          cropDiseases={activities.cropDiseases}
          onClose={onClose}
        />
      )}

      <div className="flex justify-between">
        <AddButton
          title={t('New Farm Activity')}
          onClick={() =>
            dispatch({ type: 'UPDATE_OVERLAY', payload: { overlay: true } })
          }
        />

        <ExportButton
          onClick={() =>
            exportFarmActivities(
              i18n.language,
              filteredList.map((item) => item.id),
            )
          }
          title={t('Download')}
        />
      </div>

      <div>
        <div className="flex mt-10 items-center gap-2">
          <Tabs
            tabs={mainTabs.map((key) => ({ id: key, name: t(key) }))}
            currentTab={{ id: currentTab, name: t(currentTab) }}
            onChange={(tab) => {
              if (tab.id === 'land_preparation') {
                setSubTabOpen(true);
                return setCurrentTab(FarmActivityType.LAND_PLOUGHING);
              }

              setSubTabOpen(false);
              setCurrentTab(tab.id as FilterTypes);
            }}
          />
        </div>

        {subTabOpen && (
          <div className="flex mt-5 items-center gap-2">
            <Tabs
              tabs={subTabs.map((key) => ({
                id: key,
                name: t(key),
              }))}
              currentTab={{ id: currentTab, name: t(currentTab) }}
              onChange={(tab) => setCurrentTab(tab.id as FilterTypes)}
            />
          </div>
        )}
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

          <Filter
            label={t('Land Parcel')}
            items={currentLandParcels.map((parcel) => ({
              value: parcel.id,
              label: `${t('Code')} - ${parcel.code}`,
            }))}
            value={filter.land_parcel}
            onChange={(value) => {
              setFilter((prev) => ({
                ...prev,
                land_parcel: value,
              }));
            }}
          />
        </div>
      )}

      <DataTable
        columns={withActionColumns({
          onDelete: deleteFn,
          onEdit,
          canEdit: (activity: FarmActivityView) =>
            activity.activity_type !== FarmActivityType.HARVESTING,
          canDelete: (activity: FarmActivityView) =>
            activity.activity_type !== FarmActivityType.HARVESTING,
          columns: activityTables[currentTab]({
            t,
            data: { diseases: activities.cropDiseases },
            language: i18n.language,
            list: filteredList,
          }),
        })}
        data={filteredList}
      />
    </div>
  );
};

export default FarmActivities;
