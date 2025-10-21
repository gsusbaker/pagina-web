// carrito.js
(function(){
  const LS_KEY = "carrito_gorras";
  const fmt = n => (n || 0).toFixed(2).replace(".", ",") + " €";

  function getCart(){ try { return JSON.parse(localStorage.getItem(LS_KEY))||[]; } catch { return []; } }
  function setCart(c){ localStorage.setItem(LS_KEY, JSON.stringify(c)); render(); }

  function inc(id){
    const c = getCart(); const i = c.findIndex(x=>x.id===id);
    if(i>=0) c[i].qty += 1; setCart(c);
  }
  function dec(id){
    const c = getCart(); const i = c.findIndex(x=>x.id===id);
    if(i>=0){ c[i].qty -= 1; if(c[i].qty<=0) c.splice(i,1); } setCart(c);
  }
  function del(id){
    const c = getCart().filter(x=>x.id!==id); setCart(c);
  }

  function render(){
    const wrap = document.getElementById("cart");
    const items = getCart();
    if(!wrap) return;
    if(items.length===0){
      wrap.innerHTML = `<div style="padding:18px; text-align:center;">Tu carrito está vacío.</div>`;
      document.getElementById("grand").textContent = fmt(0);
      return;
    }
    let html = `<div class="row header"><div></div><div>Producto</div><div>Precio</div><div>Cantidad</div><div></div></div>`;
    let total = 0;
    for(const it of items){
      const line = (it.price||0) * (it.qty||0);
      total += line;
      html += `
        <div class="row">
          <img src="${it.img || ''}" alt="">
          <div>${it.title}</div>
          <div>${fmt(it.price)}</div>
          <div class="qty">
            <button data-dec="${it.id}">–</button>
            <strong>${it.qty}</strong>
            <button data-inc="${it.id}">+</button>
          </div>
          <button class="del" title="Quitar" data-del="${it.id}">✕</button>
        </div>`;
    }
    wrap.innerHTML = html;
    document.getElementById("grand").textContent = fmt(total);

    // listeners
    wrap.querySelectorAll("[data-inc]").forEach(b=> b.onclick = ()=> inc(b.getAttribute("data-inc")));
    wrap.querySelectorAll("[data-dec]").forEach(b=> b.onclick = ()=> dec(b.getAttribute("data-dec")));
    wrap.querySelectorAll("[data-del]").forEach(b=> b.onclick = ()=> del(b.getAttribute("data-del")));
  }

  document.addEventListener("DOMContentLoaded", () => {
    render();
    const clearBtn = document.getElementById("clear");
    if (clearBtn) clearBtn.addEventListener("click", ()=>{
      localStorage.setItem(LS_KEY, "[]");
      render();
    });
  });
})();
