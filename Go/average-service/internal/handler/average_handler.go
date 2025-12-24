package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/rs/zerolog/log"
	"github.com/tu-usuario/average-service/internal/service"
)

type Request struct {
	Numbers []float64 `json:"numbers" binding:"required,gt=0" validate:"min=1"`
}

type Response struct {
	Average float64 `json:"average,omitempty"`
	Error   string  `json:"error,omitempty"`
}

type AverageHandler struct {
	service *service.AverageService
	validate *validator.Validate
}

func NewAverageHandler(service *service.AverageService) *AverageHandler {
	return &AverageHandler{
		service:  service,
		validate: validator.New(),
	}
}

func (h *AverageHandler) Calculate(c *gin.Context) {
	var req Request

	if err := c.ShouldBindJSON(&req); err != nil {
		log.Info().Err(err).Msg("Solicitud JSON inválida")
		c.JSON(http.StatusBadRequest, Response{Error: "JSON inválido o campo 'numbers' faltante"})
		return
	}

	if err := h.validate.Struct(req); err != nil {
		log.Info().Err(err).Interface("request", req).Msg("Validación fallida")
		c.JSON(http.StatusBadRequest, Response{Error: "El arreglo debe tener al menos un número"})
		return
	}

	average, err := h.service.Calculate(req.Numbers)
	if err != nil {
		log.Warn().Err(err).Interface("numbers", req.Numbers).Msg("Error de lógica de negocio")
		c.JSON(http.StatusBadRequest, Response{Error: err.Error()})
		return
	}

	log.Info().
		Float64("average", average).
		Int("count", len(req.Numbers)).
		Msg("Promedio calculado exitosamente")

	c.JSON(http.StatusOK, Response{Average: average})
}

func (h *AverageHandler) Health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "healthy", "service": "average-service"})
}