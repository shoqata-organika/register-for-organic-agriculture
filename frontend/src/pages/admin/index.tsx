import { useEffect, useState } from 'react';
import { cn } from '@/utils';
import { formatDate } from '@/utils/formatDate';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/TableComponent';
import { SlidersHorizontal } from 'lucide-react';
import { getAllMembers, updateMember } from '@/api/admin';
import { withActionColumns } from '@/components/withActionColumns';
import { Filter } from '@/components/filter';
import { filterPipeline } from '@/utils/filterPipeline';
import { MemberView, APPROVAL_STATUS } from '@/api/types/user';

type Filters = {
  approval_status?: APPROVAL_STATUS;
};

function filterBy(type: keyof Filters, val?: any) {
  return (array: MemberView[]): MemberView[] => {
    if (!array.length) return [];

    if (!val) return array;

    switch (type) {
      case 'approval_status': {
        return array.filter((item) => {
          return item.approval_status === val;
        });
      }

      default:
        return array;
    }
  };
}

const filters: Filters = {
  approval_status: undefined,
};

export default function Admin() {
  const [members, setMembers] = useState<Array<MemberView>>([]);
  const [showFilters, setShowFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<Filters>(filters);
  const { t } = useTranslation();

  useEffect(() => {
    getAllMembers().then(setMembers);
  }, []);

  const filteredList = filterPipeline(
    filterBy('approval_status', filter.approval_status),
  )(members);

  async function updateMemberStatus(status: APPROVAL_STATUS, memberId: number) {
    try {
      const response = await updateMember(status, memberId);

      if (!response) return;

      const newList = members.map((member) => {
        if (member.id === response.id) {
          return (member = response);
        }

        return member;
      });

      setMembers(newList);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={cn('p-4')}>
      <Button
        className="flex mb-4 bg-gray-800 items-center gap-4"
        onClick={() => setShowFilter((prev) => !prev)}
      >
        <span className="text-lg">{t('Filter Data')}</span>
        <SlidersHorizontal className="h-4" />
      </Button>

      {showFilters && (
        <div className="flex gap-2 flex-wrap">
          <Filter
            className="w-52"
            label={t('Approval Status')}
            items={Object.values(APPROVAL_STATUS).map((item) => ({
              value: item,
              label: t(item),
            }))}
            value={filter.approval_status}
            onChange={(value) => {
              setFilter({ approval_status: value as APPROVAL_STATUS });
            }}
          />
        </div>
      )}

      <DataTable
        columns={withActionColumns({
          canDelete: () => false,
          canEdit: () => false,
          onDelete: () => {},
          onEdit: () => {},
          columns: [
            {
              accessorKey: 'business_name',
              header: t('Name'),
            },
            {
              accessorKey: 'email',
              header: t('Email'),
            },
            {
              accessorKey: 'approved_at',
              header: t('Date of Approval'),
              cell: ({ row }: any) => {
                const date = row.original.approved_at;

                if (date) {
                  return formatDate(date);
                }
              },
            },
            {
              header: t('Approval Status'),
              cell: ({ row }: any) => {
                const approval_status = row.original.approval_status;

                if (approval_status === APPROVAL_STATUS.PENDING) {
                  return (
                    <div className={cn('flex gap-1')}>
                      <Button
                        className="bg-green-500"
                        role="button"
                        onClick={() =>
                          updateMemberStatus(
                            APPROVAL_STATUS.APPROVED,
                            row.original.id,
                          )
                        }
                      >
                        {t('Approve')}
                      </Button>

                      <Button
                        className="bg-red-500"
                        role="button"
                        onClick={() =>
                          updateMemberStatus(
                            APPROVAL_STATUS.DECLINED,
                            row.original.id,
                          )
                        }
                      >
                        {t('Decline')}
                      </Button>
                    </div>
                  );
                }

                return <b>{t(approval_status)}</b>;
              },
            },
          ],
        })}
        data={filteredList}
      />
    </div>
  );
}
