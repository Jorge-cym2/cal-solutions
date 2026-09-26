// ==========================================
// GRUPO CAL
// script.js v2.0
// ==========================================

console.clear();

console.log("========================================");
console.log("        BIENVENIDO A GRUPO CAL");
console.log(" Desarrollamos soluciones.");
console.log(" Transformamos procesos.");
console.log("========================================");


// ==========================================
// DESPLAZAMIENTO SUAVE
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (e) {

        const destino = document.querySelector(this.getAttribute("href"));

        if (!destino) return;

        e.preventDefault();

        destino.scrollIntoView({

            behavior: "smooth",
            block: "start"

        });

    });

});


// ==========================================
// HEADER DINÁMICO
// ==========================================

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if (!header) return;

    if (window.scrollY > 40) {

        header.style.background = "rgba(255,255,255,.96)";
        header.style.backdropFilter = "blur(20px)";
        header.style.boxShadow = "0 12px 30px rgba(0,0,0,.08)";

    }

    else{

        header.style.background = "rgba(255,255,255,.88)";
        header.style.boxShadow = "0 8px 30px rgba(0,0,0,.06)";

    }

});


// ==========================================
// ANIMACIÓN DE ENTRADA
// ==========================================

if ("IntersectionObserver" in window){

    const elementos = document.querySelectorAll(

        "section, .card, .hero-texto, .hero-imagen"

    );

    const observador = new IntersectionObserver(

        (entradas)=>{

            entradas.forEach((entrada)=>{

                if(entrada.isIntersecting){

                    entrada.target.animate([

                        {

                            opacity:0,
                            transform:"translateY(35px)"

                        },

                        {

                            opacity:1,
                            transform:"translateY(0px)"

                        }

                    ],{

                        duration:700,
                        easing:"ease-out",
                        fill:"forwards"

                    });

                    observador.unobserve(entrada.target);

                }

            });

        },

        {

            threshold:.15

        }

    );

    elementos.forEach((elemento)=>{

        observador.observe(elemento);

    });

}


// ==========================================
// BOTONES
// ==========================================

document.querySelectorAll(".btn").forEach((boton)=>{

    boton.addEventListener("mouseenter",()=>{

        boton.style.transform="translateY(-6px)";

    });

    boton.addEventListener("mouseleave",()=>{

        boton.style.transform="translateY(0px)";

    });

});


// ==========================================
// MENÚ ACTIVO
// ==========================================

const secciones = document.querySelectorAll("section");

const enlaces = document.querySelectorAll("nav a");

window.addEventListener("scroll",()=>{

    let actual="";

    secciones.forEach((seccion)=>{

        const top = seccion.offsetTop-150;

        if(window.scrollY>=top){

            actual=seccion.getAttribute("id");

        }

    });

    enlaces.forEach((link)=>{

        link.classList.remove("activo");

        if(link.getAttribute("href")==="#"+actual){

            link.classList.add("activo");

        }

    });

});


// ==========================================
// AÑO AUTOMÁTICO
// ==========================================

const anio=document.getElementById("anio");

if(anio){

    anio.textContent=new Date().getFullYear();

}


// ==========================================
// SITIO CARGADO
// ==========================================

window.addEventListener("load",()=>{

    console.log("Sitio cargado correctamente.");

});


// ==========================================
// FIN
// ==========================================