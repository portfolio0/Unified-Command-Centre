# Unified Command Centre  
An Integrated Automation Platform for Communication, User Management & Workflow Execution
This project is developed as a complete MERN Stack + MySQL system that centralizes communication, user data, and automated workflows in one place.  
While building this project, the aim was very simple — create something **practical**, **industry-ready**, and **honest** in functionality.  
The system is developed entirely from scratch, with AI used only as an assistive tool to enhance clarity and decision-making—never as a replacement for original development.

---

## 📌 Project Purpose  
The main purpose of the Unified Command Centre is to provide a **single dashboard** where an admin can:

- Manage all users  
- Send automated emails  
- Track conversations  
- Send and receive WhatsApp messages  
- Create and run workflow-based automation  
- View activity insights on a clean dashboard  

This system can be used by small businesses, service providers, educational institutes or anyone who needs a central platform for user communication and automation.

---

## 🧠 Why This Project Matters  
While developing this project, I focused on building every component manually with clear logic and maintaining a clean backend architecture. The frontend was designed to be simple, usable, and aligned with real product standards. **I also utilized AI as a productive assistant—to explore ideas, validate approaches, and improve clarity—while all system design, coding, and implementation were carried out by me**.

My goal was to gain real-world development experience across:

API design

Database operations

Authentication

Automation workflows

Third-party integrations

Full-stack deployment

This project greatly strengthened my understanding of how real systems work behind the scenes and improved both my technical and problem-solving skills.

---

## 🚀 Features Implemented  
### ✅ User Management  
- Add, edit, delete users  
- Store name, email, phone  
- View user list instantly  

### ✅ Conversations Module  
- Send outgoing messages  
- Track logs of all user interactions  
- WhatsApp communication (working locally, skipped in hosting)  


### ✅ Notification System  
- Send email alerts using Gmail SMTP  
- Save all outgoing notifications  
- Templates support ready  

### ✅ Workflow Automation  
- Create workflows  
- Add multiple steps  
- Run workflows for any user  
- Track workflow instances  
- Logs for each step execution  

### ✅ Dashboard  
- Clean overview of system  
- User count, message logs, workflow stats  
- Simple UI for faster navigation  

### 🚧 WhatsApp Automation  
WhatsApp integration is **fully built**.

Locally, the feature is tested and working.

---

## 🛠 Tech Stack  
### **Frontend**
- React  
- TailwindCSS  
- Axios  

### **Backend**
- Node.js  
- Express.js  
- MySQL  
- Nodemailer  

### **Database**
- MySQL

### **Hosting**
- **GitHub:** AllFolder
- **Frontend:** Netlify https://unified-command-centre.netlify.app/ 
- **Backend:** Render  //Not Yet Hosted
- **Database:** Aiven  //Not Yet Hosted

---

## 📦 Folder Structure  
```
/GharPey 
 ├── backend/
 │    ├── src/
 │    ├── controllers/
 │    ├── routes/
 │    ├── services/
 │    ├── config/
 │    └── app.js
 │
 ├── frontend/
 │    ├── src/
 │    ├── pages/
 │    ├── components/
 │    └── services/
 │
 ├── database.sql
 └── README.md
```

---

## 🧩 How To Run Locally  
### 1️⃣ Clone the Repo  
```bash
git clone https://github.com/portfolio0/Unified-Command-Centre.git
```

### 2️⃣ Install Frontend  
```bash
cd frontend
npm install
npm run dev
```

### 3️⃣ Install Backend  
```bash
cd backend
npm install
node src/app.js
```

### 4️⃣ Set Up MySQL  
Import the `database.sql` file into your MySQL server.

### 5️⃣ Configure Environment  
Create `.env` inside backend:

```
DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=
EMAIL_USER=
EMAIL_PASS=
PORT=5000
```

---

## 🌐 Live Deployment  

### 🔗 Frontend (Netlify)  
https://your-frontend-link.netlify.app  

### 🔗 Backend (Render)  
//not yet Deployed

---

## ❤️ Personal Note  
This project is a result of continuous learning, debugging, and improving step by step. Every feature was built with **genuine effort** and **clear understanding**. **Even when I used copy-paste—for code snippets, references, or AI-generated suggestions—it was done thoughtfully, only after fully understanding the logic and adapting it to fit the system’s needs.**

I believe real skills come from writing real code — and this project reflects that approach.


---

## 📬 Contact  

**Instagram**:https://instagram.com/Simply_0nk4r

**Email**: onkarnanvare9@gmail.com

---

### ⭐ Thank you for reviewing this project!
It means a lot.  🙏🏻

**WorkFlow Chart:** <img width="1024" height="1536" alt="workflow chart" src="https://github.com/user-attachments/assets/3b2c83a8-3a60-4eae-861d-51ba48c069fd" />
**FlowChart:** <img width="2006" height="1371" alt="Untitled centre flowchart" src="https://github.com/user-attachments/assets/c6e8f8f1-c7eb-4820-a198-e7d36d1a2cf1" />


