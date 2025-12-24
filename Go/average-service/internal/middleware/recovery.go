package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
)

func Recovery() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				log.Error().Interface("panic", err).Msg("Recoverado de pánico")
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": "error interno del servidor",
				})
				c.Abort()
			}
		}()
		c.Next()
	}
}