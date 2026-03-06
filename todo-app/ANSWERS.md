# Respuestas — Preguntas Técnicas

## 1) ¿Cuáles fueron los principales desafíos que enfrentaste al implementar las nuevas funcionalidades?

- Definir una arquitectura clara para una aplicación pequeña pero evaluable, separando responsabilidades entre UI, dominio y datos.
- Asegurar persistencia local consistente (operaciones CRUD) para que el estado se mantenga correctamente incluso después de reiniciar la app.
- Integrar categorías y filtros sin duplicar lógica, centralizando el filtrado de manera reactiva.
- Integrar Firebase Remote Config en un entorno híbrido (WebView) con valores por defecto y comportamiento estable en caso de estar offline o si falla la carga remota.
- Empaquetado móvil y entregables: generar un APK release firmado y dejar preparado el flujo para iOS (macOS/Xcode) con instrucciones reproducibles.

## 2) ¿Qué técnicas de optimización de rendimiento aplicaste y por qué?

- ChangeDetectionStrategy.OnPush para reducir ciclos innecesarios de detección de cambios y mejorar la respuesta de la UI.
- trackBy en ngFor para evitar re-render completo de listas cuando cambia un solo elemento.
- Filtrado reactivo con RxJS (combineLatest + map) para centralizar y optimizar el filtrado por estado y categoría.
- Persistencia con debounce para reducir escrituras frecuentes en el almacenamiento local y mejorar la fluidez al realizar acciones seguidas.
- Arranque no bloqueante usando valores por defecto de Remote Config, evitando que la UI dependa de la red para funcionar.

## 3) ¿Cómo aseguraste la calidad y mantenibilidad del código?

- Separación de responsabilidades (modelos, repositorios, servicios de almacenamiento, facade/estado y UI).
- Enfoque Repository + Facade para desacoplar la UI de los detalles de persistencia y Firebase.
- Tipado fuerte en TypeScript con modelos/contratos explícitos para reducir errores y mejorar legibilidad.
- Uso consistente de patrones de UI con Ionic (acciones claras, estados vacíos y comportamiento predecible).
- Documentación para reproducibilidad (README con prerequisitos, comandos de ejecución/build y evidencias).
