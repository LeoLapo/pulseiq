package main

import (
	"os" // Adicionado para abrir o arquivo de log

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/LeoLapo/pulseiq/stock-service/internal/api"
)

func main() {
	app := fiber.New()

	// Abrir o arquivo de log
	logFile, err := os.OpenFile("logs/app.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		panic(err) // Tratar erro ao abrir o arquivo
	}
	defer logFile.Close() // Fechar o arquivo ao encerrar (opcional, dependendo do caso)

	// Adicionar logger com o arquivo como saída
	app.Use(logger.New(logger.Config{
		Output: logFile, // Usar o arquivo como destino dos logs
	}))

	// Configurar rotas com JWT e rate limiting
	api.SetupRoutes(app)

	// Iniciar o servidor na porta 8080
	app.Listen(":8080")
}