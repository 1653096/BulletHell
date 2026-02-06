import { _decorator, AudioSource, Component, Node } from 'cc';
import { ResourceHandler } from './ResourceHandler';
import gameEvent, { EventType } from './GameEvent';
const { ccclass, property } = _decorator;

export enum SoundName {
    BG = 'bg',
    SHOOT = "shoot",
    WIN = 'win',
    LOSE = 'lose'
}

@ccclass('AudioManager')
export class AudioManager extends Component {

    static instance: AudioManager;
    private audioSource: AudioSource;

    playBg: boolean = false;
    audioOn: boolean = true;

    protected onLoad(): void {
        AudioManager.instance = this;
        this.audioSource = this.node.getComponent(AudioSource);
        
        gameEvent.on(EventType.SOUND_LOADED, this.playBgMusic, this);


    }

    playSound (name: string, volumeScale: number = 1 ) {
        if(!this.audioOn) return;
        let clip = ResourceHandler.instance.getSound(name);
        this.audioSource.playOneShot(clip, volumeScale);

    }

    playBgMusic() {
        if(this.playBg) return;
        let resouceInstance = ResourceHandler.instance;
        if(!resouceInstance.isLoaded) return;
        let clip = resouceInstance.getSound(SoundName.BG);
        this.audioSource.clip = clip;
        this.audioSource.loop = true;
        this.audioSource.play();
        this.playBg = true;
    }

    stopBgMusic() {
        this.audioSource.stop();
        this.playBg = false;
    }

    toggleAudio(): boolean {
        this.audioOn = !this.audioOn;
        if(this.audioOn) {
            this.playBgMusic();
        }
        else {
            this.stopBgMusic();
        }
        return this.audioOn;
    }

    update(deltaTime: number) {
        
    }
}


