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
function ConfirmDialog({ isOpen, closeModal, icon, title, desc, action, titleClassName }: { isOpen: boolean, closeModal: any, title: string, desc: string, action: any, icon: any, titleClassName: string }) {

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => { !open && closeModal() }}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader className="flex flex-col items-center text-center gap-4">
                    <span className="p-4 rounded-full bg-gray-100">
                        {icon}
                    </span>
                    <AlertDialogTitle className={`text-lg font-semibold ${titleClassName} `}>
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                        {desc}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex justify-center gap-2 mt-4">
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Hủy</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        {action}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ConfirmDialog