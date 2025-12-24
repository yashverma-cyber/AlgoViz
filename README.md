# 🧭 AlgoViz: Pathfinding Visualizer

> An interactive, high-performance visualization tool for graph algorithms like Dijkstra, A* (A-Star), and Maze Generation.

![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square&logo=react)
![Algorithm](https://img.shields.io/badge/Algorithm-Dijkstra%20%2F%20A*-orange?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 🎥 Demo

**[Insert Link to Live Vercel/Netlify Demo Here]**

*(Optional: Add a GIF here of the visualizer running)*

## 🚀 Introduction

**AlgoViz** is a React application built to visualize how pathfinding algorithms work in real-time. It translates abstract concepts—like graph traversal and heuristics—into satisfying visual animations.

The core challenge of this project was **performance**. Rendering 2,500+ nodes (50x50 grid) in React can be slow. This project implements advanced optimization techniques to ensure 60FPS animations even on lower-end devices.

## ✨ Features

- **Algorithms:**
  - **Dijkstra's Algorithm:** Guarantees the shortest path (weighted).
  - **A* Search (A-Star):** Uses heuristics to find the shortest path much faster than Dijkstra.
- **Maze Generation:**
  - **Recursive Division:** Automatically generates complex mazes using a divide-and-conquer strategy.
- **Interaction:**
  - Draw walls by clicking and dragging.
  - Move Start and Finish nodes (Coming Soon).
  - Clear board and reset path.
- **Visuals:**
  - Real-time animations for visited nodes and the shortest path.
  - "Swarming" animation for Dijkstra vs "Focused Beam" for A*.
  - "Statistics" for both Algorithms, whichever is used.
  - "Comparision" with "Efficiency" finder between both Algorithms if both are visualized.

## ⚡ Performance Optimization (The "X-Factor")

A standard React approach would store the grid in `useState` and update it during the algorithm's execution.
> *Problem:* This triggers thousands of re-renders per second, freezing the browser.

**My Solution:**
1.  **Direct DOM Manipulation:** The animation loop bypasses React's Virtual DOM and modifies the CSS classes of HTML elements directly (`document.getElementById`).
2.  **Single-Pass Computation:** The algorithm runs instantly in the background, generating an array of visited nodes. The visualizer merely "plays back" this array.
3.  **CSS Animations:** Heavy lifting is offloaded to the GPU via CSS keyframes (`transform`, `scale`).

## 🛠️ Tech Stack

- **Frontend:** React.js (Vite)
- **Styling:** CSS3
- **Logic:** JavaScript (ES6+)
- **Algorithms:** Graph Theory (BFS, Dijkstra, A*, Recursive Division)

## 📦 Getting Started

### Prerequisites
Make sure you have Node.js installed.

### Installation

1. Clone the repo:
   ```bash
   git clone [https://github.com/yashverma-cyber/algoviz.git](https://github.com/yashverma-cyber/algoviz.git)

2. Install Dependencies:
   ```bash
   cd algoviz
   npm install

3. Run the development server:
   ```bash
   npm run dev

4. Open ```http://localhost:5173``` in your browser.

🧠 Algorithms Explained
Dijkstra
The classic. It spreads out in a circle (like water spilling) from the start node, guaranteeing the shortest path. It is "blind" because it searches in all directions equally.

A* (A-Star)
The smart one. It uses a heuristic function (Manhattan Distance) to estimate the distance to the goal. It prioritizes nodes that move towards the target, resulting in a much faster search (often exploring 90% fewer nodes than Dijkstra).

🤝 Contributing
Contributions are welcome!

Fork the project.

Create your feature branch (git checkout -b feature/AmazingFeature).

Commit your changes (git commit -m 'Add some AmazingFeature').

Push to the branch (git push origin feature/AmazingFeature).

Open a Pull Request.

📄 License
Distributed under the MIT License. See LICENSE for more information
