# Guía Maestra: Programación Dinámica para ICPC

> **Fuentes**: CP4 §3.5 (Halim, Felix, Suhendry) · CPH Cap. 7 (Laaksonen) · DP Handbook (Rascó Galván)  
> **Propósito**: Aprender DP desde cero hasta nivel competencia en 10–15 horas de estudio profundo.  
> **Competencia objetivo**: ICPC / Gran Premio MX 2026

---

## Cómo navegar esta carpeta

### Ruta de estudio recomendada (10–15 horas)

```
DÍA 1 (3–4 hrs): Fundamentos sólidos
  1. 00_INTRODUCCION.md        ← Entiende por qué DP funciona (1 hr)
  2. 09_TOP_DOWN_vs_BOTTOM_UP.md ← Elige tu arma (45 min)
  3. 01_RECETA_UNIVERSAL.md    ← Tu protocolo de ataque (1 hr)

DÍA 2 (4–5 hrs): Patrones esenciales (los que más aparecen)
  4. 02_MOCHILA.md             ← El patrón más importante (1.5 hrs)
  5. 06_SUMAS_SUBCONJUNTOS.md  ← Variante directa de Mochila (45 min)
  6. 04_CADENAS.md             ← LCS + Edit Distance (1 hr)
  7. 07_CONTEO_COMBINATORIOS.md ← Contar caminos, formas (45 min)

DÍA 3 (3–4 hrs): Patrones avanzados + Debugging
  8. 03_INTERVALOS.md          ← DP en rangos (1 hr)
  9. 05_ARBOLES.md             ← DP en árboles (45 min)
  10. 10_ERRORES_CONCEPTUALES.md ← Evita los errores clásicos (30 min)
  11. 11_CASOS_EDGE.md          ← Debugging sistemático (30 min)
  12. 08_OPTIMIZACIONES.md      ← Si hay tiempo (45 min)

ANTES DEL CONCURSO (30 min):
  13. 12_CHEAT_SHEET.md         ← Llévala impresa o memorizada
```

---

## Índice de archivos

| Archivo | Tema | Prioridad | Tiempo estudio |
|---------|------|-----------|---------------|
| `00_INTRODUCCION.md` | Qué es DP, por qué funciona, los dos pilares | 🔴 Crítica | 60 min |
| `01_RECETA_UNIVERSAL.md` | Protocolo paso a paso para cualquier problema DP | 🔴 Crítica | 60 min |
| `02_MOCHILA.md` | 0/1, ilimitada, variantes, optimización de espacio | 🔴 Crítica | 90 min |
| `03_INTERVALOS.md` | DP en rangos [i,j], Matrix Chain, Cutting Sticks | 🟡 Alta | 60 min |
| `04_CADENAS.md` | LCS, Edit Distance, LIS, variantes de strings | 🟡 Alta | 60 min |
| `05_ARBOLES.md` | DP en árboles, rerooting, Independent Set | 🟡 Alta | 45 min |
| `06_SUMAS_SUBCONJUNTOS.md` | Subset Sum, Partition, Coin Change | 🔴 Crítica | 45 min |
| `07_CONTEO_COMBINATORIOS.md` | Contar formas, paths, Catalan, Fibonacci | 🟡 Alta | 45 min |
| `08_OPTIMIZACIONES.md` | Convex Hull Trick, Monotone Queue, SOS, Bitmask | 🟢 Media | 45 min |
| `09_TOP_DOWN_vs_BOTTOM_UP.md` | Cuándo usar cada estilo, trade-offs profundos | 🔴 Crítica | 45 min |
| `10_ERRORES_CONCEPTUALES.md` | Los 8 errores más comunes en concursos | 🔴 Crítica | 30 min |
| `11_CASOS_EDGE.md` | Edge cases, debugging sistemático | 🟡 Alta | 30 min |
| `12_CHEAT_SHEET.md` | Referencia rápida para concurso | 🔴 Crítica | 15 min |

---

## Mapa de dependencias

```
00_INTRODUCCION
       ↓
09_TOP_DOWN_vs_BOTTOM_UP ─────────────────┐
       ↓                                   │
01_RECETA_UNIVERSAL                        │
       ↓                                   │
   ┌───┴──────────────┐                   │
   ↓                   ↓                   │
02_MOCHILA        06_SUMAS_SUBCONJUNTOS    │
   ↓                   ↓                   │
03_INTERVALOS     04_CADENAS               │
   ↓                   ↓                   ↓
05_ARBOLES        07_CONTEO_COMBINATORIOS  │
   └───────────────────┴───────────────────┘
                        ↓
               08_OPTIMIZACIONES
                        ↓
            10_ERRORES + 11_CASOS_EDGE
                        ↓
               12_CHEAT_SHEET
```

---

## Los 9 patrones que debes dominar

| # | Patrón | Archivo | Complejidad típica |
|---|--------|---------|-------------------|
| 1 | Coin Change / Mínima cobertura | `02_MOCHILA.md` | $O(nV)$ |
| 2 | 0-1 Knapsack | `02_MOCHILA.md` | $O(nW)$ |
| 3 | Longest Increasing Subsequence | `04_CADENAS.md` | $O(n^2)$ / $O(n \log n)$ |
| 4 | Longest Common Subsequence | `04_CADENAS.md` | $O(nm)$ |
| 5 | Edit Distance | `04_CADENAS.md` | $O(nm)$ |
| 6 | Paths in Grid | `07_CONTEO_COMBINATORIOS.md` | $O(n^2)$ |
| 7 | Interval DP (Matrix Chain) | `03_INTERVALOS.md` | $O(n^3)$ |
| 8 | Subset Sum / Partition | `06_SUMAS_SUBCONJUNTOS.md` | $O(nS)$ |
| 9 | Bitmask DP / TSP | `08_OPTIMIZACIONES.md` | $O(2^n \cdot n^2)$ |

---

## Señales de alerta: "Esto es DP"

Cuando veas estas palabras en un problema, piensa inmediatamente en DP:

- **"mínimo número de..."** → Coin Change, Edit Distance
- **"máximo valor/suma..."** → Knapsack, Range Sum
- **"¿es posible...?"** → Subset Sum, reachability
- **"¿cuántas formas de...?"** → Counting DP, Paths in Grid
- **"secuencia más larga..."** → LIS, LCS
- **"partición óptima..."** → Interval DP
- **"tour que minimice..."** → TSP con Bitmask
- **"sin exceder capacidad..."** → Knapsack

---

## Garantía de correctitud de DP

Un problema tiene solución DP correcta si y solo si cumple:

1. **Subestructura óptima**: la solución óptima a un problema grande se construye a partir de soluciones óptimas a subproblemas más pequeños.

2. **Solapamiento de subproblemas**: el mismo subproblema aparece múltiples veces en la recursión.

Si no se cumplen ambas condiciones, DP podría dar resultados incorrectos o no ser la mejor técnica.

---

## Referencias cruzadas con otros temas

- `[[icpc/temas/grafos-bfs-dfs]]` — DP en grafos usa BFS/DFS como subestructura
- `[[icpc/temas/union-find]]` — útil en variantes de DP sobre conjuntos
- `[[repaso/guia-grafos-concurso]]` — guía conceptual de grafos
- `[[icpc-dashboard]]` — estado de entrenamiento

---

*Fuentes: CP4 §3.5 · CPH Cap. 7 · Rascó Galván (DP Handbook)*
