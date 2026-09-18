# --- Stage 1: Build the React app ---
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Accept Supabase/Firebase values as build args, and expose them as env vars
# so Vite can bake them into the built JS bundle
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_FIREBASE_API_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY

RUN npm run build

# --- Stage 2: Serve the built files with a lightweight web server ---
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]