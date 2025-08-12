// Định nghĩa các hằng số
const X = 'X';
const O = 'O';
const XText = 'X';
const OText = 'O';
const WIN = 'win';
const DRAW = 'draw';

// Bảng điểm cho máy
const MAP_SCORE_COMPUTER = new Map([
    [0, 0],
    [1, 3],
    [2, 9],
    [3, 27],
    [4, 81],
    [5, 1000000]
]);

// Bảng điểm để chặn người chơi
const MAP_POINT_HUMAN = new Map([
    [0, 0],
    [1, 2],
    [2, 6],
    [3, 18],
    [4, 54],
    [5, 100000]
]);

// Hàm kiểm tra số quân liên tiếp theo hàng ngang
function getHorizontal(i, j, player, matrixGame) {
    let count = 0;
    for (let k = Math.max(0, j - 4); k <= Math.min(matrixGame[0].length - 5, j); k++) {
        let consecutive = 0;
        for (let m = 0; m < 5; m++) {
            if (k + m < matrixGame[0].length && matrixGame[i][k + m] === player) {
                consecutive++;
            } else {
                break;
            }
        }
        count = Math.max(count, consecutive);
    }
    return count;
}

// Hàm kiểm tra số quân liên tiếp theo hàng dọc
function getVertical(i, j, player, matrixGame) {
    let count = 0;
    for (let k = Math.max(0, i - 4); k <= Math.min(matrixGame.length - 5, i); k++) {
        let consecutive = 0;
        for (let m = 0; m < 5; m++) {
            if (k + m < matrixGame.length && matrixGame[k + m][j] === player) {
                consecutive++;
            } else {
                break;
            }
        }
        count = Math.max(count, consecutive);
    }
    return count;
}

// Hàm kiểm tra số quân liên tiếp theo đường chéo phải
function getRightDiagonal(i, j, player, matrixGame) {
    let count = 0;
    for (let k = -4; k <= 0; k++) {
        if (i + k >= 0 && j + k >= 0 && i + k + 4 < matrixGame.length && j + k + 4 < matrixGame[0].length) {
            let consecutive = 0;
            for (let m = 0; m < 5; m++) {
                if (matrixGame[i + k + m][j + k + m] === player) {
                    consecutive++;
                } else {
                    break;
                }
            }
            count = Math.max(count, consecutive);
        }
    }
    return count;
}

// Hàm kiểm tra số quân liên tiếp theo đường chéo trái
function getLeftDiagonal(i, j, player, matrixGame) {
    let count = 0;
    for (let k = -4; k <= 0; k++) {
        if (i + k >= 0 && j - k - 4 >= 0 && i + k + 4 < matrixGame.length && j - k < matrixGame[0].length) {
            let consecutive = 0;
            for (let m = 0; m < 5; m++) {
                if (matrixGame[i + k + m][j - k - m] === player) {
                    consecutive++;
                } else {
                    break;
                }
            }
            count = Math.max(count, consecutive);
        }
    }
    return count;
}

// Hàm tính điểm và chọn nước đi cho máy
function getPointsComputer(matrixGame) {
    let maxScore = -Infinity;
    let pointsComputer = [];
    let listScorePoint = [];
    for (let i = 0; i < matrixGame.length; i++) {
        for (let j = 0; j < matrixGame[0].length; j++) {
            if (matrixGame[i][j] === "") {
                let score =
                    MAP_SCORE_COMPUTER.get(
                        Math.max(
                            getHorizontal(i, j, O, matrixGame),
                            getVertical(i, j, O, matrixGame),
                            getRightDiagonal(i, j, O, matrixGame),
                            getLeftDiagonal(i, j, O, matrixGame)
                        )
                    ) +
                    MAP_POINT_HUMAN.get(
                        Math.max(
                            getHorizontal(i, j, X, matrixGame),
                            getVertical(i, j, X, matrixGame),
                            getRightDiagonal(i, j, X, matrixGame),
                            getLeftDiagonal(i, j, X, matrixGame)
                        ) - 1
                    );
                if (maxScore <= score) {
                    maxScore = score;
                    listScorePoint.push({
                        score: score,
                        point: [i, j],
                    });
                }
            }
        }
    }

    for (const element of listScorePoint) {
        if (element.score === maxScore) {
            pointsComputer.push(element.point);
        }
    }
    return pointsComputer[Math.floor(Math.random() * pointsComputer.length)];
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