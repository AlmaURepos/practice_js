import treeFactory from "../tree/TreeFactory.js";

export function benchmark(){
    const stats = treeFactory.getStats();
    console.log("Benchmark Results:");
    console.log(`Total Trees Rendered: ${stats.totalTrees}`);
    console.log(`Unique Flyweights Created: ${stats.uniqueFlyweights}`);
    console.log(`Approximate Memory Saved: ${stats.memorySaved}%`);
}