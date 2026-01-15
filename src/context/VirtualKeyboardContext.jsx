import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const VirtualKeyboardContext = createContext();

export const useVirtualKeyboard = () => useContext(VirtualKeyboardContext);

export const VirtualKeyboardProvider = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeInput, setActiveInput] = useState(null); // Ref to the active input element
    const [inputValue, setInputValue] = useState("");
    const keyboardRef = useRef(null);

    // Global listener for focus events
    useEffect(() => {
        const handleFocus = (e) => {
            const target = e.target;
            // Check if the target is an input or textarea
            const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

            // Check if the target is explicitly excluded (optional, e.g. for non-text inputs)
            const type = target.getAttribute('type');
            const isTextType = !type || ['text', 'password', 'number', 'email', 'search', 'url', 'tel'].includes(type);

            if (isInput && isTextType && !target.readOnly) {
                setActiveInput(target);
                setInputValue(target.value);
                setIsVisible(true);

                // Sync the internal state of the virtual keyboard
                if (keyboardRef.current) {
                    keyboardRef.current.setInput(target.value);
                }

                // Scroll the input into view to prevent obstruction by the keyboard
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
                    }, 300);
                });
            }
        };

        // Use capture phase to ensure we catch focus events even if propagation is stopped
        document.addEventListener('focus', handleFocus, true);

        return () => {
            document.removeEventListener('focus', handleFocus, true);
        };
    }, []);

    // Also listen for clicks outside the keyboard or input to close it? 
    // Maybe unnecessary if we have a close button. Let's keep it simple for now.

    const handleKeyboardInput = (input) => {
        setInputValue(input);

        if (activeInput) {
            // Update the input's value directly
            // This is a bit hacky but needed for React to recognize the change
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                "value"
            ).set;

            const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLTextAreaElement.prototype,
                "value"
            ).set;

            const setter = activeInput.tagName === 'TEXTAREA' ? nativeTextAreaValueSetter : nativeInputValueSetter;

            if (setter) {
                setter.call(activeInput, input);

                // Dispatch input event so React state updates
                const event = new Event('input', { bubbles: true });
                activeInput.dispatchEvent(event);
            }
        }
    };

    const closeKeyboard = () => {
        setIsVisible(false);
        setActiveInput(null);
    };

    return (
        <VirtualKeyboardContext.Provider value={{ isVisible, inputValue, setInputValue, handleKeyboardInput, closeKeyboard, keyboardRef }}>
            {children}
        </VirtualKeyboardContext.Provider>
    );
};
