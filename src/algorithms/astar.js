export function astar(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];

  startNode.distance = 0;
  startNode.totalDistance = 0; // f = g + h

  let unvisitedNodes = getAllNodes(grid);

  while (!!unvisitedNodes.length) {
    // Sort nodes so we always process the one with the lowest "f score" first.
    // This makes the algorithm prioritize nodes that are closer to the finish.
    sortByTotalDistance(unvisitedNodes);

    const closestNode = unvisitedNodes.shift();

    // If we hit a wall, just skip it.
    if (closestNode.isWall) continue;

    // If the closest node is at Infinity, we're stuck (no path exists).
    if (closestNode.distance === Infinity) return visitedNodesInOrder;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    // Found the target!
    if (closestNode === finishNode) return visitedNodesInOrder;

    updateUnvisitedNeighbors(closestNode, grid, finishNode);
  }
}

function sortByTotalDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.totalDistance - nodeB.totalDistance);
}

function updateUnvisitedNeighbors(node, grid, finishNode) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {

    // Distance from start to this neighbor
    const newDistance = node.distance + 1;

    // If we found a shorter path to this neighbor, update it
    if (newDistance < neighbor.distance) {
      neighbor.distance = newDistance;

      // Calculate the "Heuristic" (Manhattan distance)
      // This is basically a guess of how far the finish node is.
      const distanceToFinish =
        Math.abs(neighbor.row - finishNode.row) +
        Math.abs(neighbor.col - finishNode.col);

      // Total score = distance from start + estimated distance to finish
      neighbor.totalDistance = newDistance + distanceToFinish;

      // Keep track of how we got here so we can draw the path later
      neighbor.previousNode = node;
    }
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;

  // Check all 4 directions (Up, Down, Left, Right)
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

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

export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;

  // Backtrack from the finish node all the way to the start
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}