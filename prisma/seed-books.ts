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
    content: `## De que trata

Capitulos 1-2 del libro. Antes de escribir codigo hay que estimar si un algoritmo
va a correr a tiempo: en un juez tipico se ejecutan del orden de 10^8-10^9
operaciones simples por segundo, asi que el limite de N del problema indica
que complejidad se necesita.

## Reglas de calculo

- Bucles anidados de tamano n y m: \`O(n*m)\`.
- Bucles secuenciales: se suman, y domina el termino mas grande.
- Recursion: la complejidad depende de cuantas llamadas se generan y de
  cuanto trabajo hace cada una (arbol de recursion).

## Guia rapida segun N

- N <= 10-12: fuerza bruta con permutaciones/subconjuntos (\`O(2^N)\` o \`O(N!)\`).
- N <= 20-24: DP sobre bitmask (\`O(2^N * N)\`).
- N <= 500-2000: algoritmos \`O(N^2)\` o \`O(N^2 log N)\`.
- N <= 10^6: \`O(N log N)\` o \`O(N)\`.
- N <= 10^8: solo \`O(N)\` con constante muy baja.

## Ejemplo introductorio: suma maxima de subarreglo

El algoritmo de Kadane resuelve en \`O(n)\` lo que a primera vista parece
\`O(n^2)\` o \`O(n^3)\`: se recorre el arreglo una vez manteniendo la mejor suma
que termina en la posicion actual, reiniciando a 0 cuando conviene.`,
  },
  {
    title: 'CPH: Ordenamiento y busqueda binaria',
    category: 'CPH - Tecnicas basicas',
    content: `## Teoria de ordenamiento

Los algoritmos de ordenamiento por comparacion tienen una cota inferior de
\`O(n log n)\`. Cuando los valores estan acotados (por ejemplo enteros en
\`[0, k]\`) se puede usar counting sort en \`O(n + k)\`, mas rapido que cualquier
algoritmo basado en comparaciones.

## Ordenar en C++

\`sort()\` con comparador personalizado permite ordenar por criterios
compuestos (por ejemplo, primero por un campo y luego por otro como
desempate). Es clave saber que \`sort()\` de la STL usa introsort
(quicksort + heapsort) y corre en \`O(n log n)\` en el peor caso.

## Busqueda binaria

Sobre un arreglo ordenado, reduce el espacio de busqueda a la mitad en cada
paso: \`O(log n)\`. Ademas de buscar un valor exacto (\`lower_bound\`,
\`upper_bound\`), la busqueda binaria se usa para **buscar en la respuesta**:
si una funcion \`f(x)\` es monotona (por ejemplo "es posible resolver el
problema con x recursos"), se puede binariar sobre \`x\` en vez de sobre un
arreglo.`,
    commonPitfalls:
      'Usar busqueda binaria sobre una funcion que no es realmente monotona. Errores de limites off-by-one en lower_bound/upper_bound.',
  },
  {
    title: 'CPH: Estructuras de datos dinamicas de C++',
    category: 'CPH - Tecnicas basicas',
    content: `## Arreglos dinamicos

\`vector\` crece automaticamente y amortiza sus inserciones al final en
\`O(1)\`. Es la estructura por defecto cuando no se necesita nada especial.

## Estructuras de conjuntos y mapas

\`set\`/\`multiset\` y \`map\`/\`multimap\` mantienen los elementos ordenados
usando un arbol balanceado (red-black tree), con insercion, borrado y
busqueda en \`O(log n)\`. Cuando no se necesita orden, \`unordered_set\` y
\`unordered_map\` (hash tables) dan \`O(1)\` esperado.

## Iteradores y rangos

Los iteradores permiten recorrer estructuras sin conocer su implementacion
interna; \`begin()\`/\`end()\` definen un rango \`[begin, end)\` semi-abierto,
convencion que se repite en toda la STL (\`lower_bound\`, \`sort\`, etc).

## Cuando usar cada una

Si los datos se pueden procesar todos de una vez, ordenar con \`sort\` y
recorrer suele ser mas simple y rapido (mejor constante) que mantener un
\`set\` dinamico. \`set\`/\`map\` se justifican cuando hay que intercalar
consultas y actualizaciones.`,
  },
  {
    title: 'CPH: Busqueda completa',
    category: 'CPH - Tecnicas basicas',
    content: `## Generar subconjuntos

Con \`n\` elementos hay \`2^n\` subconjuntos; se pueden generar iterando una
mascara de bits de \`0\` a \`2^n - 1\`, o recursivamente decidiendo
incluir/excluir cada elemento.

## Generar permutaciones

\`n!\` permutaciones; en C++ \`next_permutation\` las genera en orden
lexicografico, o se pueden generar recursivamente marcando elementos usados.

## Backtracking y poda

El patron general es probar una opcion, recursar, y deshacer (backtrack).
La poda (cortar ramas que ya no pueden mejorar la respuesta) es lo que
vuelve viable un backtracking que en el peor caso es exponencial.

## Meet in the middle

Cuando \`n\` es demasiado grande para \`O(2^n)\` pero \`O(2^(n/2))\` si alcanza
(por ejemplo \`n\` hasta ~40), se divide el conjunto en dos mitades, se genera
todas las combinaciones de cada mitad por separado y se combinan los
resultados (tipicamente ordenando una mitad y buscando en ella con busqueda
binaria).`,
  },
  {
    title: 'CPH: Algoritmos greedy',
    category: 'CPH - Tecnicas basicas',
    content: `## Problema de las monedas

Elegir siempre la moneda mas grande posible da el resultado optimo solo para
sistemas "canonicos" (como las monedas estandar); en sistemas arbitrarios el
greedy puede fallar y hace falta programacion dinamica.

## Scheduling (maximizar actividades)

Para maximizar el numero de actividades no solapadas, ordenar por tiempo de
**fin** y tomar greedy cada actividad compatible con la ultima elegida es
optimo.

## Tareas y plazos

Para minimizar la suma de tiempos de finalizacion, conviene procesar las
tareas en orden de duracion ascendente (las cortas primero).

## Minimizando sumas

Dado un punto \`p\` y valores \`a_i\`, la mediana de los \`a_i\` minimiza la suma
de \`|a_i - p|\`; la media minimiza la suma de \`(a_i - p)^2\`.

## Compresion de datos

Los codigos de Huffman construyen, greedy, un arbol binario optimo para
codificar simbolos segun su frecuencia: combinar siempre los dos nodos de
menor frecuencia con un min-heap.`,
  },
  {
    title: 'CPH: Programacion dinamica basica',
    category: 'CPH - Tecnicas basicas',
    content: `## Idea central

Un problema tiene subestructura optima si su solucion se puede construir a
partir de soluciones optimas de subproblemas mas pequenos, y subproblemas
superpuestos si esos subproblemas se repiten. DP resuelve cada subproblema
una sola vez (memoization top-down o tabulacion bottom-up).

## Ejemplos clasicos del capitulo

- **Coin problem**: numero minimo de monedas para formar una suma, \`O(suma * monedas)\`.
- **Longest increasing subsequence (LIS)**: version \`O(n^2)\` con DP simple, y
  version \`O(n log n)\` manteniendo el menor final posible de subsecuencias
  crecientes de cada longitud (busqueda binaria).
- **Caminos en una grilla**: contar/optimizar caminos con movimientos
  restringidos (derecha/abajo), DP sobre la celda actual.
- **Knapsack 0/1**: \`O(items * capacidad)\`, estado = mejor valor usando los
  primeros \`i\` items con capacidad \`c\`.
- **Distancia de edicion (Levenshtein)**: minimo de inserciones, borrados y
  sustituciones para transformar un string en otro, \`O(n*m)\`.
- **Conteo de tilings**: cubrir una grilla con piezas usando DP por columnas
  con un bitmask que representa el perfil de la columna actual.`,
    commonPitfalls:
      'Definir mal el estado (falta informacion para decidir la transicion). Recalcular subproblemas sin memoizar, perdiendo toda la ventaja de la DP.',
  },
  {
    title: 'CPH: Analisis amortizado',
    category: 'CPH - Tecnicas basicas',
    content: `## Idea general

Una operacion puede parecer costosa vista de forma aislada, pero si se
demuestra que el costo total de \`n\` operaciones es \`O(n)\`, el costo
amortizado por operacion es \`O(1)\`, aunque una operacion individual no lo
sea.

## Two pointers

En un arreglo (usualmente ordenado), dos indices se mueven siempre hacia
adelante (nunca retroceden), por lo que el trabajo total es \`O(n)\` en vez de
\`O(n^2)\` al probar todos los pares.

## Nearest smaller elements

Con una pila monotona creciente se encuentra, para cada elemento, el
elemento menor mas cercano a la izquierda/derecha en \`O(n)\` total: cada
elemento se agrega y se elimina de la pila a lo sumo una vez.

## Sliding window minimum

Con un deque monotono se mantiene el minimo de una ventana deslizante en
\`O(n)\` total: se descartan del final del deque los elementos mayores al
nuevo elemento antes de insertarlo, y del frente los que ya salieron de la
ventana.`,
  },
  {
    title: 'CPH: Consultas de rango',
    category: 'CPH - Tecnicas basicas',
    content: `## Consultas sobre arreglos estaticos

Si el arreglo no cambia, una sparse table permite responder consultas de
minimo/maximo de rango (RMQ) en \`O(1)\` tras un preprocesamiento
\`O(n log n)\`, aprovechando que \`min\`/\`max\` son idempotentes (los rangos se
pueden solapar).

## Binary Indexed Tree (Fenwick Tree)

Estructura compacta para sumas de prefijos: actualizar un punto y consultar
la suma de un prefijo cuestan \`O(log n)\` cada uno, usando el truco de
\`lowbit(i) = i & (-i)\` para saltar entre indices "responsables" de un rango.

## Segment tree

Generaliza a cualquier operacion asociativa (suma, min, max, gcd...):
consulta y actualizacion de rango en \`O(log n)\`, con \`O(4n)\` de espacio en
la implementacion clasica con arreglo.

## Tecnicas adicionales

El capitulo introduce brevemente lazy propagation (para actualizaciones de
rango, no solo puntuales) y estructuras combinadas; el detalle completo se
retoma en el capitulo de "Segment trees revisited".`,
  },
  {
    title: 'CPH: Manipulacion de bits',
    category: 'CPH - Tecnicas basicas',
    content: `## Representacion

Los enteros se guardan en complemento a dos; un \`int\` de 32 bits cubre
aproximadamente \`[-2^31, 2^31 - 1]\`.

## Operaciones bitwise

\`&\` (AND), \`|\` (OR), \`^\` (XOR), \`~\` (NOT), \`<<\`/\`>>\` (shifts). El XOR es
especialmente util porque es su propio inverso (\`a ^ b ^ b = a\`).

## Representar conjuntos

Un entero de \`n\` bits representa un subconjunto de \`{0, ..., n-1}\`:
\`mask | (1 << i)\` agrega \`i\`, \`mask & ~(1 << i)\` lo quita, \`mask & (1 << i)\`
verifica pertenencia. Esto habilita DP sobre bitmask.

## Optimizaciones y DP sobre bitmask

Funciones como \`__builtin_popcount\` (contar bits en 1) o
\`__builtin_ctz\` (contar ceros al final) evitan bucles manuales. Un ejemplo
clasico de DP sobre bitmask es el problema del vendedor viajante (TSP):
estado \`dp[mask][i]\` = costo minimo visitando exactamente el conjunto
\`mask\` terminando en \`i\`, \`O(2^n * n^2)\`.`,
  },
  {
    title: 'CPH: Fundamentos y recorrido de grafos',
    category: 'CPH - Algoritmos de grafos',
    content: `## Terminologia

Grafo = nodos + aristas. Puede ser dirigido o no dirigido, ponderado o no.
Un camino es una secuencia de nodos conectados por aristas; un ciclo es un
camino que vuelve al nodo inicial. El grado de un nodo es su numero de
aristas incidentes.

## Representacion

- **Matriz de adyacencia**: \`O(V^2)\` de espacio, \`O(1)\` para verificar si
  existe una arista. Conviene con grafos densos o \`V\` pequeno.
- **Lista de adyacencia**: \`O(V + E)\` de espacio, recorrer los vecinos de un
  nodo cuesta proporcional a su grado. Es la representacion por defecto en
  la mayoria de problemas.

## DFS y BFS

- **DFS** (recursivo o con pila explicita) explora tan profundo como sea
  posible antes de retroceder; util para detectar ciclos, componentes
  conexas y ordenamiento topologico.
- **BFS** (con cola) explora por niveles; en grafos no ponderados encuentra
  la distancia minima en numero de aristas.

## Aplicaciones

Encontrar componentes conexas (correr DFS/BFS desde cada nodo no
visitado), verificar si un grafo es bipartito (2-coloreo durante el
recorrido) y detectar ciclos.`,
  },
  {
    title: 'CPH: Caminos minimos',
    category: 'CPH - Algoritmos de grafos',
    content: `## Bellman-Ford

Relaja todas las aristas \`V - 1\` veces: \`O(V*E)\`. Soporta pesos negativos y
permite detectar ciclos negativos (si una arista se puede seguir relajando
en la iteracion extra).

## Dijkstra

Para grafos sin pesos negativos, con una cola de prioridad corre en
\`O((V + E) log V)\`:

\`\`\`cpp
vector<long long> dist(n, LLONG_MAX);
priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
dist[src] = 0;
pq.push({0, src});
while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    if (d > dist[u]) continue;
    for (auto [v, w] : adj[u])
        if (dist[u] + w < dist[v]) {
            dist[v] = dist[u] + w;
            pq.push({dist[v], v});
        }
}
\`\`\`

## Floyd-Warshall

Todos los pares de caminos minimos en \`O(V^3)\`, iterando sobre cada nodo
intermedio \`k\`: \`dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])\`.
Ideal cuando \`V\` es pequeno (hasta unos cientos).`,
    commonPitfalls:
      'Usar Dijkstra con pesos negativos (da resultados incorrectos). Olvidar el chequeo dist[u] + w < dist[v] antes de insertar de nuevo en la cola.',
  },
  {
    title: 'CPH: Algoritmos en arboles',
    category: 'CPH - Algoritmos de grafos',
    content: `## Recorrido de arboles

Un arbol es un grafo conexo sin ciclos con \`n\` nodos y \`n-1\` aristas. Al
recorrerlo con DFS/BFS conviene llevar el nodo padre para no retroceder por
la misma arista.

## Diametro

El camino mas largo entre dos nodos del arbol se encuentra con **dos**
recorridos: desde un nodo arbitrario se halla el nodo mas lejano \`a\`, y
desde \`a\` se halla el nodo mas lejano \`b\`; la distancia \`a-b\` es el
diametro. Funciona porque el arbol no tiene ciclos.

## Todos los caminos mas largos

Para calcular, desde cada nodo, la distancia al nodo mas lejano, se hacen
dos pasadas de DP en arbol ("rerooting"): una hacia las hojas y otra
propagando informacion del padre hacia abajo, evitando recalcular desde
cada nodo por separado (que seria \`O(n^2)\`).

## Arboles binarios

Un arbol binario completo se puede representar sin punteros usando indices:
el hijo izquierdo de \`i\` es \`2i\`, el derecho \`2i+1\` (base 1); es la misma
idea que usan los heaps y los segment trees.`,
  },
  {
    title: 'CPH: Arboles de expansion minima',
    category: 'CPH - Algoritmos de grafos',
    content: `## Kruskal

Ordena todas las aristas por peso ascendente y las agrega greedy si no
forman un ciclo (verificado con Union-Find): \`O(E log E)\`.

## Union-Find (Disjoint Set Union)

Cada conjunto se representa como un arbol; \`find\` sigue punteros al padre
hasta la raiz, \`union\` conecta dos raices. Con **compresion de camino**
(aplanar el arbol al hacer \`find\`) y **union por rango/tamano** (colgar el
arbol mas chico del mas grande), cada operacion cuesta \`O(\\alpha(n))\`,
practicamente \`O(1)\`.

## Prim

Crece el arbol de expansion agregando, en cada paso, la arista mas barata
que conecta un nodo ya incluido con uno que no lo esta; con una cola de
prioridad corre en \`O(E log V)\`, similar en espiritu a Dijkstra pero
comparando el peso de la arista en vez de la distancia acumulada.`,
  },
  {
    title: 'CPH: Grafos dirigidos y DP en DAG',
    category: 'CPH - Algoritmos de grafos',
    content: `## Ordenamiento topologico

Solo existe si el grafo es un DAG (dirigido y aciclico). Se puede obtener
con DFS (agregar cada nodo a una lista al terminar de procesarlo, e
invertir la lista) o con el algoritmo de Kahn (procesar iterativamente los
nodos con grado de entrada 0).

## Programacion dinamica sobre un DAG

Una vez que se tiene el orden topologico, se puede calcular el camino mas
largo/corto o el numero de caminos entre nodos procesando en ese orden:
cada nodo ya tiene resueltos todos sus predecesores.

## Caminos de sucesor (binary lifting)

Para responder "¿a que nodo se llega tras k pasos siguiendo sucesores?" en
\`O(log k)\`, se precomputa \`up[j][v]\` = nodo al que se llega desde \`v\` tras
\`2^j\` pasos, y se combina en binario.

## Deteccion de ciclos

Durante un DFS, marcar cada nodo con tres estados (blanco = no visitado,
gris = en la pila de recursion, negro = terminado); si se encuentra una
arista hacia un nodo gris, hay un ciclo.`,
  },
  {
    title: 'CPH: Conectividad fuerte y 2-SAT',
    category: 'CPH - Algoritmos de grafos',
    content: `## Componentes fuertemente conexas (SCC)

Un subconjunto de nodos donde todo par es mutuamente alcanzable. El
algoritmo de Kosaraju las encuentra en \`O(V + E)\`: (1) DFS en el grafo
original guardando el orden de finalizacion, (2) DFS en el grafo
**transpuesto** (aristas invertidas) procesando los nodos en orden inverso
de finalizacion; cada arbol de ese segundo DFS es una SCC.

## 2-SAT

Problema de satisfacer una formula booleana en forma \`(a OR b) AND (c OR d)
AND ...\` con dos literales por clausula. Se modela como un grafo de
implicaciones: cada clausula \`(x OR y)\` agrega las implicaciones
\`\\lnot x \\to y\` y \`\\lnot y \\to x\`. La formula es satisfacible si y solo si
ninguna variable y su negacion caen en la misma componente fuertemente
conexa; la asignacion se obtiene del orden topologico de las SCC.`,
  },
  {
    title: 'CPH: Consultas en arboles y LCA',
    category: 'CPH - Algoritmos de grafos',
    content: `## Encontrar ancestros (binary lifting)

Precomputando \`up[j][v]\` = ancestro de \`v\` a \`2^j\` niveles de distancia, se
responde "el k-esimo ancestro de v" en \`O(log n)\` en vez de \`O(k)\`.

## Subarboles y caminos (Euler tour)

Asignando a cada nodo un tiempo de entrada y salida durante un DFS, el
subarbol de un nodo corresponde exactamente a un rango contiguo de tiempos.
Esto permite responder consultas sobre subarboles (suma, actualizacion)
usando un Fenwick tree o segment tree sobre ese rango.

## Lowest Common Ancestor (LCA)

El ancestro comun mas profundo de dos nodos. Se puede calcular con binary
lifting (subir el mas profundo al mismo nivel y luego subir ambos juntos en
\`O(log n)\`), o reduciendolo a un RMQ sobre el recorrido de Euler del arbol
(con sparse table, \`O(1)\` por consulta tras \`O(n log n)\` de preprocesamiento).

## Algoritmos offline

El algoritmo de Tarjan para LCA offline resuelve todas las consultas en una
sola pasada de DFS usando Union-Find, sin necesidad de precomputar binary
lifting.`,
  },
  {
    title: 'CPH: Caminos y circuitos',
    category: 'CPH - Algoritmos de grafos',
    content: `## Caminos y circuitos Eulerianos

Visitan **cada arista** exactamente una vez. Un grafo no dirigido conexo
tiene un circuito Euleriano si y solo si todos los nodos tienen grado par
(un camino Euleriano si exactamente 0 o 2 nodos tienen grado impar). Se
construyen con el algoritmo de Hierholzer en \`O(E)\`.

## Caminos y ciclos Hamiltonianos

Visitan **cada nodo** exactamente una vez. A diferencia del caso Euleriano,
no existe una condicion simple: decidir si existen es NP-completo en
general. Para \`n\` pequeno (hasta ~20) se resuelve con DP sobre bitmask
(el problema del vendedor viajante), \`O(2^n * n^2)\`.

## Secuencias de De Bruijn

Una secuencia ciclica que contiene, como subcadena, cada combinacion
posible de \`k\` simbolos de un alfabeto de tamano \`n\` exactamente una vez;
se construye encontrando un circuito Euleriano en un grafo cuyos nodos son
las secuencias de largo \`k-1\`.

## Recorridos de caballo

Encontrar un camino Hamiltoniano de un caballo de ajedrez por todo el
tablero; en la practica se resuelve con backtracking guiado por la
heuristica de Warnsdorff (moverse siempre hacia la casilla con menos
opciones futuras).`,
  },
  {
    title: 'CPH: Flujos y cortes',
    category: 'CPH - Algoritmos de grafos',
    content: `## Ford-Fulkerson

Encuentra el flujo maximo entre una fuente y un sumidero buscando
repetidamente caminos de aumento (con capacidad residual disponible) y
enviando flujo por ellos hasta que no queden caminos de aumento. Con BFS
para elegir el camino (Edmonds-Karp) la complejidad es \`O(V * E^2)\`.

## Flujo maximo = corte minimo

Teorema fundamental: el valor del flujo maximo es igual a la capacidad del
corte minimo (particion de los nodos en dos conjuntos, fuente en uno y
sumidero en otro, que minimiza la suma de capacidades de las aristas que
cruzan).

## Caminos disjuntos

El numero maximo de caminos disjuntos en aristas (o en nodos) entre dos
nodos es un caso particular de flujo maximo con capacidades unitarias.

## Emparejamientos maximos y cobertura de caminos

El emparejamiento maximo en un grafo bipartito se reduce a flujo maximo
(fuente conectada a un lado, sumidero al otro, capacidades 1). La cobertura
de caminos minima en un DAG tambien se resuelve modelandola como un
emparejamiento bipartito.`,
    commonPitfalls:
      'Olvidar modelar las aristas residuales (capacidad inversa) al implementar Ford-Fulkerson/Edmonds-Karp.',
  },
  {
    title: 'CPH: Teoria de numeros',
    category: 'CPH - Temas avanzados',
    content: `## Primos y factores

La criba de Eratostenes marca todos los numeros primos hasta \`n\` en
\`O(n log log n)\`. Para factorizar un numero individual basta probar
divisores hasta su raiz cuadrada: \`O(\\sqrt{n})\`.

## Aritmetica modular

\`(a + b) mod p = ((a mod p) + (b mod p)) mod p\`, igual para la
multiplicacion. La exponenciacion rapida calcula \`a^b mod p\` en
\`O(log b)\` elevando al cuadrado repetidamente. El inverso modular (para
"dividir" bajo modulo) se obtiene con el teorema de Fermat
(\`a^{-1} = a^{p-2} mod p\` si \`p\` es primo) o con el algoritmo extendido de
Euclides cuando el modulo no es primo pero \`\\gcd(a, m) = 1\`.

## Resolver ecuaciones

Ecuaciones diofanticas lineales (\`ax + by = c\`) se resuelven con el
algoritmo extendido de Euclides; el teorema chino del residuo combina
congruencias con modulos coprimos en una sola congruencia equivalente.

## Otros resultados

La funcion \`\\phi\` de Euler cuenta los enteros menores que \`n\` coprimos con
\`n\`; el teorema de Euler generaliza el pequeno teorema de Fermat a modulos
no primos.`,
    commonPitfalls:
      'Overflow al multiplicar dos numeros grandes antes de aplicar el modulo (usar long long / __int128 segun el caso). Calcular el inverso modular con Fermat cuando el modulo no es primo.',
  },
  {
    title: 'CPH: Combinatoria',
    category: 'CPH - Temas avanzados',
    content: `## Coeficientes binomiales

\`C(n, k)\` cuenta subconjuntos de tamano \`k\` de un conjunto de \`n\`
elementos. Se calculan con el triangulo de Pascal (\`O(n^2)\` para toda la
tabla), con la formula factorial, o con factoriales precomputados e
inversos modulares cuando se necesita bajo modulo.

## Numeros de Catalan

Cuentan estructuras balanceadas: secuencias validas de parentesis, arboles
binarios con \`n\` nodos, formas de triangular un poligono, etc. Formula:
\`C_n = C(2n, n) / (n + 1)\`.

## Inclusion-exclusion

Para contar la union de varios conjuntos sin contar de mas: se suman los
conjuntos individuales, se restan las intersecciones de a pares, se suman
las de a tres, y asi alternando.

## Lema de Burnside

Cuenta configuraciones distintas bajo simetrias de un grupo (rotaciones,
reflexiones): el numero de clases de equivalencia es el promedio, sobre
todas las simetrias del grupo, del numero de configuraciones que cada
simetria deja fijas.

## Formula de Cayley

El numero de arboles etiquetados distintos con \`n\` nodos es \`n^{n-2}\`.`,
  },
  {
    title: 'CPH: Matrices',
    category: 'CPH - Temas avanzados',
    content: `## Operaciones

Suma en \`O(n^2)\`, multiplicacion de matrices \`n \\times n\` en \`O(n^3)\` con el
algoritmo clasico.

## Recurrencias lineales

Una recurrencia lineal (como Fibonacci) se puede expresar como
multiplicacion por una matriz de transicion, y calcular el n-esimo termino
en \`O(k^3 \\log n)\` (con \`k\` = orden de la recurrencia) usando
exponenciacion rapida de matrices, en vez de \`O(n)\` iterando termino a
termino.

## Grafos y matrices

La matriz de adyacencia elevada a la potencia \`k\` da, en la posicion
\`(i, j)\`, el numero de caminos de longitud exactamente \`k\` entre \`i\` y
\`j\`. Esto permite contar caminos de longitud fija con exponenciacion rapida
de matrices en \`O(V^3 \\log k)\`.`,
  },
  {
    title: 'CPH: Probabilidad',
    category: 'CPH - Temas avanzados',
    content: `## Calculo basico y eventos

Probabilidad de un evento, eventos independientes (\`P(A \\cap B) = P(A)P(B)\`)
y dependientes (probabilidad condicional).

## Variables aleatorias

El valor esperado es lineal incluso cuando las variables no son
independientes: \`E[X + Y] = E[X] + E[Y]\`. Esta propiedad ("linealidad de la
esperanza") simplifica muchisimos problemas de conteo esperado sin tener
que analizar la dependencia entre eventos.

## Cadenas de Markov

Procesos donde el siguiente estado depende solo del estado actual (no del
historial). Se modelan con una matriz de transicion; distribuciones futuras
se obtienen multiplicando esa matriz repetidamente (o elevandola a una
potencia).

## Algoritmos aleatorizados

Usan aleatoriedad para simplificar o acelerar un algoritmo (por ejemplo,
hashing con un modulo o semilla aleatoria para evitar ataques adversarios
en jueces online, o el pivote aleatorio de quickselect para obtener
\`O(n)\` esperado).`,
  },
  {
    title: 'CPH: Teoria de juegos',
    category: 'CPH - Temas avanzados',
    content: `## Estados de juego

Un juego combinatorio se puede modelar como un grafo de estados donde cada
jugador, en su turno, mueve a otro estado; un estado es ganador si existe
al menos un movimiento a un estado perdedor para el rival.

## Juego de Nim

Varios montones de piedras; en cada turno un jugador quita piedras de un
solo monton. La posicion es perdedora (para quien esta por mover) si y solo
si el XOR de los tamanos de todos los montones es 0.

## Teorema de Sprague-Grundy

Generaliza Nim a cualquier juego imparcial: a cada estado se le asigna un
"valor de Grundy" = \`mex\` (minimum excludant: el menor entero no negativo
que no aparece) de los valores de Grundy de sus estados sucesores. Un
estado es perdedor si su valor de Grundy es 0. Para un juego compuesto por
varios subjuegos independientes, el valor de Grundy total es el XOR de los
valores de cada subjuego, reduciendolo exactamente al analisis de Nim.`,
  },
  {
    title: 'CPH: Algoritmos de strings',
    category: 'CPH - Temas avanzados',
    content: `## Terminologia

Subcadena (contigua) vs subsecuencia (no necesariamente contigua), prefijo
y sufijo.

## Estructura Trie

Arbol donde cada arista representa un caracter; insertar o buscar una
palabra cuesta \`O(longitud)\`. Util para diccionarios y para encontrar
prefijos comunes entre muchas palabras.

## Hashing de strings

Un "rolling hash" polinomial permite comparar si dos subcadenas son iguales
en \`O(1)\` tras un preprocesamiento \`O(n)\`, calculando el hash de cualquier
subcadena a partir de prefijos precomputados. Se recomienda usar un modulo
grande (o dos hashes con modulos distintos) para evitar colisiones
adversarias.

## Z-algorithm

Calcula, para cada posicion \`i\` del string, la longitud del prefijo comun
mas largo entre el string completo y el sufijo que empieza en \`i\`
(\`Z[i]\`), en \`O(n)\`. Concatenando patron + separador + texto, permite
resolver pattern matching (encontrar todas las ocurrencias de un patron) en
\`O(n + m)\`, igual que KMP.`,
  },
  {
    title: 'CPH: Algoritmos de raiz cuadrada',
    category: 'CPH - Temas avanzados',
    content: `## Idea general

Dividir los datos en bloques de tamano aproximado \`\\sqrt{n}\` balancea el
costo de preprocesar cada bloque con el costo de recorrer bloques
completos, dando complejidades del orden \`O(\\sqrt{n})\` por operacion en vez
de \`O(n)\` o de necesitar una estructura mas compleja como un segment tree.

## Combinar algoritmos

A veces conviene resolver un problema con un algoritmo distinto segun el
tamano de la entrada (por ejemplo, fuerza bruta para casos chicos y una
estructura con sqrt decomposition para el resto), aprovechando que ambos
casos quedan acotados por \`O(\\sqrt{n})\`.

## Particiones de enteros

Contar las formas de escribir \`n\` como suma de enteros positivos se puede
acelerar con DP que aprovecha que solo hay \`O(\\sqrt{n})\` valores distintos
de \`n / k\`.

## Algoritmo de Mo

Responde consultas de rango **offline** (todas conocidas de antemano)
ordenandolas por bloques de \`\\sqrt{n}\` y moviendo dos punteros de forma que
el total de movimientos sea \`O((n + q)\\sqrt{n})\`, en vez de recalcular cada
consulta desde cero.`,
  },
  {
    title: 'CPH: Segment trees revisited',
    category: 'CPH - Temas avanzados',
    content: `## Lazy propagation

Para actualizaciones de **rango** (no solo puntuales), no se propaga el
cambio a los hijos de inmediato: se guarda una marca pendiente en el nodo y
solo se empuja hacia abajo cuando realmente hace falta visitar un hijo
(otra consulta o actualizacion lo requiere). Cada nodo mantiene la
invariante de reflejar su subarbol "como si" sus marcas ya se hubieran
aplicado, aunque sus hijos aun no lo sepan.

## Arboles dinamicos

Segment trees implementados sobre un rango enorme (por ejemplo
\`[0, 10^9]\`) sin poder reservar \`O(n)\` nodos de antemano: los nodos se
crean sobre la marcha solo cuando se visitan (segment tree implicito /
dinamico).

## Estructuras de datos como valor de nodo

Cada nodo del segment tree puede guardar una estructura mas compleja que un
numero (por ejemplo un \`set\` ordenado, dando un "merge sort tree") para
responder consultas mas ricas que suma/min/max.

## Segment trees 2D

Un segment tree cuyos nodos son a su vez segment trees sobre la otra
dimension, para consultas de rango sobre una matriz en \`O(log^2 n)\`.`,
  },
  {
    title: 'CPH: Geometria computacional basica',
    category: 'CPH - Temas avanzados',
    content: `## Numeros complejos

Representar un punto \`(x, y)\` como \`x + yi\` simplifica rotaciones
(multiplicar por \`e^{i\\theta}\`) y traslaciones (suma), evitando escribir
manualmente las formulas trigonometricas.

## Puntos y lineas

El producto cruzado de dos vectores \`(a \\times b)\` indica la orientacion
de un giro (izquierda, derecha o colineal) y su signo es la base de casi
todos los algoritmos geometricos (convex hull, interseccion de segmentos,
punto dentro de poligono).

## Area de poligonos

La formula del shoelace (\`suma cruzada de coordenadas consecutivas / 2\`)
calcula el area de cualquier poligono simple (convexo o no) en \`O(n)\`
conociendo sus vertices en orden.

## Funciones de distancia

Distancia euclidiana (\`\\sqrt{\\Delta x^2 + \\Delta y^2}\`), Manhattan
(\`|\\Delta x| + |\\Delta y|\`) y Chebyshev (\`max(|\\Delta x|, |\\Delta y|)\`);
elegir la correcta segun si el movimiento permitido es diagonal, ortogonal
o libre.`,
    commonPitfalls: 'Usar coordenadas float en vez de enteros o double cuando la precision importa; comparar areas/orientaciones con == en vez de con un epsilon o aritmetica entera exacta.',
  },
  {
    title: 'CPH: Algoritmos de barrido (sweep line)',
    category: 'CPH - Temas avanzados',
    content: `## Idea general

Una linea imaginaria "barre" el plano (usualmente de izquierda a derecha)
deteniendose en eventos relevantes (inicio/fin de un segmento, un punto),
manteniendo una estructura de datos ordenada con el estado actual del
barrido. Convierte problemas geometricos en problemas de rango sobre esa
estructura.

## Puntos de interseccion

Para detectar si un conjunto de segmentos tiene alguna interseccion, se
barre por \`x\` manteniendo los segmentos activos ordenados por \`y\`;
solo hace falta comparar segmentos vecinos en ese orden, no todos los
pares.

## Problema del par mas cercano

Con divide and conquer (dividir por \`x\`, resolver cada mitad, y revisar
solo una franja estrecha cerca del corte donde el par mas cercano podria
cruzar mitades) se resuelve en \`O(n \\log n)\`, en vez de \`O(n^2)\` probando
todos los pares.

## Envolvente convexa (convex hull)

El menor poligono convexo que contiene todos los puntos. El algoritmo de
Graham scan (ordenar por angulo y barrer manteniendo solo giros consistentes
con una pila) o Andrew's monotone chain (ordenar por \`x\` y construir la
cadena superior e inferior) lo calculan en \`O(n \\log n)\`.`,
  },
];

// ── CP4: Competitive Programming 4, Book 1 (Halim & Halim & Effendy) ──
// docs/libros/cp4.pdf
const CP4_TOPICS: TopicSeed[] = [
  {
    title: 'CP4: Fundamentos y consejos de programacion competitiva',
    category: 'CP4 - Introduccion',
    content: `## Los 7 consejos del capitulo 1

1. **Tipear codigo rapido**: menos tiempo tipeando es mas tiempo pensando.
2. **Identificar el tipo de problema rapido**: reconocer patrones (busqueda,
   grafos, geometria, DP, ad hoc) apenas se lee el enunciado.
3. **Analizar el algoritmo antes de codear**: estimar la complejidad
   necesaria segun los limites del problema (N, tiempo limite).
4. **Dominar el lenguaje**: conocer bien la libreria estandar de C++/Java/
   Python evita reinventar estructuras basicas en el contest.
5. **Dominar el arte de testear**: probar casos limite (vacios, minimos,
   maximos, con empates) antes de enviar.
6. **Practicar constantemente**: la habilidad se construye resolviendo
   muchos problemas, no solo leyendo teoria.
7. **Trabajo en equipo (ICPC)**: coordinar roles y evitar cuellos de
   botella en la computadora compartida.

## Anatomia de un problema de contest

Enunciado, formato de entrada/salida, restricciones (limites de N y de los
valores), ejemplos de entrada/salida, y a veces limites de tiempo/memoria
especificos por caso.

## Problemas ad hoc

No encajan en ninguna categoria algoritmica estandar; requieren leer con
cuidado y modelar el problema desde cero en vez de aplicar una tecnica
conocida.`,
  },
  {
    title: 'CP4: Arreglos, bitmask y enteros grandes',
    category: 'CP4 - Estructuras de datos',
    content: `## Array

La estructura mas basica; muchos problemas de "ordenamiento especial"
(encontrar el k-esimo elemento, comprimir coordenadas a un rango pequeno
para poder indexarlas) se resuelven combinando array + sort.

## Bitmask

Representa un subconjunto pequeno (hasta ~20-30 elementos) como un entero,
con operaciones de pertenencia/union/interseccion en \`O(1)\` a nivel de
bits. Es la base de la DP sobre bitmask (por ejemplo TSP).

## Big Integer

Cuando un numero excede el rango de \`long long\` (~9.2 * 10^18), se necesita
aritmetica de precision arbitraria: Python la tiene nativa en sus enteros,
Java ofrece la clase \`BigInteger\`, y en C++ hay que implementarla o usar
una libreria (no forma parte de la STL estandar).`,
  },
  {
    title: 'CP4: Estructuras enlazadas y basadas en pila',
    category: 'CP4 - Estructuras de datos',
    content: `## Listas enlazadas

Utiles cuando se necesitan inserciones/borrados frecuentes en el medio de
la secuencia sin desplazar elementos, algo que un \`vector\` no puede hacer
en \`O(1)\`. En la practica compiten con estructuras mas simples (arrays,
sets) segun el patron de acceso del problema.

## Problemas especiales con pilas

- **Balanceo de parentesis**: apilar aperturas y hacer *pop* al ver el
  cierre correspondiente; si la pila no queda vacia al final, esta
  desbalanceado.
- **Evaluacion de expresiones**: convertir a notacion polaca (postfix) con
  una pila de operadores respetando precedencia, y luego evaluar el postfix
  con otra pila de operandos.
- **Rectangulo mas grande en un histograma**: con una pila monotona
  creciente de indices se resuelve en \`O(n)\`, en vez de \`O(n^2)\` probando
  cada par de barras.`,
  },
  {
    title: 'CP4: Heap, hash table, bBST y order statistics tree',
    category: 'CP4 - Estructuras de datos',
    content: `## Binary heap (priority queue)

Arbol binario casi completo donde cada padre es menor (min-heap) o mayor
(max-heap) que sus hijos; insertar y extraer el minimo/maximo cuestan
\`O(log n)\`. Es la base de Dijkstra y Prim con cola de prioridad.

## Hash table

Almacena pares clave-valor con acceso, insercion y borrado \`O(1)\`
esperado, a costa de perder el orden y de un peor caso \`O(n)\` si hay muchas
colisiones.

## Balanced BST (bBST)

\`set\`/\`map\` en C++ (o \`TreeSet\`/\`TreeMap\` en Java) mantienen los
elementos ordenados con operaciones \`O(log n)\`: a diferencia de un hash
table, permiten recorrer en orden y buscar el sucesor/predecesor de un
valor.

## Order statistics tree

Extension de un bBST (por ejemplo con \`policy_tree\` de la libreria
\`pb_ds\` en C++) que ademas responde en \`O(log n)\`: "¿cual es el k-esimo
elemento?" y "¿que posicion (rango) ocupa este elemento?", algo que un
\`set\` estandar no puede hacer directamente.`,
  },
  {
    title: 'CP4: Union-Find Disjoint Sets',
    category: 'CP4 - Estructuras de datos',
    content: `## Representacion

Cada elemento apunta a un "padre"; el representante de un conjunto es la
raiz de su arbol (el nodo que es padre de si mismo).

## Optimizaciones

- **Compresion de camino**: al hacer \`find\`, se hace que todos los nodos
  visitados apunten directamente a la raiz, aplanando el arbol.
- **Union por rango/tamano**: al unir dos conjuntos, se cuelga el arbol mas
  chico (o de menor "rango") del mas grande, evitando arboles muy
  profundos.

Con ambas optimizaciones juntas, cada operacion cuesta \`O(\\alpha(n))\`
amortizado (funcion inversa de Ackermann), practicamente constante para
cualquier \`n\` realista.

## Aplicaciones

Algoritmo de Kruskal para MST, mantener componentes conexas mientras se
agregan aristas dinamicamente, y deteccion de ciclos al agregar una arista
(si sus dos extremos ya estan en el mismo conjunto).`,
  },
  {
    title: 'CP4: Fenwick Tree (Binary Indexed Tree)',
    category: 'CP4 - Estructuras de datos',
    content: `## Idea

Cada posicion \`i\` del arreglo interno es "responsable" de un rango de
tamano \`lowbit(i) = i & (-i)\` (la potencia de 2 mas baja que divide a
\`i\`). Esto permite construir sumas de prefijos con solo \`O(log n)\` sumas
parciales.

\`\`\`cpp
void update(int i, long long delta) {
    for (; i <= n; i += i & (-i)) bit[i] += delta;
}
long long prefixSum(int i) {
    long long s = 0;
    for (; i > 0; i -= i & (-i)) s += bit[i];
    return s;
}
\`\`\`

## Update y query en O(log n)

Actualizar un punto y consultar la suma de un prefijo cuestan \`O(log n)\`
cada uno; la suma de un rango \`[l, r]\` es \`prefixSum(r) - prefixSum(l-1)\`.

## Extensiones a rangos

Con un segundo Fenwick tree auxiliar se puede soportar tambien
actualizacion de **rango** con consulta puntual, o incluso actualizacion y
consulta de rango combinadas, usando la tecnica de "diferencias" sobre dos
BITs.`,
  },
  {
    title: 'CP4: Segment Tree (CP4)',
    category: 'CP4 - Estructuras de datos',
    content: `## Construccion y operaciones

Arbol binario donde cada nodo cubre un rango del arreglo original; se
construye en \`O(n)\` y responde consultas y actualizaciones de rango en
\`O(\\log n)\`, para cualquier operacion asociativa (suma, minimo, maximo,
gcd, etc), no solo sumas de prefijo.

## Variantes

Min-segment-tree, max-segment-tree, segment tree de suma con lazy
propagation para actualizaciones de rango, o combinaciones (por ejemplo
guardar min y su cantidad de apariciones en el mismo nodo).

## Comparacion con Fenwick Tree

El segment tree es mas flexible (soporta cualquier operacion asociativa y
actualizaciones de rango de forma natural) pero tiene una constante mayor
en tiempo y espacio (\`O(4n)\`) que un Fenwick tree, que es mas simple y
rapido pero limitado principalmente a sumas de prefijo.`,
  },
  {
    title: 'CP4: Busqueda completa',
    category: 'CP4 - Paradigmas de resolucion',
    content: `## Busqueda completa iterativa

Bucles anidados (o generacion explicita de combinaciones/permutaciones)
que prueban todas las posibilidades. Viable cuando el espacio de busqueda
es pequeno segun los limites del problema.

## Busqueda completa recursiva (backtracking)

Una funcion recursiva construye la solucion paso a paso, y retrocede
("backtrack") cuando una rama no puede llevar a una solucion valida.

## Tips de busqueda completa

- Podar tan pronto como sea posible (cortar ramas invalidas antes de
  seguir profundizando).
- Generar y probar: a veces es mas facil generar todas las candidatas y
  filtrar las validas que construir solo las validas.
- Verificar cuidadosamente los limites del problema: \`N\` pequeno
  (\`<= 20-25\`) suele ser la senal de que se espera fuerza bruta o DP sobre
  bitmask, no un algoritmo mas sofisticado.`,
  },
  {
    title: 'CP4: Divide y venceras, busqueda binaria y ternaria',
    category: 'CP4 - Paradigmas de resolucion',
    content: `## Patron general de divide y venceras

Dividir el problema en subproblemas mas chicos del mismo tipo, resolver
cada uno (recursivamente) y combinar sus resultados. Ejemplo clasico: merge
sort, o contar inversiones durante el *merge*.

## Usos no obvios de la busqueda binaria

Mas alla de buscar un valor en un arreglo ordenado, la busqueda binaria
sirve para **buscar en la respuesta** (parametric search): si existe una
funcion \`f(x)\` monotona (por ejemplo, "¿es posible resolver el problema
usando a lo sumo x unidades de recurso?"), se puede binariar sobre \`x\` en
vez de calcular la respuesta directamente.

## Busqueda ternaria

Para funciones unimodales (que crecen y luego decrecen, o viceversa),
permite encontrar el maximo/minimo evaluando la funcion en dos puntos
interiores del rango y descartando el tercio que no puede contener el
optimo, en \`O(\\log n)\` evaluaciones.`,
  },
  {
    title: 'CP4: Algoritmos greedy (CP4)',
    category: 'CP4 - Paradigmas de resolucion',
    content: `## Ejemplos clasicos

Scheduling de actividades (ordenar por tiempo de fin), codigos de Huffman
para compresion, y los algoritmos de MST (Kruskal y Prim) son greedy que
resultan optimos.

## Como reconocer y demostrar un greedy correcto

Dos argumentos tipicos:

- **Propiedad de eleccion greedy**: la primera decision greedy siempre
  forma parte de alguna solucion optima, asi que se puede "fijar" sin
  perder generalidad.
- **Argumento de intercambio**: si una solucion optima no sigue el criterio
  greedy, se puede modificar (intercambiando dos elementos) para que lo
  siga sin empeorar el resultado.

## Cuando el greedy falla

Si no se puede demostrar ninguna de las dos propiedades (o se encuentra un
contraejemplo), el problema probablemente necesita programacion dinamica
en vez de una decision local greedy.`,
  },
  {
    title: 'CP4: Programacion dinamica (CP4)',
    category: 'CP4 - Paradigmas de resolucion',
    content: `## Ilustracion de DP

Un problema admite DP cuando tiene **subestructura optima** (la solucion
optima se construye a partir de soluciones optimas de subproblemas) y
**subproblemas superpuestos** (los mismos subproblemas reaparecen muchas
veces). Sin la segunda propiedad, la recursion simple ya alcanza.

## Top-down vs bottom-up

- **Top-down (memoization)**: se escribe la recursion natural del problema
  y se cachea el resultado de cada estado la primera vez que se calcula.
- **Bottom-up (tabulacion)**: se llenan los estados en un orden tal que las
  dependencias ya esten resueltas, sin usar recursion.

## Ejemplos clasicos

LCS (subsecuencia comun mas larga), LIS (subsecuencia creciente mas
larga), knapsack 0/1, coin change, matrix chain multiplication.

## Ejemplos no clasicos

DP sobre bitmask (subconjuntos como estado), DP sobre arboles (combinar
resultados de subarboles), y DP con estados aumentados (agregar
dimensiones extra al estado, como "cuantas veces ya se uso un recurso").`,
  },
  {
    title: 'CP4: Recorridos de grafos (DFS/BFS y aplicaciones)',
    category: 'CP4 - Grafos',
    content: `## DFS y BFS

Las dos formas basicas de explorar un grafo; DFS con recursion o pila
explicita, BFS con una cola. Ambas son \`O(V + E)\`.

## Componentes conexas

Correr DFS/BFS desde cada nodo no visitado; cada corrida marca una
componente conexa completa.

## Flood fill

DFS/BFS sobre una grilla implicita (cada celda es un nodo, las adyacentes
son sus vecinos) para encontrar regiones conectadas, por ejemplo en
problemas de "contar islas".

## Ordenamiento topologico y verificacion de bipartito

Ordenamiento topologico solo aplica a DAGs (ver DFS con post-orden
invertido). Un grafo es bipartito si se puede 2-colorear de forma que
ningun par de nodos adyacentes comparta color; se verifica con un
BFS/DFS que alterna colores y falla si encuentra un conflicto.

## Deteccion de ciclos en grafos dirigidos

Marcar los nodos con tres estados durante el DFS (no visitado, en la pila
de recursion actual, terminado); una arista hacia un nodo en la pila
actual indica un ciclo.`,
  },
  {
    title: 'CP4: Puntos de articulacion, puentes y componentes fuertemente conexas',
    category: 'CP4 - Grafos',
    content: `## Algoritmo de Tarjan (low-link)

Durante un unico DFS se calculan dos valores por nodo: \`disc[v]\` (el
momento en que se descubrio) y \`low[v]\` (el menor \`disc\` alcanzable desde
\`v\` usando a lo sumo una arista de retroceso). Comparando \`disc\` y \`low\`
entre un nodo y sus hijos en el arbol de DFS se detectan:

- **Puentes**: una arista \`(u, v)\` es puente si \`low[v] > disc[u]\`
  (quitarla desconecta el grafo).
- **Puntos de articulacion**: un nodo \`u\` lo es si quitarlo desconecta el
  grafo (con reglas especiales para la raiz del DFS, que necesita mas de
  un hijo en el arbol de DFS).

Complejidad \`O(V + E)\`.

## Componentes fuertemente conexas (SCC)

En grafos **dirigidos**, el mismo esquema de \`disc\`/\`low\` (algoritmo de
Tarjan para SCC) o el algoritmo de Kosaraju (dos DFS, uno sobre el grafo
transpuesto) encuentran las componentes fuertemente conexas en
\`O(V + E)\`.`,
  },
  {
    title: 'CP4: Arbol de expansion minima (MST)',
    category: 'CP4 - Grafos',
    content: `## Kruskal

Ordena las aristas por peso ascendente y las agrega greedy con Union-Find
para evitar ciclos: \`O(E \\log E)\`. Conviene cuando el grafo es disperso o
las aristas ya vienen (o son faciles de) ordenar.

## Prim

Crece el arbol desde un nodo inicial agregando siempre la arista mas
barata que conecta el arbol actual con un nodo fuera de el, usando una cola
de prioridad: \`O(E \\log V)\`. Conviene con grafos densos representados como
matriz de adyacencia (version \`O(V^2)\` sin heap).

## Otras aplicaciones

Arbol de expansion **maxima** (invertir el criterio de comparacion),
segundo mejor MST, y clustering (cortar las \`k-1\` aristas mas caras de un
MST para obtener \`k\` grupos maximizando la distancia minima entre
grupos).`,
  },
  {
    title: 'CP4: Caminos minimos desde un origen (SSSP)',
    category: 'CP4 - Grafos',
    content: `## Grafo no ponderado: BFS

Si todas las aristas tienen el mismo peso (o no tienen peso), BFS encuentra
la distancia minima en numero de aristas en \`O(V + E)\`, mas simple y
rapido que Dijkstra.

## Grafo ponderado sin pesos negativos: Dijkstra

Con una cola de prioridad, \`O((V + E) \\log V)\`. Es el algoritmo por
defecto para SSSP cuando todos los pesos son \`>= 0\`.

## Grafo pequeno con posibles ciclos negativos: Bellman-Ford

Relaja todas las aristas \`V - 1\` veces, \`O(V \\cdot E)\`; una relajacion
adicional exitosa en la iteracion \`V\` indica un ciclo negativo alcanzable.
Se usa cuando el grafo admite pesos negativos y es lo bastante chico para
que \`O(VE)\` sea aceptable.`,
    commonPitfalls:
      'Usar Dijkstra cuando el grafo tiene aristas de peso negativo (resultado incorrecto silencioso). No verificar ciclos negativos con Bellman-Ford cuando el problema los permite.',
  },
  {
    title: 'CP4: Caminos minimos entre todos los pares (APSP)',
    category: 'CP4 - Grafos',
    content: `## Floyd-Warshall

DP sobre nodos intermedios: \`dist[i][j] = min(dist[i][j], dist[i][k] +
dist[k][j])\` iterando \`k\` de \`1\` a \`n\`. Complejidad \`O(V^3)\`, apropiado
cuando \`V\` es pequeno (tipicamente hasta unos cientos).

## Otras aplicaciones

- **Cierre transitivo**: reemplazando suma/min por OR logico, indica si
  existe **algun** camino entre cada par de nodos.
- **Deteccion de ciclos negativos**: si al terminar \`dist[i][i] < 0\` para
  algun \`i\`, hay un ciclo negativo alcanzable desde \`i\`.
- **Diametro del grafo**: el maximo de todas las distancias \`dist[i][j]\`
  finitas, una vez calculada la matriz completa.`,
  },
  {
    title: 'CP4: Grafos especiales',
    category: 'CP4 - Grafos',
    content: `## DAG (grafo dirigido aciclico)

Admite orden topologico; muchos problemas de DP se pueden ver como DP
sobre un DAG (camino mas largo/corto, conteo de caminos) procesando los
nodos en ese orden.

## Arboles

Caso particular de grafo (conexo, sin ciclos, \`n-1\` aristas); muchos
algoritmos generales se simplifican en un arbol (por ejemplo, hay un unico
camino entre cualquier par de nodos).

## Grafos bipartitos

Se pueden 2-colorear sin conflictos; el emparejamiento maximo entre sus dos
particiones se calcula con algoritmos como el hungaro o reduciendolo a
flujo maximo.

## Grafos Eulerianos

Admiten un circuito/camino que recorre cada arista exactamente una vez, si
se cumple la condicion de paridad de grados; se construyen con el
algoritmo de Hierholzer en \`O(E)\`.`,
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
  let skipped = 0;

  for (const topic of ALL_TOPICS) {
    const slug = slugify(topic.title);
    const existing = await prisma.notebookEntry.findUnique({ where: { slug } });
    if (existing) {
      skipped += 1;
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

  console.log(`Temas creados: ${created}. Temas ya existentes (omitidos): ${skipped}.`);
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
