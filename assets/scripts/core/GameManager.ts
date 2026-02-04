import { _decorator, Component } from 'cc';
import { GameState } from './GameState';
import { EventBus } from './EventBus';

const { ccclass } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    static instance: GameManager;

    state: GameState = GameState.Playing;
    elapsedTime = 0;
    readonly MAX_TIME = 60;

    onLoad() {
        GameManager.instance = this;
    }

    startGame() {
        this.state = GameState.Playing;
        this.elapsedTime = 0;
        EventBus.emit('GAME_START');
    }

    update(dt: number) {
        if (this.state !== GameState.Playing) return;

        this.elapsedTime += dt;

        if (this.elapsedTime >= this.MAX_TIME) {
            this.endGame(true);
        }
    }

    endGame(playerAlive: boolean) {
        if (this.state === GameState.GameOver) return;

        this.state = GameState.GameOver;
        EventBus.emit('GAME_OVER', playerAlive);
    }

    isPlaying(): boolean {
        return this.state === GameState.Playing;
    }
}
