package api

import (
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	stocks := app.Group("/stocks")
	stocks.Get("/:symbol", getStockRealTime)
	stocks.Get("/:symbol/history", getStockHistory)
}

func getStockRealTime(c *fiber.Ctx) error {
	symbol := c.Params("symbol")
	data := map[string]interface{}{
		"symbol":    symbol,
		"price":     123.45,
		"change":    2.34,
		"timestamp": "2025-04-10T12:00:00Z",
	}
	return c.JSON(data)
}

func getStockHistory(c *fiber.Ctx) error {
	symbol := c.Params("symbol")
	data := []map[string]interface{}{
		{"date": "2025-04-01", "price": 120.00},
		{"date": "2025-04-02", "price": 121.50},
		{"date": "2025-04-03", "price": 123.45},
	}
	return c.JSON(data)
}