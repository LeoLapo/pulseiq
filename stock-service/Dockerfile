FROM golang:1.18-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o stock-service ./cmd/main.go
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/stock-service .
EXPOSE 8080
CMD ["./stock-service"]