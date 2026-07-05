---
titulo: "Edge Cases para Algoritmos de Grafos"
tipo: icpc-tema
categoria: grafos
estado: en-progreso
etiquetas: [icpc, icpc/tema, icpc/categoria/grafos]
fuente-cph: "Cap. 11-20"
fuente-cp4: "§4.1-4.9"
creado: 2026-04-17
actualizado: 2026-04-17
---

# Edge Cases para Algoritmos de Grafos

> Colección de casos límite con análisis de qué puede fallar y cómo manejar.

---

## 1. Casos Generales de Estructura

### N = 1 (Nodo Único)

```cpp
// Un solo nodo, sin aristas
// BFS/DFS: solo visitar el nodo 0, dist[0]=0
// Dijkstra: dist[0]=0, todos los demás LINF
// MST: costo 0 (no hay aristas que agregar)
// Floyd-Warshall: dist[0][0]=0
// Topológico: [0] (orden de un elemento)
// SCC: 1 SCC = {0}
// Matching: matching = 0

// Peligro: si el código asume N >= 2 en algún lugar
// Fix: siempre inicializar correctamente antes de leer
```

### N = 2, M = 0 (Dos Nodos Sin Aristas)

```cpp
// BFS desde 0: dist[1] = -1 (inalcanzable)
// DSU: dsu.connected(0, 1) = false
// MST: no existe (grafo desconectado) — reportar IMPOSSIBLE
// Matching: matching = 0

// Peligro: asumir que el grafo es conexo
```

### N = 2, M = 1 (Arista Simple)

```cpp
// La arista más simple posible
// BFS: dist[0]=0, dist[1]=1 (o viceversa)
// MST: la única arista forma el MST
// Bipartito: siempre bipartito (grafo con 1 arista es bipartito)
```

---

## 2. Grafo Desconectado

**¿Qué hace cada algoritmo?**

| Algoritmo | Comportamiento | ¿Qué hacer? |
|-----------|---------------|-------------|
| BFS | Solo visita la componente de `start` | Iterar sobre todos los nodos |
| DFS | Solo visita la componente de `start` | Iterar sobre todos los nodos |
| Dijkstra | dist[v] = LINF para componentes separadas | Reportar -1 o "IMPOSSIBLE" |
| Bellman-Ford | Similar a Dijkstra | Reportar -1 o "IMPOSSIBLE" |
| Floyd-Warshall | dist[i][j] = LINF para pares en distinta componente | Verificar antes de reportar |
| MST | No existe MST para grafo desconectado | Reportar "IMPOSSIBLE" o MSF |
| Kruskal | edges_added < N-1 al final | Verificar |
| Topológico | Funciona en grafos desconectados | Inicializar todos los in-degree=0 |
| SCC | Cada componente aislada es una SCC | Iterar sobre todos los nodos en dfs1 |
| DSU | dsu.components > 1 al final | Normal |

```cpp
// Manejo de grafo desconectado en BFS:
for (int start = 0; start < N; start++) {
    if (dist[start] == -1) {  // no visitado
        dist[start] = 0;
        bfs_from(start, ...);
    }
}
```

---

## 3. Autoloops (u, u)

Una arista de un nodo a sí mismo.

```cpp
// BFS/DFS: ignorar autoloops (u == v)
for (int v : adj[u]) {
    if (v == u) continue;  // o simplemente no los agregar al leer
    ...
}

// Kruskal: si se lee arista (u, u), find(u) == find(u) → DSU.unite retorna false
// → automáticamente ignorado ✓

// Floyd-Warshall: dist[u][u] = 0, no agregar autoloops con peso > 0
// (o tomar min si el problema los permite)

// Dijkstra: autoloop con peso ≥ 0 no afecta el resultado
// (relaja dist[u] consigo mismo, pero dist[u] + 0 = dist[u], no cambia nada)

// Detección de ciclos: un autoloop (u,u) ES un ciclo trivial
// (si el problema pregunta por ciclos, considerar si autoloops cuentan)
```

---

## 4. Aristas Múltiples (Multi-Edges)

Múltiples aristas entre el mismo par de nodos.

```cpp
// Para BFS/Dijkstra: no hay problema — se procesan normalmente
// Para Floyd-Warshall: al inicializar, tomar el mínimo
dist[u][v] = min(dist[u][v], (long long)w);

// Para MST (Kruskal): aristas múltiples se manejan correctamente
// — si la más barata se agrega, las demás se rechazan por el DSU

// Para puentes: PROBLEMA — usar edge_id para distinguir aristas
// (ver ERROR 11 en 17_ERRORES_CONCEPTUALES.md)

// Leer aristas con múltiples entre mismo par:
// Simplemente agregar todas — el algoritmo elegirá la mejor
```

---

## 5. Grafo Completo (K_n)

Todos los nodos conectados entre sí. $M = N(N-1)/2$ en no dirigido.

```cpp
// BFS: distancia máxima = 1 (todos son vecinos directos)
// MST: tomar las N-1 aristas más baratas
// Floyd-Warshall: dist[i][j] = min sobre todas las aristas directas (= min(w_ij, ...))
//   pero como todos están directamente conectados, la distancia directa ya es mínima
//   (excepto si hay aristas negativas — entonces FW puede encontrar caminos más cortos)

// Cuidado: K_n con N=1000 tiene 500,000 aristas → lista adj de 10^6 elementos
// Para N=2000 → 2*10^6 aristas → puede ser lento si el algoritmo es O(N*M)
```

---

## 6. Árbol (M = N-1)

El árbol es un caso especial muy común.

```cpp
// BFS desde raíz: da todas las distancias en O(N)
// Dijkstra en árbol: O(N log N) — Dijkstra es "overkill" pero funciona
// MST de un árbol: el árbol mismo es su propio MST
// Kruskal en árbol: acepta todas las N-1 aristas (ninguna crea ciclo)
// Topológico de árbol dirigido: posible si el árbol es dirigido
// Ciclos: un árbol NO tiene ciclos — DFS no encuentra back edges
// SCC de árbol dirigido (si todas las aristas van en una dirección):
//   cada nodo es su propia SCC
// Bipartición: todos los árboles son bipartitos (tienen solo ciclos pares... no tienen ciclos)

// Propiedad clave: entre cualquier par de nodos existe exactamente UN camino
// → No necesitas Dijkstra, solo BFS

// LCA tiene sentido solo en árboles
```

---

## 7. Pesos Todos Iguales

Cuando todos los pesos tienen el mismo valor.

```cpp
// Si todos los pesos son 1 → BFS equivale a Dijkstra
// Si todos los pesos son 0 → BFS da distancia 0 para todos
// Si todos los pesos son W → BFS * W da la distancia (distancia_BFS * W)

// Para Floyd-Warshall: funciona pero ineficiente vs BFS × N
// Para Dijkstra: funciona pero BFS es más simple y eficiente

// En MST: si todos los pesos son iguales, cualquier spanning tree es MST
// El costo del MST = (N-1) * W
```

---

## 8. Pesos Todos Cero

```cpp
// Dijkstra con pesos 0: dist[v] = 0 para todos los alcanzables desde src
// (nunca es útil, pero no da error)

// BFS sería equivalente y más simple: todo alcanzable está a distancia 0

// Kruskal: todos los spanning trees tienen costo 0
// → cualquier spanning tree es un MST

// Bellman-Ford: converge en 1 iteración (sin cambios después de la primera)

// Floyd-Warshall: dist[i][j] = 0 para todo par conectado
```

---

## 9. Pesos Negativos

```cpp
// BFS: no aplica (diseñado para pesos uniformes)
// Dijkstra: INCORRECTO con pesos negativos
// Bellman-Ford: correcto
// Floyd-Warshall: correcto (pero detectar ciclos negativos: dist[i][i] < 0)

// MST con pesos negativos: Kruskal y Prim funcionan correctamente
// (solo ordenamos aristas — los pesos negativos simplemente se incluyen primero)

// Para MST con pesos negativos, el costo del MST puede ser negativo
// Eso es perfectamente válido.
```

---

## 10. Grafo con Solo Ciclos

```cpp
// Un grafo que es solo un ciclo: 0-1-2-3-...-N-1-0
// BFS: funciona normalmente
// Topológico: IMPOSIBLE (hay ciclo)
// SCC: todo el ciclo es una SCC
// Bipartito: solo si el ciclo tiene longitud par
// Puentes: ninguna arista es puente (cada nodo tiene dos caminos a cualquier otro)
// Articulaciones: ningún nodo (eliminar cualquiera deja el resto conectado)
```

---

## 11. Ciclos de Longitud 2 en Dirigido

```cpp
// 0 → 1 → 0 (ciclo de longitud 2)
// DFS: detecta ciclo (color[1] == GRAY cuando regresa a 0)
// SCC: {0, 1} son una SCC (se alcanzan mutuamente)
// Topológico: IMPOSIBLE
// ¿Es ciclo negativo? Solo si w(0,1) + w(1,0) < 0
```

---

## 12. Fuente = Destino en Camino Más Corto

```cpp
// dist[src][src] = 0
// Si el problema pregunta la distancia de A a A (src = dst):
// BFS/Dijkstra/BF: retornar 0 (el camino trivial de longitud 0)
// EXCEPCIÓN: si hay ciclo negativo que incluye src → la "distancia" es -∞
//   (puedes mejorar indefinidamente dando vueltas al ciclo)

// Verificar en el código:
if (src == dst) { cout << 0 << "\n"; return 0; }
```

---

## 13. Nodos Aislados (Grado 0)

```cpp
// Nodo sin aristas
// BFS desde nodo aislado: solo visita ese nodo
// BFS hacia nodo aislado: nunca lo alcanza (si no es la fuente)

// Para DSU: dsu.components = N (cada nodo en su componente)
// Para SCC: cada nodo aislado es su propia SCC
// Para topológico: nodo con in_degree=0 se encola primero en Kahn
// Para MST: no puede existir MST si el grafo tiene nodos aislados y N > 1
```

---

## 14. Grafo con N = 0

```cpp
// Caso degenerado: sin nodos
// La mayoría de implementaciones explotan si N=0:
//   - adj.assign(0, {}) es válido pero vector vacío
//   - loops "for (int i = 0; i < N; i++)" no se ejecutan → OK

// Generalmente los problemas garantizan N >= 1
// Si N=0 es posible: agregar check al inicio
if (N == 0) { cout << 0 << "\n"; return 0; }
```

---

## 15. Grafo muy Grande (N = M = 10^6)

```cpp
// Para N = M = 10^6:
// BFS/DFS: O(N+M) = O(10^6) → OK
// Dijkstra: O(M log N) = O(10^6 * 20) = O(2*10^7) → OK
// Bellman-Ford: O(N*M) = O(10^12) → TLE

// Memoria: vector<vector<pair<int,int>>> adj(N) con M aristas
//   → M pares = M * 8 bytes ≈ 8 MB para M = 10^6 → OK
// Pero para N = M = 5*10^6: 40 MB → verificar límite de memoria

// Peligro: malloc de arrays muy grandes en el stack (stack overflow)
// Fix: usar variables globales o vector<> en el heap
```

---

## 16. Checklist de Edge Cases Pre-Submit

```
ESTRUCTURA
[ ] ¿Funciona con N=1? (nodo único)
[ ] ¿Funciona con grafo desconectado?
[ ] ¿Funciona con autoloops?
[ ] ¿Funciona con aristas múltiples entre el mismo par?
[ ] ¿Funciona si src == dst?

PESOS
[ ] ¿Funciona con todos los pesos iguales?
[ ] ¿Funciona con pesos = 0?
[ ] ¿Funciona con pesos negativos (si aplica)?
[ ] ¿Hay posible overflow en suma de pesos?

CASOS ESPECIALES
[ ] ¿El grafo puede ser un árbol? ¿El algoritmo lo maneja?
[ ] ¿El grafo puede ser un grafo completo? ¿El tiempo es aceptable?
[ ] ¿Si el grafo tiene ciclos, el algoritmo lo maneja?
[ ] ¿Para MST: verifico que el grafo sea conexo?
[ ] ¿Para topológico: verifico que no haya ciclos?

OUTPUT
[ ] ¿El output para caso "imposible" es correcto (-1, "IMPOSSIBLE", etc.)?
[ ] ¿El output para distancia 0 (fuente a sí mismo) es correcto?
[ ] ¿El output para nodos inalcanzables es correcto?
```

---

## 🔗 Relacionado

- [[17_ERRORES_CONCEPTUALES]]
- [[20_CHEAT_SHEET]]
- [[icpc/temas/GRAPHS_ICPC/01_RECETA_UNIVERSAL]]
