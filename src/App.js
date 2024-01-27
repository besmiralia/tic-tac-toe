import { useState } from 'react';

function Square({ value, winClass, onSquareClick }) {
    return (
        <button className={"square " + winClass} onClick={onSquareClick}>
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, winningBoxes, onPlay, onWinner }) {

    const handleSquareClick = (i) => {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }
        onPlay(nextSquares);
    }
    const calculateWinner = (boxes) => {
        if (boxes.some(x => x == null) == 0) return { winner: -1, boxes: [] };
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
            if (boxes[a] && boxes[a] === boxes[b] && boxes[a] === boxes[c]) {
                return { winner: boxes[a], boxes: lines[i] };
            }
        }
        return null;
    }
    const winResult = calculateWinner(squares);
    let status;
    if (winResult && winResult.winner == -1) {
        status = 'Game Over';
    } else if (winResult) {
        status = 'Winner: ' + winResult.winner;
        if(winningBoxes.length == 0) onWinner(winResult.boxes);
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }


    return (
        <>
            <div className="status">{status}</div>
            {[0, 1, 2].map((x, i) => {
                return (
                    <div key={x} className="board-row">
                        {[0, 1, 2].map((y, j) => {
                            const v = x * 3 + y;
                            let winClass = "";
                            if (winningBoxes.includes(v)) winClass = "win";
                            return (
                                <Square key={v} value={squares[v]} winClass={winClass} onSquareClick={() => handleSquareClick(v)} />
                            )
                        })
                        }
                    </div>
                )
            })
            }
        </>
    );
}

export default function Game() {

    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [selectedMove, setSelectedMove] = useState(0);
    const [winningBoxes, setWinningBoxes] = useState([]);

    const xIsNext = selectedMove % 2 === 0;
    const currentSquares = history[selectedMove];

    const handlePlay = (nextSquares) => {
        const nextHistory = [...history.slice(0, selectedMove + 1), nextSquares];
        setHistory(nextHistory);
        setSelectedMove(nextHistory.length - 1);
    }
    const handleWin = (boxes) => {
        setWinningBoxes(boxes);
    }

    const jumpTo = (nextMove) => {
        setSelectedMove(nextMove);
    }


    const size = history.length - 1;
    const moves = history.map((squares, move) => {
        let description;
        if (move > 0) {
            description = 'Go to move #' + move;
        } else {
            description = 'Go to game start';
        }
        return (
            <li key={move}>
                {move === size && (<p>You are at move {move}</p>)}
                {move !== size && (<button onClick={() => jumpTo(move)}>{description}</button>)}
            </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    xIsNext={xIsNext}
                    squares={currentSquares}
                    winningBoxes={winningBoxes}
                    onPlay={handlePlay}
                    onWinner={handleWin}
                />
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    );
}


