# 05. DP en Árboles: Tree DP, Rerooting, Independent Set

> *"Un árbol es una estructura recursiva. DP en árboles aprovecha esa recursividad directamente."*

**Tabla de Contenidos**
- [Sección A: El patrón general de Tree DP](#sección-a-el-patrón-general-de-tree-dp)
- [Sección B: Maximum Weight Independent Set](#sección-b-maximum-weight-independent-set)
- [Sección C: Minimum Vertex Cover](#sección-c-minimum-vertex-cover)
- [Sección D: Corte de árbol de máximo valor (Rascó)](#sección-d-corte-de-árbol-de-máximo-valor-rascó)
- [Sección E: Técnica de Rerooting](#sección-e-técnica-de-rerooting)
- [Sección F: Debugging y errores comunes](#sección-f-debugging-y-errores-comunes)

---

## Sección A: El patrón general de Tree DP

### ¿Cuándo usar Tree DP?

El input es un árbol (o grafo que puede tratarse como árbol) y la solución óptima para un subtree depende de las soluciones óptimas para los subtrees de sus hijos.

**Señales en el enunciado**:
- "Selecciona un subconjunto de nodos maximizando..."
- "Asigna valores a los nodos con restricciones de adyacencia"
- "Encuentra el camino más largo en el árbol"
- "¿Cuántas formas de colorear el árbol?"

### El patrón general

```
Para cada nodo u (post-order DFS):
  1. Calcula dp[u] recursivamente para cada hijo v
  2. Combina los resultados de los hijos para obtener dp[u]

Estado típico: dp[nodo][opción]
  - opción puede ser: {incluido, excluido}, {color}, etc.

Transición:
  dp[u][estado] = función de {dp[v][estado'] para cada hijo v, con restricciones}
```

### Implementación base con DFS

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MAXN = 100005;
vector<int> adj[MAXN];
int dp[MAXN][2];  // dp[u][0] = excluyendo u, dp[u][1] = incluyendo u

void dfs(int u, int parent) {
    dp[u][0] = 0;  // si no incluyo u
    dp[u][1] = peso[u];  // si incluyo u
    
    for (int v : adj[u]) {
        if (v == parent) continue;  // no visitar al padre
        
        dfs(v, u);  // procesar subtree de v primero
        
        // Combinar resultado de v con u
        dp[u][0] += max(dp[v][0], dp[v][1]);  // si excluyo u, puedo incluir o excluir v
        dp[u][1] += dp[v][0];                  // si incluyo u, DEBO excluir v (adyacentes)
    }
}

int solve(int root) {
    dfs(root, -1);
    return max(dp[root][0], dp[root][1]);
}
```

### Por qué funciona la recursión post-order

El árbol es una estructura recursiva: el subtree de $u$ se compone de $u$ más los subtrees de sus hijos. La solución óptima para el subtree de $u$ se puede construir combinando soluciones óptimas para cada subtree hijo.

**La subestructura óptima**: si la solución global incluye a $u$ con configuración $c$, entonces la solución para cada subtree hijo respetando la restricción sobre $c$ es óptima para ese subtree.

---

## Sección B: Maximum Weight Independent Set

### Enunciado

Dado un árbol con pesos en los nodos, selecciona un **subconjunto independiente** (ningún par de nodos seleccionados es adyacente) de **máximo peso total**.

**Ejemplo**:
```
     1(w=10)
    /        \
  2(w=5)   3(w=8)
  /
4(w=3)

Independiente máximo: {1, 4} → peso 13? No, 1 y 2 son adyacentes, 2 y 4 también.
→ {1} = 10, o {2, 3} = 13, o {2} = 5, o {3, 4} = 11...
Respuesta: {2, 3} = 13
```

### Estado

- $\text{dp}[u][1]$ = máximo peso del conjunto independiente en el subtree de $u$, **incluyendo** $u$.
- $\text{dp}[u][0]$ = máximo peso del conjunto independiente en el subtree de $u$, **excluyendo** $u$.

### Transición

Si **incluyo** $u$: no puedo incluir ningún hijo.
$$\text{dp}[u][1] = w_u + \sum_{\text{hijo } v} \text{dp}[v][0]$$

Si **excluyo** $u$: cada hijo puede ser incluido o excluido (elijo el mejor).
$$\text{dp}[u][0] = \sum_{\text{hijo } v} \max(\text{dp}[v][0], \text{dp}[v][1])$$

**Respuesta**: $\max(\text{dp}[\text{raíz}][0], \text{dp}[\text{raíz}][1])$.

### Implementación completa

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MAXN = 100005;
vector<int> adj[MAXN];
int w[MAXN];         // pesos de los nodos
long long dp[MAXN][2]; // dp[u][0/1]

void dfs(int u, int par) {
    dp[u][0] = 0;
    dp[u][1] = w[u];
    
    for (int v : adj[u]) {
        if (v == par) continue;
        dfs(v, u);
        
        // Si excluyo u: puedo tomar o dejar cada hijo
        dp[u][0] += max(dp[v][0], dp[v][1]);
        // Si incluyo u: DEBO excluir todos los hijos (adyacentes)
        dp[u][1] += dp[v][0];
    }
}

int main() {
    int n; cin >> n;
    for (int i = 1; i <= n; i++) cin >> w[i];
    for (int i = 0; i < n-1; i++) {
        int u, v; cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }
    
    dfs(1, 0);  // raíz = nodo 1, padre = 0 (ficticio)
    cout << max(dp[1][0], dp[1][1]) << "\n";
    return 0;
}
```

---

## Sección C: Minimum Vertex Cover

### Enunciado (Rascó §6.2.1)

Un **vertex cover** es un conjunto de nodos tal que cada arista tiene al menos un extremo en el conjunto. Encuentra el de **mínimo tamaño**.

### Relación con Independent Set

En cualquier grafo: **Minimum Vertex Cover = n - Maximum Independent Set**.

*(El complemento de un conjunto independiente es un vertex cover y viceversa)*

### State y transición en árbol

- $\text{dp}[u][0]$ = mínimo vertex cover del subtree de $u$, sin $u$.
- $\text{dp}[u][1]$ = mínimo vertex cover del subtree de $u$, con $u$.

Para cada arista $(u, v)$:
- Si **incluyo $u$**: puede o no incluir $v$.
- Si **excluyo $u$**: **DEBO** incluir $v$ (para cubrir la arista $(u,v)$).

$$\text{dp}[u][1] = 1 + \sum_{\text{hijo } v} \min(\text{dp}[v][0], \text{dp}[v][1])$$
$$\text{dp}[u][0] = \sum_{\text{hijo } v} \text{dp}[v][1]$$

```cpp
void dfs_cover(int u, int par) {
    dp[u][1] = 1;   // incluir u: 1 nodo + lo mejor de cada hijo
    dp[u][0] = 0;   // excluir u: debo incluir todos los hijos
    
    for (int v : adj[u]) {
        if (v == par) continue;
        dfs_cover(v, u);
        
        dp[u][1] += min(dp[v][0], dp[v][1]);
        dp[u][0] += dp[v][1];  // OBLIGADO a incluir v
    }
}
// Respuesta: min(dp[root][0], dp[root][1])
// Fuente: Rascó §6.2.1
```

---

## Sección D: Corte de árbol de máximo valor (Rascó)

### Enunciado (Rascó §6.2.2)

Dado un árbol con valores en aristas y un entero $k$, elimina exactamente $k$ aristas para obtener $k+1$ subtrees. El "valor" de un subtree es el producto de sus nodos. **Maximiza la suma de valores de los subtrees**.

*(Problema avanzado — ilustra Tree DP con estado adicional)*

**Estado**: $\text{dp}[u][j]$ = máximo valor si se hacen $j$ cortes en el subtree de $u$.

```cpp
// Estructura general (simplificada):
void dfs(int u, int par) {
    dp[u][0] = peso_del_subtree_u;  // sin cortes: valor = peso total
    
    for (int v : adj[u]) {
        if (v == par) continue;
        dfs(v, u);
        
        // Para combinar: considerar hacer un corte en la arista (u,v) o no
        // dp[u][j] se actualiza combinando dp[u][j-i] con dp[v][i-1] (cortar) o dp[v][i]
        // (Requiere loop adicional sobre j)
    }
}
// Fuente: Rascó §6.2.2
```

---

## Sección E: Técnica de Rerooting

### ¿Qué es Rerooting?

Si necesitas calcular la respuesta para **cada nodo como posible raíz**, hacer un DFS por cada raíz es $O(n^2)$. Rerooting lo reduce a $O(n)$ con dos pasadas DFS.

### Cuándo usar

- "Para cada nodo $u$, calcula la suma de distancias a todos los demás nodos"
- "Para cada nodo $u$ como raíz, encuentra el máximo..."

### El proceso

1. **Primera pasada** (DFS estándar, raíz arbitraria): calcula `dp[u]` para el subtree de $u$.
2. **Segunda pasada** (DFS "hacia arriba"): calcula `dp2[u]` = respuesta cuando $u$ es raíz, usando `dp[u]` y `dp2[parent(u)]`.

```cpp
// Ejemplo: suma de distancias desde cada nodo
int sz[MAXN];    // tamaño del subtree
long long dp[MAXN];  // suma de distancias en el subtree
long long ans[MAXN]; // respuesta para cada nodo como raíz

void dfs1(int u, int par) {
    sz[u] = 1;
    dp[u] = 0;
    for (int v : adj[u]) {
        if (v == par) continue;
        dfs1(v, u);
        sz[u] += sz[v];
        dp[u] += dp[v] + sz[v];  // distancias en subtree de v + 1 por cada nodo
    }
}

void dfs2(int u, int par) {
    // ans[u] = dp[u] (distancias hacia abajo) + contribución del "supertree" (hacia arriba)
    for (int v : adj[u]) {
        if (v == par) continue;
        // Al rerootear de u a v:
        // - Pierdes: dp[v] + sz[v] (distancias desde v hacia su subtree)
        // - Ganas: (n - sz[v]) desde los nodos fuera del subtree de v
        ans[v] = ans[u] - sz[v] + (n - sz[v]);
        dfs2(v, u);
    }
}

int main() {
    // ...
    dfs1(1, 0);
    ans[1] = dp[1];
    dfs2(1, 0);
    // ans[u] = suma de distancias desde u a todos los demás nodos
}
```

---

## Sección F: Debugging y errores comunes

### Error 1: No manejar el padre en DFS

```cpp
// ERROR: sin filtrar el padre, visitas a la arista padre como un hijo
for (int v : adj[u]) {
    dfs(v, u);  // ← si el árbol es no-dirigido, adj[u] incluye al padre!
}

// CORRECTO:
for (int v : adj[u]) {
    if (v == par) continue;  // filtrar el padre
    dfs(v, u);
}
```

### Error 2: Olvidar casos base para hojas

```cpp
// Las hojas (sin hijos) son los casos base automáticamente si el loop de hijos no ejecuta
// Pero asegúrate de inicializar dp[u][0] y dp[u][1] ANTES del loop de hijos

void dfs(int u, int par) {
    dp[u][0] = 0;      // ← inicializar ANTES del loop
    dp[u][1] = w[u];   // ← inicializar ANTES del loop
    for (int v : adj[u]) {
        if (v == par) continue;
        dfs(v, u);
        // combinar...
    }
}
```

### Error 3: Stack overflow en árboles muy profundos (cadenas)

Un árbol que es una cadena de $n$ nodos tiene profundidad $n$. Para $n = 10^5$, DFS recursivo puede causar stack overflow.

```cpp
// Solución: iterar DFS con stack explícito, o aumentar el stack
// En Linux: ulimit -s unlimited
// O usar Bottom-Up con orden topológico BFS (Kahn's algorithm estilo)
```

### Error 4: Combinar hijos en el orden incorrecto

Si la combinación de hijos tiene efecto de orden (como en el árbol con $k$ cortes), asegúrate de que el loop de combinación es correcto.

### Checklist de debugging

```
□ ¿Filtro el nodo padre en cada DFS?
□ ¿Inicializo dp[u] antes del loop de hijos?
□ ¿Los casos base (hojas) se manejan automáticamente?
□ ¿Probé con un árbol de 1 nodo?
□ ¿Probé con un árbol lineal (cadena)?
□ ¿La profundidad puede causar stack overflow?
```

---

**Referencias cruzadas**
- Ver `01_RECETA_UNIVERSAL.md` para el protocolo general
- Ver `08_OPTIMIZACIONES.md` para técnicas de DP sobre árboles más avanzadas
- Ver `repaso/guia-grafos-concurso.md` para DFS y traversal de árboles

*Fuentes: Rascó Galván §6.2.1–6.2.2*
