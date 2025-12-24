package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"github.com/tu-usuario/average-service/internal/handler"
	"github.com/tu-usuario/average-service/internal/middleware"
	"github.com/tu-usuario/average-service/internal/service"
	"github.com/tu-usuario/average-service/pkg/config"
)

func main() {
	cfg := config.Load()

	// Configurar logger
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	if cfg.Env == "development" {
		gin.SetMode(gin.DebugMode)
		log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
	} else {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()
	r.Use(middleware.Recovery())
	r.Use(gin.Logger())

	averageService := service.NewAverageService()
	averageHandler := handler.NewAverageHandler(averageService)

	api := r.Group("/api/v1")
	{
		api.POST("/average", averageHandler.Calculate)
		api.GET("/health", averageHandler.Health)
	}

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "El Servicio de Promedio está listo para producción")
	})

	addr := fmt.Sprintf(":%s", cfg.Port)
	log.Info().
		Str("env", cfg.Env).
		Str("port", cfg.Port).
		Msg("Iniciando el servidor")

	if err := r.Run(addr); err != nil {
		log.Fatal().Err(err).Msg("Error al iniciar el servidor")
	}
}
