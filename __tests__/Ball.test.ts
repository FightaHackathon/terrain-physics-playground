import * as THREE from 'three';

// Mock the Ball physics logic
class BallPhysics {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  gravity: number = -9.81;

  constructor(initialPosition: [number, number, number] = [0, 2, 0]) {
    this.position = new THREE.Vector3(...initialPosition);
    this.velocity = new THREE.Vector3(0, 0, 0);
  }

  update(deltaTime: number) {
    // Apply gravity to velocity
    this.velocity.y += this.gravity * deltaTime;
    
    // Update position based on velocity
    this.position.addScaledVector(this.velocity, deltaTime);
  }

  setVelocity(x: number, y: number, z: number) {
    this.velocity.set(x, y, z);
  }
}

describe('Ball Physics', () => {
  let ball: BallPhysics;
  const deltaTime = 1/60; // 60 FPS

  beforeEach(() => {
    ball = new BallPhysics([1, 5, 2]);
  });

  test('ball position decreases vertically due to gravity over multiple frames', () => {
    const initialY = ball.position.y;
    
    // Simulate 10 frames
    for (let i = 0; i < 10; i++) {
      ball.update(deltaTime);
    }
    
    expect(ball.position.y).toBeLessThan(initialY);
    expect(ball.velocity.y).toBeLessThan(0); // Should be falling
  });

  test('horizontal position never resets to zero when moving horizontally', () => {
    ball.setVelocity(2, 0, 1); // Move horizontally
    const initialX = ball.position.x;
    const initialZ = ball.position.z;
    
    // Simulate 20 frames
    for (let i = 0; i < 20; i++) {
      ball.update(deltaTime);
      
      // Position should never snap back to zero
      expect(ball.position.x).not.toBe(0);
      expect(ball.position.z).not.toBe(0);
      
      // Should be moving away from initial position
      if (i > 0) {
        expect(Math.abs(ball.position.x)).toBeGreaterThanOrEqual(Math.abs(initialX));
        expect(Math.abs(ball.position.z)).toBeGreaterThanOrEqual(Math.abs(initialZ));
      }
    }
  });

  test('gravity affects velocity correctly', () => {
    const initialVelocityY = ball.velocity.y;
    
    ball.update(deltaTime);
    
    const expectedVelocityY = initialVelocityY + (ball.gravity * deltaTime);
    expect(ball.velocity.y).toBeCloseTo(expectedVelocityY, 5);
  });

  test('horizontal movement is preserved during gravity application', () => {
    ball.setVelocity(3, 2, -1);
    const initialVelocityX = ball.velocity.x;
    const initialVelocityZ = ball.velocity.z;
    
    // Simulate several frames
    for (let i = 0; i < 5; i++) {
      ball.update(deltaTime);
    }
    
    // Horizontal velocities should remain unchanged by gravity
    expect(ball.velocity.x).toBe(initialVelocityX);
    expect(ball.velocity.z).toBe(initialVelocityZ);
    
    // Vertical velocity should have changed due to gravity
    expect(ball.velocity.y).toBeLessThan(2);
  });
});
