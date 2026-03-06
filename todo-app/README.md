# Prueba Técnica Accenture — To-Do App (Ionic + Angular + Cordova)

Aplicación híbrida de tipo To-Do desarrollada con Ionic + Angular y empaquetada con Cordova para Android/iOS.  
Incluye persistencia local, categorización y filtrado de tareas, y feature flags usando Firebase Remote Config.

## Funcionalidades implementadas

- Crear tareas
- Marcar tareas como completadas
- Eliminar tareas (habilitable/deshabilitable por feature flag)
- Categorías (asignación al crear) + filtrado por categoría (habilitable/deshabilitable por feature flag)
- Filtro por estado: Todas / Activas / Completadas
- Persistencia local con Ionic Storage
- Feature flags con Firebase Remote Config:
  - `enable_categories`
  - `enable_delete`
- Interfaz minimalista optimizada para uso móvil (componentes Ionic y acción de swipe)

## Arquitectura (enfoque limpio)

Estructura por responsabilidades:

- `src/app/core/`
  - `models/` (modelos de dominio: Task, Category)
- `src/app/domain/`
  - `repositories/` (contratos de repositorios)
- `src/app/data/`
  - `repositories/` (implementaciones de repositorios)
  - `storage/` (persistencia local con Ionic Storage)
  - `firebase/` (servicio de Remote Config)
- `src/app/presentation/`
  - `state/` (Facade para casos de uso consumidos por la UI)
- `src/app/home/`
  - UI (HomePage)

La UI consume un Facade, que delega en capas de dominio/datos. La persistencia y los feature flags están aislados en servicios para mantener la UI simple y testeable.

## Requisitos

- Node.js + npm
- Ionic CLI
- Cordova CLI
- Java JDK (build Android)
- Android SDK + Build Tools
- ADB (opcional, para instalar en dispositivo)

## Instalación y ejecución

Desde la raíz del proyecto:

```bash
npm install
ionic serve
```
