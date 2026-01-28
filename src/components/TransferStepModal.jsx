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
            <div className="flex flex-col h-full space-y-4">
                <div className="flex items-end gap-4">
                    <div className="flex-1 space-y-1">
                        <Label>Select {type === 'source' ? 'Source' : 'Destination'} Labware</Label>
                        <Select 
                            value={selectedLabwareId || ''} 
                            onChange={(e) => handleLabwareChange(type, e.target.value)}
                        >
                            <option value="" disabled>Select Labware...</option>
                            {currentLabwareList.map(l => (
                                <option key={l.slot} value={l.slot}>{l.name} (Slot {l.slot})</option>
                            ))}
                        </Select>
                    </div>
                    {selectedLabwareId && (
                        <div className="pb-1">
                            <span className="text-xs font-medium text-slate-500">
                                {selectedWells.size} wells selected
                            </span>
                        </div>
                    )}
                </div>

                {selectedLabwareId ? (
                   <div className="flex-1 border rounded-lg overflow-hidden flex flex-col">
                       <WellSelectionGrid 
                            selectedWells={selectedWells}
                            onWellClick={(w) => handleWellClick(type, w)}
                       />
                       <div className="p-2 bg-slate-50 border-t flex justify-between items-center">
                            <Button variant="ghost" size="sm" onClick={() => handleSelectAll(type)}>
                                {selectedWells.size === WELLS_96.length ? 'Deselect All' : 'Select All'}
                            </Button>
                       </div>
                   </div>
                ) : (
                    <div className="flex-1 border-2 border-dashed rounded-lg flex items-center justify-center text-slate-400 bg-slate-50">
                        Select a labware to view wells
                    </div>
                )}
            </div>
        );
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-[95vw] h-[90vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b bg-white">
                    <DialogTitle>Configure Transfer Step</DialogTitle>
                </DialogHeader>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-48 bg-slate-50 border-r flex flex-col pt-4">
                        <button 
                            onClick={() => setActiveTab('source')}
                            className={`px-6 py-3 text-left font-medium text-sm border-l-4 transition-colors ${activeTab === 'source' ? 'bg-white border-blue-500 text-blue-700' : 'border-transparent text-slate-600 hover:bg-slate-100'}`}
                        >
                            1. Source
                        </button>
                        <button 
                            onClick={() => setActiveTab('dest')}
                            className={`px-6 py-3 text-left font-medium text-sm border-l-4 transition-colors ${activeTab === 'dest' ? 'bg-white border-blue-500 text-blue-700' : 'border-transparent text-slate-600 hover:bg-slate-100'}`}
                        >
                            2. Destination
                        </button>
                        <button 
                            onClick={() => setActiveTab('settings')}
                            className={`px-6 py-3 text-left font-medium text-sm border-l-4 transition-colors ${activeTab === 'settings' ? 'bg-white border-blue-500 text-blue-700' : 'border-transparent text-slate-600 hover:bg-slate-100'}`}
                        >
                            3. Settings
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-6 overflow-hidden bg-white">
                        {activeTab === 'source' && renderWellSelection('source')}
                        {activeTab === 'dest' && renderWellSelection('dest')}
                        
                        {activeTab === 'settings' && (
                            <div className="space-y-6 max-w-md">
                                <div className="space-y-2">
                                    <Label>Pipette</Label>
                                    <Select 
                                        value={localParams.pipette}
                                        onChange={(e) => setLocalParams(p => ({ ...p, pipette: e.target.value }))}
                                    >
                                        <option value="left">Left Pipette</option>
                                        <option value="right">Right Pipette</option>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Transfer Volume (µL)</Label>
                                    <Input 
                                        type="number"
                                        value={localParams.volume}
                                        onChange={(e) => setLocalParams(p => ({ ...p, volume: e.target.value }))}
                                    />
                                </div>
                                {/* Further settings like mix, touch tip, etc. */}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-slate-50">
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
