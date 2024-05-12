interface HistoryEntry {
    undo: () => void;
    redo: () => void;
}

class HistoryManager {
    private undoStack: HistoryEntry[] = [];
    private redoStack: HistoryEntry[] = [];

    execute(action: HistoryEntry) {
        this.undoStack.push(action);
        this.redoStack = [];
        action.redo();
    }

    undo() {
        const action = this.undoStack.pop();
        if (action) {
            this.redoStack.push(action);
            action.undo();
        }
    }

    redo() {
        const action = this.redoStack.pop();
        if (action) {
            this.undoStack.push(action);
            action.redo();
        }
    }

    canUndo() {
        return this.undoStack.length > 0;
    }

    canRedo() {
        return this.redoStack.length > 0;
    }
}

export const historyManager = new HistoryManager();
