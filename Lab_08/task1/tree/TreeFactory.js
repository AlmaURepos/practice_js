import { FlyweightTree } from "./FlyweightTree.js";

class TreeFactory {
    constructor() {
        this.trees = new Map();
        this.treeCount = 0;
    }

getTree(type, species, foliageColor, trunkColor, height, width) {
    const key = `${type}-${species}-${foliageColor}-${trunkColor}-${height}-${width}`;
    if (!this.trees.has(key)) {
        const tree = new FlyweightTree(type, species, foliageColor,
        trunkColor, height, width);
        this.trees.set(key, tree);
        console.log(`[Factory] Created new flyweight: ${key}`);
    } else {
    console.log(`[Factory] Reusing existing flyweight: ${key}`);
    }
    this.treeCount++;
    return this.trees.get(key);
}

getStats() {
    return {
        totalTrees: this.treeCount,
        uniqueFlyweights: this.trees.size,
        memorySaved: (this.treeCount-this.trees.size) * 100 //Approximate %
    };
}
}


// Singleton instance
const treeFactory = new TreeFactory();
export default treeFactory;