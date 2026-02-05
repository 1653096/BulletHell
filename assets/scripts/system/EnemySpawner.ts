import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { GameManager } from '../core/GameManager';
import { GameState } from '../core/GameState';
import { WaveConfig, EnemyType, WaveData } from '../config/WaveConfig';
import { EnemyConfig } from '../config/EnemyConfig';
import { EventBus } from '../core/EventBus';
import { ChasingEnemy } from '../entity/ChasingEnemy';
import { EnemyBase } from '../entity/EnemyBase';
import { ShootingEnemy } from '../entity/ShootingEnemy';
import { ObjectPool } from '../pool/ObjectPool';


const { ccclass, property } = _decorator;

@ccclass('EnemySpawner')
export class EnemySpawner extends Component {
    @property(Prefab) chasingEnemyPrefab!: Prefab;
    @property(Prefab) shootingEnemyPrefab!: Prefab;

    @property(Node) player!: Node;

    @property(Node) enemySocket!: Node;

    static instance: EnemySpawner;

    private chasingEnemyPool!: ObjectPool;
    private shootingEnemyPool!: ObjectPool;

    private activeEnemies: Set<EnemyBase> = new Set();

    private spawnTimer = 0;
    private currentWave: WaveData | null = null;

    onLoad() {
        EnemySpawner.instance = this;
        this.chasingEnemyPool = new ObjectPool(this.chasingEnemyPrefab, this.enemySocket, 10);
        this.shootingEnemyPool = new ObjectPool(this.shootingEnemyPrefab, this.enemySocket, 10);
        EventBus.on('GAME_OVER', this.onGameOver.bind(this));
    }

    update(dt: number) {
        if (GameManager.instance.state !== GameState.Playing) return;

        const time = GameManager.instance.elapsedTime;
        this.updateWave(time);

        if (!this.currentWave) return;

        this.spawnTimer += dt;
        if (this.spawnTimer >= this.currentWave.spawnInterval) {
            this.spawnTimer = 0;
            this.spawnEnemy();
        }
    }

    private updateWave(time: number) {
        for (const wave of WaveConfig) {
            if (
                time >= wave.startTime &&
                time < wave.startTime + wave.duration
            ) {
                this.currentWave = wave;
                return;
            }
        }
        this.currentWave = null;
    }

    private spawnEnemy() {
        if (!this.currentWave) return;

        const type =
            this.currentWave.enemies[
            Math.floor(Math.random() * this.currentWave.enemies.length)
            ];

        const spawnPos = this.getRandomSpawnPosition();

        switch (type) {
            case EnemyType.Chasing: {
                let config = EnemyConfig.chasingEnemy;
                const node = this.chasingEnemyPool.spawn();
                node.setWorldPosition(spawnPos);
                node.setParent(this.enemySocket);

                const enemy = node.getComponent(ChasingEnemy)!;
                enemy.init(this.player, config.health, config.moveSpeed);

                this.activeEnemies.add(enemy);
                break;
            }

            case EnemyType.Shooting: {
                let config = EnemyConfig.shootingEnemy;
                const node = this.shootingEnemyPool.spawn();
                node.setWorldPosition(spawnPos);
                node.setParent(this.enemySocket);

                const enemy = node.getComponent(ShootingEnemy)!;
                enemy.init(this.player, config.health, config.moveSpeed, config.fireRate);

                this.activeEnemies.add(enemy);
                break;
            }
        }
    }

    private getRandomSpawnPosition(): Vec3 {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 1200;
        return new Vec3(x, y, 0);
    }

    private onGameOver() {
        this.spawnTimer = 0;
        this.currentWave = null;

        this.activeEnemies.forEach(enemy => {
            enemy.onDie();
            this.activeEnemies.delete(enemy);
        });

        this.activeEnemies.clear();
    }

    despawn(node: Node) {
        if (node == null) return;

        if (node.name.includes('Chasing')) {
            this.chasingEnemyPool.despawn(node);
        } else {
            this.shootingEnemyPool.despawn(node);
        }

        // todo: remove from activeSet
    }

    public getActiveEnemies(): Set<EnemyBase> {
        return this.activeEnemies;
    }
}
