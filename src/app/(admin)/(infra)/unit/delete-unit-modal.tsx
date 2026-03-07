import ActionModal from '@/components/ui/modal/ActionModal';
import { unitService } from '@/core/service/infra/unit-service';
import { toastPromise } from '@/lib/alert-helper';
import { Unit } from '@/core/model/infra/unit';
import { useEffect } from 'react';

function DeleteUnitModal({
    isOpen,
    closeModal,
    reload,
    unit,
}: {
    isOpen: boolean;
    closeModal: any;
    reload?: any;
    unit: Unit | null;
}) {
    const handleDelete = async () => {
        if (!unit?.id) return;
        try {
            const result = await toastPromise(
                unitService.deleteUnit(unit.id),
                {
                    loading: "Đang xóa...",
                    success: "Xóa phòng thành công!",
                    error: "Xóa phòng thất bại",
                }
            );
            if (result) {
                closeModal();
                reload?.();
            }
        } catch { }
    };

    useEffect(() => {
        // nothing special
    }, [isOpen]);

    return (
        <ActionModal
            size="sm"
            isOpen={isOpen}
            closeModal={closeModal}
            onConfirm={handleDelete}
            heading="Xác nhận xóa"
        >
            <p>Bạn có chắc chắn muốn xóa phòng này không?</p>
        </ActionModal>
    );
}

export default DeleteUnitModal;