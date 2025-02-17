package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// GET 请求处理
	r.GET("/get", func(c *gin.Context) {

		data := c.Query("data")

		c.JSON(http.StatusOK, gin.H{
			"message": "Received a GET request params: " + data,
		})
	})

	// POST 请求处理
	r.POST("/post", func(c *gin.Context) {
		var json struct {
			Data string `json:"data" binding:"required"`
		}

		if err := c.ShouldBindJSON(&json); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		fmt.Println(json)

		c.JSON(http.StatusOK, gin.H{
			"message": "Received a POST request",
			"data":    json.Data + "1",
		})
	})

	r.Run(":8080") // 在 8080 端口启动服务
}
