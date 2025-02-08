
# Amadeus Flight Search Integration

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Testing](#testing)
- [Deployment](#deployment)


## Overview
This project integrates the Amadeus API to provide a seamless flight search experience. It allows users to search for flights, view detailed itineraries, and manage their bookings efficiently. The system optimizes API consumption through caching, pagination, and structured data processing, ensuring fast and reliable performance.

The application is built with **React (Vite) + TypeScript** on the frontend and **Spring Boot (Java) + Gradle** on the backend. It is fully containerized using **Docker and Docker Compose** for easy deployment.

## Features
- Search for flights by specifying departure and arrival airports, travel dates, number of passengers, and currency.
- Autocomplete feature for airport selection using partial or full airport names.
- Validation to prevent past date selection and incorrect return dates.
- Displays a list of flight options with key details:
  - Departure and arrival times
  - Airport names and codes
  - Airline and operating carrier details
  - Total flight duration and layovers
  - Pricing breakdown
- Sorting options to order results by price or duration.
- Pagination to efficiently manage large sets of flight results.
- Round-trip flight search with easy toggling between departure and return flights.
- Optimized backend with caching and batch processing to minimize API calls.
- **Fully containerized with Docker and Docker Compose**.

## Installation
### Prerequisites
- **Node.js & npm** (Frontend)
- **Java 21** + **Gradle** (Backend)
- **Docker & Docker Compose** (optional for containerized deployment)
- **Git**

### Steps
1. **Clone this repository:**
   ```sh
   git clone https://github.com/Sergio-L-M/FlightBookingApp.git
   cd FlightBookingApp

2. **Set up environment variables:**
   - The backend uses `application.properties` in the `backend/flightBooking-main/src/main/resources/` folder.
   - Configure the necessary Amadeus API credentials and database settings in `application.properties`.
     ```sh
        spring.application.name=backend
        amadeus.api.key=#YourApiKey
        amadeus.api.secret=#YourSecret
        flight.useMock=false #change to true if you want to use Mock data
     ```


3. **Run the application manually (without Docker):**
   - **Frontend:**
     ```sh
     cd frontend/FlightBooking
     npm install
     npm run dev
     ```
     The frontend will be available at `http://localhost:5173`.
   - **Backend:**
     ```sh
     cd backend/flightBooking-main
     ./gradlew bootRun
     ```
     The backend will be available at `http://localhost:8080`.

4. **Run the application using Docker Compose (optional):**
   ```sh
   docker-compose up -d --build
   ```
   - The **backend** will be available at `http://localhost:8080`
   - The **frontend** will be available at `http://localhost:5173`

## Usage
1. **Open the frontend** in a browser:  
   👉 `http://localhost:5173`
2. **Search for flights** by entering departure and arrival details.
3. **View and filter flight options.**
4. **Click on a flight for detailed information.**
5. **Toggle between round-trip and one-way flights.**

## API Endpoints
### Flight Search
- `GET /api/flights` - Retrieve a list of flight options based on query parameters.
### Airport Search
- `GET /api/airports?keyword=` - Fetch airport details for autocomplete.
### Flight Details
- `GET /api/:key/:id` - Retrieve detailed flight itinerary.

## Technologies Used
- **Frontend**: React (Vite), TypeScript, React Context API, Material-UI
- **Backend**: Java, Spring Boot, Gradle, Amadeus API
- **Database**: In-memory caching (for performance optimization)
- **Deployment**: Docker, Docker Compose (optional)
- **Testing**: Jest (Frontend), JUnit & Mockito (Backend)

## Testing
To run unit tests:

```sh
npm test  # Run frontend tests
./gradlew test  # Run backend tests
```

## Deployment
To deploy using **Docker Compose**, run:

```sh
docker-compose up -d
```





