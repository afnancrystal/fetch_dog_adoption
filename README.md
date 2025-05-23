# 🐾 Pawtastic Rescue

**Bringing Hope, One Bark at a Time**  
A responsive React app for browsing adoptable dogs using location-based filtering, breed selection, and personalized favorites; built as part of Fetch's Frontend Take-Home Assessment.

<div align="center">
  <!-- Row 1 -->
  <img src="https://github.com/user-attachments/assets/4d48551f-cb91-46d1-a71a-812bf73e3568" width="450" style="margin:10px"/>
  <img src="https://github.com/user-attachments/assets/2e8fbc2d-1e3d-4a06-b7a0-8c9dd4957070" width="450" style="margin:10px"/>
  
  <!-- Row 2 -->
  <img src="https://github.com/user-attachments/assets/2a41876c-6eea-46e8-b2e0-c71959e3c487" width="450" style="margin:10px"/>
  <img src="https://github.com/user-attachments/assets/2bf6ca9d-bad7-468b-92af-13dc01504d85" width="450" style="margin:10px"/>

  <!-- Row 3 -->
  <img src="https://github.com/user-attachments/assets/283533f7-a008-4dd7-86e9-2f28e9fe0b7d" width="500" style="margin:20px"/>
</div>


---

## 📸 Overview

Pawtastic Rescue allows users to:
- Search for adoptable dogs by breed and zip code
- Sort results by name, age, or breed
- Favorite up to 100 dogs
- Get matched with a perfect pup
- View detailed information about each dog

---

## 🧰 Tech Stack

- **React + Vite** — Frontend framework
- **Tailwind CSS** — Styling
- **Axios + Fetch API** — API requests
- **React Router** — Navigation and routing
- **Vite** — Fast development

---

## 📝 Features

- 🔍 **Filterable search** by breed and zip code
- 🧭 **Sortable results** by name, breed, or age (ascending/descending)
- ❤️ **Favorite list** with a 100-dog limit
- 🎯 **Smart matching** from selected favorites
- 🌐 **Responsive UI** for desktop and mobile devices
- 🐕 **Dynamic dog cards** with real-time data and map location

---

## 📦 Installation

```bash
git clone https://github.com/afnancrystal/fetch_dog_adoption.git
cd fetch_dog_adoption
npm install
npm run dev
````

---

## 🔐 Authentication

To interact with the Fetch API:

1. On app load, users log in with name + email
2. An auth cookie is automatically handled via `withCredentials: true`
3. All protected endpoints require authentication

---

## 📁 Project Structure

```
src/
├── components/
│   └── Toast.jsx
├── pages/
│   └── DogSearchPage.jsx
├── assets/
│   └── logo.png
├── App.jsx
└── main.jsx
```

---

## ✅ Requirements Met

* [x] Login authentication
* [x] Dog search by breed and zip code
* [x] Sort by breed (default), name, and age
* [x] Pagination of results
* [x] Favorite dogs with selection cap
* [x] Dog match generation
* [x] Responsive, styled UI with logo integration

---

## 🙌 Acknowledgments

Thanks to [Fetch](https://www.fetch.com) for the opportunity and the pawesome API!
