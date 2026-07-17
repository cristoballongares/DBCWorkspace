import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'cristoballongares@gmail.com';

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

type TopicSeed = {
  title: string;
  category: string;
  content: string;
  commonPitfalls?: string;
};

// ═══════════════════════════════════════════════════════════════════════════
// CPH: Competitive Programmer's Handbook (Antti Laaksonen)
// docs/libros/cph.pdf — 30 capítulos, 27 temas derivados.
// ═══════════════════════════════════════════════════════════════════════════

const CPH_TOPICS: TopicSeed[] = [
  {
    title: 'CPH: Introducción y complejidad temporal',
    category: 'CPH - Técnicas básicas',
    content: `## ¿Qué es?

La **complejidad temporal** mide cómo crece el tiempo de ejecución de un algoritmo cuando la entrada se hace más grande. Se expresa con notación asintótica: $f(n) = O(g(n))$ significa que existen constantes $c > 0$ y $n_0$ tales que $f(n) \\le c \\cdot g(n)$ para todo $n \\ge n_0$. En la práctica, describe el comportamiento del algoritmo cuando $n$ tiende a infinito, ignorando constantes y términos de menor orden.

## ¿Por qué es importante?

Antes de escribir una sola línea de código, estimar la complejidad permite saber si un algoritmo pasará los límites de tiempo del juez. Un juez típico ejecuta entre $10^8$ y $10^9$ operaciones simples por segundo. Sin este cálculo mental, se corre el riesgo de implementar una solución destinada a TLE (Time Limit Exceeded).

## Reglas de cálculo

- **Bucles secuenciales**: las complejidades se suman y domina el término mayor. Un bucle $O(n)$ seguido de otro $O(n^2)$ sigue siendo $O(n^2)$.
- **Bucles anidados**: las complejidades se multiplican. Dos bucles anidados de tamaño $n$ dan $O(n^2)$.
- **Recursión**: para recurrencias de la forma $T(n) = a \\cdot T(n/b) + f(n)$ (divide y vencerás), el Master Theorem da la solución según cómo se comparan $f(n)$ y $n^{\\log_b a}$.

## Tabla de complejidad tolerable según $N$

| $N$ máximo | Complejidad tolerable |
|---|---|
| $N \\le 10$ | $O(N!)$, $O(2^N \\cdot N)$ |
| $N \\le 20$–$24$ | $O(2^N)$ |
| $N \\le 100$–$500$ | $O(N^4)$ |
| $N \\le 2\\,000$–$10\\,000$ | $O(N^3)$ |
| $N \\le 10^4$–$10^5$ | $O(N^2)$ |
| $N \\le 10^6$ | $O(N \\log N)$ |
| $N \\le 10^8$ | $O(N)$ |
| $N$ arbitrario ($10^{18}$) | $O(\\log N)$ o $O(1)$ |

## Ejemplo práctico: Kadane (suma máxima de subarreglo)

Dado un arreglo, encontrar la suma máxima de un subarreglo contiguo. El enfoque ingenuo prueba todos los pares de índices ($O(n^2)$). Kadane lo resuelve en $O(n)$ manteniendo la mejor suma que **termina exactamente** en la posición actual:

$$best[i] = \\max(a[i],\\ best[i-1] + a[i])$$

\\\`\\\`\\\`cpp
long long kadane(vector<long long>& a) {
    long long best = a[0], cur = a[0];
    for (size_t i = 1; i < a.size(); i++) {
        cur = max(a[i], cur + a[i]);
        best = max(best, cur);
    }
    return best;
}
\\\`\\\`\\\`

## Fórmulas matemáticas útiles

$$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2} \\qquad \\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6}$$

$$\\sum_{i=0}^{n-1} x^i = \\frac{x^n - 1}{x - 1} \\quad (x \\neq 1)$$

La suma armónica $\\sum_{i=1}^{n} \\frac{1}{i} \\approx \\ln n$ explica por qué sumar $n/d$ para $d = 1, \\ldots, n$ da $O(n \\log n)$ en vez de $O(n^2)$.

## Relación con otros temas

- **CPH: Ordenamiento y búsqueda binaria**: cada algoritmo de ordenamiento tiene una complejidad específica que se analiza con estas mismas reglas.
- **CPH: Análisis amortizado**: extiende el análisis a secuencias de operaciones donde el costo individual puede ser engañoso.
- **CP4: Fundamentos y consejos**: retoma la estimación de complejidad como una de las habilidades centrales del competidor.`,
    commonPitfalls:
      'Asumir que un algoritmo $O(n^2)$ pasa sin calcular el límite real de $N$. Confundir $O(n \\log n)$ con $O(n)$ al estimar si un algoritmo pasa el límite de tiempo. Ignorar las constantes ocultas en algoritmos con la misma cota asintótica pero diferente rendimiento práctico.',
  },
  {
    title: 'CPH: Ordenamiento y búsqueda binaria',
    category: 'CPH - Técnicas básicas',
    content: `## ¿Qué es?

El **ordenamiento** reorganiza una secuencia de elementos según un criterio (típicamente orden numérico o lexicográfico). La **búsqueda binaria** es una técnica que, sobre una secuencia ordenada, descarta la mitad del espacio de búsqueda en cada comparación, reduciendo el costo de $O(n)$ a $O(\\log n)$.

## ¿Por qué es importante?

Ordenar es la operación previa más común antes de aplicar otras técnicas (two pointers, búsqueda binaria, compresión de coordenadas). Entender qué algoritmo de ordenamiento usar y cuándo es fundamental para no perder tiempo ni memoria.

## Teoría de ordenamiento

Los algoritmos de ordenamiento **por comparación** (merge sort, quicksort, heapsort) tienen una cota inferior demostrable de $O(n \\log n)$: con $n$ elementos hay $n!$ órdenes posibles, y cada comparación solo puede descartar una fracción de ellos. Cuando los valores están acotados en un rango pequeño $[0, k]$, **counting sort** rompe esa cota contando ocurrencias: $O(n + k)$, sin comparar elementos.

## Ordenar en C++

\\\`sort()\\\` implementa introsort (quicksort con fallback a heapsort si la recursión se profundiza demasiado), garantizando $O(n \\log n)$. Acepta un comparador personalizado:

\\\`\\\`\\\`cpp
sort(v.begin(), v.end(), [](const P& a, const P& b) {
    if (a.first != b.first) return a.first < b.first;
    return a.second < b.second; // desempate
});
\\\`\\\`\\\`

## Búsqueda binaria clásica

\\\`lower_bound\\\` devuelve el primer elemento $\\ge x$; \\\`upper_bound\\\` el primero $> x$; la diferencia entre ambos da la cantidad de ocurrencias de $x$.

## Búsqueda binaria en la respuesta (parametric search)

Más allá de buscar un valor exacto, la búsqueda binaria sirve para **buscar en la respuesta**: si existe una función $f(x)$ monótona (por ejemplo, "¿es posible resolver el problema usando a lo sumo $x$ recursos?"), se puede binariar sobre $x$ directamente. Esto convierte problemas de optimización en problemas de decisión, generalmente más fáciles de verificar.

## Ejemplo práctico: encontrar la capacidad mínima

Se tienen $n$ paquetes con pesos $w_i$ y $k$ camiones. ¿Cuál es la capacidad mínima $C$ que debe tener cada camión para transportar todos los paquetes respetando el orden? Con búsqueda binaria sobre $C$ y una función de verificación $O(n)$ que simula el empaquetado, se resuelve en $O(n \\log(\\sum w_i))$.

## Relación con otros temas

- **CPH: Two pointers y análisis amortizado**: two pointers requiere un arreglo ordenado como precondición.
- **CP4: Divide y vencerás, búsqueda binaria y ternaria**: extiende la búsqueda binaria al dominio continuo con búsqueda ternaria.
- **CPH: Estructuras de datos dinámicas**: \\\`set\\\` y \\\`map\\\` mantienen datos ordenados automáticamente.`,
    commonPitfalls:
      'Usar búsqueda binaria sobre una función que no es realmente monótona (el resultado es indefinido). Errores de límites off-by-one al implementar lower_bound/upper_bound a mano. Olvidar que sort() no es estable (usar stable_sort si el orden relativo de elementos iguales importa).',
  },
  {
    title: 'CPH: Estructuras de datos dinámicas de C++',
    category: 'CPH - Técnicas básicas',
    content: `## ¿Qué es?

Las estructuras de datos dinámicas de la STL (Standard Template Library) de C++ permiten almacenar, acceder y modificar colecciones de datos cuyo tamaño cambia en tiempo de ejecución. Incluyen \\\`vector\\\`, \\\`set\\\`, \\\`map\\\`, \\\`stack\\\`, \\\`queue\\\`, \\\`deque\\\` y \\\`priority_queue\\\`.

## ¿Por qué es importante?

Elegir la estructura correcta puede ser la diferencia entre un algoritmo que pasa en milisegundos y uno que da TLE. Cada estructura tiene un perfil de operaciones distinto (inserción, búsqueda, borrado, acceso por índice) y conocer sus complejidades permite seleccionar la óptima para cada problema.

## \\\`vector\\\` — arreglo dinámico

Crece duplicando su capacidad cuando se llena, lo que amortiza cada \\\`push_back\\\` a $O(1)$ aunque una inserción individual que provoca redimensionamiento sea $O(n)$. Acceso aleatorio $O(1)$. Ideal cuando se necesita acceso por índice y las inserciones/borrados son mayoritariamente al final.

## \\\`set\\\` / \\\`map\\\` — árboles balanceados

Implementados como red-black trees. Mantienen elementos **ordenados** con inserción, borrado y búsqueda en $O(\\log n)$. \\\`multiset\\\` permite duplicados; \\\`multimap\\\` permite claves repetidas.

## \\\`unordered_set\\\` / \\\`unordered_map\\\` — tablas de hash

$O(1)$ esperado para inserción, borrado y búsqueda mediante hashing, a costa de un peor caso $O(n)$ ante colisiones adversarias. No mantienen orden. Preferirlos cuando solo se necesita pertenencia o mapeo sin requerir orden.

## Iteradores y rangos

Toda la STL usa la convención de rango semi-abierto $[begin, end)$: \\\`begin()\\\` apunta al primer elemento y \\\`end()\\\` a la posición **después** del último. Esto permite escribir bucles sin casos especiales para colecciones vacías.

## Otras estructuras

- **\\\`stack\\\`** (LIFO): inserción/borrado $O(1)$ en el tope.
- **\\\`queue\\\`** (FIFO): inserción al final, borrado al frente, $O(1)$.
- **\\\`deque\\\`**: inserción/borrado $O(1)$ en ambos extremos.
- **\\\`priority_queue\\\`**: heap binario, insertar y extraer el máximo en $O(\\log n)$.

## Ejemplo práctico: frecuencia de palabras

Contar cuántas veces aparece cada palabra en un texto. Con \\\`unordered_map<string, int>\\\` cada inserción/actualización es $O(1)$ esperado. Si además se necesitan las palabras en orden alfabético, conviene \\\`map<string, int>\\\` ($O(\\log n)$ por operación) o volcar el \\\`unordered_map\\\` a un \\\`vector\\\` y ordenarlo al final.

## Relación con otros temas

- **CP4: Heap, hash table, bBST y order statistics tree**: expande sobre las implementaciones y aplicaciones avanzadas de estas estructuras.
- **CPH: Consultas de rango**: el segment tree y el Fenwick tree son estructuras especializadas para consultas sobre arreglos.
- **CPH: Análisis amortizado**: \\\`vector\\\` es el ejemplo canónico de análisis amortizado.`,
    commonPitfalls:
      'Usar \\\`set\\\` cuando alcanza con ordenar una vez y recorrer (el set tiene peor constante y localidad de caché). Asumir que \\\`unordered_map\\\` es siempre $O(1)$ sin considerar colisiones. Modificar un contenedor mientras se itera sobre él sin usar las versiones adecuadas de erase/insert.',
  },
  {
    title: 'CPH: Búsqueda completa',
    category: 'CPH - Técnicas básicas',
    content: `## ¿Qué es?

La **búsqueda completa** (también llamada fuerza bruta) genera y evalúa **todas** las soluciones candidatas posibles para un problema, garantizando encontrar la solución óptima (si existe) porque no descarta ninguna posibilidad sin evaluarla.

## ¿Por qué es importante?

Es la técnica más simple y, para entradas pequeñas, a menudo la solución esperada por el juez. Incluso cuando existen algoritmos más eficientes, la búsqueda completa sirve como punto de partida para verificar la lógica y como base sobre la cual aplicar técnicas de optimización (poda, meet in the middle, DP).

## Generación de subconjuntos

Con $n$ elementos hay $2^n$ subconjuntos. Se generan iterando una máscara de bits de $0$ a $2^n - 1$, o recursivamente decidiendo incluir/excluir cada elemento:

\\\`\\\`\\\`cpp
void generar(int i, vector<int>& actual) {
    if (i == n) { procesar(actual); return; }
    generar(i + 1, actual);           // excluir elemento i
    actual.push_back(a[i]);
    generar(i + 1, actual);           // incluir elemento i
    actual.pop_back();
}
\\\`\\\`\\\`

## Generación de permutaciones

$n!$ permutaciones. En C++, \\\`next_permutation\\\` las genera en orden lexicográfico sobre un arreglo ya ordenado.

## Backtracking y poda

El patrón general es: probar una opción, recursar sobre el resto del problema, y deshacer la opción al volver (backtrack). La **poda** —cortar ramas que ya no pueden mejorar la mejor respuesta conocida o que violan una restricción— es lo que vuelve viable un backtracking que en el peor caso es exponencial.

## Meet in the middle

Cuando $n$ es demasiado grande para $O(2^n)$ pero $n \\le 40$, se divide el conjunto en dos mitades de tamaño $n/2$: se generan todas las $2^{n/2}$ combinaciones de cada mitad por separado, y se combinan los resultados con búsqueda binaria. Complejidad total $O(2^{n/2} \\cdot n)$, muy por debajo de $O(2^n)$.

## Ejemplo práctico: suma de subconjunto con meet in the middle

Dado un conjunto de $n \\le 40$ números y un objetivo $x$, determinar si existe un subconjunto que sume $x$. Se parte en dos mitades $A$ y $B$, se generan todas las sumas de cada mitad, se ordenan las de $B$, y para cada suma de $A$ se busca binariamente si $x - suma_A$ está en $B$. Complejidad $O(2^{n/2} \\log(2^{n/2}))$.

## Relación con otros temas

- **CPH: Programación dinámica básica**: DP es esencialmente búsqueda completa con memoización para evitar recalcular subproblemas.
- **CP4: Búsqueda completa**: expande con técnicas iterativas, tips de poda y estrategias específicas de concurso.
- **CPH: Manipulación de bits**: la representación de subconjuntos mediante bitmask es la base de la DP sobre subconjuntos.`,
  },
  {
    title: 'CPH: Algoritmos greedy',
    category: 'CPH - Técnicas básicas',
    content: `## ¿Qué es?

Un **algoritmo greedy** (voraz) construye una solución tomando en cada paso la decisión que parece mejor en ese momento, sin reconsiderar decisiones anteriores. A diferencia de la programación dinámica, nunca deshace una elección.

## ¿Por qué es importante?

Cuando un greedy es correcto, suele ser la solución más eficiente posible (típicamente $O(n \\log n)$ o $O(n)$). Sin embargo, **demostrar** que un greedy produce la solución óptima es la parte difícil: muchos problemas "parecen" greedy pero en realidad requieren DP. Saber distinguir ambas situaciones es una habilidad central.

## Problema de las monedas

Dado un valor objetivo y denominaciones, elegir siempre la moneda más grande da el número mínimo de monedas **solo** para sistemas "canónicos" (euro: 1, 2, 5, 10, 20, 50, 100, 200). En sistemas arbitrarios (ej. {1, 3, 4} para formar 6: greedy da 4+1+1=3, óptimo es 3+3=2) el greedy falla y hace falta DP.

## Scheduling: maximizar actividades

Dado un conjunto de actividades con horario de inicio y fin, para maximizar cuántas se pueden realizar sin solaparse se ordena por tiempo de **fin** ascendente y se toma greedy cada actividad compatible con la última elegida. Demostración: argumento de intercambio.

## Tareas y plazos

Para minimizar la suma de tiempos de finalización sin plazos: procesar en orden de duración ascendente ("shortest job first"). Con plazos, el criterio se combina con un heap para decidir qué tarea descartar.

## Minimizando sumas con un punto

Dado un conjunto de valores $a_i$ y un punto $p$ a elegir:

$$p = \\text{mediana}(a) \\implies \\text{minimiza} \\sum_i |a_i - p|$$
$$p = \\text{media}(a) \\implies \\text{minimiza} \\sum_i (a_i - p)^2$$

## Códigos de Huffman

Construye un árbol binario óptimo para codificar símbolos según su frecuencia, minimizando la longitud esperada del mensaje codificado. Con un min-heap se combinan repetidamente los dos nodos de menor frecuencia hasta obtener un solo árbol.

## Relación con otros temas

- **CPH: Programación dinámica básica**: DP resuelve los casos donde el greedy falla (ej. coin problem general, knapsack).
- **CP4: Algoritmos greedy (CP4)**: expande con más ejemplos, demostraciones formales y aplicaciones en contests.
- **CPH: Árboles de expansión mínima**: Kruskal es un algoritmo greedy sobre aristas.`,
    commonPitfalls:
      'Aplicar un greedy sin demostrar (con argumento de intercambio o de elección greedy) que realmente es óptimo para ese problema específico. Muchos problemas parecen "greedy" pero requieren DP.',
  },
  {
    title: 'CPH: Programación dinámica básica',
    category: 'CPH - Técnicas básicas',
    content: `## ¿Qué es?

La **programación dinámica** (DP) es una técnica que combina la corrección de la búsqueda completa con la eficiencia de los algoritmos greedy. Resuelve un problema dividiéndolo en subproblemas que se solapan, calculando cada uno **una sola vez** y almacenando el resultado (memoización o tabulación).

## ¿Por qué es importante?

DP es probablemente la técnica más ubicua en programación competitiva. Resuelve problemas de optimización y conteo que serían imposibles con búsqueda completa por los límites de tiempo, y cubre una familia enorme de problemas clásicos que aparecen una y otra vez en los concursos.

## Condiciones necesarias

Un problema admite DP si cumple dos condiciones:
1. **Subestructura óptima**: la solución óptima se construye a partir de soluciones óptimas de subproblemas más pequeños.
2. **Subproblemas superpuestos**: los mismos subproblemas aparecen repetidamente en la recursión (si no se solapan, alcanza con divide y vencerás).

## Coin problem (mínimo número de monedas)

$$dp[x] = \\min_{c \\in \\text{monedas},\\ c \\le x} \\big(dp[x - c] + 1\\big), \\qquad dp[0] = 0$$

Complejidad $O(x \\cdot \\text{monedas})$. Este problema **no** se puede resolver con greedy en el caso general.

## Longest Increasing Subsequence (LIS)

Versión $O(n^2)$: $dp[i]$ = longitud de la subsecuencia creciente más larga que termina en $i$:

$$dp[i] = 1 + \\max_{j < i,\\ a_j < a_i} dp[j]$$

Versión $O(n \\log n)$: se mantiene un arreglo \\\`tails\\\` donde \\\`tails[k]\\\` es el menor valor final posible de una subsecuencia creciente de longitud $k+1$, y para cada elemento se busca binariamente su posición.

## Caminos en una grilla

Conteo o minimización de caminos con movimientos restringidos (derecha/abajo):
$$dp[i][j] = dp[i-1][j] + dp[i][j-1] \\quad \\text{(conteo)}$$
$$dp[i][j] = a[i][j] + \\min(dp[i-1][j], dp[i][j-1]) \\quad \\text{(costo mínimo)}$$

## Knapsack 0/1

$$dp[i][c] = \\max\\big(dp[i-1][c],\\ dp[i-1][c - w_i] + v_i\\big)$$

Estado = mejor valor usando los primeros $i$ items con capacidad $c$. Complejidad $O(n \\cdot C)$. Se comprime a arreglo 1D recorriendo la capacidad en orden **descendente** para no reusar un ítem dos veces.

## Distancia de edición (Levenshtein)

Mínimo de inserciones, borrados y sustituciones para transformar un string en otro:

$$dp[i][j] = \\begin{cases} dp[i-1][j-1] & \\text{si } s_i = t_j \\\\ 1 + \\min(dp[i-1][j],\\ dp[i][j-1],\\ dp[i-1][j-1]) & \\text{si } s_i \\neq t_j \\end{cases}$$

Complejidad $O(n \\cdot m)$.

## Ejemplo práctico: Coin Change con reconstrucción

Además de calcular el mínimo de monedas, se puede reconstruir **qué** monedas se usaron guardando, junto con cada $dp[x]$, la moneda $c$ que produjo ese mínimo (\\\`choice[x] = c\\\`). Luego se recorre hacia atrás desde $x$ hasta $0$ para obtener la combinación exacta.

## Relación con otros temas

- **CP4: Programación dinámica (CP4)**: cubre DP clásica, no clásica, y patrones avanzados como DP en árboles y DP con bitmask.
- **CPH: Análisis amortizado**: two pointers resuelve en $O(n)$ ciertos problemas que ingenuamente parecen requerir DP.
- **CPH: Manipulación de bits**: DP sobre bitmask (TSP) usa enteros como estado.
- **TemasParaImportar/dp/**: guía maestra de DP con 12 archivos detallados que cubren desde fundamentos hasta optimizaciones avanzadas.`,
    commonPitfalls:
      'Definir mal el estado (falta información para decidir la transición, o sobra y hace la tabla inmanejable). Recalcular subproblemas sin memoizar. Overflow al sumar/multiplicar en dp[] con enteros de 32 bits. Usar DP cuando un greedy era correcto y más simple.',
  },
  {
    title: 'CPH: Análisis amortizado',
    category: 'CPH - Técnicas básicas',
    content: `## ¿Qué es?

El **análisis amortizado** evalúa el costo **promedio** de una operación sobre una secuencia, en vez del costo de una operación aislada. Una operación puede parecer costosa individualmente, pero si se demuestra que el costo total de $n$ operaciones es $O(n)$, el costo amortizado por operación es $O(1)$.

## ¿Por qué es importante?

Sin análisis amortizado, técnicas como two pointers ($O(n)$ en vez de $O(n^2)$), pilas monótonas o el redimensionamiento de \\\`vector\\\` parecerían más lentas de lo que realmente son. Entender el concepto permite confiar en estas técnicas y aplicarlas sin miedo.

## Two pointers

Dos índices $i$ y $j$ se mueven siempre **hacia adelante** (nunca retroceden). Como cada uno recorre el arreglo a lo sumo una vez, el trabajo total es $O(n)$ en vez de $O(n^2)$:

\\\`\\\`\\\`cpp
int i = 0, j = (int)a.size() - 1;
while (i < j) {
    long long suma = a[i] + a[j];
    if (suma == objetivo) { /* encontrado */ break; }
    if (suma < objetivo) i++; else j--;
}
\\\`\\\`\\\`

El secreto está en que ni $i$ ni $j$ retroceden, así que cada uno hace a lo sumo $n$ movimientos. Aunque el bucle parezca $O(n^2)$ a simple vista, es $O(n)$.

## Nearest smaller elements (pila monótona)

Para cada elemento, encontrar el elemento menor más cercano a la izquierda. Con una pila monótona creciente se logra en $O(n)$ total: cada elemento se agrega y se elimina de la pila a lo sumo una vez.

## Sliding window minimum (deque monótono)

Mantener el mínimo de una ventana deslizante de tamaño $k$ en $O(n)$ total. Antes de insertar un nuevo elemento se descartan del final del deque todos los mayores a él, y del frente los que ya salieron de la ventana. Cada elemento entra y sale del deque una sola vez.

## Ejemplo práctico: subarreglo más largo con suma ≤ S

Dado un arreglo de enteros positivos y un límite $S$, encontrar el subarreglo contiguo más largo cuya suma no exceda $S$. Con two pointers (un índice izquierdo que avanza para reducir la suma, uno derecho que avanza para expandir) se resuelve en $O(n)$.

## Relación con otros temas

- **CPH: Ordenamiento y búsqueda binaria**: two pointers típicamente requiere un arreglo ordenado.
- **CPH: Estructuras de datos dinámicas**: \\\`vector\\\` debe su inserción $O(1)$ amortizado al redimensionamiento por duplicación.
- **CP4: Arreglos, bitmask y enteros grandes**: two pointers y sliding window son técnicas fundamentales sobre arreglos.`,
  },
  {
    title: 'CPH: Consultas de rango',
    category: 'CPH - Técnicas básicas',
    content: `## ¿Qué es?

Las **consultas de rango** son preguntas sobre un intervalo $[l, r]$ de un arreglo: suma, mínimo, máximo, gcd, etc. Cuando el arreglo es estático (no cambia) se pueden preprocesar estructuras que responden en $O(1)$. Cuando cambia (actualizaciones), se necesitan estructuras dinámicas como el Fenwick tree o el segment tree.

## ¿Por qué es importante?

Problemas de consultas de rango aparecen constantemente en los concursos. La diferencia entre $O(n)$ por consulta (recorrer el arreglo cada vez) y $O(\\log n)$ o $O(1)$ (con estructura auxiliar) puede ser la diferencia entre TLE y AC cuando hay muchas consultas.

## Sparse table (RMQ estático)

Si el arreglo no cambia, una sparse table responde consultas de mínimo/máximo en $O(1)$ tras preprocesamiento $O(n \\log n)$. Se precomputa \\\`st[k][i]\\\` = mínimo del rango $[i, i + 2^k - 1]$:

$$st[k][i] = \\min\\big(st[k-1][i],\\ st[k-1][i + 2^{k-1}]\\big)$$

Una consulta $[l, r]$ se responde con $k = \\lfloor \\log_2(r - l + 1) \\rfloor$:

$$\\text{query}(l, r) = \\min\\big(st[k][l],\\ st[k][r - 2^k + 1]\\big)$$

Esto funciona porque $\\min$ es **idempotente** (los rangos se pueden solapar). Para operaciones no idempotentes como suma, la sparse table no sirve en $O(1)$.

## Binary Indexed Tree (Fenwick Tree)

Estructura compacta para sumas de prefijo: actualizar un punto y consultar la suma de un prefijo cuestan $O(\\log n)$ cada uno, usando el truco $\\text{lowbit}(i) = i \\mathbin{\\&} (-i)$ para navegar entre índices. Más simple y con mejor constante que el segment tree, pero limitado a operaciones tipo suma de prefijo.

## Segment tree

Generaliza a cualquier operación **asociativa** (suma, min, max, gcd, xor): consulta y actualización en $O(\\log n)$, con $O(4n)$ de espacio. Cada nodo representa un rango; la raíz cubre todo el arreglo y cada hijo la mitad. Soporta actualizaciones de rango mediante lazy propagation (marcas pendientes que solo se propagan cuando hace falta).

## Ejemplo práctico: suma de rango con actualizaciones puntuales

Con un Fenwick tree, \\\`add(i, delta)\\\` suma delta a la posición $i$ en $O(\\log n)$, y \\\`sum(i)\\\` devuelve la suma del prefijo $[0, i]$. La suma de rango $[l, r]$ es \\\`sum(r) - sum(l-1)\\\`.

\\\`\\\`\\\`cpp
void add(int i, long long delta) {
    for (; i < n; i |= i + 1) bit[i] += delta;
}
long long sum(int i) {
    long long s = 0;
    for (; i >= 0; i = (i & (i + 1)) - 1) s += bit[i];
    return s;
}
\\\`\\\`\\\`

## Relación con otros temas

- **CPH: Segment trees revisited**: lazy propagation, segment tree dinámico, 2D.
- **CP4: Segment Tree (CP4)**: construcción, variantes, y aplicaciones avanzadas.
- **CP4: Fenwick Tree (Binary Indexed Tree)**: detalles de implementación y aplicaciones más allá de la suma.`,
    commonPitfalls:
      'Construir una sparse table para operaciones no idempotentes (como suma) esperando $O(1)$ por consulta. Olvidar que una sparse table no soporta actualizaciones. Usar índices 0-based en Fenwick tree sin adaptar la implementación (bit[i] usa i |= i+1 para 0-based).',
  },
  {
    title: 'CPH: Manipulación de bits',
    category: 'CPH - Técnicas básicas',
    content: `## ¿Qué es?

La **manipulación de bits** consiste en operar directamente sobre la representación binaria de los números enteros. Las operaciones bitwise (AND, OR, XOR, NOT, shifts) permiten realizar en $O(1)$ tareas que de otra forma requerirían bucles, y habilitan técnicas como la representación de conjuntos mediante bitmask y la DP sobre subconjuntos.

## ¿Por qué es importante?

En programación competitiva, la manipulación de bits aparece en tres contextos principales: (1) representar subconjuntos como enteros para DP sobre bitmask (TSP, asignación), (2) optimizar operaciones con trucos como \\\`x & (x-1)\\\` para apagar el bit menos significativo, y (3) usar operaciones bitwise para problemas de conjuntos, cribas y hashing.

## Representación

Los enteros con signo se guardan en **complemento a dos**: un \\\`int\\\` de 32 bits cubre $[-2^{31}, 2^{31} - 1]$. $-x$ se calcula como $\\sim x + 1$.

## Operaciones bitwise fundamentales

- $\\&$ (AND), $|$ (OR), $\\oplus$ (XOR), $\\sim$ (NOT), $\\ll$ / $\\gg$ (shifts)
- XOR es su propio inverso: $a \\oplus b \\oplus b = a$, $a \\oplus a = 0$, $a \\oplus 0 = a$

## Representar conjuntos con bitmask

Un entero de $n$ bits representa un subconjunto de $\\{0, \\ldots, n-1\\}$:

\\\`\\\`\\\`cpp
mask | (1 << i)   // agregar i
mask & ~(1 << i)  // quitar i
mask & (1 << i)   // verificar pertenencia (!= 0 si está)
mask ^ (1 << i)   // alternar i
\\\`\\\`\\\`

## Funciones built-in de GCC (compilador)

- \\\`__builtin_popcount(x)\\\`: cuenta bits en 1 en $O(1)$ (instrucción POPCNT del hardware).
- \\\`__builtin_ctz(x)\\\`: cuenta ceros al final (count trailing zeros). Útil para iterar sobre los bits encendidos de una máscara.
- \\\`__builtin_clz(x)\\\`: cuenta ceros al inicio (count leading zeros).
- \\\`x & (x-1)\\\`: apaga el bit menos significativo que está en 1.

## DP sobre bitmask: el problema del viajante (TSP)

Estado $dp[mask][i]$ = costo mínimo para visitar exactamente el conjunto \\\`mask\\\` terminando en la ciudad $i$:

$$dp[mask][i] = \\min_{j \\in mask,\\ j \\neq i} \\big(dp[mask \\setminus \\{i\\}][j] + costo(j, i)\\big)$$

Complejidad $O(2^n \\cdot n^2)$, viable para $n$ hasta ~18–20.

## Ejemplo práctico: generar todos los subconjuntos de una máscara

Para iterar sobre todos los subconjuntos de una máscara \\\`mask\\\` (incluyendo el vacío y \\\`mask\\\` mismo):

\\\`\\\`\\\`cpp
for (int sub = mask; ; sub = (sub - 1) & mask) {
    // procesar subconjunto 'sub'
    if (sub == 0) break;
}
\\\`\\\`\\\`

Este truco es $O(3^n)$ en el peor caso sobre todos los subconjuntos de todas las máscaras, pero es la forma canónica de iterar submáscaras.

## Relación con otros temas

- **CPH: Búsqueda completa**: la generación de subconjuntos por bitmask es la versión iterativa de la generación recursiva.
- **CPH: Programación dinámica básica**: la DP sobre bitmask extiende DP a estados que representan conjuntos.
- **CP4: Arreglos, bitmask y enteros grandes**: cubre aplicaciones adicionales y trucos con bitmask.`,
  },
  {
    title: 'CPH: Fundamentos y recorrido de grafos',
    category: 'CPH - Algoritmos de grafos',
    content: `## ¿Qué es?

Un **grafo** $G = (V, E)$ es un conjunto de nodos (vértices) conectados por aristas. Los **recorridos** DFS (Depth-First Search) y BFS (Breadth-First Search) son los algoritmos fundamentales para explorar grafos y sirven como base para decenas de algoritmos más avanzados.

## ¿Por qué es importante?

Casi todos los algoritmos de grafos (Dijkstra, componentes conexas, detección de ciclos, ordenamiento topológico, SCC, puentes, flujo) se construyen sobre DFS o BFS. Entenderlos a fondo —sus propiedades, los tipos de aristas que descubren, y las aplicaciones directas— es el prerequisito para todo el resto de la teoría de grafos en competencia.

## Representaciones

- **Lista de adyacencia**: cada nodo guarda un vector de vecinos. Espacio $O(V + E)$. Es la representación por defecto para la mayoría de problemas.
- **Matriz de adyacencia**: \\\`adj[u][v]\\\` para cada par. Espacio $O(V^2)$. Útil con grafos densos o cuando $V$ es pequeño ($\\le 5000$).
- **Edge list**: vector de aristas $(u, v, w)$. Usada en algoritmos como Bellman-Ford o Kruskal.

## DFS (Depth-First Search)

Explora tan profundo como sea posible antes de retroceder. Se implementa con recursión (o pila explícita). Complejidad $O(V + E)$. Durante el recorrido, cada arista se clasifica como: de árbol (hacia un hijo no visitado), de retroceso (hacia un ancestro), hacia adelante (hacia un descendiente no hijo), o cruzada (entre ramas distintas).

## BFS (Breadth-First Search)

Explora por niveles usando una cola: primero todos los nodos a distancia 1 de la fuente, luego distancia 2, etc. En grafos **no ponderados**, BFS encuentra las distancias mínimas (en número de aristas) desde el origen a todos los demás nodos. Complejidad $O(V + E)$.

## Aplicaciones directas

- **Componentes conexas**: correr DFS/BFS desde cada nodo no visitado; cada corrida marca una componente.
- **Bipartición (2-coloreo)**: durante el recorrido, alternar color entre nodos adyacentes; si dos adyacentes terminan con el mismo color, el grafo no es bipartito.
- **Detección de ciclos**: en no dirigidos, una arista hacia un nodo ya visitado que no es el padre indica un ciclo. En dirigidos, se usa el truco de los tres estados (no visitado, en pila de recursión, terminado).

## Ejemplo práctico: distancia en laberinto

Un laberinto es una grilla donde cada celda es un nodo y cada movimiento (arriba, abajo, izquierda, derecha) es una arista hacia el vecino. BFS desde la celda inicial encuentra la distancia mínima a cualquier otra celda, evitando paredes. Es el algoritmo estándar para "shortest path in a maze".

## Relación con otros temas

- **CPH: Caminos mínimos**: Dijkstra generaliza BFS a grafos con pesos positivos; Bellman-Ford a grafos con pesos negativos.
- **CPH: Grafos dirigidos y DP en DAG**: el ordenamiento topológico se obtiene con DFS (post-orden invertido).
- **CPH: Conectividad fuerte y 2-SAT**: Kosaraju y Tarjan para SCC se basan en DFS.
- **CP4: Recorridos de grafos**: expande con flood fill, aplicaciones en grillas implícitas, y problemas típicos de concurso.`,
  },
  {
    title: 'CPH: Caminos mínimos',
    category: 'CPH - Algoritmos de grafos',
    content: `## ¿Qué es?

El problema de **caminos mínimos** consiste en encontrar la ruta de menor costo (suma de pesos de aristas) entre nodos de un grafo. Existen tres variantes principales según el origen y destino: desde un origen a todos los demás (SSSP), entre todos los pares (APSP), y entre un par específico.

## ¿Por qué es importante?

Es uno de los problemas más frecuentes en competencias. Cada variante tiene su algoritmo óptimo según las características del grafo (pesos positivos, negativos, sin ciclos, tamaño) y elegir el equivocado puede dar TLE o WA.

## Bellman-Ford

Relaja **todas** las aristas $V - 1$ veces. Complejidad $O(V \\cdot E)$. Soporta pesos **negativos** y detecta ciclos negativos: si en una iteración extra ($V$-ésima) alguna arista aún se puede relajar, existe un ciclo negativo alcanzable. Ideal para grafos pequeños con posibles pesos negativos.

## Dijkstra

Para grafos **sin pesos negativos**. Con cola de prioridad (min-heap) corre en $O((V + E) \\log V)$. Siempre procesa el nodo no finalizado con menor distancia tentativa. La garantía de corrección depende crucialmente de la no-negatividad de los pesos.

\\\`\\\`\\\`cpp
vector<long long> dist(n, LLONG_MAX);
priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
dist[src] = 0; pq.push({0, src});
while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    if (d > dist[u]) continue; // entrada obsoleta
    for (auto [v, w] : adj[u])
        if (dist[u] + w < dist[v]) {
            dist[v] = dist[u] + w;
            pq.push({dist[v], v});
        }
}
\\\`\\\`\\\`

## Floyd-Warshall

Todos los pares de caminos mínimos en $O(V^3)$. Itera sobre cada nodo intermedio $k$:

$$dist[i][j] = \\min\\big(dist[i][j],\\ dist[i][k] + dist[k][j]\\big)$$

**El orden de los bucles es crítico**: $k$ debe ser el más externo. Ideal cuando $V \\le 500$. También sirve para transitive closure (si existe un camino de $i$ a $j$) y para detectar ciclos negativos ($dist[i][i] < 0$).

## Ejemplo práctico: reconstruir el camino

Además de la distancia mínima, muchas veces se necesita el camino exacto. Se mantiene un arreglo \\\`parent[v]\\\` que guarda el nodo desde el cual se relajó $v$ por última vez. Al finalizar Dijkstra, se recorre \\\`parent\\\` hacia atrás desde el destino hasta el origen para reconstruir la ruta.

## Relación con otros temas

- **CPH: Fundamentos y recorrido de grafos**: BFS es el caso especial de Dijkstra con todos los pesos igual a 1 (o de Bellman-Ford sin pesos negativos).
- **CP4: Caminos mínimos desde un origen (SSSP)**: expande con aplicaciones, variantes y trucos de implementación.
- **CP4: Caminos mínimos entre todos los pares (APSP)**: Floyd-Warshall con más detalle y aplicaciones.`,
    commonPitfalls:
      'Usar Dijkstra con pesos negativos (da resultados incorrectos sin avisar). Olvidar el chequeo "if (d > dist[u]) continue" antes de procesar un nodo de la cola, procesando entradas obsoletas. Invertir el orden de los bucles de Floyd-Warshall (k debe ser el más externo).',
  },
  {
    title: 'CPH: Algoritmos en árboles',
    category: 'CPH - Algoritmos de grafos',
    content: `## ¿Qué es?

Un **árbol** es un grafo conexo y acíclico con $n$ nodos y exactamente $n - 1$ aristas. Sus propiedades especiales (sin ciclos, camino único entre cualquier par de nodos) permiten algoritmos más simples y eficientes que en grafos generales.

## ¿Por qué es importante?

Los árboles aparecen en problemas de jerarquías, redes, estructuras de datos (segment tree, Union-Find), y como caso especial en algoritmos de grafos. Muchas técnicas (DP en árboles, rerooting, LCA, HLD) son exclusivas de árboles y aprovechan su estructura.

## Recorrido de árboles

Al recorrer con DFS/BFS se debe pasar el nodo padre como parámetro para no retroceder por la arista de la que se vino, evitando confundirla con un ciclo.

## Diámetro

El camino más largo entre dos nodos cualesquiera. Se encuentra con **dos** recorridos DFS/BFS: desde un nodo arbitrario $x$ se halla el nodo más lejano $a$; desde $a$ se halla el más lejano $b$; la distancia $a$–$b$ es el diámetro. Esto funciona solo porque es un árbol; costo $O(n)$.

## Todos los caminos más largos (rerooting)

Calcular, **desde cada nodo**, la distancia al nodo más lejano del árbol. Se usa DP en dos pasadas:
1. Hacia las hojas: para cada nodo, la distancia máxima dentro de su subárbol.
2. De la raíz hacia abajo: se propaga la mejor distancia que pasa "por fuera" del subárbol del nodo.

Costo $O(n)$ en vez de $O(n^2)$ (recalcular desde cada nodo).

## Árboles binarios en arreglo

Un árbol binario completo (o casi) se representa con índices: hijo izquierdo de $i$ es $2i$, derecho $2i+1$ (1-based), padre de $i$ es $\\lfloor i/2 \\rfloor$. Esa misma indexación usan los heaps binarios y el segment tree clásico.

## Ejemplo práctico: encontrar el centro del árbol

El centro es el nodo (o los dos nodos) que minimiza la distancia máxima a cualquier otro nodo. Se encuentra podando repetidamente las hojas (nodos con grado 1) hasta que quede 1 o 2 nodos. Equivale a encontrar el punto medio del diámetro.

## Relación con otros temas

- **CPH: Consultas en árboles y LCA**: extiende las consultas sobre árboles a ancestros, subárboles y caminos.
- **CPH: Árboles de expansión mínima**: construye un árbol que "resume" un grafo más grande.
- **CP4: Grafos especiales**: cubre árboles como caso especial con más aplicaciones y técnicas.`,
  },
  {
    title: 'CPH: Árboles de expansión mínima',
    category: 'CPH - Algoritmos de grafos',
    content: `## ¿Qué es?

Un **árbol de expansión mínima** (MST, Minimum Spanning Tree) de un grafo conexo, no dirigido y ponderado es un subconjunto de aristas que conecta todos los nodos sin ciclos y con el peso total mínimo posible.

## ¿Por qué es importante?

El MST aparece en problemas de redes (cableado mínimo), clustering, y como subrutina en algoritmos de aproximación. Es uno de los problemas fundamentales de grafos y sus dos algoritmos principales (Kruskal y Prim) ilustran patrones greedy que se repiten en otros contextos.

## Kruskal

Ordena las aristas por peso ascendente y las agrega greedy si sus extremos no están ya en el mismo componente (verificado con Union-Find). Complejidad $O(E \\log E)$, dominada por el ordenamiento. La correctitud se apoya en la **propiedad de corte**: la arista más barata que cruza cualquier corte pertenece a algún MST.

## Union-Find (Disjoint Set Union)

Cada conjunto es un árbol implícito donde cada nodo apunta a su padre. Dos optimizaciones clave:

- **Compresión de camino**: al hacer \\\`find\\\`, cada nodo visitado apunta directamente a la raíz.
- **Unión por rango/tamaño**: se cuelga el árbol más chico del más grande.

Con ambas, cada operación cuesta $O(\\alpha(n))$ amortizado, prácticamente $O(1)$.

\\\`\\\`\\\`cpp
int find(int x) {
    return parent[x] == x ? x : parent[x] = find(parent[x]);
}
void unite(int a, int b) {
    a = find(a); b = find(b);
    if (a != b) {
        if (sz[a] < sz[b]) swap(a, b);
        parent[b] = a; sz[a] += sz[b];
    }
}
\\\`\\\`\\\`

## Prim

Alternativa a Kruskal: crece el MST desde un nodo inicial, agregando en cada paso la arista de menor peso que conecta un nodo ya en el MST con uno fuera. Con cola de prioridad, $O(E \\log V)$. Preferible sobre Kruskal cuando el grafo es denso ($E$ cercano a $V^2$).

## Ejemplo práctico: Maximum Spanning Tree

Para maximizar el peso total en vez de minimizarlo, basta con ordenar las aristas en orden **descendente** en Kruskal, o usar un max-heap en Prim. El resto del algoritmo es idéntico.

## Relación con otros temas

- **CP4: Árbol de expansión mínima (MST)**: variantes, aplicaciones adicionales (Minimax, Maximin) y problemas típicos.
- **CP4: Union-Find Disjoint Sets**: implementaciones avanzadas, DSU con rollback, y aplicaciones más allá del MST.
- **CPH: Algoritmos greedy**: Kruskal es un ejemplo canónico de algoritmo greedy con demostración formal.`,
  },
  {
    title: 'CPH: Grafos dirigidos y DP en DAG',
    category: 'CPH - Algoritmos de grafos',
    content: `## ¿Qué es?

Un **DAG** (Directed Acyclic Graph) es un grafo dirigido sin ciclos. Sobre un DAG se puede definir un **orden topológico** —una ordenación lineal de los nodos tal que toda arista va de un nodo anterior a uno posterior—, lo cual habilita resolver problemas de caminos y DP de forma muy eficiente.

## ¿Por qué es importante?

Muchos problemas que en grafos generales son NP-difíciles (camino más largo, conteo de caminos) se vuelven polinomiales en un DAG gracias al orden topológico. Además, la detección de ciclos en grafos dirigidos es una habilidad básica de debugging en problemas de dependencias y scheduling.

## Ordenamiento topológico

Solo existe si el grafo es un DAG. Dos algoritmos principales:
- **DFS**: guardar los nodos en post-orden invertido (al terminar de procesar un nodo, agregarlo al frente de la lista).
- **Kahn (BFS)**: mantener los nodos con grado de entrada 0 en una cola; procesarlos, decrementar el grado de entrada de sus vecinos, y encolar los que lleguen a 0.

Ambos $O(V + E)$.

## DP en DAG

Una vez que se tiene el orden topológico, problemas como "camino más largo desde un origen", "número de caminos distintos entre dos nodos", o "camino de costo mínimo/máximo" se resuelven procesando los nodos en ese orden, ya que cuando se procesa un nodo todas sus dependencias (nodos que tienen aristas hacia él) ya fueron calculadas.

## Successor paths (caminos de sucesores)

Cada nodo tiene exactamente un sucesor. Para encontrar el nodo al que se llega tras $k$ pasos sin simular uno por uno ($O(k)$), se usa **binary lifting**: precomputar \\\`succ[x][p]\\\` = nodo alcanzado desde $x$ tras $2^p$ pasos. Así, $k$ pasos se descomponen en $O(\\log k)$ saltos de potencia de 2. Misma idea que LCA.

## Detección de ciclos en grafos dirigidos

Marcar los nodos con tres estados durante DFS: no visitado, en la pila de recursión actual, terminado. Encontrar una arista hacia un nodo que está actualmente en la pila de recursión indica un ciclo.

## Ejemplo práctico: camino más largo en un DAG

$$dp[v] = \\max_{(u,v) \\in E} \\big(dp[u] + w(u, v)\\big)$$

Se inicializa $dp[v] = 0$ para todos los nodos y se procesan en orden topológico. Al procesar $u$, para cada arista $(u, v, w)$ se actualiza $dp[v] = \\max(dp[v], dp[u] + w)$. La respuesta es $\\max_v dp[v]$. Complejidad $O(V + E)$.

## Relación con otros temas

- **CPH: Fundamentos y recorrido de grafos**: el orden topológico por DFS usa el mismo recorrido.
- **CPH: Programación dinámica básica**: DP en DAG es la aplicación natural de DP sobre grafos sin ciclos.
- **CPH: Consultas en árboles y LCA**: binary lifting para successor paths es la misma técnica que para LCA.`,
  },
  {
    title: 'CPH: Conectividad fuerte y 2-SAT',
    category: 'CPH - Algoritmos de grafos',
    content: `## ¿Qué es?

Las **componentes fuertemente conexas** (SCC, Strongly Connected Components) son subgrafos maximales de un grafo dirigido donde existe un camino dirigido entre cualquier par de nodos. El **grafo de condensación** (un DAG donde cada nodo es una SCC) revela la estructura global del grafo. **2-SAT** es el problema de decidir si una fórmula booleana en forma normal conjuntiva con exactamente 2 literales por cláusula es satisfacible, y se resuelve reduciéndolo a SCC.

## ¿Por qué es importante?

SCC aparece en problemas de dependencias circulares, propagación de información en redes dirigidas, y como prerrequisito para 2-SAT. 2-SAT a su vez modela problemas de asignación con restricciones binarias (horarios, conflictos, selección de opciones) que aparecen con frecuencia.

## Kosaraju

Dos pasadas de DFS:
1. DFS sobre el grafo original, guardando los nodos en orden de finalización.
2. DFS sobre el grafo **transpuesto** (aristas invertidas), procesando los nodos en orden inverso al de finalización del paso 1.

Cada árbol del segundo DFS es una SCC. Complejidad $O(V + E)$.

## Tarjan para SCC

Una **sola** pasada de DFS usando \\\`disc\\\` (tiempo de descubrimiento) y \\\`low\\\` (menor \\\`disc\\\` alcanzable). Cuando \\\`low[v] == disc[v]\\\`, $v$ es la raíz de una SCC y todos los nodos en la pila hasta $v$ forman esa componente. También $O(V + E)$ pero en una sola pasada.

## 2-SAT

Cada variable $x_i$ genera dos nodos: $x_i$ (verdadero) y $\\neg x_i$ (falso). Cada cláusula $(a \\lor b)$ se traduce a dos implicaciones: $(\\neg a \\implies b)$ y $(\\neg b \\implies a)$. La fórmula es satisfacible **si y solo si** ninguna variable tiene su literal verdadero y su literal falso en la misma SCC. La asignación se construye tomando el valor de verdad según el orden topológico de las SCC (la que aparece después en el orden topológico es la verdadera).

## Ejemplo práctico: asignación de horarios

"El curso A debe ser antes que el curso B o después que el curso C". Variables booleanas $p_{ij}$ = "curso $i$ va antes que curso $j$". Restricciones de precedencia y exclusión mutua se modelan como cláusulas 2-SAT, y la satisfacibilidad determina si existe un horario válido.

## Relación con otros temas

- **CPH: Fundamentos y recorrido de grafos**: Kosaraju y Tarjan se basan en DFS.
- **CPH: Grafos dirigidos y DP en DAG**: el grafo de condensación de SCC es un DAG, sobre el cual se puede aplicar DP.
- **CP4: Puntos de articulación, puentes y SCC**: complementa con el algoritmo de Tarjan para puentes y puntos de articulación en grafos no dirigidos.`,
  },
  {
    title: 'CPH: Consultas en árboles y LCA',
    category: 'CPH - Algoritmos de grafos',
    content: `## ¿Qué es?

El **LCA** (Lowest Common Ancestor) de dos nodos en un árbol enraizado es el nodo más profundo que es ancestro de ambos. Las **consultas en árboles** incluyen encontrar el $k$-ésimo ancestro, calcular valores sobre subárboles y caminos, y procesar múltiples consultas fuera de línea.

## ¿Por qué es importante?

LCA es la consulta fundamental en árboles y es ubicua en competencias. Aparece directamente ("distancia entre dos nodos del árbol") y como subrutina en algoritmos más complejos como HLD (Heavy-Light Decomposition). La técnica de binary lifting que usa LCA se reutiliza en otros contextos (successor paths, DP sobre árboles).

## Encontrar ancestros con binary lifting

Precomputar \\\`up[v][p]\\\` = el ancestro de $v$ a distancia $2^p$ hacia arriba. Con un DFS se llena $p=0$ (el padre directo), y luego por DP:

$$up[v][p] = up[\\,up[v][p-1]\\,][p-1]$$

Con esta tabla, encontrar el $k$-ésimo ancestro cuesta $O(\\log n)$ (descomponer $k$ en potencias de 2), y LCA cuesta $O(\\log n)$: subir el nodo más profundo a la misma altura que el otro, y luego subir ambos juntos.

## Subárboles y caminos con Euler Tour

Un recorrido DFS que registra cada vez que se entra y sale de un nodo (Euler Tour) convierte **subárboles en rangos contiguos** de un arreglo. Esto permite aplicar un segment tree o Fenwick tree sobre el arreglo del Euler Tour para consultas y actualizaciones en subárboles en $O(\\log n)$.

## Algoritmos fuera de línea (Tarjan offline LCA)

Con Union-Find y un DFS, se responden múltiples consultas de LCA en $O((n + q) \\cdot \\alpha(n))$ sin necesidad de binary lifting. Útil cuando $n$ es grande, la memoria para la tabla de binary lifting ($O(n \\log n)$) es prohibitiva, y todas las consultas se conocen de antemano.

## Ejemplo práctico: distancia entre dos nodos

$$dist(u, v) = depth[u] + depth[v] - 2 \\cdot depth[lca(u, v)]$$

Con LCA en $O(\\log n)$ (binary lifting) y profundidades precalculadas en $O(n)$ con un DFS, la distancia se responde en $O(\\log n)$.

## Relación con otros temas

- **CP4: Grafos especiales**: árboles como caso especial con más técnicas (centroid decomposition, HLD).
- **CPH: Grafos dirigidos y DP en DAG**: binary lifting se usa tanto en LCA como en successor paths.
- **CPH: Consultas de rango**: el Euler Tour convierte consultas de subárbol en consultas de rango, que se responden con segment tree o Fenwick.`,
  },
  {
    title: 'CPH: Caminos y circuitos',
    category: 'CPH - Algoritmos de grafos',
    content: `## ¿Qué es?

Un **camino/circuito Euleriano** recorre cada **arista** exactamente una vez. Un **camino/ciclo Hamiltoniano** visita cada **nodo** exactamente una vez. Son dos problemas fundamentales con naturalezas muy distintas: el Euleriano tiene condiciones simples de verificar y se construye en tiempo lineal; el Hamiltoniano es NP-completo en general.

## ¿Por qué es importante?

Los caminos Eulerianos aparecen en problemas de recorridos que deben cubrir todas las aristas (recorrido de calles, secuencias de De Bruijn). Los Hamiltonianos modelan problemas de visitar todos los nodos (TSP, recorridos de caballo) y, aunque NP-completos, para $n$ pequeño se resuelven con DP sobre bitmask.

## Condiciones para camino/circuito Euleriano

- **Grafo no dirigido**: circuito Euleriano si y solo si todos los nodos tienen grado par (el grafo debe ser conexo, ignorando nodos aislados). Camino Euleriano si exactamente 0 o 2 nodos tienen grado impar.
- **Grafo dirigido**: circuito Euleriano si y solo si cada nodo tiene grado de entrada igual a grado de salida y el grafo es fuertemente conexo (ignorando dirección).

## Algoritmo de Hierholzer

Construye el circuito en $O(E)$: se sigue un camino desde un nodo inicial hasta atascarse (volver a un nodo sin aristas no usadas), y se "inserta" ese circuito parcial en el punto correcto de un circuito más grande, repitiendo hasta usar todas las aristas.

## Caminos Hamiltonianos y TSP

No existe una condición simple para verificar si un grafo tiene un camino Hamiltoniano. Para $n \\le 20$, el TSP (Traveling Salesman Problem) se resuelve con DP sobre bitmask: $dp[mask][i]$ = costo mínimo para visitar el conjunto \\\`mask\\\` terminando en $i$, en $O(2^n \\cdot n^2)$.

## Secuencias de De Bruijn

Una secuencia cíclica de longitud $k^n$ (alfabeto de tamaño $k$) que contiene cada combinación posible de $n$ símbolos exactamente una vez. Se construye encontrando un **circuito Euleriano** en un grafo cuyos nodos son las secuencias de largo $n-1$ y cuyas aristas representan agregar un símbolo.

## Ejemplo práctico: recorrido de calles (problema del cartero chino)

Dado un grafo que representa calles, encontrar el recorrido más corto que pase por todas las calles al menos una vez. Si el grafo es Euleriano, el circuito Euleriano es la respuesta. Si no, se agregan aristas (duplicando calles) entre los nodos de grado impar para volverlo Euleriano (minimum weight perfect matching).

## Relación con otros temas

- **CPH: Manipulación de bits**: TSP se resuelve con DP sobre bitmask.
- **CPH: Flujos y cortes**: algunas variantes de matching y caminos disjuntos se reducen a flujo.
- **CP4: Grafos especiales**: cubre grafos Eulerianos y aplicaciones.`,
  },
  {
    title: 'CPH: Flujos y cortes',
    category: 'CPH - Algoritmos de grafos',
    content: `## ¿Qué es?

El problema de **flujo máximo** busca enviar la mayor cantidad posible de "flujo" desde una fuente $s$ a un sumidero $t$ a través de una red de aristas con capacidades, respetando que el flujo en cada arista no exceda su capacidad y que en cada nodo intermedio el flujo que entra sea igual al que sale. El **corte mínimo** es la partición de nodos que minimiza la capacidad total de las aristas que van del lado de $s$ al lado de $t$.

## ¿Por qué es importante?

Flujo máximo es una de las técnicas más versátiles: emparejamiento bipartito, caminos disjuntos, cobertura de caminos, asignación de tareas, y segmentación de imágenes se modelan como flujo. El teorema max-flow min-cut conecta flujo con corte y es una de las joyas de la teoría de grafos.

## Ford-Fulkerson y Edmonds-Karp

Se buscan repetidamente **caminos de aumento** (caminos de $s$ a $t$ con capacidad residual disponible) y se envía flujo igual a la capacidad mínima del camino, actualizando las capacidades residuales (incluida la arista inversa, que permite "deshacer" flujo). Con BFS para elegir el camino más corto (Edmonds-Karp), complejidad $O(V \\cdot E^2)$.

## Dinic

Añade el concepto de **grafo de niveles** (distancias desde $s$ en la red residual) y envía flujo por bloques (todos los caminos de aumento de un mismo nivel a la vez). Complejidad $O(V^2 \\cdot E)$ en general, $O(\\sqrt{V} \\cdot E)$ en grafos bipartitos. Es el algoritmo de flujo más usado en la práctica competitiva.

## Max-flow = Min-cut

El valor del flujo máximo es igual a la capacidad del corte mínimo. Cuando Ford-Fulkerson termina, los nodos alcanzables desde $s$ por aristas con capacidad residual positiva definen exactamente el corte mínimo.

## Aplicaciones clásicas

- **Emparejamiento máximo en grafo bipartito**: fuente → lado izquierdo → lado derecho → sumidero, todas las capacidades = 1. Flujo máximo = tamaño del matching.
- **Caminos disjuntos en aristas**: capacidades = 1, flujo máximo da el número de caminos sin aristas compartidas.
- **Cobertura mínima de caminos en DAG**: desdoblar cada nodo en "entrada" y "salida"; el tamaño de la cobertura es $n - \\text{matching}$.

## Ejemplo práctico: proyecto y herramientas

Un proyecto requiere un subconjunto de herramientas; cada herramienta tiene un costo; cada proyecto da una ganancia. ¿Qué proyectos conviene realizar? Se modela como min-cut: fuente → proyectos (ganancia), herramientas → sumidero (costo), proyecto → herramienta (∞). El corte mínimo elige los proyectos rentables netos.

## Relación con otros temas

- **CPH: Caminos y circuitos**: caminos disjuntos usan flujo máximo.
- **CPH: Conectividad fuerte y 2-SAT**: el grafo de implicaciones de 2-SAT se relaciona con propiedades de alcanzabilidad.
- **CPH: Árboles de expansión mínima**: MST y flujo son dos enfoques distintos para problemas de conectividad.`,
  },
  {
    title: 'CPH: Teoría de números',
    category: 'CPH - Temas avanzados',
    content: `## ¿Qué es?

La **teoría de números** en programación competitiva abarca primos, factorización, aritmética modular, exponenciación rápida, inverso modular, cribas, funciones multiplicativas y resolución de ecuaciones diofánticas. Casi todo se trabaja bajo un módulo (típicamente $10^9 + 7$).

## ¿Por qué es importante?

Aparece en problemas de conteo (coeficientes binomiales bajo módulo), criptografía simple, calendarios, y cualquier situación donde los números intermedios pueden desbordar el rango de los enteros nativos. El módulo mantiene los valores dentro de \\\`long long\\\`.

## Criba de Eratóstenes

Encuentra todos los primos hasta $n$ en $O(n \\log \\log n)$. Para cada primo $p$, se marcan como compuestos todos sus múltiplos comenzando desde $p^2$. Con optimizaciones (solo impares, arreglo de bits) se puede llevar hasta $n \\approx 10^8$ en memoria.

## Factorización

Probar divisores hasta $\\sqrt{n}$ en $O(\\sqrt{n})$. Para $n \\le 10^{12}$, es suficiente. Para factorizar muchos números, conviene precalcular los primos hasta $\\sqrt{\\max}$ con la criba y luego factorizar cada número probando solo esos primos.

## Exponenciación rápida (binary exponentiation)

$a^b \\bmod m$ en $O(\\log b)$:

\\\`\\\`\\\`cpp
long long power(long long a, long long b, long long mod) {
    long long res = 1; a %= mod;
    while (b > 0) {
        if (b & 1) res = res * a % mod;
        a = a * a % mod;
        b >>= 1;
    }
    return res;
}
\\\`\\\`\\\`

## Inverso modular (Fermat)

Si $p$ es primo y $\\gcd(a, p) = 1$: $a^{-1} \\equiv a^{p-2} \\pmod{p}$. Permite dividir bajo módulo: $\\frac{a}{b} \\bmod p = a \\times b^{-1} \\bmod p$.

## Algoritmo de Euclides extendido

Calcula $\\gcd(a, b)$ y además encuentra coeficientes $x, y$ tales que $ax + by = \\gcd(a, b)$. Sirve para calcular inversos modulares cuando el módulo no es primo (si $\\gcd(a, m) = 1$, el $x$ resultante es $a^{-1} \\bmod m$), y para resolver ecuaciones diofánticas lineales.

## Función totient de Euler

$\\varphi(n)$ cuenta los enteros positivos $\\le n$ coprimos con $n$. Para $n = p_1^{k_1} \\cdots p_r^{k_r}$:

$$\\varphi(n) = n \\prod_{i=1}^{r} \\left(1 - \\frac{1}{p_i}\\right)$$

Propiedad clave: $a^{\\varphi(m)} \\equiv 1 \\pmod{m}$ si $\\gcd(a, m) = 1$ (teorema de Euler).

## Ejemplo práctico: coeficientes binomiales bajo módulo

Precalcular factoriales y sus inversos modulares hasta $n$ en $O(n)$. Luego $\\binom{n}{k} \\bmod p = fact[n] \\times invFact[k] \\times invFact[n-k] \\bmod p$. Si $n$ es grande pero $p$ es primo pequeño, se usa el teorema de Lucas.

## Relación con otros temas

- **TemasParaImportar/aritmetica-modular.md**: guía específica de aritmética modular.
- **CPH: Combinatoria**: coeficientes binomiales, Catalan, inclusion-exclusion.
- **CPH: Matrices**: exponenciación rápida de matrices para recurrencias lineales bajo módulo.`,
  },
  {
    title: 'CPH: Combinatoria',
    category: 'CPH - Temas avanzados',
    content: `## ¿Qué es?

La **combinatoria** estudia las formas de contar, seleccionar y organizar elementos de conjuntos. En programación competitiva cubre coeficientes binomiales, números de Catalan, principio de inclusión-exclusión, lema de Burnside, y fórmula de Cayley.

## ¿Por qué es importante?

Los problemas de conteo ("¿de cuántas formas se puede...?") son frecuentes y casi siempre requieren responder bajo módulo. Conocer las herramientas combinatorias evita tener que enumerar explícitamente soluciones (lo cual sería TLE) y permite derivar fórmulas cerradas.

## Coeficientes binomiales

$\\binom{n}{k} = \\frac{n!}{k!(n-k)!}$ cuenta las formas de elegir $k$ elementos de un conjunto de $n$, sin importar el orden. Propiedades fundamentales:

$$\\binom{n}{k} = \\binom{n}{n-k} \\qquad \\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}$$

Esta última es el corazón del triángulo de Pascal y la base de la DP para precalcular todos los binomiales hasta $n$ en $O(n^2)$. Para un solo valor con $n$ grande, se usa la fórmula con factoriales precalculados y sus inversos modulares.

## Números de Catalan

$$C_n = \\frac{1}{n+1} \\binom{2n}{n}$$

Cuentan estructuras recursivas: secuencias de paréntesis balanceadas, árboles binarios con $n$ nodos, triangulaciones de polígonos, caminos en grilla que no cruzan la diagonal. Aparecen cuando hay un conteo de estructuras con "apertura y cierre".

## Principio de inclusión-exclusión

Para contar la unión de conjuntos que se solapan:

$$|A \\cup B \\cup C| = |A| + |B| + |C| - |A \\cap B| - |A \\cap C| - |B \\cap C| + |A \\cap B \\cap C|$$

Generalizando: alternar sumas y restas de intersecciones de tamaños crecientes. Útil para contar elementos que cumplen al menos una propiedad, o que **no** cumplen ninguna.

## Lema de Burnside

Cuenta configuraciones **distintas** bajo simetrías de un grupo $G$ (rotaciones, reflexiones):

$$\\frac{1}{|G|} \\sum_{g \\in G} |\\text{Fix}(g)|$$

Promedia, sobre todas las simetrías, el número de configuraciones que cada simetría deja fijas. Clásico para contar collares, coloraciones de tableros bajo rotación.

## Fórmula de Cayley

El número de árboles etiquetados distintos con $n$ nodos es $n^{n-2}$.

## Ejemplo práctico: contar caminos en grilla que no cruzan la diagonal

Caminos de $(0,0)$ a $(n,n)$ dando pasos derecha/arriba sin pasar por encima de la diagonal: el número es $C_n$, el $n$-ésimo número de Catalan. Se calcula con la fórmula usando factoriales y el inverso modular de $n+1$.

## Relación con otros temas

- **CPH: Teoría de números**: los coeficientes binomiales casi siempre se calculan bajo módulo, usando inverso modular.
- **CPH: Probabilidad**: la probabilidad clásica se reduce a conteo de casos favorables sobre casos totales.
- **CPH: Programación dinámica básica**: muchos problemas de DP son esencialmente de combinatoria (contar tilings, caminos).`,
  },
  {
    title: 'CPH: Matrices',
    category: 'CPH - Temas avanzados',
    content: `## ¿Qué es?

Las **matrices** en programación competitiva se usan principalmente para dos propósitos: (1) resolver recurrencias lineales rápidamente mediante exponenciación de matrices, y (2) contar caminos en grafos usando la matriz de adyacencia.

## ¿Por qué es importante?

La exponenciación rápida de matrices permite calcular el $n$-ésimo término de una recurrencia lineal (como Fibonacci) en $O(k^3 \\log n)$, donde $k$ es el orden de la recurrencia. Cuando $n$ es del orden de $10^{18}$, esto es la diferencia entre AC y TLE frente a una iteración $O(n)$.

## Operaciones básicas

- Suma de matrices $n \\times n$: $O(n^2)$
- Multiplicación de matrices $n \\times n$: $O(n^3)$ (algoritmo clásico)
- Exponenciación rápida de matrices: $O(n^3 \\log k)$ para calcular $M^k$

## Recurrencias lineales

Una recurrencia lineal de orden $k$ (ej. Fibonacci: $f_n = f_{n-1} + f_{n-2}$, orden 2) se expresa como multiplicación por una matriz de transición fija:

$$\\begin{pmatrix} f_{n+1} \\\\ f_n \\end{pmatrix} = \\begin{pmatrix} 1 & 1 \\\\ 1 & 0 \\end{pmatrix} \\begin{pmatrix} f_n \\\\ f_{n-1} \\end{pmatrix}$$

Elevando la matriz de transición a $n$ con exponenciación rápida, se obtiene $f_n$ en $O(k^3 \\log n)$. Para Fibonacci, $k=2$, así que $O(8 \\cdot \\log n) = O(\\log n)$.

## Grafos y matrices

La matriz de adyacencia $A$ elevada a $k$ da, en $A^k[i][j]$, el **número de caminos** de longitud exactamente $k$ entre $i$ y $j$. Esto permite contar caminos de longitud fija, resolver recurrencias sobre grafos de estados (cadenas de Markov), y calcular el número de caminos de longitud hasta $L$ (sumando $A + A^2 + \\cdots + A^L$).

## Ejemplo práctico: Fibonacci en $O(\\log n)$

Para calcular $fib(n) \\bmod m$ con $n \\le 10^{18}$:

\\\`\\\`\\\`cpp
struct Mat { long long a[2][2]; };
Mat mul(Mat& A, Mat& B, long long mod) {
    Mat C = {{{0,0},{0,0}}};
    for (int i = 0; i < 2; i++)
        for (int k = 0; k < 2; k++)
            for (int j = 0; j < 2; j++)
                C.a[i][j] = (C.a[i][j] + A.a[i][k] * B.a[k][j]) % mod;
    return C;
}
// fib(n) = power({{1,1},{1,0}}, n).a[0][1]
\\\`\\\`\\\`

## Relación con otros temas

- **CPH: Teoría de números**: la exponenciación de matrices es análoga a la exponenciación modular.
- **CPH: Probabilidad**: las cadenas de Markov se modelan con multiplicación de matrices.
- **CPH: Programación dinámica básica**: DP lineal con transición fija se acelera con exponenciación de matrices (Matrix Exponentiation DP).`,
  },
  {
    title: 'CPH: Probabilidad',
    category: 'CPH - Temas avanzados',
    content: `## ¿Qué es?

La **probabilidad** en programación competitiva cubre el cálculo de valores esperados, eventos independientes y dependientes, cadenas de Markov y algoritmos aleatorizados. La herramienta más poderosa es la **linealidad de la esperanza**, que permite descomponer problemas complejos en indicadores simples.

## ¿Por qué es importante?

Problemas de "valor esperado de X" aparecen regularmente. La linealidad de la esperanza —$E[X + Y] = E[X] + E[Y]$ incluso si $X$ e $Y$ no son independientes— simplifica enormemente el análisis al permitir descomponer el evento en partes independientes y sumarlas.

## Cálculo básico de probabilidad

$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$

Eventos **independientes**: $P(A \\cap B) = P(A) \\cdot P(B)$. Eventos **dependientes**: $P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}$ (probabilidad condicional).

## Variables aleatorias y esperanza

El valor esperado de una variable aleatoria discreta: $E[X] = \\sum_x x \\cdot P(X = x)$. La propiedad más útil:

$$E[X + Y] = E[X] + E[Y] \\quad \\text{(linealidad de la esperanza)}$$

Esto vale **incluso si $X$ e $Y$ no son independientes**. Es la herramienta central para problemas de esperanza.

## Uso de indicadores

Para calcular $E[X]$ donde $X$ es el número de eventos que ocurren, se define un indicador $I_i$ para cada evento posible (vale 1 si ocurre, 0 si no). Entonces $X = \\sum I_i$ y $E[X] = \\sum E[I_i] = \\sum P(\\text{evento } i \\text{ ocurre})$. Esto convierte un problema de esperanza en uno de probabilidad individual.

## Cadenas de Markov

Procesos donde el siguiente estado depende **solo** del estado actual. Se modelan con una matriz de transición $P$ donde $P_{ij}$ es la probabilidad de pasar de $i$ a $j$. La distribución tras $k$ pasos es el vector inicial multiplicado por $P^k$ (usando exponenciación rápida de matrices).

## Algoritmos aleatorizados

- **Hashing con semilla aleatoria**: evita que un adversario fuerce colisiones.
- **Quickselect con pivote aleatorio**: $O(n)$ esperado para el $k$-ésimo elemento.
- **Verificación de igualdad de polinomios**: evaluar en un punto aleatorio.

## Ejemplo práctico: valor esperado de caras en $n$ lanzamientos de moneda

Cada lanzamiento es un indicador $I_i$ con $E[I_i] = 0.5$. Por linealidad, $E[\\text{total}] = n \\cdot 0.5$, sin necesidad de analizar la distribución binomial completa.

## Relación con otros temas

- **CPH: Combinatoria**: probabilidad clásica = casos favorables / casos totales.
- **CPH: Matrices**: cadenas de Markov usan exponenciación de matrices para $k$ pasos.
- **CPH: Teoría de juegos**: juegos con componente aleatorio (expected game value).`,
  },
  {
    title: 'CPH: Teoría de juegos',
    category: 'CPH - Temas avanzados',
    content: `## ¿Qué es?

La **teoría de juegos** en programación competitiva analiza juegos de dos jugadores, por turnos, con información perfecta y sin azar. El objetivo es determinar qué jugador gana bajo juego óptimo y, en algunos casos, la estrategia ganadora.

## ¿Por qué es importante?

Problemas de juegos (Nim, variantes de substracción, juegos en grafos) aparecen en los concursos y se resuelven elegantemente con el **teorema de Sprague-Grundy**, que reduce cualquier juego imparcial a un solo número (el Grundy number) y la estrategia ganadora a XOR de estos números.

## Estados de juego

Un estado puede ser:
- **Ganador** (winning): existe al menos un movimiento que lleva a un estado perdedor.
- **Perdedor** (losing): todos los movimientos llevan a estados ganadores.

Los estados terminales (sin movimientos) son perdedores para quien le toca jugar.

## Juego de Nim

Hay $n$ montones con $a_i$ piedras cada uno. En cada turno, un jugador elige un montón y retira cualquier número positivo de piedras. El jugador que no puede mover pierde. La posición es perdedora para el primer jugador si y solo si:

$$a_1 \\oplus a_2 \\oplus \\cdots \\oplus a_n = 0$$

(donde $\\oplus$ es XOR). Si el XOR es distinto de 0, el primer jugador gana.

## Teorema de Sprague-Grundy

Todo juego **imparcial** (ambos jugadores tienen los mismos movimientos desde cada estado) es equivalente a un montón de Nim de tamaño $g$, donde $g$ es el número de Grundy del estado:

$$g(s) = \\text{mex}\\big(\\{g(t) : s \\to t\\}\\big)$$

donde $\\text{mex}$ es el mínimo entero no negativo ausente del conjunto. La posición combinada de varios juegos imparciales independientes es perdedora si el XOR de sus números de Grundy es 0.

## Ejemplo práctico: juego de substracción

Dado un conjunto $S$ de números que se pueden restar y un número inicial $n$, los jugadores alternan restando cualquier $s \\in S$ (con $s \\le n$). Pierde quien no puede mover. Se calcula $dp[i]$ = ganador/perdedor para el estado $i$:

$$dp[i] = \\text{winning si existe } s \\in S \\text{ con } i-s \\ge 0 \\text{ y } dp[i-s] = \\text{losing}$$

## Relación con otros temas

- **CPH: Programación dinámica básica**: la DP sobre estados de juego es una aplicación directa de memoización.
- **CPH: Manipulación de bits**: el XOR es la operación central en Nim y Sprague-Grundy.
- **CPH: Grafos dirigidos y DP en DAG**: un juego se puede modelar como un grafo dirigido donde los estados son nodos.`,
  },
  {
    title: 'CPH: Algoritmos de strings',
    category: 'CPH - Temas avanzados',
    content: `## ¿Qué es?

Los **algoritmos de strings** resuelven problemas sobre cadenas de texto: búsqueda de patrones, comparación de subcadenas, prefijos/sufijos, y estructuras como el trie y el Z-array. El **string hashing** es la técnica más práctica y versátil para la mayoría de los problemas.

## ¿Por qué es importante?

Problemas de strings aparecen en búsqueda de patrones, comparación lexicográfica, compresión, y ADN/secuencias. El string hashing con rolling hash permite comparar subcadenas en $O(1)$ tras preprocesamiento $O(n)$, convirtiendo problemas de strings en problemas de arreglos.

## String hashing (rolling hash)

Se elige una base $B$ (típicamente un primo > tamaño del alfabeto) y un módulo $M$ (primo grande, o par de módulos para evitar colisiones). El hash del prefijo $[0, i]$ es:

$$h[i] = (h[i-1] \\cdot B + s[i]) \\bmod M$$

El hash de la subcadena $[l, r]$ es:

$$hash(l, r) = (h[r] - h[l-1] \\cdot B^{r-l+1}) \\bmod M$$

Con potencias de $B$ precalculadas, comparar dos subcadenas cuesta $O(1)$. Para evitar colisiones adversariales, se usa doble hash (dos módulos distintos) o una base aleatoria.

## Trie (árbol de prefijos)

Estructura de árbol donde cada nodo representa un prefijo. Las aristas son caracteres. Permite insertar y buscar strings en $O(|s|)$. Útil para diccionarios, autocompletado, y como base del Aho-Corasick (búsqueda de múltiples patrones).

## Z-algorithm

Calcula el Z-array en $O(n)$: $Z[i]$ es la longitud del prefijo más largo de $s$ que coincide con el substring que empieza en $i$. Útil para pattern matching (concatenar patrón + separador + texto y buscar valores de $Z$ iguales a la longitud del patrón).

## Algoritmo KMP (Knuth-Morris-Pratt)

Construye una función de prefijo $\\pi[i]$ = longitud del prefijo propio más largo de $s[0..i]$ que también es sufijo. Con esta función, buscar un patrón en un texto cuesta $O(n + m)$ sin retrocesos en el texto.

## Ejemplo práctico: encontrar todas las ocurrencias de un patrón

Con rolling hash, se calcula el hash del patrón y luego, para cada posición $i$ del texto, se compara en $O(1)$ el hash de la subcadena de largo $|patron|$ que empieza en $i$ con el hash del patrón. Si coinciden, se reporta la ocurrencia (posible falso positivo, mitigado con doble hash).

## Relación con otros temas

- **CPH: Programación dinámica básica**: DP sobre strings (LCS, Edit Distance, palíndromos).
- **CP4: DP clásica (CP4)**: Longest Common Substring, palindromic substrings.
- **TemasParaImportar/dp/04_CADENAS.md**: DP específica sobre cadenas.`,
  },
  {
    title: 'CPH: Algoritmos de raíz cuadrada',
    category: 'CPH - Temas avanzados',
    content: `## ¿Qué es?

Los **algoritmos de raíz cuadrada** (sqrt decomposition) dividen los datos en bloques de tamaño $\\approx \\sqrt{n}$, procesando cada bloque como una unidad. Esto da complejidades de $O(\\sqrt{n})$ por operación, que para $n \\le 10^5$ ($\\sqrt{n} \\approx 316$) es perfectamente aceptable y a menudo más simple que un segment tree.

## ¿Por qué es importante?

Son una alternativa simple a estructuras más complejas (segment tree, Fenwick) para problemas de rango con actualizaciones. Mo's algorithm, en particular, es la técnica estándar para responder consultas de rango fuera de línea cuando no hay actualizaciones.

## Sqrt decomposition básica

Dividir el arreglo de tamaño $n$ en bloques de tamaño $B = \\lceil \\sqrt{n} \\rceil$. Cada bloque guarda información agregada (suma, mínimo, etc.). Una consulta de rango combina: elementos sueltos al inicio y al final del rango ($O(B)$), y bloques completos en el medio ($O(n/B)$). Total $O(\\sqrt{n})$ si $B = \\sqrt{n}$.

## Algoritmo de Mo (Mo's algorithm)

Para $q$ consultas de rango **sin actualizaciones**, fuera de línea. Se ordenan las consultas por $(\\lfloor l/B \\rfloor, r)$, donde $B \\approx \\sqrt{n}$. Se mantiene un estado actual $[L, R]$ y se mueve a la siguiente consulta agregando/quitando elementos uno por uno. Cada elemento se agrega/quita $O(q \\cdot B + n \\cdot n/B) = O(n \\sqrt{q})$ veces en total.

## Particiones de enteros

Algoritmos que iteran sobre dos casos según el tamaño: para valores pequeños (hasta $\\sqrt{n}$) usan preprocesamiento; para valores grandes (más de $\\sqrt{n}$) usan bucles directos que se ejecutan pocas veces. Útil en problemas de "suma sobre múltiplos" o donde $n/d$ toma solo $O(\\sqrt{n})$ valores distintos.

## Ejemplo práctico: suma de rango con sqrt decomposition

Cada bloque guarda su suma total. Para consultar $[l, r]$: sumar elementos sueltos de $l$ a fin del bloque, sumar bloques completos intermedios, sumar elementos sueltos del inicio del último bloque hasta $r$. Para actualizar $a[i] = x$: actualizar el valor y la suma del bloque.

## Relación con otros temas

- **CPH: Consultas de rango**: sqrt decomposition es una alternativa al segment tree/Fenwick.
- **CPH: Segment trees revisited**: el segment tree con lazy propagation resuelve los mismos problemas con $O(\\log n)$ en vez de $O(\\sqrt{n})$, pero con más código.
- **CPH: Análisis amortizado**: Mo's algorithm debe su eficiencia al análisis del número total de movimientos de punteros.`,
  },
  {
    title: 'CPH: Segment trees revisited',
    category: 'CPH - Temas avanzados',
    content: `## ¿Qué es?

Esta sección profundiza en las variantes avanzadas del segment tree que van más allá de las consultas básicas de rango: **lazy propagation** (actualizaciones de rango eficientes), **segment tree dinámico** (nodos creados bajo demanda para rangos enormes), nodos que almacenan **estructuras de datos** (merge sort tree), y **segment trees 2D** (consultas sobre matrices).

## ¿Por qué es importante?

Las consultas de rango con actualizaciones de rango son la versión más general y frecuente del problema. Un segment tree sin lazy propagation obligaría a actualizar cada hoja individualmente ($O(n \\log n)$), mientras que con lazy propagation se logra $O(\\log n)$ tanto para consulta como para actualización.

## Lazy propagation

Cuando una actualización cubre completamente el rango de un nodo, en vez de propagar el cambio a todos sus descendientes de inmediato, se guarda una **marca perezosa** (lazy tag) en el nodo. La marca se empuja hacia los hijos solo cuando hace falta visitarlos para una consulta o actualización futura. Esto reduce las actualizaciones de rango de $O(n)$ a $O(\\log n)$.

Invariante fundamental: el valor almacenado en un nodo siempre refleja su subárbol **como si** todas las marcas pendientes ya se hubieran aplicado a él (pero no necesariamente a sus hijos).

## Segment tree dinámico

Cuando el rango de índices es enorme (ej. $[0, 10^9]$) y no se puede reservar $O(n)$ nodos de antemano, los nodos se crean sobre la marcha solo cuando se visitan por primera vez. Con $q$ operaciones, se crean $O(q \\log n)$ nodos en total en vez de $O(n)$.

## Merge sort tree

Cada nodo del segment tree guarda una estructura más rica que un número —por ejemplo un \\\`vector\\\` ordenado con todos los valores de su rango. Esto permite responder consultas como "¿cuántos elementos menores a $x$ hay en el rango $[l, r]$?" con búsqueda binaria dentro de cada nodo visitado. Construcción $O(n \\log n)$, consulta $O(\\log^2 n)$.

## Segment tree 2D

Un segment tree cuyos nodos son a su vez segment trees sobre la otra dimensión. Para consultas de rango sobre una matriz (ej. suma en un rectángulo), cada operación cuesta $O(\\log^2 n)$.

## Ejemplo práctico: suma de rango con incremento de rango

Mantener un arreglo con dos operaciones: (1) sumar $x$ a todos los elementos en $[l, r]$, (2) consultar la suma en $[l, r]$. Con lazy propagation en un segment tree, ambas en $O(\\log n)$:

\\\`\\\`\\\`cpp
void push(int node, int l, int r) {
    if (lazy[node]) {
        tree[node] += lazy[node] * (r - l + 1);
        if (l != r) {
            lazy[2*node] += lazy[node];
            lazy[2*node+1] += lazy[node];
        }
        lazy[node] = 0;
    }
}
\\\`\\\`\\\`

## Relación con otros temas

- **CPH: Consultas de rango**: fundamentos de segment tree y Fenwick tree.
- **CP4: Segment Tree (CP4)**: implementación, variantes, y ejercicios.
- **CP4: Grafos especiales**: HLD (Heavy-Light Decomposition) convierte consultas de caminos en árboles en consultas de rango sobre segment tree.`,
    commonPitfalls:
      'Olvidar hacer push_down antes de recursar hacia los hijos en una consulta o actualización (el resultado queda desactualizado). No limpiar la marca lazy del nodo padre después de propagarla a los hijos.',
  },
  {
    title: 'CPH: Geometría computacional básica',
    category: 'CPH - Temas avanzados',
    content: `## ¿Qué es?

La **geometría computacional** aborda problemas sobre puntos, líneas, polígonos y distancias en el plano. A diferencia de otros temas, la geometría requiere cuidado extremo con la precisión numérica y el manejo de casos degenerados (puntos colineales, coincidentes).

## ¿Por qué es importante?

Problemas geométricos aparecen en concurso con regularidad (convex hull, intersección de segmentos, punto en polígono, par más cercano). La clave es minimizar el uso de punto flotante: siempre que las coordenadas sean enteras, el producto cruzado y las áreas también lo son y se pueden comparar con total exactitud.

## Números complejos para puntos

Representar un punto $(x, y)$ como $x + yi$ simplifica rotaciones (multiplicar por $e^{i\\theta} = \\cos\\theta + i\\sin\\theta$) y traslaciones (suma), evitando escribir manualmente las fórmulas trigonométricas.

## Producto cruzado (cross product)

Es la operación fundamental de la geometría computacional. Para dos vectores $\\vec{a} = (a_x, a_y)$ y $\\vec{b} = (b_x, b_y)$:

$$\\vec{a} \\times \\vec{b} = a_x b_y - a_y b_x$$

El signo indica la orientación: positivo si $\\vec{b}$ está a la izquierda de $\\vec{a}$ (giro antihorario), negativo si está a la derecha (horario), cero si son colineales. Es la base de casi todos los algoritmos geométricos: convex hull (giro a la izquierda en Graham scan), intersección de segmentos, y punto en polígono.

## Área de polígonos (shoelace formula)

Para un polígono simple con vértices $(x_1,y_1), \\ldots, (x_n,y_n)$ en orden:

$$\\text{Área} = \\frac{1}{2} \\left| \\sum_{i=1}^{n} (x_i y_{i+1} - x_{i+1} y_i) \\right|$$

con $(x_{n+1}, y_{n+1}) = (x_1, y_1)$. Complejidad $O(n)$. El signo de la suma (sin valor absoluto) indica si los vértices están en orden horario (negativo) o antihorario (positivo).

## Funciones de distancia

$$d_{euclidiana} = \\sqrt{\\Delta x^2 + \\Delta y^2}$$
$$d_{Manhattan} = |\\Delta x| + |\\Delta y|$$
$$d_{Chebyshev} = \\max(|\\Delta x|, |\\Delta y|)$$

Manhattan para movimientos ortogonales en grilla; Chebyshev cuando las diagonales cuestan lo mismo que un paso recto (rey de ajedrez); euclidiana para distancia geométrica real.

## Ejemplo práctico: determinar si un punto está dentro de un polígono

Se traza un rayo desde el punto hacia la derecha y se cuentan las intersecciones con las aristas del polígono. Si el número de intersecciones es impar, el punto está dentro. Hay que manejar con cuidado los casos donde el rayo pasa exactamente por un vértice (contar solo intersecciones con aristas que cruzan hacia arriba, por ejemplo).

## Relación con otros temas

- **CPH: Algoritmos de barrido (sweep line)**: el convex hull y el par más cercano se resuelven con sweep line.
- **CP4: Árboles de expansión mínima**: la geometría produce grafos completos implícitos (distancias entre puntos) donde MST resuelve clustering y conexión.`,
    commonPitfalls:
      'Usar float en vez de double o long double cuando la precisión importa. Comparar orientaciones/áreas con == en vez de con un epsilon (con floats) o aritmética entera exacta (cuando las coordenadas son enteras, el producto cruzado también lo es). Olvidar casos degenerados (tres puntos colineales, segmentos que se tocan en un extremo).',
  },
  {
    title: 'CPH: Algoritmos de barrido (sweep line)',
    category: 'CPH - Temas avanzados',
    content: `## ¿Qué es?

Los **algoritmos de barrido** (sweep line) procesan eventos en orden según una coordenada (típicamente $x$), manteniendo una estructura de datos que representa el estado de la línea de barrido. Cuando la línea "barre" el plano de izquierda a derecha, los eventos (comienzo de segmento, fin de segmento, intersección) se procesan en orden, y la estructura se actualiza en cada evento.

## ¿Por qué es importante?

Problemas geométricos que parecen requerir comparar todos los pares de objetos ($O(n^2)$) se reducen a $O(n \\log n)$ con sweep line: intersección de segmentos, par más cercano, convex hull, área de unión de rectángulos. Es una de las técnicas más poderosas en geometría computacional.

## Intersección de segmentos

Barrer de izquierda a derecha, manteniendo los segmentos activos (los que cruzan la línea de barrido actual) ordenados por su coordenada $y$ de intersección con la línea. En cada evento (inicio de segmento, fin de segmento, o intersección detectada entre vecinos en el orden vertical), se actualiza la estructura y se verifican nuevos vecinos. Complejidad $O((n + k) \\log n)$ donde $k$ es el número de intersecciones.

## Par más cercano (closest pair)

Dados $n$ puntos en el plano, encontrar la menor distancia entre dos de ellos. Con sweep line y una franja de ancho $d$ (la mejor distancia encontrada hasta ahora): se procesan los puntos por coordenada $x$, y para cada punto nuevo solo se compara con puntos en la franja cuya coordenada $y$ difiere en menos de $d$. $O(n \\log n)$.

## Convex hull (envolvente convexa)

El algoritmo de **Graham scan** ordena los puntos por ángulo polar alrededor del punto más bajo y luego recorre la lista manteniendo una pila: cada nuevo punto debe girar a la izquierda respecto a los dos últimos de la pila; si gira a la derecha, se desapila. $O(n \\log n)$ (dominado por el ordenamiento). Alternativa: **Monotone chain** de Andrew, que ordena por coordenada y construye la parte superior e inferior por separado.

## Ejemplo práctico: área de la unión de rectángulos

Dados $n$ rectángulos alineados a los ejes, calcular el área total cubierta por al menos uno. Se comprimen las coordenadas $y$ y se barre en $x$: cada evento (inicio o fin de rectángulo) actualiza un segment tree sobre las coordenadas $y$ comprimidas que mantiene cuántos rectángulos cubren cada segmento. El área entre dos eventos consecutivos es $\\Delta x \\times$ (longitud cubierta en $y$). $O(n \\log n)$.

## Relación con otros temas

- **CPH: Geometría computacional básica**: el producto cruzado y las operaciones elementales son los bloques de construcción de los algoritmos de barrido.
- **CPH: Consultas de rango**: el segment tree se usa dentro del sweep line para mantener el estado activo.
- **CPH: Ordenamiento y búsqueda binaria**: el preprocesamiento de ordenar eventos es el primer paso de cualquier sweep line.`,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// CP4: Competitive Programming 4 (Halim, Halim, Suhendry)
// docs/libros/cp4.pdf — Capítulos 1–4, 18 temas derivados.
// ═══════════════════════════════════════════════════════════════════════════

const CP4_TOPICS: TopicSeed[] = [
  {
    title: 'CP4: Fundamentos y consejos de programación competitiva',
    category: 'CP4 - Fundamentos',
    content: `## ¿Qué es?

CP4 inicia con una guía de supervivencia para el competidor: cómo abordar un problema, consejos de implementación, uso eficiente del lenguaje y buenas prácticas para evitar errores tontos en concurso.

## ¿Por qué es importante?

Estos fundamentos trascienden cualquier algoritmo específico. Un competidor que domina los consejos de CP4 pero conoce menos algoritmos a menudo supera a uno que conoce muchos algoritmos pero comete errores evitables de implementación y estrategia.

## Entender el problema antes de codificar

Leer el enunciado completo. Identificar el tipo de problema a partir de frases clave (ver "CPH: Identificación rápida" en TemasParaImportar). Hacer análisis de complejidad **antes** de escribir código: con los límites del problema, determinar qué complejidad se espera y elegir el algoritmo en consecuencia. Ver la tabla de complejidad tolerable en "CPH: Introducción y complejidad temporal".

## Elegir el lenguaje y las herramientas adecuadas

- C++ es el estándar de facto en ICPC por su velocidad y su STL.
- Java tiene BigInteger integrado pero es más verboso.
- Python tiene sintaxis concisa y enteros de precisión arbitraria nativos, pero es más lento; conviene para problemas con números enormes o cuando el tiempo no es crítico.

## Consejos de implementación

- Usar \\\`double\\\` en vez de \\\`float\\\` (más precisión, más rango).
- No comparar \\\`double\\\` con \\\`==\\\`; usar \\\`fabs(a - b) < 1e-9\\\`.
- Definir \\\`pi\\\` como \\\`2 * acos(0)\\\` o con suficientes decimales, nunca como \\\`22/7\\\`.
- Inicializar explícitamente variables entre casos de prueba (los jueces suelen tener múltiples datasets en un mismo archivo).
- Usar \\\`assert\\\` para detectar violaciones de invariantes temprano.

## Estrategia de equipo (ICPC)

- Leer todos los problemas al inicio y clasificarlos por dificultad.
- Atacar primero los más fáciles.
- Revisar el scoreboard: un problema que muchos equipos ya resolvieron es probablemente fácil.
- "Real-time debugging is the ultimate sin": debuggear mirando la pantalla es ineficiente. Pensar en papel, identificar la causa, y luego corregir.

## Gestión de tipos de veredicto

- **WA (Wrong Answer)**: lógica incorrecta, caso borde no contemplado, precisión insuficiente.
- **TLE (Time Limit Exceeded)**: algoritmo demasiado lento o bucle infinito.
- **RTE (Runtime Error)**: acceso fuera de rango, división por cero, overflow, stack overflow por recursión profunda.
- **MLE (Memory Limit Exceeded)**: estructuras de datos demasiado grandes.

## Relación con otros temas

- **CPH: Introducción y complejidad temporal**: el análisis de complejidad es el primer filtro antes de implementar.
- **Paper: Errores comunes en contests**: expande los errores de implementación más frecuentes.
- **Paper: Estrategia de contest**: analiza formalmente qué orden de resolución maximiza el puntaje.`,
    commonPitfalls:
      'No inicializar variables globales entre casos de un mismo archivo de input. Comparar números de punto flotante con ==. Usar float en vez de double. Asumir el formato de fin de caso (EOF vs línea en blanco) sin confirmarlo con el enunciado.',
  },
  {
    title: 'CP4: Arreglos, bitmask y enteros grandes',
    category: 'CP4 - Estructuras de datos',
    content: `## ¿Qué es?

CP4 dedica una sección a las estructuras lineales clásicas y tres herramientas que aparecen en todo concurso: arreglos (incluyendo técnicas de ordenamiento especial), bitmask (representación de subconjuntos como enteros), y enteros de precisión arbitraria (BigInteger).

## ¿Por qué es importante?

El arreglo es la estructura más ubicua; muchas técnicas "avanzadas" no son más que arreglos usados de forma ingeniosa (compresión de coordenadas, diferencias, prefix sum). El bitmask es la llave a la DP sobre subconjuntos. Los enteros grandes aparecen cuando los valores exceden los 64 bits nativos de C++.

## Arreglos y técnicas de ordenamiento especial

- **k-ésimo elemento**: \\\`nth_element\\\` en C++ encuentra el $k$-ésimo en $O(n)$ esperado sin ordenar todo.
- **Compresión de coordenadas**: cuando los valores son grandes pero solo importa su orden relativo, se reemplaza cada valor por su índice en la lista ordenada de valores únicos. Permite indexar un Fenwick tree o segment tree con un rango denso de índices.
- **Prefix sum**: precalcular sumas acumuladas para responder suma de rango en $O(1)$. Con diferencias (difference array), las actualizaciones de rango son $O(1)$ y la reconstrucción final $O(n)$.

## Bitmask

Representa subconjuntos de hasta ~20-30 elementos como un entero. Operaciones en $O(1)$: unión ($|$), intersección ($\\&$), complemento ($\\sim$), pertenencia (\\\`mask & (1<<i)\\\`). Base de DP sobre bitmask (TSP, asignación, matching).

## Big Integer

Cuando un número excede \\\`long long\\\` ($\\pm 9.2 \\times 10^{18}$):
- **Python**: enteros nativos de precisión arbitraria, sin límite.
- **Java**: clase \\\`BigInteger\\\` con suma, multiplicación, potencia modular, gcd, primalidad.
- **C++**: no es parte de la STL; se implementa con vector de dígitos o se usa librería externa. En competencia ICPC donde C++ es el estándar, si un problema requiere BigInt, típicamente los límites permiten Python o hay un enfoque alternativo (módulo).

## Ejemplo práctico: contar triángulos con bitmask

Dado un grafo de $n \\le 20$ nodos, contar cuántos triángulos (ciclos de 3) existen. Para cada par de nodos adyacentes $(u, v)$, contar los nodos $w$ que son vecinos de ambos: $popcount(adj[u] \\ \\& \\ adj[v])$. Con \\\`__builtin_popcount\\\` cada verificación es $O(1)$.

## Relación con otros temas

- **CPH: Manipulación de bits**: detalle completo de operaciones bitwise y DP sobre bitmask.
- **CP4: Fenwick Tree**: compresión de coordenadas + Fenwick = consultas sobre rangos de valores grandes.
- **CPH: Estructuras de datos dinámicas**: \\\`vector\\\` es la base de la mayoría de las estructuras.`,
    commonPitfalls:
      'Usar long long esperando que alcance sin verificar el límite real (puede requerir $10^{100}$ o más). Olvidar que \\\`1 << i\\\` con \\\`i >= 31\\\` desborda un \\\`int\\\` de 32 bits (usar \\\`1LL << i\\\`).',
  },
  {
    title: 'CP4: Estructuras enlazadas y basadas en pila',
    category: 'CP4 - Estructuras de datos',
    content: `## ¿Qué es?

CP4 cubre las estructuras basadas en listas enlazadas (inserción/borrado en el medio) y los usos de la pila (stack) más allá del obvio: balanceo de paréntesis, evaluación de expresiones y el rectángulo más grande en un histograma.

## ¿Por qué es importante?

La pila es una de las estructuras más simples pero sus aplicaciones no triviales (pila monótona, evaluación de expresiones, balanceo) aparecen con frecuencia. Entenderlas evita reinventar soluciones complejas para problemas que se resuelven con una pila en $O(n)$.

## Listas enlazadas

Inserción/borrado $O(1)$ en el medio sin desplazar elementos (algo que \\\`vector\\\` no puede). En la práctica competitiva, sin embargo, se usan menos que \\\`vector\\\` + compresión o \\\`set\\\`, porque pierden acceso aleatorio $O(1)$. Aparecen en problemas donde el orden relativo cambia frecuentemente y nunca se necesita acceder por índice.

## Balanceo de paréntesis

Apilar cada apertura, hacer pop al encontrar el cierre correspondiente verificando que coincida el tipo. Si en algún punto se intenta hacer pop de una pila vacía, o la pila no queda vacía al terminar, la expresión está desbalanceada. $O(n)$.

## Evaluación de expresiones (shunting-yard)

Convertir expresión infix a postfix respetando precedencia con una pila de operadores. Luego evaluar el postfix con una pila de operandos: al leer un operador, sacar dos operandos, aplicar la operación, apilar el resultado. $O(n)$.

## Rectángulo más grande en un histograma

Dado un histograma con $n$ barras de ancho 1 y alturas $h_i$, encontrar el rectángulo de mayor área. Con una **pila monótona creciente** de índices se resuelve en $O(n)$: al encontrar una barra más baja que el tope de la pila, se calcula el área del rectángulo cuya altura es la barra del tope y cuyo ancho se extiende hasta la posición actual. Cada barra entra y sale de la pila una sola vez (análisis amortizado).

## Ejemplo práctico: evaluar "(1 + 2) * (3 + 4)"

1. Convertir a postfix: "1 2 + 3 4 + *"
2. Evaluar: push 1, push 2 → '+' pop 2, pop 1 → push 3. push 3, push 4 → '+' pop 4, pop 3 → push 7. '*' pop 7, pop 3 → push 21. Resultado: 21.

## Relación con otros temas

- **CPH: Análisis amortizado**: la pila monótona es el ejemplo canónico de análisis amortizado ($O(n)$ total).
- **CPH: Algoritmos de strings**: el balanceo de paréntesis se extiende a la validación de estructuras anidadas.
- **CPH: Estructuras de datos dinámicas**: \\\`stack\\\` es una de las estructuras adaptadoras de la STL.`,
  },
  {
    title: 'CP4: Heap, hash table, bBST y order statistics tree',
    category: 'CP4 - Estructuras de datos',
    content: `## ¿Qué es?

CP4 explora las estructuras no lineales disponibles en la STL y en librerías de extensión: heap binario (priority_queue), tablas de hash (unordered_set/map), árboles binarios de búsqueda balanceados (set/map), y el order statistics tree (GNU Policy-Based Data Structures).

## ¿Por qué es importante?

Estas estructuras cubren la mayoría de las necesidades de datos dinámicos: el heap para "siempre extraer el mínimo/máximo", la hash table para pertenencia y mapeo $O(1)$, el bBST para datos ordenados con inserciones/borrados dinámicos, y el order statistics tree cuando además se necesita encontrar el $k$-ésimo elemento o contar elementos menores que $x$, todo en $O(\\log n)$.

## Binary Heap (priority_queue)

En C++, \\\`priority_queue\\\` es un max-heap por defecto. Para min-heap: \\\`priority_queue<T, vector<T>, greater<T>>\\\`. Operaciones: \\\`push\\\` $O(\\log n)$, \\\`top\\\` $O(1)$, \\\`pop\\\` $O(\\log n)$. No soporta actualizar una clave arbitraria ni borrar un elemento que no sea el tope. Para eso se usa \\\`set\\\` o se implementa un heap con lazy deletion.

## Hash Table (unordered_set / unordered_map)

Inserción, borrado y búsqueda en $O(1)$ esperado. No mantienen orden. El peor caso $O(n)$ ocurre ante colisiones adversarias; en jueces modernos, usar una semilla aleatoria mitiga este riesgo. Cuando se necesita orden, se usa \\\`set\\\`/\\\`map\\\`.

## Balanced BST (set / map)

Implementados como red-black trees. Mantienen los elementos ordenados. Todas las operaciones (insertar, borrar, buscar, lower_bound, upper_bound) en $O(\\log n)$. La flexibilidad de tener los datos siempre ordenados justifica el factor $\\log n$ adicional frente a hash tables en muchos escenarios.

## Order Statistics Tree (GNU PBDS)

Extensión de GCC (\\\`#include <ext/pb_ds/assoc_container.hpp>\\\`):
- \\\`find_by_order(k)\\\`: devuelve el $k$-ésimo elemento (0-indexado).
- \\\`order_of_key(x)\\\`: devuelve cuántos elementos son estrictamente menores que $x$.

Ambas en $O(\\log n)$. No forma parte del estándar C++ pero está disponible en los jueces que usan GCC (Codeforces, CSES, la mayoría). Esencial cuando se necesita un contenedor ordenado con acceso por índice y consultas de rango.

## Ejemplo práctico: mediana en un stream de datos

Mantener dos heaps: un max-heap con la mitad inferior de los datos y un min-heap con la mitad superior. Insertar en $O(\\log n)$ balanceando los tamaños (difieren en a lo sumo 1). La mediana es el tope del heap que tiene más elementos (o el promedio de los topes si tienen igual tamaño).

## Relación con otros temas

- **CPH: Estructuras de datos dinámicas**: introducción a estas mismas estructuras desde la perspectiva de CPH.
- **CPH: Consultas de rango**: el segment tree y el Fenwick tree son alternativas especializadas cuando se necesita consultas sobre rangos.
- **CP4: Union-Find Disjoint Sets**: otra estructura no lineal pero con propósito distinto (componentes conexas).`,
  },
  {
    title: 'CP4: Union-Find Disjoint Sets',
    category: 'CP4 - Estructuras de datos',
    content: `## ¿Qué es?

**Union-Find** (también llamado DSU, Disjoint Set Union) mantiene una colección de conjuntos disjuntos bajo dos operaciones: \\\`find(x)\\\` (encontrar el representante del conjunto de $x$) y \\\`union(x, y)\\\` (fusionar los conjuntos de $x$ e $y$).

## ¿Por qué es importante?

Es la estructura detrás del algoritmo de Kruskal para MST, y aparece en problemas de conectividad dinámica, detección de ciclos, y como componente de algoritmos más complejos (DSU con rollback para consultas fuera de línea). Con las dos optimizaciones estándar, cada operación es prácticamente $O(1)$.

## Implementación con optimizaciones

Cada conjunto es un árbol donde los nodos apuntan a su padre. La raíz es el representante. Dos optimizaciones:

1. **Compresión de camino** (path compression): durante \\\`find(x)\\\`, todos los nodos en el camino a la raíz se reconectan directamente a la raíz, aplanando el árbol.
2. **Unión por tamaño/rango** (union by size/rank): al unir dos conjuntos, el árbol más pequeño se cuelga del más grande.

Con ambas, la complejidad amortizada es $O(\\alpha(n))$, donde $\\alpha$ es la inversa de la función de Ackermann — para cualquier $n$ práctico, $\\alpha(n) \\le 4$.

\\\`\\\`\\\`cpp
int find(int x) {
    return parent[x] == x ? x : parent[x] = find(parent[x]);
}
void unite(int a, int b) {
    a = find(a); b = find(b);
    if (a != b) {
        if (sz[a] < sz[b]) swap(a, b);
        parent[b] = a;
        sz[a] += sz[b];
    }
}
\\\`\\\`\\\`

## Aplicaciones

- **Kruskal (MST)**: ordenar aristas por peso; para cada arista, si sus extremos están en componentes distintas, agregarla y unir las componentes.
- **Conectividad dinámica**: procesar consultas del tipo "¿están $u$ y $v$ conectados?" después de una secuencia de uniones.
- **Detección de ciclos**: si al procesar una arista, \\\`find(u) == find(v)\\ \\\`, esa arista crea un ciclo.
- **Componentes conexas**: inicializar $n$ conjuntos unitarios; cada unión reduce el número de componentes en 1.

## Variante: DSU con rollback

Se guarda un historial de las operaciones de unión (sin compresión de camino, solo unión por tamaño) para poder deshacerlas. Útil en algoritmos fuera de línea y divide y vencerás sobre consultas.

## Ejemplo práctico: amigos de amigos

En una red social, determinar si dos personas están en el mismo grupo de amigos (directa o indirectamente). Cada nueva amistad es una unión; cada consulta es un find. Con $n$ y $q$ hasta $10^6$, Union-Find responde en tiempo casi lineal.

## Relación con otros temas

- **CPH: Árboles de expansión mínima**: Kruskal depende completamente de Union-Find.
- **CPH: Algoritmos en árboles**: un árbol es un grafo conexo sin ciclos — Union-Find detecta estas propiedades.
- **CP4: Grafos especiales**: Union-Find se usa en algoritmos fuera de línea para conectividad.`,
  },
  {
    title: 'CP4: Fenwick Tree (Binary Indexed Tree)',
    category: 'CP4 - Estructuras de datos',
    content: `## ¿Qué es?

El **Fenwick Tree** (Binary Indexed Tree, BIT) es una estructura que mantiene sumas de prefijo sobre un arreglo, soportando actualizaciones puntuales (sumar un delta a una posición) y consultas de suma de prefijo, ambas en $O(\\log n)$. Es más compacto y rápido en la práctica que un segment tree para este caso de uso.

## ¿Por qué es importante?

Es la estructura más simple y eficiente para "suma acumulada con actualizaciones". Con menos de 10 líneas de código, cubre una gran familia de problemas. Solo está limitado a operaciones que se pueden expresar como diferencia de prefijos (suma, XOR, pero no mínimo o máximo).

## Fundamento: lowbit

La clave del Fenwick tree es la operación \\\`lowbit(i) = i & (-i)\\\`, que aísla el bit menos significativo encendido de $i$. En complemento a dos, $-i = \\sim i + 1$, así que $i \\ \\& \\ (-i)$ da una potencia de 2.

Cada índice $i$ en el BIT es "responsable" de un rango de longitud \\\`lowbit(i)\\\` hacia atrás. Sumar todos los BIT[i] para índices generados por $i = i - lowbit(i)$ da la suma del prefijo. Actualizar la posición $i$ implica sumar el delta a BIT[i] y a todos los índices $i = i + lowbit(i)$ hacia adelante.

## Implementación (0-based)

\\\`\\\`\\\`cpp
void add(int i, long long delta) {
    for (; i < n; i |= i + 1) bit[i] += delta;
}
long long sum(int i) {
    long long s = 0;
    for (; i >= 0; i = (i & (i + 1)) - 1) s += bit[i];
    return s;
}
long long range_sum(int l, int r) {
    return sum(r) - sum(l - 1);
}
\\\`\\\`\\\`

## Aplicaciones más allá de la suma

- **Inversiones en un arreglo**: recorrer de derecha a izquierda, para cada $a[i]$ consultar cuántos ya procesados son menores que $a[i]$ (BIT sobre el rango de valores).
- **Fenwick 2D**: análogo al BIT 1D pero con dos dimensiones, para suma en submatriz con actualizaciones puntuales, en $O(\\log^2 n)$.
- **Range Update + Point Query**: con un BIT de diferencias, actualizar un rango $[l, r]$ sumando $x$ se hace con \\\`add(l, x)\\ \\\` y \\\`add(r+1, -x)\\ \\\`. Consultar el valor en $i$ es \\\`sum(i)\\ \\\`.
- **Range Update + Range Query**: con **dos** BITs se logra suma de rango con actualización de rango, ambas en $O(\\log n)$.

## Ejemplo práctico: contar inversiones

Dado un arreglo, contar pares $i < j$ con $a[i] > a[j]$. Se comprimen los valores a un rango denso, y recorriendo de izquierda a derecha, para cada elemento se consulta cuántos de los ya vistos son mayores que él (BIT sobre frecuencia). $O(n \\log n)$.

## Relación con otros temas

- **CPH: Consultas de rango**: introducción al Fenwick y al segment tree.
- **CP4: Segment Tree (CP4)**: alternativa más general pero con más código y mayor constante.
- **CP4: Arreglos, bitmask y enteros grandes**: la compresión de coordenadas es el preprocesamiento típico antes de usar BIT.`,
  },
  {
    title: 'CP4: Segment Tree (CP4)',
    category: 'CP4 - Estructuras de datos',
    content: `## ¿Qué es?**

El **segment tree** es una estructura de datos que responde consultas sobre rangos y soporta actualizaciones, ambas en $O(\\log n)$, para cualquier operación **asociativa** (suma, mínimo, máximo, GCD, XOR). CP4 lo presenta con construcción iterativa, variantes de consulta, y lazy propagation.

## ¿Por qué es importante?

A diferencia del Fenwick tree, el segment tree no está limitado a operaciones invertibles (tipo suma). Soporta mínimo, máximo, GCD y cualquier operación asociativa. Con lazy propagation, resuelve actualizaciones de rango, no solo puntuales. Es la estructura más general para consultas de rango.

## Construcción y representación

Implementación con arreglo de tamaño $4n$ (o $2n$ en la versión iterativa). Cada nodo representa un rango $[l, r]$:
- Raíz (índice 1 en 1-based): rango $[0, n-1]$
- Hijo izquierdo de $i$: $2i$, cubre la mitad izquierda
- Hijo derecho de $i$: $2i+1$, cubre la mitad derecha

## Consulta de rango

Si el rango del nodo está completamente dentro de la consulta, devolver el valor del nodo. Si está completamente fuera, devolver el elemento neutro de la operación (0 para suma, $\\infty$ para mínimo, $0$ para XOR). Si se solapa parcialmente, consultar ambos hijos y combinar.

## Lazy propagation

Para actualizaciones de rango: en vez de bajar la actualización a todas las hojas ($O(n \\log n)$), se guarda una marca perezosa que se propaga a los hijos solo cuando es necesario. La actualización y consulta de rango quedan en $O(\\log n)$.

## Variantes

- **Segment tree iterativo**: implementación bottom-up con arreglo de tamaño $2n$, más rápida y compacta.
- **Segment tree dinámico**: para rangos enormes (ej. $[0, 10^9]$), crear nodos bajo demanda.
- **Persistent segment tree**: guardar versiones históricas del árbol para consultas "en el tiempo".
- **Merge sort tree**: cada nodo almacena un vector ordenado de su rango.

## Cuándo usar segment tree vs Fenwick

| Criterio | Segment Tree | Fenwick Tree |
|---|---|---|
| Código | Más largo (~30-50 líneas) | Muy corto (~8 líneas) |
| Operaciones soportadas | Cualquier asociativa | Solo invertibles (suma, XOR) |
| Constante de tiempo | Mayor | Menor |
| Actualizaciones de rango | Sí (con lazy) | Sí (con 2 BITs) |
| Consultas no conmutativas | Sí | No |

## Ejemplo práctico: RMQ con actualizaciones puntuales

Mantener un arreglo que soporta: (1) cambiar el valor en la posición $i$, (2) consultar el mínimo en $[l, r]$. Segment tree: ambas en $O(\\log n)$. Con Fenwick tree no se puede porque el mínimo no es invertible.

## Relación con otros temas

- **CPH: Consultas de rango**: introducción y fundamentos del segment tree.
- **CPH: Segment trees revisited**: lazy propagation, dinámico, 2D.
- **CP4: Grafos especiales**: HLD convierte consultas en árboles en consultas de segment tree sobre el Euler Tour.`,
  },
  {
    title: 'CP4: Búsqueda completa',
    category: 'CP4 - Paradigmas de resolución',
    content: `## ¿Qué es?

La búsqueda completa (también llamada fuerza bruta) enumera **todas** las soluciones candidatas y selecciona la mejor (o cuenta cuántas cumplen una condición). Es el primer paradigma a considerar cuando los límites son pequeños.

## ¿Por qué es importante?**

Muchos problemas con límites pequeños ($n \\le 10$–$20$) tienen la búsqueda completa como solución esperada. Intentar un algoritmo más "inteligente" en estos casos es perder tiempo. CP4 enfatiza leer los límites antes de decidir la técnica.

## Búsqueda completa iterativa

Bucles anidados o generación explícita de combinaciones con funciones de la librería (\\\`next_permutation\\\`). Simple y sin overhead de recursión.

## Búsqueda completa recursiva (backtracking)

Construir la solución paso a paso, retrocediendo cuando una rama no puede llevar a una solución válida. El patrón es: probar opción → recursar → deshacer opción.

## Tips de poda

- **Podar temprano**: cortar una rama en cuanto se detecta que no puede mejorar la mejor respuesta conocida o viola una restricción.
- **Ordenar las opciones**: probar primero las opciones más prometedoras (las que probablemente lleven a una solución) para que la poda por cota superior sea más efectiva.
- **Generar y probar**: a veces es más fácil generar todas las candidatas y filtrar las válidas, que construir solo las válidas.

## Señales de que un problema es de búsqueda completa

- $n$ muy pequeño ($\\le 20$)
- El enunciado pide "todas las formas", "¿existe?", "mínimo/máximo número de..."
- Las restricciones no permiten un algoritmo polinomial pero $2^n$ o $n!$ sí entran en el límite de tiempo

## Ejemplo práctico: N-Reinas

Colocar $n$ reinas en un tablero $n \\times n$ sin que se ataquen. Backtracking columna por columna: para cada columna, probar cada fila disponible (no atacada por ninguna reina anterior). Con poda de columnas, filas y diagonales, se explora mucho menos que $n!$.

## Relación con otros temas

- **CPH: Búsqueda completa**: generación de subconjuntos y permutaciones, meet in the middle.
- **CPH: Programación dinámica básica**: DP = búsqueda completa + memoización.
- **CP4: Divide y vencerás**: el meet in the middle es una forma de dividir la búsqueda completa para duplicar el $n$ viable.`,
  },
  {
    title: 'CP4: Divide y vencerás, búsqueda binaria y ternaria',
    category: 'CP4 - Paradigmas de resolución',
    content: `## ¿Qué es?

**Divide y vencerás** descompone un problema en subproblemas más pequeños del mismo tipo, los resuelve recursivamente, y combina sus soluciones. CP4 lo ejemplifica con merge sort y sus extensiones (contar inversiones). La **búsqueda binaria** busca eficientemente sobre un dominio ordenado o sobre el espacio de respuestas (parametric search). La **búsqueda ternaria** extiende la idea a funciones unimodales.

## ¿Por qué es importante?

Divide y vencerás transforma problemas $O(n^2)$ en $O(n \\log n)$ (merge sort, inversiones, closest pair). La búsqueda binaria en la respuesta convierte problemas de optimización difíciles en problemas de decisión más fáciles. La búsqueda ternaria encuentra el mínimo/máximo de funciones convexas/cóncavas sin necesidad de derivadas.

## Merge sort como divide y vencerás

$$T(n) = 2T(n/2) + O(n) \\Rightarrow O(n \\log n)$$

Durante el merge, se pueden contar inversiones: cuando se toma un elemento de la mitad derecha antes que uno de la izquierda, todos los restantes de la izquierda forman inversiones con él.

## Búsqueda binaria en la respuesta (parametric search)

Si existe una función $f(x)$ monótona ("¿es posible con a lo sumo $x$?"), se binaria sobre $x$. En vez de calcular la respuesta exacta de forma directa, se prueba un valor medio $m$, se evalúa $f(m)$ (típicamente con un algoritmo $O(n)$), y se ajusta el rango. $O(\\log(\\text{rango}))$ iteraciones.

## Búsqueda ternaria

Para funciones **unimodales** (primero decrecen y luego crecen, o viceversa) sobre un dominio continuo o discreto. En vez de un punto medio, se evalúan dos puntos $m_1$ y $m_2$ que dividen el rango en tres partes, y se descarta el tercio que no puede contener el óptimo. $O(\\log n)$ evaluaciones.

## Ejemplo práctico: problema de la vaca agresiva (Aggressive cows)

Colocar $k$ vacas en $n$ posiciones para maximizar la distancia mínima entre dos vacas. Con búsqueda binaria sobre la distancia $d$: ¿es posible colocar $k$ vacas con distancia mínima $\\ge d$? Verificar cuesta $O(n)$ (colocar greedy). Total: $O(n \\log(\\max \\text{pos}))$.

## Relación con otros temas

- **CPH: Ordenamiento y búsqueda binaria**: cubre la búsqueda binaria clásica y sobre arreglos ordenados.
- **CP4: Programación dinámica (CP4)**: algunos problemas de DP se optimizan con divide y vencerás (DP con divide and conquer optimization).
- **CPH: Geometría computacional básica**: búsqueda ternaria se usa para optimizar funciones geométricas unimodales.`,
  },
  {
    title: 'CP4: Algoritmos greedy (CP4)',
    category: 'CP4 - Paradigmas de resolución',
    content: `## ¿Qué es?

Un algoritmo greedy construye la solución incrementalmente eligiendo en cada paso la opción que parece óptima localmente, sin reconsiderar decisiones previas. CP4 profundiza en las demostraciones de correctitud (argumento de intercambio, propiedad de elección greedy) y presenta más ejemplos que CPH.

## ¿Por qué es importante?

Cuando un greedy es correcto, es imbatible en simplicidad y velocidad. CP4 ayuda a desarrollar la intuición para distinguir problemas greedy de problemas que requieren DP, y provee herramientas formales para demostrar correctitud.

## Demostraciones de correctitud

- **Propiedad de elección greedy**: existe una solución óptima que incluye la primera elección greedy. Por inducción, seguir eligiendo greedy mantiene la optimalidad.
- **Argumento de intercambio**: si una solución óptima difiere de la greedy, se puede transformar paso a paso en la greedy sin empeorar el costo.
- **Propiedad de corte** (para MST): la arista más barata que cruza cualquier corte pertenece a algún MST.

## Ejemplos adicionales de CP4

- **Load Balancing**: particionar $n$ tareas entre $k$ máquinas para minimizar la carga máxima. Greedy: asignar cada tarea a la máquina con menor carga actual (con heap).
- **Watering Grass**: cobertura mínima de un segmento con intervalos (aspersores). Greedy: ordenar por inicio, siempre extender el alcance lo máximo posible.
- **Dragon of Loowater**: emparejar cabezas de dragón con caballeros. Greedy: ordenar ambos y emparejar en orden.

## Cuándo NO usar greedy

Si el problema pide "mínimo/máximo valor total" con restricciones que parecen una mochila (knapsack), casi nunca es greedy: requiere DP. Si hay dependencias entre decisiones (lo que elijo ahora restringe lo que puedo elegir después de formas no obvias), probablemente no sea greedy.

## Ejemplo práctico: coin change con sistema canónico vs general

- Sistema canónico (euro): greedy elige la moneda más grande → óptimo.
- Sistema general ({1, 3, 4}): greedy da 4+1+1=3 monedas para suma 6, pero óptimo es 3+3=2 monedas → se necesita DP.

## Relación con otros temas

- **CPH: Algoritmos greedy**: introducción con los ejemplos clásicos (coin problem, scheduling, Huffman).
- **CPH: Programación dinámica básica**: DP resuelve los problemas donde greedy falla.
- **CPH: Árboles de expansión mínima**: Kruskal y Prim son algoritmos greedy.`,
  },
  {
    title: 'CP4: Programación dinámica (CP4)',
    category: 'CP4 - Paradigmas de resolución',
    content: `## ¿Qué es?**

CP4 expande la DP más allá de los ejemplos clásicos de CPH, cubriendo DP en árboles, DP con bitmask, DP sobre dígitos (digit DP), y técnicas de optimización de DP (Knuth-Yao, divide and conquer DP, convex hull trick).

## ¿Por qué es importante?**

La DP es el paradigma más potente y versátil. Mientras CPH cubre los fundamentos, CP4 añade los patrones avanzados que aparecen en problemas de nivel medio-alto en ICPC. Saber reconocer cuál de estos patrones aplica es la diferencia entre resolver un problema en 10 minutos o no resolverlo.

## DP illustration

CP4 enfatiza que el primer paso es siempre **definir el estado**: ¿qué información se necesita para decidir la transición? Si el estado está bien definido, la transición y los casos base suelen caer por sí solos. Si no, hay que agregar dimensiones.

## Ejemplos clásicos (cubiertos también en CPH)

- Coin change, LIS, LCS, Edit Distance, Knapsack 0/1, Matrix Chain Multiplication, TSP con bitmask.

## Ejemplos no clásicos

- **DP sobre dígitos (Digit DP)**: contar números en un rango $[L, R]$ que cumplen cierta propiedad sobre sus dígitos. Estado típico: posición, flag de "ya es menor que el límite", flag de "ya empecé a contar" (para leading zeros).
- **DP en árboles**: máximo conjunto independiente en un árbol ($dp[v][0/1]$ = máximo sin incluir/incluyendo a $v$), diámetro con DP, rerooting.
- **DP con bitmask avanzada**: asignación, matching, perfil de dominó (tilings).

## Optimizaciones de DP

- **Knuth-Yao**: para DP de intervalos con cierta propiedad de monotonicidad, reduce de $O(n^3)$ a $O(n^2)$.
- **Divide and Conquer DP**: cuando $dp[i] = \\min_{j < i} (dp[j] + C(j, i))$ y $C$ satisface la desigualdad cuadrangular.
- **Convex Hull Trick (CHT)**: para DP de la forma $dp[i] = \\min_j (m_j \\cdot x_i + b_j)$, manteniendo las rectas en una envolvente convexa.

## Señales de que un problema es de DP

- "Mínimo/máximo número de...", "¿es posible...?", "¿de cuántas formas...?"
- Los límites son demasiado grandes para búsqueda completa pero no tanto como para $O(1)$ o greedy.
- El problema tiene una estructura secuencial o se puede descomponer en subproblemas más pequeños del mismo tipo.

## Relación con otros temas

- **CPH: Programación dinámica básica**: fundamentos y ejemplos clásicos.
- **CPH: Manipulación de bits**: DP sobre bitmask.
- **CPH: Algoritmos en árboles**: DP en árboles.
- **TemasParaImportar/dp/**: guía maestra de DP con 12 archivos y plan de estudio de 10-15 horas.`,
  },
  {
    title: 'CP4: Recorridos de grafos (DFS/BFS y aplicaciones)',
    category: 'CP4 - Grafos',
    content: `## ¿Qué es?

CP4 dedica un capítulo completo a los recorridos de grafos y sus aplicaciones. DFS y BFS son los algoritmos de recorrido, pero el capítulo cubre también flood fill, ordenamiento topológico, verificación de bipartito, detección de ciclos, y la base de algoritmos más avanzados (puntos de articulación, puentes, SCC).

## ¿Por qué es importante?

DFS y BFS son los bloques de construcción de prácticamente todos los algoritmos de grafos. CP4 organiza las aplicaciones en orden de complejidad creciente, desde las más simples (componentes conexas) hasta las más avanzadas (puentes, SCC), dando un roadmap de aprendizaje.

## Aplicaciones cubiertas

- **Componentes conexas**: correr DFS/BFS desde cada nodo no visitado.
- **Flood fill**: DFS/BFS sobre una grilla 2D implícita (las celdas son nodos, los movimientos son aristas).
- **Ordenamiento topológico**: solo en DAGs. Por DFS (post-orden invertido) o por Kahn (BFS con grados de entrada).
- **Bipartición**: 2-coloreo durante BFS/DFS. Si dos nodos adyacentes comparten color, no es bipartito.
- **Detección de ciclos en dirigidos**: tres estados (no visitado, en pila, terminado).

## Profundizando: más allá de lo básico

- **Puntos de articulación y puentes**: usando \\\`disc\\\` y \\\`low\\\` en un solo DFS (algoritmo de Tarjan).
- **Componentes fuertemente conexas**: Tarjan (un DFS con pila) o Kosaraju (dos DFS).
- **Grafo de condensación**: colapsar cada SCC en un solo nodo produce un DAG.

## Ejemplo práctico: flood fill para contar islas

Dada una grilla de 0s (agua) y 1s (tierra), contar el número de islas (componentes conexas de 1s). DFS/BFS desde cada celda con 1 no visitada, marcando todas las celdas conectadas (4 u 8 direcciones según el problema).

\\\`\\\`\\\`cpp
void dfs(int i, int j) {
    if (i < 0 || i >= n || j < 0 || j >= m || grid[i][j] == 0 || vis[i][j]) return;
    vis[i][j] = true;
    for (auto [di, dj] : dirs) dfs(i + di, j + dj);
}
\\\`\\\`\\\`

## Relación con otros temas

- **CPH: Fundamentos y recorrido de grafos**: introducción a DFS/BFS y sus aplicaciones básicas.
- **CP4: Puntos de articulación, puentes y SCC**: profundiza en los algoritmos basados en \\\`disc\\\`/\\\`low\\\`.
- **CPH: Grafos dirigidos y DP en DAG**: ordenamiento topológico y DP sobre DAG.`,
  },
  {
    title: 'CP4: Puntos de articulación, puentes y componentes fuertemente conexas',
    category: 'CP4 - Grafos',
    content: `## ¿Qué es?

CP4 presenta el algoritmo unificado de Tarjan basado en \\\`disc\\\` (tiempo de descubrimiento) y \\\`low\\\` (menor tiempo de descubrimiento alcanzable) que, en un solo DFS, encuentra puntos de articulación y puentes en grafos no dirigidos, y componentes fuertemente conexas en grafos dirigidos.

## ¿Por qué es importante?

Estos conceptos identifican los "puntos débiles" de una red: quitar un punto de articulación o un puente desconecta el grafo. En problemas de redes, infraestructura crítica, y confiabilidad, son fundamentales. Además, el algoritmo de Tarjan es un ejemplo magistral de cómo extender un DFS básico para resolver problemas no triviales.

## Algoritmo de Tarjan para puntos de articulación y puentes

Durante un **único** DFS, se calculan para cada nodo:

$$low[v] = \\min\\Big(disc[v],\\ \\min_{hijo\\ c} low[c],\\ \\min_{(v,w)\\ \\text{retroceso}} disc[w]\\Big)$$

- **Puente**: arista $(u, v)$ del árbol de DFS es puente si $low[v] > disc[u]$. No hay arista de retroceso desde el subárbol de $v$ hacia $u$ o más arriba.
- **Punto de articulación**: $u$ (no raíz) lo es si existe un hijo $v$ con $low[v] \\ge disc[u]$. La raíz del DFS lo es solo si tiene **más de un** hijo en el árbol de DFS.

## Tarjan para SCC (grafos dirigidos)

Mismo esquema \\\`disc\\\`/\\\`low\\\` pero con una pila explícita para agrupar nodos. Cuando \\\`low[v] == disc[v]\\\`, $v$ es la raíz de una SCC y se desempilan nodos hasta $v$. Alternativa: Kosaraju (dos DFS, uno sobre el grafo transpuesto).

## 2-SAT como aplicación de SCC

Cada variable $x_i$ genera dos nodos: $x_i$ y $\\neg x_i$. Cada cláusula $(a \\lor b)$ se traduce a $(\\neg a \\implies b)$ y $(\\neg b \\implies a)$. La fórmula es satisfacible si y solo si $x_i$ y $\\neg x_i$ no están en la misma SCC. La asignación se obtiene del orden topológico de las SCC.

## Ejemplo práctico: encontrar todos los puentes de una red

Dado un grafo que modela una red de computadoras, encontrar todas las conexiones cuyo corte dejaría la red partida en dos. El algoritmo de Tarjan las encuentra en $O(V + E)$ con un solo DFS, sin necesidad de probar quitar cada arista individualmente ($O(E \\cdot (V+E))$).

## Relación con otros temas

- **CP4: Recorridos de grafos**: DFS es la base sobre la que se construye Tarjan.
- **CPH: Conectividad fuerte y 2-SAT**: SCC y 2-SAT con más detalle de implementación.
- **CPH: Grafos dirigidos y DP en DAG**: el grafo de condensación de SCC es un DAG.`,
  },
  {
    title: 'CP4: Árbol de expansión mínima (MST)',
    category: 'CP4 - Grafos',
    content: `## ¿Qué es?

El MST (Minimum Spanning Tree) de un grafo conexo, no dirigido y ponderado es el subconjunto de aristas que conecta todos los nodos sin ciclos y con el peso total mínimo. CP4 cubre Kruskal (con Union-Find), Prim (con heap), y variantes como Maximum Spanning Tree, Minimax y Maximin.

## ¿Por qué es importante?

El MST modela problemas de conexión mínima (cableado, carreteras, redes). Sus variantes resuelven problemas de cuello de botella: "minimizar la arista más pesada en un camino entre dos nodos" (Minimax path) y "maximizar la arista más liviana" (Maximin path). Ambas se responden con el MST del grafo.

## Kruskal con Union-Find

Ordenar aristas por peso ascendente. Para cada arista, si sus extremos están en componentes distintas (\\\`find(u) != find(v)\\ \`), agregarla al MST y unir las componentes. $O(E \\log E)$ (dominado por el ordenamiento).

## Prim con heap

Comenzar desde un nodo arbitrario. Mantener una cola de prioridad con las aristas que conectan nodos ya en el MST con nodos fuera. En cada paso, extraer la de menor peso. $O(E \\log V)$. Mejor que Kruskal para grafos densos ($E$ cercano a $V^2$).

## Variantes

- **Maximum Spanning Tree**: ordenar aristas por peso **descendente** en Kruskal, o usar max-heap en Prim.
- **Minimax path**: el camino entre $u$ y $v$ que minimiza la arista más pesada se encuentra sobre el MST.
- **Maximin path**: el camino que maximiza la arista más liviana también está sobre el MST.
- **Second-best MST**: el segundo mejor árbol de expansión, $O(E \\log E + V^2)$ o $O(E \\log V)$.

## Ejemplo práctico: conectar islas con puentes

Hay $n$ islas y se pueden construir puentes entre algunos pares con costo $c_{ij}$. Encontrar el conjunto de puentes de costo total mínimo que conecte todas las islas. Es exactamente el MST del grafo completo donde los nodos son islas y las aristas son los puentes posibles.

## Relación con otros temas

- **CP4: Union-Find Disjoint Sets**: Kruskal depende completamente de Union-Find.
- **CPH: Árboles de expansión mínima**: introducción desde CPH.
- **CP4: Caminos mínimos desde un origen (SSSP)**: MST y shortest path son problemas distintos (MST minimiza la suma de aristas; SSSP minimiza el camino entre dos nodos).`,
  },
  {
    title: 'CP4: Caminos mínimos desde un origen (SSSP)',
    category: 'CP4 - Grafos',
    content: `## ¿Qué es?**

**SSSP** (Single-Source Shortest Paths) encuentra los caminos de costo mínimo desde un nodo origen a todos los demás. CP4 cubre tres escenarios: grafos no ponderados (BFS), grafos con pesos no negativos (Dijkstra), y grafos con pesos negativos (Bellman-Ford).

## ¿Por qué es importante?

Es uno de los problemas más frecuentes. La elección del algoritmo correcto depende de las características del grafo. Usar Dijkstra en un grafo con pesos negativos da WA silencioso; usar Bellman-Ford en un grafo grande con pesos positivos da TLE.

## BFS (grafos no ponderados)

Todos los pesos = 1. BFS desde el origen encuentra las distancias mínimas en número de aristas en $O(V + E)$. Es un caso especial de Dijkstra (con cola simple en vez de cola de prioridad) y de Bellman-Ford.

## Dijkstra (pesos ≥ 0)

Con cola de prioridad (min-heap), $O((V + E) \\log V)$. Invariante: cuando un nodo sale de la cola, su distancia es definitiva. Esto **no** se cumple si hay pesos negativos.

Truco importante: \\\`if (d > dist[u]) continue;\\\` al sacar un nodo de la cola descarta entradas obsoletas (el mismo nodo pudo haber sido insertado múltiples veces con diferentes distancias tentativas).

## Bellman-Ford (pesos negativos, sin ciclos negativos)

Relaja todas las aristas $V - 1$ veces: $O(V \\cdot E)$. Soporta pesos negativos. Una iteración extra (la $V$-ésima) detecta ciclos negativos: si alguna arista aún se puede relajar, existe un ciclo negativo alcanzable. SPFA (Shortest Path Faster Algorithm) es una optimización con cola que en la práctica es más rápida pero tiene peor caso $O(V \\cdot E)$.

## Reconstrucción del camino

Mantener \\\`parent[v]\\\` = nodo desde el cual se relajó $v$. Al terminar, seguir los padres hacia atrás desde el destino hasta el origen.

## Ejemplo práctico: Dijkstra con reconstrucción

Encontrar la ruta más corta (no solo la distancia) entre dos ciudades en un mapa. Dijkstra + \\\`parent\\\` + reconstrucción inversa.

## Relación con otros temas

- **CP4: Caminos mínimos entre todos los pares (APSP)**: Floyd-Warshall para cuando se necesitan todos los pares.
- **CPH: Caminos mínimos**: introducción y fundamentos desde CPH.
- **CP4: Grafos especiales**: en DAGs, SSSP se resuelve en $O(V + E)$ con orden topológico (sin necesidad de Dijkstra).`,
  },
  {
    title: 'CP4: Caminos mínimos entre todos los pares (APSP)',
    category: 'CP4 - Grafos',
    content: `## ¿Qué es?

**APSP** (All-Pairs Shortest Paths) calcula los caminos mínimos entre **todos** los pares de nodos. El algoritmo estándar es Floyd-Warshall en $O(V^3)$. Alternativas: correr Dijkstra desde cada nodo ($O(V \\cdot (E + V) \\log V)$) si no hay pesos negativos, o Bellman-Ford desde cada nodo ($O(V^2 \\cdot E)$).

## ¿Por qué es importante?

Cuando $V \\le 500$, Floyd-Warshall es la opción más simple y cubre tanto pesos negativos como positivos (si no hay ciclos negativos). También resuelve transitive closure (¿existe un camino de $i$ a $j$?) y el diámetro del grafo (máxima distancia entre dos nodos).

## Floyd-Warshall

$$dist[i][j] = \\min\\big(dist[i][j],\\ dist[i][k] + dist[k][j]\\big)$$

El **orden de los bucles es crítico**: $k$ (nodo intermedio) debe ser el bucle más externo, luego $i$, luego $j$. Si se invierte, el resultado es incorrecto.

Inicialización: \\\`dist[i][i] = 0\\\`, \\\`dist[i][j] = w(i,j)\\ \` si existe arista, \\\`INF\\\` si no.

## Aplicaciones de Floyd-Warshall

- **Detección de ciclos negativos**: si tras el algoritmo, \\\`dist[i][i] < 0\\ \` para algún $i$, hay un ciclo negativo que incluye a $i$.
- **Transitive closure**: reemplazar \\\`min\\\` y \\\`+\\\` por operaciones lógicas: \\\`reach[i][j] = reach[i][j] || (reach[i][k] && reach[k][j])\\ \`. Útil para problemas de "¿se puede llegar?".
- **Diámetro del grafo**: $\\max_{i,j} dist[i][j]$ (si es $\\infty$, el grafo es disconexo).
- **Minimax / Maximin entre todos los pares**: cambiar \\\`+\\\` y \\\`min\\\` por \\\`max\\\` y \\\`min\\\` según corresponda.

## Cuándo usar Floyd-Warshall vs Dijkstra repetido

| Caso | Mejor opción |
|---|---|
| $V \\le 500$, $E$ cualquiera | Floyd-Warshall |
| $V > 500$, sin pesos negativos | Dijkstra desde cada nodo |
| $V > 500$, con pesos negativos | Bellman-Ford desde cada nodo (si $V \\cdot E$ lo permite) |
| Solo se necesita transitive closure | Floyd-Warshall con bitset ($O(V^3 / 64)$) |

## Ejemplo práctico: calcular el diámetro de una red social

Modelar personas como nodos, conexiones como aristas con peso 1 (o distancia emocional). Floyd-Warshall calcula todas las distancias; el diámetro es la máxima. Si es 6 o menos, se cumple la teoría de los "seis grados de separación".

## Relación con otros temas

- **CP4: Caminos mínimos desde un origen (SSSP)**: Dijkstra y Bellman-Ford como alternativas.
- **CPH: Caminos mínimos**: introducción a Floyd-Warshall.
- **CPH: Matrices**: Floyd-Warshall tiene una interpretación como multiplicación de matrices en el (min, +)-semianillo.`,
  },
  {
    title: 'CP4: Grafos especiales',
    category: 'CP4 - Grafos',
    content: `## ¿Qué es?**

CP4 dedica una sección a tipos de grafos con propiedades que habilitan algoritmos más eficientes o especializados: DAGs (Directed Acyclic Graphs), árboles, grafos bipartitos y grafos Eulerianos.

## ¿Por qué es importante?

Reconocer un grafo especial puede simplificar drásticamente el algoritmo: en un DAG, el camino más largo es polinomial; en un árbol, el LCA y el diámetro se calculan en $O(n)$; en un grafo bipartito, el matching máximo se reduce a flujo; en un grafo Euleriano, existe un circuito que recorre todas las aristas.

## DAG (Directed Acyclic Graph)

- Sin ciclos dirigidos.
- **Orden topológico** en $O(V + E)$.
- **Camino más largo**: $O(V + E)$ con DP en orden topológico (en grafos generales es NP-difícil).
- **Conteo de caminos**: $O(V + E)$.
- **SSSP en DAG**: $O(V + E)$ procesando en orden topológico (no necesita Dijkstra).

## Árboles

- $n$ nodos, $n-1$ aristas, sin ciclos, conexo.
- **Camino único** entre cualquier par de nodos.
- **Diámetro**: $O(n)$ con dos DFS/BFS.
- **Centroide**: nodo que minimiza el tamaño del componente más grande al eliminarlo; $O(n)$.
- **DP en árboles**: máximo conjunto independiente, cobertura mínima de vértices.
- **LCA**: $O(\\log n)$ con binary lifting, $O(1)$ con RMQ sobre Euler Tour.

## Grafos bipartitos

- Los nodos se pueden dividir en dos conjuntos sin aristas internas.
- **Verificación**: $O(V + E)$ con 2-coloreo (BFS/DFS).
- **Matching máximo**: $O(\\sqrt{V} \\cdot E)$ con Hopcroft-Karp, o reducción a flujo máximo.
- **Cobertura mínima de vértices** (König): tamaño = matching máximo.
- **Conjunto independiente máximo**: $V -$ matching máximo.

## Grafos Eulerianos

- Circuito Euleriano (recorre cada arista exactamente una vez, vuelve al inicio).
- Condiciones simples de verificar (grados pares, grado entrada = grado salida).
- Construcción en $O(E)$ con Hierholzer.
- Aplicación: secuencias de De Bruijn, recorrido de calles (Chinese Postman).

## Ejemplo práctico: reconocer y aplicar el algoritmo correcto

Dado un grafo, determinar su tipo y aplicar el algoritmo adecuado: si es árbol → DP en árboles; si es DAG → orden topológico + DP; si es bipartito → matching. El primer paso siempre es leer los límites y el enunciado para clasificar el grafo.

## Relación con otros temas

- **CPH: Grafos dirigidos y DP en DAG**: técnicas sobre DAGs.
- **CPH: Algoritmos en árboles**: diámetro, rerooting, DP en árboles.
- **CPH: Caminos y circuitos**: Euleriano y Hamiltoniano.
- **CPH: Flujos y cortes**: matching bipartito como flujo máximo.`,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// PAPERS — Documentos de referencia sobre estrategia y errores en competencia
// docs/papers/
// ═══════════════════════════════════════════════════════════════════════════

const PAPER_TOPICS: TopicSeed[] = [
  {
    title: 'Paper: Errores comunes en contests online y en tiempo real',
    category: 'Papers y estrategia de competencia',
    content: `## ¿Qué es?

Este paper compila los errores más frecuentes que cometen los competidores en concursos de programación, basado en observación de cientos de concursos. Cubre errores de implementación, estrategia, manejo del tiempo, trabajo en equipo, y bugs específicos de C++/Java.

## ¿Por qué es importante?

Conocer los errores comunes **antes** de cometerlos en un concurso real es una de las formas más eficientes de mejorar el rendimiento. Muchos de estos errores son evitables con disciplina y checklist.

## Errores de implementación

- No inicializar variables entre casos de prueba cuando el input contiene múltiples datasets.
- Comparar números de punto flotante con \\\`==\\\`.
- Usar \\\`float\\\` en vez de \\\`double\\\` (menos precisión, menos rango).
- No considerar el overflow: \\\`int\\\` en vez de \\\`long long\\\` cuando los valores intermedios pueden exceder $2^{31}$.
- Off-by-one: confundir índices 0-based con 1-based.
- Olvidar el caso $n = 0$ o $n = 1$.

## Errores de estrategia

- Pasar demasiado tiempo en un problema difícil ignorando los fáciles.
- No leer todos los problemas al inicio.
- Debuggear en la pantalla en vez de en papel (real-time debugging).
- No probar con casos extremos (mínimo, máximo, todos iguales, entrada vacía).

## Errores de equipo (ICPC)

- Mala división de problemas (dos personas trabajando en lo mismo).
- No comunicar hallazgos (un compañero encuentra un caso borde pero no lo comparte).
- Pelear por el teclado en vez de planificar en papel.

## Recomendaciones técnicas

- Usar \\\`double\\\` siempre, nunca \\\`float\\\`.
- Comparar \\\`double\\\` con epsilon: \\\`fabs(a - b) < 1e-9\\\`.
- Definir \\\`pi\\\` con precisión: \\\`const double PI = 2 * acos(0.0);\\\`
- Inicializar explícitamente variables globales al inicio de cada caso de prueba.
- Usar \\\`assert\\\` para detectar invariantes rotos.
- Preferir iteración sobre recursión cuando la profundidad puede ser grande (stack overflow).

## Ejemplo práctico: checklist pre-envío

Antes de enviar una solución: ¿inicialicé todas las variables? ¿Probé con $n=0$ y $n=1$? ¿Usé \\\`long long\\\` donde podría haber overflow? ¿Probé el caso máximo? ¿El formato de salida coincide **exactamente** con lo pedido (espacios, saltos de línea, mayúsculas)?

## Relación con otros temas

- **Paper: Estrategia de contest**: complementa con estrategia de orden de resolución.
- **CP4: Fundamentos y consejos**: cubre recomendaciones similares desde CP4.
- **TemasParaImportar/checklist-pre-envio.md**: checklist detallada para aplicar antes de cada envío.`,
    commonPitfalls:
      'No inicializar variables globales entre casos de un mismo archivo de input. Comparar números de punto flotante con ==. Usar float en vez de double. Asumir el formato de fin de caso sin confirmarlo con el enunciado.',
  },
  {
    title: 'Paper: Estrategia de contest (Trotman & Handley)',
    category: 'Papers y estrategia de competencia',
    content: `## ¿Qué es?

Andrew Trotman y Chris Handley, en "Programming Contest Strategy" (University of Otago, 2006), realizan el primer análisis sistemático y formal de qué estrategia de orden de resolución conviene en un concurso tipo ICPC. El paper modela matemáticamente el problema y demuestra resultados importantes sobre la optimalidad de distintas estrategias.

## ¿Por qué es importante?

La intuición de "resolver de más fácil a más difícil" no siempre maximiza el número de problemas resueltos. Entender cuándo y por qué esta estrategia es óptima (y cuándo no) permite tomar decisiones informadas durante el concurso.

## El problema de "complejidad creciente / tiempo decreciente"

Resolver de más fácil a más difícil hace que, a medida que avanza el concurso, cada problema restante toma más tiempo justo cuando queda menos tiempo disponible. Los autores demuestran que esto puede hacer que un equipo resuelva **menos** problemas en total que si hubiera elegido otro orden, incluso si estima perfectamente cuánto tarda cada problema.

## Resultados principales

- **Minimizar el puntaje de desempate (tie-break)**: siempre se logra resolviendo de más fácil a más difícil. Demostración formal mediante argumento de intercambio: si dos problemas se resuelven en orden inverso al de dificultad, intercambiarlos reduce o mantiene el tie-break.
- **Maximizar el número de problemas resueltos**: encontrar el orden óptimo es **NP-completo** en general (equivalente a problemas de partición / scheduling). No existe un algoritmo eficiente universal.
- **Caso especial con dos problemas**: resolver el más difícil primero **nunca** resuelve más problemas que resolver el más fácil primero.

## Implicaciones prácticas

- Si el objetivo es ganar el desempate (mismo número de problemas, menor tiempo total), siempre conviene ordenar por dificultad ascendente.
- Si el objetivo es maximizar el número de problemas (y el desempate no importa, o hay pocos problemas), puede convenir un orden no obvio.
- En la práctica de ICPC, la mayoría de los equipos resuelven menos de 6 problemas, donde la diferencia de estrategia es pequeña. Para equipos de élite que resuelven 8-10+, la estrategia de orden puede ser decisiva.

## Estrategia práctica recomendada

1. Leer todos los problemas en los primeros 10-15 minutos.
2. Clasificar por dificultad **percibida** (no real, porque no se conoce con certeza).
3. Resolver primero los triviales para asegurar puntos tempranos.
4. A partir de ahí, el equipo debe decidir si seguir en orden de dificultad o atacar problemas "de alto valor" aunque sean más difíciles, según el tiempo restante y la cantidad de problemas que el equipo cree poder resolver.

## Relación con otros temas

- **Paper: Errores comunes**: complementa con los errores tácticos que arruinan cualquier estrategia.
- **Paper: Entrenando equipos ICPC**: estrategia desde la perspectiva del entrenador.
- **CP4: Fundamentos y consejos**: recomendaciones prácticas de estrategia durante el concurso.`,
  },
  {
    title: 'Paper: Entrenando equipos ICPC - guía técnica (Rujia Liu)',
    category: 'Papers y estrategia de competencia',
    content: `## ¿Qué es?

Rujia Liu, competidor legendario (medallista de oro en IOI y ACM-ICPC World Finals) y autor de "Training ICPC Teams: A Technical Guide", presenta un programa sistemático para entrenar equipos universitarios de programación competitiva, desde los fundamentos hasta el nivel de World Finals.

## ¿Por qué es importante?

Entrenar para ICPC no es solo "resolver muchos problemas". Requiere un plan estructurado que cubra teoría, práctica deliberada, trabajo en equipo, y preparación mental. Este paper provee el marco que usan los equipos exitosos.

## Estructura del entrenamiento según Liu

- **Fase 1: Fundamentos (3-4 meses)**. Dominar el lenguaje (C++), estructuras de datos básicas, algoritmos elementales (ordenamiento, búsqueda binaria, búsqueda completa, greedy básico), y matemáticas discretas. Resolver problemas de dificultad Codeforces 800-1400.
- **Fase 2: Técnicas intermedias (4-6 meses)**. DP, grafos (DFS/BFS, Dijkstra, MST, SCC, flujo), estructuras de datos avanzadas (segment tree, BIT, DSU), teoría de números. Dificultad 1400-1900.
- **Fase 3: Técnicas avanzadas (3-4 meses)**. DP avanzada, flujo (Dinic, matching), geometría computacional, strings (KMP, Z, Aho-Corasick), técnicas de sqrt decomposition. Dificultad 1900-2400.
- **Fase 4: Afinamiento pre-competencia (1-2 meses)**. Simulacros de concurso, estrategia de equipo, manejo del tiempo, repaso de la librería personal.

## Principios de entrenamiento

- **Práctica deliberada**: no solo resolver problemas al azar, sino enfocarse en debilidades específicas.
- **Upsolving**: después de cada concurso simulado, resolver los problemas que no se lograron durante el tiempo.
- **Librería personal**: construir y mantener implementaciones de referencia de los algoritmos clave (no copiar y pegar sin entender).
- **Trabajo en equipo**: definir roles (algoritmista, implementador, debugger), practicar la comunicación, y rotar para que todos sepan hacer de todo.

## Perfil de un equipo ganador

- Un miembro fuerte en matemáticas y DP.
- Un miembro fuerte en grafos y estructuras de datos.
- Un miembro fuerte en geometría y strings.
- Todos deben tener un nivel sólido en las técnicas fundamentales.

## Relación con otros temas

- **Paper: Estrategia de contest**: el entrenamiento debe incluir práctica de estrategia, no solo algoritmos.
- **Paper: Errores comunes**: conocer los errores frecuentes acelera la fase de aprendizaje.
- **CPH y CP4**: son los dos libros de referencia que estructuran el contenido técnico del entrenamiento.`,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// MAIN — Siembra idempotente por slug
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  const admin = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (!admin) {
    console.log('Admin no encontrado. Ejecuta primero el seed principal (seed.ts).');
    return;
  }

  const allTopics = [...CPH_TOPICS, ...CP4_TOPICS, ...PAPER_TOPICS];
  let created = 0;
  let updated = 0;

  for (const topic of allTopics) {
    const slug = slugify(topic.title);

    const existing = await prisma.notebookEntry.findUnique({ where: { slug } });
    if (existing) {
      await prisma.notebookEntry.update({
        where: { slug },
        data: {
          title: topic.title,
          category: topic.category,
          content: topic.content,
          commonPitfalls: topic.commonPitfalls ?? null,
        },
      });
      updated += 1;
    } else {
      await prisma.notebookEntry.create({
        data: {
          slug,
          title: topic.title,
          category: topic.category,
          content: topic.content,
          commonPitfalls: topic.commonPitfalls ?? null,
          authorId: admin.id,
        },
      });
      created += 1;
    }
  }

  console.log(`Temas creados: ${created}. Temas actualizados: ${updated}.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
