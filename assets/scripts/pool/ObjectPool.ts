import { Node, Prefab, instantiate } from 'cc';

export class ObjectPool {
    private prefab: Prefab;
    private pool: Node[] = [];
    private parent: Node;

    constructor(prefab: Prefab, parent: Node, initSize = 10) {
        this.prefab = prefab;
        this.parent = parent;

        for (let i = 0; i < initSize; i++) {
            const node = instantiate(this.prefab);
            node.active = false;
            node.setParent(this.parent);
            this.pool.push(node);
        }
    }

    spawn() {
        let node = this.pool.pop();
        if (!node) {
            node = instantiate(this.prefab);
            node.setParent(this.parent);
        }
        node.active = true;
        return node;
    }

    despawn(node: Node) {
        node.active = false;
        this.pool.push(node);
    }

    clear() {
        this.pool.length = 0;
    }
}
