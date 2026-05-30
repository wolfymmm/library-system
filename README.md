# BOOKSY

![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![Node.JS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%61DAFB)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

Booksy is an online library platform that enables users to browse a digital catalog of books, view detailed book information, and order physical copies with home delivery. The system provides a convenient and user-friendly way to discover, manage, and access books from a single web application.

##  Main Features

* **Smart search and filtering:** Search for books by title, author, genre or tags.
* **Order system:** Ability to add a book to the cart and place an order for delivery.
* **Personal account:** History of ordered books, "I want to read" list and current delivery status.
* **AI-Powered Admin Panel:** Convenient management of the library collection, order processing, and an integrated NLP service that analyzes book descriptions to automatically predict and assign genres.

## Technology Stack
* **Frontend:** React, Redux Toolkit, SCSS
* **Backend:** Node.js (Express), Python
* **Database:** MongoDB

  
## Screenshots

<p align="center">
  <img width="70%" height="503" alt="image" src="https://github.com/user-attachments/assets/8313c889-1d02-4ef1-b600-523c73765dab" />
  <img width="70%" height="500" alt="image" src="https://github.com/user-attachments/assets/d8088f15-ee5b-4d9b-b3d3-9fe3bf4a84bd" />
  <img width="70%" height="504" alt="image" src="https://github.com/user-attachments/assets/03389a2c-9b5d-46e1-be55-d3bf426138a2" />
  <img width="70%" height="488" alt="image" src="https://github.com/user-attachments/assets/669c16b1-55bb-4365-bc71-83380a9c9284" />
  <img width="70%" height="660" alt="image" src="https://github.com/user-attachments/assets/46439e92-7ca9-42ae-a3b5-442ca81f0c61" />
</p>


## Installation Guide

Follow these steps to run the project locally on your machine.

### Prerequisites

Make sure you have the following installed:

* **Node.js** (v18 or higher) & **npm**
* **Python** (v3.13 or higher)
* **MongoDB** (local instance or MongoDB Atlas URI)

---

### Step-by-Step Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/booksy.git
cd booksy
```

---

#### 2. Backend Setup (Node.js & Express)

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the root of the backend folder and add your environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:

```bash
npm run dev
# or
npm start
```

---

#### 3. NLP Service Setup (Python)

If the NLP service runs as a separate microservice:

Navigate to the NLP/AI directory:

```bash
cd ../nlp-service
```

Create and activate a virtual environment:

```bash
python -m venv venv
```

**Windows**

```bash
venv\Scripts\activate
```

**macOS / Linux**

```bash
source venv/bin/activate
```

Install required Python packages:

```bash
pip install -r requirements.txt
```

Run the Python service:

```bash
python main.py
```

---

#### 4. Frontend Setup (React & Redux)

Open a new terminal window and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm start
```

---

### Running the Application

Once all services are running:

* Backend: `http://localhost:5000`
* Frontend: `http://localhost:3000`
* NLP Service: `http://localhost:8000` 

Open the frontend in your browser:

```text
http://localhost:3000
```

You can now explore **Booksy** and its features.

---

### Notes

* Adjust the folder names (`backend`, `frontend`, `nlp-service`) according to your project structure.
* Make sure all required environment variables are configured before starting the application.
* If you use MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.
* Ensure the backend and NLP service are running before launching the frontend.
  

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

