import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, RigidBody2D, Vec2, Vec3 } from 'cc';
import { GameManager } from '../core/GameManager';
import { GameState } from '../core/GameState';
import { BulletSpawner } from './BulletSpawner';
import { BulletConfig } from '../config/BulletConfig';
import { Player } from '../entity/Player';

const { ccclass } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    speed = 0;
    damage = 0;
    direction: Vec3 = new Vec3();
    isActive = false;

    rb: RigidBody2D;

    protected onLoad(): void {
        this.rb = this.node.getComponent(RigidBody2D);
    }

    protected onEnable(): void {
        const collider = this.node.getComponent(Collider2D);
        if(!collider) return;

        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
    }

    fire(dir: Vec3, speed: number, damage: number) {
        this.direction.set(dir).normalize();
        this.speed = speed;
        this.damage = damage;
        this.isActive = true;
    }

    update(dt: number) {
        if (!this.isActive) return;
        if (GameManager.instance.state !== GameState.Playing) return;

        let dir = new Vec2(this.direction.x, this.direction.y)

        this.rb.linearVelocity = dir.clone()
                    .normalize()
                    .multiplyScalar(BulletConfig.speed);

        // TODO: check out of bounds → despawn
    }

    despawn() {
        this.isActive = false;
        BulletSpawner.instance.despawn(this.node);
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.group == 8 || otherCollider.group == 2 /* WALL */) {
            if(otherCollider.group == 2) {
                otherCollider.getComponent(Player).takeDamage(this.damage);
            }
            this.despawn();
        }
    }
}
