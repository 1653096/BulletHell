// scripts/system/EnemySpawner.ts
import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { GameManager } from '../core/GameManager';
import { GameState } from '../core/GameState';
import { WaveConfig, EnemyType, WaveData } from '../config/WaveConfig';
import { ChasingEnemy } from '../enemy/ChasingEnemy';
import { ShootingEnemy } from '../enemy/ShootingEnemy';
import { EventBus } from '../core/EventBus';
import { ObjectPool } from '../pool/ObjectPool';
import { EnemyConfig } from '../config/EnemyConfig';

const { ccclass, property } = _decorator;

@ccclass('EnemySpawner')
export class EnemySpawner extends Component {
    @property(Prefab) chasingEnemyPrefab!: Prefab;

    @property(Prefab) shootingEnemyPrefab!: Prefab;

    @property(Node) player!: Node;

    @property(Node) enemySocket!: Node;

    enemyPool!: ObjectPool

    private spawnTimer = 0;
    private currentWave: WaveData | null = null;

    onLoad() {
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
                const node = instantiate(this.chasingEnemyPrefab);
                node.setWorldPosition(spawnPos);
                node.setParent(this.enemySocket);

                const enemy = node.getComponent(ChasingEnemy)!;
                enemy.init(this.player, config.health, config.moveSpeed);
                break;
            }

            case EnemyType.Shooting: {
                let config = EnemyConfig.shootingEnemy;
                const node = instantiate(this.shootingEnemyPrefab);
                node.setWorldPosition(spawnPos);
                node.setParent(this.enemySocket);

                const enemy = node.getComponent(ShootingEnemy)!;
                enemy.init(this.player, config.health, config.moveSpeed, config.fireRate);
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
    }
}
