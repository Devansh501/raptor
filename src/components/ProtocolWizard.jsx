import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from './ui/Dialog';
import { Button } from './ui/Button';
import { Input, Label, Textarea, Select, RadioCard } from './ui/Forms';
import { Separator, Badge } from './ui/Layout';
import { Bot, Magnet, Thermometer, Waves, Repeat, FlaskConical, TestTube } from 'lucide-react';
import { useVirtualKeyboard } from '../context/VirtualKeyboardContext';
import { PipetteRack } from './ui/PipetteRack';

// --- Sub-Components ---

const Step1_Metadata = ({ formData, updateField }) => (
    <div className="space-y-4 py-4">
        <div className="space-y-2">
            <Label htmlFor="name">Protocol Name <span className="text-destructive">*</span></Label>
            <Input
                id="name"
                placeholder="e.g., PCR Prep - 96 Well Plate"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
            />
        </div>
        <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea
                id="desc"
                placeholder="Briefly describe the goal of this protocol..."
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
            />
        </div>
        <div className="space-y-2">
            <Label htmlFor="author">Organization / Author</Label>
            <Input
                id="author"
                value={formData.author}
                onChange={(e) => updateField('author', e.target.value)}
            />
        </div>
    </div>
);

const Step2_Hardware = ({ formData, updateField }) => {
    return (
        <div className="space-y-6 py-8 px-2">
            <div className="p-6 border rounded-xl bg-gray-50 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <TestTube className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Pipette Configuration</h3>
                        <p className="text-sm text-gray-500">Select the pipette properties for your protocol.</p>
                    </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <Label className="text-base">Channels</Label>
                        <Select
                            value={formData.pipetteChannels || 'single'}
                            onChange={(e) => updateField('pipetteChannels', e.target.value)}
                            className="h-12 text-lg"
                        >
                            <option value="single">Single Channel</option>
                            <option value="multi">8-Channel (Multi)</option>
                        </Select>
                        <p className="text-xs text-muted-foreground">Number of channels on the pipette.</p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-base">Capacity</Label>
                        <Select
                            value={formData.pipetteVol || 'p300'}
                            onChange={(e) => updateField('pipetteVol', e.target.value)}
                            className="h-12 text-lg"
                        >
                            <option value="p20">20 µL (P20)</option>
                            <option value="p300">300 µL (P300)</option>
                            <option value="p1000">1000 µL (P1000)</option>
                        </Select>
                        <p className="text-xs text-muted-foreground">Maximum volume capacity.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Step3_PipetteRack = ({ formData, updateField }) => {
    return (
        <div className="py-1 flex flex-col items-center">
            {/* <div className="mb-4 text-center">
                <h3 className="text-lg font-medium text-gray-900">Configure Pipette Rack</h3>
                <p className="text-sm text-muted-foreground">
                    {formData.pipetteChannels === 'multi'
                        ? "Select columns for 8-Channel pipette."
                        : "Select individual tips for Single Channel pipette."}
                </p>
            </div> */}

            <PipetteRack
                mode={formData.pipetteChannels}
                value={formData.activeTips}
                onChange={(newTips) => updateField('activeTips', newTips)}
            />
        </div>
    );
};

export function ProtocolWizard({ open, onOpenChange, onComplete }) {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const { isVisible } = useVirtualKeyboard();

    // --- State: Data ---
    const [formData, setFormData] = useState({
        // Step 1
        name: '',
        description: '',
        author: '',
        // Step 2
        pipetteChannels: 'single', // 'single' or 'multi'
        pipetteVol: 'p300',
        // Step 3 (Pipette Rack)
        activeTips: [], // Array of {x,y}
    });

    // Initialize tips on first load options
    // React.useEffect(() => {
    //     // Only if activeTips is empty (initial), let's populate it
    //     if (formData.activeTips.length === 0) {
    //         const allTips = [];
    //         for (let r = 0; r < 8; r++) {
    //             for (let c = 0; c < 12; c++) {
    //                 allTips.push({ x: c, y: r });
    //             }
    //         }
    //         setFormData(prev => ({ ...prev, activeTips: allTips }));
    //     }
    // }, []);

    const totalSteps = 3;
    const progress = (step / totalSteps) * 100;

    // --- Handlers ---
    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // --- Validation ---
    const canProceed = () => {
        if (step === 1) return formData.name.trim().length > 0;
        if (step === 2) return true; // Always valid with defaults
        return true;
    };

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
        else handleFinish();
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleFinish = () => {
        setIsLoading(true);
        // Simulate "Initializing Deck..."
        setTimeout(() => {
            setIsLoading(false);
            if (onComplete) onComplete(formData);
        }, 1000);
    };

    // --- Content Components ---

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="fixed inset-0 w-full max-w-none max-h-none m-0 rounded-none border-none flex flex-col p-6 transition-all duration-300 ease-in-out"
                style={{
                    bottom: isVisible ? '300px' : '0',
                    height: isVisible ? 'calc(100% - 300px)' : '100%',
                    maxHeight: '100vh',
                    top: 0
                }}
            >
                <DialogHeader>
                    <DialogTitle>New Protocol Setup</DialogTitle>
                    {/* Stepper */}
                    <div className="pt-4 pb-2">
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-500 ease-in-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
                            <span className={step >= 1 ? "text-primary font-medium" : ""}>Metadata</span>
                            <span className={step >= 2 ? "text-primary font-medium" : ""}>Pipette Setup</span>
                            <span className={step >= 3 ? "text-primary font-medium" : ""}>Pipette Rack</span>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-1 min-h-[300px]">
                    {step === 1 && <Step1_Metadata formData={formData} updateField={updateField} />}
                    {step === 2 && <Step2_Hardware formData={formData} updateField={updateField} />}
                    {step === 3 && <Step3_PipetteRack formData={formData} updateField={updateField} />}
                </div>

                <DialogFooter className="border-t pt-4 mt-2 shrink-0">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <div className="flex gap-2">
                        {step > 1 && (
                            <Button variant="outline" onClick={handleBack} disabled={isLoading}>
                                Back
                            </Button>
                        )}
                        <Button
                            onClick={handleNext}
                            disabled={!canProceed() || isLoading}
                            className="min-w-[100px]"
                        >
                            {isLoading ? (
                                <>Initializing...</>
                            ) : (
                                step === 3 ? "Create Protocol" : "Next Step"
                            )}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
