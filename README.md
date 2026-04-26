# 🐕 StrayCare — Smart Stray Dog Management for Urban India

Live Demo: https://stray-care-system--codenameiskira.replit.app/

![Built With](https://img.shields.io/badge/Built%20With-HTML%20%7C%20Tailwind%20CSS%20%7C%20Vanilla%20JS-blue)
![Status](https://img.shields.io/badge/Status-In%20Development-orange)
![Project](https://img.shields.io/badge/Made%20For-Reva%20University-green)

---

## 📌 About

StrayCare is a civic-tech web application designed to manage and track stray dogs in urban areas, with a focus on Bengaluru, India.  
It enables citizens to report stray dogs, helps NGOs coordinate rescue actions, and provides admins with data-driven insights at a zone level.  

The goal is to bridge the gap between community reporting and organized response using a simple, accessible platform.

---

## 🚀 Features

- 📝 **Report a Stray Dog** — location, description, and image upload  
- 🧭 **Admin Dashboard** — manage reports with status updates and live search  
- 🔄 **Status Workflow** — Reported → In Progress → Rescued  
- 📊 **City Insights Dashboard** — zone-based analytics and visualizations  
- 📍 **Zone Mapping** — reports linked to city zones for better tracking  
- 📱 **Fully Responsive** — works on mobile and desktop  
- 🎨 **Modern UI** — dark “Neon Civic” theme with glassmorphism and animations  

---

## 🛠 Tech Stack

| Tool              | Purpose                          |
|------------------|----------------------------------|
| HTML             | Structure                        |
| Tailwind CSS     | Styling & UI design              |
| Vanilla JS       | Application logic                |
| localStorage     | Data storage (browser-based)     |
| SVG + CSS        | Custom charts & animations       |
| Google Fonts     | Typography (Sora + Inter)        |

---

## 📁 Project Structure
StrayCare/
│── index.html        # User report page
│── admin.html        # Admin dashboard
│── insights.html     # City insights dashboard
│── zones.js          # Zone data
│── style.css         # Custom styles (if any)
---## ⚙️ Getting StartedNo installation required.Simply open:```bashindex.html
in your browser.

📸 Screenshots


[Report Page Screenshot]


[Admin Dashboard Screenshot]


[City Insights Dashboard Screenshot]



🧠 Data Model
Report Object (localStorage)
{  id,  location,  desc,  image,  date,  status}
Zone Data Structure
[  {    name,    population,    density,    strays,    neutered,    color  }]

🛣 Roadmap


🔗 MongoDB backend (Node.js + Express)


🔐 User authentication system


🤝 NGO coordination module


📊 Real BBMP open data integration


🤖 ML-based dog health detection


📱 Mobile app (React Native)



🤝 Contributing
Contributions are welcome!
Feel free to fork the repo, create a branch, and submit a pull request.

👨‍💻 Author
Made with ❤️ by Hongirana S
CSE Student, Reva University

📄 License
This project is licensed under the MIT License.
