import { useState, useEffect } from 'react';
import { ProtocolWizard } from '../components/ProtocolWizard';

function MainScreen() {
    // --- Legacy/Backend Logic (Preserved but currently unused) ---
    const [status, setStatus] = useState('Idle');
    const [logs, setLogs] = useState([]);
    const [progress, setProgress] = useState(0);
    const [isWizardOpen, setIsWizardOpen] = useState(false);

    useEffect(() => {
        // Listen for updates from Electron Main Process
        if (window.api) {
            const removeListener = window.api.onUpdate((msg) => {
                // msg is "TOPIC JSON_DATA"
                const [topic, ...rest] = msg.split(' ');
                const dataStr = rest.join(' ');

                // Add to logs
                setLogs((prev) => [...prev, `[${topic}] ${dataStr}`]);

                // If it's progress, parse it to update the bar
                if (topic === 'progress') {
                    try {
                        const data = JSON.parse(dataStr.replace(/'/g, '"'));
                        if (data.value) setProgress(data.value);
                    } catch (e) {
                        console.error("JSON Parse Error", e);
                    }
                }
            });

            // Cleanup listener on unmount
            return () => removeListener();
        }
    }, []);

    const handleStart = async () => {
        if (window.api) {
            setStatus('Requesting...');
            setLogs([]);
            setProgress(0);
            const reply = await window.api.sendJob('Start-Analysis');
            setStatus(`Backend Reply: ${reply}`);
        }
    };
    // -------------------------------------------------------------

    return (
        <div className="min-h-screen w-full bg-background flex items-center justify-center p-8">
            <div className="grid grid-cols-2 gap-8">
                {/* Button 1: New Protocol */}
                <button
                    className="h-48 w-48 bg-card text-card-foreground shadow-xl rounded-xl 
                       border border-border cursor-pointer
                       hover:scale-105 hover:bg-accent hover:text-accent-foreground
                       transition-all duration-200 ease-out
                       flex flex-col items-center justify-center font-bold"
                    onClick={() => setIsWizardOpen(true)}
                >
                    <span className="text-2xl tracking-wider text-center">NEW PROTOCOL</span>
                </button>

                {/* Button 2 */}
                <button
                    className="h-48 w-48 bg-card text-card-foreground shadow-xl rounded-xl 
                       border border-border cursor-pointer
                       hover:scale-105 hover:bg-accent hover:text-accent-foreground
                       transition-all duration-200 ease-out
                       flex flex-col items-center justify-center font-bold"
                    onClick={() => console.log('Button 2 Clicked')}
                >
                    <span className="text-2xl tracking-wider">OPTION 2</span>
                </button>

                {/* Button 3 */}
                <button
                    className="h-48 w-48 bg-card text-card-foreground shadow-xl rounded-xl 
                       border border-border cursor-pointer
                       hover:scale-105 hover:bg-accent hover:text-accent-foreground
                       transition-all duration-200 ease-out
                       flex flex-col items-center justify-center font-bold"
                    onClick={() => console.log('Button 3 Clicked')}
                >
                    <span className="text-2xl tracking-wider">OPTION 3</span>
                </button>

                {/* Button 4 */}
                <button
                    className="h-48 w-48 bg-card text-card-foreground shadow-xl rounded-xl 
                       border border-border cursor-pointer
                       hover:scale-105 hover:bg-accent hover:text-accent-foreground
                       transition-all duration-200 ease-out
                       flex flex-col items-center justify-center font-bold"
                    onClick={() => console.log('Button 4 Clicked')}
                >
                    <span className="text-2xl tracking-wider">OPTION 4</span>
                </button>
            </div>

            <ProtocolWizard open={isWizardOpen} onOpenChange={setIsWizardOpen} />
        </div>
    );
}

export default MainScreen;
