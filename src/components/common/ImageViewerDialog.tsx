"use client"
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/shadcn/dialog"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
interface ImageViewerDialogProps {
    isOpen: boolean
    onClose: () => void
    images?: Array<{ url: string; alt: string }>
    currentIndex?: number
}

export default function ImageViewerDialog({
    isOpen,
    onClose,
    images = [],
    currentIndex: initialIndex = 0
}: ImageViewerDialogProps) {
    const [zoom, setZoom] = useState(1)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(initialIndex)
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [offset, setOffset] = useState({ x: 0, y: 0 })

    // Use images array if provided, otherwise use single image
    const imageList = images.length > 0 ? images : []
    const currentImage = imageList[currentIndex]

    useEffect(() => {
        setZoom(1)
        setOffset({ x: 0, y: 0 })
    }, [currentIndex, isOpen])

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3))
    const handleZoomOut = () => {
        const newZoom = Math.max(zoom - 0.2, 0.8)
        setZoom(newZoom)
        if (newZoom <= 1) {
            setOffset({ x: 0, y: 0 })
        }
    }
    const handleReset = () => {
        setZoom(1)
        setOffset({ x: 0, y: 0 })
    }

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (e.deltaY < 0) {
            handleZoomIn()
        } else {
            handleZoomOut()
        }
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (zoom > 1) {
            setIsDragging(true)
            setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
        }
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || zoom <= 1) return

        const newX = e.clientX - dragStart.x
        const newY = e.clientY - dragStart.y

        // Limit drag bounds based on zoom level
        const maxOffset = (zoom - 1) * 200
        const boundedX = Math.max(-maxOffset, Math.min(maxOffset, newX))
        const boundedY = Math.max(-maxOffset, Math.min(maxOffset, newY))

        setOffset({ x: boundedX, y: boundedY })
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handlePrevImage = () => {
        setCurrentIndex(prev => (prev === 0 ? imageList.length - 1 : prev - 1))
    }

    const handleNextImage = () => {
        setCurrentIndex(prev => (prev === imageList.length - 1 ? 0 : prev + 1))
    }

    const handleDownload = async () => {
        try {
            const response = await fetch(currentImage.url)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = currentImage.alt || 'image'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Failed to download image:', error)
        }
    }

    // Handle keyboard navigation
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') handlePrevImage()
            if (e.key === 'ArrowRight') handleNextImage()
            if (e.key === 'Escape') onClose()
            if (e.key === '+' || e.key === '=') handleZoomIn()
            if (e.key === '-') handleZoomOut()
            if (e.key === '0') handleReset()
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, currentIndex])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent showCloseButton={false} className={`border-0 bg-black/95 p-0 min-w-full h-screen`}>
                <DialogTitle className="sr-only">
                    {currentImage?.alt} - Image Viewer
                </DialogTitle>
                <div className="relative flex flex-col items-center justify-center h-full">
                    {/* Header Controls */}
                    <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between">
                        <div className="text-white text-sm font-medium">
                            {imageList.length > 1 && `${currentIndex + 1} / ${imageList.length}`}
                        </div>
                        <div className="flex gap-2">
                            <DialogClose asChild>
                                <button className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors">
                                    <X className="h-5 w-5 text-white" />
                                </button>
                            </DialogClose>
                        </div>
                    </div>

                    {/* Image Container */}
                    <div
                        className={`flex h-full w-full items-center justify-center overflow-hidden relative ${zoom > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
                        onWheel={handleWheel}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        {/* Previous Button */}
                        {imageList.length > 1 && (
                            <button
                                onClick={handlePrevImage}
                                className="absolute left-4 z-40 rounded-full bg-white/10 p-3 hover:bg-white/20 transition-colors group pointer-events-auto"
                            >
                                <ChevronLeft className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                            </button>
                        )}

                        {/* Image */}
                        {

                            currentImage?.url && <div className="relative flex items-center justify-center">
                                <Image
                                    src={currentImage?.url}
                                    alt={currentImage?.alt}
                                    width={1920}
                                    height={1000}
                                    style={{
                                        transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`,
                                        userSelect: 'none',
                                        maxHeight: '100vh',
                                        width: 'auto',
                                        height: 'auto'
                                    }}
                                    className="transition-transform duration-200 ease-out max-h-screen max-w-full object-contain"
                                    draggable={false}
                                    priority
                                />
                            </div>
                        }

                        {/* Next Button */}
                        {imageList.length > 1 && (
                            <button
                                onClick={handleNextImage}
                                className="absolute right-4 z-40 rounded-full bg-white/10 p-3 hover:bg-white/20 transition-colors group pointer-events-auto"
                            >
                                <ChevronRight className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                            </button>
                        )}


                    </div>

                    {/* Controls Footer */}


                    {/* Help Text */}
                    <div className="absolute bottom-28 left-4 right-4 text-xs text-white/50 text-center">
                        Scroll to zoom • Arrow keys to navigate • Drag to pan • 0 to reset zoom
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}