---
titulo: "Errores Conceptuales Comunes en Grafos"
tipo: icpc-tema
categoria: grafos
estado: en-progreso
etiquetas: [icpc, icpc/tema, icpc/categoria/grafos]
fuente-cph: "Cap. 11-20"
fuente-cp4: "§4.1-4.9"
creado: 2026-04-17
actualizado: 2026-04-17
---

# Errores Conceptuales Comunes en Grafos

> Cada error está documentado con síntoma en runtime, causa raíz, contraejemplo y fix.

---

## ERROR 1: Usar Dijkstra con Pesos Negativos

**Síntoma:** WA (Wrong Answer), el resultado es incorrecto para algunos casos.

**Causa raíz:** Dijkstra asume que la primera vez que procesa un nodo es la distancia definitiva. Con pesos negativos, esto puede ser falso.

**Contraejemplo:**
```
0 --5--> 1 --(-6)--> 2

Dijkstra:
  dist=[0, 5, ∞]
  Extrae (0,0): dist[1]=5, dist[2]=∞
  Extrae (5,1): dist[2] = 5 + (-6) = -1, encola (-1, 2)
  Extrae (-1,2): d=-1 == dist[2]=-1, procesa. OK en este caso.
  
Caso que falla (ciclo negativo implicado):
  0 --1--> 1 --(-3)--> 0   (ciclo negativo)
  Dijkstra loop infinito o resultado incorrecto.
```

**Fix:** Si hay pesos negativos → usar **Bellman-Ford**. Si hay ciclos negativos → reportar "ciclo negativo".

**Cómo testear:** Crear un grafo con una arista de peso negativo y verificar el resultado manualmente.

---

## ERROR 2: Marcar Nodo Visitado al Sacar (No al Encolar) en BFS

**Síntoma:** TLE (Time Limit Exceeded) o WA. El mismo nodo puede encolarse múltiples veces.

**Causa raíz:** Si marcas visitado al sacar, antes de ese momento el nodo puede ser encolado por múltiples vecinos.

**Contraejemplo:**
```
Estrella: nodo central 0 conectado a nodos 1,2,...,N
BFS desde 0:
  Encola 1,2,...,N → todos se marcan visitados al sacar (OK)
  Pero si hay N=10^6 y el grafo es más denso → el heap puede tener O(M) entradas → TLE
```

**Fix:**
```cpp
// BIEN: marcar al encolar
if (dist[v] == -1) {
    dist[v] = dist[u] + 1;
    q.push(v);  // marcado justo antes de encolar
}
```

---

## ERROR 3: K más Externo en Floyd-Warshall

**Síntoma:** WA. Las distancias calculadas son incorrectas para algunos pares.

**Causa raíz:** El invariante de Floyd-Warshall requiere que `dist[i][k]` y `dist[k][j]` ya tengan sus valores correctos al computar `dist[i][j]` con intermedio $k$. Esto solo se garantiza si $k$ es el loop más externo.

**Fix:**
```cpp
// SIEMPRE: k más externo
for (int k = 0; k < N; k++)
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++)
            dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
```

---

## ERROR 4: Overflow en INF + Peso

**Síntoma:** WA con valores extrañamente negativos, o comportamiento indefinido.

**Causa raíz:** Si `dist[u] = INF = 1e9` (int) y `w = 1`, entonces `INF + 1 = 2e9 + 1` que excede el rango de int (2^31 - 1 ≈ 2.1e9). El resultado se convierte en negativo.

**Fix:**
```cpp
// Opción 1: usar long long con LINF = 1e18
const long long LINF = 1e18;
vector<long long> dist(N, LINF);

// Opción 2: verificar antes de sumar
if (dist[u] != INF && dist[u] + w < dist[v]) dist[v] = dist[u] + w;

// Opción 3: usar INF = 1e9/2 para que 2*INF no overflow int
const int INF = 1e9/2;
```

---

## ERROR 5: Olvidar la Inicialización dist[i][i] = 0 en Floyd-Warshall

**Síntoma:** WA. Distancias entre nodos que deberían ser 0 tienen valor LINF.

**Causa raíz:** Sin `dist[i][i] = 0`, la distancia de un nodo a sí mismo es LINF, lo que afecta el cálculo de distancias intermedias.

**Fix:**
```cpp
for (int i = 0; i < N; i++) dist[i][i] = 0;
```

---

## ERROR 6: Grafo No Dirigido Implementado Como Dirigido

**Síntoma:** WA. BFS/Dijkstra no llega a nodos que deberían ser alcanzables.

**Causa raíz:** Olvidar agregar la arista en ambas direcciones en la lista de adyacencia.

**Fix:**
```cpp
// Para grafo NO DIRIGIDO: agregar en AMBAS direcciones
adj[u].push_back({v, w});
adj[v].push_back({u, w});  // ← esta línea
```

**Cómo detectar:** Si el problema dice "bidireccional" o "camino de dos vías" y no agregas ambas direcciones.

---

## ERROR 7: Topológico en Grafo con Ciclos

**Síntoma:** WA o segfault. El DP en DAG produce resultados incorrectos.

**Causa raíz:** Aplicar topológico sin verificar si hay ciclos. Si hay ciclo, Kahn devuelve un orden parcial sin todos los nodos.

**Fix:**
```cpp
vector<int> order = topological_sort_kahn(N, adj);
if ((int)order.size() != N) {
    cout << "IMPOSSIBLE\n";  // hay ciclo
    return;
}
// Solo hacer DP si el orden es completo
```

---

## ERROR 8: DSU Aplicado a Grafo Dirigido

**Síntoma:** WA. Las "componentes" encontradas no son las SCCs correctas.

**Causa raíz:** DSU encuentra componentes conexas en grafos NO dirigidos. Para grafos dirigidos, las SCCs son distintas.

**Contraejemplo:**
```
Grafo dirigido: 0 → 1, 2 → 0
DSU encuentra: {0, 1, 2} (una componente)
SCC correctas: {0}, {1}, {2} (tres SCCs — ningún par se alcanza mutuamente)

Espera: 0→1 no tiene vuelta, 2→0 no tiene vuelta
DSU no entiende dirección → da resultado incorrecto
```

**Fix:** Para grafos dirigidos → Tarjan o Kosaraju para SCCs.

---

## ERROR 9: La Raíz en DFS de Articulaciones — Condición Especial

**Síntoma:** WA. La raíz del DFS es marcada incorrectamente como punto de articulación.

**Causa raíz:** La condición `low[u] >= tin[v]` para articulaciones no aplica a la raíz de la misma manera. La raíz es punto de articulación solo si tiene 2+ hijos en el árbol DFS.

**Contraejemplo:**
```
Árbol lineal: 0 --- 1 --- 2
DFS desde 0: raíz=0, hijo=1 (children=1)
tin[0]=0, low[0]=0 (after DFS)
low[1]=0 >= tin[0]=0 → marcaría 0 como articulación ← MAL

0 tiene un solo hijo → eliminarlo no desconecta nada.
```

**Fix:**
```cpp
if (parent == -1 && children > 1) is_cut[v] = true;
if (parent != -1 && low[u] >= tin[v]) is_cut[v] = true;
```

---

## ERROR 10: `low[u] > tin[v]` vs `low[u] >= tin[v]`

**Síntoma:** WA. Demasiados puentes detectados, o articulaciones incorrectas.

**Causa raíz:** Confundir las condiciones de puentes y articulaciones.

**Fix:**
- **Puente** $(v, u)$: `low[u] > tin[v]` (estricto `>`)
- **Articulación** $v$: `low[u] >= tin[v]` (con igualdad `>=`)

---

## ERROR 11: Aristas Múltiples en Puentes — Parent por Nodo

**Síntoma:** WA. Aristas que son puentes no se detectan (o se detectan aristas que no lo son).

**Causa raíz:** Con aristas múltiples entre $u$ y $v$, ignorar `u == parent` descarta ambas aristas cuando solo deberías descartar la que te trajo.

**Contraejemplo:**
```
Grafo con dos aristas entre 0 y 1: 0 --a-- 1 --a-- 0
(dos aristas separadas)
Las dos juntas forman un "ciclo" → ninguna es puente

Si tienes solo una arista entre 0 y 1:
0 -- 1
Esta arista SÍ es puente

Si hay dos aristas pero con parent tracking por nodo:
Al procesar 0 → 1 → vecino 0: ignoras por "parent==0" → pero hay OTRA arista a 0!
Resultado: piensas que hay back edge cuando no lo hay.
```

**Fix:** Usar índice de arista (`edge_id`) en lugar de nodo padre para ignorar la arista específica que te trajo.

---

## ERROR 12: Stack Overflow en DFS Recursivo para N Grande

**Síntoma:** RE (Runtime Error) o TLE. El programa se cae silenciosamente.

**Causa raíz:** La pila de llamadas recursivas puede tener profundidad N en el peor caso (árbol lineal). Para N = 10^6, esto supera el límite de stack (~1 MB en muchos sistemas).

**Fix:**
```cpp
// Opción 1: usar DFS iterativo
// Opción 2: aumentar stack (no portable a todos los jueces)
// Opción 3: para árboles, usar BFS en lugar de DFS recursivo cuando sea posible
```

---

## ERROR 13: SPFA con Grafos Adversariales (TLE)

**Síntoma:** TLE. SPFA debería ser O(M) promedio pero falla en el tiempo límite.

**Causa raíz:** SPFA tiene peor caso O(N*M) y algunos jueces tienen casos de prueba diseñados para atacar SPFA.

**Fix:** Si hay pesos negativos y N*M es grande → usar Bellman-Ford estándar. Si no hay pesos negativos → usar Dijkstra.

---

## ERROR 14: No Reinicializar `visited[]` para Múltiples BFS/DFS

**Síntoma:** WA. Componentes no se detectan correctamente, o nodos visitables parecen no alcanzables.

**Causa raíz:** Reutilizar el array `visited[]` sin reinicializar entre llamadas a BFS/DFS.

**Fix:**
```cpp
// Antes de cada BFS/DFS fresco:
fill(visited.begin(), visited.end(), false);
// O:
visited.assign(N, false);
```

---

## ERROR 15: Prim con key[] Inicializado a 0 en Lugar de INF

**Síntoma:** WA. El MST calculado no es correcto.

**Causa raíz:** Si inicializas `key[v] = 0` para todos los nodos, todos parecen tener la misma prioridad y Prim no funciona correctamente.

**Fix:**
```cpp
vector<long long> key(N, 1e18);  // ← INF, no 0
key[0] = 0;  // solo el nodo inicial tiene costo 0
```

---

## ERROR 16: No Actualizar el Grafo Inverso en Kosaraju

**Síntoma:** WA. Las SCCs encontradas son incorrectas.

**Causa raíz:** El segundo DFS de Kosaraju debe hacerse en el grafo INVERSO. Si se usa el grafo original, el resultado es incorrecto.

**Fix:**
```cpp
// Al leer aristas:
adj[u].push_back(v);
radj[v].push_back(u);  // ← grafo inverso (arista al revés)

// En dfs2: usar radj, no adj
void dfs2(int v, int c) {
    comp[v] = c;
    for (int u : radj[v]) { ... }  // ← radj, no adj
}
```

---

## ERROR 17: Capacidad INF en Aristas Backward (Flujo)

**Síntoma:** WA en flujo máximo. El flujo calculado es mayor de lo posible.

**Causa raíz:** En un grafo de flujo dirigido, la arista backward (reversa) debe tener capacidad 0 inicialmente. Si le pones capacidad `cap`, estás creando una arista bidireccional.

**Fix:**
```cpp
// Para arista DIRIGIDA u→v con capacidad cap:
graph[from].push_back({to, ..., cap});
graph[to].push_back({from, ..., 0});   // backward: capacidad 0

// Para arista NO DIRIGIDA u↔v con capacidad cap:
graph[from].push_back({to, ..., cap});
graph[to].push_back({from, ..., cap}); // backward: capacidad cap (simétrico)
```

---

## Resumen Rápido

| Error | Síntoma | Fix |
|-------|---------|-----|
| Dijkstra con pesos negativos | WA | Usar Bellman-Ford |
| Marcar visitado al sacar | TLE | Marcar al encolar |
| k no externo en Floyd | WA | k siempre más externo |
| INF + peso overflow | WA/UB | long long + LINF=1e18 |
| Sin dist[i][i]=0 en Floyd | WA | Inicializar la diagonal |
| Grafo no dirigido como dirigido | WA | Agregar ambas direcciones |
| Topológico en grafo con ciclos | WA | Verificar size==N |
| DSU en dirigido | WA | Usar Tarjan/Kosaraju |
| Raíz en articulaciones | WA | Condición especial parent==-1 |
| > vs >= en puentes/articulaciones | WA | Puentes: >, Articulaciones: >= |
| Aristas múltiples en puentes | WA | Usar edge_id, no parent_node |
| Stack overflow DFS recursivo | RE | DFS iterativo |
| SPFA adversarial | TLE | Bellman-Ford o Dijkstra |
| No reinicializar visited[] | WA | Reset antes de cada BFS/DFS |
| key[]=0 en Prim | WA | key[]= INF |
| adj en lugar de radj en Kosaraju | WA | Usar radj en dfs2 |
| Backward con capacidad cap | WA flujo | Backward con capacidad 0 |

---

## 🔗 Relacionado

- [[18_CASOS_EDGE]]
- [[20_CHEAT_SHEET]]
- [[icpc/temas/GRAPHS_ICPC/01_RECETA_UNIVERSAL]]
- [[16_IDENTIFICACION_RAPIDA]]
