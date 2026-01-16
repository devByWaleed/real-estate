# 🏡 Real Estate MERN Application

A full‑stack **Real Estate web application** built using the **MERN stack** that allows users to create accounts, list properties, upload images, and browse listings with a modern UI.

---

## 🚀 Features

### 👤 Authentication

* User registration & login
* `JWT‑based` authentication
* Secure `HTTP‑only` cookies
* Protected routes (create/update/delete listings)


### 🏠 Listings

* Create property listings
* Upload up to 6 images per listing
* `Supabase` storage integration for images
* View individual listings
* `Swiper` image slider


### 🖼 Image Upload

* Image upload handled via **Supabase Storage**
* Public image URLs stored in MongoDB
* Client‑side validation (type & size)


### 🧑‍💻 User Profile

* Update profile details
* Update profile picture
* Delete account

---

## 🛠 Tech Stack

### Frontend

* React (Vite)
* Redux Toolkit
* React Router DOM
* Tailwind CSS
* Swiper.js

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JSON Web Tokens (JWT)

### Storage

* Supabase Storage (for images)

---

## 🔐 Authentication Flow

* User logs in
* JWT generated on server
* Token stored in HTTP‑only cookie
* Cookie automatically sent with protected requests

---

## 🧠 Important Notes

* Image URLs are stored in MongoDB, **not the image files**
* `userRef` is derived from JWT — never trusted from frontend
* Protected routes use `verifyToken` middleware

---

## 📌 Future Improvements

* Favorites / saved listings
* Admin dashboard
* Google Maps integration
* Messaging between users

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!