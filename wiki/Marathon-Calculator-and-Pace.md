# 📊 Marathon Calculator & Pace Guide

The standout interactive feature of the **Marvel Multiverse Roadmap** is its **Sticky HUD Progress Rail**. This guide explains the mathematics, formulas, and user controls powering your marathon pacing.

---

## 🎯 Target Date: December 18, 2026

All marathon pace calculations are dynamically anchored to the historic global premiere date of **Avengers: Doomsday**:
* **Anchor Date**: `2026-12-18T00:00:00`
* **Target Milestone**: Title #121

---

## 📐 The Pacing Formulas

### 1. Remaining Watch Time (`LEFT`)
The total duration of all titles that have **neither been marked as Watched nor Skipped**:

$$\text{Remaining Minutes} = \sum_{i \notin \text{Watched} \cup \text{Skipped}} \text{runtime\_mins}_i$$

The remaining watch time is displayed in hours and minutes (e.g. `430h 24m`).

### 2. Daily Watch Pace (`PACE`)
The daily viewing commitment required to reach the finish line by premiere day:

$$\text{Days Remaining} = \max\left(1, \left\lceil \frac{\text{Doomsday Date} - \text{Current Date}}{86,400,000 \text{ ms}} \right\rceil\right)$$

$$\text{Pace (hours/day)} = \frac{\text{Remaining Hours}}{\text{Days Remaining}}$$

* As time elapses toward December 2026, the required daily pace naturally increases if titles remain unwatched.
* Marking titles as **Watched** or **Skipped** immediately recalculates and lowers your daily required pace.

### 3. Skipped Watch Time (`SKIPPED`)
Not every fan wants or has time to rewatch all 16 seasons of the Defenders saga or secondary Legacy films.
* Clicking **Skip** on any title removes its runtime from your remaining obligation (`LEFT`) and relieves your daily pace (`PACE`).
* The **SKIPPED** counter tracks exactly how much viewing time you have bypassed (e.g. `233h 32m`).
* Unskipping a title instantly restores its runtime into `LEFT` and recalibrates your `PACE`.

### 4. Progress Percentage (`DONE`)
Calculated based on watched title count against the 121 total titles:

$$\text{Completion Percentage} = \text{round}\left( \frac{|\text{Watched}|}{121} \times 100 \right)$$

---

## 💾 LocalStorage Persistence

Every toggle and rating is stored privately in your browser's local storage under:
* `marvel_roadmap_watched_v1`: Set of watched title IDs.
* `marvel_roadmap_skipped_v1`: Set of skipped title IDs.
* `marvel_roadmap_ratings_v1`: Map of personal star ratings (`{ [id]: rating }`).

### One-Click Reset
If you want to start fresh or wipe test progress, click **Reset All Progress** in the website footer.
