// DALIA · site : téléchargement de la dernière version, visite guidée, apparitions.
(() => {
  const REPO = 'L9DJULO/DALIA-RELOADED';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;

  // ── Apparition des sections ──────────────────
  const reveals = document.querySelectorAll('[data-reveal]');
  if (hasIO && !reduce) {
    const io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // ── Chrono : compte de 30 à 0, s'arrête un instant sur 00, puis une nouvelle champ select repart ──
  // Le temps est accéléré (30 s affichées en 9 s). Il ne tourne que tant que la section est à
  // l'écran ; en mouvement réduit, l'état fixe écrit dans le HTML (07 s, en rouge) reste affiché.
  const clock = document.querySelector('[data-clock]');
  if (clock && hasIO && !reduce) {
    const counter = clock.querySelector('[data-clock-n]');
    const moments = [...clock.querySelectorAll('.moment')].map(el => ({ el, at: parseFloat(el.style.getPropertyValue('--t')) || 0 }));
    const TOTAL = 30, RUN = 9000, HOLD = 1600;
    let raf = 0, start = 0, shown = '';

    const render = remaining => {
      const p = remaining / TOTAL;
      clock.style.setProperty('--p', p.toFixed(4));
      const text = String(Math.ceil(remaining)).padStart(2, '0');
      if (text !== shown) { counter.textContent = text; shown = text; }
      clock.classList.toggle('is-danger', remaining <= 10);
      for (const m of moments) m.el.classList.toggle('is-on', 1 - p >= m.at);
    };
    const tick = now => {
      const t = (now - start) % (RUN + HOLD);
      render(t < RUN ? TOTAL * (1 - t / RUN) : 0);
      raf = requestAnimationFrame(tick);
    };
    const play = () => { if (!raf) { start = performance.now(); raf = requestAnimationFrame(tick); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    render(TOTAL);
    new IntersectionObserver(([e]) => (e.isIntersecting ? play() : stop()), { threshold: 0.35 }).observe(clock);
  }

  // ── Visite guidée : l'écran zoome sur la zone de l'étape lue ──
  const frame = document.querySelector('.tour__frame');
  const canvas = document.querySelector('.tour__canvas');
  const steps = [...document.querySelectorAll('.step')];
  let active = -1;

  function place() {
    if (!frame || !canvas) return;
    const W = frame.clientWidth, H = frame.clientHeight;
    if (!W || active < 0) { canvas.style.setProperty('--s', 1); canvas.style.setProperty('--tx', '0px'); canvas.style.setProperty('--ty', '0px'); return; }
    const step = steps[active];
    const [x, y, w, h] = step.dataset.focus.split(' ').map(Number);
    const k = W / 1280;
    let s = Number(step.dataset.scale) || Math.min(1280 / (w * 1.12), 800 / (h * 1.12));
    s = Math.max(1, Math.min(2.4, s));
    let tx = W / 2 - s * (x + w / 2) * k;
    let ty = H / 2 - s * (y + h / 2) * k;
    tx = Math.min(0, Math.max(W - s * W, tx));
    ty = Math.min(0, Math.max(H - s * H, ty));
    canvas.style.setProperty('--s', s.toFixed(3));
    canvas.style.setProperty('--tx', `${tx.toFixed(1)}px`);
    canvas.style.setProperty('--ty', `${ty.toFixed(1)}px`);
  }

  function activate(i) {
    if (i === active) return;
    active = i;
    steps.forEach((s, j) => s.classList.toggle('is-active', j === i));
    place();
  }

  if (steps.length && hasIO) {
    const io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) activate(steps.indexOf(e.target));
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    steps.forEach(s => io.observe(s));
    if ('ResizeObserver' in window && frame) new ResizeObserver(place).observe(frame);
  } else {
    steps.forEach(s => s.classList.add('is-active'));
  }

  // ── Dernière version publiée sur GitHub ──────
  const links = document.querySelectorAll('[data-dl-href]');
  if (!links.length || !('fetch' in window)) return;
  const bytes = n => `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(n / 1048576)} Mo`;
  const day = d => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d));

  function apply(rel) {
    const asset = rel.assets.find(a => /setup\.exe$/i.test(a.name)) || rel.assets.find(a => /\.(exe|msi)$/i.test(a.name));
    if (!asset) return;
    const version = String(rel.tag_name).replace(/^v/i, '');
    links.forEach(a => { a.href = asset.browser_download_url; });
    document.querySelectorAll('[data-dl-meta]').forEach(el => { el.textContent = `v${version} · ${bytes(asset.size)}`; });
    document.querySelectorAll('[data-dl-release]').forEach(el => {
      el.textContent = `Version ${version}, publiée le ${day(rel.published_at)}. Windows 10 et 11, 64 bits. Gratuit.`;
    });
  }

  const KEY = 'dalia-latest-release';
  try {
    const cached = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    if (cached && Date.now() - cached.at < 30 * 60 * 1000) { apply(cached.rel); return; }
  } catch { /* stockage indisponible : on interroge GitHub */ }

  fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers: { Accept: 'application/vnd.github+json' } })
    .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then(rel => {
      const slim = { tag_name: rel.tag_name, published_at: rel.published_at,
        assets: (rel.assets || []).map(a => ({ name: a.name, size: a.size, browser_download_url: a.browser_download_url })) };
      apply(slim);
      try { sessionStorage.setItem(KEY, JSON.stringify({ at: Date.now(), rel: slim })); } catch { /* sans cache */ }
    })
    .catch(() => { /* les liens gardent la page des versions GitHub */ });
})();
