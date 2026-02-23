import { Spinner } from '@/components/ui/shadcn/spinner'

function Loading() {
    return (
        <div className="absolute inset-0 z-50 text-brand-400 bg-white/70 dark:bg-black/40 
                        flex items-center justify-center backdrop-blur-sm">
            <Spinner className="size-8" />
        </div>
    )
}

export default Loading