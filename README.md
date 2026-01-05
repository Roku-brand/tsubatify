# Tsubatify

Spotify風音楽プレイヤー PWA

## 公開URL

https://roku-brand.github.io/tsubatify/

## 開発

### 環境構築

```bash
# 依存関係のインストール
npm ci
```

### 開発サーバーの起動

```bash
npm run dev
```

開発サーバーは http://localhost:5173 で起動します。

### コードのリント

```bash
npm run lint
```

### ビルド

```bash
npm run build
```

ビルド成果物は `dist/` フォルダに出力されます。

### ビルドのプレビュー

```bash
npm run preview
```

## デプロイ

このプロジェクトは GitHub Actions を使用して自動的に GitHub Pages にデプロイされます。

- `main` ブランチへのプッシュで自動デプロイが実行されます
- デプロイ設定は `.github/workflows/deploy.yml` に定義されています

### base path について

このアプリは GitHub Pages のサブパス `/tsubatify/` にホストされるため、`vite.config.ts` で `base: '/tsubatify/'` を設定しています。これにより、ビルド時に生成されるアセットのパスが正しく解決されます。

## 技術スタック

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router (HashRouter)
- Zustand (状態管理)
- PWA (vite-plugin-pwa)

## トラブルシューティング

### GitHub Pages で白画面が表示される / 404エラー

- `npm run build` でビルドが正常に完了しているか確認してください
- `dist/index.html` のスクリプトパスが `/tsubatify/` から始まっていることを確認してください
- ブラウザのキャッシュをクリアしてから再読み込みしてください

### ローカルでビルドをテストする

```bash
npm run build
npm run preview
```

プレビューサーバーは http://localhost:4173/tsubatify/ で起動します。
