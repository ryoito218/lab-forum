# 研究室掲示板

## 🧪 開発環境での実行方法
```bash
docker-compose up --build -d
```

---

## 🚀 本番環境での実行方法

```bash
docker compose -f docker-compose.yml up --build -d
```
---
## 管理者ユーザーの作成
```bash
docker compose exec backend python -m app.commands.create_admin
```
---
## ベクトル化（RAG 用の埋め込み登録）

### 実行（Docker）
#### 全件ベクトル化
```bash
docker compose exec backend python -m app.commands.rag_ingest --mode all
```
#### 差分ベクトル化
```bash
docker compose exec backend python -m app.commands.rag_ingest --mode changed
```