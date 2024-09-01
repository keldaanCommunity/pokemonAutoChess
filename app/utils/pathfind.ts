import Board from "../core/board";
const defaultGrid: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
];

export type Node = {
    x: number;
    y: number;
    g: number; // Cost from start node
    h: number; // Heuristic cost to goal
    f: number; // Total cost
    parent?: Node; // To reconstruct the path
};

export const getHeuristic = (a: Node, b: Node): number => {
    return Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y));
};

export const getNeighbors = (node: Node, grid: number[][]): Node[] => {
    const directions = [
        { x: 1, y: 0 },  // Right
        { x: -1, y: 0 }, // Left
        { x: 0, y: 1 },  // Up
        { x: 0, y: -1 }, // Down
        { x: 1, y: 1 },  // Up-Right
        { x: -1, y: -1 },// Down-Left
        { x: 1, y: -1 }, // Down-Right
        { x: -1, y: 1 }, // Up-Left
    ];

    const neighbors: Node[] = [];

    directions.forEach(dir => {
        const x = node.x + dir.x;
        const y = node.y + dir.y;

        // Check if the coordinates are within grid bounds
        if (x >= 0 && x < grid[0].length && y >= 0 && y < grid.length) {
            if (grid[y][x] === 1) {
            } else {
                neighbors.push({
                    x,
                    y,
                    g: 0,
                    h: 0,
                    f: 0,
                    parent: node
                });
            }
        }
    });

    return neighbors;
};


export const findPath = (board: Board, start: [number, number], goal: [number, number]): [number, number][] => {
    const gridCopy = defaultGrid.map(row => row.slice());
    const pokemonCoordinates = board.getAllPokemonCoordinates(board);
    pokemonCoordinates.forEach(({ x, y }) => {
        if (gridCopy[y] && gridCopy[y][x] !== undefined && !(x === goal[0] && y === goal[1])) {
            gridCopy[y][x] = 1; // Set cells to 1 where Pokémon are located, unless it’s the goal
        }
    });
    //visualizeGrid(gridCopy); // Uncomment to see obstacle map

    const startNode: Node = { x: start[0], y: start[1], g: 0, h: getHeuristic({ x: start[0], y: start[1], g: 0, h: 0, f: 0 }, { x: goal[0], y: goal[1], g: 0, h: 0, f: 0 }), f: 0 };
    startNode.f = startNode.g + startNode.h;
    const goalNode: Node = { x: goal[0], y: goal[1], g: 0, h: 0, f: 0 };
    const openList: Node[] = [startNode];
    const closedList: Set<string> = new Set();

    while (openList.length > 0) {
        openList.sort((a, b) => a.f - b.f);
        const currentNode = openList.shift()!;
        closedList.add(`${currentNode.x},${currentNode.y}`);

        if (currentNode.x === goalNode.x && currentNode.y === goalNode.y) {
            const path: [number, number][] = [];
            let node: Node | undefined = currentNode;
            while (node) {
                // Include all nodes except the start node in the path
                if (!(node.x === start[0] && node.y === start[1])) {
                    path.unshift([node.x, node.y]);
                }
                node = node.parent;
            }
            return path;
        }

        for (const neighbor of getNeighbors(currentNode, gridCopy)) {
            if (closedList.has(`${neighbor.x},${neighbor.y}`)) continue;

            const g = currentNode.g + (neighbor.x !== currentNode.x && neighbor.y !== currentNode.y ? Math.SQRT2 : 1);
            const h = getHeuristic({ x: neighbor.x, y: neighbor.y, g: 0, h: 0, f: 0 }, goalNode);
            const f = g + h;

            const openNode = openList.find(n => n.x === neighbor.x && n.y === neighbor.y);
            if (openNode && f >= openNode.f) continue;

            const newNode: Node = { x: neighbor.x, y: neighbor.y, g, h, f, parent: currentNode };
            openList.push(newNode);
        }
    }

    return [];
};


export const visualizeGrid = (grid: number[][]): void => {
    console.log('Grid Visualization:');
    // Iterate through each row of the grid in reverse order (displays 0,0 on bottom left)
    for (let y = grid.length - 1; y >= 0; y--) {
        // Convert each cell in the row to a string and join with spaces
        const rowString = grid[y].map(cell => cell.toString()).join(' ');
        console.log(rowString);
    }
};
