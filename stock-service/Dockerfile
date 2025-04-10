# Imagem base com Go 1.18
FROM golang:1.18-alpine AS builder

# Diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY go.mod go.sum ./
RUN go mod download

# Copiar o código
COPY . .

# Compilar o binário
RUN go build -o stock-service ./cmd/main.go

# Imagem final leve
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/stock-service .
EXPOSE 8080
CMD ["./stock-service"]