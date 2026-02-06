import { _decorator, Button, Color, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { GameManager } from '../core/GameManager';
import gameEvent, { EventType } from '../core/GameEvent';
import { AudioManager, SoundName } from '../core/AudioManager';

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

    @property(Button) soundBtnHome!: Button;
    @property(Button) soundBtnEnd!: Button;

    @property(SpriteFrame) onSoundSpriteFrame!: SpriteFrame;
    @property(SpriteFrame) offSoundSpriteFrame!: SpriteFrame;

    @property(Label) winTime!: Label;
    @property(Label) loseTime!: Label;

    start() {
        this.playBtn.node.on('click', this.onStartBtnClick, this);
        this.replayBtn.node.on('click', this.onReplayBtnClick, this);

        this.soundBtnHome.node.on('click', this.onSoundSwitch, this);
        this.soundBtnEnd.node.on('click', this.onSoundSwitch, this);

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

    onEndGame(agrs: any[]) {
        this.ingameUI.active = false;
        this.endGameUI.active = true;

        let isWin = agrs[0];
        this.updateEndGameUI(isWin);
        this.playSoundEff(isWin)
    }

    updateEndGameUI(isWin: boolean) {
        this.resLb.string = isWin ? "You win" : "You lose";


        this.resLb.color = isWin ? new Color('00FF85') : new Color('FF0052');

        this.updateWinLose(isWin);
    }

    playSoundEff(isWin: boolean) {
        let sound = isWin ? SoundName.WIN : SoundName.LOSE;
        AudioManager.instance.playSound(sound);
    }

    updateWinLose(isWin: boolean) {
        localStorage.setItem('test', JSON.stringify({a: 1}))
        let resCache = localStorage.getItem("BulletHell_winLose");

        console.log("RES CAHCE: ", resCache);

        if(!resCache) {
            resCache = `{
                "win": 0,
                "lose": 0
            }`;
        }

        let res = JSON.parse(resCache);

        if(isWin) {
            res.win += 1;
        }
        else {
            res.lose += 1;
        }

        localStorage.setItem("BulletHell_winLose", JSON.stringify(res));

        this.winTime.string = `Win: ${res.win} ^.^`
        this.loseTime.string = `Lose: ${res.lose} :]]`;



    }


    onSoundSwitch() {
        let status = AudioManager.instance.toggleAudio();

        let targetSprite = status ? this.onSoundSpriteFrame : this.offSoundSpriteFrame;

        this.soundBtnHome.node.getComponent(Sprite).spriteFrame = targetSprite;
        this.soundBtnEnd.node.getComponent(Sprite).spriteFrame = targetSprite;
    }


}


