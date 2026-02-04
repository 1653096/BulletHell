import { _decorator, Component, Node, Vec3 } from 'cc';
import { PlayerConfig } from '../config/PlayerConfig';
import { Entity } from './Entity';
const { ccclass, property } = _decorator;

export enum PlayerState {
    STAND,
    MOVE
}

@ccclass('Player')
export class Player extends Entity {
    moveDir: Vec3;
    state: PlayerState = PlayerState.STAND;
    start() {

    }

    update(dt: number) {
        if(this.state == PlayerState.MOVE) {
            if(this.moveDir.lengthSqr() == 0) return;
            let delta = this.moveDir.clone().normalize().multiplyScalar(PlayerConfig.speed * dt);
            this.node.translate(delta);
        }
    }

    move(dir: Vec3) {
        this.moveDir = dir.clone();
        this.state = PlayerState.MOVE;
    }

    stand() {
        this.state = PlayerState.STAND;
        this.moveDir = Vec3.ZERO;
    }

    onDie(): void {
        
    }
}


