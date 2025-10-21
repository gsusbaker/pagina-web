// catalogo.js
(function () {
  const LS_KEY = "carrito_gorras";

  function getCart() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
    catch { return []; }
  }
  function setCart(cart) {
    localStorage.setItem(LS_KEY, JSON.stringify(cart));
    updateBubble();
  }
  function addToCart(item) {
    const cart = getCart();
    const idx = cart.findIndex(p => p.id === item.id);
    if (idx >= 0) cart[idx].qty += 1;
    else cart.push({ ...item, qty: 1 });
    setCart(cart);
  }

  // Crea burbuja flotante (contador) sin tocar tu HTML
  function ensureBubble() {
    if (document.getElementById("cart-bubble")) return;
    const a = document.createElement("a");
    a.id = "cart-bubble";
    a.href = "carrito.html"; // página del carrito
    a.setAttribute("title", "Ver carrito");
    Object.assign(a.style, {
      position: "fixed",
      right: "16px",
      bottom: "16px",
      width: "54px",
      height: "54px",
      borderRadius: "50%",
      background: "#111",
      color: "#fff",
      display: "grid",
      placeItems: "center",
      fontWeight: "700",
      textDecoration: "none",
      zIndex: 9999,
      boxShadow: "0 6px 16px rgba(0,0,0,.25)",
    });
    a.innerHTML = "🛒<span id='cart-count' style='margin-left:6px;'>0</span>";
    document.body.appendChild(a);
  }
  function updateBubble() {
    ensureBubble();
    const countEl = document.getElementById("cart-count");
    const total = getCart().reduce((s, it) => s + it.qty, 0);
    if (countEl) countEl.textContent = String(total);
  }

  // Animación: clona la imagen del producto y “vuela” al logo del header
  function flyToHeader(productImgEl) {
    const logo = document.querySelector("header img");
    if (!productImgEl || !logo) return;

    const imgRect = productImgEl.getBoundingClientRect();
    const logoRect = logo.getBoundingClientRect();

    const clone = productImgEl.cloneNode(true);
    Object.assign(clone.style, {
      position: "fixed",
      left: imgRect.left + "px",
      top: imgRect.top + "px",
      width: imgRect.width + "px",
      height: imgRect.height + "px",
      objectFit: "cover",
      borderRadius: "12px",
      zIndex: 9998,
      transition: "transform 700ms cubic-bezier(.2,.7,.2,1), opacity 700ms",
      willChange: "transform, opacity",
    });
    document.body.appendChild(clone);

    const dx = logoRect.left + logoRect.width / 2 - (imgRect.left + imgRect.width / 2);
    const dy = logoRect.top + logoRect.height / 2 - (imgRect.top + imgRect.height / 2);

    // fuerza reflow para que la transición arranque
    clone.getBoundingClientRect();
    clone.style.transform = `translate(${dx}px, ${dy}px) scale(.2)`;
    clone.style.opacity = "0.2";

    setTimeout(() => clone.remove(), 750);
  }

  // Toast sencillo
  function toast(msg = "Añadido al carrito") {
    const t = document.createElement("div");
    t.textContent = msg;
    Object.assign(t.style, {
      position: "fixed",
      left: "50%",
      bottom: "90px",
      transform: "translateX(-50%)",
      background: "#111",
      color: "#fff",
      padding: "10px 14px",
      borderRadius: "10px",
      fontWeight: "600",
      zIndex: 9999,
      opacity: "0",
      transition: "opacity .2s",
    });
    document.body.appendChild(t);
    requestAnimationFrame(() => (t.style.opacity = "1"));
    setTimeout(() => { t.style.opacity = "0"; setTimeout(() => t.remove(), 200); }, 1200);
  }

  // Extrae datos del DOM sin cambiar tu HTML
  function itemFromCard(card) {
    const img = card.querySelector("img");
    const title = card.querySelector(".info strong")?.textContent.trim() || "Producto";
    const priceTxt = card.querySelector(".price")?.textContent.replace(",", ".").match(/[\d.]+/);
    const price = priceTxt ? parseFloat(priceTxt[0]) : 0;
    const id = (img?.getAttribute("src") || title).toLowerCase(); // id estable por src/título
    return { id, title, price, img: img?.getAttribute("src") || "" };
  }

  // Listeners a todos los botones “Añadir al carrito”
  document.addEventListener("DOMContentLoaded", () => {
    updateBubble();
    document.querySelectorAll(".card .buy").forEach(btn => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".card");
        if (!card) return;
        const item = itemFromCard(card);
        addToCart(item);
        flyToHeader(card.querySelector("img"));
        toast("Añadido: " + item.title);
      });
    });
  });
})();
