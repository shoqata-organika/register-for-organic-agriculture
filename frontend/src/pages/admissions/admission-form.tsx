import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';

import * as z from 'zod';
import { useEffect, useState } from 'react';
import {
  Admission,
  AdmissionEntry,
  AdmissionType,
} from '@/api/types/admission';
import Slideover from '@/components/ui/slide-over';
import { schema as entrySchema } from './form';
import { Zone } from '@/api/types/zone';
import { LandParcelView } from '@/api/types/land_parcel';
import { HarvesterView } from '@/api/types/harvester';
import { Code } from '@/api/types/code_category';
import { createAdmission, updateAdmission } from '@/api/admission';
import AdmissionEntryForm from './form';
import AdmissionEntryList from './list';
import CommonAdmissionForm from './common-admission-form';
import { ContractedFarmerView } from '@/api/types/contracted_farmers';

const commonSchema = z.object({
  date: z.coerce.date(),
  entries: z
    .array(entrySchema, {
      required_error: 'At least one crop is required',
    })
    .min(1, 'At least one crop is required'),
});

interface Props {
  zones: Zone[];
  landParcels: LandParcelView[];
  harvesters: HarvesterView[];
  contractedFarmers: ContractedFarmerView[];
  crops: Code[];
  type: AdmissionType;
  onClose: (arg?: boolean) => void;
  currentAdmission: Admission | null;
  currentEntry: AdmissionEntry | null;
}

export default function AdmissionForm({
  zones,
  harvesters,
  contractedFarmers,
  currentEntry,
  type,
  currentAdmission,
  crops,
  onClose,
}: Props) {
  const { t } = useTranslation();
  const [admission, setAdmission] = useState<Admission>({
    date: new Date(),
    entries: [] as AdmissionEntry[],
  } as Admission);
  const [currentAdmissionEntry, setCurrentAdmissionEntry] =
    useState<AdmissionEntry | null>(null);

  const schema =
    type === AdmissionType.COLLECTION
      ? commonSchema.extend({
          harvester_id: z.coerce.number(),
          zone_id: z.coerce.number(),
        })
      : commonSchema.extend({
          contracted_farmer_id: z.coerce.number(),
          land_parcel_id: z.coerce.number(),
        });

  useEffect(() => {
    if (currentAdmission) {
      setAdmission(currentAdmission);
      setCurrentAdmissionEntry(currentEntry);

      form.reset(currentAdmission);
    }
  }, [currentAdmission]);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const formErrors = form.formState.errors;

  const handleAdmissionEntry = (entry: AdmissionEntry) => {
    const entries = admission.entries || [];

    const existingIndex = entries.findIndex((ca) => {
      return entry.id ?? entry.id
        ? ca.id === entry.id
        : ca._tempId === entry._tempId;
    });

    if (existingIndex > -1) {
      entries[existingIndex] = entry;
    } else {
      entries.push(entry);
    }

    setCurrentAdmissionEntry(null);
    setAdmission({
      ...admission,
      entries: entries,
    });

    form.setValue('entries', entries);
  };

  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (!admission.id) {
      try {
        const response = await createAdmission({
          ...values,
          type,
        } as Admission).then(() => onClose(true));

        console.log(response);
      } catch (err) {
        console.log(err);
      }
    } else {
      updateAdmission({ ...admission }, 'collection').then(() => onClose(true));
    }
  };

  let title: string;

  if (type === AdmissionType.PURCHASE) {
    title = admission.id
      ? 'Edit Product code from the farmer'
      : 'Product code from the farmer';
  } else {
    title = admission.id ? 'Edit Admission' : 'New Admission';
  }

  return (
    <FormProvider {...form}>
      <Slideover
        onClose={() => onClose()}
        onSave={form.handleSubmit(onSubmit)}
        title={t(title)}
      >
        <form className="space-y-8">
          <CommonAdmissionForm
            zones={zones}
            admissionEntry={currentAdmissionEntry}
            harvesters={harvesters}
            contractedFarmers={contractedFarmers}
            type={type}
            admission={admission}
          >
            <AdmissionEntryForm
              crops={crops}
              type={type}
              entry={currentAdmissionEntry}
              onSubmit={handleAdmissionEntry}
            />
            {formErrors.entries && (
              <p className={'text-sm font-medium text-destructive'}>
                {t(formErrors.entries.message || '')}
              </p>
            )}
            <AdmissionEntryList
              entries={admission.entries || []}
              crops={crops}
              onEdit={(entry) => setCurrentAdmissionEntry(entry)}
            />
          </CommonAdmissionForm>
        </form>
      </Slideover>
    </FormProvider>
  );
}
