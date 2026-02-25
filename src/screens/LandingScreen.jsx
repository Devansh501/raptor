import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Layout';
import { Plus, Upload, FileText } from 'lucide-react';
import { ProtocolWizard } from '../components/ProtocolWizard'; // Reusing Wizard

export function LandingScreen({ onCreateProtocol }) {
    const [isWizardOpen, setIsWizardOpen] = useState(false);

    const handleCreateWrapper = (data) => {
        setIsWizardOpen(false);
        onCreateProtocol(data);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col p-8 lg:p-12">
            {/* Header / Logo Area */}
            <header className="mb-8 mt-4 text-center">
                <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">Microlit Protocol Designer</h1>
                <p className="text-slate-500 mt-3 text-lg lg:text-xl max-w-2xl mx-auto">Create, simulate, and manage advanced liquid handling protocols</p>
            </header>

            {/* Main Content Area - Full screen flex */}
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto pb-12">
                {/* Main Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-16">
                    {/* Create New */}
                    <Card
                        className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-500 group transform hover:-translate-y-2 bg-white shadow-lg rounded-2xl overflow-hidden"
                        onClick={() => setIsWizardOpen(true)}
                    >
                        <CardContent className="flex flex-col items-center justify-center h-72 md:h-80 p-8">
                            <div className="h-20 w-20 md:h-24 md:w-24 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300 shadow-sm">
                                <Plus className="h-10 w-10 md:h-12 md:w-12 text-blue-600 group-hover:text-white transition-colors" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">Create New Protocol</h2>
                            <p className="text-center text-slate-500 text-base md:text-lg max-w-xs">Start a new protocol from scratch for your Microlit robot.</p>
                        </CardContent>
                    </Card>

                    {/* Import */}
                    <Card className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-slate-800 group transform hover:-translate-y-2 bg-white shadow-lg rounded-2xl overflow-hidden">
                        <CardContent className="flex flex-col items-center justify-center h-72 md:h-80 p-8">
                            <div className="h-20 w-20 md:h-24 md:w-24 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-800 group-hover:scale-110 transition-all duration-300 shadow-sm">
                                <Upload className="h-10 w-10 md:h-12 md:w-12 text-slate-600 group-hover:text-white transition-colors" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">Import Protocol</h2>
                            <p className="text-center text-slate-500 text-base md:text-lg max-w-xs">Import an existing JSON protocol file to edit.</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Protocols */}
                <div className="w-full">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recent Protocols</h3>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 font-semibold">View All</Button>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                        <div className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-blue-50/50 rounded-xl group-hover:bg-blue-100 transition-colors">
                                    <FileText className="h-7 w-7 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-lg">PCR_Prep_001.json</p>
                                    <p className="text-sm text-slate-500 mt-1">Edited 2 hours ago &bull; 96-Well Plate</p>
                                </div>
                            </div>
                            <Button variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity bg-white border shadow-sm hover:bg-slate-50">Open Designer</Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wizard Injection */}
            <ProtocolWizard
                open={isWizardOpen}
                onOpenChange={setIsWizardOpen}
                onComplete={handleCreateWrapper}
            />
        </div>
    );
}
