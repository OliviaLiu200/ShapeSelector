import * as State from './state';
import './toolbar.css';
import { useState } from 'preact/hooks';
import { h } from 'preact';
import { useSignal } from '@preact/signals';

export default function Toolbar() {
    const shapeOptions = ['Square', 'Star', 'Bullseye', 'Cat'];
    const [selectedShape, setSelectedShape] = useState('Square');

    const handleAddShapeClick = () => {
        const color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;
        if (State.shapes.value.length < 25) {
            if (selectedShape === 'Square') {
                State.addShape('square', color);
            } else if (selectedShape === 'Star') {
                State.addShape('star', color);
            } else if (selectedShape === 'Bullseye') {
                const color2 = `hsl(${Math.floor(
                    Math.random() * 360
                )}, 100%, 50%)`;
                State.addShape('bullseye', color, color2);
            } else if (selectedShape === 'Cat') {
                State.addShape('cat', color);
            }
        }
    };

    return (
        <div id="toolbar">
            <button
                id="addButton"
                disabled={State.shapes.value.length >= 25}
                onClick={handleAddShapeClick}
            >
                Add
            </button>
            <select
                id="shapeSelect"
                value={selectedShape}
                onChange={(e) => setSelectedShape(e.currentTarget.value)}
            >
                {shapeOptions.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <button
                id="deleteButton"
                disabled={State.shapes.value.every(
                    (shape) => !shape.isSelected
                )}
                onClick={() => State.deleteSelectedShapes()}
            >
                Delete
            </button>
            <button
                id="clearButton"
                disabled={State.shapes.value.length == 0}
                onClick={() => State.clearShapes()}
            >
                Clear
            </button>
        </div>
    );
}
