#!/bin/bash


# 启动 Go 服务
cd server
nohup go run main.go &

# 返回到项目根目录
cd ..






# # ngrok http http://localhost:8090


# # 启动 ngrok
# ngrok http http://localhost:8090 > /dev/null &
# sleep 2  # 等待 ngrok 启动

# # 提取域名
# DOMAIN=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url' | sed 's|https://||')

# # 替换 .env 中的 DOMAIN
# sed -i '' "s|^DOMAIN=.*|DOMAIN=$DOMAIN|" .env

# # 确保 .env 文件格式正确
# echo "Updated .env with DOMAIN=$DOMAIN"




# curl 'https://api.telegram.org/bot8122519214:AAFAaxeUUdTVRBe7PHdfsmjZmcfWNVaS1-4/setWebhook' \
#   --data-raw '{"url":"https://b104-128-1-33-186.ngrok-free.app"}'

# curl 'https://api.telegram.org/bot8122519214:AAFAaxeUUdTVRBe7PHdfsmjZmcfWNVaS1-4/getWebhookInfo'

# 停止 ngrok
ngrok config add-authtoken 2tARqpTaHY17LqWU6gBGRKUBiwm_HBfPTMBCyKy318UhBt42


pkill ngrok

# 启动 ngrok
nohup ngrok http http://localhost:8090 > /dev/null &
sleep 2  # 等待 ngrok 启动

# 提取域名
DOMAIN=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url' | sed 's|https://||')

# 替换 .env 中的 DOMAIN
sed -i '' "s|^DOMAIN=.*|DOMAIN=$DOMAIN|" .env

# 输出更新后的信息
echo "Updated .env with DOMAIN=$DOMAIN"

