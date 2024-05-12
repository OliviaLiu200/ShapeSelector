export function drawCat(ctx: CanvasRenderingContext2D, cx: number, cy: number, hue: string, look: string): void {
    // Adjustments to center the cat in a 90x90 area
    const earWidth = 15;
    const earHeight = 25;
    const faceRadius = 40;
    const eyeWidth = 8;
    const eyeHeight = 15;
    const pupilRadius = 5;

    // Calculate top left corner of the bounding box
    const topLeftX = cx - 45;
    const topLeftY = cy - 45;

    // Calculate positions based on the top left corner
    const leftEarX = topLeftX + earWidth;
    const rightEarX = topLeftX + 90 - earWidth;
    const earTipY = topLeftY + 25;
    const faceCenterX = topLeftX + 45;
    const faceCenterY = topLeftY + 45;
    const leftEyeX = faceCenterX - eyeWidth * 2;
    const rightEyeX = faceCenterX + eyeWidth * 2;
    const eyeY = faceCenterY - 8;

    // Draw two triangles as cat ears
    ctx.beginPath();
    ctx.moveTo(leftEarX-4, earTipY+15);
    ctx.lineTo(leftEarX - earWidth+2, earTipY - earHeight+2);
    ctx.lineTo(leftEarX + earWidth+6, earTipY - earHeight+15);
    ctx.closePath();
    ctx.fillStyle = hue;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(rightEarX+4, earTipY+15);
    ctx.lineTo(rightEarX + earWidth-2, earTipY - earHeight+2);
    ctx.lineTo(rightEarX - earWidth-6, earTipY - earHeight+15);
    ctx.closePath();
    ctx.fillStyle = hue;
    ctx.fill();

    // Draw circular cat face
    ctx.beginPath();
    ctx.arc(faceCenterX, faceCenterY, faceRadius, 0, 2 * Math.PI);
    ctx.fillStyle = hue;
    ctx.fill();

    // Draw white oval cat eyes
    ctx.beginPath();
    ctx.ellipse(leftEyeX, eyeY, eyeWidth, eyeHeight, 0, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(rightEyeX, eyeY, eyeWidth, eyeHeight, 0, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();

    // Draw black pupils
    ctx.beginPath();
    let pupilXOffset = 0;
    if (look === 'left') {
        pupilXOffset = -2;
    } else if (look === 'right') {
        pupilXOffset = 2;
    }
    ctx.arc(leftEyeX + pupilXOffset, eyeY, pupilRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(rightEyeX + pupilXOffset, eyeY, pupilRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();
}
