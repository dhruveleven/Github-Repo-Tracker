# GitHub Repo Tracker 🐙

This is a modern and interactive web application built with React that allows users to search for GitHub profiles and view their public repositories. 

---

## ✨ Features

* **GitHub Profile Search:** Easily search for any GitHub user by their username.
* **Profile Display:** View key information about the GitHub user, including their avatar, name, bio, followers, following count, public repos count, and location.
* **Repository Listing:** See a list of the user's public repositories, sorted by stars.
* **Repository Filtering:** Filter repositories by name to quickly find specific projects.
* **Pagination:** Navigate through multiple pages of repositories for users with many projects.
* **Loading Skeletons:** Provides a smooth user experience by displaying animated placeholders while data is being fetched.
* **Responsive Design:** Optimized for viewing and interaction across various device sizes (desktop, tablet, mobile).


---

## 💻 Technologies Used

This project is built entirely on the frontend using modern web technologies:

* **React:** A JavaScript library for building user interfaces, handling component structure, state management, and rendering.
* **JavaScript (ES6+):** The core programming language for all application logic.
* **HTML:** Provides the structural foundation of the web page, integrated within React's JSX.
* **CSS:** Used for all styling, including the dark theme, animations, responsiveness, and overall visual appeal.
* **Axios:** A popular promise-based HTTP client used to make requests to the GitHub REST API.
* **GitHub REST API:** The external API used to fetch public user profile and repository data.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have **Node.js** and **npm** (Node Package Manager) installed on your machine. You can download them from [nodejs.org](https://nodejs.org/).

### Installation

1.  **Clone the repository (or create a new React app):**
    If you're starting fresh, create a new React app:
    ```bash
    npx create-react-app github-repo-tracker
    cd github-repo-tracker
    ```
    If you're cloning an existing repo:
    ```bash
    git clone [https://github.com/your-username/github-repo-tracker.git](https://github.com/your-username/github-repo-tracker.git) # Replace with your repo URL
    cd github-repo-tracker
    ```

2.  **Install project dependencies:**
    ```bash
    npm install axios
    # Or simply: npm install (if you cloned and package.json exists)
    ```

3.  **Update `App.js` and `index.css`:**
    Replace the content of `src/App.js` and `src/index.css` with the latest code provided (from the last successful code generation).

---

## ▶️ How to Run the Application

Once the setup is complete, you can run the application:

1.  **Navigate to the project root directory:**
    ```bash
    cd github-repo-tracker
    ```

2.  **Start the React development server:**
    ```bash
    npm start
    ```

    This command will compile the React application and automatically open it in your default web browser (usually at `http://localhost:3000`).

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or find any issues, please feel free to open an issue or submit a pull request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---
