# 📚 Learning App

## 🚀 スタック

- **バックエンド**: Go 1.25 + Echo v4
- **フロント**: React 19.1 + TypeScript + Tailwind CSS
- **データベース**: PostgreSQL 18.1
- **コンテナ**: Docker + Docker Compose

## 📋 環境

- Docker >= 20.10（Docker Compose V2 含む）

## 🛠️ セットアップ & 起動

### 前提条件

- Docker と Docker Compose がインストールされていること
- ポート 3000 と 5432 が使用可能であること

### 1. リポジトリクローン

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/learning-app.git

# プロジェクトディレクトリに移動
cd learning-app
```

**現在のディレクトリ**: `learning-app/` (プロジェクトルート)

### 2. 環境変数設定

```bash
# プロジェクトルートで実行
cp .env.example .env
```

**現在のディレクトリ**: `learning-app/`

必要に応じて `.env` ファイルを編集してください（通常はデフォルト値で問題ありません）。

### 3. Docker Compose で起動

```bash
# プロジェクトルートで実行
docker compose up -d
```

**現在のディレクトリ**: `learning-app/`

初回起動時は以下の処理が自動的に実行されます（5〜10分程度かかります）：
1. フロントエンドのビルド（npm install & npm run build）
2. バックエンドのビルド（Go モジュールダウンロード & ビルド）
3. PostgreSQL コンテナの起動
4. データベーススキーマの自動作成

**起動確認**:
```bash
# プロジェクトルートで実行
docker compose ps
```

以下のように2つのコンテナが `running` 状態になっていればOK:
```
NAME                  STATUS
learning-app          running
learning-postgres     running
```

### 4. ブラウザでアクセス

```
http://localhost:3000
```

アプリケーションのダッシュボードが表示されれば起動成功です。

## 📝 API エンドポイント

| メソッド | パス | 説明 |
|---------|------|------|
| GET | /health | ヘルスチェック |
| POST | /api/analyze | テキスト分析 |
| POST | /api/analyze/weekly | 週単位分析 |
| GET | /api/records?user_id=xxx | 記録一覧 |
| POST | /api/records | 記録作成 |
| PUT | /api/records/:id | 記録更新 |
| DELETE | /api/records/:id | 記録削除 |

## 🧪 テスト

**注意**: 以下のコマンドは、Docker Composeでアプリケーションが起動している状態で実行してください。

### ヘルスチェック

```bash
curl http://localhost:3000/health
```

**期待される応答**:
```json
{
  "status": "ok",
  "time": "2025-11-19 15:30:00"
}
```

### 記録作成テスト

```bash
curl -X POST http://localhost:3000/api/records \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "study_time": 60,
    "topic": "英語",
    "mood": 7,
    "quality": "high"
  }'
```

**期待される応答**:
```json
{
  "id": 1,
  "user_id": "user123",
  "study_time": 60,
  "topic": "英語",
  "mood": 7,
  "quality": "high",
  "created_at": "2025-11-19T15:30:00Z",
  "updated_at": "2025-11-19T15:30:00Z"
}
```

### 記録一覧取得

```bash
curl http://localhost:3000/api/records?user_id=user123
```

**期待される応答**:
```json
[
  {
    "id": 1,
    "user_id": "user123",
    "study_time": 60,
    "topic": "英語",
    "mood": 7,
    "quality": "high",
    "created_at": "2025-11-19T15:30:00Z",
    "updated_at": "2025-11-19T15:30:00Z"
  }
]
```

### テキスト分析テスト

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "text": "今日は英語を60分勉強しました"
  }'
```

**期待される応答**:
```json
{
  "study_time": 60,
  "topic": "英語",
  "mood": 5,
  "quality": "medium"
}
```

## 📊 データベース

PostgreSQL は Docker コンテナで自動起動。

- **ホスト**: postgres
- **ポート**: 5432
- **ユーザー**: postgres
- **パスワード**: postgres
- **データベース**: learning

### テーブル構造

#### learning_records

```sql
CREATE TABLE learning_records (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  study_time INT NOT NULL DEFAULT 0,
  topic VARCHAR(500) NOT NULL,
  mood INT NOT NULL DEFAULT 5 CHECK (mood >= 0 AND mood <= 10),
  quality VARCHAR(50) NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX idx_learning_records_user_id ON learning_records(user_id);
CREATE INDEX idx_learning_records_created_at ON learning_records(created_at DESC);
```

#### users（将来拡張用）

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_user_id ON users(user_id);
```

### データベースへの直接接続

```bash
# プロジェクトルート (learning-app/) で実行
docker compose exec postgres psql -U postgres -d learning
```

**現在のディレクトリ**: `learning-app/`

よく使うコマンド:
```sql
-- テーブル一覧
\dt

-- テーブル構造確認
\d learning_records

-- レコード確認
SELECT * FROM learning_records;

-- 終了
\q
```

## 🔧 開発コマンド

### Docker Compose 操作

**注意**: 以下のコマンドは全て**プロジェクトルート** (`learning-app/`) で実行してください。

```bash
# コンテナ起動（バックグラウンド）
# 現在のディレクトリ: learning-app/
docker compose up -d

# コンテナ起動（フォアグラウンド・ログ表示）
# 現在のディレクトリ: learning-app/
docker compose up

# コンテナ停止
# 現在のディレクトリ: learning-app/
docker compose down

# コンテナ停止 + ボリューム削除（DBデータも削除）
# 現在のディレクトリ: learning-app/
docker compose down -v

# 再ビルド
# 現在のディレクトリ: learning-app/
docker compose build

# 再ビルド + 起動
# 現在のディレクトリ: learning-app/
docker compose up -d --build

# コンテナステータス確認
# 現在のディレクトリ: learning-app/
docker compose ps

# ログ確認（全サービス）
# 現在のディレクトリ: learning-app/
docker compose logs -f

# ログ確認（特定サービス）
# 現在のディレクトリ: learning-app/
docker compose logs -f app
docker compose logs -f postgres
```

### ローカルで Go サーバー起動（開発用）

**前提条件**: PostgreSQLが別途起動している必要があります（Docker ComposeのPostgreSQLコンテナでも可）

```bash
# プロジェクトルートから backend ディレクトリに移動
# 現在のディレクトリ: learning-app/
cd backend

# 現在のディレクトリ: learning-app/backend/

# 環境変数設定
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=postgres
export DB_PASSWORD=postgres
export DB_NAME=learning
export DB_SSLMODE=disable

# 依存関係ダウンロード
# 現在のディレクトリ: learning-app/backend/
go mod download

# サーバー起動
# 現在のディレクトリ: learning-app/backend/
go run cmd/main/main.go
```

サーバーは `http://localhost:8080` で起動します。

**終了したらプロジェクトルートに戻る**:
```bash
# 現在のディレクトリ: learning-app/backend/
cd ..
# 現在のディレクトリ: learning-app/
```

### ローカルで React 開発（開発用）

```bash
# プロジェクトルートから frontend ディレクトリに移動
# 現在のディレクトリ: learning-app/
cd frontend

# 現在のディレクトリ: learning-app/frontend/

# 依存関係インストール
# 現在のディレクトリ: learning-app/frontend/
npm install

# 開発サーバー起動（ホットリロード有効）
# 現在のディレクトリ: learning-app/frontend/
npm run dev

# ビルド
# 現在のディレクトリ: learning-app/frontend/
npm run build

# ビルド結果のプレビュー
# 現在のディレクトリ: learning-app/frontend/
npm run preview
```

開発サーバーは通常 `http://localhost:5173` で起動します。

**終了したらプロジェクトルートに戻る**:
```bash
# 現在のディレクトリ: learning-app/frontend/
cd ..
# 現在のディレクトリ: learning-app/
```

### Go コマンド

```bash
# プロジェクトルートから backend ディレクトリに移動
# 現在のディレクトリ: learning-app/
cd backend

# 現在のディレクトリ: learning-app/backend/

# 依存関係の整理
# 現在のディレクトリ: learning-app/backend/
go mod tidy

# 依存関係の確認
# 現在のディレクトリ: learning-app/backend/
go mod verify

# テスト実行（実装後）
# 現在のディレクトリ: learning-app/backend/
go test ./...

# ビルド
# 現在のディレクトリ: learning-app/backend/
go build -o bin/server cmd/main/main.go

# バイナリ実行
# 現在のディレクトリ: learning-app/backend/
./bin/server

# プロジェクトルートに戻る
# 現在のディレクトリ: learning-app/backend/
cd ..
# 現在のディレクトリ: learning-app/
```

## 📁 ディレクトリ構造

```
learning-app/
│
├── backend/
│   ├── cmd/main/
│   │   └── main.go              # Go エントリーポイント
│   │
│   ├── internal/
│   │   ├── config/
│   │   │   └── config.go        # 設定管理（DB接続含む）
│   │   │
│   │   ├── db/
│   │   │   ├── db.go            # PostgreSQL クライアント
│   │   │   ├── models.go        # DB モデル定義
│   │   │   └── migrations.go    # スキーマ管理
│   │   │
│   │   ├── handler/
│   │   │   ├── handler.go       # ハンドラ登録
│   │   │   ├── health.go        # ヘルスチェック
│   │   │   ├── analyze.go       # 分析API（モック）
│   │   │   ├── records.go       # 記録CRUD API（DB連携）
│   │   │   └── webhook.go       # LINE webhook（モック）
│   │   │
│   │   ├── service/
│   │   │   ├── types.go         # 共有型定義
│   │   │   ├── analyzer.go      # 分析ロジック（モック）
│   │   │   └── line.go          # LINE ロジック（モック）
│   │   │
│   │   └── middleware/
│   │       └── middleware.go    # CORS等ミドルウェア
│   │
│   ├── go.mod                   # Go モジュール定義
│   ├── go.sum                   # Go 依存関係ロック
│   ├── Dockerfile               # Go ビルド用
│   └── .env.example             # 環境変数テンプレート
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx    # メインダッシュボード
│   │   │   ├── RecordForm.tsx   # 記録入力フォーム
│   │   │   └── Analysis.tsx     # 分析表示
│   │   │
│   │   ├── lib/
│   │   │   ├── api.ts           # API クライアント
│   │   │   └── types.ts         # TypeScript 型定義
│   │   │
│   │   ├── App.tsx              # ルートコンポーネント
│   │   ├── main.tsx             # Vite エントリー
│   │   └── index.css            # グローバルスタイル
│   │
│   ├── index.html               # HTML テンプレート
│   ├── vite.config.ts           # Vite 設定
│   ├── tsconfig.json            # TypeScript 設定
│   ├── tailwind.config.js       # Tailwind CSS 設定
│   ├── package.json             # npm パッケージ定義
│   └── .env.example             # 環境変数テンプレート
│
├── docker-compose.yml           # Docker Compose 設定（開発用）
├── Dockerfile                   # マルチステージビルド（本番用）
├── .env.example                 # ルート環境変数テンプレート
├── .gitignore                   # Git 除外ファイル
├── README.md                    # このファイル
├── SPEC.md                      # 仕様書
└── IMPLEMENTATION_LOG.md        # 実装記録
```

## 📈 今後の拡張予定

- [ ] Gemini API 統合（AI 分析）
- [ ] LINE Bot 統合（チャット記録）
- [ ] ユーザー認証実装
- [ ] マルチユーザー対応
- [ ] 本番環境デプロイ (Render)

## 📞 トラブルシューティング

### PostgreSQL 接続失敗

**症状**: アプリケーションが起動しない、DB接続エラー

**確認方法**:
```bash
# プロジェクトルート (learning-app/) で実行

# コンテナの状態確認
docker compose ps

# PostgreSQLのログ確認
docker compose logs postgres

# PostgreSQLのヘルスチェック
docker compose exec postgres pg_isready -U postgres
```

**解決方法**:
```bash
# プロジェクトルート (learning-app/) で実行

# 1. PostgreSQLコンテナが起動しているか確認
docker compose ps

# 2. 環境変数が正しく設定されているか確認
cat .env

# 3. コンテナを再起動
docker compose restart postgres
```

### ポートが使用中

**症状**: `bind: address already in use`

**確認方法**:
```bash
# ポート使用状況確認（macOS/Linux）
lsof -i :3000
lsof -i :5432

# ポート使用状況確認（Windows）
netstat -ano | findstr :3000
netstat -ano | findstr :5432
```

**解決方法**:

1. 使用中のプロセスを停止
2. または `docker-compose.yml` でポート番号を変更

プロジェクトルート (`learning-app/`) の `docker-compose.yml` を編集:

```yaml
services:
  app:
    ports:
      - "3001:8080"  # 外部 3001 → 内部 8080

  postgres:
    ports:
      - "5433:5432"  # 外部 5433 → 内部 5432
```

編集後、再起動:
```bash
# プロジェクトルート (learning-app/) で実行
docker compose down
docker compose up -d
```

### フロントエンドビルドエラー

**症状**: npm install や npm run build が失敗

**確認方法**:
```bash
# プロジェクトルート (learning-app/) で実行
docker compose logs app
```

**解決方法**:
```bash
# プロジェクトルート (learning-app/) で実行

# 1. Node.jsバージョン確認（18以上必要）
docker compose exec app node --version

# 2. package.jsonの確認
cat frontend/package.json

# 3. 再ビルド（キャッシュなし）
docker compose build --no-cache
docker compose up -d
```

### データベースが初期化されない

**症状**: テーブルが作成されていない

**確認方法**:
```bash
# プロジェクトルート (learning-app/) で実行

# データベースに接続してテーブル確認
docker compose exec postgres psql -U postgres -d learning -c "\dt"
```

**解決方法**:
```bash
# プロジェクトルート (learning-app/) で実行

# 1. ボリュームを削除して再起動
docker compose down -v
docker compose up -d

# 2. アプリケーションログでスキーマ初期化を確認
docker compose logs app | grep "Schema initialized"
```

### コンテナが起動しない

**症状**: docker compose up でエラー

**確認方法**:
```bash
# Dockerのバージョン確認
docker --version
docker compose version

# Dockerデーモンの状態確認
docker info
```

**解決方法**:
```bash
# 1. Dockerデーモンが起動しているか確認
docker info

# 2. Docker Composeのバージョン確認
docker compose version

# 3. ディスク容量を確認
df -h

# 4. 既存のコンテナ・イメージを削除
# プロジェクトルート (learning-app/) で実行
docker compose down
docker system prune -a
```

### API が応答しない

**症状**: curlやブラウザからAPIにアクセスできない

**確認方法**:
```bash
# プロジェクトルート (learning-app/) で実行

# コンテナの状態確認
docker compose ps

# アプリケーションログ確認
docker compose logs app

# ヘルスチェック
curl http://localhost:3000/health
```

**解決方法**:
```bash
# プロジェクトルート (learning-app/) で実行

# 1. コンテナが起動しているか確認
docker compose ps

# 2. ヘルスチェックが成功するか確認
curl http://localhost:3000/health

# 3. コンテナを再起動
docker compose restart app

# 4. ログを確認してエラーを特定
docker compose logs -f app
```

## 🔒 セキュリティに関する注意

### 本番環境への移行時の注意点

1. **環境変数の保護**
   - `.env` ファイルを Git にコミットしない
   - 本番環境では強力なパスワードを使用

2. **データベース**
   - SSL/TLS を有効化（`DB_SSLMODE=require`）
   - パスワードを複雑なものに変更

3. **CORS設定**
   - 本番環境では特定のオリジンのみ許可
   - `AllowOrigins: []string{"*"}` を変更

4. **認証・認可**
   - ユーザー認証の実装
   - APIキーの実装

## 📄 ライセンス

MIT

## 👤 作成者

kerochelo（Takahiro Kanno）

## 🤝 コントリビューション

現在、個人プロジェクトのため外部からのコントリビューションは受け付けていません。

## 📚 参考リンク

- [Go Echo Framework](https://echo.labstack.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
