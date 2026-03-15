# FreelanceHub

## Current State
Nuevo proyecto, sin código existente.

## Requested Changes (Diff)

### Add
- Marketplace de freelancers con dos tipos de usuario: Cliente y Freelancer
- Registro/login con roles (cliente o freelancer)
- Perfiles de freelancer: bio, habilidades, tarifa por hora, foto de perfil
- Publicación de proyectos por parte de clientes: título, descripción, presupuesto, categoría, fecha límite
- Sistema de propuestas: freelancers pueden enviar propuestas a proyectos abiertos
- Clientes pueden revisar propuestas y aceptar/rechazar
- Sistema de valoraciones: clientes valoran a freelancers (1-5 estrellas + comentario)
- Panel de cliente: mis proyectos publicados, propuestas recibidas
- Panel de freelancer: explorar proyectos, mis propuestas enviadas, perfil
- Listado público de proyectos disponibles
- Listado público de freelancers disponibles

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend Motoko: usuarios con roles, proyectos, propuestas, valoraciones, perfiles de freelancer
2. Seleccionar componente `authorization` para manejo de roles
3. Frontend: landing page, autenticación, paneles diferenciados por rol, listados, formularios
