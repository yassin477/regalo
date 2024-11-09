// Variables del laberinto
const cellSize = 40;
const startX = cellSize;
const startY = cellSize;
let playerX = startX;
let playerY = startY;
let gameOver = false;
let showEnvelope = false;
let showFinalMessage = false;
let hearts = [];
const NUM_HEARTS = 15;
let isShowingLoveMessage = false;
let animationStarted = false;


// Laberinto (0 = camino, 1 = pared)
const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const goal = {x: 9, y: 8};



// Funciones de dibujo
function drawMaze() {
    for(let y = 0; y < maze.length; y++) {
        for(let x = 0; x < maze[y].length; x++) {
            if(maze[y][x] === 1) {
                ctx.fillStyle = '#ff69b4';
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
}

function drawPlayer() {
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(playerX + cellSize/2, playerY + cellSize/2, cellSize/3, 0, Math.PI * 2);
    ctx.fill();
}

function drawGoal() {
    ctx.fillStyle = '#0000ff';
    ctx.beginPath();
    ctx.arc(goal.x * cellSize + cellSize/2, goal.y * cellSize + cellSize/2, cellSize/3, 0, Math.PI * 2);
    ctx.fill();
}

function handleEnvelopeClick(event) {
    if (showEnvelope && !showFinalMessage) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const envelopeX = canvas.width/2 - 50;
        const envelopeY = canvas.height/2 - 35;
        const width = 100;
        const height = 70;
        
        if (x >= envelopeX && x <= envelopeX + width &&
            y >= envelopeY && y <= envelopeY + height) {
            showEnvelope = false;
            showFinalMessage = true;
        }
    }
}

// Reemplazar el event listener existente con la nueva función
canvas.addEventListener('click', handleEnvelopeClick);
function showLoveMessage() {
    // Solo inicializar una vez
    if (!animationStarted) {
        console.log('Iniciando showLoveMessage');
        initializeHearts();
        animationStarted = true;
        
        // Configurar el evento de click para el botón
        canvas.onclick = function(event) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            const buttonWidth = 200;
            const buttonHeight = 40;
            const buttonX = canvas.width/2 - buttonWidth/2;
            const buttonY = canvas.height - 100;
            
            if (x > buttonX && x < buttonX + buttonWidth &&
                y > buttonY && y < buttonY + buttonHeight) {
                console.log('¡Botón clickeado!');
                
                // Limpiar eventos y animación
                canvas.onclick = null;
                animationStarted = false;
                
                // Animación de carga
                let rotation = 0;
                function drawLoadingScreen() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = '#ff69b4';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    ctx.save();
                    ctx.translate(canvas.width/2, canvas.height/2);
                    ctx.rotate(rotation);
                    
                    ctx.beginPath();
                    ctx.arc(0, 0, 30, 0, Math.PI * 2);
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 4;
                    ctx.stroke();
                    
                    ctx.beginPath();
                    ctx.arc(0, 0, 30, 0, Math.PI * 0.7);
                    ctx.strokeStyle = '#ff3366';
                    ctx.stroke();
                    
                    ctx.restore();
                    
                    rotation += 0.1;
                    
                    if (rotation < Math.PI * 4) {
                        requestAnimationFrame(drawLoadingScreen);
                    } else {
                        window.location.href = 'recolector.html';
                    }
                }
                
                drawLoadingScreen();
            }
        };
    }
    
    // Dibujar el fondo
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#ff69b4');
    gradient.addColorStop(1, '#ff1493');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Actualizar y dibujar corazones
    hearts.forEach(heart => {
        heart.y -= heart.speed;
        if (heart.y + heart.size < 0) {
            heart.y = canvas.height;
            heart.x = Math.random() * canvas.width;
        }
        ctx.fillStyle = heart.color;
        drawHeart(heart.x, heart.y, heart.size);
    });
    
    // Dibujar mensaje principal
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Eres la mejor.', canvas.width/2, canvas.height/2);
    
    ctx.font = '20px Arial';
    ctx.fillText('Te quiero.', canvas.width/2, canvas.height/2 + 50);
        
    // Dibujar botón
    const buttonWidth = 200;
    const buttonHeight = 40;
    const buttonX = canvas.width/2 - buttonWidth/2;
    const buttonY = canvas.height - 100;

    ctx.fillStyle = '#ff3366';
    ctx.beginPath();
    ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 10);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Continuar ❤️', canvas.width/2, buttonY + buttonHeight/2 + 6);
}

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

// Funciones de lógica del juego
function checkCollision(x, y) {
    const radius = cellSize/3;
    const centerX = x + cellSize/2;
    const centerY = y + cellSize/2;
    
    const points = [
        { x: centerX - radius, y: centerY },
        { x: centerX + radius, y: centerY },
        { x: centerX, y: centerY - radius },
        { x: centerX, y: centerY + radius }
    ];

    for (let point of points) {
        const gridX = Math.floor(point.x / cellSize);
        const gridY = Math.floor(point.y / cellSize);
        
        if (gridX >= 0 && gridX < maze[0].length && 
            gridY >= 0 && gridY < maze.length) {
            if (maze[gridY][gridX] === 1) {
                playerX = startX;
                playerY = startY;
                return true;
            }
        }
    }
    return false;
}

function checkWin() {
    const playerCenterX = playerX + cellSize/2;
    const playerCenterY = playerY + cellSize/2;
    const goalCenterX = goal.x * cellSize + cellSize/2;
    const goalCenterY = goal.y * cellSize + cellSize/2;
    const distance = Math.sqrt(
        Math.pow(playerCenterX - goalCenterX, 2) + 
        Math.pow(playerCenterY - goalCenterY, 2)
    );
    
    if (distance < cellSize/1.6) {
        console.log("¡Victoria!");
        gameOver = true;
        showEnvelope = true;
        showFinalMessage = false;
        
        playerX = goal.x * cellSize;
        playerY = goal.y * cellSize;
        
        initializeHearts();
        return true;
    }
    return false;
}

// Control del jugador
const movePlayer = function(e) {
    if (gameOver) return;
    
    let newX = playerX;
    let newY = playerY;
    const speed = cellSize/8;

    switch(e.key) {
        case 'ArrowUp': newY -= speed; break;
        case 'ArrowDown': newY += speed; break;
        case 'ArrowLeft': newX -= speed; break;
        case 'ArrowRight': newX += speed; break;
    }

    if(!checkCollision(newX, newY)) {
        playerX = newX;
        playerY = newY;
        checkWin();
    }
};

// Añadir el event listener con la función nombrada
document.addEventListener('keydown', movePlayer);

// Game Loop principal
function gameLoop() {
    if (showFinalMessage) {
        console.log('Estado actual - gameOver:', gameOver, 'showEnvelope:', showEnvelope, 'showFinalMessage:', showFinalMessage);
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        drawMaze();
        drawGoal();
        drawPlayer();
    } else if (showEnvelope && !showFinalMessage) {
        drawEnvelope();
    } else if (showFinalMessage) {
        showLoveMessage();
    }
    
    requestAnimationFrame(gameLoop);
}

// Iniciar el juego
gameLoop();
 