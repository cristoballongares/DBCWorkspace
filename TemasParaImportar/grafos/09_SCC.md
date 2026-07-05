---
titulo: "SCC — Componentes Fuertemente Conexas"
tipo: icpc-tema
categoria: grafos
estado: en-progreso
etiquetas: [icpc, icpc/tema, icpc/categoria/grafos]
fuente-cph: "Cap. 17"
fuente-cp4: "§4.9"
creado: 2026-04-17
actualizado: 2026-04-17
---

# SCC — Componentes Fuertemente Conexas

> CPH Cap. 17 | CP4 §4.9 | CPA: scc

Una Componente Fuertemente Conexa (SCC) es un subconjunto maximal de nodos de un grafo **dirigido** donde todo par de nodos se alcanza mutuamente. Las SCCs son la base del algoritmo 2-SAT y del análisis de grafos dirigidos.

---

## 1. Concepto

**Definición formal:** En un grafo dirigido $G$, un conjunto $S \subseteq V$ es una SCC si:
- Para todo $u, v \in S$: existe camino dirigido de $u$ a $v$ **y** de $v$ a $u$.
- $S$ es maximal: no se puede agregar más nodos y mantener la propiedad.

```
Ejemplo:
    1 → 2 → 3 → 1   (ciclo: {1,2,3} son una SCC)
    3 → 4 → 5       (4→5 y 5 no apunta a ninguno: {4} y {5} son SCCs separadas)
    4 ← 5           (?? si 5→4 existe: {4,5} son SCC, si no: SCCs separadas)

Grafo con 3 SCCs:
    [1 ↔ 2] → [3 ↔ 4] → [5]
     ↑                     
     └─────────────────────
    
Grafo de condensación (DAG de SCCs):
    SCC_A → SCC_B → SCC_C
```

**Propiedad clave:** El **grafo de condensación** (contraer cada SCC a un nodo) siempre es un DAG. Esto permite aplicar DP topológico sobre las SCCs.

---

## 2. Kosaraju — Dos Pasadas DFS

Kosaraju usa DFS dos veces: una en el grafo original y otra en el grafo inverso.

**Algoritmo:**
1. DFS en $G$: agregar cada nodo al vector `order` cuando **termina** (post-order).
2. Invertir el grafo: construir $G^R$ (todas las aristas al revés).
3. DFS en $G^R$ en orden inverso del paso 1: cada DFS identifica una SCC.

**¿Por qué funciona?**
- En el paso 1, el nodo que termina último es el "más accesible" — puede llegar a muchos nodos.
- En $G^R$, ese nodo puede ser alcanzado por muchos nodos.
- Un DFS en $G^R$ desde ese nodo visita exactamente su SCC (los nodos que pueden alcanzarlo en $G$).

```cpp
// Kosaraju — O(N+M)
// CPH Cap. 17 | CP4 §4.9

#include <bits/stdc++.h>
using namespace std;

int N, M;
vector<int> adj[100005];   // grafo original
vector<int> radj[100005];  // grafo inverso (reversed)
vector<bool> visited;
vector<int> order;         // orden de terminación de DFS1
vector<int> comp;          // comp[v] = ID de la SCC de v

// Paso 1: DFS en grafo original, agregar al salir
void dfs1(int v) {
    visited[v] = true;
    for (int u : adj[v]) {
        if (!visited[u]) dfs1(u);
    }
    order.push_back(v);  // agregar CUANDO TERMINA (post-order)
}

// Paso 3: DFS en grafo inverso, asignar SCC
void dfs2(int v, int scc_id) {
    comp[v] = scc_id;
    for (int u : radj[v]) {
        if (comp[u] == -1) dfs2(u, scc_id);
    }
}

int kosaraju() {
    // Paso 1: DFS en grafo original
    visited.assign(N, false);
    for (int i = 0; i < N; i++) {
        if (!visited[i]) dfs1(i);
    }
    
    // Paso 2: DFS en grafo inverso en orden REVERSO de terminación
    comp.assign(N, -1);
    int num_scc = 0;
    
    // Iterar en orden inverso de `order`
    for (int i = N - 1; i >= 0; i--) {
        int v = order[i];
        if (comp[v] == -1) {
            dfs2(v, num_scc++);
        }
    }
    
    return num_scc;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    cin >> N >> M;
    for (int i = 0; i < M; i++) {
        int u, v;
        cin >> u >> v;
        u--; v--;
        adj[u].push_back(v);
        radj[v].push_back(u);  // arista inversa
    }
    
    int num_scc = kosaraju();
    cout << "SCCs: " << num_scc << "\n";
    for (int i = 0; i < N; i++) {
        cout << "Nodo " << i << " → SCC " << comp[i] << "\n";
    }
    
    return 0;
}
```

---

## 3. Tarjan — DFS Único con Low-Link

Tarjan encuentra SCCs en **una sola pasada DFS** usando timestamps y una pila.

**Definición:** `low[v]` = mínimo `tin[u]` alcanzable desde el subárbol de `v` (incluyendo `v` mismo) mediante aristas del árbol DFS + aristas hacia atrás en la misma SCC.

**La raíz de una SCC** es el nodo `v` donde `low[v] == tin[v]`. Cuando se detecta la raíz, se extrae toda la SCC de la pila.

```cpp
// Tarjan SCC — O(N+M)
// CPH Cap. 17 | CPA: scc-tarjan

#include <bits/stdc++.h>
using namespace std;

int N, M;
vector<int> adj[100005];
vector<int> tin;       // tiempo de entrada
vector<int> low;       // low[v] = mínimo tin alcanzable desde subárbol de v
vector<bool> on_stack; // ¿está el nodo en la pila actual?
stack<int> st;
vector<int> comp;      // comp[v] = ID de SCC de v
int timer_t = 0;
int num_scc = 0;

void tarjan(int v) {
    // Al entrar: inicializar tin y low
    tin[v] = low[v] = timer_t++;
    
    // Agregar v a la pila (es candidato a ser raíz de SCC)
    st.push(v);
    on_stack[v] = true;
    
    for (int u : adj[v]) {
        if (tin[u] == -1) {
            // u no visitado → árbol edge → explorar recursivamente
            tarjan(u);
            
            // Después de explorar: actualizar low[v] con lo que encontró u
            low[v] = min(low[v], low[u]);
            
        } else if (on_stack[u]) {
            // u ya visitado Y está en la pila → back edge dentro de la SCC actual
            // Actualizar low[v] con el tiempo de entrada de u
            low[v] = min(low[v], tin[u]);
            // NOTA: usamos tin[u], NO low[u], para evitar cruzar SCCs
        }
        // Si u está visitado pero NO en la pila → ya fue procesado en otra SCC → ignorar
    }
    
    // ¿Es v la raíz de una SCC?
    if (low[v] == tin[v]) {
        // Extraer toda la SCC de la pila
        while (true) {
            int u = st.top(); st.pop();
            on_stack[u] = false;
            comp[u] = num_scc;   // asignar ID de SCC
            if (u == v) break;   // v era la raíz, terminar
        }
        num_scc++;
    }
}

int main_tarjan() {
    tin.assign(N, -1);
    low.assign(N, 0);
    on_stack.assign(N, false);
    comp.assign(N, -1);
    
    for (int i = 0; i < N; i++) {
        if (tin[i] == -1) tarjan(i);
    }
    
    return num_scc;
}
```

---

## 4. Por Qué `low[v] = min(low[v], tin[u])` y No `low[u]`

Esta es la parte más confusa de Tarjan:

```
Al encontrar back edge (v → u) donde u está en la pila:
- Usamos tin[u], NO low[u]

¿Por qué?
- low[u] puede apuntar a un nodo FUERA de la SCC actual de v.
- Queremos que low[v] refleje solo las conexiones dentro de la SCC de v.
- tin[u] es el tiempo de entrada de u en la SCC actual.

Ejemplo donde la diferencia importa:
    1 → 2 → 3 → 2 (ciclo en {2,3})
    3 → 4 → 5 → 1 (ciclo en {1,4,5})
    
Si v=3 tiene back edge a 2 (on_stack) y cross edge a 1 (ya procesada SCC):
- low[3] = min(low[3], tin[2]) ← correcto: 2 está en la misma SCC
- NO low[1] ← incorrecto: 1 ya fue procesado en otra SCC
```

---

## 5. Kosaraju vs Tarjan

| Aspecto | Kosaraju | Tarjan |
|---------|---------|--------|
| Pasadas DFS | 2 | 1 |
| Necesita grafo inverso | Sí | No |
| Complejidad | $O(N+M)$ | $O(N+M)$ |
| Implementación | Más simple | Más compleja |
| Recomendado para | Simplicidad | Eficiencia de espacio |
| SCCs en orden topológico inverso | Sí (automáticamente) | Sí |

**Regla ICPC:** Usa Kosaraju si tienes tiempo. Tarjan si quieres una sola DFS.

---

## 6. Grafo de Condensación

Después de encontrar las SCCs, se puede construir el **DAG de condensación** donde cada nodo representa una SCC.

```cpp
// Construir DAG de condensación
// comp[] debe estar calculado (por Kosaraju o Tarjan)
// num_scc = número total de SCCs

vector<set<int>> dag(num_scc);  // DAG de SCCs

for (int u = 0; u < N; u++) {
    for (int v : adj[u]) {
        if (comp[u] != comp[v]) {
            // Arista entre SCCs distintas
            dag[comp[u]].insert(comp[v]);
        }
    }
}

// Convertir sets a vectors para eficiencia
vector<vector<int>> dag_adj(num_scc);
for (int i = 0; i < num_scc; i++) {
    dag_adj[i] = vector<int>(dag[i].begin(), dag[i].end());
}
```

**Aplicaciones del DAG de condensación:**
- DP sobre el DAG: problema de camino más largo en DAG de SCCs
- Problemas de alcanzabilidad: ¿puede la SCC $A$ llegar a la SCC $B$?

---

## 7. 2-SAT — Satisfacibilidad Booleana con 2 Literales por Cláusula

2-SAT es una aplicación directa de SCC. Cada variable booleana $x_i$ tiene dos literales: $x_i$ (verdadero) y $\neg x_i$ (falso).

**Modelado:**
- Cada literal es un nodo en el grafo.
- Cláusula $(a \lor b)$ equivale a las implicaciones: $\neg a \Rightarrow b$ y $\neg b \Rightarrow a$.

```
Si (a ∨ b) debe ser verdadera:
- Si a es falso, entonces b debe ser verdadero: ¬a → b
- Si b es falso, entonces a debe ser verdadero: ¬b → a
```

**Verificar satisfacibilidad:** Calcular SCCs. Si alguna variable $x_i$ y su negación $\neg x_i$ están en la misma SCC → INSATISFACIBLE.

**Asignar valores:** $x_i = \text{true}$ si la SCC de $x_i$ tiene ID de topológico mayor que la SCC de $\neg x_i$.

```cpp
// 2-SAT — CPH Cap. 17 | CPA: 2-sat
// N variables: x_0, x_1, ..., x_{N-1}
// Nodo 2*i = x_i (verdadero), nodo 2*i+1 = ¬x_i (falso)

struct TwoSAT {
    int N;
    vector<vector<int>> adj, radj;
    vector<int> order, comp;
    vector<bool> visited;
    
    TwoSAT(int n) : N(n), adj(2*n), radj(2*n), comp(2*n, -1), visited(2*n, false) {}
    
    // Agregar cláusula: (a OR b)
    // a = literal: 2*var si es positivo, 2*var+1 si es negativo
    void add_clause(int a, int b) {
        adj[a^1].push_back(b);    // ¬a → b
        adj[b^1].push_back(a);    // ¬b → a
        radj[b].push_back(a^1);
        radj[a].push_back(b^1);
    }
    
    // Forçar literal a = true: agregar cláusula (a OR a)
    void force_true(int a) { add_clause(a, a); }
    
    void dfs1(int v) {
        visited[v] = true;
        for (int u : adj[v]) if (!visited[u]) dfs1(u);
        order.push_back(v);
    }
    
    void dfs2(int v, int c) {
        comp[v] = c;
        for (int u : radj[v]) if (comp[u]==-1) dfs2(u, c);
    }
    
    // Retorna true si la fórmula es satisfacible
    // vals[i] = valor asignado a x_i si es satisfacible
    bool solve(vector<bool>& vals) {
        for (int i = 0; i < 2*N; i++) if (!visited[i]) dfs1(i);
        int c = 0;
        for (int i = 2*N-1; i >= 0; i--)
            if (comp[order[i]] == -1) dfs2(order[i], c++);
        
        vals.resize(N);
        for (int i = 0; i < N; i++) {
            if (comp[2*i] == comp[2*i+1]) return false;  // INSATISFACIBLE
            // x_i = true si su SCC tiene ID de topológico mayor (Kosaraju las da en orden inverso)
            vals[i] = comp[2*i] > comp[2*i+1];
        }
        return true;
    }
};

// Uso:
// TwoSAT sat(N);
// sat.add_clause(2*0, 2*1);    // (x0 OR x1)
// sat.add_clause(2*0+1, 2*2);  // (¬x0 OR x2)
// vector<bool> vals;
// if (sat.solve(vals)) { /* satisfacible */ }
```

---

## 8. Trampas Comunes

### Trampa 1: Usar `low[u]` en Lugar de `tin[u]` en Tarjan para Back Edges

```cpp
// MAL: low[u] puede cruzar SCCs
} else if (on_stack[u]) {
    low[v] = min(low[v], low[u]);  // INCORRECTO

// BIEN: tin[u] mantiene dentro de la SCC actual
} else if (on_stack[u]) {
    low[v] = min(low[v], tin[u]);  // CORRECTO
```

### Trampa 2: No Construir el Grafo Inverso en Kosaraju

```cpp
// MAL: DFS2 en el grafo original → resultado incorrecto
for (int u : adj[v]) if (comp[u]==-1) dfs2(u, c);  // WRONG

// BIEN: DFS2 en el grafo INVERSO
for (int u : radj[v]) if (comp[u]==-1) dfs2(u, c);  // CORRECT
```

### Trampa 3: Stack Overflow en Grafos Grandes

```
Tarjan es recursivo → puede dar stack overflow para N > 10^5.
Fix: Implementar Tarjan iterativo, o usar Kosaraju (también recursivo pero
más fácil de convertir a iterativo).
```

### Trampa 4: 2-SAT con Cláusulas de 1 Literal

```cpp
// Para forzar x_i = true: usar force_true(2*i)
// Equivale a cláusula (x_i ∨ x_i) → implicación: ¬x_i → x_i
sat.force_true(2*i);      // x_i debe ser verdadero
sat.force_true(2*i+1);    // ¬x_i debe ser verdadero (x_i = false)
```

---

## 9. Checklist Pre-Submit

```
[ ] ¿El grafo es DIRIGIDO? (SCC solo aplica a grafos dirigidos)
[ ] ¿Para Kosaraju: construí el grafo inverso radj[]?
[ ] ¿Para Tarjan: uso tin[u] (no low[u]) para back edges?
[ ] ¿El grafo de condensación es correcto? (sin auto-aristas, sin duplicados)
[ ] ¿Para 2-SAT: verifiqué comp[2*i] != comp[2*i+1] para cada variable?
[ ] ¿Manejo el caso donde el grafo es desconectado? (iterar sobre todos los nodos en dfs1)
[ ] ¿La numeración de las SCCs es correcta? (Kosaraju da orden topológico inverso)
```

---

## 🔗 Relacionado

- [[03_DFS]]
- [[10_TOPOLOGICO]]
- [[08_COMPONENTES]]
- [[11_PUENTES_ARTICULACION]]
- [[17_ERRORES_CONCEPTUALES]]
