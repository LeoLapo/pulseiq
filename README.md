# 📈 PulseIQ (Stock Monitoring)

A microservices-based architecture for real-time stock tracking, custom alerts, and push/email notifications.

## 🧩 Services

- **`stock-service`** (Go) - Implemented  
  Real-time stock price lookup and historical data.

- **`auth-service`** (Go) - Implemented
  own authentication service, with token and direct sending to the user's email.

- **`alert-service`** (Python + FastAPI) - No Implemented  
  Custom alert system based on user-defined thresholds.

- **`notification-service`** (Node.js + NestJS)  No Implemented
  Notification delivery via Push or Email.

## 💻 Frontend

- **React + TailwindCSS**  
  User interface for tracking stocks, managing alerts, and viewing notifications.

## 🔗 Communication

- **REST** between services  
- **RabbitMQ** or **gRPC** for asynchronous messaging

## 🔐 Security

- Authentication using **JWT**
- **Per-service logging**
- **Rate limiting** implemented at the gateway level

## 🐳 Docker

- Full orchestration using **Docker Compose**
- Each microservice runs in its own container with a dedicated database
- Additional containers:
  - `rabbitmq`
  - `redis`
  - `gateway`

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Build and start the services

docker-compose up --build

### 3. Access the system

    Frontend: http://localhost:3000](http://localhost:5173/

    API Gateway: http://localhost:8080 (adjust if needed)

## 📁 Project Structure

```
.
├── stock-service/
├── auth-service/
├── alert-service/
├── notification-service/
├── frontend/
├── gateway/
├── docker-compose.yml
└── README.md
```

## 📌 TODO

Implement automated tests

Add Swagger/OpenAPI documentation

Integrate with real data providers (e.g. Yahoo Finance)
