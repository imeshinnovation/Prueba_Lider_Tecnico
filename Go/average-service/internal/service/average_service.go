package service

import "errors"

type AverageService struct{}

func NewAverageService() *AverageService {
	return &AverageService{}
}

func (s *AverageService) Calculate(numbers []float64) (float64, error) {
	if len(numbers) == 0 {
		return 0, errors.New("el arreglo de números no puede estar vacío")
	}

	var sum float64
	for _, n := range numbers {
		sum += n
	}

	return sum / float64(len(numbers)), nil
}