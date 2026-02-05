import { _decorator, Button, Color, Component, Label, Node } from 'cc';
import { GameManager } from '../core/GameManager';
import gameEvent, { EventType } from '../core/GameEvent';

const { ccclass, property } = _decorator;

@ccclass('UIHandler')
export class UIHandler extends Component {

    @property(Node) homeScreen!: Node;
    @property(Node) ingameUI!: Node;
    @property(Node) endGameUI!: Node;

    @property(Button) playBtn!: Button;
    @property(Label) playTime!: Label;

    @property(Label) resLb!: Label;
    @property(Button) replayBtn!: Button;

    start() {
        this.playBtn.node.on('click', this.onStartBtnClick, this);
        this.replayBtn.node.on('click', this.onReplayBtnClick, this);

        gameEvent.on(EventType.GAME_OVER, this.onEndGame, this);
    }

    onDestroy(): void {
        gameEvent.off(EventType.GAME_OVER, this.onEndGame, this);
    }

    update(deltaTime: number) {
        if (GameManager.instance.isPlaying()) {
            this.playTime.string = GameManager.instance.elapsedTime.toFixed(2);
        }
    }

    onStartBtnClick() {
        gameEvent.emit(EventType.REQUEST_START_GAME);
        this.homeScreen.active = false;
        this.ingameUI.active = true;
        this.endGameUI.active = false;
    }

    onReplayBtnClick() {
        gameEvent.emit(EventType.REQUEST_START_GAME);
        this.endGameUI.active = false;
        this.ingameUI.active = true;
    }

    onEndGame(playerAlive: boolean) {
        console.log("END GAME, player: ", playerAlive);
        this.ingameUI.active = false;
        this.endGameUI.active = true;

        this.updateEndGameUI(playerAlive);
    }

    updateEndGameUI(isWin: boolean) {
        this.resLb.string = isWin == true ? "You win" : "You lose";
        this.resLb.color = isWin == true ? new Color('00FF85') : new Color('FF0052');
    }


}


