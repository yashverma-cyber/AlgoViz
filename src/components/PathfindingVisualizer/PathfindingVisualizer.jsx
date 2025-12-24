import React, { useState, useEffect } from 'react';
import Node from '../Node/Node';
import './PathfindingVisualizer.css';
import { dijkstra, getNodesInShortestPathOrder } from '../../algorithms/dijkstra';
import { recursiveDivisionMaze } from '../../algorithms/mazeGenerator';
import { astar } from '../../algorithms/astar';

const PathfindingVisualizer = () => {
    const [grid, setGrid] = useState([]);
    const [mouseIsPressed, setMouseIsPressed] = useState(false);

    const START_NODE_ROW = 10;
    const START_NODE_COL = 15;
    const FINISH_NODE_ROW = 10;
    const FINISH_NODE_COL = 35;

    const generateMaze = () => {
        // 1. Clear existing board first
        clearBoard();

        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

        // 2. Get the list of walls from our algorithm
        const walls = recursiveDivisionMaze(grid, startNode, finishNode);

        // 3. Animate the walls placing one by one
        for (let i = 0; i < walls.length; i++) {
            setTimeout(() => {
                const wall = walls[i];
                const newGrid = getNewGridWithWallToggled(grid, wall.row, wall.col);
                setGrid(newGrid); // This time we use React state because walls are permanent
            }, 10 * i);
        }
    };

    useEffect(() => {
        const initialGrid = getInitialGrid();
        setGrid(initialGrid);
    }, []);

    // --- MOUSE HANDLERS ---
    const handleMouseDown = (row, col) => {
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        setGrid(newGrid);
        setMouseIsPressed(true);
    };

    const clearBoard = () => {
        // 1. Reset the Grid State (Walls, Logic)
        const newGrid = getInitialGrid();
        setGrid(newGrid);

        // 2. Reset the Visuals (Colors)
        // We loop through every node and strip the "node-visited" and "node-shortest-path" classes
        for (let row = 0; row < 20; row++) {
            for (let col = 0; col < 50; col++) {
                const node = newGrid[row][col];

                // Keep the start/finish/wall logic, just remove animations
                let extraClass = '';
                if (node.isFinish) extraClass = 'node-finish';
                else if (node.isStart) extraClass = 'node-start';
                else if (node.isWall) extraClass = 'node-wall';

                // Direct DOM update
                document.getElementById(`node-${row}-${col}`).className =
                    `node ${extraClass}`;
            }
        }
    };

    const handleMouseEnter = (row, col) => {
        if (!mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        setGrid(newGrid);
    };

    const handleMouseUp = () => {
        setMouseIsPressed(false);
    };

    // --- ALGORITHM RUNNER ---
    // --- ALGORITHM RUNNER ---

    const visualizeDijkstra = () => {
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

        // Call the animation function instead of console logging
        animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    };

    const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {

            // 1. If we are at the very last visited node, start the "Yellow Path" animation
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i); // Delay is based on how many nodes we visited
                return;
            }

            // 2. Animate the "Blue Swarm"
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                // Direct DOM Manipulation for performance!
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';
            }, 10 * i);
        }
    };

    const animateShortestPath = (nodesInShortestPathOrder) => {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path';
            }, 50 * i); // Slower animation for the final path (50ms vs 10ms)
        }
    };

    const visualizeAStar = () => {
        // 1. Clear previous paths (optional, but good UX)
        clearBoard();

        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

        // 2. Run A* instead of Dijkstra
        const visitedNodesInOrder = astar(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

        // 3. Reuse your existing animation engine!
        animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    };

    // --- HELPERS ---

    // FIX: This function should ONLY create the array, not render HTML
    const getInitialGrid = () => {
        const grid = [];
        for (let row = 0; row < 20; row++) {
            const currentRow = [];
            for (let col = 0; col < 50; col++) {
                currentRow.push(createNode(col, row));
            }
            grid.push(currentRow);
        }
        return grid;
    };

    const createNode = (col, row) => {
        return {
            col,
            row,
            isStart: row === START_NODE_ROW && col === START_NODE_COL,
            isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
            distance: Infinity,
            totalDistance: Infinity, // <--- ADD THIS for A*
            isVisited: false,
            isWall: false,
            previousNode: null,
        };
    };

    const getNewGridWithWallToggled = (grid, row, col) => {
        const newGrid = grid.slice();
        const node = newGrid[row][col];
        const newNode = {
            ...node,
            isWall: !node.isWall,
        };
        newGrid[row][col] = newNode;
        return newGrid;
    };

    // --- RENDER ---
    return (
        <>
            <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px" }}>

                <button
                    onClick={() => generateMaze()}
                    style={{ marginRight: "10px", padding: "10px 20px", background: "#6c5ce7", color: "white", border: "none", cursor: "pointer" }}
                >
                    Generate Maze
                </button>

                <button
                    onClick={() => visualizeDijkstra()}
                    style={{ marginRight: "10px", padding: "10px 20px", background: "#0984e3", color: "white", border: "none", cursor: "pointer" }}
                >
                    Visualize Dijkstra
                </button>

                <button
                    onClick={() => visualizeAStar()}
                    style={{ marginRight: "10px", padding: "10px 20px", background: "#00b894", color: "white", border: "none", cursor: "pointer" }}
                >
                    Visualize A*
                </button>

                <button
                    onClick={() => clearBoard()}
                    style={{ padding: "10px 20px", background: "#d63031", color: "white", border: "none", cursor: "pointer" }}
                >
                    Clear Board
                </button>

            </div>

            {/* 2. GRID GOES HERE */}
            <div className="grid">
                {grid.map((row, rowIdx) => {
                    return (
                        <div key={rowIdx}>
                            {row.map((node, nodeIdx) => {
                                const { row, col, isFinish, isStart, isWall } = node;
                                return (
                                    <Node
                                        key={nodeIdx}
                                        col={col}
                                        row={row}
                                        isFinish={isFinish}
                                        isStart={isStart}
                                        isWall={isWall}
                                        mouseIsPressed={mouseIsPressed}
                                        onMouseDown={(row, col) => handleMouseDown(row, col)}
                                        onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                                        onMouseUp={() => handleMouseUp()}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default PathfindingVisualizer;