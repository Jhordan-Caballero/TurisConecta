# TurisConecta Arequipa: backend

API en FastAPI con MongoDB, empaquetada con Docker. Conecta turistas con pobladores, guías y artesanos; arma planes de viaje dentro del presupuesto y reparte las reservas de forma equitativa.

## Puesta en marcha

```bash
cp backend/.env.example backend/.env   # y cambia JWT_SECRET
docker compose up --build
```

- API: http://localhost:8000
- Documentación interactiva: http://localhost:8000/docs
- MongoDB: localhost:27017 (para herramientas como Compass)

Pruebas de la lógica de negocio (no necesitan MongoDB):

```bash
docker compose run --rm api pytest
```

## Estructura

```
turisconecta/
├── docker-compose.yml
└── backend/
    ├── Dockerfile
    ├── requirements.txt
    ├── .env.example
    ├── app/
    │   ├── main.py            # app de FastAPI, índices al arrancar
    │   ├── config.py          # variables de entorno
    │   ├── database.py        # conexión a MongoDB y conversiones
    │   ├── security.py        # bcrypt, JWT y roles
    │   ├── consultas.py       # consultas compartidas por las rutas
    │   ├── routers/           # auth, servicios, itinerario, reservas, valoraciones, impacto
    │   ├── models/            # esquemas Pydantic de entrada
    │   └── modules/           # lógica pura: itinerarios, asignador, reservas, ranking, impacto, demanda
    └── tests/                 # pruebas de la lógica
```

Los módulos de `modules/` no importan FastAPI ni MongoDB. Así se prueban solos y las reglas de negocio quedan separadas de la capa HTTP.

## Endpoints

| Método | Ruta | Quién | Función |
|---|---|---|---|
| POST | `/auth/registro` | público | Crear cuenta (turista o poblador) |
| POST | `/auth/login` | público | Iniciar sesión, devuelve JWT |
| GET | `/auth/me` | autenticado | Usuario actual |
| POST | `/servicios` | poblador | Registrar un servicio |
| GET | `/servicios` | público | Listar y filtrar (categoría, localidad, precio, personas, orden por reputación) |
| GET | `/servicios/mios` | poblador | Sus servicios |
| POST | `/itinerario` | turista | Generar el plan de viaje |
| POST | `/reservas` | turista | Validar, calcular precio y guardar una reserva |
| GET | `/reservas` | autenticado | Reservas propias (turista) o recibidas (poblador) |
| POST | `/reservas/{id}/cancelar` | dueño | Cancelar antes de la fecha de inicio |
| POST | `/valoraciones` | turista | Valorar una reserva terminada (una sola vez) |
| GET | `/valoraciones` | autenticado | Valoraciones propias o recibidas |
| GET | `/impacto` | autenticado | Ingresos y comparación con agencia, por localidad y por poblador |
| GET | `/impacto/demanda` | autenticado | Temporada pico y localidades más visitadas (pandas) |

Un poblador que consulta `/impacto` solo ve su propio reporte.

## Reglas de negocio

**Precio.** El precio de un servicio es por persona (por noche en hospedaje). El precio final es `precio × personas × unidades × factor de temporada`. El factor es 1.25 en enero, junio, julio, agosto y diciembre, y 1.0 en el resto del año. Se aplica día por día.

**Fechas.** `fecha_fin` es el día de salida y no se cuenta. Un hospedaje del 10 al 12 ocupa las noches del 10 y del 11. Guiados, gastronomía y artesanías se reservan por un solo día (`fecha_fin = fecha_inicio + 1`).

**Capacidad y cruces.** Se verifica el día más lleno del rango, no solo el total. Un turista no puede tener dos reservas confirmadas que se crucen.

**Plan de viaje.** Elige primero el alojamiento para todo el viaje (si son 2 días o más). Después elige una actividad por día, priorizando las que coinciden con los intereses y evitando repetir. El gasto acumulado más lo que falta por pagar nunca supera el presupuesto. Si no alcanza, responde 422 con el monto mínimo estimado.

**Reparto equitativo.** Entre opciones equivalentes gana el poblador con menos reservas recibidas. Si hay empate, rota: recibe primero quien hace más tiempo no recibe asignaciones.

**Reputación (0 a 100).** 60 % promedio de valoraciones, 25 % cantidad de reseñas (satura con el tiempo) y 15 % antigüedad (tope de 5 años). Los pesos están en `modules/ranking.py`.

**Impacto.** Compara lo que recibe la comunidad en venta directa (menos `COMISION_PLATAFORMA`) con lo que se quedaría una agencia (menos `COMISION_AGENCIA`). Ambos valores son supuestos de negocio y se ajustan en `.env`.

## Notas

- La comprobación de capacidad y la escritura de la reserva no son atómicas. Con poca concurrencia no hay problema; con mucha carga conviene usar transacciones de MongoDB sobre un replica set.
- Las fechas se guardan como `datetime` a medianoche UTC, porque MongoDB no tiene tipo fecha puro.
