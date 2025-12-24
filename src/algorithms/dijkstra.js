// Performs Dijkstra's algorithm; returns *all* visited nodes in the order
// they were visited. Also makes nodes point back to their previous node,
// effectively allowing us to compute the shortest path by backtracking from the finish node.

export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  
  // 1. Initialize: Start node has 0 distance. All others have Infinity (set in grid creation).
  startNode.distance = 0;
  
  // 2. Get a flat list of all unvisited nodes
  const unvisitedNodes = getAllNodes(grid);

  while (!!unvisitedNodes.length) {
    // 3. Sort nodes by distance. 
    // This effectively acts like a Priority Queue (Min-Heap).
    sortNodesByDistance(unvisitedNodes);
    
    // Pop the closest node
    const closestNode = unvisitedNodes.shift();

    // WALL CHECK: If we hit a wall, we skip it.
    if (closestNode.isWall) continue;

    // TRAPPED CHECK: If the closest node is at distance Infinity,
    // we must be trapped and should stop.
    if (closestNode.distance === Infinity) return visitedNodesInOrder;

    // 4. Mark as visited and add to our animation list
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    // SUCCESS CHECK: If we reached the finish node, we are done!
    if (closestNode === finishNode) return visitedNodesInOrder;

    // 5. Update neighbors
    updateUnvisitedNeighbors(closestNode, grid);
  }
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    // Relax the edge: neighbor distance = current + 1
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node; // Critical for backtracking the path!
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const {col, row} = node;
  
  // Check Up, Down, Left, Right (standard grid movement)
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  
  // Only return neighbors that haven't been visited
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

// Backtracks from the finishNode to find the shortest path.
// Only works if called *after* the dijkstra method above.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}