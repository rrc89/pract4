const API_URL = 'http://localhost:8081/carritos';

// anadir un producto (productos.html)
async function añadirAlCarrito(idArticulo, descripcion, precio) {
  const producto = {
    idArticulo: idArticulo,
    descripcion: descripcion,
    unidades: 1,
    precioFinal: precio
  };
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    });
    if (res.ok) alert(descripcion + ' añadido al carrito');
    else alert('Error al añadir el producto');
  } catch (e) {
    alert('No se puede conectar con el servidor. ¿Está arrancado en localhost:8081?');
    console.error(e);
  }
}

// cargar el carrito (carrito.html)
async function cargarCarrito() {
  try {
    const res = await fetch(API_URL);
    const items = await res.json();
    const tbody = document.querySelector('.tabla-carrito tbody');
    const totalCelda = document.querySelector('.fila-total td:last-child');
    tbody.innerHTML = '';
    let total = 0;

    items.forEach(item => {
      const subtotal = item.unidades * item.precioFinal;
      total += subtotal;
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${item.descripcion}</td>
        <td>${item.unidades}</td>
        <td>${item.precioFinal.toFixed(2)}€</td>
        <td>${subtotal.toFixed(2)}€</td>
        <td><button class="btn-borrar" onclick="eliminarDelCarrito(${item.id})">X</button></td>
      `;
      tbody.appendChild(fila);
    });

    totalCelda.textContent = total.toFixed(2) + '€';
  } catch (e) {
    console.error('Error al cargar el carrito:', e);
  }
}

// eliminar productos del carrito
async function eliminarDelCarrito(id) {
  try {
    const res = await fetch(API_URL + '/' + id, { method: 'DELETE' });
    if (res.ok) cargarCarrito();
  } catch (e) {
    console.error('Error al eliminar:', e);
  }
}

// carga automatica cuando se abre carrito.html
if (window.location.pathname.endsWith('carrito.html')) {
  document.addEventListener('DOMContentLoaded', cargarCarrito);
}