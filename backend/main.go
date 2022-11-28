package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-co-op/gocron"
	"github.com/joho/godotenv"

	"github.com/doublegrey/formiks/backend/api"
	"github.com/doublegrey/formiks/backend/driver"
	"github.com/doublegrey/formiks/backend/middlewares"
	"github.com/doublegrey/formiks/backend/middlewares/msal"
	"github.com/doublegrey/formiks/backend/sap"
)

func main() {
	cron := gocron.NewScheduler(time.UTC)
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

	go func() {
		// sap.FetchAccountLines()
		// driver.Conn.Mongo.Collection("submissions").Drop(context.TODO())
		// fmt.Println("account lines parsed...")
		// sap.CreateSubmissionsForAccountLines()
		// os.Exit(0)
		cron.Every(1).Day().At("03:00").Do(func() {
			sap.FetchAccountLines()
			sap.CreateSubmissionsForAccountLines()
		})
	}()

	go func() {
		for range time.NewTicker(5 * time.Hour).C {
			// we should clear active directory public key every 5 hours
			msal.PubKey = []byte{}
		}
	}()

	cron.StartAsync()
	r := gin.Default()
	middlewares.Setup(r)
	api.RegisterRoutes(r)

	r.Run(fmt.Sprintf(":%s", os.Getenv("PORT")))
}
