const API_URL = 'http://localhost:8081/carritos';

// Obtiene el id del carrito guardado, o crea uno nuevo si no existe
async function obtenerOCrearCarrito() {
  let id = localStorage.getItem('idCarrito');
  if (id) return id;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idUsuario: 1, correo: 'usuario@test.com' })
  });
  const carrito = await res.json();
  id = carrito.idCarrito;
  localStorage.setItem('idCarrito', id);
  return id;
}

// ===== PRODUCTOS.HTML: añadir producto =====
async function añadirAlCarrito(idArticulo, descripcion, precio) {
  try {
    const idCarrito = await obtenerOCrearCarrito();
    const linea = {
      idArticulo: idArticulo,
      descripcion: descripcion,
      numeroUnidades: 1,
      precioUnitario: precio
    };
    const res = await fetch(`${API_URL}/${idCarrito}/lineas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(linea)
    });
    if (res.ok) alert(descripcion + ' añadido al carrito');
    else alert('Error al añadir el producto');
  } catch (e) {
    alert('No se puede conectar con el servidor (¿está arrancado?)');
    console.error(e);
  }
}

// ===== CARRITO.HTML: mostrar contenido =====
async function cargarCarrito() {
  try {
    const idCarrito = localStorage.getItem('idCarrito');
    const tbody = document.querySelector('.tabla-carrito tbody');
    const totalCelda = document.querySelector('.fila-total td:last-child');
    tbody.innerHTML = '';

    if (!idCarrito) {
      totalCelda.textContent = '0.00€';
      return;
    }

    const res = await fetch(`${API_URL}/${idCarrito}`);
    if (!res.ok) {
      localStorage.removeItem('idCarrito');
      totalCelda.textContent = '0.00€';
      return;
    }
    const carrito = await res.json();

    carrito.lineas.forEach(linea => {
      const subtotal = linea.numeroUnidades * linea.precioUnitario;
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${linea.descripcion}</td>
        <td>${linea.numeroUnidades}</td>
        <td>${linea.precioUnitario.toFixed(2)}€</td>
        <td>${subtotal.toFixed(2)}€</td>
        <td><button class="btn-borrar" onclick="eliminarLinea(${linea.idArticulo})">X</button></td>
      `;
      tbody.appendChild(fila);
    });

    totalCelda.textContent = (carrito.totalPrecio || 0).toFixed(2) + '€';
  } catch (e) {
    console.error('Error al cargar el carrito:', e);
  }
}

// ===== Eliminar una línea =====
async function eliminarLinea(idArticulo) {
  try {
    const idCarrito = localStorage.getItem('idCarrito');
    const res = await fetch(`${API_URL}/${idCarrito}/lineas/${idArticulo}`, { method: 'DELETE' });
    if (res.ok) cargarCarrito();
  } catch (e) {
    console.error('Error al eliminar:', e);
  }
}

// Carga automática en carrito.html
if (window.location.pathname.endsWith('carrito.html')) {
  document.addEventListener('DOMContentLoaded', cargarCarrito);
}


// ===== FORMULARIO DE PEDIDO =====
function abrirFormularioPedido() {
    const idCarrito = localStorage.getItem('idCarrito');
    const tbody = document.querySelector('.tabla-carrito tbody');
  
    if (!idCarrito || tbody.children.length === 0) {
      alert('Tu carrito está vacío. Añade productos antes de finalizar.');
      return;
    }
    document.getElementById('modal-pedido').classList.remove('modal-oculto');
  }
  
  function cerrarFormularioPedido() {
    document.getElementById('modal-pedido').classList.add('modal-oculto');
  }
  
  // Mostrar/ocultar el campo de tarjeta según el método de pago
  document.addEventListener('DOMContentLoaded', () => {
    const selectPago = document.querySelector('select[name="pago"]');
    if (selectPago) {
      selectPago.addEventListener('change', (e) => {
        const labelTarjeta = document.getElementById('label-tarjeta');
        const inputTarjeta = document.querySelector('input[name="tarjeta"]');
        if (e.target.value === 'tarjeta') {
          labelTarjeta.style.display = 'block';
          inputTarjeta.required = true;
        } else {
          labelTarjeta.style.display = 'none';
          inputTarjeta.required = false;
        }
      });
    }
  });
  
  async function confirmarPedido(event) {
    event.preventDefault();
    const form = event.target;
    const datos = new FormData(form);
    const nombre = datos.get('nombre');
  
    try {
      // Borrar el carrito del backend
      const idCarrito = localStorage.getItem('idCarrito');
      if (idCarrito) {
        await fetch(`${API_URL}/${idCarrito}`, { method: 'DELETE' });
        localStorage.removeItem('idCarrito');
      }
  
      alert(`¡Gracias ${nombre}! Tu pedido ha sido confirmado y se entregará en el horario seleccionado.`);
      cerrarFormularioPedido();
      form.reset();
      cargarCarrito(); // refresca la tabla (vacía)
    } catch (e) {
      alert('Error al procesar el pedido');
      console.error(e);
    }
  }