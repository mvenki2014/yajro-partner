import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { HiOutlineTrash } from "react-icons/hi2";

interface DeleteServiceConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  serviceName?: string;
}

export function DeleteServiceConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  serviceName,
}: DeleteServiceConfirmDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      title="Delete Service"
      description={
        <>
          Are you sure you want to delete{" "}
          <span className="text-slate-900 font-bold">
            {serviceName ? `"${serviceName}"` : "this service"}
          </span>
          ? This action cannot be undone.
        </>
      }
      confirmText="Delete"
      variant="destructive"
      icon={<HiOutlineTrash className="h-6 w-6 text-red-500" />}
    />
  );
}
