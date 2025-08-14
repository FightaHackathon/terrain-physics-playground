# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/8ee807d2-4853-4379-8300-e55618d20f27

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/8ee807d2-4853-4379-8300-e55618d20f27) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

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

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/8ee807d2-4853-4379-8300-e55618d20f27) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
