# SecurityScorecard Portfolio Visualization
*Project by Marc Hoffmann during the SecurityScorecard API Hackathon (May 2nd, 2025)*

**Tagline:** Visually mapping portfolio and company connections to uncover hidden risks.

---

## 🌟 Project Overview

The SecurityScorecard platform provides a wealth of data, but understanding the intricate relationships between different portfolios and the companies within them can be challenging when relying solely on tabular data. This project, developed during the SecurityScorecard API Hackathon, offers a solution by providing a **browser-based user interface that visualizes these connections as an interactive graph**.

It allows users to see not just the companies within a single portfolio, but also how they might be connected across different portfolios. By representing companies as nodes and their relationships as edges, users can more intuitively grasp their digital ecosystem's structure. The visualization further enhances understanding by **color-coding company nodes based on their overall SecurityScorecard score**, making it easy to spot potential risk concentrations at a glance. This tool empowers users to visually explore these connections and better understand the potential security implications of issues shared between entities.

---

## ✨ Key Features

* **Interactive Graph Visualization:** Displays portfolios and companies as nodes and relationships as edges.
* **Cross-Portfolio Connections:** Maps and visualizes connections that span across different portfolios.
* **Score-Based Color Coding:** Company nodes are color-coded according to their SecurityScorecard score, providing an immediate visual risk indicator.
* **Node Information on Click:** Users can click on any node (company or portfolio) in the graph to get more detailed information.
* **Dynamic Data Loading:** Fetches data directly from the SecurityScorecard API to build the graph.

---

## 🛠️ Technology Stack

* **Backend:** Node.js, Express.js
* **Frontend:** Cytoscape.js (for graph visualization)
* **API Integration:** SecurityScorecard API
    * Utilizes `/api/securityscorecard/portfolios` to fetch portfolio data.
    * Uses `/api/securityscorecard/portfolios/${portfolioId}/companies` to get company details within portfolios, including their scores.

---

## ⚙️ Setup and Installation

### Prerequisites

* Node.js version 20 or 22 must be installed on your system.

### Installation Steps

1.  Clone the repository (if applicable) or download the project files.
2.  Navigate to the project directory in your terminal.
3.  Run the following command to install the necessary dependencies:
    ```bash
    npm ci
    ```

---

## 🔑 Configuration

### Required Environment Variables

The application requires the following environment variables to be set:

* `SECURITYSCORECARD_API_KEY`: Your personal SecurityScorecard API key. This is necessary for the application to fetch data.
* `PORT`: The port number on which the local server will run. Defaults to `3000` if not specified.

### .env File Setup

1.  In the root project directory, create a new directory (folder) named `instance`.
2.  Inside the `instance` directory, create a file named `.env`.
3.  Add your environment variables to the `instance/.env` file in the following format:
    ```
    SECURITYSCORECARD_API_KEY=your_actual_api_key_goes_here
    PORT=3000
    ```
    **Note:** Replace `your_actual_api_key_goes_here` with your real SecurityScorecard API key.

---

## 🚀 Running the Application

1.  Ensure you have completed the installation and configuration steps above.
2.  Open your terminal, navigate to the project's root directory.
3.  Execute the start command:
    ```bash
    npm run start
    ```
4.  Once the server is running (you should see output in the terminal), open your web browser.
5.  Go to: `http://localhost:3000` (or `http://localhost:YOUR_PORT` if you configured a different port).

---

## 🖥️ Usage

* Upon loading the page in your browser, please **wait for a moment** for the application to fetch data from the SecurityScorecard API and render the graph.
* The graph will display your portfolios and the companies within them.
* You can **click on any node** (representing a portfolio or a company) to get more information about it.
* Pan and zoom to explore the graph.

**⚠️ Important Security Note:**
**Do NOT expose this server to the internet!** Exposing this application publicly would mean that anybody using the server can query the SecurityScorecard API using *your* API key embedded in the server's environment. Although the current project might primarily use `GET` requests, this is a significant security risk. This tool is intended for local, private use only.

---

## 💡 Potential Use Cases & Benefits

This visualization tool can significantly aid your security and risk management workflows:

* **Visual Risk Identification:** Easily spot high-risk vendors or clusters of interconnected entities that might pose a cascading risk through the color-coded graph.
* **Understanding Complex Relationships:** Uncover hidden dependencies or shared third/fourth parties across your portfolios that might not be obvious from standard list views.
* **Enhanced Stakeholder Communication:** Present portfolio risk and interconnectedness in a clear, visual, and engaging way to non-technical audiences or leadership.
* **Strategic Portfolio Management:** Gain a more holistic and intuitive view of your digital ecosystem to make more informed decisions regarding vendor consolidation, diversification, or risk mitigation efforts.

---

Enjoy visualizing your SecurityScorecard landscape!