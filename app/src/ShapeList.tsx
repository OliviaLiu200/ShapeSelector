import * as State from './state';
import './shapeList.css';
import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import { drawStar } from './drawStar';
import { drawBullseye } from './drawBullseye';
import { drawCat } from './drawCat';
import { useSignal, computed } from '@preact/signals';

const ShapeComponent: preact.FunctionalComponent<{ shape: State.Shape }> = ({
    shape,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const selectedShape = computed(() => State.selectedShape.value);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        canvas.width = 100;
        canvas.height = 100;
        canvas.style.width = '50px';
        canvas.style.height = '50px';
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (shape.type === 'square') {
                ctx.fillStyle = shape.color;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            } else if (
                shape.type === 'star' &&
                shape.points &&
                shape.innerRadius &&
                shape.outerRadius
            ) {
                drawStar(
                    ctx,
                    50,
                    50,
                    shape.points,
                    shape.innerRadius,
                    shape.outerRadius,
                    shape.color
                );
            } else if (
                shape.type === 'bullseye' &&
                shape.outerRadius &&
                shape.rings &&
                shape.color2
            ) {
                drawBullseye(
                    ctx,
                    50,
                    50,
                    shape.color,
                    shape.color2,
                    shape.rings
                );
            } else if (shape.type === 'cat' && shape.look) {
                drawCat(ctx, 50, 50, shape.color, shape.look);
            }
        }
    }, [shape]);

    const handleSelect = (e: MouseEvent) => {
        e.stopPropagation();
        State.selectShapeWithShift(shape);
    };

    return (
        <div
            className={`shape-container ${shape.isSelected ? 'selected' : ''}`}
            onClick={handleSelect}
        >
            <canvas ref={canvasRef} />
        </div>
    );
};

export default function ShapeList() {
    const shapes = State.shapes;

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Shift') {
                State.setShiftKey(true);
            }
        };
        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === 'Shift') {
                State.setShiftKey(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('click', handleBackgroundClick);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('click', handleBackgroundClick);
        };
    }, []);

    const handleBackgroundClick = (event: MouseEvent) => {
        if (event.target === event.currentTarget) {
            State.deselectAllShapes();
        }
    };

    return (
        <div id="shapelist" onClick={handleBackgroundClick}>
            {State.shapes.value.map((shape) => (
                <span className="shapelist-container" key={shape.id}>
                    <ShapeComponent shape={shape} />
                </span>
            ))}
        </div>
    );
}
