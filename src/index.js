import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// In React terms, the Square components are now controlled components. The Board has full control over them.
// class Square extends React.Component {
//     render() {
//         return (
//             // use this.porps to get its own props which set on the upper element Board 
//             <button 
//                 className = "square" 
//                 // We could give any name to the Square’s onClick prop or Board’s handleClick method, 
//                 // and the code would work the same.
//                 // In React, it’s conventional to use on[Event] names for props which represent events 
//                 // and handle[Event] for the methods which handle the events.
//                 onClick = {() => this.props.onClick()}
//                 style = {{
//                     width: '50px',
//                     height: '50px',
//                 }}
//             >
//                 {this.props.value}
//             </button>
//         );
//     }
// }


// In React, function components are a simpler way to write components that only contain a render method 
// and don’t have their own state.
function Square(props) {
    console.log('Square has been re-rendered!!!!!!!')
    return (
        // When we modified the Square to be a function component, we also changed 
        // onClick={() => this.props.onClick()} to a shorter onClick={props.onClick}
        <button 
            className = "square" 
            onClick = {props.onClick}
        >
            {props.value}
        </button>
    );
}
  
class Board extends React.Component {
    // method
    renderSquare(i) {
        return (
            // set the props of Square element
            <Square 
                // When the Board’s state changes, the Square components re-render automatically.
                value = {this.props.squares[i]}
                onClick = {() => this.props.onClick(i)}
            />
        );
    }

    render() {
        console.log('Board has been re-rendered!!!!!!');
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    // declare squares array in the this.state of Board
    // use it to remember the state (X, O, null) of 9 Square
    constructor(props) {
        // construct React.Component then you can use the this.state and so on
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber+1);
        const current = history[history.length-1];
        // return a copy of a section of an array.
        const squares = current.squares.slice();

        // ignore a click if someone has won the game or if a Square is already filled
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            // Unlike the array push() method you might be more familiar with, 
            // the concat() method doesn’t mutate the original array, so we prefer it.
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        console.log('Game has been re-rendered!!!!!');
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        // When a list is re-rendered, React takes each list item’s key and 
        // searches the previous list’s items for a matching key.
        // If the current list has a key that didn’t exist before, React creates a component. 
        // If the current list is missing a key that existed in the previous list, React destroys the previous component. 
        // If two keys match, the corresponding component is moved.
        // key is a special and reserved property in React (along with ref, a more advanced feature). 
        // When an element is created, React extracts the key property and stores the key directly on the returned element. 
        // Even though key may look like it belongs in props, key cannot be referenced using this.props.key. 
        // React automatically uses key to decide which components to update. A component cannot inquire about its key.
        // ***It’s strongly recommended that you assign proper keys whenever you build dynamic lists (given to the elements inside the array).
        // If no key is specified, React will present a warning and use the array index as a key by default.
        // Using the array index as a key is problematic when trying to re-order a list’s items or inserting/removing list items.
        // ***The best way to pick a key is to use a string that uniquely identifies a list item among its siblings.

        // ***The moves are never re-ordered, deleted, or inserted in the middle, so it’s safe to use the move index as a key.
        // step: each object(squares) in history
        // move: the index of the current object(squares)
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares = {current.squares}
                        onClick = {(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
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
    for (let i=0; i<lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
