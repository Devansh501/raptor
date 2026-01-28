
// Helper for managing immutable protocol state updates
export const INITIAL_PROTOCOL_STATE = {
    metadata: {
        name: 'Untitled Protocol',
        description: '',
        author: '',
        created: Date.now(),
    },
    pipettes: {
        left: { name: 'p300_single', mount: 'left' }, // Default for now
        right: null,
    },
    labware: {
        // '1': { id: '1', type: 'tiprack-200ul', name: 'Opentrons 96 Tip Rack 300 µL', slot: '1' }
        // '12': { id: '12', type: 'trash-box', name: 'Trash Bin', slot: '12' }
    },
    steps: [
        // { id: 'step-1', type: 'initial_deck_setup', title: 'Initial Deck Setup', description: 'Place labware on deck' }
    ],
    liquids: {},
    liquidState: {},
};

export class ProtocolStateManager {
    constructor(state = INITIAL_PROTOCOL_STATE) {
        this.state = state;
    }

    addStep(stepType) {
        const id = `step-${Date.now()}`;
        const newStep = {
            id,
            type: stepType,
            title: stepType === 'transfer' ? 'Transfer' : stepType,
            description: 'New step',
            params: {}
        };
        // Insert after 'initial_deck_setup' if it exists, roughly
        // For now just push
        return {
            ...this.state,
            steps: [...this.state.steps, newStep]
        };
    }

    updateStep(stepId, updates) {
        return {
            ...this.state,
            steps: this.state.steps.map(s => s.id === stepId ? { ...s, ...updates } : s)
        };
    }

    deleteStep(stepId) {
        return {
            ...this.state,
            steps: this.state.steps.filter(s => s.id !== stepId)
        };
    }

    addLabware(slot, labwareDef) {
        return {
            ...this.state,
            labware: {
                ...this.state.labware,
                [slot]: { ...labwareDef, slot }
            }
        };
    }

    removeLabware(slot) {
        const newLabware = { ...this.state.labware };
        delete newLabware[slot];
        return {
            ...this.state,
            labware: newLabware
        };
    }

    // --- LIQUID MANAGEMENT ---

    addLiquid(liquid) {
        const id = liquid.id || `liquid-${Date.now()}`;
        return {
            ...this.state,
            liquids: {
                ...this.state.liquids,
                [id]: { ...liquid, id }
            }
        };
    }

    updateLiquid(id, updates) {
        return {
            ...this.state,
            liquids: {
                ...this.state.liquids,
                [id]: { ...this.state.liquids[id], ...updates }
            }
        };
    }

    deleteLiquid(id) {
        const newLiquids = { ...this.state.liquids };
        delete newLiquids[id];
        // TODO: Clean up assignments?
        return {
            ...this.state,
            liquids: newLiquids
        };
    }

    assignLiquid(labwareId, wells, liquidId, volume) {
        // We'll store assignments in a new 'liquidState' key or inside labware
        // Let's use a separate liquidState keyed by labwareId
        const currentLiquidState = this.state.liquidState || {};
        const labwareLiquids = currentLiquidState[labwareId] || {};

        const newLabwareLiquids = { ...labwareLiquids };
        
        wells.forEach(well => {
            if (liquidId === null) {
                 delete newLabwareLiquids[well];
            } else {
                newLabwareLiquids[well] = { liquidId, volume };
            }
        });

        return {
            ...this.state,
            liquidState: {
                ...currentLiquidState,
                [labwareId]: newLabwareLiquids
            }
        };
    }
}
