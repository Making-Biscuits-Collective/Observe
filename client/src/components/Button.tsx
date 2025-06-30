import { MouseEventHandler, ReactNode } from "react";
import './Button.scss';

type ButtonType = "primary" | "outline" | "text" | "cta" | "invert" | "floating";
type ButtonSize = "small" | "large"

const LinkWrapper = ({url, children} : {url: string, children: ReactNode}) => (
    <a href={url} target="_blank" className="button-anchor">
        {children}
    </a>
)

const Button = (
    {
        variation, 
        label, 
        url, 
        onClick,
        size,
        disabled
    } : 
    {
        variation: ButtonType,
        label: string,
        url?: string,
        onClick?: MouseEventHandler<HTMLButtonElement>,
        size?: ButtonSize,
        disabled?: boolean
    }) =>
{
    return (
        <>
        <button 
            className={`${variation} ${size ?? ''}`} 
            onClick={onClick}
            { ... (disabled && { disabled }) }
        >
            {label}
        </button>
        </>
    )
}

export default Button;