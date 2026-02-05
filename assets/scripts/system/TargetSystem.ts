import { _decorator, Component, Node, Vec3 } from 'cc';
import { EnemySpawner } from './EnemySpawner';
import { EnemyBase } from '../entity/EnemyBase';
const { ccclass, property } = _decorator;

@ccclass('TargetSystem')
export class TargetSystem extends Component {

    @property(EnemySpawner) enemySpawner!: EnemySpawner;


    findTarget(fromPos: Vec3, range: number): EnemyBase | null {
        let closest: EnemyBase | null = null;
        let minDist = range * range;

        for(const enemy of this.enemySpawner.getActiveEnemies()) {
            const dist = Vec3.squaredDistance(enemy.node.worldPosition, fromPos);

            if(dist <= minDist) {
                minDist = dist;
                closest = enemy;
            }
        }


        return closest;
    }
    
}


