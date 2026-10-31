import { useEffect, useRef, useState } from "react";
import { getMenu, saveMenu, login, uploadImage, imgUrl } from "./api";

/* ============================================================
   SETTINGS YOU CAN CHANGE
   ============================================================ */
const RESTAURANT = "Casa Ember";            // placeholder name
const CUR = "$";                            // placeholder currency
const SOCIAL = {                            // placeholder links
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",
};

/* ============================================================
   TEXT (English + Arabic)
   ============================================================ */
const STR = {
  en: {
    viewMenu: "View menu", heroTitle: "Fire-grilled flavor, delivered fast.",
    heroSub: "Fresh dishes cooked over real fire. Order in a minute and we bring it to your door.",
    rating: "4.8 rating", wood: "Wood-fired", fast: "Fast delivery",
    search: "Search dishes…", all: "All", menuTitle: "Our menu", pick: "Pick",
    add: "Add to order", closed: "Closed", soldOut: "Sold out",
    closedMsg: "We are closed right now. Opening hours: {o} – {c}.",
    order: "Your order", clear: "Clear all", empty: "Your cart is empty.", each: "each",
    subtotal: "Subtotal", delivery: "Delivery fee", total: "Total",
    checkout: "Continue to checkout", minMsg: "Minimum order is {m}.",
    deliveryOnly: "Delivery only", area: "Area", name: "Full name", phone: "Phone",
    location: "Delivery location", note: "Note", optional: "optional",
    notePh: "Anything we should know?", send: "Send order via WhatsApp",
    sendHint: "Opens WhatsApp with your order ready to send.",
    ready: "Your order is ready",
    readyMsg: "Send the pre-filled message in WhatsApp and we will start cooking right away.",
    openWa: "Open WhatsApp again", back: "Back to menu",
    hours: "Hours", address: "Address", maps: "Open in Maps", whatsapp: "WhatsApp",
    errName: "Please enter your name.", errPhone: "Enter a valid phone number.",
    errLoc: "Please enter your delivery location.",
    loading: "Loading menu…", loadErr: "Could not load the menu.", retry: "Try again",
    noResults: "No dishes found.", daily: "Open daily", admin: "Admin",
    top: "Back to top", close: "Close", items: "items", noWa: "Ordering is not set up yet.",
  },
  ar: {
    viewMenu: "عرض القائمة", heroTitle: "نكهة مشوية على النار، توصيل سريع.",
    heroSub: "أطباق طازجة مطهوة على نار حقيقية. اطلب خلال دقيقة ونوصلها إلى بابك.",
    rating: "تقييم 4.8", wood: "على الحطب", fast: "توصيل سريع",
    search: "ابحث عن طبق…", all: "الكل", menuTitle: "قائمتنا", pick: "مختارنا",
    add: "أضف إلى الطلب", closed: "مغلق", soldOut: "نفد",
    closedMsg: "نحن مغلقون الآن. ساعات العمل: {o} – {c}.",
    order: "طلبك", clear: "حذف الكل", empty: "سلتك فارغة.", each: "للواحد",
    subtotal: "المجموع الفرعي", delivery: "رسوم التوصيل", total: "الإجمالي",
    checkout: "المتابعة إلى الدفع", minMsg: "الحد الأدنى للطلب {m}.",
    deliveryOnly: "توصيل فقط", area: "المنطقة", name: "الاسم الكامل", phone: "الهاتف",
    location: "موقع التوصيل", note: "ملاحظة", optional: "اختياري",
    notePh: "هل هناك ما يجب أن نعرفه؟", send: "إرسال الطلب عبر واتساب",
    sendHint: "يفتح واتساب مع طلبك جاهزًا للإرسال.",
    ready: "طلبك جاهز",
    readyMsg: "أرسل الرسالة الجاهزة في واتساب وسنبدأ بالتحضير فورًا.",
    openWa: "افتح واتساب مرة أخرى", back: "العودة إلى القائمة",
    hours: "ساعات العمل", address: "العنوان", maps: "افتح في الخرائط", whatsapp: "واتساب",
    errName: "الرجاء إدخال اسمك.", errPhone: "أدخل رقم هاتف صحيح.",
    errLoc: "الرجاء إدخال موقع التوصيل.",
    loading: "جارٍ تحميل القائمة…", loadErr: "تعذّر تحميل القائمة.", retry: "حاول مرة أخرى",
    noResults: "لا توجد أطباق.", daily: "مفتوح يوميًا", admin: "الإدارة",
    top: "إلى الأعلى", close: "إغلاق", items: "أطباق", noWa: "الطلب غير مفعّل بعد.",
  },
};

/* ============================================================
   SMALL HELPERS
   ============================================================ */
const ICONS = {
  cart: <><circle cx="6" cy="19" r="2" /><circle cx="17" cy="19" r="2" /><path d="M17 17H6V3H4" /><path d="M6 5l14 1-1 7H6" /></>,
  search: <><circle cx="10" cy="10" r="7" /><path d="M21 21l-6-6" /></>,
  x: <path d="M18 6L6 18M6 6l12 12" />,
  trash: <><path d="M4 7h16M10 11v6M14 11v6" /><path d="M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12" /><path d="M9 7V4h6v3" /></>,
  up: <path d="M12 19V5M6 11l6-6 6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  star: <path d="M12 17.75l-6.17 3.25 1.18-6.87-5-4.87 6.9-1L12 2l3.09 6.25 6.9 1-5 4.87 1.18 6.87z" fill="currentColor" stroke="none" />,
  wa: <><path d="M3 21l1.65-3.8a9 9 0 113.4 2.9L3 21" /><path d="M9 10a.5.5 0 001 0V9a.5.5 0 00-1 0v1a5 5 0 005 5h1a.5.5 0 000-1h-1a.5.5 0 000 1" /></>,
  ig: <><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3" /><path d="M16.5 7.5v.01" /></>,
  fb: <path d="M7 10v4h3v7h4v-7h3l1-4h-4V8a1 1 0 011-1h3V3h-3a5 5 0 00-5 5v2H7" />,
  pin: <><circle cx="12" cy="11" r="3" /><path d="M17.66 16.66l-4.24 4.24a2 2 0 01-2.83 0l-4.25-4.24a8 8 0 1111.32 0" /></>,
  check: <path d="M5 12l5 5L20 7" />,
  back: <path d="M15 6l-6 6 6 6" />,
  edit: <><path d="M4 20h4L18.5 9.5a2.83 2.83 0 10-4-4L4 16v4" /><path d="M13.5 6.5l4 4" /></>,
  upload: <><path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" /><path d="M7 9l5-5 5 5M12 4v12" /></>,
};

const Icon = ({ n, s = 20 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[n]}</svg>
);

const money = (n) => (Number(n) || 0).toFixed(2);

// Is the restaurant open right now? (uses the visitor's clock; supports hours past midnight)
function isOpen(m) {
  if (!m.hoursOn) return true;
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const [oh, om] = m.open.split(":").map(Number);
  const [ch, cm] = m.close.split(":").map(Number);
  const o = oh * 60 + om, c = ch * 60 + cm;
  return o <= c ? cur >= o && cur < c : cur >= o || cur < c;
}

// Like useState, but remembered in the browser (cart, language, checkout form).
function useLocal(key, init) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignore */ } }, [key, v]);
  return [v, setV];
}

/* ============================================================
   DISH CARD
   ============================================================ */
function Card({ it, lang, t, open, catLabel, qtyOf, idx, onSize, onQty, onOpen }) {
  const sizes = it.sizes || [];
  const sz = sizes[idx] || sizes[0];
  const price = sz ? sz.price : it.price;
  const sizeName = sz ? sz.name : "";
  const q = qtyOf(it.id, sizeName);
  const name = (lang === "ar" && it.nameAr) || it.name;
  const desc = (lang === "ar" && it.descAr) || it.desc;

  return (
    <article className={"card" + (it.on ? "" : " off")}>
      <button className="ph" onClick={() => onOpen(it)} aria-label={name}>
        {it.img ? <img src={imgUrl(it.img)} alt={name} loading="lazy" /> : <span className="em">{it.emoji || "🍽️"}</span>}
        <span className="tag">{catLabel(it.cat)}</span>
        {it.pick && <span className="pickb"><Icon n="star" s={11} /> {t("pick")}</span>}
      </button>

      <div className="body">
        <h3>{name}</h3>
        {desc && <p className="desc">{desc}</p>}

        {sizes.length > 0 && (
          <div className="seg">
            {sizes.map((s, i) => (
              <button key={s.name} className={s === sz ? "on" : ""} onClick={() => onSize(it.id, i)}>{s.name}</button>
            ))}
          </div>
        )}

        <div className="buy">
          <div className="price"><small>{CUR}</small>{money(price)}</div>
          {!it.on ? (
            <button className="btn add" disabled>{t("soldOut")}</button>
          ) : !open ? (
            <button className="btn add" disabled>{t("closed")}</button>
          ) : q === 0 ? (
            <button className="btn add" onClick={() => onQty(it.id, sizeName, 1)}>{t("add")}</button>
          ) : (
            <div className="step">
              <button onClick={() => onQty(it.id, sizeName, q - 1)} aria-label="−"><Icon n="minus" s={16} /></button>
              <div className="sm"><span>{q} × {CUR}{money(price)}</span><b>{CUR}{money(q * price)}</b></div>
              <button onClick={() => onQty(it.id, sizeName, q + 1)} aria-label="+"><Icon n="plus" s={16} /></button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   MAIN APP (customer site)
   ============================================================ */
export default function App() {
  const [menu, setMenu] = useState(null);
  const [err, setErr] = useState("");
  const [lang, setLang] = useLocal("ce_lang", "en");
  const [cart, setCart] = useLocal("ce_cart", []);                       // [{ id, size, qty }]
  const [form, setForm] = useLocal("ce_form", { name: "", phone: "", loc: "", note: "" });
  const [errors, setErrors] = useState({});
  const [view, setView] = useState("shop");                              // shop | admin
  const [drawer, setDrawer] = useState(null);                            // null | cart | checkout | done
  const [modal, setModal] = useState(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sel, setSel] = useState({});                                    // dish id -> chosen size index
  const [showTop, setShowTop] = useState(false);
  const [, setTick] = useState(0);
  const [token, setToken] = useState(() => sessionStorage.getItem("ce_token") || "");

  const t = (k) => STR[lang][k] ?? STR.en[k] ?? k;

  const load = () => {
  setErr("");
  getMenu()
    .then(setMenu)
    .catch((e) => setErr(e.message));
};

useEffect(() => {
  getMenu()
    .then(setMenu)
    .catch((e) => setErr(e.message));
}, []);

  // Language + direction (RTL for Arabic)
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  // Scroll button, Esc key, re-check opening hours every minute
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    const onKey = (e) => { if (e.key === "Escape") { setModal(null); setDrawer(null); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    const id = setInterval(() => setTick((n) => n + 1), 60000);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("keydown", onKey); clearInterval(id); };
  }, []);

  // Stop the page scrolling behind the drawer / modal
  useEffect(() => { document.body.style.overflow = modal || drawer ? "hidden" : ""; }, [modal, drawer]);

  // SEO: keep the Restaurant JSON-LD in sync with the real data
  useEffect(() => {
    if (!menu) return;
    const ld = {
      "@context": "https://schema.org", "@type": "Restaurant", name: RESTAURANT,
      address: menu.addr || undefined, hasMap: menu.map || undefined,
      telephone: menu.wa ? "+" + menu.wa : undefined,
      servesCuisine: "Wood-fired", priceRange: "$$",
      openingHours: menu.hoursOn ? `Mo-Su ${menu.open}-${menu.close}` : undefined,
      url: window.location.href,
    };
    let s = document.getElementById("ld");
    if (!s) { s = document.createElement("script"); s.type = "application/ld+json"; s.id = "ld"; document.head.appendChild(s); }
    s.textContent = JSON.stringify(ld);
  }, [menu]);

  if (view === "admin") {
    return <Admin menu={menu} onMenu={setMenu} token={token} setToken={setToken} onExit={() => setView("shop")} />;
  }

  if (!menu) {
    return (
      <div className="center">
        {err ? (<><p>{t("loadErr")}</p><p className="muted">{err}</p><button className="btn red" onClick={load}>{t("retry")}</button></>) : <p className="muted">{t("loading")}</p>}
      </div>
    );
  }

  /* ----- derived values ----- */
  const open = isOpen(menu);
  const catLabel = (c) => (lang === "ar" && menu.catAr?.[c]) || c;
  const nameOf = (it) => (lang === "ar" && it.nameAr) || it.name;
  const waDigits = (menu.wa || "").replace(/\D/g, "");

  const lines = cart.flatMap((l) => {
    const it = menu.items.find((i) => i.id === l.id);
    if (!it || !it.on) return [];
    const sz = (it.sizes || []).find((s) => s.name === l.size);
    const unit = sz ? sz.price : it.price;
    return [{ ...l, it, unit, total: unit * l.qty }];
  });
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.total, 0);
  const fee = lines.length ? menu.fee : 0;
  const total = subtotal + fee;
  const belowMin = subtotal < menu.min;

  const qtyOf = (id, size) => cart.find((l) => l.id === id && l.size === size)?.qty || 0;
  const setQty = (id, size, qty) =>
    setCart((c) => {
      if (qty <= 0) return c.filter((l) => !(l.id === id && l.size === size));
      const f = c.find((l) => l.id === id && l.size === size);
      return f ? c.map((l) => (l === f ? { ...l, qty } : l)) : [...c, { id, size, qty }];
    });

  const activeCat = cat === "All" || menu.cats.includes(cat) ? cat : "All";
  const ql = q.trim().toLowerCase();
  const shown = menu.items.filter(
    (i) =>
      (activeCat === "All" || i.cat === activeCat) &&
      (!ql || [i.name, i.nameAr, i.desc, i.descAr, i.cat].some((s) => (s || "").toLowerCase().includes(ql)))
  );

  /* ----- WhatsApp order ----- */
  const waUrl = () => {
    const rows = lines.map((l) => `${l.qty} × ${l.it.name}${l.size ? ` (${l.size})` : ""} – ${CUR}${money(l.total)}`);
    const msg = [
      `*New order – ${RESTAURANT}*`, "",
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      `Location: ${form.loc.trim()}`,
      form.note.trim() ? `Note: ${form.note.trim()}` : null,
      "", "*Items*", ...rows, "",
      `Delivery fee: ${CUR}${money(fee)}`,
      `*Total: ${CUR}${money(total)}*`,
    ].filter((x) => x !== null).join("\n");
    return `https://wa.me/${waDigits}?text=${encodeURIComponent(msg)}`;
  };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = t("errName");
    if (!/^\d{7,15}$/.test(form.phone.replace(/[\s()+-]/g, ""))) e.phone = t("errPhone");
    if (form.loc.trim().length < 3) e.loc = t("errLoc");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const send = () => {
    if (!open || !waDigits || !lines.length || !validate()) return;
    window.open(waUrl(), "_blank", "noopener");
    setDrawer("done");
  };

  const finish = () => { setCart([]); setDrawer(null); };
  const field = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const closedText = menu.hoursOn ? t("closedMsg").replace("{o}", menu.open).replace("{c}", menu.close) : "";

  /* ----- pieces of UI ----- */
  const renderDrawer = () => {
    if (!drawer) return null;
    return (
      <>
        <div className="overlay" onClick={() => setDrawer(null)} />
        <aside className="drawer" role="dialog" aria-modal="true">
          {drawer === "cart" && (
            <>
              <div className="dh">
                <h2>{t("order")}</h2>
                <button className="iconbtn" onClick={() => setDrawer(null)} aria-label={t("close")}><Icon n="x" s={18} /></button>
              </div>
              {lines.length === 0 ? (
                <p className="muted pad">{t("empty")}</p>
              ) : (
                <>
                  <div className="dsub"><span>{count} {t("items")}</span><button className="link" onClick={() => setCart([])}>{t("clear")}</button></div>
                  <div className="dbody">
                    {lines.map((l) => (
                      <div className="line" key={l.id + "|" + l.size}>
                        <div className="thumb">{l.it.img ? <img src={imgUrl(l.it.img)} alt="" /> : l.it.emoji || "🍽️"}</div>
                        <div className="linfo">
                          <div className="lt">
                            <div><h4>{nameOf(l.it)}</h4><small>{l.size ? l.size + " · " : ""}{CUR}{money(l.unit)} {t("each")}</small></div>
                            <button className="trash" onClick={() => setQty(l.id, l.size, 0)} aria-label="Delete"><Icon n="trash" /></button>
                          </div>
                          <div className="lb">
                            <div className="qty">
                              <button onClick={() => setQty(l.id, l.size, l.qty - 1)} aria-label="−"><Icon n="minus" s={14} /></button>
                              <b>{l.qty}</b>
                              <button onClick={() => setQty(l.id, l.size, l.qty + 1)} aria-label="+"><Icon n="plus" s={14} /></button>
                            </div>
                            <span className="lsum">{CUR}{money(l.total)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="dfoot">
                    <div className="row"><span>{t("subtotal")}</span><b>{CUR}{money(subtotal)}</b></div>
                    <div className="row"><span>{t("delivery")}</span><b>{CUR}{money(fee)}</b></div>
                    <div className="row tot"><span>{t("total")}</span><span>{CUR}{money(total)}</span></div>
                    {belowMin && <p className="warn">{t("minMsg").replace("{m}", CUR + money(menu.min))}</p>}
                    {!open && closedText && <p className="warn">{closedText}</p>}
                    <button className="btn red full" disabled={!open || belowMin} onClick={() => setDrawer("checkout")}>{t("checkout")}</button>
                  </div>
                </>
              )}
            </>
          )}

          {drawer === "checkout" && (
            <>
              <div className="dh">
                <button className="iconbtn" onClick={() => setDrawer("cart")} aria-label="Back"><span className="flip"><Icon n="back" s={18} /></span></button>
                <h2>{t("checkout")}</h2>
                <button className="iconbtn" onClick={() => setDrawer(null)} aria-label={t("close")}><Icon n="x" s={18} /></button>
              </div>
              <div className="dform">
                <div className="info">
                  <Icon n="pin" s={22} />
                  <div>
                    <b>{t("deliveryOnly")}</b>
                    {t("delivery")} {CUR}{money(menu.fee)} · {CUR}{money(menu.min)} min{menu.area ? ` · ${t("area")}: ${menu.area}` : ""}
                  </div>
                </div>
                <label className="field"><span>{t("name")}</span>
                  <input className={"input" + (errors.name ? " bad" : "")} value={form.name} onChange={field("name")} autoComplete="name" />
                  {errors.name && <span className="err">{errors.name}</span>}</label>
                <label className="field"><span>{t("phone")}</span>
                  <input className={"input" + (errors.phone ? " bad" : "")} value={form.phone} onChange={field("phone")} inputMode="tel" autoComplete="tel" />
                  {errors.phone && <span className="err">{errors.phone}</span>}</label>
                <label className="field"><span>{t("location")}</span>
                  <input className={"input" + (errors.loc ? " bad" : "")} value={form.loc} onChange={field("loc")} autoComplete="street-address" />
                  {errors.loc && <span className="err">{errors.loc}</span>}</label>
                <label className="field"><span>{t("note")} <i>({t("optional")})</i></span>
                  <textarea className="input" value={form.note} onChange={field("note")} placeholder={t("notePh")} /></label>
              </div>
              <div className="dfoot">
                <div className="row tot"><span>{t("total")} · {count} {t("items")}</span><span>{CUR}{money(total)}</span></div>
                {!waDigits && <p className="warn">{t("noWa")}</p>}
                {!open && closedText && <p className="warn">{closedText}</p>}
                <button className="btn red full" disabled={!open || !waDigits || !lines.length} onClick={send}><Icon n="wa" /> {t("send")}</button>
                <p className="hint">{t("sendHint")}</p>
              </div>
            </>
          )}

          {drawer === "done" && (
            <div className="done">
              <div className="okc"><Icon n="check" s={42} /></div>
              <h2>{t("ready")}</h2>
              <p className="muted">{t("readyMsg")}</p>
              <div className="sum">
                {lines.map((l) => (
                  <div className="row" key={l.id + "|" + l.size}>
                    <span>{l.qty} × {nameOf(l.it)}{l.size ? ` (${l.size})` : ""}</span><b>{CUR}{money(l.total)}</b>
                  </div>
                ))}
                <div className="row"><span>{t("delivery")}</span><b>{CUR}{money(fee)}</b></div>
                <div className="row tot"><span>{t("total")}</span><span>{CUR}{money(total)}</span></div>
              </div>
              <a className="btn red full" href={waUrl()} target="_blank" rel="noopener noreferrer"><Icon n="wa" /> {t("openWa")}</a>
              <button className="btn line full" onClick={finish}>{t("back")}</button>
            </div>
          )}
        </aside>
      </>
    );
  };

  const renderModal = () => {
    if (!modal) return null;
    return (
      <div className="modal" onClick={() => setModal(null)}>
        <div className="mcard" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
          <button className="mx" onClick={() => setModal(null)} aria-label={t("close")}><Icon n="x" s={16} /></button>
          <div className="mph">{modal.img ? <img src={imgUrl(modal.img)} alt={nameOf(modal)} /> : modal.emoji || "🍽️"}</div>
          <div className="mb">
            <div className="mtags">
              <span className="t1">{catLabel(modal.cat)}</span>
              {modal.pick && <span className="pickb"><Icon n="star" s={11} /> {t("pick")}</span>}
            </div>
            <h3>{nameOf(modal)}</h3>
            <p>{(lang === "ar" && modal.descAr) || modal.desc}</p>
          </div>
        </div>
      </div>
    );
  };

  /* ----- page ----- */
  return (
    <>
      <header className="top">
        <div className="wrap bar">
          <a className="logo" href="#top">{RESTAURANT}</a>
          <div className="bar-r">
            <button className="pill" onClick={() => setLang(lang === "en" ? "ar" : "en")} aria-label="Language">
              <i className={lang === "en" ? "on" : ""}>EN</i> / <i className={lang === "ar" ? "on" : ""}>العربية</i>
            </button>
            <button className="iconbtn" onClick={() => setDrawer("cart")} aria-label={t("order")}>
              <Icon n="cart" />{count > 0 && <b className="badge">{count}</b>}
            </button>
            <button className="pill red" onClick={() => setView("admin")}>{t("admin")}</button>
          </div>
        </div>
      </header>

      {!open && closedText && <div className="closed">{closedText}</div>}

      <main id="top">
        <section className="wrap hero">
          <span className="eyebrow">{lang === "ar" ? "على الحطب · توصيل" : "WOOD-FIRED · DELIVERED"}</span>
          <h1>{t("heroTitle")}</h1>
          <p>{t("heroSub")}</p>
          <a className="btn red" href="#menu">{t("viewMenu")}</a>
          <div className="badges">
            <span><Icon n="star" s={14} /> {t("rating")}</span>
            <span>{t("wood")}</span>
            <span>{t("fast")}</span>
          </div>
        </section>

        <section className="wrap sec" id="menu">
          <h2>{t("menuTitle")}</h2>
          <div className="tools">
            <label className="search"><Icon n="search" s={18} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search")} aria-label={t("search")} />
            </label>
            <div className="chips">
              {["All", ...menu.cats].map((c) => (
                <button key={c} className={"chip" + (c === activeCat ? " on" : "")} onClick={() => setCat(c)}>
                  {c === "All" ? t("all") : catLabel(c)}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: 14 }} />
          {shown.length === 0 ? (
            <p className="muted">{t("noResults")}</p>
          ) : (
            <div className="grid">
              {shown.map((it) => (
                <Card key={it.id} it={it} lang={lang} t={t} open={open} catLabel={catLabel} qtyOf={qtyOf}
                  idx={sel[it.id] ?? 0} onSize={(id, i) => setSel((s) => ({ ...s, [id]: i }))}
                  onQty={setQty} onOpen={setModal} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="foot">
        <div className="wrap fgrid">
          <div><h3 style={{ fontSize: "1.5rem" }}>{RESTAURANT}</h3></div>
          <div><h4>{t("hours")}</h4><p>{menu.hoursOn ? `${menu.open} – ${menu.close}` : t("daily")}</p></div>
          <div>
            <h4>{t("address")}</h4><p>{menu.addr}</p>
            {menu.map && <a className="l" href={menu.map} target="_blank" rel="noopener noreferrer"><Icon n="pin" s={16} /> {t("maps")}</a>}
          </div>
          <div>
            <h4>{t("whatsapp")}</h4>
            {waDigits && <a className="g" href={`https://wa.me/${waDigits}`} target="_blank" rel="noopener noreferrer"><Icon n="wa" s={16} /> +{waDigits}</a>}
          </div>
        </div>
      </footer>

      {/* Floating social bar (bottom-center) */}
      <nav className="fab" aria-label="Contact">
        {waDigits && <a className="wa" href={`https://wa.me/${waDigits}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><Icon n="wa" /></a>}
        <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Icon n="ig" /></a>
        <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Icon n="fb" /></a>
      </nav>

      {/* Back to top (bottom-right) */}
      <button className={"btt" + (showTop ? " show" : "")} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label={t("top")}>
        <Icon n="up" s={22} />
      </button>

      {renderDrawer()}
      {renderModal()}
    </>
  );
}

/* ============================================================
   ADMIN DASHBOARD
   ============================================================ */
const Toggle = ({ on, onChange, label }) => (
  <button type="button" role="switch" aria-checked={on} aria-label={label}
    className={"toggle" + (on ? " on" : "")} onClick={() => onChange(!on)} />
);

function Admin(props) {
  return props.token ? <Dashboard {...props} /> : <Login {...props} />;
}

function Login({ setToken, onExit }) {
  const [u, setU] = useState("admin");
  const [p, setP] = useState("");
  const [e, setE] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (ev) => {
    ev.preventDefault();
    setBusy(true); setE("");
    try {
      const r = await login(u, p);
      sessionStorage.setItem("ce_token", r.token);
      setToken(r.token);
    } catch (x) { setE(x.message); setBusy(false); }
  };

  return (
    <div className="adm">
      <form className="loginbox" onSubmit={submit}>
        <h1>{RESTAURANT} <span>ADMIN</span></h1>
        <label className="field"><span>Username</span>
          <input className="input" value={u} onChange={(x) => setU(x.target.value)} autoComplete="username" /></label>
        <label className="field"><span>Password</span>
          <input className="input" type="password" value={p} onChange={(x) => setP(x.target.value)} autoComplete="current-password" /></label>
        {e && <p className="err">{e}</p>}
        <button className="btn red full" disabled={busy || !p}>{busy ? "…" : "Log in"}</button>
        <button type="button" className="btn line full" onClick={onExit}>Back to site</button>
      </form>
    </div>
  );
}

function Dashboard({ menu, onMenu, token, setToken, onExit }) {
  const [tab, setTab] = useState("overview");
  // Local working copy. fee/min are strings while typing.
  const [adm, setAdm] = useState(() => ({ ...menu, catAr: menu.catAr || {}, fee: String(menu.fee), min: String(menu.min) }));
  const [status, setStatus] = useState("saved");        // saved | saving | error
  const [msg, setMsg] = useState("");
  const dirty = useRef(false);

  const [form, setForm] = useState(null);               // dish being added / edited
  const [ferr, setFerr] = useState("");
  const [busy, setBusy] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", ar: "" });

  const logout = () => { sessionStorage.removeItem("ce_token"); setToken(""); };
  const change = (fn) => {
  setAdm((prev) => {
    dirty.current = true;
    return fn(prev);
  });
};

  // AUTO-SAVE: 0.7s after the last change, send the whole menu to the API.
  useEffect(() => {
    if (!dirty.current) return;
    setStatus("saving");
    const h = setTimeout(async () => {
      try {
        const body = { ...adm, fee: Number(adm.fee) || 0, min: Number(adm.min) || 0 };
        const saved = await saveMenu(body, token);
        onMenu(saved);
        dirty.current = false;
        setStatus("saved"); setMsg("");
      } catch (e) {
        if (e.status === 401) { logout(); return; }
        setStatus("error"); setMsg(e.message);
      }
    }, 700);
    return () => clearTimeout(h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adm]);

  const set = (k) => (e) => {
  const value = e.target.value;
  change((a) => ({ ...a, [k]: value }));
};

  /* ---------- dish form ---------- */
  const blank = () => ({ id: 0, name: "", nameAr: "", desc: "", descAr: "", emoji: "🍕", img: "", price: "", on: true, pick: false, cat: adm.cats[0] || "", sizes: [] });
  const startEdit = (it) => {
    setForm({ ...it, price: String(it.price), sizes: (it.sizes || []).map((s) => ({ name: s.name, price: String(s.price) })) });
    setFerr(""); window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const f = (k) => (e) => setForm((x) => ({ ...x, [k]: e.target.value }));
  const bad = (v) => v === "" || Number.isNaN(Number(v)) || Number(v) < 0;

  const submitForm = () => {
    if (!form.name.trim()) return setFerr("Name is required.");
    if (bad(form.price)) return setFerr("Enter a valid price.");
    if (!form.cat) return setFerr("Choose a category.");
    for (const s of form.sizes) if (!s.name.trim() || bad(s.price)) return setFerr("Every size needs a name and a valid price.");

    const id = form.id || Math.max(0, ...adm.items.map((i) => i.id)) + 1;
    const item = {
      ...form, id,
      name: form.name.trim(), nameAr: form.nameAr.trim(), desc: form.desc.trim(), descAr: form.descAr.trim(),
      emoji: form.emoji.trim(), price: Number(form.price),
      sizes: form.sizes.map((s) => ({ name: s.name.trim(), price: Number(s.price) })),
    };
    change((a) => ({ ...a, items: form.id ? a.items.map((i) => (i.id === id ? item : i)) : [...a.items, item] }));
    setForm(null);
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return setFerr("Photo must be 2 MB or smaller.");
    setBusy(true);
    try {
      const r = await uploadImage(file, token);
      setForm((x) => ({ ...x, img: r.url })); setFerr("");
    } catch (x) { if (x.status === 401) return logout(); setFerr(x.message); }
    setBusy(false);
  };

  const patchItem = (id, patch) => change((a) => ({ ...a, items: a.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) }));
  const delItem = (it) => { if (window.confirm(`Delete "${it.name}"?`)) change((a) => ({ ...a, items: a.items.filter((i) => i.id !== it.id) })); };

  /* ---------- categories ---------- */
  const addCat = () => {
    const name = newCat.name.trim();
    if (!name) return;
    if (adm.cats.some((c) => c.toLowerCase() === name.toLowerCase())) return window.alert("That category already exists.");
    change((a) => ({ ...a, cats: [...a.cats, name], catAr: newCat.ar.trim() ? { ...a.catAr, [name]: newCat.ar.trim() } : a.catAr }));
    setNewCat({ name: "", ar: "" });
  };
  const delCat = (c) => {
    if (adm.items.some((i) => i.cat === c)) return window.alert("Move or delete the dishes in this category first.");
    if (adm.cats.length <= 1) return window.alert("You need at least one category.");
    if (!window.confirm(`Delete category "${c}"?`)) return;
    change((a) => { const catAr = { ...a.catAr }; delete catAr[c]; return { ...a, cats: a.cats.filter((x) => x !== c), catAr }; });
  };
  const setCatAr = (c, v) => change((a) => ({ ...a, catAr: { ...a.catAr, [c]: v } }));

  const picks = adm.items.filter((i) => i.pick).length;
  const sold = adm.items.filter((i) => !i.on).length;

  return (
    <div className="adm">
      <div className="ah">
        <h1>{RESTAURANT} <span>ADMIN</span></h1>
        <div className="ahr">
          <span className={"st " + status}>{status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : "Not saved"}</span>
          <button className="sbtn" onClick={onExit}>Back to site</button>
          <button className="sbtn" onClick={logout}>Log out</button>
        </div>
      </div>
      {status === "error" && <p className="err" style={{ marginTop: 10 }}>{msg}</p>}

      <div className="tabs">
        {[["overview", "Overview"], ["items", "Menu items"], ["cats", "Categories"], ["settings", "Settings"]].map(([k, l]) => (
          <button key={k} className={"tab" + (tab === k ? " on" : "")} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {/* ---------------- OVERVIEW ---------------- */}
      {tab === "overview" && (
        <>
          <div className="stats">
            <div className="stat"><span>Menu items</span><b>{adm.items.length}</b></div>
            <div className="stat"><span>Categories</span><b>{adm.cats.length}</b></div>
            <div className="stat"><span>Chef's picks</span><b>{picks}</b></div>
            <div className="stat hot"><span>Sold out</span><b>{sold}</b></div>
          </div>
          <div className="two">
            <div className="panel">
              <h2>Restaurant status</h2>
              <span className={"st " + (isOpen(adm) ? "saved" : "error")} style={{ width: "fit-content" }}>
                {isOpen(adm) ? "Open now" : "Closed now"}{adm.hoursOn ? ` · ${adm.open} – ${adm.close}` : " · opening hours are off"}
              </span>
              <p className="muted">Outside opening hours the site shows a closed banner and checkout is disabled.</p>
            </div>
            <div className="panel">
              <h2>Delivery</h2>
              <div className="row"><span>Delivery fee</span><b>{CUR}{money(adm.fee)}</b></div>
              <div className="row"><span>Minimum order</span><b>{CUR}{money(adm.min)}</b></div>
              <div className="row"><span>Area</span><b>{adm.area || "—"}</b></div>
            </div>
          </div>
        </>
      )}

      {/* ---------------- MENU ITEMS ---------------- */}
      {tab === "items" && (
        <>
          {!form && <button className="btn red" onClick={() => { setForm(blank()); setFerr(""); }} disabled={adm.cats.length === 0}><Icon n="plus" s={18} /> Add dish</button>}
          <div style={{ height: 14 }} />

          {form && (
            <div className="panel">
              <h2>{form.id ? "Edit dish" : "Add a dish"}</h2>
              <div className="two">
                <label className="field"><span>Name</span><input className="input" value={form.name} onChange={f("name")} /></label>
                <label className="field"><span>Price ({CUR}){form.sizes.length > 0 && " – base price"}</span><input className="input" inputMode="decimal" value={form.price} onChange={f("price")} /></label>
                <label className="field"><span>Category</span>
                  <select className="input" value={form.cat} onChange={f("cat")}>{adm.cats.map((c) => <option key={c}>{c}</option>)}</select></label>
                <label className="field"><span>Emoji (used when there is no photo)</span><input className="input" value={form.emoji} onChange={f("emoji")} /></label>
              </div>
              <label className="field"><span>Description</span><textarea className="input" value={form.desc} onChange={f("desc")} /></label>
              <div className="two">
                <label className="field"><span>Arabic name (optional)</span><input className="input" dir="rtl" value={form.nameAr} onChange={f("nameAr")} /></label>
                <label className="field"><span>Arabic description (optional)</span><textarea className="input" dir="rtl" value={form.descAr} onChange={f("descAr")} /></label>
              </div>

              <label className="drop">
                <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={onFile} />
                {form.img ? <img src={imgUrl(form.img)} alt="" /> : <Icon n="upload" s={24} />}
                <span>{busy ? "Uploading…" : form.img ? "Change photo" : "Upload photo"} · JPG, PNG or WEBP · max 2 MB</span>
              </label>
              {form.img && <button type="button" className="sbtn del" style={{ width: "fit-content" }} onClick={() => setForm((x) => ({ ...x, img: "" }))}>Remove photo</button>}

              <div className="sizes">
                <span style={{ fontSize: ".82rem", fontWeight: 700 }}>Sizes (optional, each with its own price)</span>
                {form.sizes.map((s, i) => (
                  <div className="srow" key={i}>
                    <input className="input" placeholder="Small" value={s.name}
                      onChange={(e) => setForm((x) => ({ ...x, sizes: x.sizes.map((z, j) => (j === i ? { ...z, name: e.target.value } : z)) }))} />
                    <input className="input" inputMode="decimal" placeholder="10.00" value={s.price}
                      onChange={(e) => setForm((x) => ({ ...x, sizes: x.sizes.map((z, j) => (j === i ? { ...z, price: e.target.value } : z)) }))} />
                    <button className="trash" aria-label="Remove size" onClick={() => setForm((x) => ({ ...x, sizes: x.sizes.filter((_, j) => j !== i) }))}><Icon n="x" s={18} /></button>
                  </div>
                ))}
                {form.sizes.length < 6 && (
                  <button type="button" className="link" style={{ textAlign: "start" }}
                    onClick={() => setForm((x) => ({ ...x, sizes: [...x.sizes, { name: "", price: "" }] }))}>+ Add size</button>
                )}
              </div>

              {ferr && <p className="err">{ferr}</p>}
              <div className="ctl">
                <button className="btn red" onClick={submitForm} disabled={busy}>Save dish</button>
                <button className="btn line" onClick={() => setForm(null)}>Cancel</button>
              </div>
            </div>
          )}

          <div className="ilist">
            {adm.items.map((it) => (
              <div className={"iitem" + (it.on ? "" : " off")} key={it.id}>
                <div className="itop">
                  <div className="thumb">{it.img ? <img src={imgUrl(it.img)} alt="" /> : it.emoji || "🍽️"}</div>
                  <div>
                    <h4>{it.name}{!it.on && <span className="sold">SOLD OUT</span>}</h4>
                    <small>{it.cat} · {CUR}{money(it.price)}{it.sizes?.length ? ` · ${it.sizes.length} sizes` : ""}</small>
                  </div>
                </div>
                <div className="ctl">
                  <label><Toggle on={it.on} onChange={(v) => patchItem(it.id, { on: v })} label="Available" /> {it.on ? "Available" : "Sold out"}</label>
                  <label><Toggle on={it.pick} onChange={(v) => patchItem(it.id, { pick: v })} label="Chef's pick" /> ★ Pick</label>
                  <button className="sbtn" onClick={() => startEdit(it)}><Icon n="edit" s={16} /> Edit</button>
                  <button className="sbtn del" onClick={() => delItem(it)}><Icon n="trash" s={16} /> Delete</button>
                </div>
              </div>
            ))}
            {adm.items.length === 0 && <p className="muted">No dishes yet.</p>}
          </div>
        </>
      )}

      {/* ---------------- CATEGORIES ---------------- */}
      {tab === "cats" && (
        <>
          <div className="panel">
            <h2>Add category</h2>
            <div className="two">
              <label className="field"><span>Name</span><input className="input" value={newCat.name} onChange={(e) => setNewCat((c) => ({ ...c, name: e.target.value }))} /></label>
              <label className="field"><span>Arabic name (optional)</span><input className="input" dir="rtl" value={newCat.ar} onChange={(e) => setNewCat((c) => ({ ...c, ar: e.target.value }))} /></label>
            </div>
            <button className="btn red" style={{ width: "fit-content" }} onClick={addCat}><Icon n="plus" s={18} /> Add category</button>
          </div>
          <div className="ilist">
            {adm.cats.map((c) => (
              <div className="iitem" key={c}>
                <div className="itop"><h4 style={{ flex: 1 }}>{c} <small>({adm.items.filter((i) => i.cat === c).length})</small></h4>
                  <button className="sbtn del" onClick={() => delCat(c)}><Icon n="trash" s={16} /> Delete</button></div>
                <label className="field"><span>Arabic name</span>
                  <input className="input" dir="rtl" value={adm.catAr[c] || ""} onChange={(e) => setCatAr(c, e.target.value)} /></label>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ---------------- SETTINGS ---------------- */}
      {tab === "settings" && (
        <>
          <div className="panel">
            <h2>Ordering and delivery</h2>
            <div className="two">
              <label className="field"><span>WhatsApp number (country code + digits only)</span>
                <input className="input" inputMode="numeric" placeholder="96171000000" value={adm.wa || ""}
                  onChange={(e) => change((a) => ({ ...a, wa: e.target.value.replace(/\D/g, "") }))} /></label>
              <label className="field"><span>Delivery area</span><input className="input" value={adm.area || ""} onChange={set("area")} /></label>
              <label className="field"><span>Delivery fee ({CUR})</span><input className="input" inputMode="decimal" value={adm.fee} onChange={set("fee")} /></label>
              <label className="field"><span>Minimum order ({CUR})</span><input className="input" inputMode="decimal" value={adm.min} onChange={set("min")} /></label>
              <label className="field"><span>Address</span><input className="input" value={adm.addr || ""} onChange={set("addr")} /></label>
              <label className="field"><span>Google Maps link</span><input className="input" placeholder="https://maps.google.com/…" value={adm.map || ""} onChange={set("map")} /></label>
            </div>
          </div>
          <div className="panel">
            <h2>Opening hours</h2>
            <div className="hrs">
              <label className="ctl" style={{ gap: 10 }}><Toggle on={adm.hoursOn} onChange={(v) => change((a) => ({ ...a, hoursOn: v }))} label="Use opening hours" /> Use opening hours</label>
              <label className="field"><span>Opens</span><input className="input" type="time" value={adm.open} onChange={set("open")} /></label>
              <label className="field"><span>Closes</span><input className="input" type="time" value={adm.close} onChange={set("close")} /></label>
            </div>
            <p className="muted">Changes save automatically.</p>
          </div>
        </>
      )}
    </div>
  );
}
