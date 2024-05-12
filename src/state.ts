import { signal, computed } from '@preact/signals';
import { historyManager } from './historyManager';

export interface Shape {
    id: number;
    type: string;
    color: string;
    isSelected: boolean;
    innerRadius?: number;
    outerRadius?: number;
    points?: number;
    color2?: string;
    rings?: number;
    look?: string;
}

export const shapes = signal<Shape[]>([]);
export const selectedShape = signal<Shape | null>(null);
export const shiftKeyPressed = signal<boolean>(false);

let nextId = 1;
export const addShape = (
    type: string,
    color: string,
    color2?: string,
    manageHistory = true
) => {
    let shape: Shape = { id: nextId++, type, color, isSelected: false };

    let wasSelected = false;
    if (shape.isSelected) {
        wasSelected = true;
    }

    if (type === 'star') {
        shape = {
            ...shape,
            innerRadius: 15,
            outerRadius: Math.floor(Math.random() * 25) + 20,
            points: Math.floor(Math.random() * 8) + 3,
        };
    }

    if (type === 'bullseye') {
        shape = {
            ...shape,
            outerRadius: Math.floor(Math.random() * 25) + 20,
            color2: color2,
            rings: Math.floor(Math.random() * 3) + 2,
        };
    }

    if (type === 'cat') {
        const looks = ['left', 'centre', 'right'];
        const randomLook = looks[Math.floor(Math.random() * looks.length)];
        shape = {
            ...shape,
            look: randomLook,
        };
    }

    const action = {
        undo: () => {
            shapes.value = shapes.value.filter((s) => s.id !== shape.id);
            if (selectedShape.value?.id === shape.id) {
                selectedShape.value = null;
            }
        },
        redo: () => {
            shapes.value = [...shapes.value, shape];
            if (wasSelected) {
                selectedShape.value = shape;
            }
        },
    };

    if (manageHistory) {
        historyManager.execute(action);
    } else {
        action.redo();
    }
};

for (let i = 0; i < 8; i++) {
    addShape(
        'square',
        `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`,
        undefined,
        false
    );
}

export const getShapes = computed(() => shapes.value);

export const selectShape = (shape: Shape | null) => {
    selectedShape.value = shape;
};

export const getSelectedShape = computed(() => selectedShape.value);

const undoAction = (
    updatedShape: Shape,
    origColor?: string,
    origOuterRadius?: number,
    origPoints?: number,
    origColor2?: string,
    origRings?: number,
    origLook?: string
) => {
    const undoIndex = shapes.value.findIndex(
        (shape) => shape.id === updatedShape.id
    );
    if (undoIndex !== -1) {
        const undoShape = {
            ...shapes.value[undoIndex],
            color:
                origColor !== null && origColor !== undefined
                    ? origColor
                    : shapes.value[undoIndex].color,
            outerRadius:
                origOuterRadius !== null && origOuterRadius !== undefined
                    ? origOuterRadius
                    : shapes.value[undoIndex].outerRadius,
            points:
                origPoints !== null && origPoints !== undefined
                    ? origPoints
                    : shapes.value[undoIndex].points,
            color2:
                origColor2 !== null && origColor2 !== undefined
                    ? origColor2
                    : shapes.value[undoIndex].color2,
            rings:
                origRings !== null && origRings !== undefined
                    ? origRings
                    : shapes.value[undoIndex].rings,
            look:
                origLook !== null && origLook !== undefined
                    ? origLook
                    : shapes.value[undoIndex].look,
        };
        const undoShapes = [...shapes.value];
        undoShapes[undoIndex] = undoShape;
        shapes.value = undoShapes;
        selectedShape.value = undoShape;
    }
};

const redoAction = (
    updatedShape: Shape,
    newColor?: string,
    newOuterRadius?: number,
    newPoints?: number,
    newColor2?: string,
    newRings?: number,
    newLook?: string
) => {
    const redoIndex = shapes.value.findIndex(
        (shape) => shape.id === updatedShape.id
    );
    if (redoIndex !== -1) {
        const redoShape = {
            ...shapes.value[redoIndex],
            color:
                newColor !== null && newColor !== undefined
                    ? newColor
                    : shapes.value[redoIndex].color,
            outerRadius:
                newOuterRadius !== null && newOuterRadius !== undefined
                    ? newOuterRadius
                    : shapes.value[redoIndex].outerRadius,
            points:
                newPoints !== null && newPoints !== undefined
                    ? newPoints
                    : shapes.value[redoIndex].points,
            color2:
                newColor2 !== null && newColor2 !== undefined
                    ? newColor2
                    : shapes.value[redoIndex].color2,
            rings:
                newRings !== null && newRings !== undefined
                    ? newRings
                    : shapes.value[redoIndex].rings,
            look:
                newLook !== null && newLook !== undefined
                    ? newLook
                    : shapes.value[redoIndex].look,
        };
        const redoShapes = [...shapes.value];
        redoShapes[redoIndex] = redoShape;
        shapes.value = redoShapes;
        selectedShape.value = redoShape;
    }
};

export const updateSelectedShapeColor = (newColor: string) => {
    const index = shapes.value.findIndex((shape) => shape.isSelected);
    if (index !== -1) {
        const origColor = shapes.value[index].color;
        const updatedShape = { ...shapes.value[index], color: newColor };
        const updatedShapes = [...shapes.value];
        updatedShapes[index] = updatedShape;
        shapes.value = updatedShapes;
        selectedShape.value = updatedShape;

        historyManager.execute({
            undo: () => {
                undoAction(updatedShape, origColor);
            },
            redo: () => {
                redoAction(updatedShape, newColor);
            },
        });
    }
};

export const setShiftKey = (state: boolean) => {
    shiftKeyPressed.value = state;
};

export const isShiftKeyPressed = computed(() => shiftKeyPressed.value);

export const deleteSelectedShapes = () => {
    const deletedShapes = shapes.value.filter((shape) => shape.isSelected);
    const origShapes = shapes.value;
    shapes.value = shapes.value.filter((shape) => !shape.isSelected);
    selectedShape.value = null;

    historyManager.execute({
        undo: () => {
            shapes.value = origShapes;
            deletedShapes.forEach((shape) => {
                if (shape.isSelected) {
                    selectedShape.value = shape;
                }
            });
        },
        redo: () => {
            shapes.value = shapes.value.filter((s) => !s.isSelected);
            selectedShape.value = null;
        },
    });
};

export const clearShapes = () => {
    const origShapes = shapes.value;
    const origSelectedShape = selectedShape.value;
    shapes.value = [];
    selectedShape.value = null;

    historyManager.execute({
        undo: () => {
            shapes.value = origShapes;
            selectedShape.value = origSelectedShape;
        },
        redo: () => {
            shapes.value = [];
            selectedShape.value = null;
        },
    });
};

export const updateSelectedStarRadius = (outerRadius: number) => {
    const index = shapes.value.findIndex(
        (shape) => shape.isSelected && shape.type === 'star'
    );
    if (index !== -1) {
        const origRadius = shapes.value[index].outerRadius;
        const updatedShape = {
            ...shapes.value[index],
            outerRadius: outerRadius,
        };
        const updatedShapes = [...shapes.value];
        updatedShapes[index] = updatedShape;
        selectedShape.value = updatedShape;
        shapes.value = updatedShapes;

        historyManager.execute({
            undo: () => {
                undoAction(updatedShape, undefined, origRadius);
            },
            redo: () => {
                redoAction(updatedShape, undefined, outerRadius);
            },
        });
    }
};

export const updateSelectedStarPoints = (points: number) => {
    const index = shapes.value.findIndex(
        (shape) => shape.isSelected && shape.type === 'star'
    );
    if (index !== -1) {
        const origPoints = shapes.value[index].points;
        const updatedShape = { ...shapes.value[index], points: points };
        const updatedShapes = [...shapes.value];
        updatedShapes[index] = updatedShape;
        selectedShape.value = updatedShape;
        shapes.value = updatedShapes;

        historyManager.execute({
            undo: () => {
                undoAction(updatedShape, undefined, undefined, origPoints);
            },
            redo: () => {
                redoAction(updatedShape, undefined, undefined, points);
            },
        });
    }
};

export const updateSelectedBullseyeRings = (rings: number) => {
    const index = shapes.value.findIndex(
        (shape) => shape.isSelected && shape.type === 'bullseye'
    );
    if (index !== -1) {
        const origRings = shapes.value[index].rings;
        const updatedShape = { ...shapes.value[index], rings: rings };
        const updatedShapes = [...shapes.value];
        updatedShapes[index] = updatedShape;
        selectedShape.value = updatedShape;
        shapes.value = updatedShapes;

        historyManager.execute({
            undo: () => {
                undoAction(
                    updatedShape,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    origRings
                );
            },
            redo: () => {
                redoAction(
                    updatedShape,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    rings
                );
            },
        });
    }
};

export const updateSelectedBullseyeColor2 = (color2: string) => {
    const index = shapes.value.findIndex(
        (shape) => shape.isSelected && shape.type === 'bullseye'
    );
    if (index !== -1) {
        const origColor2 = shapes.value[index].color2;
        const updatedShape = { ...shapes.value[index], color2: color2 };
        const updatedShapes = [...shapes.value];
        updatedShapes[index] = updatedShape;
        selectedShape.value = updatedShape;
        shapes.value = updatedShapes;

        historyManager.execute({
            undo: () => {
                undoAction(
                    updatedShape,
                    undefined,
                    undefined,
                    undefined,
                    origColor2
                );
            },
            redo: () => {
                redoAction(
                    updatedShape,
                    undefined,
                    undefined,
                    undefined,
                    color2
                );
            },
        });
    }
};

export const updateSelectedCatLook = (look: string) => {
    const index = shapes.value.findIndex(
        (shape) => shape.isSelected && shape.type === 'cat'
    );
    if (index !== -1) {
        const origLook = shapes.value[index].look;
        const updatedShape = { ...shapes.value[index], look: look };
        const updatedShapes = [...shapes.value];
        updatedShapes[index] = updatedShape;
        selectedShape.value = updatedShape;
        shapes.value = updatedShapes;

        historyManager.execute({
            undo: () => {
                undoAction(
                    updatedShape,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    origLook
                );
            },
            redo: () => {
                redoAction(
                    updatedShape,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    look
                );
            },
        });
    }
};

export const selectShapeWithShift = (shape: Shape) => {
    if (shape.isSelected) {
        if (shiftKeyPressed.value) {
            shape.isSelected = false;
            const updatedShape = { ...shape, isSelected: false };
            shape = updatedShape;
            selectedShape.value = null;
            const selectedShapesList = shapes.value.filter((s) => s.isSelected);
            if (selectedShapesList.length >= 1) {
                const updateSeletedShape = {
                    ...selectedShapesList[0],
                    isSelected: true,
                };
                selectedShape.value = updateSeletedShape;
            }
        } else {
            const updatedShape = shapes.value.map((shape) => ({
                ...shape,
                isSelected: false,
            }));
            shapes.value = updatedShape;
            selectedShape.value = null;
        }
    } else {
        if (!shiftKeyPressed.value) {
            shapes.value.forEach((s) => (s.isSelected = false));
        }
        shape.isSelected = true;
        selectedShape.value = shape;
    }
    console.log(shapes.value.filter((s) => s.isSelected));
    shapes.value = [...shapes.value]; // trigger a reactivity update
};

export const deselectAllShapes = () => {
    const updatedShapes = shapes.value.map((shape) => ({
        ...shape,
        isSelected: false,
    }));
    shapes.value = updatedShapes;
    selectedShape.value = null;
};
