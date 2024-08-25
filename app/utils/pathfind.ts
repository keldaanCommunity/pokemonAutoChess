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
        { x: 0, y: 1 },  // Down
        { x: 0, y: -1 }, // Up
        { x: 1, y: 1 },  // Down-right
        { x: -1, y: -1 },// Up-left
        { x: 1, y: -1 }, // Up-right
        { x: -1, y: 1 }, // Down-left
    ];

    return directions.map(dir => ({
        x: node.x + dir.x,
        y: node.y + dir.y,
        g: 0,
        h: 0,
        f: 0
    })).filter(neighbor => {
        const x = neighbor.x;
        const y = neighbor.y;
        return x >= 0 && x < grid[0].length && y >= 0 && y < grid.length && grid[y][x] !== 1;
    });
};

export const findPath = (board: Board, start: [number, number], goal: [number, number]): [number, number][] => {
    const gridCopy = defaultGrid.map(row => row.slice()); // Copy grid to modify for path
    const pokemonCoordinates = board.getAllPokemonCoordinates(board);
    //console.log('Pokémon coordinates:', pokemonCoordinates);
    pokemonCoordinates.forEach(({ x, y }) => {
        // Ensure the goal coordinates are not set to 1 on the matrix
        if (gridCopy[y] && gridCopy[y][x] !== undefined && !(x === goal[0] && y === goal[1])) {
            gridCopy[y][x] = 1; // Set the cell to 1 where Pokémon are located. Creates a 2d matrix map of obstacles(pokemon)
        }
    });
    // visualizeGrid(gridCopy); //uncomment to see obstacle map

    //below is A* algorithm that calculates path given a start coord and a goal coord.
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
                if (!(node.x === start[0] && node.y === start[1]) && !(node.x === goal[0] && node.y === goal[1])) {
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