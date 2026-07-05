---
titulo: Prefix Sum (Sumas de Prefijos)
tipo: icpc-tema
materia: icpc
categoria: estructuras
estado: en-progreso
dificultad: 2
fuente-cp4: "§2.4.3"
fuente-cph: "Cap. 9"
etiquetas: [icpc, icpc/tema, icpc/categoria/estructuras, icpc/estado/en-progreso, dificultad/media]
creado: 2026-04-11
actualizado: 2026-04-11
---

# Prefix Sum — Sumas de Prefijos

> Referencia: CPH Cap. 9 · CP4 §2.4.3

---

## Qué es

Un arreglo auxiliar donde `pre[i]` almacena la suma de todos los elementos desde el índice 0 hasta i. Permite responder consultas de suma de rango `[l, r]` en **O(1)** después de una construcción en **O(n)**.

---

## Cuándo usarlo

Busca estos patrones en el problema:
- "suma de un subarreglo `[l, r]`" repetida muchas veces
- "¿cuántos elementos en `[l, r]` cumplen X?"
- "diferencia entre dos segmentos"
- Múltiples queries sobre el mismo arreglo estático

Si el arreglo cambia entre queries → usar Segment Tree o BIT en su lugar.

---

## Idea clave

```
pre[0] = a[0]
pre[i] = pre[i-1] + a[i]

suma(l, r) = pre[r] - pre[l-1]   // con l > 0
suma(0, r) = pre[r]
```

La suma de cualquier rango se reduce a una resta de dos valores precalculados.

---

## Implementación base

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, q;
    cin >> n >> q;
    
    vector<long long> a(n), pre(n + 1, 0);
    for (int i = 0; i < n; i++) {
        cin >> a[i];
        pre[i + 1] = pre[i] + a[i];  // 1-indexed para evitar l-1 < 0
    }
    
    while (q--) {
        int l, r;
        cin >> l >> r;  // 1-indexed desde el input
        cout << pre[r] - pre[l - 1] << "\n";
    }
    return 0;
}
```

> **Truco de 1-indexado:** hacer `pre` de tamaño `n+1` con `pre[0] = 0` elimina el caso borde `l = 0`. Siempre usar esto.

---

## Complejidad

- Construcción: **O(n)**
- Query: **O(1)**
- Espacio: **O(n)**

---

## Variantes

### 2D Prefix Sum
Para matrices: suma de subrectángulo en O(1).
```cpp
// pre[i][j] = suma del subrectángulo (0,0) a (i,j)
pre[i][j] = a[i][j] + pre[i-1][j] + pre[i][j-1] - pre[i-1][j-1];

// Suma de (r1,c1) a (r2,c2):
suma = pre[r2][c2] - pre[r1-1][c2] - pre[r2][c1-1] + pre[r1-1][c1-1];
```

### Prefix Sum de diferencias (Difference Array)
Para aplicar actualizaciones de rango `[l, r] += val` en O(1) y reconstruir en O(n).
```cpp
diff[l] += val;
diff[r + 1] -= val;
// Al final: a[i] = sum(diff[0..i])
```

---

## Errores comunes

- Usar `int` cuando las sumas pueden desbordarse → usar `long long`
- Confundir 0-indexed y 1-indexed en la fórmula `pre[r] - pre[l-1]`
- Olvidar inicializar `pre[0] = 0` con 1-indexado

---

## Problemas para practicar

1. [CSES - Static Range Sum Queries](https://cses.fi/problemset/task/1646) — el clásico
2. [CSES - Forest Queries](https://cses.fi/problemset/task/1652) — 2D prefix sum
3. [CF 816B - Karen and Coffee](https://codeforces.com/problemset/problem/816/B) — difference array

## Problemas resueltos con esto

*(vacío — actualizar al resolver)*

---

## 🔗 Relacionado

[[icpc/temas/segment-tree]], [[icpc/temas/bit]], [[icpc/temas/bfs]], [[icpc-dashboard]]
