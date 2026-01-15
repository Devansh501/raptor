
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
}
