---
titulo: "Receta Universal para Problemas de Grafos"
tipo: icpc-tema
categoria: grafos
estado: en-progreso
etiquetas: [icpc, icpc/tema, icpc/categoria/grafos]
fuente-cph: "Cap. 11-12"
fuente-cp4: "§4.1"
creado: 2026-04-17
actualizado: 2026-04-17
---

# Receta Universal para Problemas de Grafos

> CPH Cap. 11-12 | CP4 §4.1

El mayor obstáculo en problemas de grafos no es la implementación — es **reconocer** que el problema es un grafo y **elegir** el algoritmo correcto. Esta receta te da un framework mental reproducible.

---

## El Marco de 5 Pasos

```
PASO 1: Modelar
PASO 2: Identificar la pregunta
PASO 3: Verificar suposiciones
PASO 4: Implementar
PASO 5: Verificar edge cases
```

---

## PASO 1: Modelar el Grafo

### ¿Qué son los nodos?

La primera pregunta es: **¿qué entidad representa cada nodo?**

| Si el problema habla de... | Los nodos son... |
|---------------------------|-----------------|
| Ciudades, aeropuertos, estaciones | Las ciudades/aeropuertos |
| Celdas de una rejilla/mapa | Las celdas $(i, j)$ |
| Estados de un proceso | Los estados |
| Personas, usuarios | Las personas |
| Palabras, strings | Las palabras |
| Configuraciones (Rubik, puzzles) | Las configuraciones |
| Intervalos, eventos | Los intervalos |
| Sufijos/prefijos | Los sufijos/prefijos |

**Señal de alerta**: si los "nodos" no son entidades concretas del problema, quizás el modelado está mal.

---

### ¿Qué son las aristas?

**¿Qué conecta a dos nodos?** La arista existe cuando:

| Si... | Hay arista |
|-------|-----------|
| Hay carretera/camino entre dos ciudades | $(ciudad_A, ciudad_B)$ |
| Desde la celda $(i,j)$ puedes ir a $(i',j')$ | $((i,j), (i',j'))$ |
| Puedes hacer transición de estado A a estado B | $(A, B)$ |
| A conoce a B / A sigue a B | $(A, B)$ |
| La palabra A puede transformarse en B (1 cambio) | $(A, B)$ |

---

### ¿Hay pesos? ¿Dirección?

**Pesos**:
- ¿El costo de ir de A a B es fijo o varía? → ponderado
- ¿Solo importa si puedes llegar, no cuánto cuesta? → no ponderado

**Dirección**:
- ¿La relación es simétrica (si A→B entonces B→A)? → no dirigido
- ¿La relación es asimétrica? → dirigido

---

### Síntomas en el enunciado por tipo de grafo

```
"bidireccional" / "two-way" / "undirected"
    → grafo no dirigido

"de A a B" / "one-way" / "directed"  
    → grafo dirigido

"costo" / "distancia" / "tiempo" / "peso"
    → grafo ponderado

"pasos" / "saltos" / "movimientos" / "¿puedes llegar?"
    → grafo no ponderado (usar BFS)

"sin ciclos" / "árbol" / "N-1 aristas"
    → árbol

"dependencias" / "prerrequisitos" / "orden"
    → DAG → orden topológico

"grupos" / "componentes" / "clusters"
    → componentes conexas → DSU

"mínima red" / "conectar todos con mínimo costo"
    → MST → Kruskal/Prim

"flujo" / "capacidad" / "máxima cantidad que pasa"
    → flujo máximo → Dinic
```

---

## PASO 2: Identificar la Pregunta

### Tabla Maestra: Pregunta → Algoritmo

| Pregunta del problema | Algoritmo | Complejidad | Restricción |
|----------------------|-----------|-------------|-------------|
| ¿Mínimos pasos/distancia sin pesos? | BFS | $O(N+M)$ | Pesos iguales |
| ¿Camino más corto, pesos ≥ 0? | Dijkstra | $O(M \log N)$ | Sin pesos neg |
| ¿Camino más corto, pesos < 0? | Bellman-Ford | $O(N \cdot M)$ | Cualquier peso |
| ¿Hay ciclo negativo? | Bellman-Ford (iter N) | $O(N \cdot M)$ | — |
| ¿Todos los pares de distancias? | Floyd-Warshall | $O(N^3)$ | $N \leq 500$ |
| ¿Están conectados u y v? | DSU o BFS/DFS | $O(\alpha(N))$ / $O(N+M)$ | — |
| ¿Cuántas componentes hay? | BFS/DFS repetido | $O(N+M)$ | — |
| ¿Árbol de costo mínimo? | Kruskal o Prim | $O(M \log M)$ | — |
| ¿Orden de dependencias válido? | Topológico (Kahn/DFS) | $O(N+M)$ | Solo DAG |
| ¿Hay ciclo en el grafo? | DFS (coloring) | $O(N+M)$ | — |
| ¿Es bipartito? | BFS 2-coloring | $O(N+M)$ | — |
| ¿Componentes fuertemente conexas? | Tarjan / Kosaraju | $O(N+M)$ | Dirigido |
| ¿Puentes / puntos de articulación? | Low-link DFS | $O(N+M)$ | No dirigido |
| ¿Flujo máximo / corte mínimo? | Dinic | $O(V^2 E)$ | — |
| ¿Matching máximo bipartito? | Hopcroft-Karp | $O(E\sqrt{V})$ | Bipartito |
| ¿Satisfacibilidad 2-SAT? | SCC (Tarjan) | $O(N+M)$ | — |
| ¿Distancia en árbol / LCA? | Binary Lifting | $O(N \log N)$ | Árbol |

---

### Mapa de Decisión Visual

```
¿El grafo tiene pesos?
├── NO → ¿qué se pregunta?
│    ├── ¿Distancia mínima? → BFS
│    ├── ¿Conectividad? → BFS/DFS/DSU
│    ├── ¿Bipartito? → BFS 2-color
│    ├── ¿Ciclo? → DFS
│    └── ¿Componentes? → BFS/DFS repetido
│
└── SÍ → ¿qué se pregunta?
     ├── ¿Un par (s,t)? → Dijkstra (si w≥0) / Bellman-Ford (si w<0)
     ├── ¿Todos los pares? → Floyd-Warshall (N≤500) / Dijkstra×N
     ├── ¿Árbol mínimo? → Kruskal / Prim
     └── ¿Flujo? → Dinic

¿Es DAG (sin ciclos, dirigido)?
└── SÍ → orden topológico → DP en DAG

¿Es árbol?
└── SÍ → LCA, HLD, Centroid

¿Es dirigido y pregunta sobre componentes "mutualmente alcanzables"?
└── SÍ → SCC (Tarjan / Kosaraju)
```

---

## PASO 3: Verificar Suposiciones

Antes de implementar, verificar que las suposiciones del algoritmo se cumplen.

### Dijkstra
- [ ] ¿Todos los pesos son $\geq 0$? (Si hay negativos → Bellman-Ford)
- [ ] ¿$N \leq 10^5$? (Heap funciona)
- [ ] ¿Hay aristas múltiples entre mismos nodos? (No importa, tomar mínimo)

### Bellman-Ford
- [ ] ¿Puedo tener pesos negativos? (Sí, es el punto)
- [ ] ¿Necesito detectar ciclos negativos? (Hacer N-ésima iteración)
- [ ] ¿$N \cdot M \leq 10^7$? (Si no, TLE probable)

### Floyd-Warshall
- [ ] ¿$N \leq 500$? ($N^3 \leq 1.25 \times 10^8$, aceptable)
- [ ] ¿Inicialicé `dist[i][i] = 0` y `dist[i][j] = INF`?
- [ ] ¿El loop de $k$ es el más externo?

### Kruskal (MST)
- [ ] ¿El grafo es conexo? (Si no, el MST no existe — pero puede haber MSF)
- [ ] ¿Las aristas están ordenadas por peso?
- [ ] ¿Tengo DSU implementado?

### Topológico (Kahn)
- [ ] ¿El grafo es DAG? (Si hay ciclo, Kahn devuelve orden incompleto)
- [ ] ¿Verifiqué que `order.size() == N`? (Si no → hay ciclo)

### Tarjan/Kosaraju (SCC)
- [ ] ¿El grafo es dirigido? (SCC aplica solo a dirigido)
- [ ] ¿Tengo el grafo inverso para Kosaraju?

---

## PASO 4: Implementar — Template Base C++

```cpp
#include <bits/stdc++.h>
using namespace std;

// =========================================
// TEMPLATE BASE DE GRAFO PARA COMPETENCIA
// =========================================
// Ajustar según el problema:
// - Cambiar N_MAX
// - Comentar/descomentar secciones
// - Ajustar indexación (0-based vs 1-based)

const int INF = 1e9;
const long long LINF = 1e18;

int N, M;  // N = nodos, M = aristas

// Lista de adyacencia ponderada (la más versátil)
vector<vector<pair<int,int>>> adj;  // adj[u] = {(v, w), ...}

void read_graph_undirected_weighted() {
    cin >> N >> M;
    adj.assign(N, {});
    for (int i = 0; i < M; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        u--; v--;  // a 0-based
        adj[u].push_back({v, w});
        adj[v].push_back({u, w});  // bidireccional
    }
}

void read_graph_directed_weighted() {
    cin >> N >> M;
    adj.assign(N, {});
    for (int i = 0; i < M; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        u--; v--;
        adj[u].push_back({v, w});
        // SIN adj[v].push_back — es dirigido
    }
}

void read_tree() {
    cin >> N;
    adj.assign(N, {});
    for (int i = 0; i < N-1; i++) {
        int u, v;
        cin >> u >> v;
        u--; v--;
        adj[u].push_back({v, 1});
        adj[v].push_back({u, 1});
    }
}

void read_grid(int rows, int cols, vector<string>& grid) {
    // El grafo es implícito: nodo (i,j) ↔ index i*cols+j
    // Las aristas son los 4 vecinos (o 8 para diagonal)
    int dx[] = {0, 0, 1, -1};
    int dy[] = {1, -1, 0, 0};
    // Usar inline en BFS/DFS: no construir adj explícito
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // read_graph_undirected_weighted();
    // ... tu solución ...
    
    return 0;
}
```

---

## PASO 5: Verificar Edge Cases

Antes de hacer submit, pasar por esta checklist mentalmente:

### Checklist de 15 puntos

```
ESTRUCTURA DEL GRAFO
[ ] 1. ¿Manejé grafo desconectado? (iteré sobre todos los nodos, no solo uno)
[ ] 2. ¿Manejé N=1? (nodo único, sin aristas)
[ ] 3. ¿Manejé grafo con aristas múltiples entre mismos nodos?
[ ] 4. ¿Manejé autoloops (u,u)?
[ ] 5. ¿La indexación es correcta? (0-based vs 1-based — convertir si es necesario)

ALGORITMO
[ ] 6. ¿Inicialicé dist/visited correctamente antes de correr el algoritmo?
[ ] 7. ¿El resultado para nodos inalcanzables es correcto? (INF o -1 según pida el problema)
[ ] 8. ¿Estoy devolviendo la respuesta correcta? (dist, camino, costo, número de componentes...)
[ ] 9. ¿Hay overflow? (usar long long si pesos o distancias pueden ser grandes)
[ ] 10. ¿INF es suficientemente grande? (1e9 para int, 1e18 para long long)

TIPOS DE DATOS
[ ] 11. ¿Los pesos pueden ser negativos? (Dijkstra falla — usar Bellman-Ford)
[ ] 12. ¿Los pesos pueden ser 0? (BFS o 0-1 BFS puede ser mejor)
[ ] 13. ¿Las distancias finales caben en int? (sum de pesos puede superar 2^31)

SALIDA
[ ] 14. ¿El formato de salida es exactamente el pedido? (entero, float, "YES"/"NO", etc.)
[ ] 15. ¿El caso "imposible" está manejado? (-1, "IMPOSSIBLE", INF → depende del problema)
```

---

## Guía de Síntomas → Algoritmo (Versión Rápida)

Esta tabla es para consulta rápida durante el concurso:

| Frase en el enunciado | Piensa en... |
|----------------------|--------------|
| "distancia mínima" sin pesos | BFS |
| "camino más corto" con pesos | Dijkstra |
| "pueden estar conectados" | DSU o BFS |
| "mínimo costo para conectar todos" | MST (Kruskal) |
| "dependencias" / "orden de tareas" | Topológico |
| "ciclo" en dirigido | DFS coloring |
| "componentes que se alcanzan mutuamente" | SCC |
| "puente" / "arista crítica" | Low-link |
| "punto de corte" / "si removemos un nodo" | Articulación |
| "asignación óptima" entre dos grupos | Matching bipartito |
| "máxima cantidad que fluye" | Flujo máximo |
| "condiciones 2-SAT" | SCC + 2-SAT |
| "distancia en árbol" / "ancestro común" | LCA / Binary Lifting |
| "subarreglo en árbol" + actualización | HLD + Segment Tree |

---

## Ejemplos de Modelado Clásico

### Ejemplo 1: Word Ladder
"Dado un diccionario, ¿cuántos pasos mínimos para ir de 'hit' a 'cog' cambiando una letra a la vez?"

**Modelado:**
- Nodos = palabras del diccionario
- Arista $(w_1, w_2)$ si difieren en exactamente 1 letra
- Pregunta = distancia mínima de 'hit' a 'cog'
- **Algoritmo: BFS** (aristas no ponderadas)

---

### Ejemplo 2: Red de Vuelos
"Minimizar el costo de ir de ciudad A a ciudad B, con precios de vuelo dados."

**Modelado:**
- Nodos = ciudades
- Arista $(u, v, w)$ con $w$ = precio del vuelo (dirigido o no, según el problema)
- Pregunta = camino más corto
- **Algoritmo: Dijkstra** (pesos ≥ 0)

---

### Ejemplo 3: Islas
"Dada una rejilla de 0s y 1s, contar el número de islas (grupos de 1s conectados)."

**Modelado:**
- Nodos = celdas con valor 1
- Aristas = celdas adyacentes (4 direcciones) ambas con valor 1
- Pregunta = número de componentes conexas
- **Algoritmo: BFS/DFS repetido** o DSU

---

### Ejemplo 4: Prerrequisitos de Cursos
"Dado que el curso A requiere aprobar B y C antes, ¿es posible tomar todos los cursos?"

**Modelado:**
- Nodos = cursos
- Arista dirigida $(B, A)$ = "B es prerrequisito de A"
- Pregunta = ¿existe orden topológico? (equivalente a: ¿es DAG?)
- **Algoritmo: Topológico (Kahn)** — si `order.size() < N` → hay ciclo → imposible

---

## 🔗 Relacionado

- [[icpc/temas/GRAPHS_ICPC/00_INTRODUCCION]]
- [[02_BFS]]
- [[04_DIJKSTRA]]
- [[16_IDENTIFICACION_RAPIDA]]
- [[20_CHEAT_SHEET]]
