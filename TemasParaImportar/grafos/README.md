---
titulo: "GRAPHS_ICPC — Índice Maestro de Grafos para Competencia"
tipo: icpc-tema
categoria: grafos
estado: en-progreso
etiquetas: [icpc, icpc/tema, icpc/categoria/grafos]
creado: 2026-04-17
actualizado: 2026-04-17
---

# GRAPHS_ICPC — Índice Maestro

Guía completa de algoritmos de grafos para ICPC. Cada archivo es autocontenido con teoría, código C++17 comentado, ejemplos y trampas comunes.

---

## Mapa de archivos

| Archivo | Tema | Descripción |
|---------|------|-------------|
| `00_INTRODUCCION.md` | Fundamentos | Terminología, tipos de grafos, representaciones |
| `01_RECETA_UNIVERSAL.md` | Meta-estrategia | Cómo identificar y resolver cualquier problema de grafo |
| `02_BFS.md` | BFS | Búsqueda en anchura, variantes, rejilla 2D, 0-1 BFS |
| `03_DFS.md` | DFS | Búsqueda en profundidad, timestamps, ciclos, topológico |
| `04_DIJKSTRA.md` | Dijkstra | Camino más corto con pesos ≥ 0, heap, reconstrucción |
| `05_BELLMAN_FORD.md` | Bellman-Ford | Pesos negativos, detección de ciclos negativos, SPFA |
| `06_FLOYD_WARSHALL.md` | Floyd-Warshall | Todos los pares, transitive closure |
| `07_MST.md` | MST | Kruskal, Prim, Maximum Spanning Tree |
| `08_COMPONENTES.md` | Componentes | Union-Find (DSU), componentes conexas |
| `09_SCC.md` | SCC | Kosaraju, Tarjan, 2-SAT, grafo de condensación |
| `10_TOPOLOGICO.md` | Topológico | Orden topológico, Kahn, DP en DAG |
| `11_PUENTES_ARTICULACION.md` | Puentes/Articulación | Low-link, puentes, puntos de articulación |
| `12_BIPARTICION.md` | Bipartición | 2-coloring, matching, Hopcroft-Karp, König |
| `13_FLUJO.md` | Flujo máximo | Dinic, min-cut, aplicaciones |
| `14_ARBOLES_ESPECIALES.md` | Árboles avanzados | LCA, Binary Lifting, HLD, Centroid |
| `15_REPRESENTACION.md` | Representación | Lista adj, matriz, edge list — cuándo usar cada una |
| `16_IDENTIFICACION_RAPIDA.md` | Identificación | Árbol de decisión, frases clave, mapeo enunciado→algoritmo |
| `17_ERRORES_CONCEPTUALES.md` | Errores | 15+ errores con síntoma, causa y fix |
| `18_CASOS_EDGE.md` | Edge cases | N=0,1,2; grafo vacío, completo, árbol, ciclos |
| `19_OPTIMIZACIONES.md` | Optimizaciones | Binary lifting, DSU rollback, técnicas avanzadas |
| `20_CHEAT_SHEET.md` | Cheat Sheet | Referencia ultra-densa, una página, pre-submit checklist |

---

## Cómo leer según tu nivel

### Principiante (nunca resolviste problemas de grafos)
1. `00_INTRODUCCION.md` — Aprende el vocabulario
2. `15_REPRESENTACION.md` — Cómo codificar un grafo
3. `02_BFS.md` — Tu primer algoritmo
4. `03_DFS.md` — Complementa BFS
5. `08_COMPONENTES.md` — Union-Find básico
6. `16_IDENTIFICACION_RAPIDA.md` — Cómo reconocer qué usar

### Intermedio (resolvés ~1200-1400 CF)
1. `01_RECETA_UNIVERSAL.md` — Marco mental para cualquier problema
2. `04_DIJKSTRA.md` — Camino más corto con pesos
3. `07_MST.md` — Árboles de expansión mínima
4. `10_TOPOLOGICO.md` — Orden y DP en DAG
5. `05_BELLMAN_FORD.md` — Pesos negativos
6. `09_SCC.md` — Componentes fuertemente conexas

### Avanzado (apuntás a 1600+)
1. `11_PUENTES_ARTICULACION.md` — Low-link
2. `12_BIPARTICION.md` — Matching
3. `13_FLUJO.md` — Flujo máximo con Dinic
4. `14_ARBOLES_ESPECIALES.md` — LCA, HLD, Centroid
5. `19_OPTIMIZACIONES.md` — Técnicas avanzadas
6. `06_FLOYD_WARSHALL.md` — Todos los pares

---

## Mapa de dependencias

```
00_INTRODUCCION
    │
    ├── 15_REPRESENTACION  ←── base para todo
    │
    ├── 02_BFS ──────────────────────────────────┐
    │    └── 0-1 BFS (puente a Dijkstra)         │
    │                                             │
    ├── 03_DFS ──────────────────────────────────┤
    │    ├── 09_SCC (Tarjan)                      │
    │    ├── 10_TOPOLOGICO (DFS-based)            │
    │    └── 11_PUENTES_ARTICULACION             │
    │                                             │
    ├── 04_DIJKSTRA ──────────────────────────── │ ──→ 13_FLUJO (BFS en Dinic)
    │    └── requiere: BFS como base intuitiva    │
    │                                             │
    ├── 05_BELLMAN_FORD ──────────────────────── ┤
    │    └── (alternativa a Dijkstra, pesos neg)  │
    │                                             │
    ├── 06_FLOYD_WARSHALL (independiente, N³)     │
    │                                             │
    ├── 07_MST ──────────────────────────────────┘
    │    └── requiere: 08_COMPONENTES (DSU)
    │
    ├── 08_COMPONENTES (DSU) ←── requerido por 07_MST
    │
    ├── 09_SCC ←── requiere: 03_DFS
    │    └── → 2-SAT
    │
    ├── 10_TOPOLOGICO ←── requiere: 03_DFS o BFS
    │    └── → DP en DAG
    │
    ├── 11_PUENTES_ARTICULACION ←── requiere: 03_DFS
    │
    ├── 12_BIPARTICION ←── requiere: 02_BFS
    │    └── → 13_FLUJO (matching como flujo)
    │
    ├── 13_FLUJO ←── requiere: 02_BFS (Dinic usa BFS)
    │
    └── 14_ARBOLES_ESPECIALES ←── requiere: 02_BFS o 03_DFS
         ├── LCA + Binary Lifting
         ├── HLD → Segment Tree (externo)
         └── Centroid Decomposition
```

---

## Complejidades de un vistazo

| Algoritmo | Tiempo | Espacio | N máximo típico |
|-----------|--------|---------|-----------------|
| BFS | $O(N+M)$ | $O(N+M)$ | $10^6$ |
| DFS | $O(N+M)$ | $O(N+M)$ | $10^6$ |
| Dijkstra | $O(M \log N)$ | $O(N+M)$ | $10^5$ |
| Bellman-Ford | $O(N \cdot M)$ | $O(N+M)$ | $10^3$ |
| Floyd-Warshall | $O(N^3)$ | $O(N^2)$ | 500 |
| Kruskal | $O(M \log M)$ | $O(N+M)$ | $10^5$ |
| Prim (heap) | $O(M \log N)$ | $O(N+M)$ | $10^5$ |
| DSU | $O(\alpha(N))$ | $O(N)$ | $10^6$ |
| Kosaraju | $O(N+M)$ | $O(N+M)$ | $10^5$ |
| Tarjan SCC | $O(N+M)$ | $O(N+M)$ | $10^5$ |
| Topológico (Kahn) | $O(N+M)$ | $O(N+M)$ | $10^5$ |
| Bridges/Artic. | $O(N+M)$ | $O(N+M)$ | $10^5$ |
| Dinic (flujo) | $O(V^2 E)$ | $O(N+M)$ | $10^3$ |
| LCA Binary Lifting | $O(N \log N)$ prep | $O(N \log N)$ | $10^5$ |

---

## Fuentes canónicas

- **CPH** = Competitive Programmer's Handbook (Laaksonen) — capítulos 11-20
- **CP4** = Competitive Programming 4 (Halim) — capítulos 4-8
- **CPA** = CP-Algorithms (cp-algorithms.com)

---

## 🔗 Relacionado

- [[icpc-dashboard]]
- [[icpc/temas/bfs]]
- [[icpc/temas/dijkstra]]
- [[icpc/temas/dsu]]
