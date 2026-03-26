# sapharma 
Sapharma is a **parapharmacy management application** developed with **Spring Boot** for the backend and **Angular** for the frontend.  
The project helps manage stock, products, categories, and users efficiently.

---
## 🛠️ Technologies Used

| Layer        | Technology/Framework |
| ------------ | ------------------ |
| Backend      | Java, Spring Boot, Maven |
| Frontend     | Angular, TypeScript, HTML, CSS |
| Database     | MySQL |
| Versioning   | Git & GitHub |

---
## 📂 Project Structure

```text
sapharma/
 ├── backend-sapharma/       # Spring Boot backend
 │    ├── src/
 │    ├── pom.xml
 ├── frontend-sapharma/      # Angular frontend
 │    ├── src/
 │    ├── package.json
 ├── .gitignore
 └── README.md

---
## 🚀 Getting Started

```text
Prerequisites
Java 17+
Maven
Node.js 18+ & npm
Git
Backend Setup

```bash
cd backend-sapharma
mvn clean install
mvn spring-boot:run

The backend will run at: http://localhost:8080

Frontend Setup

```bash
cd frontend-sapharma
npm install
ng serve

The frontend will run at: http://localhost:4200

---
## 💻 Usage

```text
Open the frontend URL in your browser: http://localhost:4200
Login using default admin credentials:
Username: admin
Password: admin123
or default employe credentials:
Username: employe
Password: employe123
Manage products, categories, and stock easily!

---
## 📝 Notes

```text
Make sure to configure your database connection in application.properties (backend).
Frontend communicates with backend via http://localhost:8080/api/....
You can extend the project with sales, reporting, or notifications.

---
## 📁 Contribution

```text
Feel free to fork this repo and submit pull requests.
For issues or feedback, open an issue in this repository.

---
## 📜 License

```text
This project is licensed under the MIT License – see the LICENSE file for details.

Sapharma – Pharmacy management made simple.


---

## ✅ Next Step

1. Add this **README.md** to your repo.
2. Push to GitHub:

```bash
git add README.md
git commit -m "Add professional README"
git push
