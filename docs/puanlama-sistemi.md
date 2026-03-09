# Puanlama Sistemi ve Liderlik Mantığı

Bu doküman, platformdaki puanlamanın tamamen oyun bazlı (per-game) modele geçirilmiş halini açıklar.

## Mimari Özeti

- Her oyun kendi skor algoritmasını kullanır (`scoreService`).
- Skorlar iki katmanda tutulur:
  - `game_stats`: kullanıcı + oyun bazlı kümülatif istatistik (high score, best score, streak vb.).
  - `game_score_events`: her oyun bitişi için immutable event kaydı (weekly leaderboard kaynağı).
- Global profil puanı (`profiles.total_score`) leaderboard akışlarında kullanılmaz.

## Veritabanı Tabloları

## `game_stats`

Kullanıcının oyun bazlı özet istatistiğini tutar.

- `played`: oynanan toplam oyun
- `won`: kazanılan oyun
- `best_score`: oyuna özel en iyi metrik
  - Wordle/Adam Asmaca: düşük değer daha iyi
  - Boggle/Kelime Arama: yüksek değer daha iyi
- `high_score`: puan bazında en yüksek skor
- `current_streak`, `max_streak`: seri metrikleri

## `game_score_events`

Haftalık sıralama için oyun sonu event kaydı.

- `id uuid pk`
- `user_id uuid`
- `game_name text`
- `score integer (>= 0)`
- `won boolean`
- `played_at timestamptz`
- `metadata jsonb`

RLS:
- `SELECT`: açık (`using true`) leaderboard okunabilirliği için
- `INSERT`: sadece event sahibi (`auth.uid() = user_id`)
- `UPDATE/DELETE`: policy yok (immutable event yaklaşımı)

## Leaderboard Dönemleri

Liderlik tablosu her oyun için bağımsızdır ve iki dönemde çalışır:

1. `weekly`
   - Kaynak: `game_score_events`
   - Aralık: mevcut hafta (UTC pazartesi başlangıcı)
   - Metrik: kullanıcı bazında `SUM(score)`

2. `all_time`
   - Kaynak: `game_stats`
   - Metrik: `high_score`

Not: Global `total_score`, `total_wins`, `best_streak` akışları kaldırılmıştır.

## Profil ve UI Metrikleri

Profil ekranı global puan yerine kariyer özeti gösterir:

- `{ game_name, high_score, level }[]`
- Örnek: `Wordle: 1200`, `Kelime Arama: 850`

`GameStatsTab` metrik ayrımı:

- `En Yüksek Puan` = `high_score`
- `Oyuna Özel En İyi` = `best_score`

## Oyun Sonu Veri Akışı

1. Oyun kendi algoritmasıyla `calculatedScore` üretir.
2. `scoreService.saveGameResult(...)` çağrılır.
3. `game_stats` kaydı insert/update edilir.
4. `game_score_events` tablosuna event insert edilir.
5. UI tarafında leaderboard tekrar fetch edilerek anlık sıralama güncellenir.
