"use client";

import ImageViewerDialog from "@/components/common/ImageViewerDialog";
import { closeImage } from "@/redux/features/images/ImageSlice";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

interface ImageViewProviderProps {
    children: React.ReactNode;
}

export default function ImageViewProvider({ children }: ImageViewProviderProps) {
    const images = useSelector((state: RootState) => state.image.value)
    const dispatch = useDispatch()
    return (
        <>
            {children}
            <ImageViewerDialog
                isOpen={images.length > 0}
                images={images}
                onClose={() => {
                    dispatch(closeImage())
                }}
            />
        </>
    );
}