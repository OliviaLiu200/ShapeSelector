import * as State from './state';
import './shapeEditor.css';
import { useState, useEffect, useRef } from 'preact/hooks';
import { drawStar } from './drawStar';
import { drawBullseye } from './drawBullseye';
import { drawCat } from './drawCat';
import { useSignal, computed } from '@preact/signals';

export default function ShapeEditor() {
    const selectedShape = computed(() => State.selectedShape.value);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const shapesSelected = computed(() =>
        State.shapes.value.filter((shape) => shape.isSelected)
    );

    if (!selectedShape.value) {
        return <div id="selectOneOrTooMany">Select One</div>;
    }
    if (shapesSelected.value.length > 1) {
        return <div id="selectOneOrTooMany">Too Many Selected</div>;
    }

    const hue = useSignal(
        selectedShape.value
            ? parseInt(
                  selectedShape.value.color.slice(
                      4,
                      selectedShape.value.color.indexOf(',')
                  )
              )
            : 0
    );

    const hueVal = computed(() => {
        return selectedShape.value
            ? parseInt(
                  selectedShape.value.color.slice(
                      4,
                      selectedShape.value.color.indexOf(',')
                  )
              )
            : 0;
    });

    const outerRadius = useSignal(
        selectedShape.value &&
            selectedShape.value.type === 'star' &&
            selectedShape.value.outerRadius
            ? selectedShape.value.outerRadius
            : 20
    );

    const outerRadiusVal = computed(() => {
        return selectedShape.value &&
            selectedShape.value.type === 'star' &&
            selectedShape.value.outerRadius
            ? selectedShape.value.outerRadius
            : 20;
    });

    const points = useSignal(
        selectedShape.value &&
            selectedShape.value.type === 'star' &&
            selectedShape.value.points
            ? selectedShape.value.points
            : 3
    );

    const pointsVal = computed(() => {
        return selectedShape.value &&
            selectedShape.value.type === 'star' &&
            selectedShape.value.points
            ? selectedShape.value.points
            : 3;
    });

    const color2 = useSignal(
        selectedShape.value &&
            selectedShape.value.type === 'bullseye' &&
            selectedShape.value.color2
            ? parseInt(
                  selectedShape.value.color2.slice(
                      4,
                      selectedShape.value.color2.indexOf(',')
                  )
              )
            : 0
    );

    const color2Val = computed(() => {
        return selectedShape.value &&
            selectedShape.value.type === 'bullseye' &&
            selectedShape.value.color2
            ? parseInt(
                  selectedShape.value.color2.slice(
                      4,
                      selectedShape.value.color2.indexOf(',')
                  )
              )
            : 0;
    });

    const rings = useSignal(
        selectedShape.value &&
            selectedShape.value.type === 'bullseye' &&
            selectedShape.value.rings
            ? selectedShape.value.rings
            : 2
    );

    const ringsVal = computed(() => {
        return selectedShape.value &&
            selectedShape.value.type === 'bullseye' &&
            selectedShape.value.rings
            ? selectedShape.value.rings
            : 2;
    });

    const look = useSignal(
        selectedShape.value &&
            selectedShape.value.type === 'cat' &&
            selectedShape.value.look
            ? selectedShape.value.look
            : 'centre'
    );

    const lookVal = computed(() => {
        return selectedShape.value &&
            selectedShape.value.type === 'cat' &&
            selectedShape.value.look
            ? selectedShape.value.look
            : 'centre';
    });

    const handleHueChange = (e: Event) => {
        if (e.target) {
            const newHue = (e.target as HTMLInputElement).value;
            hue.value = parseInt(newHue);
            State.updateSelectedShapeColor(`hsl(${newHue}, 100%, 50%)`);
        }
    };

    const handleOuterRadiusChange = (e: Event) => {
        if (e.target) {
            const newRadius = (e.target as HTMLInputElement).value;
            outerRadius.value = parseInt(newRadius);
            State.updateSelectedStarRadius(outerRadius.value);
        }
    };

    const handlePointsChange = (e: Event) => {
        if (e.target) {
            const newPoints = (e.target as HTMLInputElement).value;
            points.value = parseInt(newPoints);
            State.updateSelectedStarPoints(points.value);
        }
    };

    const handleHue2Change = (e: Event) => {
        if (e.target) {
            const newHue = (e.target as HTMLInputElement).value;
            color2.value = parseInt(newHue);
            State.updateSelectedBullseyeColor2(`hsl(${newHue}, 100%, 50%)`);
        }
    };

    const handleRingsChange = (e: Event) => {
        if (e.target) {
            const newRings = (e.target as HTMLInputElement).value;
            rings.value = parseInt(newRings);
            State.updateSelectedBullseyeRings(rings.value);
        }
    };

    const handleLookChange = (e: Event) => {
        if (e.target) {
            const newLook = (e.target as HTMLInputElement).value;
            look.value = newLook;
            State.updateSelectedCatLook(look.value);
        }
    };

    const isHueValid = hue.value >= 0 && hue.value <= 360;
    const isOuterRadiusValid =
        outerRadius.value >= 20 && outerRadius.value <= 45;
    const isPointsValid = points.value >= 3 && points.value <= 10;
    const isColor2Valid = color2.value >= 0 && color2.value <= 360;
    const isRingsValid = rings.value >= 2 && rings.value <= 5;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx && canvas && selectedShape.value) {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas for redrawing
            if (
                selectedShape.value.type === 'star' &&
                selectedShape.value.innerRadius &&
                selectedShape.value.outerRadius &&
                selectedShape.value.points
            ) {
                drawStar(
                    ctx,
                    canvas.width / 2,
                    canvas.height / 2,
                    selectedShape.value.points,
                    selectedShape.value.innerRadius,
                    selectedShape.value.outerRadius,
                    selectedShape.value.color
                );
            } else if (
                selectedShape.value.type === 'bullseye' &&
                selectedShape.value.outerRadius &&
                selectedShape.value.rings &&
                selectedShape.value.color2
            ) {
                drawBullseye(
                    ctx,
                    canvas.width / 2,
                    canvas.height / 2,
                    selectedShape.value.color,
                    selectedShape.value.color2,
                    selectedShape.value.rings
                );
            } else if (
                selectedShape.value.type === 'cat' &&
                selectedShape.value.look
            ) {
                drawCat(
                    ctx,
                    canvas.width / 2,
                    canvas.height / 2,
                    selectedShape.value.color,
                    selectedShape.value.look
                );
            }
        }
    }, [selectedShape.value]);

    let shapeDisplayContent;
    if (selectedShape.value) {
        if (selectedShape.value.type === 'square') {
            shapeDisplayContent = (
                <div
                    id="shapeDisplaySquare"
                    style={{ backgroundColor: selectedShape.value.color }}
                ></div>
            );
        } else {
            shapeDisplayContent = (
                <canvas
                    ref={canvasRef}
                    id="shapeDisplay"
                    width="100%"
                    height="100%"
                ></canvas>
            );
        }
    }

    return (
        <div id="shapeEditor">
            <div id="displayArea">{shapeDisplayContent}</div>
            <div id="formContainer">
                <form id="form">
                    <div>
                        <label for="hue" id="hue-label">
                            {selectedShape.value.type === 'bullseye'
                                ? 'Hue1:'
                                : 'Hue:'}
                        </label>
                        <input
                            type="number"
                            id="hue-input"
                            name="hue"
                            min="0"
                            max="360"
                            value={hueVal.value}
                            onChange={handleHueChange}
                            style={{
                                borderColor: isHueValid ? '' : 'red',
                                borderWidth: isHueValid ? '' : '2px',
                            }}
                        ></input>
                    </div>
                    {selectedShape.value &&
                        selectedShape.value.type === 'star' && (
                            <>
                                <div>
                                    <label for="outerRadius" id="radius-label">
                                        Radius:{' '}
                                    </label>
                                    <input
                                        type="number"
                                        id="radius-input"
                                        name="outerRadius"
                                        min="20"
                                        max="45"
                                        value={outerRadiusVal.value}
                                        onChange={handleOuterRadiusChange}
                                        style={{
                                            borderColor: isOuterRadiusValid
                                                ? ''
                                                : 'red',
                                            borderWidth: isOuterRadiusValid
                                                ? ''
                                                : '2px',
                                        }}
                                    ></input>
                                </div>
                                <div>
                                    <label for="points" id="points-label">
                                        Points:{' '}
                                    </label>
                                    <input
                                        type="number"
                                        id="points-input"
                                        name="points"
                                        min="3"
                                        max="10"
                                        value={pointsVal.value}
                                        onChange={handlePointsChange}
                                        style={{
                                            borderColor: isPointsValid
                                                ? ''
                                                : 'red',
                                            borderWidth: isPointsValid
                                                ? ''
                                                : '2px',
                                        }}
                                    ></input>
                                </div>
                            </>
                        )}
                    {selectedShape.value &&
                        selectedShape.value.type === 'bullseye' && (
                            <>
                                <div>
                                    <label for="color2" id="hue2-label">
                                        Hue2:{' '}
                                    </label>
                                    <input
                                        type="number"
                                        id="hue2-input"
                                        name="hue2"
                                        min="0"
                                        max="360"
                                        value={color2Val.value}
                                        onChange={handleHue2Change}
                                        style={{
                                            borderColor: isColor2Valid
                                                ? ''
                                                : 'red',
                                            borderWidth: isColor2Valid
                                                ? ''
                                                : '2px',
                                        }}
                                    ></input>
                                </div>
                                <div>
                                    <label for="rings" id="rings-label">
                                        Rings:{' '}
                                    </label>
                                    <input
                                        type="number"
                                        id="rings-input"
                                        name="rings"
                                        min="2"
                                        max="5"
                                        value={ringsVal.value}
                                        onChange={handleRingsChange}
                                        style={{
                                            borderColor: isRingsValid
                                                ? ''
                                                : 'red',
                                            borderWidth: isRingsValid
                                                ? ''
                                                : '2px',
                                        }}
                                    ></input>
                                </div>
                            </>
                        )}
                    {selectedShape.value &&
                        selectedShape.value.type === 'cat' && (
                            <>
                                <div>
                                    <label for="look" id="look-label">
                                        Look:{' '}
                                    </label>
                                    <select
                                        id="lookSelect"
                                        name="look"
                                        value={lookVal.value}
                                        onChange={handleLookChange}
                                    >
                                        <option value="centre">centre</option>
                                        <option value="left">left</option>
                                        <option value="right">right</option>
                                    </select>
                                </div>
                            </>
                        )}
                </form>
            </div>
        </div>
    );
}
