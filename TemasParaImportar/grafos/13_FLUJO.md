---
titulo: "Flujo Máximo — Dinic"
tipo: icpc-tema
categoria: grafos
estado: en-progreso
etiquetas: [icpc, icpc/tema, icpc/categoria/grafos]
fuente-cph: "Cap. 20"
fuente-cp4: "§4.7"
creado: 2026-04-17
actualizado: 2026-04-17
---

# Flujo Máximo — Dinic

> CPH Cap. 20 | CP4 §4.7 | CPA: maximum-flow-dinic

El flujo máximo modela cuánta "cantidad" puede fluir de una fuente $s$ a un sumidero $t$ en una red con capacidades en las aristas. Dinic es el algoritmo estándar en ICPC.

---

## 1. Conceptos Fundamentales

**Red de flujo:** Grafo dirigido donde cada arista $(u,v)$ tiene capacidad $c(u,v) \geq 0$.

**Flujo:** Asignación $f(u,v)$ a cada arista que satisface:
1. **Capacidad:** $0 \leq f(u,v) \leq c(u,v)$
2. **Conservación:** Para todo nodo excepto $s$ y $t$: flujo que entra = flujo que sale

**Flujo máximo:** El mayor valor total de flujo que puede salir de $s$ (o entrar a $t$).

---

## 2. Grafo Residual — La Idea Clave

El grafo residual $G_R$ tiene para cada arista $(u,v)$ con flujo $f$ y capacidad $c$:
- **Arista forward:** $(u,v)$ con capacidad residual $c - f$ (capacidad restante)
- **Arista backward:** $(v,u)$ con capacidad residual $f$ (flujo que se puede "cancelar")

**¿Por qué las aristas backward?** Permiten "deshacer" decisiones previas. Sin ellas, el algoritmo podría quedar atrapado en soluciones subóptimas.

```
Ejemplo clásico donde se necesita arista backward:
     1
   ↗   ↘
s       t
   ↘   ↗
     2

Sin backward: si tomamos s→1→t y s→2→t, max flow = 2.
Si el problema requiere que el flujo pase por cierto nodo,
las backward edges permiten redirigir.
```

---

## 3. Implementación de Dinic

```cpp
// Dinic — O(V² * E) general, O(E * √V) en redes unitarias
// CPH Cap. 20 | CP4 §4.7 | CPA: maximum-flow-dinic

#include <bits/stdc++.h>
using namespace std;

struct MaxFlow {
    struct Edge {
        int to;    // destino
        int rev;   // índice de la arista reversa en adj[to]
        long long cap;  // capacidad residual
    };
    
    int N;
    vector<vector<Edge>> graph;
    vector<int> level;  // nivel de BFS (distancia desde la fuente s)
    vector<int> iter;   // índice de la siguiente arista a explorar en DFS
    
    MaxFlow(int n) : N(n), graph(n), level(n), iter(n) {}
    
    // Agregar arista dirigida u→v con capacidad cap
    void add_edge(int from, int to, long long cap) {
        graph[from].push_back({to, (int)graph[to].size(), cap});
        graph[to].push_back({from, (int)graph[from].size()-1, 0});
        // La arista reversa tiene capacidad 0 inicialmente
    }
    
    // BFS para construir el grafo por niveles (layered graph)
    // Retorna false si t no es alcanzable desde s
    bool bfs(int s, int t) {
        fill(level.begin(), level.end(), -1);
        queue<int> q;
        level[s] = 0;
        q.push(s);
        while (!q.empty()) {
            int v = q.front(); q.pop();
            for (auto& e : graph[v]) {
                if (e.cap > 0 && level[e.to] < 0) {
                    level[e.to] = level[v] + 1;
                    q.push(e.to);
                }
            }
        }
        return level[t] >= 0;
    }
    
    // DFS para enviar flujo bloqueante en el grafo por niveles
    long long dfs(int v, int t, long long f) {
        if (v == t) return f;
        
        // Usar iter[v] para no revisar aristas ya exploradas (optimización)
        for (int& i = iter[v]; i < (int)graph[v].size(); i++) {
            Edge& e = graph[v][i];
            if (e.cap > 0 && level[v] < level[e.to]) {
                long long d = dfs(e.to, t, min(f, e.cap));
                if (d > 0) {
                    e.cap -= d;                    // reducir capacidad forward
                    graph[e.to][e.rev].cap += d;  // aumentar capacidad backward
                    return d;
                }
            }
        }
        return 0;
    }
    
    // Calcular y retornar el flujo máximo de s a t
    long long max_flow(int s, int t) {
        long long flow = 0;
        
        while (bfs(s, t)) {
            // Reiniciar iter[] para el nuevo grafo por niveles
            fill(iter.begin(), iter.end(), 0);
            
            // Enviar todo el flujo bloqueante posible
            long long f;
            while ((f = dfs(s, t, (long long)1e18)) > 0) {
                flow += f;
            }
        }
        
        return flow;
    }
};

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    int N, M, s, t;
    cin >> N >> M >> s >> t;
    s--; t--;
    
    MaxFlow mf(N);
    
    for (int i = 0; i < M; i++) {
        int u, v;
        long long cap;
        cin >> u >> v >> cap;
        u--; v--;
        mf.add_edge(u, v, cap);
    }
    
    cout << mf.max_flow(s, t) << "\n";
    
    return 0;
}
```

---

## 4. Complejidad de Dinic

**General:** $O(V^2 \cdot E)$

**Redes unitarias** (todas las capacidades = 1): $O(E \cdot \sqrt{V})$

**Bipartite matching:** $O(E \cdot \sqrt{V})$ (por ser red unitaria)

**¿Por qué más rápido que Ford-Fulkerson?**
- Ford-Fulkerson: $O(E \cdot \text{max\_flow})$ — puede ser lento con capacidades grandes
- Dinic usa el "blocking flow" por niveles: en cada fase, aumenta en al menos 1 la distancia mínima de $s$ a $t$ → a lo sumo $V$ fases

---

## 5. Min-Cut Max-Flow

**Teorema:** El valor del flujo máximo de $s$ a $t$ = capacidad del corte mínimo que separa $s$ de $t$.

**Corte $(S, T)$:** Partición de $V$ donde $s \in S$ y $t \in T$. Capacidad = suma de capacidades de aristas de $S$ a $T$.

**Cómo encontrar el Min-Cut después de Dinic:**
```cpp
// Después de ejecutar max_flow(s, t):
// Los nodos alcanzables desde s en el grafo residual están en S
// Los demás están en T
// Las aristas con cap=0 que van de S a T son las del min-cut

vector<bool> in_S(N, false);
// BFS/DFS en grafo residual desde s
queue<int> q;
in_S[s] = true;
q.push(s);
while (!q.empty()) {
    int v = q.front(); q.pop();
    for (auto& e : mf.graph[v]) {
        if (e.cap > 0 && !in_S[e.to]) {
            in_S[e.to] = true;
            q.push(e.to);
        }
    }
}

// Las aristas del min-cut: (u,v) donde in_S[u] && !in_S[v] y capacidad original > 0
```

---

## 6. Aplicaciones Comunes

### Matching Máximo Bipartito via Flujo

```
Fuente s → cada nodo izquierdo (cap 1)
Aristas bipartitas u→v (cap 1)
Cada nodo derecho → Sumidero t (cap 1)

max_flow(s, t) = Matching Máximo
```

### Minimum Path Cover en DAG

"¿Cuántos caminos se necesitan para cubrir todos los nodos de un DAG?"

```
Min path cover = N - Max Matching
(Donde Max Matching es el matching en el grafo bipartito
 formado por duplicar cada nodo: u_L y u_R, con arista u_L → v_R
 si hay arista u → v en el DAG)
```

### Project Selection

"Algunos proyectos tienen ganancia, otros tienen costo. Dependencias entre ellos. Maximizar ganancia neta."

→ Modelar como flujo con corte mínimo.

### Vertex Connectivity

"¿Cuántos nodos mínimos hay que eliminar para desconectar s de t?"

→ Dividir cada nodo $v$ en $v_{in}$ y $v_{out}$ con arista $v_{in} \to v_{out}$ de cap 1.

---

## 7. Grafo No Dirigido en Flujo

```cpp
// Arista no dirigida (u,v) con capacidad cap:
// Agregar ambas aristas con capacidad cap (en AMBAS direcciones)
// Nota: add_edge ya maneja el grafo residual internamente

void add_undirected_edge(MaxFlow& mf, int u, int v, long long cap) {
    // Para no dirigido: cada arista tiene capacidad en ambas direcciones
    // PERO: la implementación de Dinic ya crea aristas backward automáticamente
    // Para no dirigido, la arista backward también debe tener capacidad cap (no 0)
    
    mf.graph[u].push_back({v, (int)mf.graph[v].size(), cap});
    mf.graph[v].push_back({u, (int)mf.graph[u].size()-1, cap});
    // Aquí AMBAS tienen cap (no 0), porque la relación es simétrica
}
```

---

## 8. Trampas Comunes

### Trampa 1: Aristas Backward con Capacidad Incorrecta

```cpp
// MAL: ambas aristas con la misma capacidad en DIRIGIDO
mf.graph[from].push_back({to, ..., cap});
mf.graph[to].push_back({from, ..., cap});  // debería ser 0 para dirigido

// BIEN:
mf.graph[from].push_back({to, ..., cap});
mf.graph[to].push_back({from, ..., 0});   // backward empieza en 0
```

### Trampa 2: Usar int en lugar de long long para Capacidades

```cpp
// Si las capacidades son hasta 10^9 y el flujo puede ser N * cap:
// max_flow puede ser hasta N * 10^9 ≈ 10^14 → overflow int

// BIEN: usar long long para cap y para el resultado
long long flow = mf.max_flow(s, t);
```

### Trampa 3: No Reinicializar iter[] Para Cada BFS

```cpp
// El iter[] es crucial para la eficiencia de Dinic
// Olvidar reiniciarlo no da WA, pero sí TLE (pierde la optimización)
fill(iter.begin(), iter.end(), 0);  // ← hacer esto en cada fase BFS
```

### Trampa 4: Fuente/Sumidero Incorrectos

```cpp
// En problemas con múltiples fuentes/sumideros:
// Agregar super-fuente S y super-sumidero T
// S → cada fuente original (cap = INF o capacidad de producción)
// Cada sumidero original → T (cap = INF o capacidad de consumo)
```

---

## 9. Cuándo Usar Dinic vs Otros Algoritmos de Flujo

| Algoritmo | Complejidad | Recomendado |
|-----------|-------------|-------------|
| Ford-Fulkerson | $O(E \cdot \text{max\_flow})$ | Capacidades pequeñas |
| Edmonds-Karp | $O(V \cdot E^2)$ | Cuando max_flow es grande |
| Dinic | $O(V^2 \cdot E)$ | **Siempre en ICPC** |
| Dinic en unit cap | $O(E \sqrt{V})$ | Matching, redes unitarias |
| Push-Relabel | $O(V^2 \sqrt{E})$ | Grafos densos específicos |

---

## 10. Checklist Pre-Submit

```
[ ] ¿Usé long long para capacidades?
[ ] ¿Las aristas backward tienen capacidad 0 (para dirigido)?
[ ] ¿Reinicializo iter[] en cada fase BFS?
[ ] ¿El grafo tiene exactamente una fuente y un sumidero? (si no, agregar super-nodos)
[ ] ¿Para no dirigido: agregué ambas aristas con cap (no 0 para backward)?
[ ] ¿Verifiqué que el resultado es correcto para casos simples?
[ ] ¿Para min-cut: hice BFS en el grafo residual después de max_flow?
```

---

## 🔗 Relacionado

- [[12_BIPARTICION]]
- [[02_BFS]]
- [[icpc/temas/GRAPHS_ICPC/01_RECETA_UNIVERSAL]]
- [[17_ERRORES_CONCEPTUALES]]
