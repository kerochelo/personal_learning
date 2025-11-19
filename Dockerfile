# ステージ1: フロントエンドビルド
FROM node:22-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install

COPY frontend .
RUN npm run build

# ステージ2: Goバイナリビルド
FROM golang:1.25-alpine AS go-builder

WORKDIR /app
COPY backend/go.mod ./
RUN go mod download

COPY backend .
RUN go mod tidy
RUN CGO_ENABLED=0 GOOS=linux go build -o /tmp/server cmd/main/main.go

# ステージ3: 実行イメージ
FROM alpine:3.21

RUN apk add --no-cache ca-certificates

WORKDIR /app

COPY --from=go-builder /tmp/server ./server
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 8080

CMD ["./server"]
