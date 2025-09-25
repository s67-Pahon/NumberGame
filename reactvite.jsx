import React, { useRef, useEffect, useState } from 'react';

function App() {
  return (
    <div style={{ textAlign: 'center' }}>
      <GameBoard />
    </div>
  );
}

function drawX(ctx, row, col, lineSpacing) {
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 5;
  const x = col * lineSpacing;
  const y = row * lineSpacing;
  const padding = lineSpacing / 5;
  ctx.beginPath();
  ctx.moveTo(x + padding + 50, y + padding + 50);
  ctx.lineTo(x + 70 , y + 10);
  ctx.stroke();
}

function drawO(ctx, row, col, lineSpacing) {
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 5;
  const centerX = col * lineSpacing + lineSpacing / 2;
  const centerY = row * lineSpacing + lineSpacing / 2;
  const padding = lineSpacing / 5;
  const radius = lineSpacing / 2 - padding;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.stroke();
}

// NEW: draw number instead of X/O
function drawNumber(ctx, row, col, lineSpacing, value) {
  const x = col * lineSpacing + lineSpacing / 2;
  const y = row * lineSpacing + lineSpacing / 2;
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = Math.floor(lineSpacing * 0.5) + 'px Arial';
  ctx.fillText(String(value), x, y);
}

function isValidPlacement(board, gridSize, col, row, num){
  if (num < 1 || num > gridSize) return false;
}

isValidPlacement();

function calculateWinner(board, gridSize) {
  // Check rows
  for (let i = 0; i < gridSize; i++) {
    if (board[i][0] && board[i].every(cell => cell === board[i][0])) {
      return board[i][0];
    }
  }

  // Check columns
  for (let i = 0; i < gridSize; i++) {
    if (board[0][i]) {
      let isWin = true;
      for (let j = 1; j < gridSize; j++) {
        if (board[j][i] !== board[0][i]) {
          isWin = false;
          break;
        }
      }
      if (isWin) {
        return board[0][i];
      }
    }
  }

  // Check diagonal (top-left to bottom-right)


  // Check diagonal (top-right to bottom-left)


  return null;
}

function GameBoard() {
  const canvasRef = useRef(null);
  const [gridSize, setGridSize] = useState(5);
  const [canvasSize, setCanvasSize] = useState(gridSize * 100);

  const [turn, setTurn] = useState(1);
  const [board, setBoard] = useState(
    Array.from({ length: gridSize }, () => Array(gridSize).fill(null))
  );
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    setCanvasSize(gridSize * 100);
    setTurn(1);
    setBoard(Array.from({ length: gridSize }, () => Array(gridSize).fill(null)));
    setWinner(null);
  }, [gridSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const lineSpacing = canvas.width / gridSize;
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    for (let i = 1; i < gridSize; i++) {
      ctx.moveTo(lineSpacing * i, 0);
      ctx.lineTo(lineSpacing * i, canvas.height);
      ctx.moveTo(0, lineSpacing * i);
      ctx.lineTo(canvas.width, lineSpacing * i);
    }
    ctx.stroke();

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell !== null && cell !== undefined && cell !== '') {
          drawNumber(ctx, rowIndex, colIndex, lineSpacing, cell);
        }
      });
    });
  }, [board, gridSize]); 

  const handleCanvasClick = (event) => {
    if (winner || turn > gridSize * gridSize) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const lineSpacing = canvas.width / gridSize;
    const col = Math.floor(x / lineSpacing);
    const row = Math.floor(y / lineSpacing);

    if (board[row][col]) return;

    // NEW: prompt user for a number and place it into the cell
    const input = window.prompt('Enter a number');
    if (input === null) return; // cancel
    const value = input.trim();
    if (value === '') return;
    const num = parseInt(value, 10);
    if (isNaN(num)) return;

    const newBoard = board.map(arr => [...arr]);
    newBoard[row][col] = num;
    setBoard(newBoard);

    const newWinner = calculateWinner(newBoard, gridSize);
    if (newWinner) {
      setWinner(newWinner);
    }

    setTurn(turn + 1);
  };

  const handleReset = () => {
    setTurn(1);
    setBoard(Array.from({ length: gridSize }, () => Array(gridSize).fill(null)));
    setWinner(null);
  };

  let status;
  if (winner) {
    status = `Winner: Player ${winner}`;
  } else if (turn > gridSize * gridSize) {
    status = "It's a Draw!";
  } else {
    status = `Turn ${turn}: Player ${turn % 2 === 1 ? 'X' : 'O'}`;
  }

  return (
    <>
      <h2>Number game but i forgot how to do cell  or how type in number so now im stuck</h2>
      <div style={{ margin: '10px 0' }}>
      </div>
      <h2>{status}</h2>
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        style={{ border: '1px solid black' }}
        onClick={handleCanvasClick}
      ></canvas>
      <div>
        <button id="reset-btn" onClick={handleReset} style={{ marginTop: '10px' }}>
          Reset
        </button>
      </div>
    </>
  );
}

export default App;
