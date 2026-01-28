import React from 'react';

// Helper to generate well IDs for a 96-well plate (A1-H12)
export const generateWells = (rows = 8, cols = 12) => {
    const wells = [];
    for (let r = 0; r < rows; r++) {
        const rowChar = String.fromCharCode(65 + r);
        for (let c = 1; c <= cols; c++) {
            wells.push(`${rowChar}${c}`);
        }
    }
    return wells;
};

export const WellSelectionGrid = ({ 
    selectedWells = new Set(), 
    onWellClick, 
    currentAssignments = {}, 
    liquids = {} 
}) => {
    return (
        <div className="flex-1 p-4 bg-slate-50 border rounded-lg flex flex-col overflow-hidden">
             {/* Container to fill space */}
            <div className="w-full h-full flex flex-col">
                <div className="grid grid-cols-[30px_repeat(12,1fr)] grid-rows-[30px_repeat(8,1fr)] gap-1 h-full">
                    {/* Header Row */}
                    <div />
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-center font-bold text-xs text-slate-400">
                            {i + 1}
                        </div>
                    ))}

                    {/* Rows */}
                    {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((rowChar) => (
                        <React.Fragment key={rowChar}>
                            <div className="flex items-center justify-center font-bold text-xs text-slate-400">
                                {rowChar}
                            </div>
                            {Array.from({ length: 12 }).map((_, i) => {
                                const wellId = `${rowChar}${i + 1}`;
                                const assignment = currentAssignments[wellId];
                                const liquid = assignment ? liquids[assignment.liquidId] : null;
                                const isSelected = selectedWells.has(wellId);

                                return (
                                    <div
                                        key={wellId}
                                        onClick={() => onWellClick(wellId)}
                                        className={`
                                            w-full h-full rounded-full border-2 cursor-pointer relative
                                            transition-all flex items-center justify-center
                                            ${isSelected ? 'ring-4 ring-blue-500 ring-offset-2 z-10' : ''}
                                            ${liquid ? 'border-transparent' : 'border-slate-300 bg-white hover:border-slate-400'}
                                        `}
                                        style={{
                                            backgroundColor: liquid ? liquid.color : undefined
                                        }}
                                    >
                                        <span className={`text-[10px] font-medium select-none ${liquid ? 'text-white/90' : 'text-slate-300'}`}>
                                            {wellId}
                                        </span>
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};
