import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/shadcn/alert-dialog"
import { Button } from '@/components/ui/shadcn/button'
import { unitGroupService } from '@/core/service/infra/unitGroup-service';
import { toastPromise } from '@/lib/alert-helper';
import { UnitGroup } from '@/core/model/infra/unitGroup';
import { Trash2 } from 'lucide-react';

function DeleteUnitGroupModal({
    isOpen,
    closeModal,
    reload,
    unitGroup,
}: {
    isOpen: boolean;
    closeModal: any;
    reload?: any;
    unitGroup: UnitGroup | null;
}) {
    const handleDelete = async () => {
        if (!unitGroup?.id) return;
        try {
            const result = await toastPromise(
                unitGroupService.deleteUnitGroup(unitGroup.id),
                {
                    loading: "Đang xóa khu/tầng/dãy...",
                    success: "Xóa khu/tầng/dãy thành công!",
                    error: "Xóa khu/tầng/dãy thất bại",
                }
            );
            if (result) {
                closeModal();
                reload?.();
            }
        } catch { }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => { !open && closeModal() }}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader className="flex flex-col items-center text-center gap-4">
                    <span className="p-4 rounded-full bg-gray-100">
                        <Trash2 className="w-12 h-12 text-red-500" />
                    </span>
                    <AlertDialogTitle className="text-lg font-semibold text-red-600 ">
                        Xóa {unitGroup?.name}?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                        Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa {unitGroup?.name} vĩnh viễn?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex justify-center gap-2 mt-4">
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Hủy</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button variant="destructive" onClick={handleDelete}>
                            Xóa
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default DeleteUnitGroupModal;