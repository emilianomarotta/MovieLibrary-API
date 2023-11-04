# Movie Library API

Este proyecto es una API de películas que brinda soporte para las siguientes acciones que pueden ser consumidas por aplicaciones clientes:

- Registrar usuario
- Autenticar usuario
- Invalidar token
- Obtener películas (con opción de búsqueda por una keyword)
- Agregar película a favoritos
- Obtener películas favoritas

## Requisitos

Para ejecutar esta API, necesitarás tener instalado lo siguiente:

- Node.js
- npm (administrador de paquetes de Node.js)

## Instalación

1. Clona este repositorio:

```
git clone https://github.com/emilianomarotta/MovieLibrary-API.git
```
2. Navega al directorio del proyecto:
```
cd MovieLibrary-API
```
3. Instala las dependencias:
```
npm install
```

4. Inicia el servidor:
```
npm start
```

La API estará disponible en http://localhost:3000.

Uso
Registrar usuario
Registra un nuevo usuario en la API.

## Uso

### Registrar usuario
Registra un nuevo usuario en la API.

```
POST /api/users/register
```

Pasar los siguientes campos en formato JSON:
```
{
  "email": "example@mail.com",
  "firstName": "Nombre",
  "lastName": "Apellido",
  "password": "Password.1"
}
```

### Autenticar usuario
Inicia sesión y obtén un token de autenticación.
```
POST /api/users/login
```

Pasar los siguientes campos en formato JSON:
```
{
  "email": "example@mail.com",
  "password": "Password.1"
}
```

### Logout
Invalida un token
```
POST /api/users/logout
```

### Obtener películas
Obtiene una lista de películas. Puedes incluir una keyword (opcional) en la consulta para buscar películas específicas.
```
GET /api/movies?keyword=aventura
```

### Agregar película a favoritos
Agrega una película a la lista de películas favoritas del usuario.
```
POST /api/users/addFavorite
```
Pasar los siguientes campos en formato JSON:
```
{
    "movieId": 1,
    "title": "Avatar 2",
    "releaseDate": "2022-12-16",
    "originalLanguage": "en"
}
```

### Obtener películas favoritas
Obtiene la lista de películas favoritas de un usuario específico.
```
GET /api/users/getFavorites
```

### Nota Importante
Para los siguientes endpoints, es necesario incluir el token de autenticación en los encabezados de las solicitudes:

- **Logout:** Para cerrar la sesión, asegúrate de incluir el token en el encabezado.

- **Obtener películas:** Para obtener una lista de películas.

- **Agregar película a favoritos:** Para agregar una película a la lista de favoritos.

- **Obtener películas favoritas:** Para obtener la lista de películas favoritas de un usuario.

Asegúrate de incluir el token de autenticación en el encabezado de la siguiente manera:

```
Authorization: tu_token_aqui
```

---
### Agradecimientos
Agradecemos a The Movie Database por proporcionar datos de películas.


### Contacto
Si tienes alguna pregunta o comentario, no dudes en ponerte en contacto conmigo a través de emilianomarott@gmail.com.