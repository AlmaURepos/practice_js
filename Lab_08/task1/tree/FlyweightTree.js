export class FlyweightTree {
    constructor(type, species, foliageColor, trunkColor, height, width) {
        this.type = type;
        // Intrinsic: shared
        this.species = species;
        // Intrinsic: shared
        this.foliageColor = foliageColor; // Intrinsic: shared
        this.trunkColor = trunkColor; // Intrinsic: shared
        this.height = height;
        // Intrinsic: shared
        this.width = width;
        // Intrinsic: shared
    }
    render(ctx, x, y, scale, rotation) {
        // Extrinsic: x, y, scale, rotation provided by client
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.scale(scale, scale);
        ctx.fillStyle = this.trunkColor;
        ctx.fillRect(-this.width / 4, 0, this.width / 2, this.height / 3);
        // Draw foliage
        ctx.fillStyle = this.foliageColor;
        ctx.beginPath();
        ctx.moveTo(0,-this.height);
        ctx.lineTo(-this.width, this.height / 3);
        ctx.lineTo(this.width, this.height / 3);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    getInfo() {
        return `${this.species} (${this.type})`;
    }
}