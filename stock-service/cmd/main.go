package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/LeoLapo/pulseiq/stock-service/internal/api"
)

func main() {
	app := fiber.New()

	// Configurar rotas
	api.SetupRoutes(app)

	// Iniciar o servidor na porta 8080
	app.Listen(":8080")
}