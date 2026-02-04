import { _decorator, Collider2D, IPhysics2DContact } from 'cc';
import { EnemyBase } from './EnemyBase';
import { BulletSpawner } from '../combat/BulletSpawner';
import { EnemyConfig } from '../config/EnemyConfig';
import { Player } from '../entity/Player';
import { PlayerConfig } from '../config/PlayerConfig';
import { BulletConfig } from '../config/BulletConfig';

const { ccclass } = _decorator;

@ccclass('ShootingEnemy')
export class ShootingEnemy extends EnemyBase {
    private fireRate = 1.5;
    private fireTimer = 0;

    config: {
        hitDamage: number,
        bulletDamage: number,
        health: number
    };

    init(player: any, health: number, speed: number, fireRate: number) {
        super.init(player, health, speed, fireRate);
        this.fireRate = fireRate;
        this.fireTimer = 0;

        this.config = EnemyConfig.shootingEnemy;
    }

    protected updateAI(dt: number) {
        this.fireTimer += dt;
        if (this.fireTimer >= this.fireRate) {
            this.fireTimer = 0;
            BulletSpawner.instance.spawnEnemyBullet(
                this.node.worldPosition,
                this.player!.worldPosition,
                BulletConfig.speed,
                this.config.bulletDamage

            );
        }
    }

    protected onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        if (otherCollider.group == 2) {
            this.player.getComponent(Player).takeDamage(EnemyConfig.shootingEnemy.hitDamage);
            this.takeDamage(PlayerConfig.hitDamage)
        }
    }
}
