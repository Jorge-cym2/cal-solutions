// ==========================================
// CAL SOLUTIONS - Carruseles de producto
// (CAL HCE Premium y CAL Recetas Lite)
// ==========================================

(function () {

    const carruseles = document.querySelectorAll(".rx-carrusel");
    if (!carruseles.length) return;

    const DURACION = 6; // segundos por imagen

    const modal = document.querySelector(".rx-modal");
    const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const actualizadores = [];

    // ----- vista ampliada (compartida) -----

    if (modal) {

        modal.addEventListener("click", (e) => {
            if (e.target.closest(".rx-cerrar") || e.target === modal || e.target.tagName !== "IMG") {
                modal.close();
            }
        });

        modal.addEventListener("close", () => actualizadores.forEach(f => f()));

    }

    function iniciar(raiz) {

        const slides    = Array.from(raiz.querySelectorAll(".rx-slide"));
        const escenario = raiz.querySelector(".rx-escenario");
        const contenedorPuntos = raiz.querySelector(".rx-puntos");
        const leyenda   = raiz.querySelector(".rx-leyenda");
        const titulo    = leyenda.querySelector("h3");
        const texto     = leyenda.querySelector("p");
        const contador  = raiz.querySelector(".rx-contador");
        const btnPrev   = raiz.querySelector(".rx-prev");
        const btnNext   = raiz.querySelector(".rx-next");
        const btnPausa  = raiz.querySelector(".rx-pausa");
        const btnAmpliar = raiz.querySelector(".rx-ampliar");

        let actual = 0;
        let pausaUsuario = false;
        let enPantalla = false;
        let encima = false;

        raiz.style.setProperty("--rx-dur", DURACION + "s");
        if (sinMovimiento) raiz.classList.add("sin-auto");

        const puntos = slides.map((slide, i) => {

            const b = document.createElement("button");
            b.type = "button";
            b.className = "rx-punto";
            b.setAttribute("role", "tab");
            b.setAttribute("aria-selected", "false");
            b.setAttribute("aria-label", "Imagen " + (i + 1) + ": " + slide.dataset.titulo);
            b.innerHTML = "<i></i>";
            b.addEventListener("click", () => ir(i));
            contenedorPuntos.appendChild(b);

            b.querySelector("i").addEventListener("animationend", () => {
                if (i === actual) ir(actual + 1);
            });

            return b;

        });

        function mostrar(animar) {

            slides.forEach((sl, i) => sl.classList.toggle("activa", i === actual));
            puntos.forEach((pt, i) => {
                pt.classList.toggle("activa", i === actual);
                pt.setAttribute("aria-selected", i === actual ? "true" : "false");
            });

            titulo.textContent = slides[actual].dataset.titulo;
            texto.textContent  = slides[actual].dataset.texto;
            contador.textContent = (actual + 1) + " / " + slides.length;

            if (animar && !sinMovimiento) {
                leyenda.classList.remove("cambia");
                void leyenda.offsetWidth;
                leyenda.classList.add("cambia");
            }

            const sig = slides[(actual + 1) % slides.length].querySelector("img");
            if (sig) sig.loading = "eager";

        }

        function ir(n) {
            const nuevo = (n + slides.length) % slides.length;
            if (nuevo === actual) return;
            actual = nuevo;
            mostrar(true);
        }

        btnPrev.addEventListener("click", () => ir(actual - 1));
        btnNext.addEventListener("click", () => ir(actual + 1));

        function actualizarPausa() {
            const detenido =
                pausaUsuario || encima || !enPantalla ||
                document.hidden || (modal && modal.open);
            raiz.classList.toggle("en-pausa", detenido);
        }

        actualizadores.push(actualizarPausa);

        btnPausa.addEventListener("click", () => {
            pausaUsuario = !pausaUsuario;
            btnPausa.innerHTML = pausaUsuario
                ? '<i class="fa-solid fa-play"></i>'
                : '<i class="fa-solid fa-pause"></i>';
            btnPausa.setAttribute("aria-label",
                pausaUsuario ? "Reanudar presentación" : "Pausar presentación");
            actualizarPausa();
        });

        raiz.addEventListener("mouseenter", () => { encima = true;  actualizarPausa(); });
        raiz.addEventListener("mouseleave", () => { encima = false; actualizarPausa(); });
        raiz.addEventListener("focusin",    () => { encima = true;  actualizarPausa(); });
        raiz.addEventListener("focusout",   () => { encima = false; actualizarPausa(); });
        document.addEventListener("visibilitychange", actualizarPausa);

        if ("IntersectionObserver" in window) {
            new IntersectionObserver((entradas) => {
                enPantalla = entradas[0].isIntersecting;
                actualizarPausa();
            }, { threshold: .25 }).observe(raiz);
        } else {
            enPantalla = true;
        }

        raiz.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft")  { ir(actual - 1); e.preventDefault(); }
            if (e.key === "ArrowRight") { ir(actual + 1); e.preventDefault(); }
        });

        let inicioX = 0, inicioY = 0, movio = false;

        escenario.addEventListener("pointerdown", (e) => {
            inicioX = e.clientX; inicioY = e.clientY; movio = false;
        });

        escenario.addEventListener("pointerup", (e) => {
            const dx = e.clientX - inicioX;
            const dy = e.clientY - inicioY;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                movio = true;
                ir(dx < 0 ? actual + 1 : actual - 1);
            }
        });

        escenario.addEventListener("click", (e) => {
            if (movio) { movio = false; return; }
            if (e.target.closest(".rx-flecha") || e.target.closest(".rx-ampliar")) return;
            ampliar();
        });

        function ampliar() {
            if (!modal || typeof modal.showModal !== "function") return;
            const img = slides[actual].querySelector("img");
            const grande = modal.querySelector("img");
            grande.src = img.currentSrc || img.src;
            grande.alt = img.alt;
            modal.showModal();
            actualizadores.forEach(f => f());
        }

        btnAmpliar.addEventListener("click", (e) => { e.stopPropagation(); ampliar(); });

        mostrar(false);
        actualizarPausa();

    }

    carruseles.forEach(iniciar);

    // sombra del encabezado al bajar
    const cab = document.querySelector("header");
    if (cab) {
        const f = () => cab.classList.toggle("con-sombra", window.scrollY > 10);
        window.addEventListener("scroll", f, { passive: true });
        f();
    }

})();
