type Callback = (...args: any[]) => void;

export class EventBus {
    private static events: Map<string, Callback[]> = new Map();

    static on(event: string, cb: Callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event)!.push(cb);
    }

    static off(event: string, cb: Callback) {
        const list = this.events.get(event);
        if (!list) return;
        const idx = list.indexOf(cb);
        if (idx !== -1) list.splice(idx, 1);
    }

    static emit(event: string, ...args: any[]) {
        const list = this.events.get(event);
        if (!list) return;
        list.forEach(cb => cb(...args));
    }

    static clear() {
        this.events.clear();
    }
}
