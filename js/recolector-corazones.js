// Variables específicas del recolector
let player = {
    x: canvas.width/2,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    speed: 5
};

let fallingHearts = [];
let collectedWords = [];
const loveMessage = ["Te", "quiero", "cada", "día", "más", ""];
let gameActive = true;
let showEnvelope = false;
let hearts = [];
const NUM_HEARTS = 15;

function initRecolectorCorazones() {
    // Reiniciar variables
    fallingHearts = [];
    collectedWords = [];
    gameActive = true;
    showEnvelope = false;
    
    // Posicionar jugador
    player.x = canvas.width/2;
    
    // Eliminar event listeners anteriores
    canvas.onclick = null;
    
    // Añadir control del jugador
    document.addEventListener('mousemove', movePlayer);
    
    // Iniciar el juego
    spawnHeart();
    gameLoop_HeartCollector();
}

function movePlayer(e) {
    const rect = canvas.getBoundingClientRect();
    player.x = e.clientX - rect.left - player.width/2;
    
    // Mantener el jugador dentro del canvas
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
}

function spawnHeart() {
    if (!gameActive) return;
    
    fallingHearts.push({
        x: Math.random() * (canvas.width - 30),
        y: -30,
        size: 30,
        speed: 2 + Math.random() * 2,
        word: loveMessage[collectedWords.length % loveMessage.length]
    });
    
    // Crear nuevo corazón cada 2 segundos
    setTimeout(spawnHeart, 2000);
}

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

function gameLoop_HeartCollector() {
    if (!gameActive) {
        if (showEnvelope) {
            drawEnvelope();
        }
        return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar fondo
    ctx.fillStyle = '#ffe6f2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar jugador
    ctx.fillStyle = '#ff3366';
    drawHeart(player.x, player.y, player.width);
    
    // Actualizar y dibujar corazones
    ctx.fillStyle = '#ff0000';
    fallingHearts.forEach((heart, index) => {
        heart.y += heart.speed;
        drawHeart(heart.x, heart.y, heart.size);
        
        // Detectar colisión
        if (heart.y + heart.size > player.y && 
            heart.y < player.y + player.height &&
            heart.x + heart.size > player.x && 
            heart.x < player.x + player.width) {
            
            fallingHearts.splice(index, 1);
            if (!collectedWords.includes(heart.word)) {
                collectedWords.push(heart.word);
            }
        }
        
        // Eliminar corazones que salen de la pantalla
        if (heart.y > canvas.height) {
            fallingHearts.splice(index, 1);
        }
    });
    
    // Mostrar palabras recolectadas
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ff1493';
    ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif';
    ctx.fillText(collectedWords.join(' '), canvas.width/2, 40);
    
    // Verificar victoria
    if (collectedWords.length >= loveMessage.length) {
        showHeartCollectorVictory();
        return;
    }
    
    requestAnimationFrame(gameLoop_HeartCollector);
}

function showHeartCollectorVictory() {
    gameActive = false;
    
    // Primero mostrar el sobre
    if (!showEnvelope) {
        drawEnvelope();
        showEnvelope = true;
        
        // Añadir listener para el sobre
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
                showEnvelope = false;
                initializeHearts();
                requestAnimationFrame(showVictoryMessage);
            }
        };
        return;
    }
    
    showVictoryMessage();
}

function showVictoryMessage() {
    let animationId; // Para controlar la animación

    function draw() {
        // Fondo con gradiente
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
        
        // Mensaje de victoria
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 40px "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Ole mi amor!', canvas.width/2, canvas.height/2 - 40);
        ctx.fillText('Te quiero.', canvas.width/2, canvas.height/2 + 10);
        
        // Mensaje secundario
        ctx.font = '20px Arial';
        ctx.fillText('❤️ ' + loveMessage.join(' ') + ' ❤️', canvas.width/2, canvas.height/2 + 50);
        
        // Botón para el siguiente juego
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
        ctx.fillText('Siguiente sorpresa ❤️', canvas.width/2, buttonY + buttonHeight/2 + 6);

        animationId = requestAnimationFrame(draw);
    }

    // Click listener para el botón (fuera de draw)
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
            
            // Cancelar todas las animaciones
            cancelAnimationFrame(animationId);
            hearts = [];
            
            // Limpiar eventos
            canvas.onclick = null;
            document.removeEventListener('mousemove', movePlayer);
            
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
                    window.location.href = 'puzzle.html';
                }
            }
            
            drawLoadingScreen();
        }
    };
    
    draw();
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

// Inicializar el juego cuando se carga la página
window.onload = function() {
    // Asegurarse de que el canvas esté configurado
    canvas.width = 400;
    canvas.height = 400;
    
    // Iniciar el recolector de corazones
    initRecolectorCorazones();
};
