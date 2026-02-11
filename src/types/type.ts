import type { ReactNode } from "react";

export interface Card {
    flipped: boolean;
    message: string;
}

export interface BaseCardProps {
    title?: string;
    subtitle?: string;
    children?: ReactNode;
    footer?: ReactNode;
    image?: string;
    className?: string;
    onClick?: () => void;
}