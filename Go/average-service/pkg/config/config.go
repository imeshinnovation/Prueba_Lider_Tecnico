package config

import (
	"os"

	"github.com/joho/godotenv"
	"github.com/rs/zerolog/log"
)

type Config struct {
	Port     string
	Env      string
	LogLevel string
}

func Load() *Config {
	// Cargar .env en desarrollo
	if os.Getenv("ENV") != "production" {
		if err := godotenv.Load(); err != nil {
			log.Warn().Err(err).Msg("No .env file found")
		}
	}

	return &Config{
		Port:     getEnv("PORT", "3801"),
		Env:      getEnv("ENV", "development"),
		LogLevel: getEnv("LOG_LEVEL", "info"),
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}