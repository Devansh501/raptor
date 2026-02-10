import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/Dialog';
import { Button } from './ui/Button';
import { Input, Label, Select } from './ui/Forms';
import { WellSelectionGrid, generateWells } from './WellSelectionGrid';

const WELLS_96 = generateWells();

export const TransferStepModal = ({
    open,
    onClose,
    step,
    labware = {},
    onSave,
}) => {
    const [localParams, setLocalParams] = useState(() => {
        const defaults = {
            pipette: 'left',
            volume: 50,
            source: { labwareId: null, wells: [] },
            dest: { labwareId: null, wells: [] }
        };
        return { ...defaults, ...step?.params };
    });

    const [activeTab, setActiveTab] = useState('source'); // 'source', 'dest', 'settings'

    useEffect(() => {
        if (open && step) {
            setLocalParams(prev => ({
                pipette: step.params?.pipette || 'left',
                volume: step.params?.volume || 50,
                source: step.params?.source || { labwareId: null, wells: [] },
                dest: step.params?.dest || { labwareId: null, wells: [] },
                ...step.params
            }));
        }
    }, [open, step]);

    // Helpers
    const handleWellClick = (type, wellId) => {
        setLocalParams(prev => {
            const currentWells = new Set(prev[type].wells);
            if (currentWells.has(wellId)) {
                currentWells.delete(wellId);
            } else {
                currentWells.add(wellId);
            }
            return {
                ...prev,
                [type]: {
                    ...prev[type],
                    wells: Array.from(currentWells)
                }
            };
        });
    };

    const handleLabwareChange = (type, labwareId) => {
        setLocalParams(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                labwareId,
                wells: [] // Reset wells on labware change
            }
        }));
    };

    const handleSelectAll = (type) => {
        setLocalParams(prev => {
            const currentCount = prev[type].wells.length;
            const newWells = currentCount === WELLS_96.length ? [] : [...WELLS_96];
            return {
                ...prev,
                [type]: {
                    ...prev[type],
                    wells: newWells
                }
            };
        });
    };

    const currentLabwareList = Object.values(labware).filter(l => !l.type.includes('trash'));

    const renderWellSelection = (type) => {
        const selectedLabwareId = localParams[type].labwareId;
        const selectedLabware = labware[selectedLabwareId];
        const selectedWells = new Set(localParams[type].wells);

        return (
            <div className="flex flex-col h-full p-4 space-y-2">
                <div className="flex items-end gap-6 border-b pb-2">
                    <div className="flex-1 space-y-2">
                        <Label className="text-slate-600">Select {type === 'source' ? 'Source' : 'Destination'} Labware</Label>
                        <Select
                            value={selectedLabwareId || ''}
                            onChange={(e) => handleLabwareChange(type, e.target.value)}
                            className="w-full max-w-md"
                        >
                            <option value="" disabled>Select Labware...</option>
                            {currentLabwareList.map(l => (
                                <option key={l.slot} value={l.slot}>{l.name} (Slot {l.slot})</option>
                            ))}
                        </Select>
                    </div>
                    {selectedLabwareId && (
                        <div className="pb-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {selectedWells.size} wells selected
                            </span>
                        </div>
                    )}
                </div>

                {selectedLabwareId ? (
                    <div className="flex-1 overflow-hidden flex flex-col relative">
                        <WellSelectionGrid
                            selectedWells={selectedWells}
                            onWellClick={(w) => handleWellClick(type, w)}
                        />
                        <div className="absolute top-2 right-2 z-10">
                            <Button variant="secondary" size="sm" onClick={() => handleSelectAll(type)} className="shadow-sm bg-white/90 backdrop-blur">
                                {selectedWells.size === WELLS_96.length ? 'Deselect All' : 'Select All'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 gap-2">
                        <div className="p-4 bg-slate-100 rounded-full">
                            {/* <Layers size={24} />  Import Layers if needed or leave implicit */}
                        </div>
                        <span className="font-medium">Select a labware to view wells</span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-6xl h-[85vh] min-h-[600px] flex flex-col p-0 overflow-hidden bg-slate-50">
                <DialogHeader className="px-6 py-4 border-b bg-white">
                    <DialogTitle className="text-xl font-bold text-slate-800">
                        Configure Transfer Step
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-64 bg-white border-r border-slate-200 flex flex-col p-4 gap-1">
                        <Label className="px-3 py-2 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Steps
                        </Label>
                        {[
                            { id: 'source', label: '1. Source' },
                            { id: 'dest', label: '2. Destination' },
                            { id: 'settings', label: '3. Settings' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                                    flex items-center justify-between
                                    ${activeTab === tab.id
                                        ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                                `}
                            >
                                {tab.label}
                                {activeTab === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-hidden bg-slate-50/50 flex flex-col">
                        <div className="flex-1 overflow-hidden flex flex-col">
                            {activeTab === 'source' && renderWellSelection('source')}
                            {activeTab === 'dest' && renderWellSelection('dest')}

                            {activeTab === 'settings' && (
                                <div className="p-8 space-y-8 max-w-lg">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Pipette Settings</h3>
                                        <div className="space-y-2">
                                            <Label>Pipette</Label>
                                            <Select
                                                value={localParams.pipette}
                                                onChange={(e) => setLocalParams(p => ({ ...p, pipette: e.target.value }))}
                                                className="w-full"
                                            >
                                                <option value="left">Left Pipette</option>
                                                <option value="right">Right Pipette</option>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Transfer Parameters</h3>
                                        <div className="space-y-2">
                                            <Label>Transfer Volume (µL)</Label>
                                            <Input
                                                type="number"
                                                value={localParams.volume}
                                                onChange={(e) => setLocalParams(p => ({ ...p, volume: e.target.value }))}
                                                className="w-full"
                                            />
                                            <p className="text-xs text-slate-500">
                                                Volume to aspire from source and dispense to destination.
                                            </p>
                                        </div>
                                    </div>
                                    {/* Further settings like mix, touch tip, etc. */}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-white">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button onClick={() => {
                        onSave(step.id, { params: localParams });
                        onClose();
                    }}>Save Step</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
