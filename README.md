# 3D Arm Rotation - Next.js & Three.js

## Overview
This project is a **Next.js** web page that uses **Three.js** and **@react-three/fiber** to render a simple 3D **arm model** with rotation handles at the **shoulder** and **elbow** joints. Users can **click and drag** the handles to adjust the arm's pose, with real-time transformations.

## Features
✅ Interactive 3D arm with shoulder and elbow joints  
✅ Drag-to-rotate functionality for adjusting pose  
✅ Smooth real-time transformations  
✅ Clean, minimal UI with Tailwind CSS  

## Tech Stack
- **Next.js** - Frontend framework  
- **Three.js** - 3D rendering and interaction  
- **Tailwind CSS** - Styling  


## Installation & Setup
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/arm-rotation.git
cd arm-rotation
```
### 2️⃣ Install Dependencies
```sh
npm install
```
### 3️⃣ Run the Development Server
```sh
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.


## Live Demo
🌐 Check out the live demo: [3D Arm Rotation](https://internship-project-steel.vercel.app/)

## Deployment
This project is deployed on [Vercel](https://vercel.com), a platform optimized for Next.js applications.

### To deploy your own instance:
1. Fork this repository
2. Create a Vercel account
3. Import your forked repository
4. Vercel will automatically detect Next.js and deploy your application

The deployment process is automated through Vercel's GitHub integration, with automatic deployments on every push to the main branch.


## Project Structure
```
internship-project/
│── src/
│   ├── components/
│   │   ├── ArmScene.js        # Main 3D scene component
│   │   │   ├── Arm/
│   │   │   │   ├── UpperArm.js    # Upper arm component
│   │   │   │   └── LowerArm.js    # Lower arm component
│   │   │   └── Controls/
│   │   │       └── RotationHandle.js # Handle for rotation control
│   │   ├── pages/
│   │   │   ├── index.js           # Main page
│   │   │   ├── _app.js            # Next.js app wrapper
│   │   │   ├── _document.js       # Custom document setup
│   │   │   └── api/               # API routes
│   │   └── styles/
│   │   └── globals.css        # Tailwind CSS setup
│   └── public/                    # Static assets
│   └── package.json              # Project dependencies
│   └── tailwind.config.mjs       # Tailwind configuration
│   └── next.config.mjs           # Next.js configuration
│   └── postcss.config.mjs        # PostCSS configuration
│   └── jsconfig.json             # JavaScript configuration
└── README.md                # Project documentation
```

## How It Works
### 🦾 3D Arm Model
- **Upper Arm:** Gray cylinder (extends from the shoulder).
- **Lower Arm:** Light gray cylinder (attached to the upper arm).
- **Handles:** Blue spheres at **shoulder** and **elbow**.

### 🖱️ Interaction Logic
1. **Click & Drag a handle** (shoulder or elbow).
2. **Mouse movement** updates rotation in real time.
3. **Shoulder Handle** rotates the upper arm around the **Y-axis**.
4. **Elbow Handle** rotates the lower arm around its **local Y-axis**.

## Submission Instructions
1. **Push code to a private GitHub repository**.
2. **Invite yash.aocorp@gmail.com** as a collaborator.
3. **Ensure README.md** is included.

## Future Improvements
🚀 Add inverse kinematics for more natural movement  
🎨 Improve UI/UX for better usability  
📱 Make it responsive for mobile interaction  

---
### 🛠 Built with passion using **Next.js, Three.js, and Tailwind CSS** 🚀

