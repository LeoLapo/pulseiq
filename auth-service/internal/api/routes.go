package api

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"github.com/jordan-wright/email"
	"net/smtp"
)

func init() {
	godotenv.Load() // Carregar variáveis de ambiente
}

func SetupRoutes(app *fiber.App) {
	app.Post("/login", login)
	app.Post("/verify-code", verifyCode)
	app.Post("/validate", validateToken)
}

var codeStore = make(map[string]string) // Armazenamento temporário (substitua por Redis em produção)

func login(c *fiber.Ctx) error {
	type LoginRequest struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	// Simulação de validação
	if req.Username != "leonardo" || req.Password != "12345" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	// Gerar código de 6 dígitos
	code, err := generateCode()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate code"})
	}

	// Armazenar código
	codeStore[req.Username] = code

	// Enviar e-mail
	fixedEmail := "pulseiqlapo@example.com" // Substitua pelo seu e-mail real
	err = sendEmail(fixedEmail, code)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   "Failed to send email",
			"details": err.Error(),
		})
	}

	return c.JSON(fiber.Map{"message": "Code sent to email"})
}

func verifyCode(c *fiber.Ctx) error {
	type VerifyRequest struct {
		Username string `json:"username"`
		Code     string `json:"code"`
	}

	var req VerifyRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	storedCode, exists := codeStore[req.Username]
	if !exists || storedCode != req.Code {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid code"})
	}

	// Gerar token JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": req.Username,
		"iat": time.Now().Unix(),
		"exp": time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte("chave-secreta-super-segura"))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate token"})
	}

	// Limpar código
	delete(codeStore, req.Username)

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

func generateCode() (string, error) {
	const digits = "0123456789"
	code := ""
	for i := 0; i < 6; i++ {
		n, err := rand.Int(rand.Reader, big.NewInt(int64(len(digits))))
		if err != nil {
			return "", err
		}
		code += string(digits[n.Int64()])
	}
	return code, nil
}

func sendEmail(to, code string) error {
	e := email.NewEmail()
	e.From = fmt.Sprintf("PulseIQ <%s>", os.Getenv("SMTP_USER"))
	e.To = []string{to}
	e.Subject = "Seu Código de Autenticação"
	e.Text = []byte(fmt.Sprintf("Seu código de autenticação é: %s", code))
	e.HTML = []byte(fmt.Sprintf("<strong>Seu código de autenticação é:</strong> %s", code))

	err := e.Send(
		fmt.Sprintf("%s:%s", os.Getenv("SMTP_HOST"), os.Getenv("SMTP_PORT")),
		smtp.PlainAuth("", os.Getenv("SMTP_USER"), os.Getenv("SMTP_PASS"), os.Getenv("SMTP_HOST")),
	)
	if err != nil {
		return fmt.Errorf("SMTP error: %w", err)
	}
	return nil
}