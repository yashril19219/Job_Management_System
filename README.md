# Job Management System

## Overview

This project is a backend application built with Node.js, MongoDB, Redis, RabbitMQ, and Elasticsearch. It includes a Docker Compose configuration to easily set up the required infrastructure components (MongoDB, Redis, RabbitMQ, Elasticsearch, and Kibana).

The main functionalities of the project are related to job management and email services. The job management system allows you to handle various tasks, while the emailing service manages the sending of emails.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Docker
- Node.js
- npm

## Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/yashril19219/Job_Management_System.git
    cd Job_Management_System
    ```

2. Start the infrastructure services using Docker Compose:

    ```bash
    docker-compose up -d
    ```

   This will launch MongoDB, Redis, RabbitMQ, Elasticsearch, and Kibana.

3. Install dependencies for the job management system:

    ```bash
    cd JMS_Backend
    npm install
    ```

4. Start the job management system:

    ```bash
    npm start
    ```

5. Open a new terminal and navigate to the emailing service:

    ```bash
    cd Email_Microservice
    ```

6. Install dependencies for the emailing service:

    ```bash
    npm install
    ```

7. Start the emailing service:

    ```bash
    npm start
    ```

## Usage

- The job management system API is accessible at `http://localhost:8000`.



Refer to the respective service documentation for API endpoints and usage details.


