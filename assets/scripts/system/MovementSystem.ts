import { _decorator, Component, Node, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MovementSystem')
export class MovementSystem extends Component {
    isHolding: boolean = false;
    direction: Vec2 = new Vec2();
    startPos: Vec2 = new Vec2();

    onTouchStart(startPos: Vec2) {
        this.isHolding = true;
    }

    onEndTouch() {
        this.isHolding = false;
    }

    update(dt: number) {

    }
}


