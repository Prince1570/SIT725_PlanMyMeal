**Plan My Meal**
Plan My Meal is a web app that provides personalized meal suggestions tailored to your mood, dietary preferences, allergies, and calorie targets.

**Features**
1. User signup and login
2. Profile setup (dietary type, allergies, calorie target)
3. Mood-based meal recommendations
4. Meal history saved and displayed
5. Add and Remove from Favorites

**Workflow**
1.	Sign Up and Login
2.	Complete Profile
3.	Select a mood and get meal suggestions
4.	View meal history
5.  Add and Remove from Favorites

**Prerequisites**

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (Local installation)
- [GitHub](https://github.com/)
- A [Groq API](https://groq.com/) account and API key

**Installation & Setup**

**1. Clone the Repository**

```bash
git clone git@github.com:Prince1570/SIT725_PlanMyMeal.git
cd SIT725_PlanMyMeal
```

**2. Install Dependencies**

```bash
npm install
```

**3. Environment Variables Setup**
Create a `.env` file in the root directory and add the following variables:
```env
GROQ_API=API Key Here
GROQ_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
MONGO_URI=mongodb://localhost:27017/planmymeal
SECRET_KEY = secret_key_12345
```

**4. Get GROQ API Key**
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key and add it to your `.env` file

**5. Run the Application**
```bash
npm start
```

**Team member names:**
Krushi Bharodiya
Prince Patel
Shikshya Shakya
Prakriti Rajbhandari
