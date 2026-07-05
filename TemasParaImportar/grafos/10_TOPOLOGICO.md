---
titulo: "Orden Topológico y DP en DAG"
tipo: icpc-tema
categoria: grafos
estado: en-progreso
etiquetas: [icpc, icpc/tema, icpc/categoria/grafos]
fuente-cph: "Cap. 16"
fuente-cp4: "§4.9"
creado: 2026-04-17
actualizado: 2026-04-17
---

# Orden Topológico y DP en DAG

> CPH Cap. 16 | CP4 §4.9 | CPA: topological-sort

El orden topológico es una linearización de un DAG (Directed Acyclic Graph) que respeta todas las dependencias. Es fundamental para DP en DAG y para resolver problemas de scheduling.

---

## 1. Concepto

**Definición:** Un orden topológico de un DAG es una secuencia de todos los nodos tal que para cada arista $(u, v)$, $u$ aparece antes que $v$.

**Existe si y solo si el grafo es un DAG** (sin ciclos dirigidos).

```
DAG:
    A → B → D
    A → C → D
    B → C

Órdenes topológicos válidos:
    A, B, C, D
    A, C, B, D   ← también válido (B y C no tienen dependencia entre ellos... espera, B→C sí)
    A, B, C, D   ← el único aquí porque B→C
```

**Aplicaciones:**
- Prerrequisitos de cursos
- Compilación de dependencias
- Scheduling de tareas
- DP en DAG (camino más largo, contar caminos, etc.)

---

## 2. Algoritmo de Kahn (BFS con in-degree)

**Idea:** Los nodos con `in-degree = 0` pueden procesarse primero (no tienen dependencias). Al procesar un nodo, reducimos el `in-degree` de sus vecinos.

```cpp
// Kahn — Orden Topológico — O(N+M)
// CPH Cap. 16 | CP4 §4.9
// Ventaja sobre DFS: detección de ciclos más explícita

#include <bits/stdc++.h>
using namespace std;

// Retorna el orden topológico, o vector vacío si hay ciclo
vector<int> topological_sort_kahn(int N, vector<vector<int>>& adj) {
    
    // Calcular in-degree de cada nodo
    // in-degree[v] = número de aristas que LLEGAN a v
    vector<int> in_degree(N, 0);
    for (int u = 0; u < N; u++) {
        for (int v : adj[u]) {
            in_degree[v]++;
        }
    }
    
    // Encolar todos los nodos con in-degree 0 (sin dependencias)
    queue<int> q;
    for (int i = 0; i < N; i++) {
        if (in_degree[i] == 0) {
            q.push(i);
        }
    }
    
    vector<int> order;  // resultado: orden topológico
    
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);  // procesar u
        
        // Reducir in-degree de vecinos
        for (int v : adj[u]) {
            in_degree[v]--;
            if (in_degree[v] == 0) {
                q.push(v);  // v ya no tiene dependencias → listo para procesar
            }
        }
    }
    
    // Si el orden no contiene todos los nodos → hay un ciclo
    if ((int)order.size() != N) {
        return {};  // grafo tiene ciclo → no es DAG → no hay orden topológico
    }
    
    return order;
}
```

---

## 3. Algoritmo DFS (Post-Order)

```cpp
// Orden Topológico via DFS — O(N+M)
// Agregar al vector cuando se TERMINA de explorar (post-order)
// Luego invertir el vector

vector<int> topo;
vector<int> color;  // 0=blanco, 1=gris, 2=negro
bool has_cycle_topo = false;

void dfs_topo(int v) {
    color[v] = 1;  // GRIS: en procesamiento
    for (int u : adj[v]) {
        if (color[u] == 0) {
            dfs_topo(u);
        } else if (color[u] == 1) {
            has_cycle_topo = true;  // back edge → ciclo
        }
    }
    color[v] = 2;  // NEGRO: terminado
    topo.push_back(v);  // agregar CUANDO TERMINA
}

vector<int> topological_sort_dfs(int N) {
    topo.clear();
    color.assign(N, 0);
    has_cycle_topo = false;
    
    for (int i = 0; i < N; i++) {
        if (color[i] == 0) dfs_topo(i);
    }
    
    if (has_cycle_topo) return {};  // no es DAG
    
    reverse(topo.begin(), topo.end());  // ← CRÍTICO: invertir
    return topo;
}
```

---

## 4. Kahn vs DFS Topológico

| Aspecto | Kahn (BFS) | DFS |
|---------|-----------|-----|
| Detección de ciclos | Explícita (order.size() < N) | Requiere 3-coloring |
| Complejidad | $O(N+M)$ | $O(N+M)$ |
| Implementación | Más explícita | Más concisa |
| Orden de salida | Lexicográfico mínimo si usas priority_queue | Depende del DFS |
| Parallelizable | Fácil (nodos con in-degree 0 simultáneos) | Difícil |
| Recomendado | Para detectar ciclos claramente | Para integrar con otra DFS |

---

## 5. DP en DAG — Patrones Comunes

Una vez que tienes el orden topológico, puedes hacer DP procesando nodos en ese orden. El invariante: cuando procesas $u$, todos los nodos de los que $u$ depende ya fueron procesados.

### 5.1 Camino Más Largo en DAG

```cpp
// Camino más largo en DAG — O(N+M)
// dp[v] = longitud del camino más largo que termina en v

vector<int> longest_path_dag(int N, vector<vector<pair<int,int>>>& adj) {
    // Primero obtener orden topológico
    vector<int> order = topological_sort_kahn(N, /* adj sin pesos */);
    
    vector<int> dp(N, 0);  // dp[v] = camino más largo terminando en v
    
    // Procesar en orden topológico
    for (int u : order) {
        for (auto [v, w] : adj[u]) {
            dp[v] = max(dp[v], dp[u] + w);
        }
    }
    
    // Respuesta: máximo sobre todos los dp[v]
    return dp;
}
```

### 5.2 Contar Caminos en DAG

```cpp
// Contar número de caminos de src a cada nodo — O(N+M)
// cp[v] = número de caminos de src a v

vector<long long> count_paths(int src, int N, vector<vector<int>>& adj,
                               vector<int>& topo_order) {
    vector<long long> cp(N, 0);
    cp[src] = 1;  // hay 1 camino de src a src (el vacío)
    
    const long long MOD = 1e9 + 7;
    
    for (int u : topo_order) {
        if (cp[u] == 0) continue;  // nodo no alcanzable desde src
        for (int v : adj[u]) {
            cp[v] = (cp[v] + cp[u]) % MOD;
        }
    }
    
    return cp;
}
```

### 5.3 Distancia Mínima/Máxima en DAG

```cpp
// Distancia mínima en DAG (con pesos negativos posibles)
// Más eficiente que Bellman-Ford para DAGs: O(N+M) vs O(N*M)
const long long LINF = 1e18;

vector<long long> dag_shortest(int src, int N, vector<vector<pair<int,int>>>& adj,
                                vector<int>& topo_order) {
    vector<long long> dist(N, LINF);
    dist[src] = 0;
    
    for (int u : topo_order) {
        if (dist[u] == LINF) continue;
        for (auto [v, w] : adj[u]) {
            dist[v] = min(dist[v], dist[u] + w);
        }
    }
    
    return dist;
}
```

### 5.4 Verificar si Existe Camino

```cpp
// ¿Existe camino de src a dst en el DAG? — O(N+M)
bool has_path(int src, int dst, int N, vector<vector<int>>& adj) {
    auto order = topological_sort_kahn(N, adj);
    vector<bool> reachable(N, false);
    reachable[src] = true;
    
    for (int u : order) {
        if (!reachable[u]) continue;
        for (int v : adj[u]) {
            reachable[v] = true;
        }
    }
    
    return reachable[dst];
}
```

---

## 6. Ejemplo Completo — Prerrequisitos de Cursos

```
Problema: Hay N cursos y M pares (a, b) indicando que debes aprobar a antes de b.
¿Es posible tomar todos los cursos? Si sí, dar un orden válido.

Modelado:
- Nodo v = curso v
- Arista a→b = "a es prerrequisito de b"
- Pregunta: ¿existe orden topológico?
```

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int N, M;
    cin >> N >> M;
    
    vector<vector<int>> adj(N);
    vector<int> in_degree(N, 0);
    
    for (int i = 0; i < M; i++) {
        int a, b;
        cin >> a >> b;
        a--; b--;
        adj[a].push_back(b);
        in_degree[b]++;
    }
    
    // Kahn
    queue<int> q;
    for (int i = 0; i < N; i++) if (in_degree[i] == 0) q.push(i);
    
    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : adj[u]) {
            if (--in_degree[v] == 0) q.push(v);
        }
    }
    
    if ((int)order.size() != N) {
        cout << "IMPOSSIBLE\n";  // hay ciclo de dependencias
    } else {
        for (int c : order) cout << c+1 << " ";
        cout << "\n";
    }
    
    return 0;
}
```

---

## 7. Orden Topológico Lexicográfico Mínimo

Si el problema requiere el orden topológico lexicográfico mínimo:

```cpp
// Usar priority_queue (min-heap) en lugar de queue en Kahn
priority_queue<int, vector<int>, greater<int>> pq;  // min-heap
for (int i = 0; i < N; i++) if (in_degree[i] == 0) pq.push(i);

while (!pq.empty()) {
    int u = pq.top(); pq.pop();
    order.push_back(u);
    for (int v : adj[u]) {
        if (--in_degree[v] == 0) pq.push(v);
    }
}
// Esto garantiza el orden lexicográfico mínimo en cada paso
```

---

## 8. Trampas Comunes

### Trampa 1: No Verificar si Hay Ciclo

```cpp
// MAL: asumir que el grafo es DAG sin verificar
vector<int> order = topological_sort_kahn(N, adj);
// Si hay ciclo, order.size() < N → resultado incorrecto sin el check

// BIEN:
if ((int)order.size() != N) {
    // El grafo tiene ciclo → no es DAG → sin orden topológico
}
```

### Trampa 2: Olvidar Invertir en DFS Topológico

```cpp
// MAL: sin invertir
topo.push_back(v);  // agrega en post-order
// Al usar directamente: las dependencias van en dirección incorrecta

// BIEN: invertir al final
reverse(topo.begin(), topo.end());
```

### Trampa 3: DP en Orden Incorrecto

```cpp
// MAL: procesar en orden no topológico
for (int v = 0; v < N; v++) {  // orden arbitrario
    for (int u : adj[v]) dp[u] = max(dp[u], dp[v] + 1);
}
// dp[v] puede no estar completo cuando se usa

// BIEN: procesar en orden topológico
for (int u : topo_order) {
    for (int v : adj[u]) dp[v] = max(dp[v], dp[u] + 1);
}
```

### Trampa 4: Grafo con Nodos Aislados

```cpp
// Kahn: los nodos con in-degree 0 que NO tienen vecinos
// también se encolan y procesan correctamente — no hay problema.
// Pero si inicias el DP con dp[src]=1 y el DAG tiene componentes separadas,
// los nodos en otras componentes tendrán dp=0 (correcto, inalcanzables).
```

---

## 9. Checklist Pre-Submit

```
[ ] ¿Verifico que order.size() == N? (si no → ciclo → sin orden topológico)
[ ] ¿Uso Kahn si necesito detección explícita de ciclo?
[ ] ¿Uso min-heap si necesito orden lexicográfico mínimo?
[ ] ¿Para DFS topológico: invierto el vector al final?
[ ] ¿Para DP en DAG: proceso en orden topológico?
[ ] ¿El grafo es DIRIGIDO? (topológico solo tiene sentido en dirigido)
[ ] ¿Inicialicé in_degree[] correctamente?
[ ] ¿Manejo grafos con componentes desconectadas? (iterar todos los nodos)
```

---

## 🔗 Relacionado

- [[03_DFS]]
- [[09_SCC]]
- [[02_BFS]]
- [[icpc/temas/GRAPHS_ICPC/01_RECETA_UNIVERSAL]]
- [[17_ERRORES_CONCEPTUALES]]
