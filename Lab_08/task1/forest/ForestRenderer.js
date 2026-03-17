// ForestRenderer.js-Uses flyweights to render forest
import treeFactory from "../tree/TreeFactory.js";

export class ForestRenderer {
    constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.trees = [];
    }


addTree(x, y, type, species, foliageColor, trunkColor, height,
width, scale, rotation) {
    // Get or create flyweight (intrinsic state shared)
    const flyweight = treeFactory.getTree(type, species,
        foliageColor, trunkColor, height, width);
        // Store only extrinsic state
        this.trees.push({
        flyweight,
        x,
        y,
        scale,
        rotation
    });
}

generateForest(count = 10000) {
    const types = ["pine", "oak", "birch", "maple"];
    const speciesMap = {
        pine: { foliage: "#228B22", trunk: "#8B4513", h: 80, w: 30 },
        oak: { foliage: "#006400", trunk: "#654321", h: 60, w: 40 },
        birch: { foliage: "#90EE90", trunk: "#F5F5DC", h: 70, w: 20
        },
        maple: { foliage: "#FF8C00", trunk: "#A0522D", h: 65, w: 35 }
    };

    for (let i = 0; i < count; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const config = speciesMap[type];
        this.addTree(
        Math.random() * this.canvas.width,
        Math.random() * this.canvas.height,
        type,
        type.charAt(0).toUpperCase() + type.slice(1),
        config.foliage,
        config.trunk,
        config.h,
        config.w,
        0.5 + Math.random() * 1,
        Math.random() * Math.PI * 2
        );
    }
}

render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const tree of this.trees) {
        tree.flyweight.render(this.ctx, tree.x, tree.y, tree.scale,
        tree.rotation);
    }
    return treeFactory.getStats();
    }
}
