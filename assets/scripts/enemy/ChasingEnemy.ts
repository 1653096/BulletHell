import { _decorator, Collider2D, IPhysics2DContact } from 'cc';
import { EnemyBase } from './EnemyBase';
import { Player } from '../entity/Player';
import { EnemyConfig } from '../config/EnemyConfig';
import { PlayerConfig } from '../config/PlayerConfig';

const { ccclass } = _decorator;

@ccclass('ChasingEnemy')
export class ChasingEnemy extends EnemyBase {
    protected updateAI(dt: number) {
        this.moveTowardPlayer(dt);
    }

    protected onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        if(otherCollider.group == 2) {
            this.player.getComponent(Player).takeDamage(EnemyConfig.chasingEnemy.hitDamage);
            this.takeDamage(PlayerConfig.hitDamage)
        }
    }
}
