import React from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { useVirtualKeyboard } from '../context/VirtualKeyboardContext';
import { X } from 'lucide-react';

const VirtualKeyboard = () => {
    const { isVisible, inputValue, handleKeyboardInput, closeKeyboard, keyboardRef } = useVirtualKeyboard();

    // Force sync internal state when inputValue changes or component mounts
    React.useEffect(() => {
        if (keyboardRef.current) {
            keyboardRef.current.setInput(inputValue);
        }
    }, [inputValue, keyboardRef]);

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-[10000] bg-gray-900 border-t border-gray-700 shadow-lg pb-1 transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full visible-hidden pointer-events-none'}`}
        >
            <div className="flex justify-between items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
                <span className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Virtual Keyboard</span>
                <button
                    onClick={closeKeyboard}
                    className="p-1 rounded hover:bg-gray-700 transition-colors"
                >
                    <X className="h-5 w-5 text-gray-400" />
                </button>
            </div>
            <div className="px-2 pt-2 pb-2 bg-gray-900">
                <Keyboard
                    keyboardRef={r => (keyboardRef.current = r)}
                    onChange={handleKeyboardInput}
                    input={inputValue}
                    theme={"hg-theme-default hg-theme-dark"} // Use 'input' prop instead of 'value' to sync with simple-keyboard's internal state
                    layout={{
                        default: [
                            "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
                            "{tab} q w e r t y u i o p [ ] \\",
                            "{lock} a s d f g h j k l ; ' {enter}",
                            "{shift} z x c v b n m , . / {shift}",
                            ".com @ {space}"
                        ],
                        shift: [
                            "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
                            "{tab} Q W E R T Y U I O P { } |",
                            "{lock} A S D F G H J K L : \" {enter}",
                            "{shift} Z X C V B N M < > ? {shift}",
                            ".com @ {space}"
                        ]
                    }}
                    display={{
                        "{bksp}": "⌫",
                        "{enter}": "↵",
                        "{shift}": "⇧",
                        "{tab}": "Tab",
                        "{lock}": "Caps",
                        "{space}": "Space"
                    }}
                />
            </div>
        </div>
    );
};

export default VirtualKeyboard;
