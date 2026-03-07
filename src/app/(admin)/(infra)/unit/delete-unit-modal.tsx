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
                    loading: "Deleting...",
                    success: "Deleted successfully!",
                    error: "Failed to delete",
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
            heading="Confirm deletion"
        >
            <p>Are you sure you want to delete this unit?</p>
        </ActionModal>
    );
}

export default DeleteUnitModal;