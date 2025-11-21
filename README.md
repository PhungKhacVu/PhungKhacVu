# Prompt Nebula

**Your Command Center for Creative AI**

Prompt Nebula is a personal, locally-runnable web application designed to be your "prompt laboratory." It allows you to create, manage, test, and reuse a highly structured database of advanced AI prompts, all from a stylish, retro-futuristic interface.

This tool was built to move beyond simple text files and notes, providing a structured environment for serious prompt engineering. The entire application runs on your local machine with no need for an internet connection (after setup) or external databases.

## Features

-   **Structured Prompt Database**: Store prompts with detailed metadata, including the engineering technique used, use case, parameters, and notes.
-   **Full CRUD Functionality**: Easily Create, Read, Update, and Delete your prompts through a user-friendly interface.
-   **Local First**: The entire application and its data (a simple `prompts.json` file) live on your computer.
-   **Import & Export**: Easily back up your entire prompt library to a JSON file or import an existing one.
-   **Search & Filter**: Quickly find the prompts you need by searching their titles.
-   **No Authentication**: Built for personal use, this tool has no complicated login or user system. Just launch and use.
-   **Themed Interface**: A unique "Galaxy Retro-Futurism" theme to inspire creativity.

## Tech Stack

-   **Backend**: Node.js, Express.js
-   **Frontend**: Vanilla HTML, CSS, JavaScript (no frameworks)
-   **Database**: Local JSON file (`database/prompts.json`)

## Getting Started

Follow these instructions to get Prompt Nebula running on your local machine.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) (which includes `npm`) installed on your computer.

### Installation & Launch

1.  **Download the Code**: Download the source code as a ZIP file or clone the repository to your local machine.

2.  **Open a Terminal**: Navigate to the root directory of the project in your terminal or command prompt.

3.  **Install Dependencies**: Run the following command to install all the necessary libraries for the backend server.
    ```bash
    npm install
    ```

4.  **Start the Application**: Once the installation is complete, start the server with this command:
    ```bash
    npm start
    ```

5.  **Open in Browser**: The terminal should now say `Server is listening on port 3000`. You can open your web browser and navigate to the following address to use the application:
    [http://localhost:3000](http://localhost:3000)

That's it! You are now running your own personal Prompt Nebula command center.
