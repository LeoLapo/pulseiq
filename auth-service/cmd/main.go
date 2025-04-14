package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/LeoLapo/pulseiq/auth-service/internal/api"
)

func main() {
	app := fiber.New()

	// Configurar CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET, POST, OPTIONS",
		AllowCredentials: true,
	}))

	api.SetupRoutes(app)
	app.Listen(":8081")
}