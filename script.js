const contenedorProductos = document.querySelector(".productos-container");
const botonesCategoria = document.querySelectorAll(".categorias button");
const buscador = document.querySelector("#buscador");
const mensajeCatalogo = document.querySelector("#mensaje-catalogo");
const botonesContacto = document.querySelectorAll(".boton-contacto");
const avisoContacto = document.querySelector("#aviso-contacto");
let productos = [];
let categoriaSeleccionada = "Todos";
const numeroWhatsApp = "542664747024";


function buscarProducto(id){
    return productos.find(function(producto){
        return producto.id === Number(id);
    });
}

function formatearPrecio(precio){
    return precio.toLocaleString("es-AR");
}

function mostrarNotificacion(mensaje, tipo) {
    const notificacion = document.createElement("div");

    notificacion.textContent = mensaje;
    notificacion.classList.add("notificacion", tipo);

    document.body.appendChild(notificacion);

    setTimeout(function() {
        notificacion.classList.add("desaparecer");

        notificacion.addEventListener("animationend", function() {
            notificacion.remove();
        });
    }, 3000);
}

function crearMensajeWhatsApp(producto){
    return `Hola, quisiera consultar por el producto : ${producto.descripcion} Vi que su precio es $${formatearPrecio(producto.precio)}`;
}

function crearUrlWhatsApp(mensaje){
    const mensajeCodificado = encodeURIComponent(mensaje);
    return  "https://wa.me/" + numeroWhatsApp + "?text=" + mensajeCodificado;
}

function consultarProducto(id){
    const productoEncontrado = buscarProducto(id);
    console.log(productoEncontrado);
    if (!productoEncontrado){
        mostrarNotificacion("No se encontro el producto", "error");
        return;
    }

    const mensaje = crearMensajeWhatsApp(productoEncontrado);
    const url = crearUrlWhatsApp(mensaje);

    window.open(url, "_blank");
}

function cargarProductos(){
  return fetch("productos.json")
    .then(function (respuesta) {
      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los productos");
      }
      return respuesta.json();
    })

    .then(function (datos) {
      productos = datos;
      filtrarProductos();
    })

    .catch(function (error) {
      console.error("Error al cargar los productos:", error);

      contenedorProductos.innerHTML = "";
      mensajeCatalogo.textContent =
        "No pudimos cargar los productos. Por favor, intentá nuevamente más tarde.";
      mensajeCatalogo.hidden = false;
    });
}

function crearProducto(producto){
    const articulo = document.createElement("article");

    articulo.dataset.id = producto.id;

    const imagen = document.createElement("img");
    imagen.src = producto.imagen;
    imagen.alt = producto.nombre;
    articulo.appendChild(imagen);

    const contenido = document.createElement("div");
    contenido.classList.add("producto-contenido");

    const titulo = document.createElement("h3");
    titulo.textContent = producto.nombre;
    contenido.appendChild(titulo);

    const descripcion = document.createElement("p");
    descripcion.textContent = producto.descripcion;
    contenido.appendChild(descripcion);

    const precio = document.createElement("p");
    precio.textContent = "$" + producto.precio.toLocaleString("es-AR");
    precio.classList.add("precio");
    contenido.appendChild(precio);

    const boton = document.createElement("button");
    boton.textContent = "Consultar";
    boton.classList.add("boton-consultar");

    boton.addEventListener("click", function () {
    mostrarNotificacion(
        "WhatsApp no está habilitado en esta demostración.",
        "info"
    );

   });


    contenido.appendChild(boton);

    articulo.appendChild(contenido);



    return articulo;

}

function mostrarProductos(listaProductos){
    contenedorProductos.innerHTML = "";

    listaProductos.forEach(function(producto){
        const tarjeta = crearProducto(producto);
        contenedorProductos.appendChild(tarjeta);
    });
}

function filtrarProductos() {
    const textoBuscado = buscador.value.trim().toLowerCase();

    const productosFiltrados = productos.filter(function(producto) {
        const coincideCategoria =
            categoriaSeleccionada === "Todos" ||
            producto.categoria === categoriaSeleccionada;

        const coincideTexto =
            producto.nombre.toLowerCase().includes(textoBuscado) ||
            producto.descripcion.toLowerCase().includes(textoBuscado);

        return coincideCategoria && coincideTexto;
    });

    mostrarProductos(productosFiltrados);

    if (productosFiltrados.length === 0) {
        mensajeCatalogo.textContent = "No encontramos productos que coincidan con tu búsqueda.";
        mensajeCatalogo.hidden = false;
    } else {
        mensajeCatalogo.hidden = true;
    }
}

botonesCategoria.forEach(function(boton) {
    const activa = boton.classList.contains("categoria-activa");
    boton.setAttribute("aria-pressed", activa);

    boton.addEventListener("click", function() {
        botonesCategoria.forEach(function(boton) {
            boton.classList.remove("categoria-activa");
            boton.setAttribute("aria-pressed", "false");
        });

        boton.classList.add("categoria-activa");
        boton.setAttribute("aria-pressed", "true");

        categoriaSeleccionada = boton.textContent.trim();
        filtrarProductos();
    });
});

buscador.addEventListener("input", function() {
    filtrarProductos();
});


botonesContacto.forEach(function(boton) {

    boton.addEventListener("click", function() {

        const redSocial = boton.dataset.red;

        avisoContacto.textContent =
            `El acceso a ${redSocial} es parte de una demostración. Los datos reales de contacto se configurarán cuando el emprendimiento tenga sus propios canales oficiales.`;

        avisoContacto.hidden = false;

    });

});


cargarProductos();

