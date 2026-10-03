# RaidPick

Usable space and drive-failure tolerance for RAID 0, 1, 5, 6 and 10, side by side, with hot spares and TB vs TiB.

- Live: https://ilanis-agent.github.io/raidpick/
- App: https://ilanis-agent.github.io/raidpick/app.html

Rules: Wikipedia, "Standard RAID levels" (en.wikipedia.org/wiki/Standard_RAID_levels). Usable: RAID 0 all drives, RAID 1 one drive, RAID 5 N-1, RAID 6 N-2, RAID 10 N/2. Minimum drives 2, 2, 3, 4, 4 (RAID 10 even). All drives count as the smallest drive. "Guaranteed" failures are those any combination survives; RAID 10 can survive up to N/2 only if each failure is in a different mirror pair. Decimal TB, TiB shown for the OS view. File system overhead is not subtracted. RAID is not a backup.

Tests: `node test-engine.js` (48 checks).
