import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "secondary" | "outline" | "ghost" | "danger"
    size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border disabled:opacity-50 disabled:pointer-events-none",
                    {
                        "bg-primary text-white hover:bg-black/80": variant === "default",
                        "bg-surface text-textMain hover:bg-surfaceHover border border-border/50": variant === "secondary",
                        "border border-border bg-transparent hover:bg-surface text-textMain": variant === "outline",
                        "bg-transparent hover:bg-surface text-textMain": variant === "ghost",
                        "bg-red-500 text-white hover:bg-red-600": variant === "danger",
                        "h-10 py-2 px-4": size === "default",
                        "h-9 px-3 rounded-lg": size === "sm",
                        "h-12 px-8 rounded-2xl text-base": size === "lg",
                        "h-10 w-10": size === "icon",
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
