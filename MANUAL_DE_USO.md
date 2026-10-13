# Manual de Uso de Equilibria
### *Evaluador y Entrenador de Buenos Hábitos Saludables*

---

## 1. Introducción y Propósito
**Equilibria** es una plataforma interactiva, privada y gamificada diseñada para medir y transformar los hábitos diarios en los cuatro pilares fundamentales del bienestar humano:
1. **Sueño Reparador** (recuperación neurológica, memoria y energía vital).
2. **Alimentación Consciente** (combustible biológico, hidratación y balance celular).
3. **Salud Mental & Calma** (gestión del estrés, presencia y conexiones afectivas).
4. **Ejercicio & Movimiento** (fuerza, salud cardiovascular y liberación de endorfinas).

A diferencia de las herramientas estáticas que solo entregan diagnósticos numéricos, Equilibria está diseñada bajo la premisa de **inducir la acción inmediata**: convertir los puntos débiles detectados en micro-retos ejecutables en menos de 60 segundos.

---

## 2. Privacidad y Funcionamiento Local
- **Sin registros ni contraseñas:** No necesitas crear una cuenta ni ingresar correos electrónicos.
- **Almacenamiento Local (Local-First):** Todas tus respuestas, historial de puntuaciones, racha y compromisos se guardan exclusivamente en el `localStorage` de tu navegador.
- **Tus datos nunca salen de tu dispositivo:** No existe sincronización con servidores externos ni rastreo de identidad.

---

## 3. Guía Paso a Paso de las Funcionalidades

### A. Evaluación de Hábitos (Test de los 4 Pilares)
1. **Inicio personalizado:** En la pantalla principal, introduce tu nombre o alias (opcional) y pulsa **"Iniciar Evaluación"**.
2. **Estructura del test:** Consta de 16 preguntas estructuradas (4 por cada pilar), evaluadas en una escala del 1 al 4.
3. **Atajos de teclado rápidos:**
   - Pulsa las teclas numéricas `1`, `2`, `3` o `4` para seleccionar tu respuesta instantáneamente.
   - Pulsa `Enter` para avanzar a la siguiente pregunta.
   - Pulsa la flecha izquierda `←` para volver a la pregunta anterior.
4. **Guardado automático en curso:** Si cierras la pestaña por error a mitad de la prueba, al regresar verás el botón **"Continuar test en curso"**.

### B. Diagnóstico y Gráfico de Simetría Vital (Radar)
Al concluir las 16 preguntas, la aplicación calcula:
- **Puntuación Global (0 a 100%):** Promedio armónico de tu estado actual.
- **Gráfico Radial de Simetría Vital:** Muestra el polígono de tu equilibrio frente a la meta saludable recomendada del 80%.
- **Tu Arquetipo de Bienestar:** Un perfil narrativo (ej. *El Navegante Adaptativo*, *El Guardián del Descanso*, etc.) que describe tus fortalezas y sesgos actuales.
- **Desafío Inmediato Prioritario:** La aplicación detecta tu pilar más bajo y te propone una acción directa para romper la inercia sin postergarla.
- **Plan de Acción de 7 Días:** Recomendaciones paso a paso organizadas de menor a mayor dificultad.

### C. Centro de Retos y Hábitos en Acción (*Quests Hub*)
Ubicado en la pestaña **"Retos & Misiones"**:
- **Sistema de Niveles (Rangos de Maestría):**
  - *Nivel 1: Iniciado del Bienestar* (0 - 119 XP)
  - *Nivel 2: Explorador de Hábitos* (120 - 349 XP)
  - *Nivel 3: Guardián del Equilibrio* (350 - 749 XP)
  - *Nivel 4: Maestro Vital* (750 - 1399 XP)
  - *Nivel 5: Titán de la Longevidad* (1400+ XP)
- **Racha de Días Consecutivos (🔥):** Mantén encendida la llama realizando al menos una acción o reto cada día.
- **Retos Diarios por Pilar:** Misiones concretas como *Atardecer Digital* (dejar pantallas 30 min antes de dormir), *Mitad del Plato Verde*, o *Micro-dosis de Pasos*.
- **Completar Reto:** Pulsa **"¡Lo cumplí!"** para sumar puntos de experiencia (XP), activar confeti y registrar tu avance en la base de datos local.

### D. Micro-Acciones Inmediatas de 60 Segundos (*Do It Now*)
Herramientas activas diseñadas para practicarse en pantalla ahora mismo:
1. **Respiración Guiada 4-7-8:** Animación sincrónica con guía sonora (Inhala 4s, Sostén 7s, Exhala 8s) que calma el sistema nervioso autónomo en 3 ciclos (+35 XP).
2. **Vaso de Agua Consciente:** Recordatorio guiado para levantarte y beber 350-500 ml de agua fresca (+30 XP).
3. **Reset Postural de 60s/90s:** Secuencia de 3 estiramientos de cuello, apertura de caja torácica y torsión espinal suave guiados con temporizador (+30 XP).
4. **Detox Visual 20-20-20:** Temporizador de 20 segundos enfocando un objeto a 6 metros de distancia para descansar la vista de pantallas (+25 XP).

### E. Pacto de Honor (Contrato Personal de Compromiso)
- La psicología conductual demuestra que plasmar un compromiso por escrito eleva drásticamente la adherencia.
- En la sección del pacto, selecciona tus 2 o 3 compromisos irrenunciables, ingresa tu firma y pulsa **"Firmar Mi Pacto de Honor"**.
- Recibirás un **Certificado Oficial de Compromiso Activo** (+75 XP) que puedes copiar o compartir.

### F. Comparativas de Progreso e Historial
- **Gráficos Comparativos:** Compara tu última evaluación frente a evaluaciones históricas anteriores para medir cómo tus hábitos han evolucionado.
- **Historial Completo:** Lista cronológica con fechas, puntuaciones y detalles de respuestas pasadas.
- **Exportación en JSON:** Puedes descargar una copia de seguridad en archivo `.json` para respaldar o restaurar tus datos.

### G. Exportación de Reporte a PDF e Impresión
- En la vista de resultados, pulsa **"Exportar a PDF"** para generar automáticamente un documento maquetado de alta resolución con tus gráficos, desglose de pilares, arquetipo y plan de 7 días.
- También dispones del botón **"Imprimir"** con estilos CSS optimizados para papel y formato A4.

---

## 4. Opciones de Configuración y Accesibilidad
- **Selector de Idioma:** Alterna entre Español (`ES`) e Inglés (`EN`) desde la esquina superior derecha.
- **Modo Claro / Modo Oscuro:** Pulsa el icono de sol/luna para cambiar el tema en cualquier momento.
- **Efectos de Sonido:** Activa o desactiva las campanadas de logros y arpegios generados matemáticamente mediante el icono de altavoz en el Centro de Retos.

---

## 5. Resumen de Atajos y Consejos Prácticos
| Acción | Atajo o Método |
| :--- | :--- |
| Seleccionar opción 1 a 4 | Teclas `1`, `2`, `3`, `4` |
| Siguiente pregunta | Tecla `Enter` |
| Pregunta anterior | Flecha `←` |
| Ver centro de retos rápido | Clic en el indicador de racha (`🔥`) de la cabecera |
| Pausa inmediata de calma | Clic en botón "Acción Inmediata 60s" |
| Descargar reporte | Clic en "Exportar a PDF" en Resultados |
