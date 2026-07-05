---
titulo: "Cheat Sheet — Grafos ICPC"
tipo: icpc-tema
categoria: grafos
estado: en-progreso
etiquetas: [icpc, icpc/tema, icpc/categoria/grafos]
creado: 2026-04-17
actualizado: 2026-04-17
---

# Cheat Sheet — Grafos ICPC

> Una sola página de referencia ultra-densa para el concurso.

---

## Tabla Maestra de Algoritmos

| Algoritmo | Resuelve | Complejidad | Restricción | Estructura |
|-----------|----------|-------------|-------------|-----------|
| BFS | Dist. mín. sin pesos | $O(N+M)$ | Pesos iguales | `queue` |
| DFS | Exploración, ciclos | $O(N+M)$ | — | Stack/recursión |
| 0-1 BFS | Dist. mín. pesos {0,1} | $O(N+M)$ | Pesos 0 o 1 | `deque` |
| Dijkstra | Dist. mín. con pesos | $O(M \log N)$ | Pesos ≥ 0 | `priority_queue` |
| Bellman-Ford | Dist. mín. pesos neg. | $O(N \cdot M)$ | Pesos negativos OK | Edge list |
| Floyd-Warshall | Todos los pares | $O(N^3)$ | $N \leq 500$ | Matriz |
| Kruskal | MST | $O(M \log M)$ | No dirigido | DSU + sort |
| Prim | MST | $O(M \log N)$ | No dirigido | Heap |
| DSU | Conectividad dinámica | $O(\alpha(N))$ | No dirigido | parent[] |
| Kahn | Orden topológico | $O(N+M)$ | Solo DAG | in_degree[] |
| Kosaraju | SCC | $O(N+M)$ | Dirigido | 2× DFS |
| Tarjan SCC | SCC | $O(N+M)$ | Dirigido | DFS + stack |
| 2-Coloring | Bipartito | $O(N+M)$ | — | BFS |
| Puentes | Aristas críticas | $O(N+M)$ | No dirigido | Low-link DFS |
| Articulación | Nodos críticos | $O(N+M)$ | No dirigido | Low-link DFS |
| Kuhn | Matching bipartito | $O(N \cdot M)$ | Bipartito | DFS |
| Hopcroft-Karp | Matching bipartito | $O(M\sqrt{N})$ | Bipartito | BFS+DFS |
| Dinic | Flujo máximo | $O(V^2 E)$ | — | BFS+DFS |
| LCA Binary Lift | LCA en árbol | $O(\log N)$ / qry | Árbol | ancestor[][] |
| HLD | Queries en paths | $O(\log^2 N)$ / qry | Árbol | + Seg. Tree |
| Centroid | Distancias en árbol | $O(N \log^2 N)$ | Árbol | — |

---

## Límites N por Complejidad (1 segundo)

```
O(N)         → N = 10^8
O(N log N)   → N = 5×10^6
O(N√N)       → N = 10^5
O(N²)        → N = 10^4
O(N³)        → N = 500
O(2^N · N)   → N = 20
```

---

## Snippets Mínimos

### BFS (10 líneas)
```cpp
vector<int> bfs(int s, int N, vector<vector<int>>& adj) {
    vector<int> d(N,-1); queue<int> q;
    d[s]=0; q.push(s);
    while(!q.empty()) {
        int u=q.front(); q.pop();
        for(int v:adj[u]) if(d[v]==-1){d[v]=d[u]+1;q.push(v);}
    }
    return d;
}
```

### Dijkstra (12 líneas)
```cpp
vector<long long> dijk(int s,int N,vector<vector<pair<int,int>>>& adj){
    const long long INF=1e18;
    vector<long long> d(N,INF);
    priority_queue<pair<long long,int>,vector<pair<long long,int>>,greater<>> pq;
    d[s]=0; pq.push({0,s});
    while(!pq.empty()){
        auto[di,u]=pq.top();pq.pop();
        if(di>d[u])continue;
        for(auto[v,w]:adj[u])if(d[u]+w<d[v]){d[v]=d[u]+w;pq.push({d[v],v});}
    }
    return d;
}
```

### DSU (12 líneas)
```cpp
struct DSU {
    vector<int> p,r,sz; int cc;
    DSU(int n):p(n),r(n,0),sz(n,1),cc(n){iota(p.begin(),p.end(),0);}
    int find(int x){return p[x]==x?x:p[x]=find(p[x]);}
    bool unite(int x,int y){x=find(x);y=find(y);if(x==y)return 0;
        if(r[x]<r[y])swap(x,y);p[y]=x;sz[x]+=sz[y];
        if(r[x]==r[y])r[x]++;cc--;return 1;}
    bool connected(int x,int y){return find(x)==find(y);}
};
```

### Kruskal (8 líneas)
```cpp
long long kruskal(int N,vector<tuple<int,int,int>>& edges){
    sort(edges.begin(),edges.end()); DSU dsu(N);
    long long cost=0; int cnt=0;
    for(auto[w,u,v]:edges) if(dsu.unite(u,v)){cost+=w;if(++cnt==N-1)break;}
    return cnt==N-1?cost:-1;
}
```

### Topológico — Kahn (10 líneas)
```cpp
vector<int> topo(int N,vector<vector<int>>& adj){
    vector<int> ind(N,0),ord;
    for(int u=0;u<N;u++) for(int v:adj[u]) ind[v]++;
    queue<int> q; for(int i=0;i<N;i++) if(!ind[i])q.push(i);
    while(!q.empty()){int u=q.front();q.pop();ord.push_back(u);
        for(int v:adj[u]) if(!--ind[v])q.push(v);}
    return (int)ord.size()==N?ord:vector<int>{};
}
```

### Kosaraju SCC (14 líneas)
```cpp
// adj y radj ya construidos globalmente
vector<bool> vis(N,0); vector<int> ord; vector<int> comp(N,-1);
void dfs1(int v){vis[v]=1;for(int u:adj[v])if(!vis[u])dfs1(u);ord.push_back(v);}
void dfs2(int v,int c){comp[v]=c;for(int u:radj[v])if(comp[u]==-1)dfs2(u,c);}
int kosaraju(){for(int i=0;i<N;i++)if(!vis[i])dfs1(i);int c=0;
    for(int i=N-1;i>=0;i--)if(comp[ord[i]]==-1)dfs2(ord[i],c++);return c;}
```

### Floyd-Warshall (6 líneas)
```cpp
void floyd(int N,vector<vector<long long>>& d){
    for(int k=0;k<N;k++) for(int i=0;i<N;i++) for(int j=0;j<N;j++)
        if(d[i][k]!=1e18&&d[k][j]!=1e18) d[i][j]=min(d[i][j],d[i][k]+d[k][j]);
}
```

### Puentes (15 líneas)
```cpp
vector<int> tin,low; vector<bool> vis; int tmr=0;
vector<pair<int,int>> bridges;
void bridge_dfs(int v,int p,vector<vector<int>>& adj){
    vis[v]=1; tin[v]=low[v]=tmr++;
    for(int u:adj[v]){if(u==p)continue;
        if(vis[u])low[v]=min(low[v],tin[u]);
        else{bridge_dfs(u,v,adj);low[v]=min(low[v],low[u]);
            if(low[u]>tin[v])bridges.push_back({v,u});}}
}
```

### Matching Bipartito — Kuhn (12 líneas)
```cpp
vector<int> adj[505]; int matchL[505],matchR[505]; bool vis[505];
bool aug(int u){for(int v:adj[u]){if(vis[v])continue;vis[v]=1;
    if(matchR[v]==-1||aug(matchR[v])){matchL[u]=v;matchR[v]=u;return 1;}}return 0;}
int max_match(int NL,int NR){fill(matchL,matchL+NL,-1);fill(matchR,matchR+NR,-1);
    int res=0; for(int u=0;u<NL;u++){fill(vis,vis+NR,0);if(aug(u))res++;}return res;}
```

### LCA Binary Lifting (12 líneas)
```cpp
const int LOG=17; int par[LOG][100005],dep[100005];
void dfs_lca(int v,int p,int d,vector<vector<int>>& adj){
    dep[v]=d; par[0][v]=p;
    for(int u:adj[v])if(u!=p)dfs_lca(u,v,d+1,adj);}
void build(int N){for(int k=1;k<LOG;k++)for(int v=1;v<=N;v++)par[k][v]=par[k-1][par[k-1][v]];}
int lca(int u,int v){if(dep[u]<dep[v])swap(u,v);int d=dep[u]-dep[v];
    for(int k=0;k<LOG;k++)if((d>>k)&1)u=par[k][u];
    if(u==v)return u;
    for(int k=LOG-1;k>=0;k--)if(par[k][u]!=par[k][v]){u=par[k][u];v=par[k][v];}
    return par[0][u];}
```

---

## Checklist Pre-Submit (15 puntos)

```
REPRESENTACIÓN
[ ] 1. ¿Grafo dirigido o no? ¿Aristas en ambas/una dirección?
[ ] 2. ¿Indexación 0-based en el código? ¿Convertí del input?
[ ] 3. ¿Hay aristas múltiples? ¿El algoritmo las maneja?

ALGORITMO
[ ] 4. ¿Elegí el algoritmo correcto para la restricción del problema?
[ ] 5. ¿Inicialicé dist[]/visited[] correctamente?
[ ] 6. ¿Uso long long para distancias que pueden ser grandes?
[ ] 7. ¿LINF es suficientemente grande? (1e18 para LL)
[ ] 8. ¿k es el loop más externo en Floyd-Warshall?
[ ] 9. ¿Verifico dist[u] != LINF antes de sumar en BF/Floyd?

CASOS ESPECIALES
[ ] 10. ¿Manejo grafo desconectado? (iterar todos los nodos)
[ ] 11. ¿Verifico que el resultado para inalcanzables es correcto?
[ ] 12. ¿Hay pesos negativos? → No usar Dijkstra
[ ] 13. ¿Para topológico: verifico size==N? (ciclo → imposible)
[ ] 14. ¿Para MST: verifico que se agregaron N-1 aristas?

OUTPUT
[ ] 15. ¿El formato de salida es exactamente el pedido?
```

---

## Errores en 2 Palabras

| Error | En 2 Palabras |
|-------|--------------|
| Dijkstra + pesos negativos | "No funciona" |
| Floyd, k no externo | "Resultado incorrecto" |
| INF + peso → overflow | "Negativo misterioso" |
| BFS, marcar al sacar | "Cola explota" |
| Topológico + ciclo | "Orden incompleto" |
| DSU en dirigido | "SCCs incorrectas" |
| Raíz articulación | "Falso positivo" |
| `>` vs `>=` puentes | "Diagnóstico incorrecto" |
| Aristas múltiples puentes | "Usar edge_id" |
| Recursión profunda | "Stack overflow" |
| SPFA adversarial | "TLE garantizado" |
| Backward cap=cap | "Flujo incorrecto" |

---

## Síntoma → Algoritmo (Versión Ultra-Condensada)

```
"pasos mínimos"          → BFS
"distancia mínima"       → Dijkstra (w≥0) / BF (w<0)
"todos los pares"        → Floyd (N≤500)
"conectar mínimo costo"  → Kruskal
"¿conectados?"           → DSU
"orden prerrequisitos"   → Topológico
"grupos mutuamente"      → SCC
"arista/nodo crítico"    → Low-Link
"bipartito / matching"   → 2-color / Kuhn
"máximo flujo"           → Dinic
"ancestro común árbol"   → LCA Binary Lift
"query en camino árbol"  → HLD + Seg. Tree
```

---

## 🔗 Relacionado

- [[icpc/temas/GRAPHS_ICPC/README]]
- [[16_IDENTIFICACION_RAPIDA]]
- [[17_ERRORES_CONCEPTUALES]]
- [[18_CASOS_EDGE]]
- [[icpc-dashboard]]
