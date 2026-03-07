import ActionModal from '@/components/ui/modal/ActionModal';
import { unitGroupService } from '@/core/service/infra/unitGroup-service';
import { toastPromise } from '@/lib/alert-helper';
import { UnitGroup } from '@/core/model/infra/unitGroup';
import { useEffect } from 'react';

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
            <p>Are you sure you want to delete this unit group?</p>
        </ActionModal>
    );
}

export default DeleteUnitGroupModal;