import { Component, Label, _decorator } from 'cc';
const { ccclass, property } = _decorator;

export abstract class Entity extends Component {

    @property(Label) healthLb: Label = null;

    protected maxHealth = 1;
    protected health = 1;

    initHealth(value: number) {
        this.maxHealth = value;
        this.health = value;

        this.updateHealthLb(this.health);
    }

    takeDamage(amount: number) {
        this.health -= amount;
        this.updateHealthLb(this.health);
        if (this.health <= 0) {
            this.onDie();
        }
    }

    updateHealthLb(amount: number) {
        this.healthLb.string = amount >= 0 ? amount.toString() : "0"
    }

    abstract onDie(): void;
}
