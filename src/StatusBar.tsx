import * as State from './state';
import './statusbar.css';
import { useState, useEffect } from 'preact/hooks';
import { historyManager } from './historyManager';

export default function StatusBar() {
    const [shapeCount, setShapeCount] = useState(State.shapes.value.length);
    const [selectedCount, setSelectedCount] = useState(
        State.shapes.value.filter((shape) => shape.isSelected).length
    );
    const [shiftKeyActive, setShiftKeyActive] = useState(
        State.shiftKeyPressed.value
    );

    const handleUndo = () => {
        historyManager.undo();
    };

    const handleRedo = () => {
        historyManager.redo();
    };

    // subscribe to shape changes
    useEffect(() => {
        const unsubscribeShape = State.shapes.subscribe((curShapes) => {
            setShapeCount(curShapes.length);
            setSelectedCount(
                curShapes.filter((shape) => shape.isSelected).length
            );
        });
        const unsubscribeShiftKey = State.shiftKeyPressed.subscribe(
            (shiftKeyPressed) => {
                setShiftKeyActive(shiftKeyPressed);
            }
        );

        return () => {
            unsubscribeShape();
            unsubscribeShiftKey();
        };
    }, []);

    return (
        <div id="statusbar">
            <div className="statusbar-section left-section">
                {shapeCount} shapes{shiftKeyActive && ' (SHIFT)'}
            </div>
            <div className="statusbar-section center-section">
                <button
                    id="undo-button"
                    onClick={handleUndo}
                    disabled={!historyManager.canUndo()}
                >
                    Undo
                </button>
                <button
                    id="redo-button"
                    onClick={handleRedo}
                    disabled={!historyManager.canRedo()}
                >
                    Redo
                </button>
            </div>
            {selectedCount > 0 && (
                <div
                    className="statusbar-section right-section"
                    id="selected-text"
                >
                    selected {selectedCount}
                </div>
            )}
        </div>
    );
}
