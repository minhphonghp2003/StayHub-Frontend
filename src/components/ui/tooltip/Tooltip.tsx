import React, { ReactNode } from "react"

interface TooltipProps {
    content: string
    children: ReactNode
    className?: string
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, className = "" }) => {
    const lines = content.split("\n")

    return (
        <div className={`group relative inline-block ${className}`}>
            {children}
            <div className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded z-50 pointer-events-none">
                {lines.map((line, i) => (
                    <div key={i}>{line}</div>
                ))}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>

            </div>
        </div>
    )
}

export default Tooltip