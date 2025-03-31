# Inventory Management System (inventory-app)

##  Project Overview

This is a full-stack Inventory Management System built with **Node.js**, **Express**, **Sequelize ORM**, **PostgreSQL (hosted on Neon.tech)**, and **EJS** templating. It allows users to manage inventory items, including creating, editing, deleting, and viewing them. A ledger system logs actions like item updates and deletions for traceability.

---

##  Features

- Add, edit, and delete inventory items
- Real-time inventory listing
- PostgreSQL database integration
- Input validation and error handling
- Ledger logging for auditing
- Clean UI using EJS templates
- Fully functional CRUD operations

---

## Technologies Used

- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL (via Neon.tech)
- EJS for UI rendering
- HTML/CSS/Bootstrap (optional for styling)

---

## Setup Instructions

### 1. Clone the repository:
git clone https://github.com/Nandhu-conestoga/inventory-app.git
cd inventory-app

### 2. Install dependencies
npm install

### 3. Set up your environment variables
DATABASE_URL=postgresql://neondb_owner:npg_Jzjm86xgbwFZ@ep-tiny-sunset-a8cu5iw7-pooler.eastus2.azure.neon.tech/neondb?sslmode=require

### 4. Run database migrations 
npx sequelize-cli db:migrate

### 5. Start the server
npm start

Then open your browser

---
## LICENSE
I chose the MIT License:
I selected the MIT License because:

* It is simple and permissive, allowing anyone to freely use, modify, and distribute the code.

* It supports open-source collaboration and learning, which aligns with the educational goals of this project.

* It is widely used and well-understood in the developer community, making it easy for others to adopt and contribute without legal complications.


