# Bullet Hell – Cocos Creator 3.7.4 - Nguyen Van Trong

## 📌 Overview

This project is a **2D Bullet Hell Survival demo** developed using **Cocos Creator 3.7.4**, following the given technical and gameplay requirements.  
The goal of this project is to demonstrate **clean architecture, scalability, and maintainable code structure**, rather than visual complexity.

The player must survive against continuously spawning enemies for **1 minute**, avoiding and eliminating threats in a closed arena.

## 🎮 Core Gameplay

- **Top-down 2D bullet hell**
- Large enclosed rectangular arena with solid walls
- Enemies spawn continuously and attack the player
- Game ends when:
  - Player is defeated, **or**
  - Player survives for **60 seconds**
- Game Over screen appears with a **Restart** button

## 🧩 Features Implementation

### Player
- Represented by a **blue circle**
- Free movement within arena boundaries
- **Auto-shoots** when enemies are within range
- Fixed health value: 100

### Enemies
There are **2 enemy types**, both using fixed health values:

#### 1. Chasing Enemy
- Represented by a **triangle (yellow)**
- Continuously moves toward the player
- Deals damage upon contact

#### 2. Shooting Enemy
- Stationary after spawning
- Periodically fires a bullet toward the player
- Bullets travel in a straight, predefined trajectory

### Bullets
- Player bullets: **green circles**
- Enemy bullets: **red circles**
- Implemented using **trigger-based collision detection** to avoid unintended physics knockback
- All bullets are managed via **object pooling**

## 🗺 Map & Environment

- Large rectangular arena
- Four solid walls act as boundaries
- Player and enemies are constrained within the world area

### Audio:
- Background audio
- Shoot sound
- Win sound
- Lose sound

### Cache Result
Cache the result win, lose to local storage.

### 

## 🧠 Architecture & Design

The project follows a **component-based and system-driven architecture**.

### Design Principles
- Separation of concerns
- Composition over inheritance
- Event-driven game flow
- Reusable and extensible systems

### High-level Structure

assets/scripts
├── core        # Game flow, state management, resoure handler, game event, audio manager
├── entity      # Player, Enemy, and shared entity logic
├── system      # Spawners, targeting, input handling
├── combat      # Bullet & damage-related logic
├── pool        # Object pooling system
├── ui          # UI handler
├── config      # Tunable gameplay parameters


## 🔁 Game Flow Management

Game flow is managed by a centralized **GameManager** using a `GameState` enum:
Playing ↔ GameOver

### Responsibilities
- Enables / disables gameplay systems
- Resets world state on replay
- Notifies UI through events

UI components **react to state changes** instead of controlling game flow directly.

---

## 📡 Event System

- Uses Cocos Creator’s built-in **EventTarget**
- Decouples:
  - Player death
  - Game over conditions
  - UI updates
- Prevents tight coupling between entities and global game logic

## ⚙ Configuration

Gameplay parameters are separated into config files, located in `scripts/config`, including:

- Player: 
    health: 100,
    speed : 20,
    hitDamage: 0,
    fireRate: 0.5,
    shootRange: 300,
    bulletDamage: 20
- Enemy: 
    chasingEnemy: {
        moveSpeed: 10,
        hitDamage: 20,
        health: 40
    },
    shootingEnemy: {
        moveSpeed: 0,
        hitDamage: 0,
        health: 20,
        bulletDamage: 10,
        fireRate: 1.5
    }
- Bullet: 
    speed : 60
- Wave: 
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

This allows easy tuning without modifying gameplay logic.

## 🚀 Performance Considerations

- Object Pooling used for:
  - Enemies
  - Player bullets
  - Enemy bullets
- No runtime instantiation during active gameplay
- Collision layers configured to minimize unnecessary physics checks

On **Game Over**:
- All enemies and bullets are despawned
- All gameplay systems are halted

## 🧪 Extensibility

The architecture supports easy extension for:
- Additional enemy types
- Boss enemies
- Difficulty scaling

## ▶ Build & Run

- Engine: **Cocos Creator 3.7.4**
- Platform: Android.
- Orientation: Portrait
- APP ABI: 
    - v7a
    - v8a
    - x86_64

Steps:
1. Clone the repository
2. Open it with **Cocos Creator**
3. Run the main scene to start the game

## 📝 Notes

Repo: https://github.com/1653096/BulletHell 
