import React, { useState, useEffect } from 'react';
import Node from '../Node/Node';
import './PathfindingVisualizer.css';
import { dijkstra, getNodesInShortestPathOrder } from '../../algorithms/dijkstra';
import { recursiveDivisionMaze } from '../../algorithms/mazeGenerator';
import { astar } from '../../algorithms/astar';

// --- SUB-COMPONENT: STATS CARD (Moved to top for safety) ---
const StatsCard = ({ title, data, color }) => (
    <div style={{
        border: `3px solid ${color}`,
        borderRadius: "8px",
        padding: "15px",
        textAlign: "left",
        minWidth: "220px",
        backgroundColor: "white",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        color: "#2d3436"
    }}>
        <h3 style={{ margin: "0 0 10px 0", color: color, textTransform: 'uppercase', fontSize: '1.2rem' }}>{title}</h3>
        <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
            <div><strong>Visited Nodes:</strong> {data.visited}</div>
            <div><strong>Path Length:</strong> {data.path}</div>
            <div><strong>Time:</strong> {data.time} ms</div>
        </div>
    </div>
);

const PathfindingVisualizer = () => {
    const [grid, setGrid] = useState([]);
    const [mouseIsPressed, setMouseIsPressed] = useState(false);

    // Stats State
    const [stats, setStats] = useState({
        dijkstra: { visited: 0, path: 0, time: 0 },
        astar: { visited: 0, path: 0, time: 0 }
    });

    const START_NODE_ROW = 10;
    const START_NODE_COL = 15;
    const FINISH_NODE_ROW = 10;
    const FINISH_NODE_COL = 35;

    useEffect(() => {
        const initialGrid = getInitialGrid();
        setGrid(initialGrid);
    }, []);

    const generateMaze = () => {
        clearBoard();
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const walls = recursiveDivisionMaze(grid, startNode, finishNode);

        for (let i = 0; i < walls.length; i++) {
            setTimeout(() => {
                const wall = walls[i];
                const newGrid = getNewGridWithWallToggled(grid, wall.row, wall.col);
                setGrid(newGrid);
            }, 10 * i);
        }
    };

    // Soft Reset: Clears colors/path but KEEPS walls for comparison
    const clearPath = () => {
        const newGrid = grid.slice();
        for (let row = 0; row < 20; row++) {
            for (let col = 0; col < 50; col++) {
                const node = newGrid[row][col];

                const newNode = {
                    ...node,
                    distance: Infinity,
                    totalDistance: Infinity,
                    isVisited: false,
                    isStart: row === START_NODE_ROW && col === START_NODE_COL,
                    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
                    previousNode: null,
                };
                newGrid[row][col] = newNode;

                if (!node.isWall) {
                    let extraClass = '';
                    if (newNode.isFinish) extraClass = 'node-finish';
                    else if (newNode.isStart) extraClass = 'node-start';
                    document.getElementById(`node-${row}-${col}`).className = `node ${extraClass}`;
                } else {
                    document.getElementById(`node-${row}-${col}`).className = 'node node-wall';
                }
            }
        }
        setGrid(newGrid);
    };

    const clearBoard = () => {
        const newGrid = getInitialGrid();
        setGrid(newGrid);

        for (let row = 0; row < 20; row++) {
            for (let col = 0; col < 50; col++) {
                const node = newGrid[row][col];
                let extraClass = '';
                if (node.isFinish) extraClass = 'node-finish';
                else if (node.isStart) extraClass = 'node-start';
                else if (node.isWall) extraClass = 'node-wall';
                document.getElementById(`node-${row}-${col}`).className = `node ${extraClass}`;
            }
        }

        setStats({
            dijkstra: { visited: 0, path: 0, time: 0 },
            astar: { visited: 0, path: 0, time: 0 }
        });
    };

    // --- ALGORITHMS ---

    const visualizeDijkstra = () => {
        clearPath();
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

        const startTime = performance.now();
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        const endTime = performance.now();

        setStats(prev => ({
            ...prev,
            dijkstra: {
                visited: visitedNodesInOrder.length,
                path: nodesInShortestPathOrder.length,
                time: (endTime - startTime).toFixed(2)
            }
        }));

        animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    };

    const visualizeAStar = () => {
        clearPath();
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

        const startTime = performance.now();
        const visitedNodesInOrder = astar(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        const endTime = performance.now();

        setStats(prev => ({
            ...prev,
            astar: {
                visited: visitedNodesInOrder.length,
                path: nodesInShortestPathOrder.length,
                time: (endTime - startTime).toFixed(2)
            }
        }));

        animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    };

    // --- ANIMATION ---
    const animateAlgorithm = (visitedNodesInOrder, nodesInShortestPathOrder) => {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                if (!node.isStart && !node.isFinish) {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
                }
            }, 10 * i);
        }
    };

    const animateShortestPath = (nodesInShortestPathOrder) => {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                if (!node.isStart && !node.isFinish) {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
                }
            }, 50 * i);
        }
    };

    // --- MOUSE HANDLERS ---
    const handleMouseDown = (row, col) => {
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        setGrid(newGrid);
        setMouseIsPressed(true);
    };
    const handleMouseEnter = (row, col) => {
        if (!mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        setGrid(newGrid);
    };
    const handleMouseUp = () => setMouseIsPressed(false);

    // --- HELPERS ---
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
            col, row,
            isStart: row === START_NODE_ROW && col === START_NODE_COL,
            isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
            distance: Infinity, totalDistance: Infinity,
            isVisited: false, isWall: false, previousNode: null,
        };
    };

    const getNewGridWithWallToggled = (grid, row, col) => {
        const newGrid = grid.slice();
        const node = newGrid[row][col];
        const newNode = { ...node, isWall: !node.isWall };
        newGrid[row][col] = newNode;
        return newGrid;
    };

    // --- HELPER FOR COMPARISON TEXT ---
    const getComparisonText = () => {
        if (stats.dijkstra.visited === 0 || stats.astar.visited === 0) return null;

        const diff = stats.dijkstra.visited - stats.astar.visited;
        if (diff > 0) {
            const percent = ((diff / stats.dijkstra.visited) * 100).toFixed(0);
            return `Result: A* explored ${diff} fewer nodes (${percent}% more efficient)`;
        } else if (diff < 0) {
            return `Result: Dijkstra was somehow more efficient (Rare!)`;
        }
        return `Result: Both algorithms performed equally`;
    };

    // --- RENDER ---
    return (
        <>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button onClick={() => generateMaze()} style={btnStyle("#6c5ce7")}>Generate Maze</button>
                <button onClick={() => visualizeDijkstra()} style={btnStyle("#0984e3")}>Visualize Dijkstra</button>
                <button onClick={() => visualizeAStar()} style={btnStyle("#00b894")}>Visualize A*</button>
                <button onClick={() => clearBoard()} style={btnStyle("#d63031")}>Clear Board</button>
            </div>

            {/* STATS DASHBOARD */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "20px 0" }}>
                <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                    <StatsCard
                        title="Dijkstra's Algorithm"
                        data={stats.dijkstra}
                        color="#0984e3"
                    />
                    <StatsCard
                        title="A* Search"
                        data={stats.astar}
                        color="#00b894"
                    />
                </div>

                {/* Comparison Text */}
                {getComparisonText() && (
                    <div style={{
                        marginTop: "15px",
                        padding: "10px 20px",
                        backgroundColor: "#dfe6e9",
                        borderRadius: "5px",
                        fontWeight: "bold",
                        color: "#2d3436"
                    }}>
                        {getComparisonText()}
                    </div>
                )}
            </div>

            <div className="grid">
                {grid.map((row, rowIdx) => (
                    <div key={rowIdx}>
                        {row.map((node, nodeIdx) => (
                            <Node
                                key={nodeIdx}
                                col={node.col}
                                row={node.row}
                                isFinish={node.isFinish}
                                isStart={node.isStart}
                                isWall={node.isWall}
                                mouseIsPressed={mouseIsPressed}
                                onMouseDown={(row, col) => handleMouseDown(row, col)}
                                onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                                onMouseUp={() => handleMouseUp()}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
};

// Button Style Helper
const btnStyle = (color) => ({
    marginRight: "10px",
    padding: "10px 20px",
    background: color,
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
    fontWeight: "bold",
    fontSize: "14px"
});

export default PathfindingVisualizer;