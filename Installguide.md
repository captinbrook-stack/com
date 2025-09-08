ComplyEase - GitHub Pages Deployment Guide
This guide provides step-by-step instructions to take your ComplyEase.jsx file, structure it into a proper React project using Vite, and deploy it as a live website on GitHub Pages.

Step 1: Set Up a New React Project with Vite
First, we'll create a new React project on your local machine. Open your terminal and run the following command:

# This command will ask you a few questions
npm create vite@latest

When prompted, answer the questions as follows:

Project name: complyease-app (or any name you prefer)

Select a framework: React

Select a variant: JavaScript

This will create a new directory with a basic React project structure. Now, navigate into your new project and install the initial dependencies:

cd complyease-app
npm install

Step 2: Add Your ComplyEase Code and Dependencies
Replace App.jsx: Open the newly created src folder. Delete the existing App.jsx file and create a new one. Copy the entire contents of your ComplyEase.jsx file and paste them into src/App.jsx.

Clean up main.jsx: Open src/main.jsx. It should be a very simple file. Make sure it imports App from ./App.jsx and renders it. It should look like this:

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // We will create this next

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

Install App Dependencies: Your application uses several libraries. Install them by running this command in your terminal:

npm install @tanstack/react-query framer-motion lucide-react recharts

Set Up Tailwind CSS: Since your app uses Tailwind's utility classes, you need to add it to the project. Follow the official Vite guide for Tailwind CSS or run these commands:

# Install Tailwind and its peer dependencies
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Configure your template paths in tailwind.config.js
# Replace the file's content with this:
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

# Add the Tailwind directives to your CSS
# Create a file at src/index.css and add this:
@tailwind base;
@tailwind components;
@tailwind utilities;

Step 3: Configure Your Project for GitHub Pages
Install gh-pages: This is a helper package that makes deploying to GitHub Pages easy.

npm install gh-pages --save-dev

Update vite.config.js: Open vite.config.js at the root of your project. You need to add a base property so that all the asset links work correctly on GitHub Pages. The value should be your repository's name.

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
  // Replace 'complyease-app' with the name of your GitHub repository
  base: '/complyease-app/', 
  plugins: [react()],
})

Update package.json: Open package.json. You need to add three lines:

A homepage URL at the top.

A predeploy script.

A deploy script.

{
  "name": "complyease-app",
  "private": true,
  "version": "0.0.0",
  // Add this line. Replace <YOUR_GITHUB_USERNAME>
  "homepage": "https://<YOUR_GITHUB_USERNAME>.github.io/complyease-app",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    // Add these two scripts
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  // ... rest of the file
}

Note: Make sure the repository name in the homepage URL and vite.config.js matches exactly.

Step 4: Deploy to GitHub
Create a GitHub Repository: Go to GitHub and create a new, empty repository. Name it complyease-app (or whatever you chose).

Initialize Git and Push: In your terminal, initialize a git repository and push your code to GitHub.

# Make sure you are in your project's root directory
git init
git add .
git commit -m "Initial commit"
git branch -M main

# Replace the URL with your repository's URL
git remote add origin [https://github.com/](https://github.com/)<YOUR_GITHUB_USERNAME>/complyease-app.git
git push -u origin main

Deploy! Now, run the deploy script.

npm run deploy

This command will first run the predeploy script (which builds your app into a dist folder) and then the deploy script pushes the contents of that dist folder to a special gh-pages branch in your repository.

Finally, go to your repository's Settings > Pages. You should see a message saying "Your site is live at..." It might take a minute or two to appear. Your "ComplyEase" application is now hosted on the web!