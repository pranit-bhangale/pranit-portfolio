# Habit Tracker (Full-Stack Application)

A scalable full-stack **Habit Tracker** application built with **Spring Boot**, **Hibernate**, and **React**. This platform enables users to build and maintain productive daily habits with real-time progress tracking, secure authentication, and a modern, responsive dashboard.

---

## 🏗️ Software Architecture

The application is built using a **layered architecture**, emphasizing the **Decoupling** and **SOLID** principles:

-   **Controller Layer:** Handles incoming HTTP requests and maps them to service methods.
-   **Service Layer:** Contains the core business logic, decoupled from the data access layer.
-   **Repository Layer:** Manages data persistence using Spring Data JPA, ensuring clean separation of concerns.
-   **DTO Pattern:** Used Data Transfer Objects to prevent exposing sensitive internal entity structures to the client.

## 🛠️ Backend Implementation
-   **Framework:** Spring Boot (Java)
-   **ORM:** Hibernate / Spring Data JPA
-   **Database:** MySQL
-   **Security:** JWT (JSON Web Token), Spring Security
-   **Validation:** Jakarta Bean Validation (Hibernate Validator)

## 🎨 Frontend Implementation
-   **Library:** React.js
-   **Styling:** Tailwind CSS / Bootstrap
-   **State Management:** React Hooks & Context API
-   **API Client:** Axios (REST API integration)

## 🌍 SEO & Performance
-   **RESTful Best Practices:** Optimized endpoints for fast response times and efficient data fetching.
-   **Database Optimization:** Indexed MySQL queries and normalized schema for data integrity and speed.
-   **Accessibility:** Implemented semantic HTML and ARIA labels in the React frontend.
