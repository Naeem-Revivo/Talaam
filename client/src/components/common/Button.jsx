// Button.jsx
import React from "react";

export const OutlineButton = ({
    text,
    onClick,
    icon,
    width = "",
    className = ""
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                h-[36px] rounded-md border border-[#E5E7EB] bg-white 
                text-[16px] font-roboto font-medium leading-[16px] text-oxford-blue 
                transition hover:bg-[#F3F4F6] flex items-center justify-center gap-2
                ${className}
            `}
            style={{ width }}
        >
            {icon && <span>{icon}</span>}
            {text}
        </button>
    );
};

export const PrimaryButton = ({
    text,
    onClick,
    width = "",
    className = ""
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                h-[36px] rounded-md bg-[#ED4122] text-[16px] font-archivo 
                font-semibold leading-[16px] text-white transition hover:bg-[#d43a1f]
                ${className}
            `}
            style={{ width }}
        >
            {text}
        </button>
    );
};
