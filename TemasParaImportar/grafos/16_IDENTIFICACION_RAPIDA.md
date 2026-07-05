---
titulo: "Identificación Rápida — Síntoma → Algoritmo"
tipo: icpc-tema
categoria: grafos
estado: en-progreso
etiquetas: [icpc, icpc/tema, icpc/categoria/grafos]
fuente-cph: "Cap. 11-20"
fuente-cp4: "§4.1-4.9"
creado: 2026-04-17
actualizado: 2026-04-17
---

# Identificación Rápida — Síntoma → Algoritmo

> Para consulta durante el concurso. Leer el enunciado y buscar el patrón aquí.

---

## 1. Árbol de Decisión Visual Completo

```
¿El problema involucra relaciones entre entidades?
├── NO → No es (claramente) un problema de grafos
└── SÍ → ¿Qué tipo de relaciones?

    ¿Las relaciones son simétricas (si A→B entonces B→A)?
    ├── SÍ → Grafo NO DIRIGIDO
    └── NO → Grafo DIRIGIDO
    
    ¿Las relaciones tienen costos/pesos/distancias?
    ├── NO → Grafo NO PONDERADO
    └── SÍ → Grafo PONDERADO

GRAFO NO PONDERADO:
    ¿Qué pregunta el problema?
    ├── "¿Mínimos pasos/saltos/movimientos de A a B?"
    │   └── → BFS estándar
    │
    ├── "¿Puedes llegar de A a B?" / "¿Están conectados?"
    │   └── → BFS/DFS/DSU
    │
    ├── "¿Cuántos grupos/islas/componentes?"
    │   └── → BFS/DFS repetido o DSU
    │
    ├── "¿Es posible ordenar/secuenciar respetando dependencias?"
    │   └── → Topológico (Kahn) → si order.size() < N: imposible
    │
    ├── "¿Es bipartito?" / "¿Se puede 2-colorear?"
    │   └── → BFS 2-coloring
    │
    └── "¿Hay ciclo?"
        └── → DFS con 3-coloring (dirigido) / DFS con parent (no dirigido)

GRAFO PONDERADO:
    ¿Qué pregunta el problema?
    ├── "¿Distancia mínima de A a B?" (pesos ≥ 0)
    │   └── → Dijkstra
    │
    ├── "¿Distancia mínima?" (pesos negativos posibles)
    │   └── → Bellman-Ford
    │
    ├── "¿Distancia mínima entre TODOS los pares?" (N ≤ 500)
    │   └── → Floyd-Warshall
    │
    ├── "¿Conectar todos con mínimo costo total?"
    │   └── → MST → Kruskal o Prim
    │
    └── "¿Cuánto 'flujo' puede pasar de S a T?"
        └── → Flujo Máximo → Dinic

GRAFO DIRIGIDO (sin pesos necesariamente):
    ¿Qué pregunta el problema?
    ├── "¿Grupos donde todos pueden alcanzarse mutuamente?"
    │   └── → SCC (Kosaraju o Tarjan)
    │
    ├── "¿Orden de tareas/cursos respetando prerrequisitos?"
    │   └── → Topológico
    │
    ├── "¿Hay ciclo dirigido?"
    │   └── → DFS con 3-coloring
    │
    └── "¿Satisfacer condiciones booleanas del tipo 'A o B'?"
        └── → 2-SAT → SCC

ÁRBOL:
    ¿Qué pregunta el problema?
    ├── "¿Ancestro común más bajo de u y v?" / "¿Distancia entre u y v?"
    │   └── → LCA con Binary Lifting
    │
    ├── "Suma/min/max en el camino entre u y v"
    │   └── → HLD + Segment Tree
    │
    └── "Contar pares a distancia K" / problemas de distancias
        └── → Centroid Decomposition

GRAFO NO DIRIGIDO (estructural):
    ¿Qué pregunta el problema?
    ├── "¿Cuál arista es crítica (su eliminación desconecta)?"
    │   └── → Puentes (Low-Link DFS)
    │
    ├── "¿Cuál nodo es crítico (su eliminación desconecta)?"
    │   └── → Puntos de Articulación (Low-Link DFS)
    │
    └── "¿Máximo emparejamiento en dos grupos?"
        └── → Matching Bipartito (Kuhn o Hopcroft-Karp)
```

---

## 2. Tabla Grande: Síntoma → Algoritmo

| Frase del enunciado | Algoritmo | Complejidad |
|--------------------|-----------|-------------|
| "mínimo número de pasos/movimientos" | BFS | $O(N+M)$ |
| "mínima distancia sin costos" | BFS | $O(N+M)$ |
| "camino más corto", pesos ≥ 0 | Dijkstra | $O(M \log N)$ |
| "camino más corto", pesos negativos | Bellman-Ford | $O(N \cdot M)$ |
| "distancia entre todos los pares", N ≤ 500 | Floyd-Warshall | $O(N^3)$ |
| "ciclo negativo" / "arbitrage" | Bellman-Ford | $O(N \cdot M)$ |
| "conectar todos los nodos mínimo costo" | MST (Kruskal) | $O(M \log M)$ |
| "red de comunicación mínima" | MST | $O(M \log M)$ |
| "¿están conectados?" | DSU o BFS | $O(\alpha)$ o $O(N+M)$ |
| "número de grupos/islas/regiones" | BFS/DFS repetido | $O(N+M)$ |
| "orden de tareas con dependencias" | Topológico (Kahn) | $O(N+M)$ |
| "¿es posible ordenar los cursos?" | Topológico — detectar ciclo | $O(N+M)$ |
| "grupos mutuamente alcanzables" (dirigido) | SCC | $O(N+M)$ |
| "componentes fuertemente conexas" | SCC | $O(N+M)$ |
| "reducir a DAG" / "grafo de condensación" | SCC | $O(N+M)$ |
| "¿es bipartito?" / "¿2-coloreable?" | BFS 2-coloring | $O(N+M)$ |
| "asignar trabajadores a tareas" | Matching Bipartito | $O(N \cdot M)$ |
| "emparejamiento máximo" | Matching (Kuhn/Hopcroft) | $O(M\sqrt{N})$ |
| "máximo flujo" / "cuánto fluye" | Dinic | $O(V^2 E)$ |
| "corte mínimo" | Dinic + Min-Cut | $O(V^2 E)$ |
| "arista crítica" / "puente" | Low-Link (Bridges) | $O(N+M)$ |
| "nodo crítico" / "articulación" | Low-Link (Cut Vertex) | $O(N+M)$ |
| "cláusulas OR de 2 variables" | 2-SAT | $O(N+M)$ |
| "ancestro común" en árbol | LCA Binary Lifting | $O(\log N)$ |
| "distancia entre nodos en árbol" | LCA + depth | $O(\log N)$ |
| "suma en camino del árbol" | HLD + Seg. Tree | $O(\log^2 N)$ |
| "pares a distancia K en árbol" | Centroid Decomp. | $O(N \log^2 N)$ |
| "celdas/movimientos en rejilla" | BFS en rejilla 2D | $O(N \cdot M)$ |
| "pesos 0 o 1" | 0-1 BFS | $O(N+M)$ |

---

## 3. Frases Clave que Delatan el Algoritmo

### BFS
- "mínimo número de..."
- "¿en cuántos pasos...?"
- "menor cantidad de saltos"
- "nivel más bajo del árbol donde..."
- "propagación de la infección en t pasos"

### Dijkstra
- "costo mínimo de viaje"
- "tiempo mínimo de llegada" (con tiempos por tramo)
- "ruta más barata"
- "distancia mínima con pesos"

### Bellman-Ford
- "puede haber deudas" (costos negativos)
- "pérdidas y ganancias"
- "¿existe ciclo de ganancia?" (arbitrage)
- "monedas con tipos de cambio"

### Floyd-Warshall
- "distancia entre todos los pares"
- "¿A puede llegar a B para todos los pares?"
- "transitive closure"
- N ≤ 500 + all-pairs queries

### MST
- "conectar todas las ciudades con cable mínimo"
- "mínimo costo para que todos estén conectados"
- "infraestructura de mínimo costo"
- "Maximum spanning tree": "máximo costo para que todos estén conectados"

### Topológico
- "prerrequisitos"
- "dependencias de compilación"
- "¿en qué orden hacer las tareas?"
- "¿es posible completar todos los cursos?"
- "construcción de un cronograma"

### SCC
- "grupos donde todos se conocen mutuamente"
- "si A puede enviar a B y B puede enviar a A"
- "ciclos en grafos dirigidos"
- "condensación del grafo"

### 2-SAT
- "satisfacer condiciones de la forma A o B"
- "asignación de valores booleanos"
- "restricciones de implicación"

### Matching Bipartito
- "asignar X a Y" donde X e Y son dos conjuntos
- "¿cuántas parejas se pueden formar?"
- "cobertura de vértices mínima"
- "conjunto independiente máximo en bipartito"

### Flujo Máximo
- "¿cuánta información/agua/producto puede pasar?"
- "capacidades en tuberías/cables"
- "saturar una red"

### Puentes/Articulaciones
- "arista/nodo crítico"
- "¿qué eliminar para desconectar la red?"
- "puntos de falla únicos"

### LCA
- "ancestro común más bajo"
- "distancia en árbol"
- "nodo más profundo que es ancestro de ambos"

---

## 4. Mapeo: Categoría de Problema → Algoritmo Típico

| Categoría | Algoritmo Típico |
|-----------|-----------------|
| Camino más corto, una fuente | BFS / Dijkstra / BF |
| Camino más corto, todos los pares | Floyd-Warshall |
| Conectividad | DSU / BFS |
| Árbol mínimo de expansión | Kruskal / Prim |
| Ciclos | DFS coloring |
| Componentes | BFS/DFS / DSU / SCC |
| Dependencias/scheduling | Topológico |
| Satisfacibilidad | 2-SAT → SCC |
| Emparejamiento | Matching → Flujo |
| Flujo/corte | Dinic |
| Estructura del árbol | LCA / HLD / Centroid |

---

## 5. Ejemplos de Problemas Reales (Codeforces)

| Problema CF | Categoría | Algoritmo |
|------------|-----------|-----------|
| CF 313B | Camino más corto en árbol | BFS |
| CF 20C | Camino más corto, pesos grandes | Dijkstra |
| CF 1076D | Ciclos y distancias | BFS + detección de ciclo |
| CF 723E | SCC + condensación | Kosaraju |
| CF 427C | MST | Kruskal |
| CF 115A | Bipartito | BFS 2-coloring |
| CF 786C | Topológico + DP | Kahn |
| CF 653E | LCA + Binary Lifting | Binary Lifting |

---

## 6. Checklist de Reconocimiento (Durante el Concurso)

```
LEE EL ENUNCIADO:
[ ] ¿Cuáles son los nodos? (ciudades, personas, celdas, estados...)
[ ] ¿Cuáles son las aristas? (caminos, conexiones, transiciones...)
[ ] ¿Hay pesos/costos?
[ ] ¿El grafo es dirigido?
[ ] ¿N y M son qué orden de magnitud? (→ determina O() posible)

IDENTIFICA LA PREGUNTA:
[ ] ¿Distancia mínima? → BFS/Dijkstra/BF
[ ] ¿Conectividad? → DSU/BFS
[ ] ¿Componentes? → BFS repetido / SCC para dirigido
[ ] ¿Árbol mínimo? → Kruskal/Prim
[ ] ¿Orden de dependencias? → Topológico
[ ] ¿Máximo emparejamiento? → Matching/Flujo
[ ] ¿Estructura crítica? → Puentes/Articulación

VERIFICA RESTRICCIONES:
[ ] N × M operaciones ¿caben en el tiempo límite?
[ ] ¿Hay pesos negativos? → No usar Dijkstra
[ ] ¿Es árbol? → Algoritmos de árbol disponibles
[ ] ¿Es DAG? → DP topológico disponible
[ ] ¿Es bipartito? → Matching disponible
```

---

## 🔗 Relacionado

- [[icpc/temas/GRAPHS_ICPC/01_RECETA_UNIVERSAL]]
- [[20_CHEAT_SHEET]]
- [[17_ERRORES_CONCEPTUALES]]
- [[icpc/temas/GRAPHS_ICPC/README]]
