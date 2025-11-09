import React from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/shadcn/drawer"
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/shadcn/button'
function TableFilterDrawer({ openFilter, setOpenFilter, children }: { openFilter: boolean, setOpenFilter: any, children?: any }) {
    return (
        <Drawer direction='right' open={openFilter} onOpenChange={setOpenFilter}>
            <DrawerContent
                className={cn(
                    "fixed z-[100000] bg-white shadow-xl border-t md:border-t-0 md:border-l",
                    "w-full md:w-[420px] h-auto md:h-full",
                    "bottom-0 md:top-0 md:right-0",
                    "animate-in md:slide-in-from-right slide-in-from-bottom"
                )}
            >
                {/* Header */}
                <DrawerHeader className="border-b px-6 py-4">
                    <DrawerTitle>Filter Options</DrawerTitle>
                    <DrawerDescription>Adjust filters and refine your results</DrawerDescription>
                </DrawerHeader>

                {/* Body */}
                {children}

                {/* Footer */}
                <DrawerFooter className="border-t px-6 py-4 flex gap-2">
                    <Button
                        className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white"
                        onClick={() => setOpenFilter(false)}
                    >
                        Apply Filters
                    </Button>
                    <DrawerClose asChild>
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setOpenFilter(false)}
                        >
                            Cancel
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default TableFilterDrawer