
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
- [Contributing](#contributing)
- [License](#license)

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
- **Docker & Docker Compose**
- **Git**

### Steps
1. **Clone this repository:**
   ```sh
   git clone https://github.com/your-repo/amadeus-flight-search.git
   cd amadeus-flight-search


2. **Set up environment variables:**

   ```sh
   cp .env.example .env
   ```

   Edit the `.env` file with your **Amadeus API credentials** and other required settings.

3. **Run the application using Docker Compose:**

   ```sh
   docker-compose up -d --build
   ```

   - The **backend** will be available at `http://localhost:8080`
   - The **frontend** will be available at `http://localhost:5173`

## Usage

1. **Open the frontend** in a browser:\
   👉 `http://localhost:5173`
2. **Search for flights** by entering departure and arrival details.
3. **View and filter flight options.**
4. **Click on a flight for detailed information.**
5. **Toggle between round-trip and one-way flights.**

## API Endpoints

### Flight Search

- `GET /api/flights` - Retrieve a list of flight options based on query parameters.

### Airport Search

- `GET /api/airports` - Fetch airport details for autocomplete.

### Flight Details

- `GET /api/flights/:id` - Retrieve detailed flight itinerary.

## Technologies Used

- **Frontend**: React (Vite), TypeScript, React Context API, Material-UI
- **Backend**: Java, Spring Boot, Gradle, Amadeus API
- **Database**: In-memory caching (for performance optimization)
- **Deployment**: Docker, Docker Compose
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

To manually deploy without Docker:

1. **Frontend**:
   ```sh
   cd frontend/FlightBooking
   npm install
   npm run build
   npm run preview
   ```
2. **Backend**:
   ```sh
   cd backend/flightBooking-main
   ./gradlew build
   java -jar build/libs/your-app.jar
   ```

