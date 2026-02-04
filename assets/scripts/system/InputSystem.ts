import { _decorator, Component, EventTouch, Node, NodeEventType, Vec2, Vec3 } from 'cc';
import { Player } from '../entity/Player';
import { MovementSystem } from './MovementSystem';
const { ccclass, property } = _decorator;

@ccclass('InputSystem')
export class InputSystem extends Component {
    @property(Player) player: Player = null;
    @property(Node) touchRegion: Node = null;

    start() {
        this.touchRegion.on(NodeEventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touchRegion.on(NodeEventType.TOUCH_END, this.onTouchEnd, this);
        this.touchRegion.on(NodeEventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    update(deltaTime: number) {
        
    }

    onTouchMove(event: EventTouch) {
        const v = event.getDelta().clone();
        v.normalize();

        let dir = new Vec3(v.x, v.y, 0)
        this.player.move(dir);
    }

    onTouchEnd() {
        this.player.stand();
    }
}


