# Product Specification

## 概要

pnpm monorepo テンプレート。複数フロントエンドフレームワーク（Next.js、Astro、Vite）と共有パッケージ（@112ka/x、@112ka/x3、x-lib）を一元管理します。TypeScript Strict Mode、ESLint、Vitest などの標準設定が完備されており、即座に開発を開始できます。

## Key Features

- **pnpm workspace**: 複数アプリ・パッケージを一元管理、`workspace:*` で自動参照
- **プリセットアプリケーション**:
  - Next.js 16（App Router）: Tailwind CSS 4、shadcn/ui、Radix UI、View Transitions API
  - Astro: 静的サイト生成
  - Vite (Vanilla): シンプルな TypeScript アプリ
- **共有パッケージ**: @112ka/x（コアライブラリ）、@112ka/x3（3D関連）、x-lib（汎用）
- **開発環境**: TypeScript 5.9.3 Strict Mode、ESLint 9、Vitest、simple-git-hooks

## Design Philosophy

- **シンプルさ優先**: 必要最小限の依存関係、わかりやすいディレクトリ構造
- **開発体験重視**: 自動化、高速ビルド、即座のフィードバック
- **柔軟性確保**: 不要な部分は削除可能、拡張も容易
- **コスト意識**: テストは必要最小限、過度な抽象化を避ける- **シンプルさ優先**: 必要最小限の依存関係、わかりやすいディレクトリ構造
- **開発体験重視**: 自動化、高速ビルド、即座のフィードバック
- **柔軟性確保**: 不要な部分は削除可能、拡張も容易
- **コスト意識**: テストは必要最小限、過度な抽象化を避ける

## セットアップと開発開始

詳細は [CONTRIBUTING.md](./CONTRIBUTING.md) を参照してください。