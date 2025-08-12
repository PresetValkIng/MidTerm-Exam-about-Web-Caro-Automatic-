// Logic cho máy đánh trong chế độ chơi với người (COMPUTER)
function computerMove() {
  let pointsComputer = getPointsComputer();
  matrixGame[pointsComputer[0]][pointsComputer[1]] = O;
  document.getElementById(
    pointsComputer[0].toString() + "-" + pointsComputer[1].toString()
  ).innerHTML = OText;

  // Kiểm tra thắng
  if (checkWin(pointsComputer)) {
    return WIN;
  }

  // Kiểm tra hòa
  if (checkDraw()) {
    return DRAW;
  }

  player = player === X ? O : X;
}

// Logic cho chế độ máy đấu với máy (COMPUTER_COMPUTER)
async function computerVsComputer(sumPoints) {
  for (let i = 0; i < sumPoints; i++) {
    await delay(1000);
    // Máy A (X)
    let pointsComputerA = getPointsComputer();
    if (isFirst) {
      isFirst = false;
      pointsComputerA = [Math.floor(matrixGame.length / 2), Math.floor(matrixGame[0].length / 2)];
    }
    matrixGame[pointsComputerA[0]][pointsComputerA[1]] = X;
    document.getElementById(
      pointsComputerA[0].toString() + "-" + pointsComputerA[1].toString()
    ).innerHTML = XText;

    // Kiểm tra thắng
    if (checkWin(pointsComputerA)) {
      return WIN;
    }

    // Kiểm tra hòa
    if (checkDraw()) {
      return DRAW;
    }

    player = player === X ? O : X;

    await delay(1000);
    // Máy B (O)
    let pointsComputerB = getPointsComputer();
    matrixGame[pointsComputerB[0]][pointsComputerB[1]] = O;
    document.getElementById(
      pointsComputerB[0].toString() + "-" + pointsComputerB[1].toString()
    ).innerHTML = OText;

    // Kiểm tra thắng
    if (checkWin(pointsComputerB)) {
      return WIN;
    }

    // Kiểm tra hòa
    if (checkDraw()) {
      return DRAW;
    }

    player = player === X ? O : X;
  }
}

// Hàm tính điểm cho máy (dùng chung cho cả hai chế độ)
function getPointsComputer() {
  let maxScore = -Infinity;
  let pointsComputer = [];
  let listScorePoint = [];
  for (let i = 0; i < matrixGame.length; i++) {
    for (let j = 0; j < matrixGame[0].length; j++) {
      if (matrixGame[i][j] === "") {
        let score =
          MAP_SCORE_COMPUTER.get(
            Math.max(
              getHorizontal(i, j, O),
              getVertical(i, j, O),
              getRightDiagonal(i, j, O),
              getLeftDiagonal(i, j, O)
            )
          ) +
          MAP_POINT_HUMAN.get(
            Math.max(
              getHorizontal(i, j, X),
              getVertical(i, j, X),
              getRightDiagonal(i, j, X),
              getLeftDiagonal(i, j, X)
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

  // Lấy danh sách các điểm có điểm số cao nhất
  for (const element of listScorePoint) {
    if (element.score === maxScore) {
      pointsComputer.push(element.point);
    }
  }
  return pointsComputer[Math.floor(Math.random() * pointsComputer.length)];
}