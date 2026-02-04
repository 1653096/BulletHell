import { Component } from 'cc';

export abstract class Entity extends Component {
    protected maxHealth = 1;
    protected health = 1;

    initHealth(value: number) {
        this.maxHealth = value;
        this.health = value;
    }

    takeDamage(amount: number) {
        this.health -= amount;
        if (this.health <= 0) {
            this.onDie();
        }
    }

    abstract onDie(): void;
}
