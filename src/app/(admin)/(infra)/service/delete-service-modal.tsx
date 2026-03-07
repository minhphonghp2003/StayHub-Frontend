"use client";

import { useState } from "react";

import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Service } from "@/core/model/infra/service";
import { serviceService } from "@/core/service/infra/service-service";
import { toastPromise } from "@/lib/alert-helper";
import { Button } from "@/components/ui/shadcn/button";

interface DeleteServiceModalProps {
    isOpen: boolean;
    closeModal: () => void;
    service: Service | null;
    reload: () => void;
}

function DeleteServiceModal({ isOpen, closeModal, service, reload }: DeleteServiceModalProps) {
    const [loading, setLoading] = useState(false);

    const onConfirm = async () => {
        if (!service?.id) return;
        setLoading(true);
        const result = await toastPromise(
            serviceService.deleteService(service.id),
            {
                loading: "Deleting service...",
                success: "Service deleted successfully!",
                error: "Failed to delete service",
            }
        );
        setLoading(false);
        if (result) {
            closeModal();
            reload();
        }
    };

    return (
        <ConfirmDialog
            isOpen={isOpen}
            closeModal={closeModal}
            title="Delete Service"
            desc={`Are you sure you want to delete "${service?.name}"? This action cannot be undone.`}
            action={<Button variant="default" onClick={onConfirm}>
                Xác nhận
            </Button>} icon={undefined} titleClassName={""} />
    );
}

export default DeleteServiceModal;