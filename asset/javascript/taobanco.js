 let currentPlayer = 'X';
const startBtn = document.getElementById('startButton');
const boardSizeSelect = document.getElementById('boardSize');
const modeSelection = document.getElementById('modeSelection');
const themeBtn = document.getElementById('themeBtn');
const board = document.getElementById('board');
// hàm tạo bàn cờ
function createBoard(size) {
  board.innerHTML = ''; // xóa bàn cũ
  board.classList.remove('dark');
  board.classList.add('light');
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.style.display = 'inline-block';   // đứng cạnh nhau
      cell.style.width = '30px';
      cell.style.height = '30px';
      cell.style.border = '1px solid #aaa';
      cell.style.textAlign = 'center';
      cell.style.verticalAlign = 'middle';
      cell.style.lineHeight = '30px'; // căn giữa chữ X/O

      // click để đánh X/O
      cell.addEventListener('click', () => {
        if (!cell.textContent) {
          cell.textContent = currentPlayer;
            cell.classList.add(currentPlayer.toLowerCase());
          currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
      });

      board.appendChild(cell);
    }
    // xuống dòng sau mỗi hàng
    board.appendChild(document.createElement('br'));
  }

  board.style.display = 'block';
}

// Khi bấm bắt đầu -> hiện chọn chế độ
startBtn.addEventListener('click', function() {
  if (boardSizeSelect.selectedIndex === 0) {
    alert('Vui lòng chọn kích thước bàn trước!');
    return;
  }
  modeSelection.style.display = 'block';
});

// Chơi với người
document.getElementById('playWithHuman').addEventListener('click', function() {
  const size = parseInt(boardSizeSelect.value);
  createBoard(size);
  themeBtn.style.display = 'inline-block';
  modeSelection.style.display = 'none';
});

// Chơi với máy
document.getElementById('playWithComputer').addEventListener('click', function() {
  const size = parseInt(boardSizeSelect.value);
  createBoard(size);
  themeBtn.style.display = 'inline-block';
  modeSelection.style.display = 'none';
});

 themeBtn.addEventListener('click', function() {
    board.classList.toggle('dark');
    board.classList.toggle('light');
     console.log('Đã đổi giao diện!');
});