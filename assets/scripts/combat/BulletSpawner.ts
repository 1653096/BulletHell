import { _decorator, Component, Node, Prefab, Vec3 } from 'cc';
import { ObjectPool } from '../pool/ObjectPool';
import { Bullet } from './Bullet';
import gameEvent, { EventType } from '../core/GameEvent';

const { ccclass, property } = _decorator;

@ccclass('BulletSpawner')
export class BulletSpawner extends Component {
    static instance: BulletSpawner;

    @property(Prefab) playerBulletPrefab!: Prefab;

    @property(Prefab) enemyBulletPrefab!: Prefab;

    @property(Node) bulletSocket!: Node

    private playerPool!: ObjectPool;
    private enemyPool!: ObjectPool;

    private activeBullet: Set<Bullet> = new Set();

    onLoad() {
        BulletSpawner.instance = this;

        this.playerPool = new ObjectPool(
            this.playerBulletPrefab,
            this.bulletSocket,
            10
        );

        this.enemyPool = new ObjectPool(
            this.enemyBulletPrefab,
            this.bulletSocket,
            20
        );

        gameEvent.on(EventType.GAME_OVER, this.onGameOver, this);
    }

    spawnPlayerBullet(pos: Vec3, dir: Vec3, speed: number, damage: number) {
        const node = this.playerPool.spawn();
        node.setWorldPosition(pos);

        const bullet = node.getComponent(Bullet)!;
        bullet.fire(dir, speed, damage);

        this.activeBullet.add(bullet);
    }

    spawnEnemyBullet(pos: Vec3, targetPos: Vec3, speed: number, damage: number) {
        const node = this.enemyPool.spawn();
        node.setWorldPosition(pos);

        const dir = targetPos.clone().subtract(pos).normalize();
        const bullet = node.getComponent(Bullet)!;
        bullet.fire(dir, speed, damage);

        this.activeBullet.add(bullet);
    }

    despawn(bullet: Node) {
        const node = bullet;
        if (node === null) return;

        if (node.name.includes('Player')) {
            this.playerPool.despawn(node);
        } else {
            this.enemyPool.despawn(node);
        }

        this.activeBullet.delete(node.getComponent(Bullet));
    }

    private onGameOver() {

        this.activeBullet.forEach(bullet => {
            bullet.despawn();
        });

        this.activeBullet.clear();
    }
}
