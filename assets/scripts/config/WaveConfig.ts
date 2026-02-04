export enum EnemyType {
    Chasing,
    Shooting,
}

export interface WaveData {
    startTime: number;
    duration: number;
    spawnInterval: number;
    enemies: EnemyType[];
}

export const WaveConfig: WaveData[] = [
    {
        startTime: 0,
        duration: 20,
        spawnInterval: 2,
        enemies: [EnemyType.Chasing, EnemyType.Shooting],
    },
    {
        startTime: 20,
        duration: 20,
        spawnInterval: 1.5,
        enemies: [EnemyType.Chasing, EnemyType.Shooting],
    },
    {
        startTime: 40,
        duration: 20,
        spawnInterval: 1,
        enemies: [EnemyType.Shooting],
    },
];
