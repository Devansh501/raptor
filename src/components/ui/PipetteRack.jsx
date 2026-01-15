import React, { useState, useEffect, useRef } from 'react';

// Helper to check if a chip is selected
const isSelected = (x, y, selected) => {
    return selected.some(p => p.x === x && p.y === y);
};

export const PipetteRack = ({ mode = 'single', value = [], onChange }) => {
    const rows = 8;
    const cols = 12;

    // Track the visual state of tips
    const [dragStartVal, setDragStartVal] = useState(null); // true = selecting, false = deselecting
    const gridRef = useRef(null);

    // Helper to get coordinates from a pointer event
    const getCoordsFromEvent = (e) => {
        // We use document.elementFromPoint to find the target element under cursor
        // because setPointerCapture on container means 'e.target' is always the container.
        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (!el) return null;

        // Check if the element has our data attributes
        const col = el.getAttribute('data-col');
        const row = el.getAttribute('data-row');

        if (col !== null && row !== null) {
            return { x: parseInt(col), y: parseInt(row) };
        }
        return null;
    };

    const handlePointerDown = (e) => {
        e.preventDefault(); // Prevent scrolling on touch
        const coords = getCoordsFromEvent(e);
        if (!coords) return;

        // Capture pointer on the GRID CONTAINER so we keep receiving events
        // even if we drag outside slightly, but mainly to track movement consistently.
        gridRef.current.setPointerCapture(e.pointerId);

        const { x, y } = coords;
        const currentlySelected = isSelected(x, y, value);
        const action = !currentlySelected; // If selected, we toggle to deselect. If not, we select.
        setDragStartVal(action);

        updateSelection(x, y, action);
    };

    const handlePointerMove = (e) => {
        if (dragStartVal === null) return; // Not dragging

        const coords = getCoordsFromEvent(e);
        if (!coords) return;

        const { x, y } = coords;
        updateSelection(x, y, dragStartVal);
    };

    const handlePointerUp = (e) => {
        if (dragStartVal !== null) {
            setDragStartVal(null);
            gridRef.current.releasePointerCapture(e.pointerId);
        }
    };

    const updateSelection = (x, y, shouldSelect) => {
        let newSelection = [...value];
        const isCurrentlySelected = isSelected(x, y, newSelection);

        // Optimization: Only update if state would actually change
        let changed = false;

        if (mode === 'single') {
            if (shouldSelect && !isCurrentlySelected) {
                newSelection.push({ x, y });
                changed = true;
            } else if (!shouldSelect && isCurrentlySelected) {
                newSelection = newSelection.filter(p => p.x !== x || p.y !== y);
                changed = true;
            }
        } else if (mode === 'multi') {
            // Toggle entire column
            // We check the state of the *target cell* (x,y) to decide, but we apply to the whole column.
            // Actually, in multi mode, dragging *across* columns should apply the action to that column.

            // For the specific column X:
            // Check if *any* in column is in the "wrong" state compared to shouldSelect? 
            // Or just force all to shouldSelect.

            for (let r = 0; r < rows; r++) {
                const rowSelected = isSelected(x, r, newSelection);
                if (shouldSelect && !rowSelected) {
                    newSelection.push({ x, y: r });
                    changed = true;
                } else if (!shouldSelect && rowSelected) {
                    newSelection = newSelection.filter(p => p.x !== x || p.y !== r);
                    changed = true;
                }
            }
        }

        if (changed) {
            onChange(newSelection);
        }
    };

    return (
        <div className="flex flex-row items-start gap-6 select-none">
            <div>
                {/* Column Labels */}
                <div className="flex gap-1 mb-1 pl-8">
                    {Array.from({ length: cols }).map((_, i) => (
                        <div key={i} className="w-7 text-center text-xs text-gray-400 font-mono">
                            {i + 1}
                        </div>
                    ))}
                </div>

                <div className="flex">
                    {/* Row Labels */}
                    <div className="flex flex-col justify-between py-2 pr-2">
                        {Array.from({ length: rows }).map((_, i) => (
                            <span key={i} className="text-xs text-gray-400 h-7 flex items-center font-mono">
                                {String.fromCharCode(65 + i)}
                            </span>
                        ))}
                    </div>

                    {/* Grid Container */}
                    <div
                        ref={gridRef}
                        className="grid gap-1 touch-none p-2 bg-slate-100 rounded-lg border border-slate-200 cursor-crosshair"
                        style={{
                            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
                        }}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        // Prevent context menu on right click/long press
                        onContextMenu={(e) => e.preventDefault()}
                    >
                        {Array.from({ length: rows }).map((_, r) => (
                            Array.from({ length: cols }).map((_, c) => {
                                const active = isSelected(c, r, value);
                                return (
                                    <div
                                        key={`${c}-${r}`}
                                        data-col={c}
                                        data-row={r}
                                        className={`
                                            w-7 h-7 rounded-full border shadow-sm transition-all duration-75
                                            flex items-center justify-center
                                            ${active
                                                ? 'bg-blue-500 border-blue-600 shadow-md scale-100'
                                                : 'bg-white border-slate-300 scale-90 opacity-50'}
                                        `}
                                    />
                                );
                            })
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side Info Panel */}
            <div className="flex flex-col gap-4 w-40 pt-6">
                <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm space-y-3">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Legend</h4>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                            <span>Available</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-3 h-3 bg-white border border-slate-300 rounded-full"></div>
                            <span>Empty</span>
                        </div>
                    </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{value.length}</div>
                    <div className="text-xs text-blue-600 font-medium">Tips Selected</div>
                </div>
            </div>
        </div>
    );
};
