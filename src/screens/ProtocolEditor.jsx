import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Separator } from '../components/ui/Layout';
import {
    ArrowLeft,
    Play,
    Plus,
    MoreVertical,
    FlaskConical,
    TestTube,
    Trash2,
    Settings,
    Grid as GridIcon,
    Layers,
    FileText,
    Move,
    Pause,
    Droplets
} from 'lucide-react';
import { INITIAL_PROTOCOL_STATE, ProtocolStateManager } from '../utils/ProtocolState';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/Dialog';
import { Input, Label, Select } from '../components/ui/Forms';
import { LiquidManager } from '../components/LiquidManager';
import { LiquidAssignmentModal } from '../components/LiquidAssignmentModal';
import { TransferStepModal } from '../components/TransferStepModal';
import { getLabwareDefinitions, getLabwareCategories, getLabwareByCategory } from '../utils/labwareUtils';

// --- SUB-COMPONENTS ---

// 1. Step Card (Timeline Item)
const StepCard = ({ step, index, isSelected, onClick }) => {
    const isSetup = step.type === 'initial_deck_setup';

    return (
        <div
            onClick={() => onClick(step)}
            className={`
                relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer select-none
                flex items-start gap-4 mb-3
                ${isSelected
                    ? 'border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-200'
                    : 'border-white bg-white hover:border-gray-300 shadow-sm'}
            `}
        >
            {/* Step Number Badge */}
            <div className={`
                flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shrink-0 mt-0.5
                ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}
            `}>
                {isSetup ? <GridIcon size={16} /> : index}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h4 className={`text-base font-semibold truncate ${isSelected ? 'text-blue-900' : 'text-gray-800'}`}>
                    {step.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {step.description || "No parameters configured"}
                </p>
            </div>

            {/* Drag Handle / Menu (Placeholder) */}
            <div className="text-gray-300">
                <MoreVertical size={20} />
            </div>
        </div>
    );
};

// 2. Deck Slot (Interactive Grid Item)
const DeckSlot = ({ slotId, labware, isActive, onClick, liquidState, liquids }) => {
    // Check if any wells have liquids assigned
    const hasLiquids = liquidState && Object.keys(liquidState).length > 0;

    // Get unique liquid colors used in this labware
    const uniqueColors = hasLiquids
        ? [...new Set(Object.values(liquidState).map(l => liquids[l.liquidId]?.color).filter(Boolean))]
        : [];

    return (
        <div
            onClick={() => onClick(slotId)}
            className={`
                relative w-full h-full rounded-lg border-2 transition-all duration-200 
                flex flex-col items-center justify-center p-1 overflow-hidden
                ${isActive
                    ? 'border-blue-500 bg-blue-50/30' // Active target state
                    : 'border-dashed border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-100 cursor-pointer'}
            `}
        >
            {labware ? (
                // Occupied Slot View
                <div className="w-full h-full bg-white rounded shadow-sm border border-slate-200 flex flex-col items-center justify-center p-1 text-center pointer-events-none relative overflow-hidden">
                    {/* Liquid Indicator Overlay */}
                    {hasLiquids && (
                        <div className="absolute top-0 right-0 p-1 flex gap-0.5">
                            {uniqueColors.slice(0, 3).map((color, i) => (
                                <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                            ))}
                            {uniqueColors.length > 3 && <div className="w-2 h-2 rounded-full bg-gray-300" />}
                        </div>
                    )}

                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1 shrink-0">
                        {labware.type.includes('tip') ? <Layers size={14} /> :
                            labware.type.includes('trash') ? <Trash2 size={14} /> :
                                <FlaskConical size={14} />}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700 line-clamp-2 leading-tight">
                        {labware.name}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider">
                        {labware.category || labware.type}
                    </span>
                </div>
            ) : (
                // Empty Slot View
                <span className="text-xl font-bold text-gray-300 select-none">{slotId}</span>
            )}

            {/* Hover/Interaction Overlay could go here */}
        </div>
    );
};


// 3. Configuration Modals
const StepConfigModal = ({ step, open, onClose, onSave, onDelete }) => {
    const [localParams, setLocalParams] = useState(step?.params || {});

    useEffect(() => {
        if (open && step) {
            setLocalParams(step.params || {});
        }
    }, [open, step]);

    if (!step) return null;

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-2xl min-h-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            {step.type === 'transfer' && <Move size={24} />}
                            {step.type === 'pause' && <Pause size={24} />}
                            {step.type === 'mix' && <FlaskConical size={24} />}
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Configure {step.title}</DialogTitle>
                            <p className="text-sm text-muted-foreground">Step ID: {step.id}</p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-6 space-y-6">
                    {/* Placeholder Form Fields */}
                    {step.type === 'transfer' && (
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Volume (µL)</Label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 50"
                                    className="h-12 text-lg"
                                    value={localParams.volume || ''}
                                    onChange={e => setLocalParams({ ...localParams, volume: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Pipette</Label>
                                <Select className="h-12">
                                    <option>Left Pipette (P300)</option>
                                </Select>
                            </div>
                            {/* Source and Dest selection logic would be complex, simplified here */}
                            <div className="col-span-2 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
                                <p className="text-sm text-gray-500">Tap slots on the deck behind to select source/dest (Mock)</p>
                            </div>
                        </div>
                    )}

                    {step.type === 'pause' && (
                        <div className="space-y-4">
                            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-amber-800">
                                This step will pause the protocol until the user resumes it manually.
                            </div>
                            <div className="space-y-2">
                                <Label>Message to User</Label>
                                <Input
                                    placeholder="e.g. Refill tips needed"
                                    className="h-12"
                                    value={localParams.message || ''}
                                    onChange={e => setLocalParams({ ...localParams, message: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex justify-between items-center sm:justify-between">
                    <Button variant="destructive" onClick={() => onDelete(step.id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Step
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button onClick={() => onSave(step.id, { params: localParams })}>Save Changes</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const LabwareModal = ({ slotId, currentLabware, open, onClose, onSave, onRemove }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const categories = getLabwareCategories();

    // Set default category on open
    useEffect(() => {
        if (open && categories.length > 0 && !selectedCategory) {
            setSelectedCategory(categories[0]);
        }
    }, [open, categories, selectedCategory]);

    const displayedLabware = selectedCategory ? getLabwareByCategory(selectedCategory) : [];
    if (!slotId) return null;

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-4xl min-h-[500px] flex flex-col p-0 overflow-hidden bg-slate-50">
                <DialogHeader className="p-4 pb-3 border-b bg-white">
                    <DialogTitle className="text-lg font-bold text-slate-800">
                        Select Labware for <span className="text-blue-600">Slot {slotId}</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-1 overflow-hidden">
                    {/* Categories Sidebar */}
                    <div className="w-56 bg-white border-r border-slate-200 flex flex-col p-3 gap-1 overflow-y-auto">
                        <Label className="px-3 py-2 mb-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Categories
                        </Label>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`
                                    w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200
                                    flex items-center justify-between
                                    ${selectedCategory === cat
                                        ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                                `}
                            >
                                {cat}
                                {selectedCategory === cat && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                            </button>
                        ))}
                    </div>

                    {/* Labware List */}
                    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4">
                        <div className="grid grid-cols-2 gap-3">
                            {displayedLabware.map(lw => (
                                <div
                                    key={lw.id}
                                    onClick={() => onSave(slotId, { type: lw.id, name: lw.name, category: lw.category })}
                                    className={`
                                        group relative bg-white p-3 rounded-xl border transition-all duration-200 cursor-pointer
                                        hover:shadow-md hover:-translate-y-0.5
                                        ${currentLabware?.type === lw.id
                                            ? 'border-blue-500 ring-1 ring-blue-500 shadow-md'
                                            : 'border-slate-200 hover:border-blue-300 shadow-sm'}
                                    `}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`
                                            w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors
                                            ${currentLabware?.type === lw.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500'}
                                        `}>
                                            <Layers size={20} strokeWidth={1.5} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                                    {lw.company}
                                                </span>
                                                {currentLabware?.type === lw.id && (
                                                    <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                                        Selected
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className={`text-xs font-bold leading-tight mb-2 ${currentLabware?.type === lw.id ? 'text-blue-900' : 'text-slate-800'}`}>
                                                {lw.name}
                                            </h4>

                                            {/* Specifications */}
                                            <div className="flex flex-wrap gap-2">
                                                <div className="flex flex-col px-2 py-0.5 bg-slate-50 rounded border border-slate-100 min-w-[50px]">
                                                    <span className="text-[8px] text-slate-400 uppercase">Wells</span>
                                                    <span className="text-[10px] font-semibold text-slate-700">{lw.specifications.wellCount}</span>
                                                </div>
                                                <div className="flex flex-col px-2 py-0.5 bg-slate-50 rounded border border-slate-100 min-w-[50px]">
                                                    <span className="text-[8px] text-slate-400 uppercase">Max Vol</span>
                                                    <span className="text-[10px] font-semibold text-slate-700">{lw.specifications.maxVolume} µL</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-4 border-t bg-white">
                    {currentLabware && (
                        <Button variant="destructive" onClick={() => onRemove(slotId)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Remove Labware
                        </Button>
                    )}
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


// --- MAIN COMPONENT ---

export function ProtocolEditor({ protocol: initialProtocol, onBack }) {
    // State
    const [protocol, setProtocol] = useState(initialProtocol || INITIAL_PROTOCOL_STATE);
    const [stateManager] = useState(new ProtocolStateManager(initialProtocol || INITIAL_PROTOCOL_STATE));

    // UI State
    const [viewMode, setViewMode] = useState('deck'); // 'deck' or 'liquids'
    const [selectedStepId, setSelectedStepId] = useState(null); // 'deck_setup' or step ID
    const [activeModal, setActiveModal] = useState(null); // 'step_config', 'labware_config', 'liquid_assignment'
    const [editingSlot, setEditingSlot] = useState(null); // Valid when activeModal === 'labware_config' or 'liquid_assignment'
    const [selectedLiquidId, setSelectedLiquidId] = useState(null); // For LiquidManager

    // Initialize with a mock step if empty
    useEffect(() => {
        setProtocol(prev => {
            if (prev.steps.some(s => s.id === 'deck_setup')) {
                return prev;
            }
            const setupStep = { id: 'deck_setup', type: 'initial_deck_setup', title: 'Deck Setup', description: 'Configure initial labware layout' };
            return { ...prev, steps: [setupStep, ...prev.steps] };
        });
        setSelectedStepId(prev => prev || 'deck_setup');
    }, []);

    // --- Actions ---

    const handleAddStep = (type) => {
        const newState = stateManager.addStep(type);
        // We sync local state to "manager" mostly manually here for simplicity, 
        // in a real app this would be more reactive
        setProtocol(newState);
        stateManager.state = newState;

        // Auto select the new step and open config
        const newStep = newState.steps[newState.steps.length - 1]; // Assume appended
        setSelectedStepId(newStep.id);
        setActiveModal('step_config');
    };

    const handleUpdateStep = (id, updates) => {
        const newState = stateManager.updateStep(id, updates);
        setProtocol(newState);
        stateManager.state = newState;
        setActiveModal(null);
    };

    const handleDeleteStep = (id) => {
        const newState = stateManager.deleteStep(id);
        setProtocol(newState);
        stateManager.state = newState;
        setActiveModal(null);
        setSelectedStepId('deck_setup');
    };

    const handleSlotClick = (slotId) => {
        setEditingSlot(slotId);
        if (viewMode === 'liquids') {
            // Only if labware exists
            if (protocol.labware && protocol.labware[slotId]) {
                setActiveModal('liquid_assignment');
            }
        } else {
            setActiveModal('labware_config');
        }
    };

    const handleLabwareSet = (slot, def) => {
        const newState = stateManager.addLabware(slot, def);
        setProtocol(newState);
        stateManager.state = newState;
        setActiveModal(null);
    };

    const handleLabwareRemove = (slot) => {
        const newState = stateManager.removeLabware(slot);
        setProtocol(newState);
        stateManager.state = newState;
        setActiveModal(null);
    }

    // --- Liquid Actions ---

    const handleAddLiquid = (liquid) => {
        const newState = stateManager.addLiquid(liquid);
        setProtocol(newState);
        stateManager.state = newState;
    };

    const handleUpdateLiquid = (id, updates) => {
        const newState = stateManager.updateLiquid(id, updates);
        setProtocol(newState);
        stateManager.state = newState;
    };

    const handleDeleteLiquid = (id) => {
        const newState = stateManager.deleteLiquid(id);
        setProtocol(newState);
        stateManager.state = newState;
        // If the selected liquid was deleted, deselect it
        if (selectedLiquidId === id) setSelectedLiquidId(null);
    };

    const handleAssignLiquid = (labwareId, wells, liquidId, volume) => {
        const newState = stateManager.assignLiquid(labwareId, wells, liquidId, volume);
        setProtocol(newState);
        stateManager.state = newState;
    };

    // --- Render Helpers ---

    const renderDeck = () => {
        // Opentrons definition: 
        // 12 slots. 
        // Row 3 (Back): 10, 11, 12(Trash)
        // Row 2: 7, 8, 9
        // Row 1: 4, 5, 6
        // Row 0 (Front): 1, 2, 3

        const SLOTS = [
            ['10', '11', '12'],
            ['7', '8', '9'],
            ['4', '5', '6'],
            ['1', '2', '3']
        ];

        return (
            <div className="w-full max-w-2xl h-full max-h-[420px] p-4 flex flex-col justify-center">
                <div className="grid grid-rows-4 gap-3 h-full">
                    {SLOTS.map((row, rIndex) => (
                        <div key={rIndex} className="grid grid-cols-3 gap-3">
                            {row.map(id => (
                                <DeckSlot
                                    key={id}
                                    slotId={id}
                                    labware={protocol.labware?.[id]}
                                    liquidState={protocol.liquidState?.[id]}
                                    liquids={protocol.liquids}
                                    onClick={handleSlotClick}
                                />
                            ))}
                        </div>
                    ))}
                </div>
                <div className="mt-2 flex justify-center text-gray-400 font-mono text-[10px] tracking-widest uppercase shrink-0">
                    Front of Robot
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 overflow-hidden font-sans">
            {/* Top Bar */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-500 hover:text-slate-800">
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">{protocol.metadata.name}</h2>
                        <p className="text-xs text-slate-500">Last saved just now</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2">
                        <FileText size={16} /> Protocol File
                    </Button>
                    <Button className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200">
                        <Play size={16} fill="currentColor" /> Run Protocol
                    </Button>
                </div>
            </header>

            {/* Main Workspace */}
            <div className="flex flex-1 overflow-hidden">

                {/* 1. LEFT SIDEBAR (Timeline or Liquids) */}
                {viewMode === 'liquids' ? (
                    <LiquidManager
                        liquids={protocol.liquids}
                        onAdd={handleAddLiquid}
                        onUpdate={handleUpdateLiquid}
                        onDelete={handleDeleteLiquid}
                        onSelect={setSelectedLiquidId}
                        selectedLiquidId={selectedLiquidId}
                    />
                ) : (
                    <div className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-lg shadow-slate-200/50 z-10">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Protocol Timeline</span>
                            <span className="text-xs font-medium text-slate-400">{protocol.steps.length} Steps</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-1">
                            {protocol.steps.map((step, index) => (
                                <StepCard
                                    key={step.id}
                                    step={step}
                                    index={index} // Note: deck_setup doesn't use index visually
                                    isSelected={selectedStepId === step.id}
                                    onClick={(s) => {
                                        setSelectedStepId(s.id);
                                        if (s.type !== 'initial_deck_setup') {
                                            setActiveModal('step_config');
                                        }
                                    }}
                                />
                            ))}
                        </div>

                        {/* Add Step Toolbar */}
                        <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2 overflow-x-auto">
                            <Button
                                variant="outline"
                                className="flex-1 gap-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 text-slate-600"
                                onClick={() => handleAddStep('transfer')}
                            >
                                <Move size={16} /> Transfer
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 gap-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 text-slate-600"
                                onClick={() => handleAddStep('pause')}
                            >
                                <Pause size={16} /> Pause
                            </Button>
                            {/* More options... */}
                        </div>
                    </div>
                )}

                {/* 2. MAIN STAGE (Deck Map) */}
                <div className="flex-1 bg-slate-100/50 relative overflow-hidden flex flex-col">
                    {/* View Toggle / Breadcrumbs */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur rounded-full border shadow-sm px-4 py-1.5 flex gap-4 text-sm font-medium text-slate-600 z-10">
                        <span
                            onClick={() => setViewMode('deck')}
                            className={`flex items-center gap-1 cursor-pointer transition-colors ${viewMode === 'deck' ? 'text-blue-600' : 'hover:text-blue-600'}`}
                        >
                            <GridIcon size={14} /> Deck View
                        </span>
                        <span className="text-slate-300">|</span>
                        <span
                            onClick={() => setViewMode('liquids')}
                            className={`flex items-center gap-1 cursor-pointer transition-colors ${viewMode === 'liquids' ? 'text-blue-600' : 'hover:text-blue-600'}`}
                        >
                            <Droplets size={14} /> Liquids
                        </span>
                    </div>

                    <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
                        {renderDeck()}
                    </div>
                </div>

            </div>

            {/* --- MODALS --- */}

            {activeModal === 'step_config' && protocol.steps.find(s => s.id === selectedStepId)?.type === 'transfer' ? (
                <TransferStepModal
                    open={activeModal === 'step_config'}
                    step={protocol.steps.find(s => s.id === selectedStepId)}
                    labware={protocol.labware}
                    onClose={() => setActiveModal(null)}
                    onSave={handleUpdateStep}
                />
            ) : (
                <StepConfigModal
                    open={activeModal === 'step_config'}
                    step={protocol.steps.find(s => s.id === selectedStepId)}
                    onClose={() => setActiveModal(null)}
                    onSave={handleUpdateStep}
                    onDelete={handleDeleteStep}
                />
            )}

            <LabwareModal
                open={activeModal === 'labware_config'}
                slotId={editingSlot}
                currentLabware={protocol.labware?.[editingSlot]}
                onClose={() => setActiveModal(null)}
                onSave={handleLabwareSet}
                onRemove={handleLabwareRemove}
            />

            <LiquidAssignmentModal
                open={activeModal === 'liquid_assignment'}
                labwareId={editingSlot}
                labwareType={protocol.labware?.[editingSlot]?.name} // Pass name or type for display
                currentAssignments={protocol.liquidState?.[editingSlot]}
                liquids={protocol.liquids}
                activeLiquidId={selectedLiquidId}
                onClose={() => setActiveModal(null)}
                onAssign={handleAssignLiquid}
            />

        </div>
    );
}
