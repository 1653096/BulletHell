import { _decorator, Collider2D, Contact2DType, IPhysics2DContact, Node, RigidBody2D, Vec2, Vec3 } from 'cc';
import { Entity } from '../entity/Entity';
import { GameManager } from '../core/GameManager';
import { GameState } from '../core/GameState';
import { EventBus } from '../core/EventBus';

const { ccclass } = _decorator;

@ccclass('EnemyBase')
export abstract class EnemyBase extends Entity {
    protected player: Node | null = null;
    protected speed = 0;
    protected isActive = true;

    rb: RigidBody2D;

    onLoad() {
        this.rb = this.node.getComponent(RigidBody2D);
        EventBus.on('GAME_OVER', this.onGameOver.bind(this));

        const collider = this.getComponent(Collider2D);
        if (!collider) return;

        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    onDestroy() {
        EventBus.off('GAME_OVER', this.onGameOver.bind(this));
    }

    init(player: Node, health: number, speed: number, fireRate?: number) {
        this.player = player;
        this.initHealth(health);
        this.speed = speed;
        this.isActive = true;
    }

    update(dt: number) {
        if (!this.isActive) return;
        if (GameManager.instance.state !== GameState.Playing) return;
        if (!this.player) return;

        this.updateAI(dt);
    }

    protected moveTowardPlayer(dt: number) {
        let length = new Vec3();

        Vec3.subtract(length, this.player!.worldPosition, this.node.worldPosition);

        let dir = new Vec2(length.x, length.y);


        this.rb.linearVelocity = dir.clone()
            .normalize()
            .multiplyScalar(this.speed);
    }

    protected onGameOver() {
        this.isActive = false;
    }

    onDie() {
        this.isActive = false;
    }

    protected abstract updateAI(dt: number): void;
    protected abstract onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void;
}
