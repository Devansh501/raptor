import { useState, useEffect } from 'react';
import { LandingScreen } from './screens/LandingScreen';
import { ProtocolEditor } from './screens/ProtocolEditor';
import { VirtualKeyboardProvider, useVirtualKeyboard } from './context/VirtualKeyboardContext';
import VirtualKeyboard from './components/VirtualKeyboard';
import Splash from './splash';
import './index.css';

// Create an inner component to consume the context
const AppContent = () => {
  const { isVisible } = useVirtualKeyboard();
  const [activeProtocol, setActiveProtocol] = useState(null);

  const handleCreateProtocol = (wizardData) => {
    console.log("Creating protocol with data:", wizardData);

    // valid structure for ProtocolEditor
    const newProtocol = {
      metadata: {
        name: wizardData.name,
        description: wizardData.description,
        author: wizardData.author,
        created: Date.now(),
      },
      pipettes: {
        // Simple mapping for now
        left: {
          name: wizardData.pipetteVol,
          channels: wizardData.pipetteChannels,
          mount: 'left'
        },
        right: null,
      },
      labware: {},
      steps: [],
      liquids: {},
    };

    setActiveProtocol(newProtocol);
  };

  const handleBackToHome = () => {
    setActiveProtocol(null);
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initialization - 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="w-full bg-background text-foreground transition-all duration-300 ease-in-out overflow-hidden"
      style={{ height: isVisible ? 'calc(100vh - 300px)' : '100vh' }}
    >
      {isLoading ? (
        <Splash />
      ) : activeProtocol ? (
        <ProtocolEditor
          protocol={activeProtocol}
          onBack={handleBackToHome}
        />
      ) : (
        <LandingScreen
          onCreateProtocol={handleCreateProtocol}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <VirtualKeyboardProvider>
      <AppContent />
      <VirtualKeyboard />
    </VirtualKeyboardProvider>
  );
}
export default App;
