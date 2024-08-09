import { ColumnDef } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { MoreVertical, Trash2, Pencil } from 'lucide-react';

interface Props<T extends Column> {
  onDelete: (arg: any) => void;
  onEdit: (arg: any) => void;
  columns: ColumnDef<T>[];
  canEdit?: (arg: any) => boolean;
  canDelete?: (arg?: any) => boolean;
}

type Column = {
  id: number | string;
};

export function withActionColumns<T extends Column>({
  onDelete,
  onEdit,
  columns,
  canEdit: _canEdit,
  canDelete: _canDelete,
}: Props<T>): ColumnDef<T>[] {
  const { t } = useTranslation();

  const canEdit = _canEdit || (() => true);
  const canDelete = _canDelete || (() => true);

  return [
    ...columns,
    {
      id: 'actions',
      cell: ({ row }) => {
        const activity = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Button
                  className="justify-between w-full bg-green-500 hover:bg-green-600"
                  disabled={!canEdit(activity)}
                  onClick={() => {
                    if (!activity.id) return;

                    onEdit(activity.id);
                  }}
                >
                  <span className="pr-2">{t('Edit')}</span>
                  <Pencil className="w-4" />
                </Button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button
                  className="justify-between w-full bg-red-500 hover:bg-red-600"
                  disabled={!canDelete(activity)}
                  onClick={() => {
                    if (!activity.id) return;

                    onDelete(activity);
                  }}
                >
                  <span className="pr-2">{t('Delete')}</span>
                  <Trash2 className="w-4" />
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
