#  Run Locally with Docker

This guide lets anyone run the full app (React client + Express/MongoDB server) on their own machine using Docker.
> No need to install Node.js, MongoDB, or any dependencies manually.

---

## Prerequisites

- **Docker Desktop** installed and running
- **Git** installed (to clone the repo)
- Docker handles Node.js, npm, and all dependencies inside the containers.

---

## Step 1: Clone the repository

```bash
git clone https://github.com/your-username/repo.git
cd repo
```
> Downloads the project to your machine and moves your terminal into the project folder. Run every command in this guide from here (the project root i.e., the folder containing `docker-compose.yml`) unless noted otherwise.

## Step 2: Set up environment variables

The server needs a `.env` file in the **project root** with your own values:

```
PORT=3000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
```
> `MONGO_URI` should point to your own MongoDB Atlas cluster (or any MongoDB instance you have access to) the app doesn't include a database, it just connects to one. `JWT_SECRET` can be any random string; it's used to sign login tokens.

The client also needs its own `.env` file inside the `client` folder (`client/.env`) with your Firebase/Supabase keys, since Vite bakes these into the build at build time:

```
VITE_FIREBASE_API_KEY=your-firebase-key
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```
> Check `client/src/firebase.js` and `client/src/supabaseClient.js` for the exact variable names this project expects, and fill in values from your own Firebase/Supabase project dashboards.

⚠️ Neither `.env` file is included in the repo (they're git-ignored for security). You must create both yourself before building.

## Step 3: Build the Docker images

```bash
docker compose build
```
> Builds two separate images: one for the Express server (`Dockerfile.server`), one for the React client (`client/Dockerfile`, which compiles the app with Vite and serves it via Nginx). First build takes a few minutes since it downloads base images and installs dependencies; later rebuilds are faster thanks to Docker's caching.

## Step 4: Start the app

```bash
docker compose up -d
```
> Starts both containers in the background. `-d` means detached mode, so your terminal stays free.

## Step 5: Open the app

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:3000](http://localhost:3000)

The client automatically forwards any `/api/...` requests to the server container internally, so you only need to open the frontend URL, no extra configuration required.

## Step 6: Check everything's running (optional)

```bash
docker compose ps
```
> Lists both containers and confirms they show status `Up`.

```bash
docker compose logs -f server
```
> Streams the server's live logs. It is useful to confirm `Database Connected` appears, meaning your `MONGO_URI` worked. Press `Ctrl+C` to stop watching (app keeps running).

## Step 7: Stop the app

```bash
docker compose down
```
> Stops and removes both containers. Your built images stay saved locally, so starting again later with `docker compose up -d` is fast. No need to rebuild unless you changed the code.

---

## Troubleshooting

| Problem | Likely cause |
|---|---|
| Frontend loads but shows no listings / API errors | Check `docker compose logs -f server`: likely an incorrect `MONGO_URI` in your root `.env` |
| Build fails during `npm install` (client) | Usually a slow/unstable internet connection timing out: Just rerun `docker compose build` |
| "Cannot connect to Docker daemon" error | Docker Desktop isn't running: Open it and wait until it shows "Engine running" before retrying |
| Port 3000 or 5173 already in use | Another app on your machine is using that port: Stop it, or edit the port numbers in `docker-compose.yml` |

---
---
---

# 🗄️ Moving Docker Desktop's Storage from C: to D: Drive

If you've already installed Docker Desktop on C: and want its data (images, containers, volumes, build cache) to live on D: instead to keep C: free, do this **once, anytime after installation**:

### 1️⃣ Create a destination folder on D:

In File Explorer, create a folder like `D:\DockerData`. (Or in PowerShell: `mkdir D:\DockerData`.)

### 2️⃣ Stop any running containers first

```bash
docker compose down
```
> Run this from any project folder you have running, to shut things down cleanly before moving storage.

### 3️⃣ Open Docker Desktop settings

Open Docker Desktop → click the **gear icon** (Settings, top right) → **Resources** → **Advanced**.

### 4️⃣ Change the disk image location

Find **"Disk image location"**, click **Browse**, and select the `D:\DockerData` folder you created.

### 5️⃣ Apply and restart

Click **"Apply & Restart"**. Docker Desktop will shut its engine down, copy all existing data over to D:, point itself at the new location, and restart the engine. This can take a few minutes depending on how much data you have, don't interrupt it mid-copy.

### 6️⃣ Verify

Once it's back up, run:
```bash
docker system df
```
> Confirms your images/volumes are still there and usable. Then check your C: drive's free space in File Explorer, it should have increased by roughly however much Docker's data was taking up.

From this point on, all new images, containers, and build cache you create will automatically be stored on D: instead of C: