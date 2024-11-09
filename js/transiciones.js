// Variables compartidas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Función compartida para dibujar corazones
function drawHeart(x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x + size/2, y + size/4);
    ctx.bezierCurveTo(
        x + size/2, y, 
        x, y, 
        x, y + size/4
    );
    ctx.bezierCurveTo(
        x, y + size/2, 
        x + size/2, y + size * 3/4, 
        x + size/2, y + size
    );
    ctx.bezierCurveTo(
        x + size/2, y + size * 3/4, 
        x + size, y + size/2, 
        x + size, y + size/4
    );
    ctx.bezierCurveTo(
        x + size, y, 
        x + size/2, y, 
        x + size/2, y + size/4
    );
    ctx.fill();
}

// Función compartida para dibujar sobre
function drawEnvelope() {
    const envelopeX = canvas.width/2 - 50;
    const envelopeY = canvas.height/2 - 35;
    const width = 100;
    const height = 70;

    // Fondo blanco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    
    

    // Sombra del sobre
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // Base del sobre (color crema suave)
    ctx.fillStyle = '#FFF5E6';
    ctx.fillRect(envelopeX, envelopeY, width, height);

    // Quitar sombra para los detalles
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Solapa trasera (parte superior del sobre)
    ctx.beginPath();
    ctx.moveTo(envelopeX, envelopeY);
    ctx.lineTo(envelopeX + width/2, envelopeY - 20);
    ctx.lineTo(envelopeX + width, envelopeY);
    ctx.fillStyle = '#FFE4B5';
    ctx.fill();
    ctx.strokeStyle = '#DEB887';
    ctx.stroke();

    // Solapa frontal (triángulo inferior)
    ctx.beginPath();
    ctx.moveTo(envelopeX, envelopeY + height);
    ctx.lineTo(envelopeX + width/2, envelopeY + height/2);
    ctx.lineTo(envelopeX + width, envelopeY + height);
    ctx.fillStyle = '#FFE4B5';
    ctx.fill();
    ctx.stroke();

    // Solapas laterales
    ctx.beginPath();
    ctx.moveTo(envelopeX, envelopeY);
    ctx.lineTo(envelopeX + width/2, envelopeY + height/2);
    ctx.lineTo(envelopeX, envelopeY + height);
    ctx.fillStyle = '#FFF0D4';
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(envelopeX + width, envelopeY);
    ctx.lineTo(envelopeX + width/2, envelopeY + height/2);
    ctx.lineTo(envelopeX + width, envelopeY + height);
    ctx.fillStyle = '#FFF0D4';
    ctx.fill();
    ctx.stroke();

    // Dibujar un pequeño corazón como sello
    const heartSize = 15;
    ctx.fillStyle = '#FF6B6B';
    drawHeart(envelopeX + width/2 - heartSize/2, envelopeY + height/2 - heartSize/2, heartSize);

    // Texto "Click para abrir"
    ctx.fillStyle = '#8B4513';
    ctx.font = 'italic 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Click para abrir', canvas.width/2, envelopeY + height + 25);
}

// Inicialización del canvas
window.onload = function() {
    canvas.width = 400;
    canvas.height = 400;
    
    // Solo iniciar gameLoop si estamos en la página del laberinto
    if (document.title === "Laberinto del Amor") {
        gameLoop();
    }
}; 