import React, { useEffect, useState } from 'react';
import { cn } from './Button'; // Re-use cn from Button or move it to a utils file.
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/* 
  Simplified Dialog without Radix.
  Props: open (bool), onOpenChange (fn), children (node)
*/

export const Dialog = ({ open, onOpenChange, children }) => {
    if (!open) return null;
    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop - lighter blur */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
                onClick={() => onOpenChange(false)}
            />
            {/* Content Wrapper - ensures centering */}
            <div className="relative z-50 flex flex-col items-center justify-center w-full max-w-lg">
                {children}
            </div>
        </div>,
        document.body
    );
};

export const DialogContent = ({ children, className }) => (
    <div className={cn(
        "grid w-full gap-4 border bg-white p-6 shadow-xl rounded-xl duration-200 animate-in fade-in-0 zoom-in-95",
        className
    )}>
        {children}
    </div>
);

export const DialogHeader = ({ className, ...props }) => (
    <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);

export const DialogFooter = ({ className, ...props }) => (
    <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);

export const DialogTitle = ({ className, ...props }) => (
    <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
);

export const DialogDescription = ({ className, ...props }) => (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);

export const DialogClose = ({ onClick }) => (
    <button onClick={onClick} className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
    </button>
)
