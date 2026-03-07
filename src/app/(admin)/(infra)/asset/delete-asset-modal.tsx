import ActionModal from '@/components/ui/modal/ActionModal';
import { assetService } from '@/core/service/infra/asset-service';
import { toastPromise } from '@/lib/alert-helper';
import { Asset } from '@/core/model/infra/asset';
import { useEffect } from 'react';

function DeleteAssetModal({
    isOpen,
    onClose,
    onSuccess,
    asset,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    asset: Asset | null;
}) {
    const handleDelete = async () => {
        if (!asset?.id) return;
        try {
            const result = await toastPromise(
                assetService.deleteAsset(asset.id),
                {
                    loading: "Deleting...",
                    success: "Deleted successfully!",
                    error: "Failed to delete",
                }
            );
            if (result) {
                onClose();
                onSuccess?.();
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
            closeModal={onClose}
            onConfirm={handleDelete}
            heading="Confirm deletion"
        >
            <p>Are you sure you want to delete this asset?</p>
        </ActionModal>
    );
}

export default DeleteAssetModal;
