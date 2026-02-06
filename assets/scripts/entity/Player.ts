import { _decorator, Component, Node, PhysicsSystem2D, RigidBody2D, Vec2, Vec3 } from 'cc';
import { PlayerConfig } from '../config/PlayerConfig';
import { Entity } from './Entity';
import gameEvent, { EventType } from '../core/GameEvent';
const { ccclass, property } = _decorator;

export enum PlayerState {
    STAND,
    MOVE
}

@ccclass('Player')
export class Player extends Entity {
    moveDir: Vec2;
    state: PlayerState = PlayerState.STAND;
    rb: RigidBody2D;

    protected onLoad(): void {
        PhysicsSystem2D.instance.enable = true;
        this.rb = this.node.getComponent(RigidBody2D);
    }
    start() {
        this.init(); // tmp
    }

    lateUpdate(dt: number) {
        if(this.state == PlayerState.MOVE) {
            if(this.moveDir.lengthSqr() == 0) return;

            this.rb.linearVelocity = this.moveDir.clone()
            .normalize()
            .multiplyScalar(PlayerConfig.speed);
        }
    }

    move(dir: Vec2) {
        this.moveDir = dir.clone();
        this.state = PlayerState.MOVE;
    }

    stand() {
        this.state = PlayerState.STAND;
        this.moveDir = Vec2.ZERO;
        this.rb.linearVelocity = Vec2.ZERO.clone();
    }

    init(){
        this.initHealth(PlayerConfig.health);
    }

    onDie(): void {
        gameEvent.emit(EventType.PLAYER_DEAD);
    }

    reset() {
        this.init();
        this.node.setPosition(Vec3.ZERO);
    }
}


