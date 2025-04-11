package api

import (
    "time"

    "github.com/gofiber/fiber/v2"
    "github.com/golang-jwt/jwt/v5"
)

func SetupRoutes(app *fiber.App) {
    app.Post("/login", login)
    app.Post("/validate", validateToken)
}

func login(c *fiber.Ctx) error {
    type LoginRequest struct {
        Username string `json:"username"`
        Password string `json:"password"`
    }

    var req LoginRequest
    if err := c.BodyParser(&req); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
    }

    // Simulação de validação (substitua por um banco de dados real)
    if req.Username != "leonardo" || req.Password != "12345" {
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid credentials"})
    }

    // Gerar token JWT
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "sub": req.Username,
        "iat": time.Now().Unix(),
        "exp": time.Now().Add(time.Hour * 24).Unix(), // Expira em 24h
    })

    tokenString, err := token.SignedString([]byte("chave-secreta-super-segura"))
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate token"})
    }

    return c.JSON(fiber.Map{"token": tokenString})
}

func validateToken(c *fiber.Ctx) error {
    type ValidateRequest struct {
        Token string `json:"token"`
    }

    var req ValidateRequest
    if err := c.BodyParser(&req); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
    }

    token, err := jwt.Parse(req.Token, func(token *jwt.Token) (interface{}, error) {
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, fiber.NewError(fiber.StatusUnauthorized, "Unexpected signing method")
        }
        return []byte("chave-secreta-super-segura"), nil
    })

    if err != nil || !token.Valid {
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid or expired token"})
    }

    return c.JSON(fiber.Map{"valid": true, "claims": token.Claims})
}