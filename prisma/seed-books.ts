import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'cristoballongares@gmail.com';

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

type TopicSeed = {
  title: string;
  category: string;
  content: string;
  commonPitfalls?: string;
};

// ── CPH: Competitive Programmer's Handbook (Antti Laaksonen) ──────────
// docs/libros/cph.pdf — un tema por capitulo del libro.
const CPH_TOPICS: TopicSeed[] = [
  {
    title: 'CPH: Introduccion y complejidad temporal',
    category: 'CPH - Tecnicas basicas',
    content: `## Notacion asintotica

$f(n) = O(g(n))$ significa que existen constantes $c > 0$ y $n_0$ tales que
$f(n) \\le c \\cdot g(n)$ para todo $n \\ge n_0$. En la practica describe el
comportamiento del algoritmo cuando la entrada crece, ignorando constantes
y terminos de menor orden.

## Reglas de calculo

- **Bucles secuenciales**: las complejidades se suman y domina el termino
  mayor. Un bucle $O(n)$ seguido de otro $O(n^2)$ sigue siendo $O(n^2)$.
- **Bucles anidados**: las complejidades se multiplican. Dos bucles de
  tamano $n$ anidados dan $O(n^2)$; tres, $O(n^3)$.
- **Recursion**: la complejidad depende de cuantas llamadas se generan y
  cuanto trabajo hace cada una. Para recurrencias de la forma
  $T(n) = a \\cdot T(n/b) + f(n)$ (divide y venceras), el Master Theorem da
  la solucion segun como se comparan $f(n)$ y $n^{\\log_b a}$; por ejemplo
  $T(n) = 2T(n/2) + O(n)$ (merge sort) resuelve a $O(n \\log n)$.

## Clases de complejidad y limites practicos

Un juez tipico ejecuta entre $10^8$ y $10^9$ operaciones simples por
segundo. Segun el limite de $N$ del problema, se puede inferir que
complejidad se espera:

| N | Complejidad tolerable |
|---|---|
| $N \\le 10$ | $O(N!)$, $O(2^N \\cdot N)$ |
| $N \\le 20$–$24$ | $O(2^N)$ |
| $N \\le 100$–$500$ | $O(N^4)$ |
| $N \\le 2\\,000$–$10\\,000$ | $O(N^3)$ |
| $N \\le 10^4$–$10^5$ | $O(N^2)$ |
| $N \\le 10^6$ | $O(N \\log N)$ |
| $N \\le 10^8$ | $O(N)$ |
| $N$ arbitrario (hasta $10^{18}$) | $O(\\log N)$ o $O(1)$ |

## Estimando eficiencia: ejemplo concreto

Si $N = 10^5$ y el limite de tiempo es 1 segundo, un algoritmo $O(N^2)$
hace $10^{10}$ operaciones (varios segundos, TLE casi seguro), mientras que
$O(N \\log N) \\approx 1.7 \\times 10^6$ corre en milisegundos. Este calculo
mental, hecho **antes** de codear, evita implementar un algoritmo
condenado a exceder el tiempo.

## Suma maxima de subarreglo (Kadane)

Problema introductorio del capitulo: dado un arreglo, encontrar la suma
maxima de un subarreglo contiguo. El enfoque ingenuo prueba todos los
pares de indices ($O(n^2)$) o incluso todos los subarreglos recalculando
la suma ($O(n^3)$). Kadane lo resuelve en $O(n)$ manteniendo la mejor suma
que **termina exactamente** en la posicion actual:

$$best[i] = \\max(a[i],\\ best[i-1] + a[i])$$

La respuesta es $\\max_i best[i]$.

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

## Matematica basica util (seccion 1.5 del libro)

Formulas que aparecen constantemente al analizar complejidades:

$$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2} \\qquad \\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6}$$

$$\\sum_{i=0}^{n-1} x^i = \\frac{x^n - 1}{x - 1} \\quad (x \\neq 1)$$

La suma armonica $\\sum_{i=1}^{n} \\frac{1}{i} \\approx \\ln n$ explica por que
sumar $n/d$ para $d = 1, \\ldots, n$ (como en una criba de divisores) da
$O(n \\log n)$ en vez de $O(n^2)$.`,
    commonPitfalls:
      'Asumir que un algoritmo O(n^2) alcanza sin calcular el limite real de N. Confundir O(n log n) con O(n) al estimar si un algoritmo pasa el limite de tiempo.',
  },
  {
    title: 'CPH: Ordenamiento y busqueda binaria',
    category: 'CPH - Tecnicas basicas',
    content: `## Teoria de ordenamiento

Los algoritmos de ordenamiento **por comparacion** (merge sort, quicksort,
heapsort) tienen una cota inferior demostrable de $O(n \\log n)$: con $n$
elementos hay $n!$ ordenes posibles, y cada comparacion solo puede
descartar una fraccion de ellos, asi que se necesitan al menos
$\\log_2(n!) = \\Theta(n \\log n)$ comparaciones en el peor caso.

Cuando los valores estan acotados en un rango pequeno $[0, k]$, **counting
sort** rompe esa cota inferior contando ocurrencias de cada valor: $O(n +
k)$, sin comparar elementos entre si.

## Ordenar en C++

\\\`sort()\\\` de la STL implementa introsort (quicksort con fallback a
heapsort si la recursion se profundiza demasiado, evitando el peor caso
$O(n^2)$ de quicksort puro), garantizando $O(n \\log n)$. Acepta un
comparador personalizado para ordenar por criterios compuestos:

\\\`\\\`\\\`cpp
sort(v.begin(), v.end(), [](const P& a, const P& b) {
    if (a.first != b.first) return a.first < b.first;
    return a.second < b.second; // desempate
});
\\\`\\\`\\\`

## Busqueda binaria

Sobre un arreglo ordenado, cada comparacion descarta la mitad del espacio
de busqueda: $O(\\log n)$ en vez de $O(n)$ de una busqueda lineal.
\\\`lower_bound\\\` devuelve el primer elemento $\\ge x$; \\\`upper_bound\\\` el
primero $> x$; la diferencia entre ambos da la cantidad de ocurrencias de
$x$.

Mas alla de buscar un valor exacto, la busqueda binaria se usa para
**buscar en la respuesta** (parametric search): si existe una funcion
$f(x)$ monotona (por ejemplo, "¿es posible resolver el problema usando a
lo sumo $x$ recursos?"), se puede binariar directamente sobre $x$ en vez
de calcular la respuesta de forma directa. Esto convierte problemas de
optimizacion en problemas de decision, generalmente mas faciles de
verificar.`,
    commonPitfalls:
      'Usar busqueda binaria sobre una funcion que no es realmente monotona (el resultado es indefinido). Errores de limites off-by-one al implementar lower_bound/upper_bound a mano. Olvidar que sort() no es estable (usar stable_sort si el orden relativo de elementos iguales importa).',
  },
  {
    title: 'CPH: Estructuras de datos dinamicas de C++',
    category: 'CPH - Tecnicas basicas',
    content: `## Arreglos dinamicos

\\\`vector\\\` crece duplicando su capacidad cuando se llena, lo que amortiza
cada \\\`push_back\\\` a $O(1)$ aunque una insercion individual (la que
provoca el redimensionamiento) sea $O(n)$: el costo total de $n$
inserciones es $O(n)$, no $O(n^2)$.

## Estructuras de conjuntos y mapas

\\\`set\\\`/\\\`multiset\\\` y \\\`map\\\`/\\\`multimap\\\` se implementan como arboles
balanceados (tipicamente red-black trees), manteniendo los elementos
**ordenados** con insercion, borrado y busqueda en $O(\\log n)$. Cuando no
se necesita orden, \\\`unordered_set\\\`/\\\`unordered_map\\\` (hash tables) dan
$O(1)$ esperado mediante una tabla de hash, a costa de un peor caso
$O(n)$ ante colisiones adversarias.

## Iteradores y rangos

Toda la STL usa la convencion de rango semi-abierto $[begin, end)$:
\\\`begin()\\\` apunta al primer elemento y \\\`end()\\\` a la posicion **despues**
del ultimo. Esto permite escribir \\\`for (auto it = v.begin(); it !=
v.end(); ++it)\\\` sin casos especiales para el arreglo vacio.

## Otras estructuras

\\\`stack\\\` (LIFO), \\\`queue\\\` (FIFO) y \\\`deque\\\` (insercion/borrado $O(1)$ en
ambos extremos) cubren la mayoria de los patrones de acceso restringido.
\\\`priority_queue\\\` implementa un heap binario: insertar y extraer el
maximo cuestan $O(\\log n)$.

## Cuando usar cada una

Si los datos se procesan todos de una sola vez (sin intercalar consultas),
ordenar con \\\`sort\\\` y recorrer el arreglo resultante suele ser mas
rapido en la practica (mejor constante, mejor localidad de cache) que
mantener un \\\`set\\\` dinamico equivalente. \\\`set\\\`/\\\`map\\\` se justifican
cuando hace falta **intercalar** inserciones, borrados y consultas
ordenadas.`,
  },
  {
    title: 'CPH: Busqueda completa',
    category: 'CPH - Tecnicas basicas',
    content: `## Generar subconjuntos

Con $n$ elementos hay $2^n$ subconjuntos. Se generan iterando una mascara
de bits de $0$ a $2^n - 1$ (el bit $i$ de la mascara indica si el elemento
$i$ esta incluido), o recursivamente decidiendo incluir/excluir cada
elemento uno a la vez:

\\\`\\\`\\\`cpp
void generar(int i, vector<int>& actual) {
    if (i == n) { procesar(actual); return; }
    generar(i + 1, actual);           // excluir elemento i
    actual.push_back(a[i]);
    generar(i + 1, actual);           // incluir elemento i
    actual.pop_back();
}
\\\`\\\`\\\`

## Generar permutaciones

$n!$ permutaciones; en C++, \\\`next_permutation\\\` las genera en orden
lexicografico sobre un arreglo ya ordenado. Tambien se pueden generar
recursivamente con un arreglo de "usados" y backtracking.

## Backtracking y poda

El patron general es: probar una opcion, recursar sobre el resto del
problema, y deshacer la opcion al volver (backtrack). La **poda** —cortar
ramas que ya no pueden mejorar la mejor respuesta conocida, o que violan
una restriccion— es lo que vuelve viable en la practica un backtracking
que en el peor caso es exponencial. Un ejemplo tipico es podar tan pronto
como una suma parcial excede el objetivo, sin esperar a completar la
rama.

## Meet in the middle

Cuando $n$ es demasiado grande para $O(2^n)$ pero $n \\le 40$ aproximadamente
(donde $O(2^{n/2})$ si alcanza), se divide el conjunto en dos mitades de
tamano $n/2$: se generan todas las $2^{n/2}$ combinaciones de cada mitad
por separado, y se combinan los resultados —tipicamente ordenando las
sumas de una mitad y, para cada combinacion de la otra, buscando con
busqueda binaria el complemento que da la suma objetivo. Complejidad total
$O(2^{n/2} \\log(2^{n/2})) = O(2^{n/2} \\cdot n)$, muy por debajo de
$O(2^n)$.`,
  },
  {
    title: 'CPH: Algoritmos greedy',
    category: 'CPH - Tecnicas basicas',
    content: `## Problema de las monedas

Dado un valor objetivo y un conjunto de denominaciones, elegir siempre la
moneda mas grande posible ("coin problem" greedy) da el numero minimo de
monedas **solo** para sistemas "canonicos" (como 1, 5, 10, 25, o
denominaciones tipo $1, 2, 5, 10, \\ldots$). En sistemas arbitrarios (por
ejemplo $\\{1, 3, 4\\}$ para formar $6$: greedy da $4+1+1=3$ monedas, pero el
optimo es $3+3=2$) el greedy falla y hace falta programacion dinamica
(ver el tema de DP basica).

## Scheduling: maximizar actividades

Dado un conjunto de actividades con horario de inicio y fin, para
maximizar cuantas se pueden realizar sin solaparse conviene ordenar por
tiempo de **fin** ascendente y tomar greedy cada actividad compatible con
la ultima elegida. La demostracion usa un argumento de intercambio: si una
solucion optima no elige la actividad que termina primero, se puede
reemplazar sin perder actividades.

## Tareas y plazos

Para minimizar la suma de tiempos de finalizacion (sin plazos), conviene
procesar las tareas en orden de duracion ascendente ("shortest job
first"): las tareas cortas primero reducen el tiempo de espera acumulado
de todas las que vienen despues. Con plazos, el criterio greedy se
combina con una estructura (heap) para decidir que tarea descartar cuando
no caben todas.

## Minimizando sumas

Dado un conjunto de valores $a_i$ y un punto $p$ a elegir:

$$p = \\text{mediana}(a) \\implies \\text{minimiza} \\sum_i |a_i - p|$$
$$p = \\text{media}(a) \\implies \\text{minimiza} \\sum_i (a_i - p)^2$$

## Compresion de datos: codigos de Huffman

Construye, de forma greedy, un arbol binario optimo para codificar
simbolos segun su frecuencia, minimizando la longitud esperada del
mensaje codificado: con un min-heap, se combinan repetidamente los dos
nodos (simbolos o subarboles) de menor frecuencia en un nuevo nodo cuya
frecuencia es la suma, hasta que quede un solo arbol. Los simbolos mas
frecuentes terminan con codigos mas cortos.`,
    commonPitfalls:
      'Aplicar un greedy sin demostrar (con argumento de intercambio o de eleccion greedy) que realmente es optimo para ese problema especifico; muchos problemas parecen "greedy" pero requieren DP.',
  },
  {
    title: 'CPH: Programacion dinamica basica',
    category: 'CPH - Tecnicas basicas',
    content: `## Idea central

Un problema admite DP cuando tiene:

- **Subestructura optima**: la solucion optima se construye a partir de
  soluciones optimas de subproblemas mas pequenos.
- **Subproblemas superpuestos**: esos subproblemas se repiten muchas veces
  si se resolvieran con recursion simple.

DP resuelve cada subproblema **una sola vez**, guardando el resultado:
memoization (top-down, recursion + cache) o tabulacion (bottom-up,
llenando una tabla en orden de dependencias).

## Coin problem (numero minimo de monedas)

$$dp[x] = \\min_{c \\in \\text{monedas},\\ c \\le x} \\big(dp[x - c] + 1\\big), \\qquad dp[0] = 0$$

Complejidad $O(x \\cdot \\text{monedas})$.

## Longest Increasing Subsequence (LIS)

Version $O(n^2)$: $dp[i]$ = longitud de la subsecuencia creciente mas
larga que termina en $i$:

$$dp[i] = 1 + \\max_{j < i,\\ a_j < a_i} dp[j]$$

Version $O(n \\log n)$: se mantiene un arreglo \\\`tails\\\` donde
\\\`tails[k]\\\` es el menor valor final posible de una subsecuencia
creciente de longitud $k+1$; para cada elemento se busca (busqueda
binaria) su posicion en \\\`tails\\\` y se reemplaza, aprovechando que
\\\`tails\\\` siempre queda ordenado.

## Caminos en una grilla

Contar o optimizar caminos con movimientos restringidos (por ejemplo solo
derecha/abajo): $dp[i][j] = dp[i-1][j] + dp[i][j-1]$ (conteo) o
$dp[i][j] = a[i][j] + \\min(dp[i-1][j], dp[i][j-1])$ (costo minimo).

## Knapsack 0/1

$$dp[i][c] = \\max\\big(dp[i-1][c],\\ dp[i-1][c - w_i] + v_i\\big)$$

Estado = mejor valor usando los primeros $i$ items con capacidad $c$;
complejidad $O(\\text{items} \\times \\text{capacidad})$. Se puede comprimir a
un arreglo 1D recorriendo la capacidad en orden **descendente** para no
reusar un item dos veces.

## Distancia de edicion (Levenshtein)

Minimo de inserciones, borrados y sustituciones para transformar un
string en otro:

$$dp[i][j] = \\begin{cases} dp[i-1][j-1] & \\text{si } s_i = t_j \\\\ 1 + \\min(dp[i-1][j],\\ dp[i][j-1],\\ dp[i-1][j-1]) & \\text{si } s_i \\neq t_j \\end{cases}$$

Complejidad $O(n \\cdot m)$.

## Conteo de tilings

Cubrir una grilla con piezas (por ejemplo fichas de domino de $1 \\times 2$)
usando DP por columnas, donde el estado es un bitmask que representa el
"perfil" (que celdas de la columna actual ya quedaron cubiertas por una
pieza de la columna anterior).`,
    commonPitfalls:
      'Definir mal el estado (falta informacion para decidir la transicion, o sobra y hace la tabla inmanejablemente grande). Recalcular subproblemas sin memoizar, perdiendo toda la ventaja de la DP. Overflow al sumar/multiplicar en dp[] con enteros de 32 bits.',
  },
  {
    title: 'CPH: Analisis amortizado',
    category: 'CPH - Tecnicas basicas',
    content: `## Idea general

Una operacion puede parecer costosa vista de forma aislada, pero si se
demuestra que el costo **total** de $n$ operaciones consecutivas es
$O(n)$, el costo amortizado por operacion es $O(1)$, aunque alguna
operacion individual cueste mas. La tecnica tipica de demostracion es un
argumento de "potencial" o simplemente contar cuantas veces, en total,
puede ocurrir el trabajo costoso.

## Two pointers

En un arreglo (usualmente ordenado), dos indices $i$ y $j$ se mueven
siempre **hacia adelante** (nunca retroceden). Como cada uno recorre el
arreglo a lo sumo una vez, el trabajo total es $O(n)$ en vez de $O(n^2)$
al probar todos los pares:

\\\`\\\`\\\`cpp
int i = 0, j = (int)a.size() - 1;
while (i < j) {
    long long suma = a[i] + a[j];
    if (suma == objetivo) { /* encontrado */ break; }
    if (suma < objetivo) i++; else j--;
}
\\\`\\\`\\\`

## Nearest smaller elements

Con una **pila monotona** creciente se encuentra, para cada elemento, el
elemento menor mas cercano a la izquierda (o derecha) en $O(n)$ total:
cada elemento se agrega y se elimina de la pila a lo sumo una vez, aunque
el bucle interno de "sacar mientras el tope sea mayor" pueda parecer
$O(n)$ por iteracion.

## Sliding window minimum

Con un **deque monotono** se mantiene el minimo de una ventana deslizante
de tamano $k$ en $O(n)$ total: antes de insertar un nuevo elemento se
descartan del final del deque todos los elementos mayores a el (ya nunca
podran ser el minimo mientras el nuevo elemento siga en la ventana), y del
frente se descartan los indices que ya salieron de la ventana. Cada
elemento entra y sale del deque una sola vez.`,
  },
  {
    title: 'CPH: Consultas de rango',
    category: 'CPH - Tecnicas basicas',
    content: `## Consultas sobre arreglos estaticos: sparse table

Si el arreglo no cambia, una sparse table responde consultas de
minimo/maximo de rango (RMQ) en $O(1)$ tras un preprocesamiento
$O(n \\log n)$. Se precomputa \\\`st[k][i]\\\` = minimo del rango
$[i, i + 2^k - 1]$:

$$st[k][i] = \\min\\big(st[k-1][i],\\ st[k-1][i + 2^{k-1}]\\big)$$

Una consulta $[l, r]$ se responde combinando dos rangos de potencia de 2
que se solapan (valido porque $\\min$ es idempotente, a diferencia de la
suma): con $k = \\lfloor \\log_2(r - l + 1) \\rfloor$,

$$\\text{query}(l, r) = \\min\\big(st[k][l],\\ st[k][r - 2^k + 1]\\big)$$

## Binary Indexed Tree (Fenwick Tree)

Estructura compacta para sumas de prefijos: actualizar un punto y
consultar la suma de un prefijo cuestan $O(\\log n)$ cada uno, usando el
truco $\\text{lowbit}(i) = i \\mathbin{\\&} (-i)$ para saltar entre los
indices "responsables" de un rango de tamano potencia de 2.

## Segment tree

Generaliza a cualquier operacion asociativa (suma, min, max, gcd,
xor...): consulta y actualizacion de rango en $O(\\log n)$, con $O(4n)$ de
espacio en la implementacion clasica con arreglo. Cada nodo representa un
rango $[l, r]$; la raiz cubre todo el arreglo y cada hijo cubre la mitad
izquierda o derecha de su padre, formando un arbol de altura
$O(\\log n)$.

## Tecnicas adicionales

El capitulo introduce brevemente **lazy propagation** para actualizaciones
de rango (no solo puntuales): en vez de propagar el cambio a los hijos de
inmediato, se guarda una marca pendiente y se empuja hacia abajo solo
cuando hace falta visitar un hijo. El detalle completo se retoma en
"Segment trees revisited".`,
    commonPitfalls:
      'Construir una sparse table para operaciones no idempotentes (como suma) esperando O(1) por consulta: solo funciona para min/max/gcd/and/or. Olvidar que una sparse table no soporta actualizaciones tras el preprocesamiento.',
  },
  {
    title: 'CPH: Manipulacion de bits',
    category: 'CPH - Tecnicas basicas',
    content: `## Representacion

Los enteros con signo se guardan en **complemento a dos**; un \\\`int\\\` de
32 bits cubre aproximadamente $[-2^{31}, 2^{31} - 1]$. En complemento a
dos, el bit mas significativo indica el signo y $-x$ se calcula como
$\\sim x + 1$.

## Operaciones bitwise

$\\&$ (AND), $|$ (OR), $\\oplus$ (XOR), $\\sim$ (NOT), $\\ll$/$\\gg$ (shifts). El
XOR es especialmente util porque es su propio inverso:

$$a \\oplus b \\oplus b = a \\qquad a \\oplus a = 0 \\qquad a \\oplus 0 = a$$

## Representar conjuntos con bitmask

Un entero de $n$ bits representa un subconjunto de $\\{0, \\ldots, n-1\\}$:

\\\`\\\`\\\`cpp
mask | (1 << i)   // agregar i
mask & ~(1 << i)  // quitar i
mask & (1 << i)   // verificar pertenencia (!= 0 si esta)
mask ^ (1 << i)   // alternar i
\\\`\\\`\\\`

Esta representacion habilita DP sobre bitmask, donde el estado codifica
un subconjunto completo en un solo entero.

## Optimizaciones a nivel de bits

\\\`__builtin_popcount(x)\\\` cuenta bits en 1 en $O(1)$ (a nivel de
hardware), \\\`__builtin_ctz(x)\\\` cuenta ceros al final (util para
recorrer los bits en 1 de una mascara sin iterar bit por bit), y
\\\`x & (x-1)\\\` apaga el bit menos significativo en 1 de $x$.

## Programacion dinamica sobre bitmask

Ejemplo clasico: el problema del vendedor viajante (TSP). Estado
$dp[mask][i]$ = costo minimo para visitar exactamente el conjunto de
ciudades \\\`mask\\\` terminando en la ciudad $i$:

$$dp[mask][i] = \\min_{j \\in mask,\\ j \\neq i} \\big(dp[mask \\setminus \\{i\\}][j] + costo(j, i)\\big)$$

Complejidad $O(2^n \\cdot n^2)$, viable para $n$ hasta aproximadamente
$18$–$20$.`,
  },
  {
    title: 'CPH: Fundamentos y recorrido de grafos',
    category: 'CPH - Algoritmos de grafos',
    content: `## Terminologia

Un grafo $G = (V, E)$ consiste en nodos ($V$) y aristas ($E$). Puede ser
**dirigido** (las aristas tienen sentido) o **no dirigido**, y
**ponderado** (aristas con peso/costo) o no. Un camino es una secuencia de
nodos conectados por aristas; un ciclo es un camino que vuelve al nodo
inicial sin repetir aristas intermedias. El **grado** de un nodo es su
numero de aristas incidentes (en grafos dirigidos se distingue grado de
entrada y de salida).

## Representacion

- **Matriz de adyacencia**: \\\`adj[u][v]\\\` indica si existe (o el peso de)
  la arista $u \\to v$. Espacio $O(V^2)$, verificar una arista especifica
  $O(1)$. Conviene con grafos densos ($E$ cercano a $V^2$) o $V$ pequeno
  (hasta unos pocos miles).
- **Lista de adyacencia**: cada nodo guarda un vector con sus vecinos.
  Espacio $O(V + E)$, recorrer los vecinos de un nodo cuesta proporcional
  a su grado. Es la representacion por defecto en la mayoria de los
  problemas, especialmente con grafos dispersos.

## DFS (Depth-First Search)

Explora tan profundo como sea posible antes de retroceder, usando
recursion (o una pila explicita). Complejidad $O(V + E)$. Util para
detectar ciclos, encontrar componentes conexas, calcular ordenamiento
topologico y como base de algoritmos mas avanzados (puntos de
articulacion, SCC).

## BFS (Breadth-First Search)

Explora por niveles usando una cola: primero todos los nodos a distancia
1, luego a distancia 2, etc. Complejidad $O(V + E)$. En grafos **no
ponderados** encuentra la distancia minima en numero de aristas desde el
nodo origen a todos los demas.

## Aplicaciones

- **Componentes conexas**: correr DFS/BFS desde cada nodo no visitado;
  cada corrida marca una componente completa.
- **Verificar si un grafo es bipartito**: 2-coloreo durante el recorrido,
  alternando color entre nodos adyacentes; si dos nodos adyacentes
  terminan con el mismo color, no es bipartito.
- **Detectar ciclos**: en grafos no dirigidos, encontrar una arista hacia
  un nodo ya visitado que no sea el padre inmediato; en dirigidos, ver el
  tema de grafos dirigidos y DP en DAG.`,
  },
  {
    title: 'CPH: Caminos minimos',
    category: 'CPH - Algoritmos de grafos',
    content: `## Bellman-Ford

Relaja **todas** las aristas $V - 1$ veces: $O(V \\cdot E)$. La relajacion
de una arista $(u, v, w)$ actualiza $dist[v] = \\min(dist[v], dist[u] + w)$
si mejora. Tras $V - 1$ iteraciones, todos los caminos minimos (sin ciclos
negativos alcanzables) quedan calculados, porque el camino mas largo
posible sin repetir nodos tiene a lo sumo $V - 1$ aristas. Soporta pesos
**negativos**, y permite detectar ciclos negativos: si en una iteracion
extra ($V$-esima) alguna arista se sigue pudiendo relajar, existe un ciclo
negativo alcanzable desde el origen.

## Dijkstra

Para grafos sin pesos negativos, con una cola de prioridad corre en
$O((V + E) \\log V)$: siempre procesa a continuacion el nodo no
finalizado con menor distancia tentativa, garantia que falla si hay pesos
negativos (un camino "peor" en apariencia podria mejorar despues).

\\\`\\\`\\\`cpp
vector<long long> dist(n, LLONG_MAX);
priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
dist[src] = 0;
pq.push({0, src});
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

Todos los pares de caminos minimos en $O(V^3)$, iterando sobre cada nodo
intermedio $k$ de $1$ a $V$:

$$dist[i][j] = \\min\\big(dist[i][j],\\ dist[i][k] + dist[k][j]\\big)$$

La clave es el **orden** de los bucles: $k$ debe ser el bucle mas externo,
porque $dist[i][k]$ y $dist[k][j]$ deben estar ya optimizados considerando
solo nodos intermedios $\\le k$ antes de usarlos para actualizar
$dist[i][j]$. Ideal cuando $V$ es pequeno (hasta unos cientos), ya que
$O(V^3)$ crece rapido.`,
    commonPitfalls:
      'Usar Dijkstra con pesos negativos (da resultados incorrectos sin avisar). Olvidar el chequeo "if (d > dist[u]) continue" antes de procesar un nodo sacado de la cola, procesando entradas obsoletas. Invertir el orden de los bucles de Floyd-Warshall (el de k debe ser el mas externo).',
  },
  {
    title: 'CPH: Algoritmos en arboles',
    category: 'CPH - Algoritmos de grafos',
    content: `## Recorrido de arboles

Un arbol es un grafo conexo, sin ciclos, con $n$ nodos y exactamente
$n - 1$ aristas. Al recorrerlo con DFS/BFS conviene llevar el nodo padre
como parametro para no retroceder por la misma arista hacia arriba
(evitando confundir la arista al padre con un ciclo).

## Diametro

El camino mas largo entre dos nodos cualesquiera del arbol se encuentra
con **dos** recorridos (DFS o BFS), gracias a una propiedad especifica de
los arboles: desde un nodo arbitrario $x$ se halla el nodo mas lejano
$a$; desde $a$ se halla el nodo mas lejano $b$; la distancia $a$–$b$ es el
diametro. Esto solo funciona porque el grafo no tiene ciclos (en un grafo
general no se puede garantizar); el costo total es $O(n)$ en vez de
$O(n^2)$ probando todos los pares.

## Todos los caminos mas largos (rerooting)

Para calcular, **desde cada nodo**, la distancia al nodo mas lejano de
todo el arbol, se usan dos pasadas de DP en arbol:

1. Una pasada hacia las hojas calcula, para cada nodo, la distancia
   maxima dentro de su propio subarbol.
2. Una segunda pasada, de la raiz hacia abajo, propaga informacion del
   padre (la mejor distancia que pasa "por fuera" del subarbol del nodo)
   combinandola con lo ya calculado.

Esto evita recalcular desde cada nodo por separado (que seria $O(n^2)$),
logrando $O(n)$ total.

## Arboles binarios

Un arbol binario **completo** (o casi completo) se puede representar sin
punteros usando indices en un arreglo: el hijo izquierdo del nodo $i$ es
$2i$, el derecho $2i+1$ (indexado desde 1), y el padre de $i$ es
$\\lfloor i/2 \\rfloor$. Es la misma idea que usan los heaps binarios y la
implementacion clasica de un segment tree con arreglo.`,
  },
  {
    title: 'CPH: Arboles de expansion minima',
    category: 'CPH - Algoritmos de grafos',
    content: `## Kruskal

Ordena todas las aristas por peso ascendente y las agrega greedy si sus
dos extremos no estan ya en el mismo componente (verificado con
Union-Find), evitando formar ciclos: $O(E \\log E)$, dominado por el
ordenamiento. La correctitud se apoya en la **propiedad de corte**: la
arista mas barata que cruza cualquier corte del grafo pertenece a algun
MST.

## Union-Find (Disjoint Set Union)

Cada conjunto se representa como un arbol implicito donde cada nodo
apunta a su padre; \\\`find(x)\\\` sigue punteros hasta la raiz,
\\\`union(x, y)\\\` conecta las raices de los conjuntos de $x$ e $y$. Dos
optimizaciones son clave:

- **Compresion de camino**: al hacer \\\`find\\\`, cada nodo visitado pasa a
  apuntar directamente a la raiz, aplanando el arbol para futuras
  consultas.
- **Union por rango/tamano**: al unir dos conjuntos, se cuelga el arbol
  mas chico (o de menor "rango" estimado) del mas grande, evitando arboles
  muy profundos.

Con ambas optimizaciones, cada operacion cuesta $O(\\alpha(n))$ amortizado
(inversa de la funcion de Ackermann), practicamente $O(1)$ para cualquier
$n$ realista ($\\alpha(n) \\le 4$ para $n$ menor que el numero de atomos en
el universo observable).

## Prim

Crece el arbol de expansion desde un nodo inicial agregando siempre la
arista mas barata que conecta un nodo ya incluido con uno que no lo esta;
con una cola de prioridad corre en $O(E \\log V)$, en espiritu identico a
Dijkstra pero comparando el peso de la arista en vez de la distancia
acumulada desde el origen. Con matriz de adyacencia (sin heap), una
version $O(V^2)$ conviene en grafos densos.`,
    commonPitfalls:
      'Olvidar compresion de camino o union por rango en Union-Find (degradando las operaciones a O(n) en el peor caso). Confundir Prim (crece un solo arbol) con Dijkstra (compara distancias acumuladas, no pesos de arista individuales).',
  },
  {
    title: 'CPH: Grafos dirigidos y DP en DAG',
    category: 'CPH - Algoritmos de grafos',
    content: `## Ordenamiento topologico

Un orden lineal de los nodos tal que toda arista $u \\to v$ tiene $u$
antes que $v$. Solo existe si el grafo es un **DAG** (dirigido y
aciclico). Dos formas de calcularlo, ambas $O(V + E)$:

- **DFS**: agregar cada nodo a una lista al **terminar** de procesarlo
  (post-orden), e invertir la lista al final.
- **Algoritmo de Kahn**: procesar iterativamente (con una cola) los nodos
  cuyo grado de entrada actual es 0, decrementando el grado de entrada de
  sus vecinos al procesarlos.

## Programacion dinamica sobre un DAG

Una vez obtenido el orden topologico, se puede calcular el camino mas
largo/corto, o el numero de caminos entre dos nodos, procesando los nodos
en ese orden: cada nodo ya tiene resueltos todos sus predecesores cuando
le toca procesarse, sin necesidad de recursion con memoization.

## Caminos de sucesor (binary lifting)

Para responder "¿a que nodo se llega tras $k$ pasos siguiendo sucesores
(funcion determinista de un solo sucesor por nodo)?" en $O(\\log k)$ en
vez de $O(k)$: se precomputa $up[j][v]$ = nodo al que se llega desde $v$
tras $2^j$ pasos, con la recurrencia

$$up[j][v] = up[j-1]\\big[up[j-1][v]\\big]$$

y se combina descomponiendo $k$ en binario, aplicando los saltos
correspondientes a cada bit en 1.

## Deteccion de ciclos

Durante un DFS, marcar cada nodo con tres estados: **blanco** (no
visitado), **gris** (en la pila de recursion actual) y **negro**
(terminado). Si se encuentra una arista hacia un nodo **gris**, hay un
ciclo (arista de retroceso); una arista hacia un nodo negro no indica
ciclo (puede ser una arista de avance o cruzada).`,
  },
  {
    title: 'CPH: Conectividad fuerte y 2-SAT',
    category: 'CPH - Algoritmos de grafos',
    content: `## Componentes fuertemente conexas (SCC)

En un grafo dirigido, una componente fuertemente conexa es un subconjunto
maximal de nodos donde **todo par** es mutuamente alcanzable (existe
camino de $u$ a $v$ y de $v$ a $u$). El algoritmo de **Kosaraju** las
encuentra en $O(V + E)$ en dos pasadas de DFS:

1. DFS en el grafo original, guardando cada nodo en una pila al terminar
   de procesarlo (post-orden), igual que para orden topologico.
2. DFS en el grafo **transpuesto** ($G^T$, con todas las aristas
   invertidas), procesando los nodos en el orden en que salen de la pila
   (orden inverso de finalizacion del primer DFS). Cada arbol generado por
   este segundo DFS es exactamente una SCC.

Contrayendo cada SCC a un solo nodo se obtiene un DAG ("grafo de
condensacion"), util para resolver problemas sobre el grafo original
aplicando tecnicas de DAG.

## 2-SAT

Problema de decidir si una formula booleana en forma normal conjuntiva con
**dos literales por clausula** —$(x_1 \\lor y_1) \\land (x_2 \\lor y_2)
\\land \\cdots$— es satisfacible. Se modela como un **grafo de
implicaciones**: cada clausula $(a \\lor b)$ aporta dos implicaciones
logicamente equivalentes,

$$\\lnot a \\to b \\qquad \\lnot b \\to a$$

(si $a$ es falsa, $b$ debe ser verdadera, y viceversa). La formula es
satisfacible si y solo si **ninguna** variable $x$ cae en la misma SCC que
su negacion $\\lnot x$. Cuando es satisfacible, la asignacion se obtiene
directamente del orden topologico del grafo de condensacion: $x$ es
verdadera si su SCC aparece **despues** que la de $\\lnot x$ en ese orden.`,
    commonPitfalls:
      'Construir mal las implicaciones de 2-SAT (falta agregar ambas direcciones de cada clausula). Olvidar que Kosaraju necesita el grafo transpuesto explicito en la segunda pasada.',
  },
  {
    title: 'CPH: Consultas en arboles y LCA',
    category: 'CPH - Algoritmos de grafos',
    content: `## Encontrar ancestros (binary lifting)

Precomputando $up[j][v]$ = ancestro de $v$ a $2^j$ niveles de distancia
(analogo al binary lifting de caminos de sucesor), con
$up[j][v] = up[j-1][up[j-1][v]]$, se responde "el $k$-esimo ancestro de
$v$" en $O(\\log n)$ descomponiendo $k$ en binario, en vez de $O(k)$
subiendo de a un nivel.

## Subarboles y caminos (Euler tour)

Asignando a cada nodo un tiempo de entrada \\\`tin[v]\\\` y de salida
\\\`tout[v]\\\` durante un DFS, el subarbol de un nodo $v$ corresponde
**exactamente** al rango contiguo de tiempos $[tin[v], tout[v]]$. Esto
convierte consultas sobre subarboles (suma de valores, actualizacion de
todo un subarbol) en consultas de rango sobre ese arreglo de tiempos,
resolubles con un Fenwick tree o segment tree en $O(\\log n)$.

## Lowest Common Ancestor (LCA)

El ancestro comun mas profundo de dos nodos $u$ y $v$. Dos enfoques
principales:

1. **Binary lifting**: subir el nodo mas profundo hasta igualar la
   profundidad del otro, y luego subir ambos simultaneamente en potencias
   de 2 decrecientes hasta que sus ancestros coincidan. $O(\\log n)$ por
   consulta tras $O(n \\log n)$ de preprocesamiento.
2. **Reduccion a RMQ sobre el recorrido de Euler**: aplanando el arbol en
   un arreglo de profundidades durante un recorrido de Euler (que visita
   cada arista dos veces), el LCA de $u$ y $v$ corresponde al nodo de
   **menor profundidad** entre las dos primeras apariciones de $u$ y $v$
   en ese arreglo. Con una sparse table sobre ese arreglo, cada consulta
   es $O(1)$ tras $O(n \\log n)$ de preprocesamiento.

## Algoritmos offline

El algoritmo de **Tarjan para LCA offline** resuelve **todas** las
consultas conocidas de antemano en una sola pasada de DFS usando
Union-Find: al terminar de procesar un nodo, se une con su padre, y al
visitar un nodo se responden las consultas pendientes que lo involucran
buscando la raiz actual del otro nodo de la consulta (que sera su LCA).`,
  },
  {
    title: 'CPH: Caminos y circuitos',
    category: 'CPH - Algoritmos de grafos',
    content: `## Caminos y circuitos Eulerianos

Visitan **cada arista** exactamente una vez (los nodos pueden repetirse).

- **Grafo no dirigido**: tiene un circuito Euleriano (empieza y termina en
  el mismo nodo) si y solo si es conexo y **todos** los nodos tienen grado
  par. Tiene un camino Euleriano (no necesariamente cerrado) si tiene
  exactamente 0 o 2 nodos de grado impar.
- **Grafo dirigido**: circuito Euleriano si y solo si cada nodo tiene
  grado de entrada igual a grado de salida y el grafo es conexo
  (ignorando direccion).

Se construyen con el **algoritmo de Hierholzer** en $O(E)$: se sigue un
camino hasta atascarse (volver a un nodo sin aristas no usadas), y se
"inserta" ese circuito parcial en el punto correcto de un circuito mas
grande, repitiendo hasta usar todas las aristas.

## Caminos y ciclos Hamiltonianos

Visitan **cada nodo** exactamente una vez. A diferencia del caso
Euleriano, no existe una condicion simple de verificar: decidir si
existen es **NP-completo** en general. Para $n$ pequeno (hasta
aproximadamente 20) se resuelve con DP sobre bitmask —el problema del
vendedor viajante (TSP)— en $O(2^n \\cdot n^2)$.

## Secuencias de De Bruijn

Una secuencia ciclica de longitud $k^n$ (alfabeto de tamano $k$) que
contiene, como subcadena, cada combinacion posible de $n$ simbolos
exactamente una vez. Se construye encontrando un **circuito Euleriano** en
un grafo cuyos nodos son las secuencias de largo $n-1$ y cuyas aristas
representan agregar un simbolo.

## Recorridos de caballo

Encontrar un camino Hamiltoniano de un caballo de ajedrez que visite cada
casilla del tablero exactamente una vez. En la practica se resuelve con
backtracking guiado por la **heuristica de Warnsdorff**: en cada paso,
moverse hacia la casilla accesible con **menos** opciones futuras
disponibles, lo que en la practica evita quedar atrapado sin necesidad de
explorar todo el espacio de busqueda.`,
  },
  {
    title: 'CPH: Flujos y cortes',
    category: 'CPH - Algoritmos de grafos',
    content: `## Ford-Fulkerson y Edmonds-Karp

Encuentra el flujo maximo entre una fuente $s$ y un sumidero $t$ buscando
repetidamente **caminos de aumento** (caminos de $s$ a $t$ con capacidad
residual disponible en cada arista) y enviando flujo igual a la capacidad
minima del camino, actualizando las capacidades residuales (incluida la
arista inversa, que permite "deshacer" flujo enviado). Se repite hasta que
no queden caminos de aumento. Con BFS para elegir siempre el camino mas
corto en numero de aristas (variante **Edmonds-Karp**), la complejidad es
$O(V \\cdot E^2)$, independiente de los valores de capacidad.

## Flujo maximo = corte minimo

Teorema fundamental (max-flow min-cut): el valor del flujo maximo es
**igual** a la capacidad del corte minimo, es decir, la particion de los
nodos en dos conjuntos $S$ (con $s$) y $T$ (con $t$) que minimiza la suma
de capacidades de las aristas que van de $S$ a $T$. Cuando Ford-Fulkerson
termina, el conjunto de nodos alcanzables desde $s$ por aristas con
capacidad residual positiva define exactamente ese corte minimo.

## Caminos disjuntos

El numero maximo de caminos disjuntos en **aristas** (o en nodos, con un
truco de "desdoblar" cada nodo en dos conectados por una arista de
capacidad 1) entre dos nodos es un caso particular de flujo maximo con
todas las capacidades igual a 1.

## Emparejamientos maximos y cobertura de caminos

El emparejamiento maximo en un grafo **bipartito** se reduce a flujo
maximo: se agrega una fuente conectada a todos los nodos de un lado y un
sumidero conectado a todos los del otro, con capacidad 1 en todas las
aristas (incluidas las del bipartito original). La **cobertura de
caminos** minima en un DAG (numero minimo de caminos que cubren todos los
nodos) tambien se resuelve modelandola como un emparejamiento bipartito
entre dos copias de los nodos.`,
    commonPitfalls:
      'Olvidar modelar las aristas residuales inversas al implementar Ford-Fulkerson/Edmonds-Karp (sin ellas el algoritmo no puede "deshacer" una decision de flujo subóptima). Usar DFS simple para elegir el camino de aumento sin cota de complejidad garantizada en vez de BFS (Edmonds-Karp).',
  },
  {
    title: 'CPH: Teoria de numeros',
    category: 'CPH - Temas avanzados',
    content: `## Primos y factores

La **criba de Eratostenes** marca todos los numeros primos hasta $n$ en
$O(n \\log \\log n)$: por cada primo encontrado, marca todos sus multiplos
como compuestos. Para factorizar un numero **individual** basta probar
divisores hasta su raiz cuadrada: $O(\\sqrt{n})$, porque si $n = a \\cdot b$
con $a \\le b$, entonces necesariamente $a \\le \\sqrt{n}$.

## Aritmetica modular

Las operaciones de suma, resta y multiplicacion son compatibles con el
modulo:

$$(a + b) \\bmod p = \\big((a \\bmod p) + (b \\bmod p)\\big) \\bmod p$$
$$(a \\times b) \\bmod p = \\big((a \\bmod p) \\times (b \\bmod p)\\big) \\bmod p$$

La **exponenciacion rapida** calcula $a^b \\bmod p$ en $O(\\log b)$ elevando
al cuadrado repetidamente segun los bits de $b$:

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

El **inverso modular** (para "dividir" bajo modulo) se obtiene, si $p$ es
primo, con el pequeno teorema de Fermat:

$$a^{-1} \\equiv a^{p-2} \\pmod{p}$$

o, si el modulo no es primo pero $\\gcd(a, m) = 1$, con el **algoritmo
extendido de Euclides**, que ademas resuelve
$ax + by = \\gcd(a, b)$ en $O(\\log \\min(a,b))$.

## Resolver ecuaciones

Las **ecuaciones diofanticas lineales** ($ax + by = c$) tienen solucion
entera si y solo si $\\gcd(a, b)$ divide a $c$; se resuelven con el
algoritmo extendido de Euclides. El **teorema chino del residuo** combina
un sistema de congruencias con modulos coprimos ($x \\equiv a_i \\pmod{m_i}$)
en una unica congruencia equivalente modulo $\\prod m_i$.

## Otros resultados

La **funcion $\\phi$ de Euler**, $\\phi(n)$, cuenta los enteros en
$[1, n]$ coprimos con $n$; se calcula a partir de la factorizacion de
$n = p_1^{e_1} \\cdots p_k^{e_k}$ como

$$\\phi(n) = n \\prod_{i=1}^{k} \\left(1 - \\frac{1}{p_i}\\right)$$

El **teorema de Euler** generaliza a Fermat para modulos no primos:
$a^{\\phi(m)} \\equiv 1 \\pmod{m}$ si $\\gcd(a, m) = 1$.`,
    commonPitfalls:
      'Overflow al multiplicar dos numeros grandes antes de aplicar el modulo (usar long long o __int128 segun el rango). Calcular el inverso modular con la formula de Fermat cuando el modulo no es primo (hace falta Euclides extendido en ese caso). Olvidar reducir la base modulo p antes de exponenciar.',
  },
  {
    title: 'CPH: Combinatoria',
    category: 'CPH - Temas avanzados',
    content: `## Coeficientes binomiales

$\\binom{n}{k}$ cuenta subconjuntos de tamano $k$ de un conjunto de $n$
elementos:

$$\\binom{n}{k} = \\frac{n!}{k! \\, (n-k)!} = \\binom{n-1}{k-1} + \\binom{n-1}{k}$$

Esta segunda forma (recurrencia del **triangulo de Pascal**) permite
calcular toda la tabla en $O(n^2)$ sin factoriales ni inversos. Bajo
modulo primo, se calculan factoriales e inversos modulares precomputados
para obtener $\\binom{n}{k} \\bmod p$ en $O(1)$ por consulta tras
$O(n \\log p)$ de preprocesamiento.

## Numeros de Catalan

Cuentan estructuras "balanceadas": secuencias validas de $n$ pares de
parentesis, arboles binarios distintos con $n$ nodos, formas de
triangular un poligono convexo de $n+2$ lados, caminos en una grilla que
no cruzan la diagonal, etc.

$$C_n = \\frac{1}{n+1}\\binom{2n}{n} = \\binom{2n}{n} - \\binom{2n}{n+1}$$

con $C_0 = 1, C_1 = 1, C_2 = 2, C_3 = 5, C_4 = 14, \\ldots$

## Inclusion-exclusion

Para contar $|A_1 \\cup A_2 \\cup \\cdots \\cup A_n|$ sin contar de mas:

$$\\left|\\bigcup_i A_i\\right| = \\sum_i |A_i| - \\sum_{i<j} |A_i \\cap A_j| + \\sum_{i<j<k} |A_i \\cap A_j \\cap A_k| - \\cdots$$

es decir, se suman los conjuntos individuales, se restan las
intersecciones de a pares, se suman las de a tres, alternando el signo.

## Lema de Burnside

Cuenta configuraciones **distintas** bajo simetrias de un grupo $G$
(rotaciones, reflexiones): el numero de clases de equivalencia es

$$\\frac{1}{|G|} \\sum_{g \\in G} |\\text{Fix}(g)|$$

el promedio, sobre todas las simetrias del grupo, del numero de
configuraciones que cada simetria deja fijas.

## Formula de Cayley

El numero de arboles etiquetados distintos con $n$ nodos es
$n^{n-2}$.`,
  },
  {
    title: 'CPH: Matrices',
    category: 'CPH - Temas avanzados',
    content: `## Operaciones

Suma de matrices en $O(n^2)$; multiplicacion de matrices $n \\times n$ en
$O(n^3)$ con el algoritmo clasico (para cada celda del resultado, sumar
$n$ productos).

## Recurrencias lineales

Una recurrencia lineal de orden $k$ (como Fibonacci, $f_n = f_{n-1} +
f_{n-2}$) se puede expresar como multiplicacion por una matriz de
transicion fija. Para Fibonacci:

$$\\begin{pmatrix} f_{n+1} \\\\ f_n \\end{pmatrix} = \\begin{pmatrix} 1 & 1 \\\\ 1 & 0 \\end{pmatrix} \\begin{pmatrix} f_n \\\\ f_{n-1} \\end{pmatrix}$$

Elevando la matriz de transicion a la potencia $n$ con **exponenciacion
rapida de matrices**, se calcula el $n$-esimo termino en
$O(k^3 \\log n)$ en vez de $O(n)$ iterando termino a termino, crucial
cuando $n$ es del orden de $10^{18}$.

## Grafos y matrices

La matriz de adyacencia $A$ elevada a la potencia $k$ da, en la posicion
$(i, j)$ de $A^k$, el **numero de caminos** de longitud exactamente $k$
entre $i$ y $j$ (sumando sobre todos los nodos intermedios posibles, igual
que la multiplicacion de matrices). Esto permite contar caminos de
longitud fija (o resolver recurrencias sobre grafos de estados) con
exponenciacion rapida de matrices en $O(V^3 \\log k)$.`,
  },
  {
    title: 'CPH: Probabilidad',
    category: 'CPH - Temas avanzados',
    content: `## Calculo basico y eventos

$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$. Eventos **independientes**
cumplen $P(A \\cap B) = P(A) \\cdot P(B)$; para eventos **dependientes** se
usa probabilidad condicional: $P(A \\mid B) = \\dfrac{P(A \\cap B)}{P(B)}$.

## Variables aleatorias y linealidad de la esperanza

El valor esperado de una variable aleatoria discreta es
$E[X] = \\sum_x x \\cdot P(X = x)$. La propiedad mas util en programacion
competitiva es la **linealidad de la esperanza**:

$$E[X + Y] = E[X] + E[Y]$$

y esto vale **incluso si $X$ e $Y$ no son independientes**. Esta
propiedad simplifica enormemente problemas de conteo esperado: en vez de
analizar la distribucion conjunta completa, se descompone el evento en
indicadores simples y se suman sus esperanzas individuales.

## Cadenas de Markov

Procesos donde la distribucion del siguiente estado depende **solo** del
estado actual (no del historial completo). Se modelan con una matriz de
transicion $P$ donde $P_{ij}$ es la probabilidad de pasar del estado $i$
al $j$; la distribucion tras $k$ pasos se obtiene multiplicando el vector
de distribucion inicial por $P^k$ (reutilizando exponenciacion rapida de
matrices).

## Algoritmos aleatorizados

Usan aleatoriedad para simplificar o acelerar un algoritmo: hashing con
una semilla aleatoria (evita que un adversario fuerce colisiones en un
juez online), o el pivote aleatorio de **quickselect**, que da $O(n)$
esperado para encontrar el $k$-esimo elemento en vez del $O(n^2)$ del peor
caso con un pivote fijo.`,
  },
  {
    title: 'CPH: Teoria de juegos',
    category: 'CPH - Temas avanzados',
    content: `## Estados de juego

Un juego combinatorio se modela como un grafo de estados donde, en su
turno, un jugador mueve a otro estado. Un estado es **ganador** (para
quien esta por mover) si existe al menos un movimiento hacia un estado
**perdedor** para el rival; es perdedor si todos sus movimientos llevan a
estados ganadores para el rival (o si no hay movimientos posibles, en la
convencion normal de juego).

## Juego de Nim

Varios montones de piedras; en cada turno un jugador quita una o mas
piedras de un **solo** monton. Teorema de Nim: la posicion es perdedora
(para quien esta por mover) si y solo si el XOR de los tamanos de todos
los montones es 0:

$$a_1 \\oplus a_2 \\oplus \\cdots \\oplus a_k = 0 \\implies \\text{posicion perdedora}$$

Si el XOR no es 0, siempre existe un movimiento que lo lleva a 0
(reduciendo el monton cuyo bit mas significativo coincide con el bit mas
significativo del XOR total).

## Teorema de Sprague-Grundy

Generaliza Nim a **cualquier** juego imparcial (donde ambos jugadores
tienen los mismos movimientos disponibles desde cada estado). A cada
estado $s$ se le asigna un valor de Grundy:

$$g(s) = \\text{mex}\\big(\\{g(s') : s' \\text{ es sucesor de } s\\}\\big)$$

donde $\\text{mex}$ (*minimum excludant*) es el menor entero no negativo
que **no** aparece en el conjunto. Un estado es perdedor si y solo si su
valor de Grundy es 0. Para un juego **compuesto** por varios subjuegos
independientes que se juegan simultaneamente (el jugador elige en cual
mover en su turno), el valor de Grundy del juego compuesto es el XOR de
los valores de Grundy de cada subjuego —lo que reduce exactamente el
analisis al de Nim clasico.`,
  },
  {
    title: 'CPH: Algoritmos de strings',
    category: 'CPH - Temas avanzados',
    content: `## Terminologia

**Subcadena** (contigua) vs **subsecuencia** (no necesariamente
contigua, respetando el orden). Prefijo y sufijo son subcadenas que tocan
el principio o el final del string.

## Estructura Trie

Arbol donde cada arista representa un caracter y cada camino desde la
raiz representa un prefijo; insertar o buscar una palabra cuesta
$O(\\text{longitud})$, independiente de cuantas palabras haya almacenadas.
Util para diccionarios, autocompletado, y para encontrar el prefijo comun
mas largo entre muchas palabras.

## Hashing de strings

Un **rolling hash polinomial** trata el string como un numero en base
$b$: $h(s) = \\sum_i s_i \\cdot b^i \\bmod p$. Precomputando los prefijos de
hash y las potencias de $b$, se puede calcular el hash de **cualquier**
subcadena en $O(1)$, permitiendo comparar si dos subcadenas son iguales en
$O(1)$ tras un preprocesamiento $O(n)$. Se recomienda un modulo grande (o
dos hashes con modulos/bases distintos combinados) para evitar colisiones
adversarias en jueces online donde el input puede ser diseñado para
romper un hash predecible.

## Z-algorithm

Calcula, para cada posicion $i$ del string ($i \\ge 1$), la longitud del
prefijo comun mas largo entre el string completo y el sufijo que empieza
en $i$ ($Z[i]$), en $O(n)$ total usando una ventana $[l, r]$ que
representa el tramo mas a la derecha ya calculado, evitando comparaciones
redundantes. Concatenando \\\`patron + separador + texto\\\` (el separador
no debe aparecer en ninguno de los dos), los indices donde $Z[i]$ iguala
la longitud del patron marcan una ocurrencia, resolviendo *pattern
matching* completo en $O(n + m)$ —la misma complejidad que KMP, con una
implementacion en muchos casos mas simple de recordar.`,
    commonPitfalls:
      'Usar un solo hash con un modulo pequeño o predecible para comparar subcadenas: es vulnerable a colisiones intencionales en jueces online (usar double hashing o un modulo grande aleatorizado).',
  },
  {
    title: 'CPH: Algoritmos de raiz cuadrada',
    category: 'CPH - Temas avanzados',
    content: `## Idea general

Dividir los datos en bloques de tamano aproximado $\\sqrt{n}$ balancea el
costo de preprocesar cada bloque (o de reconstruirlo) con el costo de
recorrer bloques completos: en vez de $O(n)$ por operacion (recorrido
lineal) o necesitar una estructura mas compleja como un segment tree, se
logra $O(\\sqrt{n})$ por operacion con una implementacion mucho mas
simple.

## Combinar algoritmos segun el tamano

A veces conviene resolver un problema con un algoritmo distinto segun el
tamano de un parametro: por ejemplo, factorizar por division de prueba si
el numero de consultas es pequeno, o precomputar con criba si es grande.
Aplicado a sqrt decomposition: procesar directamente los elementos "raros"
(que aparecen pocas veces) de una forma, y los elementos "frecuentes" (que
aparecen mas de $\\sqrt{n}$ veces, y por lo tanto hay a lo sumo
$O(\\sqrt{n})$ de ellos) de otra.

## Particiones de enteros

Contar las formas de escribir $n$ como suma de enteros positivos (sin
importar el orden) se puede acelerar notando que solo hay $O(\\sqrt{n})$
valores distintos de $\\lfloor n/k \\rfloor$ al variar $k$, la misma
observacion que acelera el calculo de la suma de divisores de todos los
numeros hasta $n$.

## Algoritmo de Mo

Responde consultas de rango $[l, r]$ **offline** (todas conocidas de
antemano, sin actualizaciones) reordenandolas: se agrupan por bloque de
$l$ (de tamano $\\sqrt{n}$) y, dentro de cada bloque, se ordenan por $r$.
Procesando las consultas en ese orden y moviendo dos punteros
($l$ actual, $r$ actual) de una consulta a la siguiente, el puntero $r$
se mueve $O(n \\sqrt{n})$ en total (a lo sumo $O(n)$ por bloque) y el
puntero $l$ se mueve $O(\\sqrt{n})$ por consulta, dando
$O((n + q)\\sqrt{n})$ total en vez de recalcular cada consulta desde
cero en $O(n)$.`,
  },
  {
    title: 'CPH: Segment trees revisited',
    category: 'CPH - Temas avanzados',
    content: `## Lazy propagation

Para actualizaciones de **rango** (no solo puntuales), propagar el cambio
a los hijos de inmediato costaria $O(n)$ por actualizacion. En cambio, se
guarda una marca (\\\`lazy[node]\\\`) en el nodo que representa "toda esta
actualizacion todavia no se aplico a los hijos", y solo se **empuja**
hacia abajo cuando de verdad hace falta visitar un hijo (otra consulta o
actualizacion posterior lo requiere):

\\\`\\\`\\\`cpp
void push_down(int node) {
    if (lazy[node] == 0) return;
    for (int child : {2*node, 2*node+1}) {
        tree[child] += lazy[node];
        lazy[child] += lazy[node];
    }
    lazy[node] = 0;
}
\\\`\\\`\\\`

Cada nodo mantiene la invariante de reflejar su subarbol **como si** sus
marcas ya se hubieran aplicado, aunque sus hijos todavia no lo sepan.
Consulta y actualizacion de rango siguen siendo $O(\\log n)$.

## Arboles dinamicos (implicitos)

Cuando el rango es enorme (por ejemplo $[0, 10^9]$) y no se puede
reservar $O(n)$ nodos de antemano, los nodos se crean sobre la marcha solo
cuando se visitan por primera vez (segment tree implicito/dinamico),
usando $O(q \\log n)$ nodos en total para $q$ operaciones en vez de
$O(n)$.

## Estructuras de datos como valor de nodo

Cada nodo puede guardar una estructura mas rica que un numero —por
ejemplo un \\\`set\\\` ordenado con todos los valores de su rango— dando un
"merge sort tree" que responde consultas mas complejas que
suma/min/max (como "¿cuantos elementos menores a $x$ hay en el rango
$[l, r]$?", con busqueda binaria dentro de cada \\\`set\\\` visitado).

## Segment trees 2D

Un segment tree cuyos nodos son a su vez segment trees sobre la otra
dimension, para consultas de rango sobre una matriz en $O(\\log^2 n)$ por
operacion.`,
    commonPitfalls:
      'Olvidar hacer push_down antes de recursar hacia los hijos en una consulta o actualizacion (el resultado queda desactualizado). No limpiar la marca lazy del nodo padre despues de propagarla a los hijos.',
  },
  {
    title: 'CPH: Geometria computacional basica',
    category: 'CPH - Temas avanzados',
    content: `## Numeros complejos

Representar un punto $(x, y)$ como $x + yi$ simplifica rotaciones
(multiplicar por $e^{i\\theta} = \\cos\\theta + i\\sin\\theta$) y
traslaciones (suma de complejos), evitando escribir manualmente las
formulas trigonometricas de rotacion en cada problema.

## Puntos y lineas: producto cruzado

El producto cruzado de dos vectores $\\vec{a} = (a_x, a_y)$ y
$\\vec{b} = (b_x, b_y)$,

$$\\vec{a} \\times \\vec{b} = a_x b_y - a_y b_x$$

indica la orientacion de un giro: positivo si $\\vec{b}$ esta a la
izquierda de $\\vec{a}$ (giro antihorario), negativo si esta a la derecha
(horario), y cero si son colineales. Este signo es la base de casi todos
los algoritmos geometricos: convex hull, interseccion de segmentos,
determinar si un punto esta dentro de un poligono.

## Area de poligonos (formula del shoelace)

Para un poligono simple (convexo o no) con vertices $(x_1,y_1), \\ldots,
(x_n,y_n)$ en orden (horario o antihorario):

$$\\text{Area} = \\frac{1}{2} \\left| \\sum_{i=1}^{n} (x_i y_{i+1} - x_{i+1} y_i) \\right|$$

(con $(x_{n+1}, y_{n+1}) = (x_1, y_1)$), en $O(n)$.

## Funciones de distancia

$$d_{euclidiana} = \\sqrt{\\Delta x^2 + \\Delta y^2} \\qquad d_{Manhattan} = |\\Delta x| + |\\Delta y| \\qquad d_{Chebyshev} = \\max(|\\Delta x|, |\\Delta y|)$$

Se elige segun el movimiento permitido: Manhattan para movimientos
ortogonales (como en una grilla sin diagonales), Chebyshev cuando las
diagonales cuestan lo mismo que un paso recto (como el rey de ajedrez),
euclidiana para distancia geometrica real.`,
    commonPitfalls:
      'Usar coordenadas float en vez de enteros o double cuando la precision importa. Comparar orientaciones/areas con == en vez de con un epsilon (con floats) o aritmetica entera exacta (cuando las coordenadas son enteras, el producto cruzado tambien lo es y se puede comparar exactamente).',
  },
  {
    title: 'CPH: Algoritmos de barrido (sweep line)',
    category: 'CPH - Temas avanzados',
    content: `## Idea general

Una linea imaginaria "barre" el plano (usualmente de izquierda a derecha
segun la coordenada $x$), deteniendose solo en **eventos** relevantes
(inicio o fin de un segmento, la posicion de un punto), mientras mantiene
una estructura de datos ordenada (tipicamente un \\\`set\\\`/arbol
balanceado) con el estado "activo" del barrido en ese instante. Esto
convierte problemas geometricos en problemas de mantener y consultar un
orden dinamico.

## Puntos de interseccion de segmentos

Para detectar si un conjunto de $n$ segmentos tiene alguna interseccion,
se barre por $x$ manteniendo los segmentos activos ordenados por su
coordenada $y$ en el punto de barrido actual. La observacion clave: dos
segmentos solo pueden intersectarse si en algun momento son **vecinos**
en ese orden, asi que basta comparar cada par de vecinos al insertar o
eliminar un segmento, en vez de todos los $O(n^2)$ pares. Complejidad
total $O(n \\log n)$.

## Problema del par mas cercano

Con **divide y venceras**: se ordena por $x$, se divide en dos mitades,
se resuelve cada mitad recursivamente, y se combina revisando solo una
**franja estrecha** (de ancho igual a la mejor distancia encontrada hasta
el momento) alrededor de la linea de corte, donde el par mas cercano
podria cruzar entre mitades. Dentro de esa franja, ordenando por $y$, cada
punto solo necesita compararse con una cantidad **constante** de vecinos
(un argumento geometrico de empaquetamiento lo acota). Complejidad total
$O(n \\log n)$, en vez de $O(n^2)$ probando todos los pares.

## Envolvente convexa (convex hull)

El menor poligono convexo que contiene todos los puntos dados.

- **Graham scan**: ordenar los puntos por angulo respecto a un punto base
  (el mas bajo/izquierdo), y barrer manteniendo en una pila solo los
  puntos que forman giros consistentemente antihorarios (usando el
  producto cruzado para detectar y descartar giros horarios).
- **Andrew's monotone chain**: ordenar por $x$ (y $y$ como desempate), y
  construir por separado la cadena superior y la cadena inferior del
  poligono, cada una descartando puntos que formen un giro incorrecto.

Ambos corren en $O(n \\log n)$, dominado por el ordenamiento inicial.`,
  },
];

// ── CP4: Competitive Programming 4, Book 1 (Halim & Halim & Effendy) ──
// docs/libros/cp4.pdf
const CP4_TOPICS: TopicSeed[] = [
  {
    title: 'CP4: Fundamentos y consejos de programacion competitiva',
    category: 'CP4 - Introduccion',
    content: `## Los 7 consejos del capitulo 1

1. **Tipear codigo rapido**: menos tiempo tipeando (y menos errores de
   tipeo) es mas tiempo disponible para pensar el algoritmo y depurar.
2. **Identificar el tipo de problema rapido**: reconocer patrones
   (busqueda, grafos, geometria, DP, ad hoc) apenas se lee el enunciado
   ahorra minutos criticos frente a explorar a ciegas.
3. **Analizar el algoritmo antes de codear**: estimar la complejidad
   necesaria segun los limites del problema (ver la tabla de $N$ vs
   complejidad tolerable del capitulo de complejidad de CPH) evita
   implementar un enfoque condenado al TLE.
4. **Dominar el lenguaje**: conocer bien la libreria estandar de
   C++/Java/Python (contenedores, algoritmos, tipos de precision) evita
   reinventar estructuras basicas bajo presion de tiempo.
5. **Dominar el arte de testear**: probar explicitamente casos limite
   (arreglos vacios, un solo elemento, valores maximos/minimos, empates)
   antes de enviar, no solo el ejemplo del enunciado.
6. **Practicar constantemente**: la habilidad de reconocer patrones y
   codear rapido se construye resolviendo muchos problemas, no solo
   leyendo teoria.
7. **Trabajo en equipo (para ICPC)**: coordinar roles (lector,
   algorista, codificador/debugger) y evitar cuellos de botella al
   compartir una sola computadora.

## Anatomia de un problema de contest

Enunciado (contexto y pregunta real, a veces con historia irrelevante),
formato de entrada/salida exacto (incluyendo espacios y saltos de linea),
restricciones (limites de $N$ y de los valores, que determinan la
complejidad esperada), ejemplos de entrada/salida, y a veces limites de
tiempo/memoria especificos por caso de prueba (no solo globales).

## Problemas ad hoc

No encajan en ninguna categoria algoritmica estandar (no son grafos,
DP, geometria clasica); requieren leer con mucho cuidado y modelar el
problema desde cero, muchas veces con simulacion directa del enunciado,
en vez de aplicar una tecnica conocida de memoria.`,
  },
  {
    title: 'CP4: Arreglos, bitmask y enteros grandes',
    category: 'CP4 - Estructuras de datos',
    content: `## Array

La estructura mas basica y la mas usada en la practica. Muchos problemas
de "ordenamiento especial" se resuelven combinando \\\`array + sort\\\`:

- **Encontrar el k-esimo elemento**: ordenar y acceder al indice $k-1$,
  $O(n \\log n)$; con \\\`nth_element\\\` de C++ se logra $O(n)$ esperado sin
  ordenar todo el arreglo.
- **Compresion de coordenadas**: cuando los valores son grandes pero solo
  importa su orden relativo, se ordenan los valores unicos y se
  reemplaza cada valor original por su indice en esa lista ordenada,
  permitiendo indexar estructuras (como un Fenwick tree) que necesitan un
  rango pequeno y denso de indices.

## Bitmask

Representa un subconjunto pequeno (hasta ~20-30 elementos, segun el
limite de memoria/tiempo) como un unico entero, con operaciones de
pertenencia, union, interseccion y complemento en $O(1)$ a nivel de bits
(ver el detalle de operaciones en el tema "CPH: Manipulacion de bits").
Es la base de la DP sobre bitmask (por ejemplo TSP: $dp[mask][i]$).

## Big Integer (Python y Java)

Cuando un numero excede el rango de \\\`long long\\\` (aproximadamente
$\\pm 9.2 \\times 10^{18}$), se necesita aritmetica de **precision
arbitraria**: Python la tiene nativa en sus enteros (sin limite de
tamano, a costa de mayor tiempo por operacion), Java ofrece la clase
\\\`BigInteger\\\` con soporte para suma, multiplicacion, potencia modular,
\\\`gcd\\\` y test de primalidad. En C++ no forma parte de la STL estandar:
hay que implementarla a mano (representando el numero como un vector de
digitos) o usar una libreria externa.`,
    commonPitfalls:
      'Usar long long esperando que "alcance" sin verificar el limite real del problema (puede requerir hasta 10^100 o mas, fuera de rango de cualquier entero nativo de C++).',
  },
  {
    title: 'CP4: Estructuras enlazadas y basadas en pila',
    category: 'CP4 - Estructuras de datos',
    content: `## Listas enlazadas

Utiles cuando se necesitan inserciones/borrados frecuentes **en el
medio** de la secuencia sin desplazar el resto de los elementos, algo que
un \\\`vector\\\` no puede hacer en $O(1)$ (una insercion en el medio de un
vector es $O(n)$ por el corrimiento). En la practica, en programacion
competitiva compiten con estructuras mas simples (arrays con
compresion, \\\`set\\\`) segun el patron de acceso exacto que pida el
problema, porque una lista enlazada pierde acceso aleatorio $O(1)$.

## Balanceo de parentesis

Apilar cada apertura y hacer *pop* al encontrar el cierre correspondiente
(verificando que coincida el tipo de parentesis); si en algun punto hay
que hacer *pop* de una pila vacia, o si la pila no queda vacia al
terminar de recorrer el string, la expresion esta desbalanceada.
Complejidad $O(n)$.

## Evaluacion de expresiones

Se convierte la expresion infix a notacion polaca postfix respetando la
precedencia de operadores con una pila auxiliar de operadores (el
algoritmo *shunting-yard*), y luego se evalua el postfix resultante con
una pila de operandos: al leer un operador, se sacan dos operandos de la
pila, se aplica la operacion, y se apila el resultado.

## Rectangulo mas grande en un histograma

Con una **pila monotona creciente** de indices (guardando barras cuya
altura es menor que la actual) se resuelve en $O(n)$: al encontrar una
barra mas baja que el tope de la pila, se calculan las areas posibles
usando las barras que se van sacando (cada una como la barra mas baja de
un rectangulo que se extiende hasta el indice actual), en vez de
$O(n^2)$ probando cada par de barras como limites del rectangulo.`,
  },
  {
    title: 'CP4: Heap, hash table, bBST y order statistics tree',
    category: 'CP4 - Estructuras de datos',
    content: `## Binary heap (priority queue)

Arbol binario **casi completo** (representable en un arreglo, indices
$2i$/$2i+1$ para los hijos) donde cada padre es menor (min-heap) o mayor
(max-heap) que sus hijos. Insertar (\\\`push\\\`, "burbujea" hacia arriba) y
extraer el minimo/maximo (\\\`pop\\\`, "hunde" el ultimo elemento desde la
raiz) cuestan $O(\\log n)$; consultar el minimo/maximo es $O(1)$. Es la
base de Dijkstra y Prim implementados con cola de prioridad.

## Hash table

Almacena pares clave-valor con acceso, insercion y borrado en $O(1)$
**esperado**, distribuyendo las claves en "buckets" segun una funcion de
hash. A costa de perder el orden y de degradarse a $O(n)$ en el peor caso
si hay muchas colisiones (por ejemplo, ante un hash predecible atacado
deliberadamente en un juez online).

## Balanced BST (bBST)

\\\`set\\\`/\\\`map\\\` en C++ (o \\\`TreeSet\\\`/\\\`TreeMap\\\` en Java) mantienen los
elementos **ordenados**, con insercion, borrado y busqueda en
$O(\\log n)$. A diferencia de un hash table, permiten recorrer en orden y
buscar el sucesor/predecesor de un valor (\\\`lower_bound\\\`,
\\\`upper_bound\\\`), operaciones que un hash table no soporta de forma
nativa.

## Order statistics tree

Extension de un bBST (en C++, con \\\`__gnu_pbds::tree\\\` y la politica
\\\`tree_order_statistics_node_update\\\` de la libreria \\\`pb_ds\\\`) que
ademas responde en $O(\\log n)$ dos operaciones que un \\\`set\\\` estandar no
puede: \\\`find_by_order(k)\\\` (el $k$-esimo elemento en orden) y
\\\`order_of_key(x)\\\` (cuantos elementos son menores que $x$, es decir su
rango). Muy util en problemas de conteo de inversiones o de rangos
dinamicos.`,
  },
  {
    title: 'CP4: Union-Find Disjoint Sets',
    category: 'CP4 - Estructuras de datos',
    content: `## Representacion

Cada elemento guarda un puntero (indice) a su "padre" en un arreglo; el
**representante** de un conjunto es la raiz de su arbol implicito (el
unico nodo que es padre de si mismo). Inicialmente, cada elemento es su
propio conjunto.

## Operaciones basicas

\\\`\\\`\\\`cpp
int find(int x) {
    if (parent[x] == x) return x;
    return parent[x] = find(parent[x]); // compresion de camino
}
void unite(int x, int y) {
    x = find(x); y = find(y);
    if (x == y) return;
    if (rank[x] < rank[y]) swap(x, y);
    parent[y] = x;
    if (rank[x] == rank[y]) rank[x]++;
}
\\\`\\\`\\\`

## Optimizaciones

- **Compresion de camino**: al hacer \\\`find\\\`, todos los nodos visitados
  en el camino pasan a apuntar directamente a la raiz, aplanando el arbol
  para futuras consultas.
- **Union por rango/tamano**: al unir dos conjuntos, se cuelga el arbol
  de menor rango (o tamano) del de mayor rango, evitando que los arboles
  se vuelvan muy profundos.

Con ambas optimizaciones juntas, cada operacion cuesta
$O(\\alpha(n))$ amortizado (funcion inversa de Ackermann), practicamente
constante para cualquier $n$ realista.

## Aplicaciones

Algoritmo de Kruskal para MST (verificar si dos extremos de una arista
ya estan conectados), mantener componentes conexas mientras se agregan
aristas dinamicamente (conectividad incremental, no soporta desconectar),
y deteccion de ciclos al agregar una arista no dirigida (si sus dos
extremos ya estan en el mismo conjunto antes de unirlos, agregarla forma
un ciclo).`,
    commonPitfalls: 'Implementar find() sin compresion de camino (recursivo simple), degradando el arbol a una lista enlazada en el peor caso y las operaciones a O(n).',
  },
  {
    title: 'CP4: Fenwick Tree (Binary Indexed Tree)',
    category: 'CP4 - Estructuras de datos',
    content: `## Idea

Cada posicion $i$ del arreglo interno \\\`bit[]\\\` es "responsable" de un
rango de tamano $\\text{lowbit}(i) = i \\mathbin{\\&} (-i)$ (la potencia de 2
mas baja que divide a $i$, en indexado desde 1). Esto permite construir
cualquier suma de prefijo combinando a lo sumo $O(\\log n)$ de estos
rangos parciales.

\\\`\\\`\\\`cpp
void update(int i, long long delta) {
    for (; i <= n; i += i & (-i)) bit[i] += delta;
}
long long prefixSum(int i) {
    long long s = 0;
    for (; i > 0; i -= i & (-i)) s += bit[i];
    return s;
}
\\\`\\\`\\\`

## Update y query en $O(\\log n)$

Actualizar un punto (sumar \\\`delta\\\` a la posicion $i$) y consultar la
suma de un prefijo $[1, i]$ cuestan $O(\\log n)$ cada uno; la suma de un
rango $[l, r]$ se obtiene como \\\`prefixSum(r) - prefixSum(l-1)\\\`.

## Extensiones a rangos

- **Actualizacion de rango, consulta puntual**: se invierte el uso —el
  Fenwick tree guarda **diferencias**, y \\\`update(l, +v)\\\`,
  \\\`update(r+1, -v)\\\` aplican $+v$ a todo el rango $[l, r]$; una consulta
  puntual es simplemente \\\`prefixSum(i)\\\` sobre ese arreglo de
  diferencias.
- **Actualizacion y consulta de rango combinadas**: se usan **dos**
  Fenwick trees en paralelo, derivando la formula de la suma de prefijo
  a partir de las diferencias acumuladas y de $i$ multiplicado por esa
  acumulacion, permitiendo ambas operaciones en $O(\\log n)$.`,
  },
  {
    title: 'CP4: Segment Tree (CP4)',
    category: 'CP4 - Estructuras de datos',
    content: `## Construccion y operaciones

Arbol binario donde cada nodo cubre un rango contiguo del arreglo
original; el nodo $i$ tiene hijos $2i$ y $2i+1$, cubriendo cada uno la
mitad izquierda/derecha del rango de su padre. Se construye en $O(n)$
(recursivamente, combinando los hijos) y responde consultas y
actualizaciones de rango en $O(\\log n)$, para **cualquier** operacion
asociativa: suma, minimo, maximo, $\\gcd$, XOR, etc. —no solo sumas de
prefijo como el Fenwick tree.

\\\`\\\`\\\`cpp
int query(int node, int l, int r, int ql, int qr) {
    if (qr < l || r < ql) return 0;               // fuera de rango
    if (ql <= l && r <= qr) return tree[node];    // contenido totalmente
    int mid = (l + r) / 2;
    return query(2*node, l, mid, ql, qr)
         + query(2*node+1, mid+1, r, ql, qr);
}
\\\`\\\`\\\`

## Variantes

Min-segment-tree, max-segment-tree, segment tree de suma con **lazy
propagation** para actualizaciones de rango eficientes (ver "CPH: Segment
trees revisited" para el detalle completo), o combinaciones —por ejemplo
guardar en el mismo nodo el valor minimo **y** cuantas veces aparece en
ese rango.

## Comparacion con Fenwick Tree

El segment tree es mas flexible (soporta cualquier operacion asociativa y
actualizaciones de rango de forma natural con lazy propagation), pero
tiene una constante mayor en tiempo y espacio ($O(4n)$ de memoria en la
implementacion clasica con arreglo) que un Fenwick tree, que es mas
simple de implementar y mas rapido en la practica, pero limitado
principalmente a sumas de prefijo (o a lo que se pueda expresar como
diferencia de dos prefijos).`,
  },
  {
    title: 'CP4: Busqueda completa',
    category: 'CP4 - Paradigmas de resolucion',
    content: `## Busqueda completa iterativa

Bucles anidados (o generacion explicita de combinaciones/permutaciones
con funciones de la libreria estandar) que prueban **todas** las
posibilidades sin recursion. Viable cuando el espacio de busqueda es
pequeno segun los limites del problema (ver la tabla de complejidad
tolerable segun $N$).

## Busqueda completa recursiva (backtracking)

Una funcion recursiva construye la solucion paso a paso (por ejemplo,
decidiendo el valor de una posicion a la vez), y retrocede
("backtrack") cuando una rama no puede llevar a una solucion valida,
deshaciendo la decision antes de probar la siguiente opcion.

## Tips de busqueda completa

- **Podar tan pronto como sea posible**: cortar una rama en cuanto se
  detecta que ya no puede mejorar la mejor respuesta conocida o que viola
  una restriccion, en vez de completarla para descartarla al final.
- **Generar y probar**: a veces es mas facil generar todas las
  candidatas posibles (incluyendo invalidas) y filtrar las validas, que
  construir directamente solo las validas.
- **Verificar los limites del problema**: $N$ pequeno (tipicamente
  $\\le 20$–$25$) suele ser la senal de que se espera fuerza bruta,
  backtracking con poda, o DP sobre bitmask —no un algoritmo polinomial
  mas sofisticado.

## Busqueda completa en contests

En la practica, muchos problemas que "parecen" requerir un algoritmo
avanzado en realidad tienen limites tan pequenos que una busqueda
completa bien podada es la solucion esperada; leer los limites antes de
descartar la fuerza bruta ahorra tiempo de implementacion.`,
  },
  {
    title: 'CP4: Divide y venceras, busqueda binaria y ternaria',
    category: 'CP4 - Paradigmas de resolucion',
    content: `## Patron general de divide y venceras

Dividir el problema en subproblemas mas chicos del **mismo tipo**,
resolver cada uno recursivamente, y combinar sus resultados en una
solucion del problema original. Ejemplo clasico: **merge sort**
($T(n) = 2T(n/2) + O(n) \\Rightarrow O(n \\log n)$), o contar
**inversiones** (pares $i<j$ con $a_i > a_j$) durante el paso de *merge*:
cada vez que se toma un elemento de la mitad derecha antes que uno de la
izquierda, todos los elementos restantes de la izquierda forman una
inversion con el.

## Usos no obvios de la busqueda binaria

Mas alla de buscar un valor en un arreglo ordenado, la busqueda binaria
sirve para **buscar en la respuesta** (parametric search): si existe una
funcion $f(x)$ monotona (por ejemplo, "¿es posible resolver el problema
usando a lo sumo $x$ unidades de un recurso?"), se puede binariar sobre
$x$ en $O(\\log(\\text{rango}))$ iteraciones, evaluando $f$ (a menudo un
chequeo de factibilidad $O(n)$ o $O(n \\log n)$) en cada una, en vez de
calcular la respuesta exacta de forma directa.

## Busqueda ternaria

Para funciones **unimodales** (que crecen y luego decrecen, o viceversa,
sin otros maximos/minimos locales), permite encontrar el extremo
evaluando la funcion en dos puntos interiores del rango (a un tercio y
dos tercios) y descartando el tercio que no puede contener el optimo,
en $O(\\log n)$ evaluaciones —analogo a la busqueda binaria pero para
optimizacion en vez de decision.`,
    commonPitfalls:
      'Aplicar busqueda ternaria a una funcion que no es realmente unimodal (puede converger a un extremo local incorrecto).',
  },
  {
    title: 'CP4: Algoritmos greedy (CP4)',
    category: 'CP4 - Paradigmas de resolucion',
    content: `## Ejemplos clasicos

Scheduling de actividades (ordenar por tiempo de fin y tomar
greedy las compatibles), codigos de Huffman para compresion optima, y los
algoritmos de arbol de expansion minima (Kruskal y Prim) son todos
greedy que se puede demostrar que resultan optimos.

## Como reconocer y demostrar un greedy correcto

Dos argumentos tipicos de demostracion:

- **Propiedad de eleccion greedy**: la primera decision que toma el
  greedy siempre forma parte de **alguna** solucion optima, asi que se
  puede "fijar" esa decision sin perder generalidad y recursar sobre el
  resto del problema.
- **Argumento de intercambio**: si se asume una solucion optima que **no**
  sigue el criterio greedy, se demuestra que intercambiando dos elementos
  de esa solucion se obtiene otra solucion igual de buena (o mejor) que
  si sigue el criterio, contradiciendo que la original ya seguia otro
  criterio distinto.

## Cuando el greedy falla

Si no se puede demostrar ninguna de las dos propiedades anteriores, o se
encuentra un contraejemplo concreto donde el greedy da un resultado
subóptimo (como el problema de monedas con denominaciones no canonicas:
$\\{1,3,4\\}$ para formar $6$, donde el greedy da 3 monedas ($4+1+1$) pero el
optimo es 2 ($3+3$)), el problema probablemente necesita programacion
dinamica en vez de una decision local greedy.`,
  },
  {
    title: 'CP4: Programacion dinamica (CP4)',
    category: 'CP4 - Paradigmas de resolucion',
    content: `## Ilustracion de DP

Un problema admite DP cuando tiene **subestructura optima** (la solucion
optima se construye a partir de soluciones optimas de subproblemas mas
chicos) y **subproblemas superpuestos** (los mismos subproblemas
reaparecen muchas veces al resolver recursivamente). Sin la segunda
propiedad, la recursion simple sin memoizar ya alcanza (divide y
venceras puro).

## Top-down (memoizacion) vs bottom-up (tabulacion)

- **Top-down**: se escribe la recursion natural del problema tal como se
  piensa, y se cachea (memoiza) el resultado de cada estado la primera
  vez que se calcula, devolviendo el valor cacheado en llamadas
  repetidas.
- **Bottom-up**: se llenan los estados en una tabla, en un orden tal que
  las dependencias de cada estado ya esten resueltas antes de
  necesitarse, sin usar recursion (evita el overhead de llamadas y el
  riesgo de *stack overflow* con estados muy profundos).

## Ejemplos clasicos

LCS (subsecuencia comun mas larga entre dos strings, $O(nm)$), LIS
(subsecuencia creciente mas larga, ver detalle en "CPH: Programacion
dinamica basica"), knapsack 0/1, coin change (numero minimo de monedas),
matrix chain multiplication (orden optimo de multiplicar una cadena de
matrices para minimizar operaciones, $O(n^3)$ con
$dp[i][j] = \\min_k (dp[i][k] + dp[k+1][j] + \\text{costo}(i,k,j))$).

## Ejemplos no clasicos

**DP sobre bitmask** (el estado es un subconjunto codificado como
entero, como en TSP), **DP sobre arboles** (combinar resultados de
subarboles, tipicamente con una pasada post-orden), y **DP con estados
aumentados** (agregar dimensiones extra al estado ademas de la posicion,
como "cuantas veces ya se uso un recurso limitado" o "el ultimo valor
elegido", cuando la transicion depende de mas que solo la posicion
actual).`,
  },
  {
    title: 'CP4: Recorridos de grafos (DFS/BFS y aplicaciones)',
    category: 'CP4 - Grafos',
    content: `## DFS y BFS

Las dos formas basicas de explorar un grafo, ambas $O(V + E)$: **DFS**
(con recursion o una pila explicita) explora tan profundo como sea
posible antes de retroceder; **BFS** (con una cola) explora por niveles y
encuentra distancias minimas en numero de aristas en grafos no
ponderados.

## Componentes conexas

Correr DFS/BFS desde cada nodo aun no visitado; cada corrida completa
marca exactamente una componente conexa. Numero de componentes = numero
de veces que se inicia un recorrido nuevo.

## Flood fill (grilla implicita)

DFS/BFS sobre una grilla donde cada celda es un nodo y sus vecinas (arriba,
abajo, izquierda, derecha, y a veces diagonales) son sus aristas
implicitas —no hace falta construir una lista de adyacencia explicita.
Tipico en problemas de "contar islas" o "rellenar una region conectada".

## Ordenamiento topologico y verificacion de bipartito

**Ordenamiento topologico** solo existe en DAGs; se obtiene con DFS
guardando el post-orden invertido (ver "CPH: Grafos dirigidos y DP en
DAG" para el detalle completo, incluida la alternativa con el algoritmo
de Kahn). Un grafo es **bipartito** si se puede 2-colorear de forma que
ningun par de nodos adyacentes comparta color; se verifica con un
BFS/DFS que alterna colores entre niveles/vecinos y falla en cuanto
encuentra un conflicto de color.

## Deteccion de ciclos en grafos dirigidos

Marcar los nodos con tres estados durante el DFS (no visitado, en la pila
de recursion actual, terminado); encontrar una arista hacia un nodo que
esta actualmente en la pila de recursion indica un ciclo.`,
  },
  {
    title: 'CP4: Puntos de articulacion, puentes y componentes fuertemente conexas',
    category: 'CP4 - Grafos',
    content: `## Algoritmo de Tarjan (low-link)

Durante un **unico** DFS se calculan dos valores por nodo: $disc[v]$ (el
momento —contador global— en que se descubrio $v$) y $low[v]$ (el menor
$disc$ alcanzable desde $v$, usando aristas del arbol de DFS y a lo sumo
**una** arista de retroceso hacia un ancestro):

$$low[v] = \\min\\Big(disc[v],\\ \\min_{hijo\\ c} low[c],\\ \\min_{(v,w)\\ \\text{retroceso}} disc[w]\\Big)$$

Comparando $disc$ y $low$ entre un nodo y sus hijos en el arbol de DFS se
detectan:

- **Puentes**: una arista $(u, v)$ del arbol de DFS es puente si
  $low[v] > disc[u]$ (quitarla desconectaria el grafo, porque no hay
  ninguna arista de retroceso desde el subarbol de $v$ hacia $u$ o mas
  arriba).
- **Puntos de articulacion**: un nodo $u$ (no raiz) lo es si existe un
  hijo $v$ en el arbol de DFS con $low[v] \\ge disc[u]$. La **raiz** del
  DFS es punto de articulacion solo si tiene **mas de un** hijo en el
  arbol de DFS (regla especial, porque no tiene ancestro hacia el cual
  podria existir una arista de retroceso).

Ambos se calculan en $O(V + E)$ con la misma pasada de DFS.

## Componentes fuertemente conexas (SCC)

En grafos **dirigidos**, el mismo esquema de $disc$/$low$ (algoritmo de
Tarjan para SCC, usando ademas una pila explicita para agrupar los nodos
de cada componente) o el algoritmo de **Kosaraju** (dos DFS, uno de ellos
sobre el grafo transpuesto; ver el detalle en "CPH: Conectividad fuerte y
2-SAT") encuentran las componentes fuertemente conexas en
$O(V + E)$.`,
  },
  {
    title: 'CP4: Arbol de expansion minima (MST)',
    category: 'CP4 - Grafos',
    content: `## Kruskal

Ordena las $E$ aristas por peso ascendente ($O(E \\log E)$) y las agrega
greedy usando **Union-Find** para verificar en $O(\\alpha(n))$ si sus dos
extremos ya estan conectados (en cuyo caso se descarta, porque agregarla
formaria un ciclo). Complejidad total $O(E \\log E)$. Conviene cuando el
grafo es disperso o las aristas ya vienen (o son faciles de) ordenar.

## Prim

Crece un unico arbol desde un nodo inicial, agregando en cada paso la
arista mas barata que conecta el arbol actual con un nodo fuera de el.
Con una cola de prioridad: $O(E \\log V)$, muy similar en estructura a
Dijkstra pero comparando el **peso de la arista** en vez de la distancia
acumulada desde el origen. Con matriz de adyacencia y busqueda lineal del
minimo (sin heap): $O(V^2)$, preferible con grafos densos representados
como matriz.

## Otras aplicaciones

- **Arbol de expansion maxima**: invertir el criterio de comparacion
  (tomar siempre la arista mas cara en vez de la mas barata).
- **Segundo mejor MST**: calcular el MST original y luego, para cada
  arista que no esta en el, encontrar el reemplazo optimo dentro del
  ciclo que formaria al agregarla (requiere precomputar el maximo peso de
  arista en el camino del MST entre cada par de nodos, por ejemplo con
  binary lifting).
- **Clustering**: correr Kruskal parcialmente y detenerse antes de
  agregar las $k-1$ aristas mas caras, obteniendo $k$ grupos que
  maximizan la distancia minima entre grupos distintos (clustering de
  distancia maxima).`,
  },
  {
    title: 'CP4: Caminos minimos desde un origen (SSSP)',
    category: 'CP4 - Grafos',
    content: `## Grafo no ponderado: BFS

Si todas las aristas cuentan como el mismo "costo" (o no tienen peso),
BFS encuentra la distancia minima en numero de aristas desde el origen a
todos los demas nodos en $O(V + E)$ —mas simple y rapido que Dijkstra,
sin necesidad de cola de prioridad.

## Grafo ponderado sin pesos negativos: Dijkstra

Con una cola de prioridad, $O((V + E) \\log V)$ (ver la implementacion
completa en "CPH: Caminos minimos"). Es el algoritmo por defecto para
SSSP en la gran mayoria de los problemas de contest, porque casi todos
los grafos ponderados de un problema tienen pesos no negativos por
diseño.

## Grafo pequeno con posibles ciclos negativos: Bellman-Ford

Relaja todas las aristas $V - 1$ veces, $O(V \\cdot E)$; una relajacion
adicional exitosa en la iteracion $V$-esima indica un ciclo negativo
alcanzable desde el origen. Se usa cuando el problema explicitamente
permite pesos negativos y el grafo es lo bastante chico para que
$O(VE)$ sea aceptable segun el limite de tiempo.

## Eleccion segun el problema

La eleccion entre estos tres algoritmos depende enteramente de las
restricciones del problema: si dice "pesos no negativos" y $V, E$
grandes, Dijkstra; si menciona explicitamente pesos negativos (o pide
detectar ciclos negativos) con $V$ chico, Bellman-Ford; si no hay pesos
en absoluto, BFS es mas simple y eficiente que cualquiera de los dos
anteriores.`,
    commonPitfalls:
      'Usar Dijkstra cuando el grafo tiene aristas de peso negativo (resultado incorrecto silencioso, sin error ni excepcion). No verificar la existencia de ciclos negativos con Bellman-Ford cuando el problema los permite explicitamente.',
  },
  {
    title: 'CP4: Caminos minimos entre todos los pares (APSP)',
    category: 'CP4 - Grafos',
    content: `## Floyd-Warshall

DP sobre nodos intermedios: para cada nodo intermedio $k$ (de $1$ a $n$,
en el bucle **mas externo**), se actualiza

$$dist[i][j] = \\min\\big(dist[i][j],\\ dist[i][k] + dist[k][j]\\big)$$

para todo par $(i, j)$. Complejidad $O(V^3)$, apropiado cuando $V$ es
pequeno (tipicamente hasta unos cientos, ya que $V^3$ crece rapido: con
$V=500$ ya son $1.25 \\times 10^8$ operaciones).

## Otras aplicaciones de la misma DP

- **Cierre transitivo**: reemplazando la suma por AND logico y el minimo
  por OR logico, la misma estructura de triple bucle indica si existe
  **algun** camino (sin importar el costo) entre cada par de nodos.
- **Deteccion de ciclos negativos**: si al terminar el algoritmo
  $dist[i][i] < 0$ para algun $i$, existe un ciclo negativo alcanzable
  desde (y que regresa a) $i$.
- **Diametro del grafo**: una vez calculada la matriz completa de
  distancias, el diametro es el maximo entre todas las $dist[i][j]$
  finitas (ignorando pares no conectados).

## Cuando preferir Floyd-Warshall sobre correr Dijkstra V veces

Correr Dijkstra desde cada uno de los $V$ nodos da $O(V(V+E)\\log V)$,
que puede ser mejor que $O(V^3)$ si el grafo es **disperso**
($E \\ll V^2$). Floyd-Warshall conviene cuando el grafo es denso, cuando
hay pesos negativos (sin ciclos negativos) que impedirian usar Dijkstra
directamente, o simplemente quando $V$ es chico y la simplicidad de
implementacion (tres bucles anidados) pesa mas que la eficiencia teorica.`,
  },
  {
    title: 'CP4: Grafos especiales',
    category: 'CP4 - Grafos',
    content: `## DAG (grafo dirigido aciclico)

Admite orden topologico (ver "CPH: Grafos dirigidos y DP en DAG"). Muchos
problemas de DP se pueden ver, una vez modelados como grafo, como DP
sobre un DAG: procesando los nodos en orden topologico, cada nodo ya
tiene resueltos todos sus predecesores al momento de procesarse (camino
mas largo/corto, conteo de caminos, etc).

## Arboles

Caso particular de grafo: conexo, sin ciclos, con exactamente $n-1$
aristas para $n$ nodos. Muchos algoritmos generales se simplifican
considerablemente en un arbol: por ejemplo, existe un **unico** camino
simple entre cualquier par de nodos, lo que habilita tecnicas especificas
como el calculo de diametro con dos recorridos (ver "CPH: Algoritmos en
arboles") o el LCA (ver "CPH: Consultas en arboles y LCA").

## Grafos bipartitos

Se pueden 2-colorear sin que dos nodos adyacentes compartan color. El
**emparejamiento maximo** entre sus dos particiones se calcula con el
algoritmo hungaro ($O(V^3)$ para el caso ponderado) o, para el caso no
ponderado, reduciendolo a **flujo maximo** con capacidades unitarias
(fuente conectada a un lado, sumidero al otro), resoluble tambien con el
algoritmo de Hopcroft-Karp en $O(E\\sqrt{V})$.

## Grafos Eulerianos

Admiten un circuito o camino que recorre **cada arista** exactamente una
vez, si se cumple la condicion de paridad de grados (ver el detalle
completo, incluida la version dirigida, en "CPH: Caminos y circuitos").
Se construyen explicitamente con el algoritmo de Hierholzer en
$O(E)$.`,
  },
];

// ── Papers de docs/papers ──────────────────────────────────────────
const PAPER_TOPICS: TopicSeed[] = [
  {
    title: 'Paper: Errores comunes en contests online y en tiempo real',
    category: 'Papers y estrategia de competencia',
    content: `## Fuente

Shahriar Manzoor, "Common Mistakes in Online and Real-time Contests",
ACM Crossroads 7.5 (2008). Guia practica orientada a principiantes en el
juez de Valladolid (UVa) y contests ACM.

## Tipos de veredicto y sus causas tipicas

- **Wrong Answer**: enunciado mal interpretado, un caso limite no
  considerado, o un truco escondido en la letra chica del problema.
- **Runtime Error**: acceso fuera de los limites de un arreglo, division
  por cero, overflow.
- **Time Limit Exceeded**: algoritmo demasiado lento, un bucle infinito por
  un bug, o el programa esperando entrada por stdin cuando el juez espera
  un archivo (y viceversa). Ojo: un TLE a veces esconde en realidad un
  error de memoria o de logica, no de eficiencia.
- **Presentation Error**: la salida es correcta mas no tiene el formato
  exacto esperado (espacios, saltos de linea).
- **No Output**: usualmente un problema de formato de entrada/salida mal
  interpretado.

## Recomendaciones tecnicas concretas

- Usar \`double\` en vez de \`float\` (mas precision y rango).
- No comparar floats con \`==\`; comparar con un epsilon
  (\`fabs(a - b) < 1e-9\`).
- Recordar \`pi\` con muchos decimales o calcularlo como \`2 * acos(0)\`, no
  usar aproximaciones como \`22/7\`.
- Inicializar explicitamente las variables en cada caso de prueba cuando
  el problema tiene multiples datasets (no asumir que quedan en 0).
- Testear con multiples datasets de tamanos variados (no solo crecientes o
  descendentes), no solo con el ejemplo dado.
- Evitar la recursion quirurgicamente innecesaria en contest: cuesta mas
  tiempo, es mas propensa a crashear y mas dificil de debuggear bajo
  presion (aunque para backtracking/DFS sigue siendo la opcion natural).
- Usar \`assert\` para detectar temprano violaciones de invariantes.

## Consejos de equipo

Leer todos los problemas al inicio y clasificarlos por dificultad; atacar
primero los mas faciles; revisar el scoreboard para ver que problema estan
resolviendo mas equipos (probable senal de que es facil); nunca hacer
debugging en tiempo real frente a la maquina ("real-time debugging is the
ultimate sin"): pensar en papel antes de volver al teclado.`,
    commonPitfalls:
      'No inicializar variables globales entre casos de un mismo archivo de input. Comparar numeros de punto flotante con ==. Usar float en vez de double. Asumir el formato de fin de caso (EOF vs linea en blanco) sin confirmarlo con el enunciado.',
  },
  {
    title: 'Paper: Estrategia de contest (Trotman & Handley)',
    category: 'Papers y estrategia de competencia',
    content: `## Fuente

Andrew Trotman y Chris Handley, "Programming Contest Strategy", University
of Otago (2006). Primer analisis sistematico y formal de que estrategia de
orden de resolucion conviene en un contest tipo ICPC.

## El problema de "complejidad creciente / tiempo decreciente"

Resolver de mas facil a mas dificil hace que, a medida que avanza el
contest, cada problema restante toma mas tiempo justo cuando queda menos
tiempo disponible. Los autores demuestran que esto puede hacer que un
equipo resuelva **menos** problemas en total que si hubiera elegido otro
orden, incluso si estima perfectamente cuanto tarda cada problema.

## Resultados principales

- **Minimizar el puntaje de desempate (tie-break)**: siempre se logra
  resolviendo de mas facil a mas dificil (demostrado formalmente).
- **Maximizar el numero de problemas resueltos**: encontrar el orden
  optimo es NP-completo (equivalente a 2-particion/3-particion segun
  cuantos problemas se resuelven en paralelo); no existe un algoritmo
  eficiente general.
- **"Quemar la vela por los dos extremos" (candle burning)**: empezar el
  problema mas dificil mientras el resto del equipo resuelve de mas facil
  a mas dificil balancea ambos objetivos sin comprometerse del todo a
  ninguno.
- En la practica, un equipo debe decidir de antemano si prioriza ganar por
  **numero de problemas resueltos** (conviene ir de dificil a facil) o por
  **tiempo de desempate** (conviene ir de facil a dificil), porque no
  existe una unica estrategia que optimice ambos a la vez.

## Metodos de trabajo en equipo analizados

- **Pure teamwork**: los tres miembros discuten y resuelven un problema a
  la vez juntos.
- **No-teamwork**: cada miembro resuelve problemas de forma independiente,
  maximizando el throughput pero con riesgo de cuello de botella en el
  teclado.
- **Paired / think-tank**: dos personas resuelven en pareja mientras la
  tercera prepara subrutinas o testea, rotando roles.`,
  },
  {
    title: 'Paper: Entrenando equipos ICPC - guia tecnica (Rujia Liu)',
    category: 'Papers y estrategia de competencia',
    content: `## Fuente

Rujia Liu (Tsinghua University), "Training ICPC Teams: A Technical Guide".
Guia de entrenamiento a largo plazo basada en la experiencia de equipos
medallistas en el World Finals.

## Tres aspectos del entrenamiento

1. **Empezar**: practicar en jueces online, dominar estructuras de datos
   elementales y manipulacion de strings, mejorar la habilidad de
   codificar/debuggear reescribiendo la solucion de un mismo problema
   varias veces (como reescribir un texto hasta que quede bien) y leyendo
   codigo ajeno de buena calidad.
2. **Reforzar el trasfondo teorico**:
   - **Matematicas**: aritmetica de precision arbitraria, combinatoria,
     teoria de numeros (primos, mcd, aritmetica modular, funcion \`\\phi\` de
     Euler), teoria de juegos (Sprague-Grundy).
   - **Tecnicas de diseno de algoritmos**: fuerza bruta/backtracking, DP
     (no saltarse los problemas clasicos: LCS, LIS, knapsack, edit
     distance, matrix chain), greedy, divide y venceras.
   - **Teoria de grafos**: conectividad (incluida conectividad fuerte),
     caminos minimos, arboles de expansion, matchings bipartitos y flujos
     de red; el autor advierte que Dijkstra tambien resuelve el problema
     del "camino de cuello de botella minimo" y que el flujo maximo se
     relaciona directamente con el corte minimo.
   - **Geometria computacional**: convex hull, area de poligonos, punto
     dentro de un poligono, con formulas y rutinas pre-escritas porque
     rara vez se implementan desde cero durante el contest.
   - **Algoritmos de strings**: KMP y Aho-Corasick para pattern matching,
     algoritmos de divide y venceras para palindromos, suffix
     array/tree.
   - Menciona ademas RMQ y LCA como dos de las tecnicas mas usadas en
     problemas sobre secuencias y arboles que no siempre se estudian a
     fondo desde el principio.
3. **Planificar el entrenamiento en equipo**: conocerse mejor (roles como
   lector de problemas, disenador de algoritmos, codificador/debugger),
   entrenamiento individual con especializacion por area, y entrenamiento
   en equipo enfocado en juicio de la situacion durante el contest y toma
   de decisiones del lider.

## Material de contest recomendado

Preparar, entre los tres integrantes: snippets de codigo corto y
reutilizable, un "handbook" con formulas (geometria, algebra lineal,
trigonometria), una libreria de codigo estandar (escrita y entendida por
el propio equipo, no copiada sin comprender) y una lista de recordatorios
de errores comunes propios del equipo.`,
  },
];

const ALL_TOPICS: TopicSeed[] = [...CPH_TOPICS, ...CP4_TOPICS, ...PAPER_TOPICS];

async function main() {
  const admin = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (!admin) {
    throw new Error(`No se encontro un usuario con email ${ADMIN_EMAIL}. Corre "npm run prisma:seed" primero.`);
  }

  let created = 0;
  let updated = 0;

  for (const topic of ALL_TOPICS) {
    const slug = slugify(topic.title);
    const existing = await prisma.notebookEntry.findUnique({ where: { slug } });

    if (existing) {
      await prisma.notebookEntry.update({
        where: { slug },
        data: {
          category: topic.category,
          content: topic.content,
          commonPitfalls: topic.commonPitfalls ?? null,
        },
      });
      updated += 1;
      continue;
    }

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
