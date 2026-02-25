import React from 'react';

// --- Well ID generators ---

export const generateWells = (labwareDef) => {
    if (!labwareDef) return [];
    const { rows, columns } = labwareDef.specifications;
    if (rows === 1) {
        // Reservoir: wells identified by column number string
        return Array.from({ length: columns }, (_, i) => String(i + 1));
    }
    // Standard well plate: A1, A2, ... H12
    const wells = [];
    for (let r = 0; r < rows; r++) {
        const rowChar = String.fromCharCode(65 + r);
        for (let c = 1; c <= columns; c++) {
            wells.push(`${rowChar}${c}`);
        }
    }
    return wells;
};

// --- Internal renderers ---

const WellPlateGrid = ({ rows, columns, selectedWells, onWellClick, currentAssignments, liquids }) => {
    const rowChars = Array.from({ length: rows }, (_, i) => String.fromCharCode(65 + i));
    const colNums = Array.from({ length: columns }, (_, i) => i + 1);

    return (
        <div className="flex-1 flex flex-col overflow-hidden items-center justify-center p-2">
            <div className="h-full w-full max-h-full max-w-full">
                <div
                    className="grid gap-1.5 h-full w-full"
                    style={{ gridTemplateColumns: `30px repeat(${columns}, 1fr)`, gridTemplateRows: `30px repeat(${rows}, 1fr)` }}
                >
                    {/* Column header */}
                    <div />
                    {colNums.map(c => (
                        <div key={c} className="flex items-center justify-center font-bold text-[10px] text-slate-400">{c}</div>
                    ))}

                    {/* Rows */}
                    {rowChars.map(rowChar => (
                        <React.Fragment key={rowChar}>
                            <div className="flex items-center justify-center font-bold text-[10px] text-slate-400">{rowChar}</div>
                            {colNums.map(c => {
                                const wellId = `${rowChar}${c}`;
                                const assignment = currentAssignments[wellId];
                                const liquid = assignment ? liquids[assignment.liquidId] : null;
                                const isSelected = selectedWells.has(wellId);
                                return (
                                    <div
                                        key={wellId}
                                        onClick={() => onWellClick(wellId)}
                                        className={`
                                            w-full h-full rounded-full border-2 cursor-pointer relative
                                            transition-all duration-200 flex items-center justify-center
                                            ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 border-blue-500 z-10 scale-105' : ''}
                                            ${liquid ? 'border-transparent shadow-sm' : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50'}
                                        `}
                                        style={{ backgroundColor: liquid ? liquid.color : undefined }}
                                    >
                                        <span className={`text-[8px] font-bold select-none ${liquid ? 'text-white/90' : 'text-slate-300'}`}>
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

const ReservoirColumnGrid = ({ columns, selectedWells, onWellClick, currentAssignments, liquids }) => {
    return (
        <div className="flex-1 flex flex-col overflow-hidden items-center justify-center p-4">
            <div className="w-full h-full flex flex-col gap-2">
                {/* Column number header */}
                <div className="flex gap-2 px-1">
                    {Array.from({ length: columns }, (_, i) => (
                        <div key={i} className="flex-1 flex items-center justify-center font-bold text-[11px] text-slate-400">
                            {i + 1}
                        </div>
                    ))}
                </div>
                {/* Tall column wells */}
                <div className="flex gap-2 flex-1 min-h-0">
                    {Array.from({ length: columns }, (_, i) => {
                        const wellId = String(i + 1);
                        const assignment = currentAssignments[wellId];
                        const liquid = assignment ? liquids[assignment.liquidId] : null;
                        const isSelected = selectedWells.has(wellId);
                        return (
                            <div
                                key={wellId}
                                onClick={() => onWellClick(wellId)}
                                className={`
                                    flex-1 rounded-lg border-2 cursor-pointer
                                    transition-all duration-200 flex items-end justify-center pb-2
                                    ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1 border-blue-500 scale-[1.03] z-10' : ''}
                                    ${liquid ? 'border-transparent shadow-sm' : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50'}
                                `}
                                style={{ backgroundColor: liquid ? liquid.color : undefined }}
                            >
                                <span className={`text-[9px] font-bold select-none ${liquid ? 'text-white/90' : 'text-slate-300'}`}>
                                    {wellId}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const SingleWellReservoir = ({ selectedWells, onWellClick, currentAssignments, liquids, labwareDef }) => {
    const wellId = '1';
    const assignment = currentAssignments[wellId];
    const liquid = assignment ? liquids[assignment.liquidId] : null;
    const isSelected = selectedWells.has(wellId);
    return (
        <div className="flex-1 flex items-center justify-center p-6">
            <div
                onClick={() => onWellClick(wellId)}
                className={`
                    w-full max-w-sm h-40 rounded-2xl border-2 cursor-pointer
                    transition-all duration-200 flex flex-col items-center justify-center gap-2
                    ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 border-blue-500' : ''}
                    ${liquid ? 'border-transparent shadow-md' : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50'}
                `}
                style={{ backgroundColor: liquid ? liquid.color : undefined }}
            >
                <span className={`text-base font-bold select-none ${liquid ? 'text-white/90' : 'text-slate-400'}`}>
                    {labwareDef?.name ?? 'Reservoir'}
                </span>
                {labwareDef?.specifications?.maxVolume && (
                    <span className={`text-xs select-none ${liquid ? 'text-white/70' : 'text-slate-300'}`}>
                        {(labwareDef.specifications.maxVolume / 1000).toFixed(0)} mL
                    </span>
                )}
            </div>
        </div>
    );
};

// --- Public smart selector ---

export const WellSelector = ({
    labwareDef,
    selectedWells = new Set(),
    onWellClick,
    currentAssignments = {},
    liquids = {}
}) => {
    if (!labwareDef) {
        return (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                No labware definition available.
            </div>
        );
    }

    const { rows, columns } = labwareDef.specifications;

    if (rows === 1 && columns === 1) {
        return (
            <SingleWellReservoir
                selectedWells={selectedWells}
                onWellClick={onWellClick}
                currentAssignments={currentAssignments}
                liquids={liquids}
                labwareDef={labwareDef}
            />
        );
    }

    if (rows === 1) {
        return (
            <ReservoirColumnGrid
                columns={columns}
                selectedWells={selectedWells}
                onWellClick={onWellClick}
                currentAssignments={currentAssignments}
                liquids={liquids}
            />
        );
    }

    return (
        <WellPlateGrid
            rows={rows}
            columns={columns}
            selectedWells={selectedWells}
            onWellClick={onWellClick}
            currentAssignments={currentAssignments}
            liquids={liquids}
        />
    );
};

// Keep old export for any remaining consumers that still import WellSelectionGrid directly
export const WellSelectionGrid = WellSelector;
