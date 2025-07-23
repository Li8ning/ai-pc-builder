# AI-Powered PC Builder Web App

This document outlines the plan for creating a web application that helps users build custom PC configurations using AI-powered recommendations.

## 1. Project Overview

The application consists of a frontend where users input their preferences and a backend that communicates with the OpenAI API to generate PC build recommendations.

### Tech Stack
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **AI Service:** OpenAI API (o4-mini-2025-04-16)

## 2. Application Flow

User flow:
1. User fills out PC preferences form (Budget in INR)
2. Frontend sends POST `/api/get-build-recommendation` with form data
3. Backend sends formatted prompt to OpenAI API
4. OpenAI returns recommended build with prices in INR (JSON)
5. Backend sends recommended build as response
6. Frontend displays recommended components and total cost in INR

## 3. File Structure

```
/pc-builder-app
  /frontend
    - index.html       # Main form for user input
    - results.html     # Page to display recommendations
    - style.css        # CSS for styling
    - script.js        # Frontend logic for form handling and API calls
  /backend
    - server.js        # Express server setup and API routes
    - ai-service.js    # Module for OpenAI API integration
  - package.json
  - README.md
```

## 4. AI Prompt Structure

When calling the OpenAI API, the backend constructs a prompt instructing the AI to:
- Recommend a complete set of compatible PC components (CPU, GPU, Motherboard, RAM, Storage, Power Supply, Case) that fits within the user’s budget
- Ensure all components are compatible
- Provide the name, estimated price in INR, key specs, and a brief reason for each choice
- Return the response as a JSON object

## 5. Backend API

### Endpoint: `POST /api/get-build-recommendation`

**Request Body:**
```json
{
  "budget": 100000,
  "pc_type": "Gaming",
  "style": "Gaming RGB",
  "form_factor": "Desktop"
}
```
**Success Response (200 OK):**
```json
{
  "total_cost": 98500,
  "parts": [
    { "type": "CPU", "name": "AMD Ryzen 5 5600X", "price": 15000, "specs": "6-core, 12-thread", "reason": "Excellent price-to-performance for gaming." },
    { "type": "GPU", "name": "NVIDIA GeForce RTX 3060 Ti", "price": 40000, "specs": "8GB GDDR6", "reason": "Great for 1080p/1440p gaming." }
  ]
}
```
**Error Response (500 Internal Server Error):**
```json
{
  "error": "Failed to get recommendations from AI service."
}
```

## 6. Development Plan

Step-by-step implementation:
- Setup project structure
- Create `package.json` and install dependencies (`express`, `axios`)
- Develop backend (`server.js`): Express server and `/api/get-build-recommendation` endpoint
- Implement AI service (`ai-service.js`): Construct prompt for OpenAI API and handle response
- Build frontend form (`index.html`, `style.css`): User input form with budget in INR and clean layout
- Implement frontend logic (`script.js`): Handle form submission, call backend API, display results
- Build results page (`results.html`): Show recommended parts and total cost in INR
- Add features: Form validation, loading spinners, error messages
- Test end-to-end flow with various inputs

## 7. Running the Application Locally

To run the application locally using the Vercel CLI (recommended for Vercel deployments):

1.  **Install Vercel CLI (if you haven't already):**
    ```bash
    npm install -g vercel
    ```

2.  **Navigate to your project directory:**
    ```bash
    cd path/to/pc-builder-app
    ```

3.  **Log in to Vercel (if not already logged in):**
    ```bash
    vercel login
    ```
    Follow the prompts to log in via your web browser.

4.  **Link your project to V Vercel (if not already linked):**
    If this is your first time running `vercel dev` for this project, you'll be asked to link it to a Vercel project.
    ```bash
    vercel link
    ```
    Follow the prompts to link to your existing Vercel project.

5.  **Pull Environment Variables Locally:**
    Ensure your `OPENAI_API_KEY` is set in your Vercel project's environment variables (in the Vercel dashboard). Then, pull them locally:
    ```bash
    vercel env pull .env.local
    ```
    This creates a `.env.local` file with your Vercel environment variables.

6.  **Run the application locally:**
    ```bash
    vercel dev
    ```
    The application will start on a local development server (usually `http://localhost:3000`).

## 8. Running the Application Locally (Node.js Direct)

You can still run the application directly with Node.js for basic backend testing, but it won't fully simulate the Vercel environment.

1.  **Navigate to the project directory:**
    ```bash
    cd path/to/pc-builder-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the project root and set:
    - `OPENAI_API_KEY=YOUR_OPENAI_API_KEY`

4.  **Start the server:**
    ```bash
    npm start
    ```
    The server will start on `http://localhost:3000`.

5.  **Open the application:**
    Open your web browser and navigate to `http://localhost:3000`.

6.  **Stopping the server:**
    To stop the server, go to the terminal window where it is running and press `Ctrl + C`.