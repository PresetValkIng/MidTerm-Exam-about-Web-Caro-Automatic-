// Định nghĩa các hằng số
const X = 'X';
const O = 'O';
const XText = 'X';
const OText = 'O';
const WIN = 'win';
const DRAW = 'draw';

// Bảng điểm tấn công (AI chủ động đánh)
const ATTACK_SCORE = {
    5: 100000,  // thắng ngay
    4: 10000,   // mở 4
    3: 1000,    // mở 3
    2: 100,     // mở 2
    1: 10       // mở 1
};

// Bảng điểm phòng thủ (AI ưu tiên chặn)
const DEFEND_SCORE = {
    5: 90000,   // chặn thắng ngay
    4: 9000,    // chặn 4
    3: 900,     // chặn 3
    2: 90,      // chặn 2
    1: 9        // chặn 1
};


function countDirection(i, j, dx, dy, player, matrixGame) {
    let count = 0;
    let x = i + dx, y = j + dy;
    while (x >= 0 && y >= 0 && x < matrixGame.length && y < matrixGame[0].length && matrixGame[x][y] === player) {
        count++;
        x += dx;
        y += dy;
    }
    return count;
}

function isOpenEnd(i, j, dx, dy, player, matrixGame) {
    let x = i + dx, y = j + dy;
    return (x >= 0 && y >= 0 && x < matrixGame.length && y < matrixGame[0].length && matrixGame[x][y] === "");
}

function evaluateCell(i, j, player, matrixGame) {
    let totalScore = 0;
    let attackMap = ATTACK_SCORE;
    let defendMap = DEFEND_SCORE;
    let opponent = (player === O ? X : O);

    const directions = [
        [0, 1],  // ngang
        [1, 0],  // dọc
        [1, 1],  // chéo phải
        [1, -1]  // chéo trái
    ];

    for (let [dx, dy] of directions) {
        // --- Tấn công ---
        let count1 = countDirection(i, j, dx, dy, player, matrixGame);
        let count2 = countDirection(i, j, -dx, -dy, player, matrixGame);
        let totalCount = count1 + count2 + 1; // +1 cho ô đang xét

        let openEnds = 0;
        if (isOpenEnd(i + dx * count1, j + dy * count1, dx, dy, player, matrixGame)) openEnds++;
        if (isOpenEnd(i - dx * count2, j - dy * count2, -dx, -dy, player, matrixGame)) openEnds++;

        if (totalCount >= 5) {
            totalScore += attackMap[5];
        } else if (openEnds === 2) {
            totalScore += attackMap[totalCount] || 0;
        } else if (openEnds === 1) {
            totalScore += (attackMap[totalCount] || 0) / 2;
        }

        // --- Phòng thủ ---
        count1 = countDirection(i, j, dx, dy, opponent, matrixGame);
        count2 = countDirection(i, j, -dx, -dy, opponent, matrixGame);
        totalCount = count1 + count2 + 1;

        openEnds = 0;
        if (isOpenEnd(i + dx * count1, j + dy * count1, dx, dy, opponent, matrixGame)) openEnds++;
        if (isOpenEnd(i - dx * count2, j - dy * count2, -dx, -dy, opponent, matrixGame)) openEnds++;

        if (totalCount >= 5) {
            totalScore += defendMap[5];
        } else if (openEnds === 2) {
            totalScore += defendMap[totalCount] || 0;
        } else if (openEnds === 1) {
            totalScore += (defendMap[totalCount] || 0) / 2;
        }
    }

    return totalScore;
}

function getPointsComputer(matrixGame) {
    let maxScore = -Infinity;
    let bestMoves = [];

    for (let i = 0; i < matrixGame.length; i++) {
        for (let j = 0; j < matrixGame[0].length; j++) {
            if (matrixGame[i][j] === "") {
                let score = evaluateCell(i, j, O, matrixGame);
                if (score > maxScore) {
                    maxScore = score;
                    bestMoves = [[i, j]];
                } else if (score === maxScore) {
                    bestMoves.push([i, j]);
                }
            }
        }
    }

    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}


// Hàm xử lý nước đi của máy ở chế độ khó
function aiHardMove() {
    if (!gameActive) return;

    // Tạo ma trận game từ bảng hiện tại
    const cells = document.querySelectorAll('.cell');
    const size = boardSize;
    const matrixGame = Array(size).fill().map(() => Array(size).fill(""));
    cells.forEach((cell, index) => {
        const row = Math.floor(index / size);
        const col = index % size;
        matrixGame[row][col] = cell.textContent;
    });

    // Lấy nước đi tối ưu
    const pointsComputer = getPointsComputer(matrixGame);
    if (!pointsComputer) return;

    const cellIndex = pointsComputer[0] * size + pointsComputer[1];
    const targetCell = cells[cellIndex];
    targetCell.textContent = 'O';
    targetCell.classList.add('o');
    lastPlayer = 'O';

    if (checkWin()) {
        setTimeout(() => {
            alert('Máy thắng!');
            gameActive = false;
        }, 100);
    } else if (checkDraw()) {
        setTimeout(() => {
            alert('Hòa!');
            gameActive = false;
        }, 100);
    }
}

        // Máy đánh dễ
        function computerMoveEasy() {
            if (!gameActive) return;
            
            const cells = document.querySelectorAll('.cell');
            const size = boardSize;
            let emptyCells = [];
            
            // Ưu tiên đánh gần các quân X
            let candidateCells = [];
            
            // Tìm tất cả ô trống
            cells.forEach((cell, index) => {
                if (!cell.textContent) {
                    emptyCells.push(cell);
                    
                    // Kiểm tra xung quanh các quân X
                    const row = Math.floor(index / size);
                    const col = index % size;
                    
                    for (let i = Math.max(0, row-1); i <= Math.min(size-1, row+1); i++) {
                        for (let j = Math.max(0, col-1); j <= Math.min(size-1, col+1); j++) {
                            const nearIndex = i * size + j;
                            if (cells[nearIndex].textContent === 'X') {
                                candidateCells.push(cell);
                                break;
                            }
                        }
                    }
                }
            });
        }