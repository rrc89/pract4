# Práctica 5 - Consumo API REST

Frontend del supermercado que consume la API REST del carrito de la compra.

## Despliegue
El despliegue de la pagina está disponible en GitHub Pages (este repo): https://rrc89.github.io/pract4/

## Backend
La API REST utilizada está en el repositorio de la práctica 2 y 3: https://github.com/rrc89/p2

**IMPORTANTE:** Debido a una serie de incidentes, al final para que la web sea funcional, es necesario tener el backend
arrancado localmente en `http://localhost:8081`.

## Endpoints utilizados
Estos son los endpoints que se han implementado para actualizar el carrito en esta última entrega:
- `POST /carritos` - Crear un carrito vacío
- `GET /carritos/{id}` - Obtener el contenido del carrito
- `POST /carritos/{id}/lineas` - Añadir un producto al carrito
- `DELETE /carritos/{id}/lineas/{idArticulo}` - Eliminar un producto
- `DELETE /carritos/{id}` - Vaciar el carrito (al finalizar pedido)