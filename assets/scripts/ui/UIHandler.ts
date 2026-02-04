import { _decorator, Button, Component, Label, Node } from 'cc';
import { GameManager } from '../core/GameManager';
import { GameState } from '../core/GameState';

const { ccclass, property } = _decorator;

@ccclass('UIHandler')
export class UIHandler extends Component {
    @property(Button) playBtn!: Button;
    @property(Label) playTime!: Label;

    start() {
        this.playBtn.node.on('click', this.onStartClick, this);
    }

    update(deltaTime: number) {
        if(GameManager.instance.state == GameState.Playing) {
            this.playTime.string = GameManager.instance.elapsedTime.toFixed(2);
        }
    }

    onStartClick() {
        GameManager.instance.startGame();
    }
}


