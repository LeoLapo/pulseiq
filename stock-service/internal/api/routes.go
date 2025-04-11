package api

import (
	"encoding/json"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/go-resty/resty/v2"
)

func JWTMiddleware(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Missing Authorization header"})
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Malformed Authorization header"})
	}

	token := parts[1]

	client := resty.New()
	resp, err := client.R().
		SetBody(map[string]string{"token": token}).
		SetResult(&struct {
			Valid  bool                   `json:"valid"`
			Claims map[string]interface{} `json:"claims"`
		}{}).
		Post("http://localhost:8081/validate")

	if err != nil || resp.IsError() {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Token validation failed"})
	}

	result := resp.Result().(*struct {
		Valid  bool                   `json:"valid"`
		Claims map[string]interface{} `json:"claims"`
	})

	if !result.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid or expired JWT"})
	}

	return c.Next()
}

func SetupRoutes(app *fiber.App) {
	app.Use(limiter.New(limiter.Config{
		Max:        100,
		Expiration: 1 * time.Minute,
	}))
	app.Use(JWTMiddleware)

	stocks := app.Group("/stocks")
	stocks.Get("/:symbol", getStockRealTime)
	stocks.Get("/:symbol/history", getStockHistory)
}

func getStockRealTime(c *fiber.Ctx) error {
	symbol := c.Params("symbol")
	if symbol != "IBM" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Only IBM is supported for now"})
	}

	client := resty.New()
	resp, err := client.R().
		SetQueryParams(map[string]string{
			"function": "TIME_SERIES_DAILY", // Mudança para diário
			"symbol":   "IBM",
			"apikey":   "45Z022J17RPSNA2T",
		}).
		Get("https://www.alphavantage.co/query")

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch stock data", "details": err.Error()})
	}

	if resp.IsError() {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch stock data", "status": resp.Status()})
	}

	var result struct {
		Meta struct {
			Symbol string `json:"1. symbol"`
		} `json:"Meta Data"`
		TimeSeries map[string]struct {
			Open  string `json:"1. open"`
			High  string `json:"2. high"`
			Low   string `json:"3. low"`
			Close string `json:"4. close"`
		} `json:"Time Series (Daily)"`
		Information string `json:"Information"`
	}

	if err := json.Unmarshal(resp.Body(), &result); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to parse stock data", "details": err.Error()})
	}

	if result.Information != "" {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "API returned an error", "details": result.Information})
	}

	latestTime := ""
	for time := range result.TimeSeries {
		if time > latestTime {
			latestTime = time
		}
	}

	if latestTime == "" {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "No data available", "raw_response": string(resp.Body())})
	}

	latestData := result.TimeSeries[latestTime]
	data := map[string]interface{}{
		"symbol":    symbol,
		"price":     latestData.Close,
		"timestamp": latestTime,
	}
	return c.JSON(data)
}

func getStockHistory(c *fiber.Ctx) error {
	symbol := c.Params("symbol")
	if symbol != "IBM" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Only IBM is supported for now"})
	}

	client := resty.New()
	resp, err := client.R().
		SetQueryParams(map[string]string{
			"function": "TIME_SERIES_DAILY",
			"symbol":   "IBM",
			"apikey":   "45Z022J17RPSNA2T",
		}).
		Get("https://www.alphavantage.co/query")

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch stock history", "details": err.Error()})
	}

	var result struct {
		TimeSeries map[string]struct {
			Close string `json:"4. close"`
		} `json:"Time Series (Daily)"`
		Information string `json:"Information"`
	}

	if err := json.Unmarshal(resp.Body(), &result); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to parse stock history", "details": err.Error()})
	}

	if result.Information != "" {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "API returned an error", "details": result.Information})
	}

	// Pegar as datas e ordenar
	dates := make([]string, 0, len(result.TimeSeries))
	for date := range result.TimeSeries {
		dates = append(dates, date)
	}
	sort.Sort(sort.Reverse(sort.StringSlice(dates))) // ordenar do mais recente pro mais antigo

	// Pegar só os 7 mais recentes
	history := make([]map[string]interface{}, 0, 7)
	for i, date := range dates {
		if i >= 7 {
			break
		}
		closePrice := result.TimeSeries[date].Close
		history = append(history, map[string]interface{}{
			"date":  date,
			"price": closePrice,
		})
	}

	return c.JSON(map[string]interface{}{
		"symbol":  symbol,
		"history": history,
	})
}