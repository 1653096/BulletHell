import { _decorator, AudioClip, resources } from 'cc';
import gameEvent, { EventType } from './GameEvent';
const { ccclass } = _decorator;

@ccclass('ResourceHandler')
export class ResourceHandler{

    private static _instance: ResourceHandler = null;

    private sounds: Record<string, AudioClip> = {}

    isLoaded: boolean = false;

    public static get instance(): ResourceHandler {
        if(ResourceHandler._instance) return ResourceHandler._instance;
        ResourceHandler._instance = new ResourceHandler();
        return ResourceHandler._instance;
    }

    constructor() {
        this.loadSound();
    }

    async loadSound() {
        await resources.loadDir('sounds', AudioClip ,(err, sounds) => {
            if(err) {
                console.log("ERROR LOAD SOUND: ", err);
            }
            else {
                sounds.forEach(sound => {
                    this.sounds[sound.name] = sound
                }
                )
            }
            console.log("SOUNDS: ", this.sounds);
            this.isLoaded = true;
            gameEvent.emit(EventType.SOUND_LOADED);
        });
        
    }

    public getSound(name: string) {
        if(this.sounds[name]) return this.sounds[name];
        else {
            console.log(`CAN NOT FIND SOUND ${name}`);
            return null;
        } 
    }
    start() {

    }

    update(deltaTime: number) {
        
    }
}


