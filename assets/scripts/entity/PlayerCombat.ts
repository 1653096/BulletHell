import { _decorator, Component, Node } from 'cc';
import { TargetSystem } from '../system/TargetSystem';
import { GameManager } from '../core/GameManager';
import { PlayerConfig } from '../config/PlayerConfig';
import { EnemyBase } from './EnemyBase';
import { BulletSpawner } from '../combat/BulletSpawner';
import { BulletConfig } from '../config/BulletConfig';
import { AudioManager, SoundName } from '../core/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerCombat')
export class PlayerCombat extends Component {
    @property(TargetSystem) targetSystem!: TargetSystem;

    private timer = 0;

    protected update(dt: number): void {
        if(!GameManager.instance.isPlaying) return;

        this.timer += dt;

        if(this.timer < PlayerConfig.fireRate) return;

        let target = this.targetSystem.findTarget(this.node.worldPosition, PlayerConfig.shootRange);

        if(!target) return;
        this.timer = 0;
        this.shoot(target);

    }

    private shoot(target: EnemyBase) {
        let dir = target.node.worldPosition.subtract(this.node.worldPosition).normalize();

        BulletSpawner.instance.spawnPlayerBullet(
            this.node.worldPosition, 
            dir, 
            BulletConfig.speed, 
            PlayerConfig.bulletDamage);

        AudioManager.instance.playSound(SoundName.SHOOT, 1.5);
    }
}


