// URL de la imagen para el puzzle
const PUZZLE_IMAGE_URL = 'img/foto.png';

// Variables del puzzle
const GRID_SIZE = 3;
let pieces = [];
let emptyPiece = { row: GRID_SIZE - 1, col: GRID_SIZE - 1 };
let pieceSize;
let puzzleImage;
let isGameComplete = false;
let hearts = [];
const NUM_HEARTS = 15;

// Inicialización de corazones
function initializeHearts() {
    hearts = [];
    for(let i = 0; i < NUM_HEARTS; i++) {
        hearts.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 20 + Math.random() * 20,
            speed: 0.3 + Math.random() * 0.4,
            color: `hsl(${Math.random() * 60 + 330}, 100%, 70%)`
        });
    }
}

function startPuzzleGame() {
    // Limpiar canvas y eventos anteriores
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.onclick = null;
    
    // Cargar imagen y comenzar cuando esté lista
    puzzleImage = new Image();
    puzzleImage.onload = initializePuzzle;
    puzzleImage.src = PUZZLE_IMAGE_URL;
}

function initializePuzzle() {
    pieceSize = canvas.width / GRID_SIZE;
    pieces = [];
    
    // Crear piezas ordenadas inicialmente
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (row === GRID_SIZE - 1 && col === GRID_SIZE - 1) {
                pieces.push(null); // Pieza vacía
            } else {
                pieces.push({
                    row: row,
                    col: col,
                    currentRow: row,
                    currentCol: col
                });
            }
        }
    }
    
    // Mezclar piezas
    shufflePuzzle();
    
    // Añadir event listener para clicks
    canvas.addEventListener('click', handlePuzzleClick);
    
    // Iniciar el loop de dibujo
    requestAnimationFrame(drawPuzzle);
}

function shufflePuzzle() {
    // Realizar 100 movimientos aleatorios válidos
    for (let i = 0; i < 100; i++) {
        const possibleMoves = getValidMoves();
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        movePiece(randomMove.row, randomMove.col);
    }
}

function getValidMoves() {
    const moves = [];
    const directions = [
        {row: -1, col: 0}, // arriba
        {row: 1, col: 0},  // abajo
        {row: 0, col: -1}, // izquierda
        {row: 0, col: 1}   // derecha
    ];
    
    directions.forEach(dir => {
        const newRow = emptyPiece.row + dir.row;
        const newCol = emptyPiece.col + dir.col;
        
        if (newRow >= 0 && newRow < GRID_SIZE && 
            newCol >= 0 && newCol < GRID_SIZE) {
            moves.push({row: newRow, col: newCol});
        }
    });
    
    return moves;
}

function handlePuzzleClick(event) {
    if (isGameComplete) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const clickedRow = Math.floor(y / pieceSize);
    const clickedCol = Math.floor(x / pieceSize);
    
    // Verificar si el movimiento es válido
    const validMoves = getValidMoves();
    if (validMoves.some(move => move.row === clickedRow && move.col === clickedCol)) {
        movePiece(clickedRow, clickedCol);
        checkWin();
    }
}

function movePiece(row, col) {
    const index = row * GRID_SIZE + col;
    const emptyIndex = emptyPiece.row * GRID_SIZE + emptyPiece.col;
    
    // Intercambiar pieza con espacio vacío
    pieces[emptyIndex] = pieces[index];
    pieces[index] = null;
    
    // Actualizar posición del espacio vacío
    emptyPiece = {row, col};
}

function checkWin() {
    isGameComplete = pieces.every((piece, index) => {
        if (piece === null) return index === pieces.length - 1;
        return piece.row === Math.floor(index / GRID_SIZE) && 
               piece.col === index % GRID_SIZE;
    });
    
    if (isGameComplete) {
        setTimeout(showEnvelopeAfterWin, 500);
    }
}

// Nueva función para mostrar el sobre después de ganar
function showEnvelopeAfterWin() {
    canvas.removeEventListener('click', handlePuzzleClick);
    
    // Inicializar corazones para la animación final
    initializeHearts();
    
    // Dibujar el sobre
    drawEnvelope();
    
    // Añadir nuevo listener para el sobre
    canvas.onclick = function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const envelopeX = canvas.width/2 - 50;
        const envelopeY = canvas.height/2 - 35;
        const width = 100;
        const height = 70;
        
        if (x >= envelopeX && x <= envelopeX + width &&
            y >= envelopeY && y <= envelopeY + height) {
            showPuzzleVictory();
        }
    };
}

function showPuzzleVictory() {
    // Fondo con degradado
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#ff69b4');
    gradient.addColorStop(1, '#ff1493');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Actualizar y dibujar corazones animados
    hearts.forEach(heart => {
        heart.y -= heart.speed;
        if (heart.y + heart.size < 0) {
            heart.y = canvas.height;
            heart.x = Math.random() * canvas.width;
        }
        ctx.fillStyle = heart.color;
        drawHeart(heart.x, heart.y, heart.size);
    });

    // Marco decorativo
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Mensaje principal
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 40px Arial';
    ctx.fillText('HAS GANADO 🏆', canvas.width/2, canvas.height/2 - 40);

    // Mensajes secundarios
    ctx.font = '20px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Has completado todos los jueguitos', canvas.width/2, canvas.height/2 + 10);
    ctx.fillText('❤️ Eres el amor de mi vida ❤️', canvas.width/2, canvas.height/2 + 40);

    // Continuar la animación
    requestAnimationFrame(showPuzzleVictory);
}

// Nueva función para dibujar el trofeo
function drawTrophy(x, y, size) {
    // Copa del trofeo
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.3);
    ctx.bezierCurveTo(
        x - size/2, y + size * 0.3,
        x - size/2, y,
        x, y
    );
    ctx.bezierCurveTo(
        x + size/2, y,
        x + size/2, y + size * 0.3,
        x, y + size * 0.3
    );
    ctx.fill();
    
    // Base del trofeo
    ctx.fillRect(x - size/6, y + size * 0.3, size/3, size * 0.4);
    ctx.fillRect(x - size/3, y + size * 0.7, size * 2/3, size * 0.1);
    
    // Detalles
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawPuzzle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar fondo
    ctx.fillStyle = '#ffebee';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar piezas
    pieces.forEach((piece, index) => {
        if (piece !== null) {
            const currentRow = Math.floor(index / GRID_SIZE);
            const currentCol = index % GRID_SIZE;
            
            ctx.drawImage(
                puzzleImage,
                piece.col * pieceSize,
                piece.row * pieceSize,
                pieceSize,
                pieceSize,
                currentCol * pieceSize,
                currentRow * pieceSize,
                pieceSize,
                pieceSize
            );
            
            // Dibujar borde de la pieza
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                currentCol * pieceSize,
                currentRow * pieceSize,
                pieceSize,
                pieceSize
            );
        }
    });
    
    if (!isGameComplete) {
        requestAnimationFrame(drawPuzzle);
    }
}

// Añadir inicialización al final del archivo
window.onload = function() {
    // Asegurarse de que el canvas esté configurado
    canvas.width = 400;
    canvas.height = 400;
    
    // Iniciar el puzzle
    startPuzzleGame();
}; 