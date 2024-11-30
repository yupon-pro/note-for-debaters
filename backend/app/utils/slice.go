package utils

func Map[T any, M any](slice []T, mapper func(T) M) []M {
	result := make([]M, len(slice))
	for k, v := range slice {
		result[k] = mapper(v)
	}
	return result
}