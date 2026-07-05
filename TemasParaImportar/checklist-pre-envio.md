---
titulo: Checklist Pre-Envío
tipo: icpc-tema
materia: icpc
categoria: algoritmos
estado: en-progreso
etiquetas: [icpc, icpc/tema, icpc/categoria/algoritmos]
creado: 2026-04-19
actualizado: 2026-04-19
---

# Checklist Pre-Envío

## Por qué existe

En la 1ra Fecha GPMX 2026, `freopen` no comentado causó WA en A **y** en G dentro del
mismo contest. Dos problemas triviales (★☆) costaron ~60 min de penalización extra.
Este checklist es la corrección sistémica.

## El Checklist (memorizar e imprimir)

```
ANTES DE CADA ENVÍO — 15 segundos, sin excepción:

□ 1. freopen comentado o eliminado
□ 2. Número de test cases: ¿tc=1 o cin>>tc? Verificar contra enunciado
□ 3. ¿El resultado final tiene % MOD si el problema lo pide?
□ 4. Complejidad total: T × complejidad_por_caso < 10^8
□ 5. Output format: ¿espacios extra? ¿\n al final? ¿case X:?
```

## Cómo aplicarlo

- Imprimir en papel y pegar al lado del monitor en cada contest
- Aplicarlo en CADA sesión de práctica hasta que sea automático
- Si falla un envío → revisar el checklist ANTES de buscar bug de lógica

## El Template Mínimo Limpio

```cpp
#include <bits/stdc++.h>
using namespace std;

void solve(){
    // tu solución
}

int main(){
    ios::sync_with_stdio(false); cin.tie(0);
    // freopen("input.txt", "r", stdin);  // COMENTAR ANTES DE ENVIAR

    int tc = 1;
    // cin >> tc;                          // DESCOMENTAR SI HAY MÚLTIPLES CASOS
    while(tc--){ solve(); }

    return 0;
}
```

## Errores comunes relacionados

| Error | Síntoma en judge | Fix |
|-------|-----------------|-----|
| freopen activo | WA / RE silencioso | Siempre comentar |
| tc=1 cuando hay múltiples casos | Solo resuelve el primer caso | Leer enunciado de input |
| Falta % MOD | WA en casos grandes | Mod en cada multiplicación |
| O(N²) cuando se necesita O(N log N) | TLE | Calcular complejidad antes de implementar |
| Trailing space / newline extra | Presentation Error / WA | Verificar output format |

## 🔗 Relacionado

[[ANALISIS_1ra_Fecha_ICPC_MX_2026]]
[[icpc/temas/aritmetica-modular]]
