# 📈 Microservices for Stock Monitoring

A microservices-based architecture for real-time stock tracking, custom alerts, and push/email notifications.

## 🧩 Services

- **`stock-service`** (Go + Fiber)  
  Real-time stock price lookup and historical data.

- **`alert-service`** (Python + FastAPI)  
  Custom alert system based on user-defined thresholds.

- **`notification-service`** (Node.js + NestJS)  
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
