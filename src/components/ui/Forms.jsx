import React from 'react';
import { cn } from './Button';

// --- LABEL ---
export const Label = React.forwardRef(({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            className
        )}
        {...props}
    />
));
Label.displayName = "Label";

// --- INPUT ---
export const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            ref={ref}
            className={cn(
                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
    );
});
Input.displayName = "Input";

// --- TEXTAREA ---
export const Textarea = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <textarea
            ref={ref}
            className={cn(
                "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        />
    );
});
Textarea.displayName = "Textarea";

// --- SELECT (Native) ---
// Note: Styling native select is limited, but robust.
export const Select = React.forwardRef(({ className, children, ...props }, ref) => {
    return (
        <div className="relative w-full">
            <select
                ref={ref}
                className={cn(
                    "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
                    className
                )}
                {...props}
            >
                {children}
            </select>
            {/* Custom chevron if needed, but appearance-none removes default. Let's add functionality first. */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
        </div>
    )
})
Select.displayName = "Select";


// --- RADIO GROUP (Custom) ---
// Using a simplified version since building a full accessible RadioGroup without Radix is complex.
// We will just expose simple components to build it manually in the Wizard.
export const RadioCard = ({ checked, onClick, children, className }) => {
    return (
        <div
            onClick={onClick}
            data-state={checked ? "checked" : "unchecked"}
            className={cn(
                "cursor-pointer rounded-xl border-2 border-muted p-4 hover:border-primary/50 [&:has([data-state=checked])]:border-primary transition-all",
                checked ? "border-primary bg-secondary/20" : "bg-card",
                className
            )}
        >
            {children}
        </div>
    )
}
