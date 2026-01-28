import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/Dialog';
import { Button } from './ui/Button';
import { WellSelectionGrid, generateWells } from './WellSelectionGrid';

const WELLS_96 = generateWells();

export const LiquidAssignmentModal = ({ 
    open, 
    onClose, 
    labwareId, 
    labwareType, 
    currentAssignments = {}, 
    liquids = {}, 
    activeLiquidId, 
    onAssign 
}) => {
    const [selectedWells, setSelectedWells] = useState(new Set());
    
    // Reset selection when modal opens
    useEffect(() => {
        if (open) setSelectedWells(new Set());
    }, [open]);

    const handleWellClick = (wellId) => {
        const newSelection = new Set(selectedWells);
        if (newSelection.has(wellId)) {
            newSelection.delete(wellId);
        } else {
            newSelection.add(wellId);
        }
        setSelectedWells(newSelection);
    };

    const handleSelectAll = () => {
        if (selectedWells.size === WELLS_96.length) {
            setSelectedWells(new Set());
        } else {
            setSelectedWells(new Set(WELLS_96));
        }
    };

    const handleApply = () => {
        if (!activeLiquidId) return;
        // In a real app we'd ask for volume. For now assume full/standard volume or handle separate.
        onAssign(labwareId, Array.from(selectedWells), activeLiquidId, 100); 
        onClose();
    };

    const handleClear = () => {
         onAssign(labwareId, Array.from(selectedWells), null, 0);
         onClose();
    }

    const activeLiquid = liquids[activeLiquidId];

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <div className="flex justify-between items-center mr-8">
                        <DialogTitle>Assign Liquid to {labwareType}</DialogTitle>
                        {activeLiquid ? (
                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border">
                                <span className="text-xs text-slate-500">Selected Liquid:</span>
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: activeLiquid.color}}/>
                                <span className="font-bold text-sm">{activeLiquid.name}</span>
                            </div>
                        ) : (
                            <span className="text-sm text-amber-600 font-medium">Select a liquid from the sidebar first</span>
                        )}
                    </div>
                </DialogHeader>

                <WellSelectionGrid
                    selectedWells={selectedWells}
                    onWellClick={handleWellClick}
                    currentAssignments={currentAssignments}
                    liquids={liquids}
                />

                <DialogFooter className="justify-between">
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleSelectAll}>
                           {selectedWells.size === WELLS_96.length ? 'Deselect All' : 'Select All'}
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button variant="destructive" onClick={handleClear} disabled={selectedWells.size === 0}>
                            Clear Wells
                        </Button>
                        <Button onClick={handleApply} disabled={!activeLiquidId || selectedWells.size === 0}>
                            Assign Liquid
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
