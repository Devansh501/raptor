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
                className="fixed inset-0 w-full max-w-none max-h-none m-0 rounded-none border-none flex flex-row p-0 transition-all duration-300 ease-in-out bg-white"
                style={{
                    bottom: isVisible ? '300px' : '0',
                    height: isVisible ? 'calc(100% - 300px)' : '100%',
                    maxHeight: '100vh',
                    top: 0
                }}
            >
                {/* Left Side: Wizard Content */}
                <div className="flex flex-col w-full lg:w-[55%] p-8 md:p-12 relative z-10 bg-white min-h-full">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-3xl font-bold text-gray-900 tracking-tight">New Protocol Setup</DialogTitle>
                        {/* Stepper */}
                        <div className="pt-6 pb-2">
                            <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500 ease-in-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-sm font-medium text-muted-foreground mt-3 px-1">
                                <span className={step >= 1 ? "text-primary font-bold" : ""}>Metadata</span>
                                <span className={step >= 2 ? "text-primary font-bold" : ""}>Pipette Setup</span>
                                <span className={step >= 3 ? "text-primary font-bold" : ""}>Pipette Rack</span>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto pr-4 -mr-4 pb-8">
                        {step === 1 && <Step1_Metadata formData={formData} updateField={updateField} />}
                        {step === 2 && <Step2_Hardware formData={formData} updateField={updateField} />}
                        {step === 3 && <Step3_PipetteRack formData={formData} updateField={updateField} />}
                    </div>

                    <DialogFooter className="mt-6 pt-6 border-t shrink-0 flex items-center justify-between">
                        <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading} className="text-lg py-6 px-8">
                            Cancel
                        </Button>
                        <div className="flex gap-4">
                            {step > 1 && (
                                <Button variant="outline" onClick={handleBack} disabled={isLoading} className="text-lg py-6 px-8">
                                    Back
                                </Button>
                            )}
                            <Button
                                onClick={handleNext}
                                disabled={!canProceed() || isLoading}
                                className="min-w-[140px] text-lg py-6 px-8 shadow-md"
                            >
                                {isLoading ? (
                                    <>Initializing...</>
                                ) : (
                                    step === 3 ? "Create Protocol" : "Next Step"
                                )}
                            </Button>
                        </div>
                    </DialogFooter>
                </div>

                {/* Right Side: Collage of Animations */}
                <div className="hidden lg:flex flex-col justify-center items-center w-[45%] bg-gradient-to-l from-slate-50 to-white relative overflow-hidden p-8 lg:p-12">

                    {/* SVG Definition for Video Clip Path */}
                    <svg width="0" height="0" className="absolute">
                        <defs>
                            <clipPath id="cloud-mask" clipPathUnits="objectBoundingBox">
                                <path
                                    d="M 0.138 0.541 
                                       A 0.111 0.166 0 0 1 0.222 0.333 
                                       A 0.138 0.208 0 0 1 0.388 0.208 
                                       A 0.194 0.291 0 0 1 0.666 0.208 
                                       A 0.138 0.208 0 0 1 0.805 0.375 
                                       A 0.111 0.166 0 0 1 0.888 0.583 
                                       A 0.097 0.145 0 0 1 0.777 0.75 
                                       A 0.125 0.187 0 0 1 0.611 0.791 
                                       A 0.138 0.208 0 0 1 0.361 0.791 
                                       A 0.125 0.187 0 0 1 0.194 0.708 
                                       A 0.097 0.145 0 0 1 0.138 0.541 Z"
                                />
                            </clipPath>
                        </defs>
                    </svg>

                    <style>
                        {`
                        @keyframes slowBounceCloud {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-12px); }
                        }
                    `}
                    </style>

                    {/* Background Blobs */}
                    <div className="absolute top-[-5%] right-[-10%] w-[500px] h-[500px] bg-blue-300/30 rounded-full mix-blend-multiply filter blur-[80px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-[80px] animate-pulse" style={{ animationDelay: '2s' }}></div>

                    {/* Collage Container */}
                    <div className="relative w-full max-w-[800px] aspect-square flex items-center justify-center">

                        {/* Center Video (With SVG Mask) */}
                        <div className="absolute z-20 w-[65%] sm:w-[70%] lg:w-[60%] 2xl:w-[55%] max-w-[500px] aspect-[3/2] drop-shadow-2xl flex items-center justify-center"
                            style={{
                                animation: 'slowBounceCloud 6s ease-in-out infinite'
                            }}>
                            {/* Inner white background mask that creates the border */}
                            <div className="absolute inset-0 bg-white" style={{ clipPath: 'url(#cloud-mask)' }}></div>

                            {/* Inner Video perfectly proportionally sized inside mask */}
                            <video
                                src="/labProcess.mp4"
                                autoPlay loop muted playsInline
                                className="relative z-10 w-[95%] h-[95%] object-cover scale-[1.03]"
                                style={{
                                    clipPath: 'url(#cloud-mask)'
                                }}
                            />
                        </div>

                        {/* 1. Top Left */}
                        <div className="absolute top-[5%] left-[0%] w-[22%] max-w-[170px] aspect-[4/3] z-10 bg-white rounded-2xl shadow-xl overflow-hidden hover:-translate-y-2 transition-transform duration-500" style={{ animation: 'slowBounceCloud 7s ease-in-out infinite', animationDelay: '0.5s' }}>
                            <img src="/Startup.gif" alt="Startup" className="w-full h-full object-contain p-2" />
                        </div>

                        {/* 2. Top Right */}
                        <div className="absolute top-[4%] right-[2%] w-[20%] max-w-[160px] aspect-square bg-white rounded-full shadow-xl z-10 overflow-hidden hover:-translate-y-2 transition-transform duration-500" style={{ animation: 'slowBounceCloud 5s ease-in-out infinite', animationDelay: '1.2s' }}>
                            <img src="/Research Lottie Animation.gif" alt="Research Data" className="w-full h-full object-contain p-2" />
                        </div>

                        {/* 3. Middle Left Outer */}
                        <div className="absolute top-[40%] left-[-5%] w-[18%] max-w-[140px] aspect-square z-10 bg-white rounded-[2rem] shadow-xl overflow-hidden hover:-translate-y-2 transition-transform duration-500" style={{ animation: 'slowBounceCloud 6.5s ease-in-out infinite', animationDelay: '2.5s' }}>
                            <img src="/Eflask.gif" alt="Flask" className="w-full h-full object-contain p-2" />
                        </div>

                        {/* 4. Middle Right Outer */}
                        <div className="absolute top-[45%] right-[-5%] w-[24%] max-w-[190px] aspect-[4/3] z-10 bg-white rounded-2xl shadow-xl overflow-hidden hover:-translate-y-2 transition-transform duration-500" style={{ animation: 'slowBounceCloud 5.8s ease-in-out infinite', animationDelay: '0.8s' }}>
                            <img src="/Laboratory.gif" alt="Laboratory Setup" className="w-full h-full object-contain p-2" />
                        </div>

                        {/* 5. Bottom Left */}
                        <div className="absolute bottom-[8%] left-[5%] w-[20%] max-w-[160px] aspect-[4/3] z-10 bg-white rounded-3xl shadow-xl overflow-hidden hover:-translate-y-2 transition-transform duration-500" style={{ animation: 'slowBounceCloud 6.2s ease-in-out infinite', animationDelay: '1.7s' }}>
                            <img src="/Anima Bot.gif" alt="Robot" className="w-full h-full object-contain p-2" />
                        </div>

                        {/* 6. Bottom Right */}
                        <div className="absolute bottom-[5%] right-[2%] w-[22%] max-w-[180px] aspect-square z-10 bg-white rounded-[2.5rem] shadow-xl overflow-hidden hover:-translate-y-2 transition-transform duration-500" style={{ animation: 'slowBounceCloud 7.5s ease-in-out infinite', animationDelay: '2.1s' }}>
                            <img src="/coder.gif" alt="Coder" className="w-full h-full object-contain p-2" />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
