
## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Three.js for 3D graphics
- React Three Fiber for React integration with Three.js

## Physics Implementation

The 3D ball simulation uses pure TypeScript/JavaScript physics with gravity implemented as a constant acceleration of -9.81 m/s² on the Y-axis. The physics state is maintained using React refs to ensure persistence across renders:

- `velocityRef` - stores the ball's velocity vector
- `meshRef` - references the 3D mesh position
- Gravity is applied each frame: `velocity.y += gravity * deltaTime`
- Position is updated: `position += velocity * deltaTime`

The ball moves freely without boundary restrictions and only resets when explicitly triggered by the reset button.

## Running Tests

To run the physics unit tests:

```sh
npm test
```

The tests verify:
- Ball position decreases over time due to gravity
- Horizontal position never resets unexpectedly
- Gravity affects only vertical velocity
- Horizontal movement is preserved during gravity application

