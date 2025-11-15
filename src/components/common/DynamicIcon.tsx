import * as Icons from "lucide-react";
import React from "react";

interface DynamicIconProps {
    iconString: string; // e.g. "<ArrowBigDown />"
    className?: string;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ iconString, className }) => {
    // Remove "<" and "/>" to get the icon name
    const iconName = iconString.replace(/[<>/ ]/g, ""); // "ArrowBigDown"

    // Get the icon component
    const IconComponent = (Icons as unknown as Record<string, React.ElementType>)[iconName];

    if (!IconComponent) return null; // fallback

    return <IconComponent className={className} />;
};

export default DynamicIcon;
