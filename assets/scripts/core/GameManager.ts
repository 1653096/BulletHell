import { _decorator, Component } from 'cc';
import { GameState } from './GameState';
import gameEvent, { EventType } from './GameEvent';
import { Player } from '../entity/Player';

const { ccclass, property } = _decorator;
@ccclass('GameManager')
export class GameManager extends Component {
    @property(Player) player!: Player;

    static instance: GameManager;

    state: GameState = GameState.GameOver;
    elapsedTime = 0;
    readonly MAX_TIME = 60;

    onLoad() {
        GameManager.instance = this;
        gameEvent.on(EventType.REQUEST_START_GAME, this.onStartGame, this);
        gameEvent.on(EventType.PLAYER_DEAD, this.onPlayerDead, this);
    }

    onDestroy(): void {
        gameEvent.off(EventType.REQUEST_START_GAME, this.onStartGame, this);
        gameEvent.off(EventType.PLAYER_DEAD, this.onPlayerDead, this);
    }

    enterHome() {

    }

    onStartGame() {
        this.elapsedTime = 0;
        this.player.reset();
        this.state = GameState.Playing;
        gameEvent.emit(EventType.GAME_START);
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
        gameEvent.emit(EventType.GAME_OVER, playerAlive);
    }

    onPlayerDead() {
        this.endGame(false);
    }

    isPlaying(): boolean {
        return this.state === GameState.Playing;
    }
}
