# Care Check Official Ver2.5 GAS Sync

## 内容
全端末連動版です。

## できること
- PC・iPhoneで同じデータを共有
- Googleスプレッドシートに保存
- 10秒ごとに自動再同期
- 職員選択モード
- 記録者名・記録時刻を自動保存
- 食事・水分・服薬
- 食事は10割→0割
- お茶200mL、味噌汁125mLの簡単チェック
- 排泄管理
- 排尿6時間アラート
- 排便少量3回＝中量1回
- バイタル・体重管理
- LINE WORKS通知土台

## 1. React側
```bash
npm install
npm run dev
```

## 2. Google Apps Script設定
1. Googleスプレッドシートを新規作成
2. 拡張機能 → Apps Script
3. `gas/Code.gs` の中身を貼り付け
4. デプロイ → 新しいデプロイ
5. 種類：ウェブアプリ
6. 実行ユーザー：自分
7. アクセス：全員
8. 発行されたURLをコピー

## 3. .env作成
`.env.example` をコピーして `.env` を作成

```text
VITE_GAS_URL=GASのウェブアプリURL
VITE_LINEWORKS_WEBHOOK_URL=
```

## 4. 再起動
```bash
npm run dev
```

## 5. Vercel公開
Vercelの環境変数にも `VITE_GAS_URL` を登録してください。

```bash
npm run build
git add .
git commit -m "Care Check GAS sync"
git push
```
