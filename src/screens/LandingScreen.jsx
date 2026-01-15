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
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
            {/* Header / Logo Area */}
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Microlit Protocol Designer</h1>
                <p className="text-gray-500 mt-1 text-sm">Create and manage your liquid handling protocols</p>
            </div>

            {/* Main Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
                {/* Create New */}
                <Card
                    className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500 group"
                    onClick={() => setIsWizardOpen(true)}
                >
                    <CardContent className="flex flex-col items-center justify-center h-48 p-6">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                            <Plus className="h-6 w-6 text-blue-600 group-hover:text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">Create New Protocol</h2>
                        <p className="text-center text-sm text-gray-500 mt-2">Start a new protocol from scratch for your Microlit robot.</p>
                    </CardContent>
                </Card>

                {/* Import */}
                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-gray-400 group">
                    <CardContent className="flex flex-col items-center justify-center h-48 p-6">
                        <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-gray-600 transition-colors">
                            <Upload className="h-6 w-6 text-gray-600 group-hover:text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">Import Protocol</h2>
                        <p className="text-center text-sm text-gray-500 mt-2">Import an existing JSON protocol file to edit.</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Protocols (Mock) */}
            <div className="mt-12 w-full max-w-4xl">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Recent Protocols</h3>
                <div className="bg-white rounded-lg shadow-sm border divide-y">
                    <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-4">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="font-medium text-gray-800">PCR_Prep_001.json</p>
                                <p className="text-xs text-gray-400">Edited 2 hours ago</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm">Open</Button>
                    </div>
                </div>
            </div>

            {/* Wizard Injection */}
            <ProtocolWizard
                open={isWizardOpen}
                onOpenChange={setIsWizardOpen}
                onComplete={handleCreateWrapper} // We'll add this prop to Wizard
            />
        </div>
    );
}
