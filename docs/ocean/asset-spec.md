# SWIPE EARTH: OCEAN 素材規格

## ディレクトリ

```text
public/ocean/
  backgrounds/
  creatures/
    real/
    legend/
  effects/
  ui/
data/ocean/
scripts/
```

既存素材は段階的に移行する。新規素材は上記へ追加する。

## 生物素材

### 推奨形式

- 制作マスター：透過PNG
- 本番配信：透過WebP
- 透過が不要な背景：WebPまたはAVIF
- SVGはUIアイコンと単純な図形に限定

### 推奨寸法

| 用途 | 長辺 | 目安ファイルサイズ |
|---|---:|---:|
| 小型・群生 | 384〜640px | 20〜90KB |
| 中型 | 640〜960px | 40〜160KB |
| 大型 | 960〜1600px | 80〜280KB |
| UMA・巨大影 | 1200〜2000px | 100〜350KB |

解像度だけでなく、スマホ表示時の識別性で採否を決める。

### 透過と余白

- アルファチャンネル必須
- 完全透明画像は禁止
- 外周の余白は原則5〜12%
- 触手・尾・ひれがキャンバス端で不自然に切れないこと
- 画像全体に対する実描画領域が20%未満の素材は禁止

### 向き

- 基本素材は左向き、または自然な横向き
- CSSの左右反転を許可するが、文字・左右非対称の器官が不自然になる種類では反転禁止
- 正面向きはアクセントとして限定使用

### 光と輪郭

- 光源は原則上方または左上
- 深海生物の発光は素材内に含めてもよい
- 外側の強い白縁取りは禁止
- 小さく表示した際に輪郭が背景へ溶けすぎないこと

## 背景素材

- 基準サイズ：1440 × 2560px以上
- スマホ縦長を基準とする
- 生物を置く中央領域は情報量を抑える
- 縦スクロールで隣接ゾーンと接続可能な色・明度にする
- 背景だけでゾーンの違いが認識できること

背景を1枚絵だけに依存せず、必要に応じて以下へ分割する。

- back：遠景・水の色
- mid：岩、海底、遠景シルエット
- front：前景の海藻、岩、霧

## FX素材

対象：泡、光条、浮遊粒子、発光粒子、霧、海底の影。

- ループが目立たないこと
- 同じパターンを全ゾーンへ使い回さない
- 画面全体を覆う巨大PNGを乱用しない
- CSSアニメーションは位置、透明度、拡大縮小の補助に限定する

## 命名規則

英小文字とハイフンのみ。

```text
sea-turtle.webp
giant-squid.webp
vampire-squid.webp
hadal-shadow.webp
bg-midnight-back.webp
fx-midnight-particles.webp
```

差分がある場合：

```text
sardine-school-a.webp
sardine-school-b.webp
giant-squid-distant.webp
giant-squid-foreground.webp
```

## 生物データ必須項目

```json
{
  "id": "vampire-squid",
  "nameEn": "Vampire Squid",
  "nameJa": "コウモリダコ",
  "classification": "real",
  "zone": "midnight",
  "experienceDepthM": 850,
  "observedDepthMinM": null,
  "observedDepthMaxM": null,
  "sourceUrls": [],
  "researchStatus": "pending",
  "asset": "/ocean/creatures/real/vampire-squid.webp",
  "role": "medium",
  "groupMin": 1,
  "groupMax": 2,
  "tapEnabled": true
}
```

`researchStatus` が `verified` でない生物は、科学的事実として本番解説へ出さない。

## 自動検査

追加素材は最低限、以下を検査する。

- ファイル参照が存在する
- 拡張子が許可対象
- ファイルサイズが0ではない
- SVG内に外部画像参照がない
- ラスタ画像をデコードできる
- 幅と高さが規格内
- アルファ画像が全透明ではない
- JSONのIDとファイル名が対応する
- `real` 生物の研究状態が明示されている

## 採用チェック

- [ ] 64〜120px程度の画面表示でも種類が判別できる
- [ ] 同ゾーンの他素材と光・質感が揃っている
- [ ] 背景透過が正しい
- [ ] 不自然な切断や生成破綻がない
- [ ] ファイル名とデータIDが一致する
- [ ] 画像検査に合格している
- [ ] 実在生物は調査済みである
