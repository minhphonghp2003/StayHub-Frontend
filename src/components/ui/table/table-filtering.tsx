import { Button } from '@/components/ui/shadcn/button'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle
} from "@/components/ui/shadcn/drawer"
import { cn } from '@/lib/utils'
function TableFilterDrawer({ isOpen, onApply, onRemoveAllFilters, children }: { isOpen: boolean, onApply: any, onRemoveAllFilters?: any, children?: any }) {
    return (
        <Drawer direction='right' open={isOpen} onOpenChange={onApply}>
            <DrawerContent
                className={cn(
                    "fixed z-[100000] bg-white shadow-xl border-t md:border-t-0 md:border-l",
                    "w-full md:w-[420px] h-auto md:h-full",
                    "dark:bg-black",
                    "bottom-0 md:top-0 md:right-0",
                    "animate-in md:slide-in-from-right slide-in-from-bottom"
                )}
            >
                {/* Header */}
                <DrawerHeader className="border-b p-4">
                    <DrawerTitle>Bộ lọc</DrawerTitle>
                    <DrawerDescription onClick={onRemoveAllFilters} className='cursor-pointer'>Xóa tất cả bộ lọc</DrawerDescription>
                </DrawerHeader>

                {/* Body */}
                {children}

                {/* Footer */}
                <DrawerFooter className="border-t px-6 py-4 flex gap-2">
                    <Button
                        onClick={() => onApply(true)}
                    >
                        Xác nhận
                    </Button>
                    <DrawerClose asChild>
                        <Button
                            variant="outline"
                            onClick={() => onApply(false)}
                        >
                            Hủy
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default TableFilterDrawer