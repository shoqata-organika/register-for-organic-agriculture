import { useFormContext } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from '@/components/ui/form';
import { useTranslation } from 'react-i18next';
import { Dropdown } from '@/components/dropdown';
import { cn } from '@/utils';
import { DatePicker } from '@/components/datepicker';
import { PlusIcon } from '@heroicons/react/20/solid';
import { Zone } from '@/api/types/zone';
import { LandParcelView } from '@/api/types/land_parcel';
import { HarvesterView } from '@/api/types/harvester';
import {
  Admission,
  AdmissionEntry,
  AdmissionType,
} from '@/api/types/admission';
import { ContractedFarmerView } from '@/api/types/contracted_farmers';
import { useQuery } from 'react-query';
import { getContractedFarmerLandParcels } from '@/api/land_parcel';

interface Props {
  zones: Zone[];
  harvesters: HarvesterView[];
  contractedFarmers: ContractedFarmerView[];
  admission: Admission;
  admissionEntry: AdmissionEntry | null;
  type: AdmissionType;
  children: any;
}

function CommonAdmissionForm({
  admissionEntry,
  zones,
  harvesters,
  type,
  contractedFarmers,
  children,
}: Props) {
  const form = useFormContext();
  const { t } = useTranslation();

  const title = admissionEntry ? 'Edit Crop' : 'Add Crop';

  const zone_id = form.watch('zone_id');
  const contracted_farmer_id = form.watch('contracted_farmer_id');

  const landParcelsQuery = useQuery<LandParcelView[]>({
    queryKey: ['land_parcels', contracted_farmer_id],
    queryFn: async () => {
      return contracted_farmer_id
        ? getContractedFarmerLandParcels(contracted_farmer_id)
        : [];
    },
  });

  const landParcels = landParcelsQuery.data || [];

  const filteredHarvesters = zone_id
    ? harvesters.filter((harvester) => harvester.zone_id === zone_id)
    : [];

  return (
    <>
      <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-3')}>
        {type === AdmissionType.PURCHASE && (
          <FormField
            control={form.control}
            name="contracted_farmer_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-full">
                  {t('Contracted Farmer')}
                </FormLabel>
                <FormControl>
                  <Dropdown
                    items={contractedFarmers.map((farmer) => ({
                      value: farmer.id.toString(),
                      label: `${farmer.code} - ${farmer.name}`,
                    }))}
                    value={field.value?.toString()}
                    onChange={(value) =>
                      form.setValue('contracted_farmer_id', +value)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {type === AdmissionType.COLLECTION ? (
          <FormField
            control={form.control}
            name="zone_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-full">{t('Zone')}</FormLabel>
                <FormControl>
                  {zones && (
                    <Dropdown
                      items={zones.map((zone) => ({
                        value: zone.id.toString(),
                        label: `${zone.code} - ${zone.name}`,
                      }))}
                      value={field.value?.toString()}
                      onChange={(value) => form.setValue('zone_id', +value)}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="land_parcel_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-full">{t('Land Parcel')}</FormLabel>
                <FormControl>
                  {zones && (
                    <Dropdown
                      items={landParcels.map((parcel) => ({
                        value: parcel.id.toString(),
                        label: `${t('Code')} - ${parcel.code}`,
                      }))}
                      value={field.value?.toString()}
                      onChange={(value) =>
                        form.setValue('land_parcel_id', +value)
                      }
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {type === AdmissionType.COLLECTION && (
          <FormField
            control={form.control}
            name="harvester_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-full">{t('Harvester')}</FormLabel>
                <FormControl>
                  <Dropdown
                    items={filteredHarvesters.map((harvester) => ({
                      value: harvester.id.toString(),
                      label: `${harvester.code} - ${harvester.first_name} ${harvester.last_name}`,
                    }))}
                    value={field.value?.toString()}
                    onChange={(value) => form.setValue('harvester_id', +value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-full">{t('Date')}</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  onChange={(value) => form.setValue('date', value as Date)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-start">
          <span className="flex items-center bg-white pr-3 text-base font-semibold leading-6 text-gray-900">
            <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            {t(title)}
          </span>
        </div>
      </div>

      {children}
    </>
  );
}

export default CommonAdmissionForm;
