# How to Deploy to Render (Step-by-Step Guide)

## 1. Create a PostgreSQL Database on Neon (Recommended Free Cloud Postgres)
1. Go to [neon.tech](https://neon.tech) and sign up for free.
2. Click **Create Project** and name it `portfolio-db`.
3. Copy the **Connection String** (`DATABASE_URL`):
   ```env
   postgresql://username:password@ep-something.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

---

## 2. Deploy the Next.js App to Render
1. Go to [dashboard.render.com](https://dashboard.render.com) and click **New +** -> **Web Service**.
2. Connect your GitHub repository: `itschathura/chathura-dharmasiri-portfolio`.
3. Fill in the following settings:
   - **Name**: `chathura-dharmasiri-portfolio`
   - **Language / Runtime**: `Node`
   - **Branch**: `main` (or your default branch)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Under **Environment Variables**, add the following:
   - `DATABASE_URL`: *(Your Neon PostgreSQL connection string)*
   - `ADMIN_PASSWORD`: `chathura123` *(or your custom secret password)*
   - `NEXT_PUBLIC_WEB3FORMS_KEY`: `0227e33c-4c34-4ce1-be08-94a1d9800697`
5. Click **Create Web Service** (Deploy).

---

## 3. How to Run Locally with Docker
1. Start the PostgreSQL Docker container:
   ```bash
   docker compose up -d
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Your local app will automatically connect to the local PostgreSQL container running on port `5532`.


### done