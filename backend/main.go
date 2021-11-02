package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/doublegrey/formiks/backend/api"
	"github.com/doublegrey/formiks/backend/driver"
	"github.com/doublegrey/formiks/backend/middlewares"
	"github.com/doublegrey/formiks/backend/middlewares/msal"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	go func() {
		for range time.NewTicker(5 * time.Hour).C {
			// we should clear active directory public key every 5 hours
			msal.PubKey = []byte{}
		}
	}()
	if len(os.Getenv("DEV")) > 0 {
		err := godotenv.Load()
		if err != nil {
			log.Fatalf("Failed to read .env file: %v\n", err)
		}
	}
	err := driver.Connect()
	if err != nil {
		log.Fatalf("Failed to initialize database connection: %v\n", err)
	}
	r := gin.Default()
	middlewares.Setup(r)
	api.RegisterRoutes(r)
	r.Run(fmt.Sprintf(":%s", os.Getenv("PORT")))
}
