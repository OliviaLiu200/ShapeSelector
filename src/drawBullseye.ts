export function drawBullseye(ctx: CanvasRenderingContext2D, cx: number, cy: number, hue1: string, hue2: string, rings: number): void {
    let currentRadius = 45;
    const ringWidth = 45 / rings;

    for (let i = 0; i < rings; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, currentRadius, 0, 2 * Math.PI);
        ctx.fillStyle = i % 2 === 0 ? hue1 : hue2;
        console.log(ctx.fillStyle);
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();
        currentRadius -= ringWidth;
    }
}
