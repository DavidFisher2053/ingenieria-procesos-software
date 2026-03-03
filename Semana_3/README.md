
# Documento Técnico: Diseño y Aplicación de un Modelo de Ciclo de Vida del Software

**Programa:** Ingeniería de Sistemas  
**Asignatura:** Ingenieria de Procesos de Software 
**Nivel:** Pregrado  
**Estudiantes:** David Hernandez - Oscar Gutierrez   

---

## 1. Contexto del Proyecto
**Caso Seleccionado:** Sistema de Analítica de Datos Empresarial en la Nube (Arquitectura GCP).

El presente proyecto aborda el diseño metodológico para la construcción de un Sistema de Analítica de Datos Empresarial destinado a centralizar, procesar y explotar la información de una organización. Actualmente, la empresa enfrenta problemas de silos de datos, reportes manuales lentos y nula capacidad de análisis en tiempo real. 

Para resolver esto, se propone una arquitectura nativa en la nube utilizando **Google Cloud Platform (GCP)**. El sistema integrará flujos de datos estructurados y no estructurados mediante procesos **ETL/ELT**, utilizando **Cloud Pub/Sub** para la ingesta de eventos en tiempo real (streaming de transacciones/logs) y **BigQuery** como Data Warehouse centralizado y motor de análisis a gran escala. La naturaleza de este proyecto, que combina ingeniería de datos compleja con exploración analítica, exige un modelo de ciclo de vida del software que soporte alta incertidumbre inicial, iteraciones rápidas y validación continua de la calidad del dato.

---

## Parte 1: Análisis Comparativo

A continuación, se describen 4 modelos de ciclo de vida evaluando su viabilidad teórica para proyectos de software y datos:

#### Modelo 1: Cascada (Waterfall)
* **Descripción:** Enfoque lineal y secuencial donde cada fase (requisitos, diseño, implementación, pruebas, despliegue) debe completarse antes de pasar a la siguiente.
* **Ventajas:** Excelente control documental, hitos de facturación claros, fácil de gestionar si el alcance es inamovible.
* **Debilidades:** Rigidez absoluta ante cambios. En analítica de datos es fatal, ya que los problemas de calidad de datos suelen descubrirse en la fase de implementación, obligando a rehacer fases previas con alto costo.
* **Tipo de proyectos adecuados:** Sistemas de misión crítica o proyectos con requisitos estáticos y 100% predecibles.

#### Modelo 2: Espiral
* **Descripción:** Modelo impulsado por el riesgo que combina la naturaleza iterativa del prototipado con los aspectos controlados de la cascada. Se divide en ciclos (espirales) de planificación, análisis de riesgos, ingeniería y evaluación.
* **Ventajas:** Identificación y mitigación temprana de riesgos técnicos (ej. cuellos de botella en la ingesta de datos).
* **Debilidades:** Alta complejidad de gestión. Requiere expertos muy capacitados en evaluación de riesgos. Puede resultar costoso para proyectos de menor escala.
* **Tipo de proyectos adecuados:** Plataformas a gran escala, innovaciones tecnológicas sin precedentes en la empresa o sistemas con alto riesgo financiero/técnico.

#### Modelo 3: Scrum (Marco de trabajo Ágil)
* **Descripción:** Marco iterativo e incremental basado en ciclos cortos llamados *Sprints* (1 a 4 semanas). Fomenta la autoorganización del equipo, la entrega continua de valor y la adaptación a requisitos cambiantes.
* **Ventajas:** Alta adaptabilidad. Permite entregar incrementos funcionales (ej. primero un ETL batch, luego el streaming con Pub/Sub) para que el negocio vea valor rápido.
* **Debilidades:** Riesgo de "scope creep" (aumento descontrolado del alcance) si el Product Owner no prioriza bien. La documentación exhaustiva suele quedar en segundo plano.
* **Tipo de proyectos adecuados:** Proyectos de analítica, Big Data y desarrollo de producto donde los requisitos evolucionan según los hallazgos en los datos.

#### Modelo 4: Modelo Iterativo / Incremental
* **Descripción:** El sistema se desarrolla a través de ciclos repetidos (iteraciones) y en porciones más pequeñas a la vez (incrementos), permitiendo aprender del desarrollo de las partes anteriores del sistema.
* **Ventajas:** Entregas tempranas del núcleo del sistema (ej. un Data Warehouse básico en BigQuery antes de meter Machine Learning).
* **Debilidades:** Requiere una arquitectura inicial muy bien pensada para que los nuevos incrementos no rompan lo construido.
* **Tipo de proyectos adecuados:** Sistemas modulares donde se pueden agregar fuentes de datos o dashboards de forma progresiva.

#### Matriz Comparativa

| Criterio / Modelo | Cascada | Espiral | Scrum | Iterativo |
| :--- | :--- | :--- | :--- | :--- |
| **Flexibilidad** | Baja | Alta | Muy Alta | Alta |
| **Gestión de Riesgos** | Baja | Muy Alta | Media/Alta | Media |
| **Documentación** | Exhaustiva | Moderada | Ligera (Just enough) | Ligera a Moderada |
| **Participación del Usuario** | Al inicio y final | En las evaluaciones | Continua (Sprint Reviews) | Alta en cada incremento |
| **Time-to-market** | Lento | Medio | Rápido (Entregas parc.) | Medio |
| **Complejidad de Gestión**| Baja | Alta | Media | Media |

---

## Parte 2: Selección y Justificación

### 2.1 Modelo Seleccionado
**Modelo elegido:** CRISP-DM con SCRUM

### 2.2 Justificación Técnica y Estratégica

Scrum es un marco de trabajo ágil que facilita la gestión de proyectos complejos mediante ciclos cortos (sprints). En cada iteración se definen y ajustan requisitos, mejoras y correcciones, lo que permite entregar valor al cliente de forma continua y con alta capacidad de adaptación.
La metodología CRISP-DM complementa este enfoque al estructurar el ciclo de vida de la analítica de datos en seis fases: Comprensión del Negocio, Comprensión de los Datos, Preparación, Modelado, Evaluación y Despliegue. Cada sprint puede enfocarse en una o varias de estas fases, asegurando que el avance técnico esté alineado con los objetivos estratégicos.

* **Incertidumbre:** En proyectos de datos, a menudo no se sabe si los datos tienen la calidad suficiente hasta que se exploran.
    - **Scrum:** Permite ver resultados de forma temprana, lo que ayuda a definir mejor los requisitos con el cliente y accionar rápidamente cualquier corrección.
    - **CRISP-DM:** La **fase de Comprensión** de los Datos se integra en los primeros sprints, permitiendo identificar problemas de calidad y ajustar el backlog con base en hallazgos iniciales.
* **Riesgos:**
- Riesgo: Descubrir a mitad de un ciclo que los datos esten corruptos o sean inaccesibles.
    - **Scrum:** Uso de **Spikes** (tareas de investigación con tiempo limitado) para reducir incertidumbre y revisar fuentes de datos antes de comprometerse a construir un tablero.
    - **CRISP-DM:** La fase de **Preparación de los Datos** asegura que los datasets estén limpios y listos antes de pasar al modelado.

- Riesgo: Dar prioridad a otros aspectos y descuidar los **Pipeline de Datos** del Sistema.
    -**Scrum:** Incluir criterios de calidad de datos y documentación técnica en la **Definition of Done (DoD)** de cada incremento.
    -**CRISP-DM:** La fase de **Despliegue** contempla la implementación de pipelines robustos y su monitoreo continuo.

* **Tamaño del equipo:** Se requiere un grupo multidisciplinario no mayor a 9 personas y que incluya roles como Ingeniero de Datos, Científico de Datos y Desarrolladores de BI.
    - **Scrum:** Bajo el marco de Scrum se fomentará la **interfuncionalidad**, lo que permite que el equipo esté al tanto de cada avance y pueda asumir tareas de apoyo para evitar cuellos de botella si algún integrante se encuentra saturado.
    - **CRISP-DM:** Cada rol se vincula con fases específicas: Ingenieros de Datos en **Preparación de los Datos**, Científicos de Datos en **Modelado y Evaluación**, y Desarrolladores de BI en **Despliegue**. Sin embargo, todos colaboran transversalmente en la **Comprensión del Negocio** y la **Comprensión de los Datos**, asegurando que el conocimiento fluya entre disciplinas

* **Presupuesto:** 
    - **Scrum:** Permite hacer entregas desde la primera iteracion por tanto no es necesario invertir una enorme cantidad de dinero desde un primer momento y el **Product Owner** puede evaluar si el proyecto ya cuenta con las funcionalidades necesarias para detener la inversion.
    - **CRISP-DM:** La fase de **Evaluación** garantiza que cada entrega se valide frente a métricas de negocio y calidad de datos, optimizando el uso del presupuesto. Esto evita inversiones innecesarias en modelos o dashboards que no aporten valor real, permitiendo que los recursos se concentren en fases críticas como **Preparación** y **Despliegue**.

* **Contexto Organizacional:** 
    - **Scrum:** A través de la metodología Scrum se permitirá alinear los objetivos del negocio con la analítica generada por el sistema en desarrollo. En cada iteración, durante las **Sprint Reviews**, se presentarán resultados tangibles que aborden el problema de los silos de datos.
    - **CRISP-DM:** La **fase de Comprensión** del Negocio asegura que las preguntas analíticas estén directamente vinculadas con los objetivos estratégicos de la organización. Además, la fase de **Despliegue** permite que los resultados se integren en sistemas productivos y sean accesibles para diferentes áreas, reduciendo los silos y fomentando la adopción organizacional.

---

## Parte 3: Diseño del Modelo Aplicado

### 3.1 Fases del Modelo Adaptado al Proyecto

Se integrara CRISP-DM y Scrum tanto para construir la estructura metodologica del proyecto como para su gestion Iterativa e incremental

1. **Fase 1: Entendimiento del Negocio y Requisitos + Planificacion Inicial:** Se comprende la perspectiva de la empresa, entendiendo cuales son sus objetivos y limitaciones, alineando el "**que se quiere lograr**" con el "**como**". Lo anterior es posible evaluando los siguientes puntos:
    - **_Inventario de Recursos:_** Personal, Datos, Recursos Informaticos, Software
    - **_Requisitos y Restricciones:_** Requisitos del Proyecto, Permisos para Tratamiendo de Datos, Restriccion sobre Disponibilidad de Recursos, Restriccion Tecnologicas
    - **_Riesgos y Contingencias:_** Planes de contingencia, riesgos que puedan provocar el fracaso del proyecto.
    - **_Terminologia:_** Glosario con terminologia de la empresa y mineria de datos.
    - **_Costos y Beneficios:_** Analisis costo-beneficio sobre los beneficios que puede obtener la empresa en caso de tener exito.

2. **Fase 2: Comprension de los Datos + Sprint Planing:** Se refiere a todo lo relacionado con la adquisicion de los datos:
    - Listar las fuentes y describir los metodos que fueron utilizados para su obtencion.
    - Examinar sus propiedades incluyendo formato, cantidad, identidad, etc.
    - Realiza analisis sobre los datos (Distribucion de atributos clave, Relaciones entre pares de atributos, Propiedades de Subpoblaciones, etc.)
    - Verificar la calidad de los datos (Examinar si los datos son incompleto, si tienen errores y que tan comunes son)
    - Informe de Calidad de Datos con los resultados obtenidos de la verificacion de los datos y ante problemas de calidad descubiertos posibles soluciones.

3. **Fase 3: Preparacion de los Datos (ETL/ELT) + Desarrollo Iterativo (Sprints):** Se deciden los datos que seran utilizados para el analisis en base a criterios como son la calidad de los datos, relevancia para el proyecto o limitaciones tecnicas. Asi mismo:
    - Se limpian los datos al nivel requerido para las tecnicas de analisis que se determinaron en el proyecto y se genera un informe describiendo las acciones tomadas para solucionar los problemas de calidad en los datos.
    - Se realizan operaciones de preparacion de datos constructivas como **atributos derivados** o **registros generados**.
    - Se integran datos, combinando informacion de multiples bases de datos para la creacion de nuevos registros.
    
4. **Fase 4: Modelado + Daily Scrum:** Se selecciona la tecnica de modelado que usara para el proyecto y de ella se documenta y se registran los **supuestos** que tiene sobre los datos para evitar que la informacion obtenida sea poco confiable. A partir de haber definido la tecnica:
    - Se genera un diseño de pruebas con un conjunto de datos de entrenamiento y asi probar la calidad y validez de la informacion que se se obtenga.
    - Contruir el modelo con el conjunto de datos que se ha preparado.
    - Evaluar el modelo enumerando su cualidades y clasificando la calidad frente a otros modelos generados.

5. **Fase 5: Evaluacion (Dashboards/APIs) + Sprint Review:** Asegurar que los modelos sean utiles para la empresa, validando su calidad tecnica y revisando de forma completa el proyecto y definir si se implementan o se replantean nuevas iniciativas.

6. **Fase 6: Despliegue + Sprint Retrospective:** Se analizan los resultados de la evaluacion y se determinara tanto una estrategia de despliegue del proyecto como una estrategia para realizarle mantenimiento, lo anterior teniendo en cuenta todos los pasos necesarios y el como deben realizarse. Al finalizar el proyecto se redactara un informe final con los resultados obtenidos y se documentara toda la experiencia que se adquirio durante el desarrollo (Obstaculos, sugerencias, etc.).

### 3.2 Entregables y Artefactos por Fase

| Fase | Entregables (Resultados tangibles) | Artefactos Generados (Docs/Código) |
| :--- | :--- | :--- |
| Fase 1 | Definición de KPIs y alcance | Documento de Requisitos (Backlog), Diccionario de Datos preliminar |
| Fase 2 | Inventario de datos, criterios de limpieza | Sprint Backlog |
| Fase 3 | Pipelines de datos funcionales, datasets listos para el analisis | Scripts de ETL, Diagrama de Arquitectura de Datos, incremento del proyecto |
| Fase 4 | Modelos analíticos/predictivos | Notebooks de experimentación, Código de modelos entrenados |
| Fase 5 | Dashboards interactivos implementados | Modelos aprobados, Checklist de control de calidad, Acta de revision del proceso |
| Fase 6 | Sistema estable y monitorizado | Manual de usuario, Repositorio de código en producción, Logs de sistema, Reportes de rendimiento |

### 3.3 Roles y Responsabilidades
* **Product Owner / Líder de Negocio:** Define prioridades y valida KPIs.
* **Data Architect / Engineer:** Construye pipelines e infraestructura.
* **Data Scientist / Analyst:** Crea modelos y algoritmos.
* **BI Developer / Frontend:** Diseña dashboards y vistas de usuario.
* **Scrum Master / Project Manager:** Facilita el proceso y elimina bloqueos.

### 3.4 Métricas de Seguimiento (Ejecución del SDLC)
1. **Gestion del Proyecto**
    - **_Cumplimiento del Cronograma:_** Medir que las fasese de limpieza, modelado y visualizacion se completen en la fechas estipuladas.
    - **_Cumplimiento del Presupuesto:_** Controlar el gasto de nuestro proyecto evaluando el gasto real frente al planificado nos ayuda a ver la viabilidad de nuestro proyecto.
    - **_Ejecucion del Proyecto:_** El porcentaje de entregables completados, nos ayuda a valorar en que punto de maduracion se encuentra el proyecto

2. **Calidad y Datos**
    - **_Precision de los Datos:_** Es el grado en que los datos representan correctamente a los eventos u objetos del mundo real. Esta precision es medible a traves de herramientas como **Puntuacion F-1**, **Analisis Estadistico**, **Tecnicas de Muestreo**, etc.
     - **_Tiempo Ejecucion del Pipeline:_** Se refiere a la duracion total desde el inicio hasta el final de tareas como CI/CD y nos ayuda identificar cuellos de botella y a ajustar parametros que mejoren su eficiencia. Existen varias como **Run Duration**, **Cycle Time**, **Queue Time** entre otras.

3. **Impacto y Negocio**
    - **_Adopcion de Usuarios:_** Es la frecuencia de uso del modelo por parte de los usuarios finales.
    - **_Time to Insight:_** Mide la velocidad en que los datos crudos son transformados en informacion util y procesable para la toma de desiciones. Nos ayuda a acelarar la rentabilidad, la respuesta al cliente y optimizar la eficiencia operativa.

### 3.5 Gestión de Riesgos y Aseguramiento de Calidad (QA)
* **Gestión de Riesgos**
    - **_Identificacion de Riesgos:_** En la fase de Comprension de los Datos se identifican riesgos de calidad y accesibilidad. Los riesgos encontrados se documentan en el **Product Backlog** o son manejados mediante **Spikes**
    - **_Evaluacion y Priorización:_** Los riesgos son evaluados y priorizados por el **Product Owner** segun su impacto en los objetivos del negocio.
    - **_Mitigacion:_**
        - Implementar procesos de validacion y limpieza en la fase de **Preparacion de Datos**.
        - Planificar **Spikes** de exploracion de fuentes antes de compreter tareas en el sprint **Backlog**
        - Automatizar pruebas de calidad y monitoreo continuo.
        - Definir politicas de **Gobernanza de Datos** y redundancia de fuentes.
    - **_Monitoreo Continuo:_** En la fase de **Despliegue** se establecen metricas de monitoreo para detectar desviaciones en modelos y pipelines. A traves de los **Daily Scrum** se identifican riesgos emergentes.

### 3.6 Estrategia de Mantenimiento
Para este sistema es necesario aplicar una combinacion diferentes de enfoques para un mantenimiento continuo:
*   **Mantenimiento Preventivo:** Revisiones periodicas de pipelines, bases de datos y dashboards para evitar fallas.
    - Ejemplo: Auditorias semanales de calidad de datos y validacion de ETLs.
*   **Mantenimiento Evolutivo:** Adaptacion del sistema a nuevas necesidades de negocio o tecnologias.
    - Ejemplo: Incorporar nuevas fuentes de datos en el sistema.
*   **Mantenimiento Correctivo:** Resolucion rapida de incidencias detectadas.
    - Ejemplo: Ajustar un modelo que pierde precision tras un cambio en la fuente de datos.

### 3.7 Diagrama del Ciclo de Vida Aplicado
![Diagrama_CRISP_SCRUM](/Diagramas/diagrama_crisp_scrum.png)

---

## Parte 4: Simulación Ejecutiva

#### 4.1 Estimación de Alto Nivel
* **Esfuerzo estimado:** 2,000 horas.
* **Duración estimada:** 5 meses (10 Sprints de 2 semanas).
* **Equipo:** 1 PO, 1 Scrum Master, 2 Data Engineers, 1 BI Developer.

#### 4.2 Roadmap e Hitos del Proyecto

| Mes / Sprints | Hito Principal (Milestone) | Descripción Breve (GCP Stack) |
| :--- | :--- | :--- |
| **Mes 1** (Sp 1-2) | **Fundamentos y Batch ETL** | Configuración de IAM, Redes. Ingesta de datos históricos hacia BigQuery mediante procesos Batch. |
| **Mes 2** (Sp 3-4) | **MVP Visualización** | Creación de Vistas Materializadas en BigQuery. Entrega del primer Dashboard en Looker Studio con datos históricos. |
| **Mes 3** (Sp 5-6) | **Infraestructura Streaming** | Implementación de Cloud Pub/Sub y Dataflow para captura de eventos en tiempo real (ej. ventas/logs al instante). |
| **Mes 4** (Sp 7-10) | **Integración Total y Go-Live**| Unión de datos Batch y Streaming en dashboards en vivo. Pruebas de carga, capacitación y paso a Producción. |

#### 4.3 Indicadores Clave (KPIs) del Proyecto (Gestión)
1. **Adopción del Usuario:** >80% de los gerentes utilizando los nuevos dashboards semanalmente.
2. **Reducción de Tiempo de Reporte:** Pasar de semanas (reportes manuales) a disponibilidad de datos en < 5 minutos (gracias a Pub/Sub).
3. **Desviación de Presupuesto Cloud:** Mantener el gasto de infraestructura de GCP dentro de un +/- 15% del presupuesto estimado mensual.

#### 4.4 Principales Riesgos y Plan de Mitigación

| Riesgo Identificado | Prob. | Impacto | Estrategia de Mitigación |
| :--- | :--- | :--- | :--- |
| **Sobrecostos inesperados en BigQuery** | Alta | Alto | Configurar cuotas de facturación estrictas en GCP. Capacitar al equipo BI para no hacer consultas `SELECT *` no particionadas. |
| **Latencia alta en el streaming de Pub/Sub** | Media | Medio | Escalar horizontalmente los workers de Dataflow y optimizar la ventana de procesamiento (windowing). |
| **Cambios en las fuentes de origen (Schema Drift)** | Alta | Alto | Enviar mensajes malformados a una cola de errores (Dead-Letter Queue) en Pub/Sub para no detener el pipeline principal. |

---

## 5. Notas para la Presentación Ejecutiva (Anexo)
> *Recuerda que debes preparar una presentación de 15 minutos.*
* **Diapositiva 1-2:** Contexto y problema.
* **Diapositiva 3:** Matriz resumen de por qué se eligió el modelo X.
* **Diapositiva 4:** El Diagrama de cómo se ve el SDLC aplicado al proyecto de datos.
* **Diapositiva 5:** Roadmap e hitos (Línea de tiempo visual).
* **Diapositiva 6:** Principales riesgos.
* **Diapositiva 7:** Conclusiones (Cómo este ciclo asegura el éxito de la analítica empresarial).

---
*(Fin del documento)*