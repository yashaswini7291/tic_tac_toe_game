import React, { useState } from 'react';
import './tic.css';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function GameOverMessage({ winner, onRestart }) {
  return (
    <div className="game-over-message">
      {winner ? `Congrats Winner: ${winner}` : "It's a draw!"}
      <div onClick={onRestart}>Game Over! Tap to restart</div>
    </div>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [gameOver, setGameOver] = useState(false);
  const [step, setStep] = useState(0);
  const [stepHistory, setStepHistory] = useState(new Map().set(0, Array(9).fill(null)));

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i] || gameOver) {
      return;
    }

    const currentSquares = squares.slice();
    currentSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(currentSquares);
    setXIsNext(!xIsNext);
    setGameOver(isGameOver(currentSquares));

    // Update the step and history
    const newStep = step + 1;
    setStep(newStep);
    const newStepHistory = new Map(stepHistory);
    newStepHistory.set(newStep, currentSquares);
    setStepHistory(newStepHistory);
  }

  function isGameOver(currentSquares) {
    return calculateWinner(currentSquares) || currentSquares.every((square) => square);
  }

  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setGameOver(false);
    setStep(0);
    setStepHistory(new Map().set(0, Array(9).fill(null)));
  }

  function handleUndo() {
    if (step > 0 && !calculateWinner(squares)) {
      const newStep = step - 1;
      setStep(newStep);
      setSquares(stepHistory.get(newStep));
      setXIsNext(newStep % 2 === 0);
      setGameOver(false);
    }
  }

  function handleRedo() {
    if (step < stepHistory.size - 1 && !calculateWinner(squares)) {
      const newStep = step + 1;
      setStep(newStep);
      setSquares(stepHistory.get(newStep));
      setXIsNext(newStep % 2 === 0);
      setGameOver(false);
    }
  }

  return (
    <>
      <div className="board">
        <div className="status">
          {gameOver ? (calculateWinner(squares) ? `Winner: ${calculateWinner(squares)}` : "It's a draw!") : `Next player: ${xIsNext ? 'X' : 'O'}`}
        </div>
        <div className="board-row">
          <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
          <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
          <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        </div>
        <div className="board-row">
          <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
          <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
          <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        </div>
        <div className="board-row">
          <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
          <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
          <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
        </div>
      </div>
      {gameOver && <GameOverMessage winner={calculateWinner(squares)} onRestart={handleRestart} />}
      <div className="restart-button">
        <button onClick={handleRestart}>Restart Game</button>
      </div>

      <div className="undo-redo-buttons">
        <button onClick={handleUndo} disabled={step === 0 || calculateWinner(squares)}>
          Undo
        </button>
        <button onClick={handleRedo} disabled={step === stepHistory.size - 1 || calculateWinner(squares)}>
          Redo
        </button>
      </div>
    </>
  );
}
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
