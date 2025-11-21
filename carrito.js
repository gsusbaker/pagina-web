// ==========================================================
// CÓDIGO COMPLETO PARA carrito.js
// ==========================================================
(function(){
    // 1. CONSTANTES Y UTILIDADES
    const LS_KEY = "carrito_gorras";
    
    // Función para formatear moneda a "0,00 €"
    const fmt = n => (n || 0).toFixed(2).replace(".", ",") + " €";

    // Elementos del DOM
    const wrap = document.getElementById("cart");
    const grandTotalElement = document.getElementById("grand");
    const clearButton = document.getElementById("clear");

    // 2. GESTIÓN DEL LOCAL STORAGE
    
    /** Recupera el carrito desde localStorage. */
    function getCart(){ 
        try { 
            const data = localStorage.getItem(LS_KEY);
            // Asegura que siempre devuelve un array
            return data ? JSON.parse(data) : []; 
        } catch { 
            return []; 
        } 
    }
    
    /** Guarda el carrito en localStorage y fuerza el redibujado. */
    function setCart(c){ 
        localStorage.setItem(LS_KEY, JSON.stringify(c)); 
        render(); 
    }

    // 3. FUNCIONES DE ACCIÓN (Modifican el carrito)
    
    /** Incrementa la cantidad de un producto. */
    function inc(id){
        const c = getCart(); 
        const i = c.findIndex(x=>x.id===id);
        if(i>=0) c[i].qty += 1; 
        setCart(c);
    }
    
    /** Decrementa la cantidad de un producto. Si llega a 0, lo elimina. */
    function dec(id){
        const c = getCart(); 
        const i = c.findIndex(x=>x.id===id);
        if(i>=0){ 
            c[i].qty -= 1; 
            if(c[i].qty<=0) c.splice(i,1); // Elimina si la cantidad es 0 o menos
        } 
        setCart(c);
    }
    
    /** Elimina un producto por completo. */
    function del(id){
        // Filtra y mantiene solo los productos cuyo ID no coincide con el que queremos borrar
        const c = getCart().filter(x=>x.id!==id); 
        setCart(c);
    }
    
    /** Vacía completamente el carrito (clear). */
    function clearCart() {
        if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
            localStorage.setItem(LS_KEY, "[]");
            render();
        }
    }

    // 4. FUNCIÓN PRINCIPAL DE RENDERIZADO
    
    function render(){
        if(!wrap) return; // Salir si el contenedor no existe
        
        const items = getCart();
        let total = 0;

        // Caso 1: Carrito vacío
        if(items.length === 0){
            wrap.innerHTML = `<div style="padding:18px; text-align:center; color:#6b7280;">Tu carrito está vacío. <a href="index.html" style="color:var(--brand); text-decoration:none;">¡Sigue comprando!</a></div>`;
            grandTotalElement.textContent = fmt(0);
            return;
        }

        // Caso 2: Carrito con productos (Generación de HTML)
        
        let html = `
            <div class="row header">
                <div></div>
                <div>Producto</div>
                <div style="text-align:right;">Precio Unitario</div>
                <div style="text-align:center;">Cantidad</div>
                <div style="text-align:right;">Subtotal</div>
                <div></div>
            </div>`;
        
        // Iterar sobre los productos
        for(const it of items){
            const linePrice = (it.price || 0);
            const lineQty = (it.qty || 0);
            const lineTotal = linePrice * lineQty;
            total += lineTotal;
            
            // Fila de cada producto
            html += `
                <div class="row product-row">
                    <div><img class="product-img" src="${it.img || ''}" alt="${it.title || 'Producto'}"></div>
                    
                    <div><strong>${it.title}</strong></div>
                    <div style="text-align:right;">${fmt(linePrice)}</div>
                    
                    <div class="qty" style="justify-content:center;">
                        <button data-dec="${it.id}">–</button>
                        <strong style="width:20px; text-align:center;">${lineQty}</strong>
                        <button data-inc="${it.id}">+</button>
                    </div>
                    
                    <div style="text-align:right; font-weight:700;">${fmt(lineTotal)}</div>

                    <button class="del" title="Quitar" data-del="${it.id}">✕</button>
                </div>`;
        }

        wrap.innerHTML = html;
        grandTotalElement.textContent = fmt(total); // Actualiza el total

        // 5. DELEGACIÓN DE EVENTOS (Asigna las acciones después de renderizar)
        
        // Asignar listeners a los botones de incremento, decremento y eliminación
        wrap.querySelectorAll("[data-inc]").forEach(b=> b.onclick = ()=> inc(b.getAttribute("data-inc")));
        wrap.querySelectorAll("[data-dec]").forEach(b=> b.onclick = ()=> dec(b.getAttribute("data-dec")));
        wrap.querySelectorAll("[data-del]").forEach(b=> b.onclick = ()=> del(b.getAttribute("data-del")));
    }

    // 6. INICIALIZACIÓN
    
    document.addEventListener("DOMContentLoaded", () => {
        // Renderizar el carrito al cargar la página
        render();

        // Asignar listener al botón "Vaciar"
        if (clearButton) clearButton.addEventListener("click", clearCart);
    });
})();
// ==========================================================