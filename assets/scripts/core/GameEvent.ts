import { __private, EventTarget } from "cc";

export enum EventType {
    GAME_START = "GAME_START",
    GAME_OVER = "GAME_OVER",
    REQUEST_START_GAME = "REQUEST_START_GAME",
    PLAYER_DEAD = "PLAYER_DEAD"
}
export class GameEvent extends EventTarget {
    emit(type: EventType, ...agrs: any): void {
        super.emit(type, agrs);
    }

    on<TFunction extends (...any: any[]) => void>(type: EventType, callback: TFunction, thisArg?: any, once?: boolean): typeof callback {
        return super.on(type, callback, thisArg, once);
    }

    off<TFunction extends (...any: any[]) => void>(type: EventType, callback?: TFunction, thisArg?: any): void {
        super.off(type, callback, thisArg );
    }
}

let gameEvent = new GameEvent();
export default gameEvent;
