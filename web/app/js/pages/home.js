/* DropAgentX — HOME: algorithmic feed (following-first + trending) */
DGX.pages = DGX.pages || {};

DGX.pages.home = async (view, params) => {
  const mode = params.tab === 'following' ? 'following' : 'foryou';
  const cat = params.cat || 'all';
  let cursor = parseInt(params.cursor || 0, 10);
  let busy = false, ended = false;

  view.innerHTML = `
    <div id="stories" class="stories"></div>
    ${DGX.hubBar()}
    <div class="seg" style="margin-bottom:10px">
      <button data-tab="foryou" class="${mode === 'foryou' ? 'on' : ''}">${DGX.icon('flame','ic-s')} برای تو</button>
      <button data-tab="following" class="${mode === 'following' ? 'on' : ''}">${DGX.icon('users','ic-s')} فالوینگ‌ها</button>
    </div>
    <div class="chips" id="homeCats"></div>
    <div id="feed">${DGX.skelCards(3)}</div>
    <div id="more" style="text-align:center;color:var(--dim2);padding:14px"></div>`;

  // Instagram-style stories (built-in "همه" + categories)
  const stBox = DGX.$('#stories');
  if (stBox) stBox.innerHTML = DGX.storiesBox([]);

  // categories chips
  try {
    const cats = (await DGX.api('/api/app/categories')).items;
    if (stBox) stBox.innerHTML = DGX.storiesBox(cats);
    const box = DGX.$('#homeCats');
    if (box) {
      box.innerHTML = `<button class="chip ${cat === 'all' ? 'on' : ''}"
        data-c="all">همه</button>` +
        cats.filter(c => c.count > 0 || c.key === cat).map(c =>
          `<button class="chip ${cat === c.key ? 'on' : ''}" data-c="${c.key}">
             ${c.icon} ${c.fa}${c.count ? ` · ${DGX.kfmt(c.count)}` : ''}</button>`).join('');
      box.querySelectorAll('.chip').forEach(ch => ch.onclick = () => {
        location.hash = `#/home?tab=${mode}&cat=${ch.dataset.c}`;
      });
    }
  } catch (_) {}

  view.querySelectorAll('.seg button').forEach(b => b.onclick = () => {
    location.hash = `#/home?tab=${b.dataset.tab}&cat=${cat}`;
  });

  const feed = DGX.$('#feed'), more = DGX.$('#more');

  async function load(reset) {
    if (busy || (!reset && ended)) return;
    busy = true;
    more.textContent = reset ? '' : '…';
    if (reset) { cursor = 0; ended = false; feed.innerHTML = DGX.skelCards(3); }
    try {
      const d = await DGX.api(
        `/api/app/feed?mode=${mode}&cat=${encodeURIComponent(cat)}&cursor=${cursor}`);
      if (reset) feed.innerHTML = '';
      ended = d.next === null;
      for (const p of d.items) feed.insertAdjacentHTML('beforeend', DGX.postCard(p));
      wire(feed);
      cursor = d.next ?? cursor;
      if (ended && !d.items.length && reset)
        feed.innerHTML = `<div class="empty"><div class="big">${DGX.icon('flame','big-ic')}</div>
          هنوز پستی نیست — اولین سازنده باش!<br><br>
          <button class="btn btn-primary" onclick="location.hash='#/create'">${DGX.icon('plus','ic-s')} ساخت محصول</button></div>`;
      more.textContent = ended ? (d.items.length ? 'همه را دیدی' : '') : '…';
    } catch (e) {
      if (reset) feed.innerHTML =
        `<div class="empty"><div class="big">${DGX.icon('live','big-ic')}</div>${e.msg || 'خطا'}
         <br><br><button class="btn btn-ghost" onclick="location.reload()">تلاش مجدد</button></div>`;
    }
    busy = false;
  }

  const wire = DGX.wireFeed;

  // infinite scroll
  const io = new IntersectionObserver(es => {
    if (es.some(x => x.isIntersecting)) load(false);
  }, { rootMargin: '600px' });
  io.observe(more);

  DGX.ptr(view, async () => { await DGX.refreshMe(); await load(true); });

  await load(true);
};
