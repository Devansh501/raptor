import React, { useState } from 'react';
import { Plus, Trash2, Droplets, Edit2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Input, Label } from './ui/Forms';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/Dialog';

const COLORS = [
    '#3b82f6', // Blue
    '#ef4444', // Red
    '#10b981', // Green
    '#f59e0b', // Yellow
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#6366f1', // Indigo
    '#14b8a6', // Teal
];

const LiquidFormModal = ({ open, onClose, onSave, initialLiquid = null }) => {
    const [name, setName] = useState(initialLiquid?.name || '');
    const [color, setColor] = useState(initialLiquid?.color || COLORS[0]);

    const handleSubmit = () => {
        if (!name) return;
        onSave({
            id: initialLiquid?.id,
            name,
            color
        });
        onClose();
        setName('');
        setColor(COLORS[0]);
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>{initialLiquid ? 'Edit Liquid' : 'New Liquid'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Liquid Name</Label>
                        <Input 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Water, Buffer A"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Display Color</Label>
                        <div className="flex flex-wrap gap-2">
                            {COLORS.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className={`w-8 h-8 rounded-full border-2 transition-all ${color === c ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-105'}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>{initialLiquid ? 'Save Changes' : 'Create Liquid'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export const LiquidManager = ({ liquids, onAdd, onUpdate, onDelete, onSelect, selectedLiquidId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLiquid, setEditingLiquid] = useState(null);

    const handleEdit = (e, liquid) => {
        e.stopPropagation();
        setEditingLiquid(liquid);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingLiquid(null);
        setIsModalOpen(true);
    };

    const liquidList = Object.values(liquids || {});

    return (
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-lg z-10 h-full">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Droplets size={14} /> Liquids
                </span>
                <span className="text-xs font-medium text-slate-400">{liquidList.length} defined</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {liquidList.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-sm">
                        No liquids defined.<br/>Create one to start.
                    </div>
                )}
                
                {liquidList.map(liquid => (
                    <div
                        key={liquid.id}
                        onClick={() => onSelect && onSelect(liquid.id)}
                        className={`
                            group relative p-3 rounded-lg border-2 cursor-pointer transition-all
                            flex items-center gap-3
                            ${selectedLiquidId === liquid.id 
                                ? 'border-slate-800 bg-slate-50 shadow-sm' 
                                : 'border-slate-100 hover:border-slate-200 bg-white'}
                        `}
                    >
                        <div 
                            className="w-4 h-10 rounded-full shrink-0" 
                            style={{ backgroundColor: liquid.color }}
                        />
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-800 truncate">{liquid.name}</h4>
                        </div>
                        
                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={(e) => handleEdit(e, liquid)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                            >
                                <Edit2 size={14} />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDelete(liquid.id); }}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50">
                <Button onClick={handleCreate} className="w-full gap-2">
                    <Plus size={16} /> New Liquid
                </Button>
            </div>

            <LiquidFormModal 
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={(data) => {
                    if (data.id) onUpdate(data.id, data);
                    else onAdd(data);
                }}
                initialLiquid={editingLiquid}
            />
        </div>
    );
};
