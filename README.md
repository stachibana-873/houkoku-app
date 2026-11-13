# 写真報告書メーカー

現場で撮った写真を選んで、テンプレートに並べて、コメントを書くだけで施工報告書が作れる無料のWebアプリです。

- 公開ページ: https://stachibana-873.github.io/houkoku-app/
- 使い方: https://stachibana-873.github.io/houkoku-app/manual.html
- 写真や入力内容は端末の中だけで処理し、外部には送信しません
- 一度開けば、電波がない場所でも使えます（ホーム画面に追加がおすすめ）

## ファイル
- `index.html` … アプリ本体
- `manual.html` … 使い方マニュアル
- `sw.js` / `manifest.webmanifest` / `icons/` … オフラインで使うため・ホーム画面に追加するため
- `vendor/` … Excel書き出し（ExcelJS 4.4.0, MIT）とPDF読み込み（pdf.js 3.11.174, Apache-2.0）の部品

アプリを更新したら、`sw.js` の `VERSION` を変えてください（利用者の端末に新しい版が届くようにするため）。
