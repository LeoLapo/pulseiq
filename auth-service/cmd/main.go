package main

import (
    "github.com/gofiber/fiber/v2"
    "github.com/LeoLapo/pulseiq/auth-service/internal/api"
)

func main() {
    app := fiber.New()
    api.SetupRoutes(app)
    app.Listen(":8081") // Porta diferente do stock-service
}