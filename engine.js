(function (root) {
  var LEVELS = {
    r0: { label: 'RAID 0 (striping)', min: 2 },
    r1: { label: 'RAID 1 (mirror)', min: 2 },
    r5: { label: 'RAID 5 (single parity)', min: 3 },
    r6: { label: 'RAID 6 (double parity)', min: 4 },
    r10: { label: 'RAID 10 (striped mirrors)', min: 4 }
  };
  var ORDER = ['r0', 'r1', 'r5', 'r6', 'r10'];
  function usableDrives(level, n) {
    if (level === 'r0') return n;
    if (level === 'r1') return 1;
    if (level === 'r5') return n - 1;
    if (level === 'r6') return n - 2;
    if (level === 'r10') return n / 2;
    return null;
  }
  function guaranteed(level, n) {
    if (level === 'r0') return 0;
    if (level === 'r1') return n - 1;
    if (level === 'r5') return 1;
    if (level === 'r6') return 2;
    if (level === 'r10') return 1;
    return null;
  }
  function best(level, n) {
    if (level === 'r10') return n / 2;
    return guaranteed(level, n);
  }
  function analyze(level, n, sizeTb, spares) {
    var L = LEVELS[level];
    spares = spares || 0;
    if (!L || !(n >= 1) || n !== Math.floor(n) || !(sizeTb > 0) || spares < 0 || spares !== Math.floor(spares)) return null;
    var total = n;
    var active = total - spares;
    var res = { level: level, label: L.label, min: L.min, drives: total, spares: spares, active: active, ok: true, reason: '' };
    if (active < L.min) { res.ok = false; res.reason = L.label + ' needs at least ' + L.min + ' drives in the array' + (spares ? ' (after ' + spares + ' spare' + (spares > 1 ? 's' : '') + ')' : '') + '.'; return res; }
    if (level === 'r10' && active % 2 !== 0) { res.ok = false; res.reason = 'RAID 10 needs an even number of drives in the array.'; return res; }
    var u = usableDrives(level, active);
    res.rawTb = total * sizeTb;
    res.usableTb = u * sizeTb;
    res.usableTib = res.usableTb * 1e12 / Math.pow(1024, 4);
    res.efficiency = res.usableTb / res.rawTb * 100;
    res.guaranteed = guaranteed(level, active);
    res.best = best(level, active);
    return res;
  }
  function compare(n, sizeTb, spares) { return ORDER.map(function (k) { return analyze(k, n, sizeTb, spares); }); }
  // capacity with mixed sizes: each drive counts as the smallest
  function minSize(sizes) { var m = Infinity; sizes.forEach(function (s) { if (s < m) m = s; }); return m; }
  var api = { LEVELS: LEVELS, ORDER: ORDER, analyze: analyze, compare: compare, minSize: minSize };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.RaidPick = api;
})(typeof window !== 'undefined' ? window : this);
