package utils

import "time"


func IsExpired(updatedAt time.Time, duration time.Duration) bool {
	oneHourAgo := time.Now().Add(duration)
	return updatedAt.Before(oneHourAgo)
}