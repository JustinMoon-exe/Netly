# Netly - A Personal Network Information Dashboard

[![Website URL](https://img.shields.io/badge/Website-Live_Demo-brightgreen)](https://netly-dbb77-438128479308.us-central1.run.app/)

[![Technical Doc](https://img.shields.io/badge/Technical_Report-Google_Docs-blue)](https://docs.google.com/document/d/1Fsh0x_QolR3jZNZhVKNxUCEULB3k4aAMNWjtEGeUCYI/edit?usp=sharing)
## Project Overview

Netly is a web application designed to provide users with instant insights into their current network information.  It fetches and displays key details such as your public IP address, geographical location, Internet Service Provider (ISP), and timezone in a clean, user-friendly dashboard.

This project has been enhanced to include user authentication, data logging, and security features, and is designed for scalable and cost-effective cloud deployment, making it a practical example of modern web application development.

## Key Features

*   **Real-time Network Information:** Fetches and displays your public IP address, location (city, region, country, coordinates), ISP, and timezone using external APIs.
*   **User Authentication:** Implements secure user sign-up and login functionality using Firebase Authentication (email/password).
*   **Data Logging:** Logged-in users can save their network information to their personal history.
    *   **Save Data Button:**  A "Save Data" button allows users to explicitly save the currently displayed network information.
    *   **Personalized Logs:** Network data is saved to Firebase Firestore, associated with the user's account.
*   **"My Logs" Feature:** Logged-in users can view a history of their saved network data logs.
    *   Displays a list of saved logs, ordered by timestamp (newest first).
    *   Each log entry shows timestamp, IP address, ISP, location details, and timezone.
*   **Security Enhancements:**
    *   **HTTPS:**  Website is served over HTTPS for secure communication (automatically handled by Google Cloud Run).
    *   **XSS Protection:** Implements DOMPurify to sanitize data from external APIs to mitigate Cross-Site Scripting (XSS) vulnerabilities.
*   **Performance Optimization:**
    *   **Scalable Infrastructure:** Deployed on Google Cloud Run, a serverless platform that automatically scales to handle varying traffic.
*   **Network Monitoring:**
    *   **Google Analytics Integration:** Integrated with Google Analytics to track website traffic, user demographics, and usage patterns.
*   **Modern Tech Stack:** Built using React, Vite, and Tailwind CSS for a fast, responsive, and visually appealing user interface.
*   **Dockerized Deployment:** Application is containerized using Docker for consistent and portable deployment.
*   **Free Tier Hosting (Google Cloud Run):** Designed to be hosted on Google Cloud Run within the generous "Always Free" tier limits for low-traffic personal use.
*   **IPv6 Support:**  Automatically supports IPv6 for modern networking compatibility (handled by Google Cloud Run).

## Technologies Used

*   **Frontend:**
    *   [React](https://reactjs.org/) - JavaScript library for building user interfaces.
    *   [Vite](https://vitejs.dev/) - Fast build tool and development server for modern web projects.
    *   [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework for rapid styling.
    *   [React Router DOM](https://reactrouter.com/web/guides/quick-start) - For client-side routing (though currently a single-page application).
    *   [React Icons](https://react-icons.github.io/react-icons) - Icon library for React.
    *   [DOMPurify](https://github.com/cure53/DOMPurify) - For sanitizing HTML to prevent XSS attacks.
*   **Backend & Data:**
    *   [Firebase](https://firebase.google.com/) - Backend-as-a-service platform.
        *   [Firebase Authentication](https://firebase.google.com/docs/auth) - For user authentication (email/password).
        *   [Firebase Firestore](https://firebase.google.com/docs/firestore) - NoSQL document database for storing user logs.
    *   [axios](https://axios-http.com/) - Promise-based HTTP client for making API requests.
    *   [ipinfo.io](https://ipinfo.io/) - API for fetching network information.
    *   [api64.ipify.org](https://www.ipify.org/) - Fallback API for IP address retrieval.
*   **Deployment & Infrastructure:**
    *   [Docker](https://www.docker.com/) - Containerization platform for packaging the application.
    *   [Nginx](https://www.nginx.com/) - Web server used to serve static files in the Docker container.
    *   [Google Cloud Run](https://cloud.google.com/run) - Serverless compute platform for hosting the Docker container.
    *   [Google Cloud Artifact Registry](https://cloud.google.com/artifact-registry) - For storing Docker images in Google Cloud.
    *   [Google Analytics](https://analytics.google.com/) - Website analytics platform for traffic monitoring.
