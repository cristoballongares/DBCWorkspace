---
titulo: "Bipartición y Matching"
tipo: icpc-tema
categoria: grafos
estado: en-progreso
etiquetas: [icpc, icpc/tema, icpc/categoria/grafos]
fuente-cph: "Cap. 20"
fuente-cp4: "§4.7.4"
creado: 2026-04-17
actualizado: 2026-04-17
---

# Bipartición y Matching

> CPH Cap. 20 | CP4 §4.7.4 | CPA: bipartite-check, bipartite-matching

La bipartición y el matching son fundamentales en problemas de asignación óptima. El matching máximo bipartito aparece frecuentemente en problemas de pareamiento, scheduling y problemas de flujo.

---

## 1. Verificación de Bipartición (2-Coloring)

**Teorema:** Un grafo es bipartito $\Leftrightarrow$ no contiene ciclos de longitud impar.

**Algoritmo:** BFS/DFS 2-coloring. Intentar colorear el grafo con 2 colores. Si hay conflicto → no bipartito.

```cpp
// 2-Coloring con BFS — O(N+M)
// CPH Cap. 20 | CP4 §4.7.4

#include <bits/stdc++.h>
using namespace std;

// Retorna true si el grafo es bipartito
// color[v] = 0 o 1 (los dos "lados"), -1 si no visitado
bool is_bipartite(int N, vector<vector<int>>& adj, vector<int>& color) {
    color.assign(N, -1);
    
    for (int start = 0; start < N; start++) {
        if (color[start] != -1) continue;  // ya coloreado
        
        // BFS desde start
        queue<int> q;
        color[start] = 0;
        q.push(start);
        
        while (!q.empty()) {
            int v = q.front(); q.pop();
            
            for (int u : adj[v]) {
                if (color[u] == -1) {
                    color[u] = 1 - color[v];  // color opuesto
                    q.push(u);
                } else if (color[u] == color[v]) {
                    return false;  // conflicto: ciclo de longitud impar
                }
            }
        }
    }
    
    return true;  // coloración exitosa → es bipartito
}
```

### Variante con DFS

```cpp
bool dfs_bipartite(int v, int c, vector<vector<int>>& adj, vector<int>& color) {
    color[v] = c;
    for (int u : adj[v]) {
        if (color[u] == -1) {
            if (!dfs_bipartite(u, 1-c, adj, color)) return false;
        } else if (color[u] == c) {
            return false;  // conflicto
        }
    }
    return true;
}
```

---

## 2. Matching Máximo Bipartito — Hungarian / Kuhn

El **Matching** es un conjunto de aristas sin vértices en común. El **Matching Máximo** tiene el mayor número posible de aristas.

### Algoritmo de Kuhn (Ford-Fulkerson simplificado para bipartito)

```cpp
// Matching Máximo Bipartito — Kuhn (Augmenting Path)
// O(N * M) — N = nodos izquierda, M = aristas
// CPH Cap. 20 | CP4 §4.7.4 | CPA: bipartite-matching

#include <bits/stdc++.h>
using namespace std;

int N_left, N_right;  // tamaños de los dos conjuntos
vector<int> adj_left[1005];  // adj_left[u] = vecinos en la derecha
int match_left[1005];  // match_left[u] = nodo derecho emparejado con u (-1 si libre)
int match_right[1005]; // match_right[v] = nodo izquierdo emparejado con v (-1 si libre)
bool visited[1005];    // para el DFS de camino aumentante

// Intentar encontrar un camino aumentante desde el nodo izquierdo u
bool try_augment(int u) {
    for (int v : adj_left[u]) {
        if (visited[v]) continue;  // ya intentado
        visited[v] = true;
        
        // Si v está libre O si el nodo que ocupa v puede moverse a otro
        if (match_right[v] == -1 || try_augment(match_right[v])) {
            match_left[u] = v;
            match_right[v] = u;
            return true;  // encontramos camino aumentante
        }
    }
    return false;  // no pudimos aumentar desde u
}

int max_matching() {
    fill(match_left, match_left + N_left, -1);
    fill(match_right, match_right + N_right, -1);
    
    int matching = 0;
    
    for (int u = 0; u < N_left; u++) {
        fill(visited, visited + N_right, false);  // reiniciar para cada u
        if (try_augment(u)) matching++;
    }
    
    return matching;
}
```

### Hopcroft-Karp — O(M√N)

Para grafos grandes, Hopcroft-Karp es más eficiente usando BFS para encontrar múltiples caminos aumentantes en cada fase.

```cpp
// Hopcroft-Karp — O(M * sqrt(N))
// CPH Cap. 20 | CPA: hopcroft-karp

const int INF = 1e9;
int N_L, N_R;
vector<int> adj[1005];   // adj[u] en izquierda
int matchL[1005], matchR[1005];
int dist_L[1005];        // distancia de nodo izquierdo en BFS

bool bfs_hk() {
    queue<int> q;
    for (int u = 0; u < N_L; u++) {
        if (matchL[u] == -1) {
            dist_L[u] = 0;
            q.push(u);
        } else {
            dist_L[u] = INF;
        }
    }
    bool found = false;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u]) {
            int w = matchR[v];
            if (w == -1) {
                found = true;
            } else if (dist_L[w] == INF) {
                dist_L[w] = dist_L[u] + 1;
                q.push(w);
            }
        }
    }
    return found;
}

bool dfs_hk(int u) {
    for (int v : adj[u]) {
        int w = matchR[v];
        if (w == -1 || (dist_L[w] == dist_L[u]+1 && dfs_hk(w))) {
            matchL[u] = v;
            matchR[v] = u;
            return true;
        }
    }
    dist_L[u] = INF;
    return false;
}

int hopcroft_karp() {
    fill(matchL, matchL + N_L, -1);
    fill(matchR, matchR + N_R, -1);
    int matching = 0;
    while (bfs_hk()) {
        for (int u = 0; u < N_L; u++) {
            if (matchL[u] == -1 && dfs_hk(u)) matching++;
        }
    }
    return matching;
}
```

---

## 3. Teorema de König

**Teorema de König:** En un grafo bipartito:

$$\text{Máximo Matching} = \text{Mínimo Vertex Cover}$$

Un **Vertex Cover** es un conjunto de nodos tal que cada arista tiene al menos un extremo en el conjunto.

**Cómo encontrar el Minimum Vertex Cover dado el Matching Máximo:**

```
1. Sea M el matching máximo.
2. Sea U el conjunto de nodos IZQUIERDOS no emparejados.
3. Ejecutar DFS/BFS alternando:
   - Aristas libres (no en M) de izquierda a derecha
   - Aristas en M de derecha a izquierda
4. Sea Z el conjunto de nodos alcanzados.
5. Minimum Vertex Cover = (nodos izquierdos NO en Z) ∪ (nodos derechos EN Z)
```

**Máximo Independent Set en bipartito:**

$$\text{Max Independent Set} = N - \text{Min Vertex Cover} = N - \text{Max Matching}$$

---

## 4. Matching como Flujo Máximo

El matching máximo bipartito puede resolverse como un problema de flujo máximo:

```
Grafo de flujo:
- Fuente S → cada nodo izquierdo (capacidad 1)
- Cada arista bipartita (u,v) → u a v (capacidad 1)
- Cada nodo derecho → Sumidero T (capacidad 1)

Max flow = Max Matching
```

Esto es útil cuando necesitas variantes como:
- Matching con capacidades (un nodo puede emparejarse con varios)
- Matching con costos (minimum cost maximum matching)

---

## 5. Aplicaciones Comunes

### Problema de Asignación

"Hay $N$ trabajadores y $M$ tareas. Cada trabajador puede hacer ciertas tareas. ¿Cuántas tareas se pueden completar simultáneamente?"

→ Matching máximo bipartito.

### Sistema de Representantes Distintos

"¿Es posible elegir un representante de cada grupo tal que todos sean distintos?"

→ Verificar si existe matching perfecto (de tamaño = número de grupos).

### Problema de Tiling

"¿Se puede cubrir un tablero con dominós?"

→ Modelar celdas negras y blancas como bipartito, matching máximo.

---

## 6. Código Completo de Ejemplo

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MAXN = 505;

int N_left, N_right, M;
vector<int> adj[MAXN];
int match_left[MAXN], match_right[MAXN];
bool visited[MAXN];

bool try_augment(int u) {
    for (int v : adj[u]) {
        if (!visited[v]) {
            visited[v] = true;
            if (match_right[v] == -1 || try_augment(match_right[v])) {
                match_left[u] = v;
                match_right[v] = u;
                return true;
            }
        }
    }
    return false;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    cin >> N_left >> N_right >> M;
    for (int i = 0; i < M; i++) {
        int u, v;
        cin >> u >> v;
        u--; v--;
        adj[u].push_back(v);
    }
    
    fill(match_left, match_left + N_left, -1);
    fill(match_right, match_right + N_right, -1);
    
    int matching = 0;
    for (int u = 0; u < N_left; u++) {
        fill(visited, visited + N_right, false);
        if (try_augment(u)) matching++;
    }
    
    cout << matching << "\n";
    
    // Imprimir el matching
    for (int u = 0; u < N_left; u++) {
        if (match_left[u] != -1) {
            cout << u+1 << " -- " << match_left[u]+1 << "\n";
        }
    }
    
    return 0;
}
```

---

## 7. Trampas Comunes

### Trampa 1: No Reinicializar `visited[]` Para Cada Nodo Izquierdo

```cpp
// MAL: visited[] no se resetea → caminos aumentantes incorrectos
for (int u = 0; u < N_left; u++) {
    if (try_augment(u)) matching++;  // visited[] puede estar contaminado
}

// BIEN: reinicializar para cada u
for (int u = 0; u < N_left; u++) {
    fill(visited, visited + N_right, false);  // ← CRÍTICO
    if (try_augment(u)) matching++;
}
```

### Trampa 2: Grafo No Bipartito

```
El algoritmo de Kuhn solo funciona para grafos BIPARTITOS.
Verificar bipartición antes de aplicar.
```

### Trampa 3: Confundir Nodos Izquierdos y Derechos

```cpp
// Los nodos izquierdos están en [0, N_left)
// Los nodos derechos están en [0, N_right)
// Son DIFERENTES espacios de nombres — no hay confusión si usas arrays separados
// adj[u] para u en izquierda apunta a nodos en el rango de derecha
```

---

## 8. Checklist Pre-Submit

```
[ ] ¿Verificé que el grafo es bipartito antes de aplicar matching?
[ ] ¿Reinicializo visited[] para cada nodo izquierdo en Kuhn?
[ ] ¿match_left[] y match_right[] inicializados a -1?
[ ] ¿Las aristas van solo de izquierda a derecha en adj[]?
[ ] ¿Para König: implementé correctamente el DFS alternado?
[ ] ¿Para Hopcroft-Karp: necesito el speedup O(M√N)?
[ ] ¿Cuento el matching resultado correctamente?
```

---

## 🔗 Relacionado

- [[02_BFS]]
- [[13_FLUJO]]
- [[icpc/temas/GRAPHS_ICPC/01_RECETA_UNIVERSAL]]
- [[17_ERRORES_CONCEPTUALES]]
