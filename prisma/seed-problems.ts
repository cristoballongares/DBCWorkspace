import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

type ProblemSeed = {
  title: string;
  source: string;
  url: string;
  difficulty: Difficulty;
  tagNames: string[];
};

// ═══════════════════════════════════════════════════════════════════════════
// Problemas verificados vía API oficial de Codeforces (problemset.problems)
// rating real, sin adivinar nombres/ids. Ver scratchpad de la sesión que los
// generó (cf_final.json) para la data cruda.
// ═══════════════════════════════════════════════════════════════════════════

const BINARY_SEARCH: ProblemSeed[] = [
  { title: 'New Year and Hurry', source: 'Codeforces 750A', url: 'https://codeforces.com/problemset/problem/750/A', difficulty: 'EASY', tagNames: ['Búsqueda Binaria'] },
  { title: 'Vanya and Lanterns', source: 'Codeforces 492B', url: 'https://codeforces.com/problemset/problem/492/B', difficulty: 'EASY', tagNames: ['Búsqueda Binaria'] },
  { title: 'Interesting Drink', source: 'Codeforces 706B', url: 'https://codeforces.com/problemset/problem/706/B', difficulty: 'EASY', tagNames: ['Búsqueda Binaria'] },
  { title: 'K-th Not Divisible by n', source: 'Codeforces 1352C', url: 'https://codeforces.com/problemset/problem/1352/C', difficulty: 'EASY', tagNames: ['Búsqueda Binaria'] },
  { title: 'Worms', source: 'Codeforces 474B', url: 'https://codeforces.com/problemset/problem/474/B', difficulty: 'EASY', tagNames: ['Búsqueda Binaria'] },
  { title: 'T-primes', source: 'Codeforces 230B', url: 'https://codeforces.com/problemset/problem/230/B', difficulty: 'MEDIUM', tagNames: ['Búsqueda Binaria'] },
  { title: 'Books', source: 'Codeforces 279B', url: 'https://codeforces.com/problemset/problem/279/B', difficulty: 'MEDIUM', tagNames: ['Búsqueda Binaria'] },
  { title: 'Number of Ways', source: 'Codeforces 466C', url: 'https://codeforces.com/problemset/problem/466/C', difficulty: 'MEDIUM', tagNames: ['Búsqueda Binaria'] },
  { title: 'Queries about Less or Equal Elements', source: 'Codeforces 600B', url: 'https://codeforces.com/problemset/problem/600/B', difficulty: 'MEDIUM', tagNames: ['Búsqueda Binaria'] },
  { title: 'Hamburgers', source: 'Codeforces 371C', url: 'https://codeforces.com/problemset/problem/371/C', difficulty: 'MEDIUM', tagNames: ['Búsqueda Binaria'] },
  { title: 'Mike and Feet', source: 'Codeforces 547B', url: 'https://codeforces.com/problemset/problem/547/B', difficulty: 'HARD', tagNames: ['Búsqueda Binaria'] },
  { title: 'Odd-Even Subsequence', source: 'Codeforces 1370D', url: 'https://codeforces.com/problemset/problem/1370/D', difficulty: 'HARD', tagNames: ['Búsqueda Binaria'] },
  { title: 'Multiset', source: 'Codeforces 1354D', url: 'https://codeforces.com/problemset/problem/1354/D', difficulty: 'HARD', tagNames: ['Búsqueda Binaria'] },
  { title: 'Guessing the Greatest (hard version)', source: 'Codeforces 1486C2', url: 'https://codeforces.com/problemset/problem/1486/C2', difficulty: 'HARD', tagNames: ['Búsqueda Binaria'] },
  { title: 'Magic Ship', source: 'Codeforces 1117C', url: 'https://codeforces.com/problemset/problem/1117/C', difficulty: 'HARD', tagNames: ['Búsqueda Binaria'] },
];

const BINARY_SEARCH_ON_ANSWER: ProblemSeed[] = [
  { title: 'K-divisible Sum', source: 'Codeforces 1476A', url: 'https://codeforces.com/problemset/problem/1476/A', difficulty: 'EASY', tagNames: ['Búsqueda Binaria sobre la Respuesta'] },
  { title: 'Different Divisors', source: 'Codeforces 1474B', url: 'https://codeforces.com/problemset/problem/1474/B', difficulty: 'EASY', tagNames: ['Búsqueda Binaria sobre la Respuesta'] },
  { title: 'Eating Candies', source: 'Codeforces 1669F', url: 'https://codeforces.com/problemset/problem/1669/F', difficulty: 'EASY', tagNames: ['Búsqueda Binaria sobre la Respuesta'] },
  { title: 'Scuza', source: 'Codeforces 1742E', url: 'https://codeforces.com/problemset/problem/1742/E', difficulty: 'EASY', tagNames: ['Búsqueda Binaria sobre la Respuesta'] },
  { title: 'Two Teams Composing', source: 'Codeforces 1335C', url: 'https://codeforces.com/problemset/problem/1335/C', difficulty: 'EASY', tagNames: ['Búsqueda Binaria sobre la Respuesta'] },
  { title: 'Maximum Median', source: 'Codeforces 1201C', url: 'https://codeforces.com/problemset/problem/1201/C', difficulty: 'MEDIUM', tagNames: ['Búsqueda Binaria sobre la Respuesta'] },
  { title: 'Find the Different Ones!', source: 'Codeforces 1927D', url: 'https://codeforces.com/problemset/problem/1927/D', difficulty: 'MEDIUM', tagNames: ['Búsqueda Binaria sobre la Respuesta'] },
  { title: 'Yet Another Problem About Pairs Satisfying an Inequality', source: 'Codeforces 1703F', url: 'https://codeforces.com/problemset/problem/1703/F', difficulty: 'MEDIUM', tagNames: ['Búsqueda Binaria sobre la Respuesta'] },
  { title: 'Strange Birthday Party', source: 'Codeforces 1470A', url: 'https://codeforces.com/problemset/problem/1470/A', difficulty: 'MEDIUM', tagNames: ['Búsqueda Binaria sobre la Respuesta'] },
  { title: 'Schedule Management', source: 'Codeforces 1701C', url: 'https://codeforces.com/problemset/problem/1701/C', difficulty: 'MEDIUM', tagNames: ['Búsqueda Binaria sobre la Respuesta'] },
  { title: 'Phoenix and Science', source: 'Codeforces 1348D', url: 'https://codeforces.com/problemset/problem/1348/D', difficulty: 'HARD', tagNames: ['Búsqueda Binaria sobre la Respuesta'] },
  { title: 'The Best Vacation', source: 'Codeforces 1358D', url: 'https://codeforces.com/problemset/problem/1358/D', difficulty: 'HARD', tagNames: ['Búsqueda Binaria sobre la Respuesta'] },
  { title: 'Breaking the Wall', source: 'Codeforces 1674E', url: 'https://codeforces.com/problemset/problem/1674/E', difficulty: 'HARD', tagNames: ['Búsqueda Binaria sobre la Respuesta'] },
  { title: 'Minimize the Difference', source: 'Codeforces 2013D', url: 'https://codeforces.com/problemset/problem/2013/D', difficulty: 'HARD', tagNames: ['Búsqueda Binaria sobre la Respuesta'] },
  { title: 'Cow and Fields', source: 'Codeforces 1307D', url: 'https://codeforces.com/problemset/problem/1307/D', difficulty: 'HARD', tagNames: ['Búsqueda Binaria sobre la Respuesta'] },
];

const BITMASKING: ProblemSeed[] = [
  { title: 'Odd One Out', source: 'Codeforces 1915A', url: 'https://codeforces.com/problemset/problem/1915/A', difficulty: 'EASY', tagNames: ['Bitmasking'] },
  { title: 'Raising Bacteria', source: 'Codeforces 579A', url: 'https://codeforces.com/problemset/problem/579/A', difficulty: 'EASY', tagNames: ['Bitmasking'] },
  { title: 'Mocha and Math', source: 'Codeforces 1559A', url: 'https://codeforces.com/problemset/problem/1559/A', difficulty: 'EASY', tagNames: ['Bitmasking'] },
  { title: 'We Need the Zero', source: 'Codeforces 1805A', url: 'https://codeforces.com/problemset/problem/1805/A', difficulty: 'EASY', tagNames: ['Bitmasking'] },
  { title: 'Fedor and New Game', source: 'Codeforces 467B', url: 'https://codeforces.com/problemset/problem/467/B', difficulty: 'EASY', tagNames: ['Bitmasking'] },
  { title: 'Dreamoon and WiFi', source: 'Codeforces 476B', url: 'https://codeforces.com/problemset/problem/476/B', difficulty: 'MEDIUM', tagNames: ['Bitmasking'] },
  { title: 'Maximal AND', source: 'Codeforces 1669H', url: 'https://codeforces.com/problemset/problem/1669/H', difficulty: 'MEDIUM', tagNames: ['Bitmasking'] },
  { title: 'Preparing Olympiad', source: 'Codeforces 550B', url: 'https://codeforces.com/problemset/problem/550/B', difficulty: 'MEDIUM', tagNames: ['Bitmasking'] },
  { title: 'AGAGA XOOORRR', source: 'Codeforces 1516B', url: 'https://codeforces.com/problemset/problem/1516/B', difficulty: 'MEDIUM', tagNames: ['Bitmasking'] },
  { title: 'Johnny and Another Rating Drop', source: 'Codeforces 1362C', url: 'https://codeforces.com/problemset/problem/1362/C', difficulty: 'MEDIUM', tagNames: ['Bitmasking'] },
  { title: 'XOR on Segment', source: 'Codeforces 242E', url: 'https://codeforces.com/problemset/problem/242/E', difficulty: 'HARD', tagNames: ['Bitmasking'] },
  { title: 'Compatible Numbers', source: 'Codeforces 165E', url: 'https://codeforces.com/problemset/problem/165/E', difficulty: 'HARD', tagNames: ['Bitmasking'] },
  { title: 'Tree Requests', source: 'Codeforces 570D', url: 'https://codeforces.com/problemset/problem/570/D', difficulty: 'HARD', tagNames: ['Bitmasking'] },
  { title: 'Dr. Evil Underscores', source: 'Codeforces 1285D', url: 'https://codeforces.com/problemset/problem/1285/D', difficulty: 'HARD', tagNames: ['Bitmasking'] },
  { title: 'Minimax Problem', source: 'Codeforces 1288D', url: 'https://codeforces.com/problemset/problem/1288/D', difficulty: 'HARD', tagNames: ['Bitmasking'] },
];

const DP: ProblemSeed[] = [
  { title: 'Hit the Lottery', source: 'Codeforces 996A', url: 'https://codeforces.com/problemset/problem/996/A', difficulty: 'EASY', tagNames: ['DP'] },
  { title: 'Kefa and First Steps', source: 'Codeforces 580A', url: 'https://codeforces.com/problemset/problem/580/A', difficulty: 'EASY', tagNames: ['DP'] },
  { title: 'Fence', source: 'Codeforces 363B', url: 'https://codeforces.com/problemset/problem/363/B', difficulty: 'EASY', tagNames: ['DP'] },
  { title: 'Fair Division', source: 'Codeforces 1472B', url: 'https://codeforces.com/problemset/problem/1472/B', difficulty: 'EASY', tagNames: ['DP'] },
  { title: "New Year's Number", source: 'Codeforces 1475B', url: 'https://codeforces.com/problemset/problem/1475/B', difficulty: 'EASY', tagNames: ['DP'] },
  { title: 'Cut Ribbon', source: 'Codeforces 189A', url: 'https://codeforces.com/problemset/problem/189/A', difficulty: 'MEDIUM', tagNames: ['DP'] },
  { title: 'Boredom', source: 'Codeforces 455A', url: 'https://codeforces.com/problemset/problem/455/A', difficulty: 'MEDIUM', tagNames: ['DP'] },
  { title: 'Given Length and Sum of Digits...', source: 'Codeforces 489C', url: 'https://codeforces.com/problemset/problem/489/C', difficulty: 'MEDIUM', tagNames: ['DP'] },
  { title: 'Two Substrings', source: 'Codeforces 550A', url: 'https://codeforces.com/problemset/problem/550/A', difficulty: 'MEDIUM', tagNames: ['DP'] },
  { title: 'Vacations', source: 'Codeforces 698A', url: 'https://codeforces.com/problemset/problem/698/A', difficulty: 'MEDIUM', tagNames: ['DP'] },
  { title: 'Longest Regular Bracket Sequence', source: 'Codeforces 5C', url: 'https://codeforces.com/problemset/problem/5/C', difficulty: 'HARD', tagNames: ['DP'] },
  { title: 'Zuma', source: 'Codeforces 607B', url: 'https://codeforces.com/problemset/problem/607/B', difficulty: 'HARD', tagNames: ['DP'] },
  { title: 'Modulo Sum', source: 'Codeforces 577B', url: 'https://codeforces.com/problemset/problem/577/B', difficulty: 'HARD', tagNames: ['DP'] },
  { title: 'Classy Numbers', source: 'Codeforces 1036C', url: 'https://codeforces.com/problemset/problem/1036/C', difficulty: 'HARD', tagNames: ['DP'] },
  { title: 'The Least Round Way', source: 'Codeforces 2B', url: 'https://codeforces.com/problemset/problem/2/B', difficulty: 'HARD', tagNames: ['DP'] },
];

const NUMBER_THEORY: ProblemSeed[] = [
  { title: 'Lucky Division', source: 'Codeforces 122A', url: 'https://codeforces.com/problemset/problem/122/A', difficulty: 'EASY', tagNames: ['Teoría de Números'] },
  { title: 'Game with Integers', source: 'Codeforces 1899A', url: 'https://codeforces.com/problemset/problem/1899/A', difficulty: 'EASY', tagNames: ['Teoría de Números'] },
  { title: 'Again Twenty Five!', source: 'Codeforces 630A', url: 'https://codeforces.com/problemset/problem/630/A', difficulty: 'EASY', tagNames: ['Teoría de Números'] },
  { title: 'Odd Divisor', source: 'Codeforces 1475A', url: 'https://codeforces.com/problemset/problem/1475/A', difficulty: 'EASY', tagNames: ['Teoría de Números'] },
  { title: 'Design Tutorial: Learn from Math', source: 'Codeforces 472A', url: 'https://codeforces.com/problemset/problem/472/A', difficulty: 'EASY', tagNames: ['Teoría de Números'] },
  { title: 'Product of Three Numbers', source: 'Codeforces 1294C', url: 'https://codeforces.com/problemset/problem/1294/C', difficulty: 'MEDIUM', tagNames: ['Teoría de Números'] },
  { title: 'Buying Shovels', source: 'Codeforces 1360D', url: 'https://codeforces.com/problemset/problem/1360/D', difficulty: 'MEDIUM', tagNames: ['Teoría de Números'] },
  { title: 'Omkar and Last Class of Math', source: 'Codeforces 1372B', url: 'https://codeforces.com/problemset/problem/1372/B', difficulty: 'MEDIUM', tagNames: ['Teoría de Números'] },
  { title: 'I Hate 1111', source: 'Codeforces 1526B', url: 'https://codeforces.com/problemset/problem/1526/B', difficulty: 'MEDIUM', tagNames: ['Teoría de Números'] },
  { title: 'Divisible Pairs', source: 'Codeforces 1931D', url: 'https://codeforces.com/problemset/problem/1931/D', difficulty: 'MEDIUM', tagNames: ['Teoría de Números'] },
  { title: 'Two Divisors', source: 'Codeforces 1366D', url: 'https://codeforces.com/problemset/problem/1366/D', difficulty: 'HARD', tagNames: ['Teoría de Números'] },
  { title: 'Ant Colony', source: 'Codeforces 474F', url: 'https://codeforces.com/problemset/problem/474/F', difficulty: 'HARD', tagNames: ['Teoría de Números'] },
  { title: 'Not Adding', source: 'Codeforces 1627D', url: 'https://codeforces.com/problemset/problem/1627/D', difficulty: 'HARD', tagNames: ['Teoría de Números'] },
  { title: 'SUM and REPLACE', source: 'Codeforces 920F', url: 'https://codeforces.com/problemset/problem/920/F', difficulty: 'HARD', tagNames: ['Teoría de Números'] },
  { title: 'The Football Season', source: 'Codeforces 1244C', url: 'https://codeforces.com/problemset/problem/1244/C', difficulty: 'HARD', tagNames: ['Teoría de Números'] },
];

const MATH: ProblemSeed[] = [
  { title: 'Watermelon', source: 'Codeforces 4A', url: 'https://codeforces.com/problemset/problem/4/A', difficulty: 'EASY', tagNames: ['Matemáticas'] },
  { title: 'Domino Piling', source: 'Codeforces 50A', url: 'https://codeforces.com/problemset/problem/50/A', difficulty: 'EASY', tagNames: ['Matemáticas'] },
  { title: 'Theatre Square', source: 'Codeforces 1A', url: 'https://codeforces.com/problemset/problem/1/A', difficulty: 'EASY', tagNames: ['Matemáticas'] },
  { title: 'Elephant', source: 'Codeforces 617A', url: 'https://codeforces.com/problemset/problem/617/A', difficulty: 'EASY', tagNames: ['Matemáticas'] },
  { title: 'Soldier and Bananas', source: 'Codeforces 546A', url: 'https://codeforces.com/problemset/problem/546/A', difficulty: 'EASY', tagNames: ['Matemáticas'] },
  { title: 'Two Buttons', source: 'Codeforces 520B', url: 'https://codeforces.com/problemset/problem/520/B', difficulty: 'MEDIUM', tagNames: ['Matemáticas'] },
  { title: 'Random Teams', source: 'Codeforces 478B', url: 'https://codeforces.com/problemset/problem/478/B', difficulty: 'MEDIUM', tagNames: ['Matemáticas'] },
  { title: 'Good Subarrays', source: 'Codeforces 1398C', url: 'https://codeforces.com/problemset/problem/1398/C', difficulty: 'MEDIUM', tagNames: ['Matemáticas'] },
  { title: 'Romantic Glasses', source: 'Codeforces 1915E', url: 'https://codeforces.com/problemset/problem/1915/E', difficulty: 'MEDIUM', tagNames: ['Matemáticas'] },
  { title: 'Number of Pairs', source: 'Codeforces 1538C', url: 'https://codeforces.com/problemset/problem/1538/C', difficulty: 'MEDIUM', tagNames: ['Matemáticas'] },
  { title: 'Powerful Array', source: 'Codeforces 86D', url: 'https://codeforces.com/problemset/problem/86/D', difficulty: 'HARD', tagNames: ['Matemáticas'] },
  { title: 'The Child and Sequence', source: 'Codeforces 438D', url: 'https://codeforces.com/problemset/problem/438/D', difficulty: 'HARD', tagNames: ['Matemáticas'] },
  { title: 'Zigzags', source: 'Codeforces 1400D', url: 'https://codeforces.com/problemset/problem/1400/D', difficulty: 'HARD', tagNames: ['Matemáticas'] },
  { title: 'Three Integers', source: 'Codeforces 1311D', url: 'https://codeforces.com/problemset/problem/1311/D', difficulty: 'HARD', tagNames: ['Matemáticas'] },
  { title: 'TediousLee', source: 'Codeforces 1369D', url: 'https://codeforces.com/problemset/problem/1369/D', difficulty: 'HARD', tagNames: ['Matemáticas'] },
];

// ═══════════════════════════════════════════════════════════════════════════
// Estructuras de datos — Codeforces no tiene tag por estructura específica,
// así que estos vienen de CSES (organizado por técnica) + un par de problemas
// de Codeforces/SPOJ confirmados vía referencia cruzada. Cobertura menor que
// los bloques de arriba (ver aviso al usuario).
// ═══════════════════════════════════════════════════════════════════════════

const SPARSE_TABLE: ProblemSeed[] = [
  { title: 'Static Range Minimum Queries', source: 'CSES 1647', url: 'https://cses.fi/problemset/task/1647', difficulty: 'EASY', tagNames: ['Sparse Table'] },
  { title: 'New Year Concert', source: 'Codeforces 1632D', url: 'https://codeforces.com/problemset/problem/1632/D', difficulty: 'HARD', tagNames: ['Sparse Table'] },
];

const FENWICK_TREE: ProblemSeed[] = [
  { title: 'Dynamic Range Sum Queries', source: 'CSES 1648', url: 'https://cses.fi/problemset/task/1648', difficulty: 'EASY', tagNames: ['Fenwick Tree'] },
  { title: 'Range Xor Queries', source: 'CSES 1650', url: 'https://cses.fi/problemset/task/1650', difficulty: 'MEDIUM', tagNames: ['Fenwick Tree'] },
  { title: 'Range Update Queries', source: 'CSES 1651', url: 'https://cses.fi/problemset/task/1651', difficulty: 'MEDIUM', tagNames: ['Fenwick Tree'] },
  { title: 'Salary Queries', source: 'CSES 1144', url: 'https://cses.fi/problemset/task/1144', difficulty: 'MEDIUM', tagNames: ['Fenwick Tree'] },
  { title: 'List Removals', source: 'CSES 1749', url: 'https://cses.fi/problemset/task/1749', difficulty: 'HARD', tagNames: ['Fenwick Tree'] },
  { title: 'Forest Queries II', source: 'CSES 1739', url: 'https://cses.fi/problemset/task/1739', difficulty: 'HARD', tagNames: ['Fenwick Tree'] },
];

const SEGMENT_TREE: ProblemSeed[] = [
  { title: 'Dynamic Range Minimum Queries', source: 'CSES 1649', url: 'https://cses.fi/problemset/task/1649', difficulty: 'EASY', tagNames: ['Segment Tree'] },
  { title: 'Hotel Queries', source: 'CSES 1143', url: 'https://cses.fi/problemset/task/1143', difficulty: 'MEDIUM', tagNames: ['Segment Tree'] },
  { title: 'Distinct Values Queries', source: 'CSES 1734', url: 'https://cses.fi/problemset/task/1734', difficulty: 'MEDIUM', tagNames: ['Segment Tree'] },
  { title: 'Prefix Sum Queries', source: 'CSES 2166', url: 'https://cses.fi/problemset/task/2166', difficulty: 'MEDIUM', tagNames: ['Segment Tree'] },
  { title: 'Range Updates and Sums', source: 'CSES 1735', url: 'https://cses.fi/problemset/task/1735', difficulty: 'HARD', tagNames: ['Segment Tree'] },
  { title: 'Polynomial Queries', source: 'CSES 1736', url: 'https://cses.fi/problemset/task/1736', difficulty: 'HARD', tagNames: ['Segment Tree'] },
];

const STACKS: ProblemSeed[] = [
  { title: 'Nearest Smaller Values', source: 'CSES 1645', url: 'https://cses.fi/problemset/task/1645', difficulty: 'EASY', tagNames: ['Stacks'] },
  { title: 'Largest Rectangle in a Histogram', source: 'SPOJ HISTOGRA', url: 'https://www.spoj.com/problems/HISTOGRA/', difficulty: 'MEDIUM', tagNames: ['Stacks'] },
  { title: 'Skyscrapers (hard version)', source: 'Codeforces 1313C2', url: 'https://codeforces.com/problemset/problem/1313/C2', difficulty: 'HARD', tagNames: ['Stacks'] },
  { title: 'Largest Rectangle (after posters merge)', source: 'SPOJ POSTERIN', url: 'https://www.spoj.com/problems/POSTERIN/', difficulty: 'HARD', tagNames: ['Stacks'] },
];

const PRIORITY_QUEUE: ProblemSeed[] = [
  { title: 'Room Allocation', source: 'CSES 1164', url: 'https://cses.fi/problemset/task/1164', difficulty: 'EASY', tagNames: ['Priority Queue'] },
  { title: 'Movie Festival II', source: 'CSES 1632', url: 'https://cses.fi/problemset/task/1632', difficulty: 'MEDIUM', tagNames: ['Priority Queue'] },
  { title: 'Heap Operations', source: 'Codeforces 681C', url: 'https://codeforces.com/problemset/problem/681/C', difficulty: 'MEDIUM', tagNames: ['Priority Queue'] },
  { title: 'Heaps', source: 'Codeforces 955F', url: 'https://codeforces.com/problemset/problem/955/F', difficulty: 'HARD', tagNames: ['Priority Queue'] },
];

// ═══════════════════════════════════════════════════════════════════════════
// Ronda 2 — Grafos, Greedy, Two Pointers, DSU + refuerzo de Matemáticas.
// Verificados igual que la ronda 1: API oficial de Codeforces, deduplicados
// contra los 109 problemas ya insertados (ver used_urls.txt de la sesión).
// ═══════════════════════════════════════════════════════════════════════════

const GRAPHS: ProblemSeed[] = [
  { title: 'New Year Transportation', source: 'Codeforces 500A', url: 'https://codeforces.com/problemset/problem/500/A', difficulty: 'EASY', tagNames: ['Grafos'] },
  { title: 'Party', source: 'Codeforces 115A', url: 'https://codeforces.com/problemset/problem/115/A', difficulty: 'EASY', tagNames: ['Grafos'] },
  { title: 'Long Jumps', source: 'Codeforces 1472C', url: 'https://codeforces.com/problemset/problem/1472/C', difficulty: 'EASY', tagNames: ['Grafos'] },
  { title: 'Love Triangle', source: 'Codeforces 939A', url: 'https://codeforces.com/problemset/problem/939/A', difficulty: 'EASY', tagNames: ['Grafos'] },
  { title: 'Destroying Bridges', source: 'Codeforces 1944A', url: 'https://codeforces.com/problemset/problem/1944/A', difficulty: 'EASY', tagNames: ['Grafos'] },
  { title: 'Kefa and Park', source: 'Codeforces 580C', url: 'https://codeforces.com/problemset/problem/580/C', difficulty: 'MEDIUM', tagNames: ['Grafos'] },
  { title: 'Mortal Kombat Tower', source: 'Codeforces 1418C', url: 'https://codeforces.com/problemset/problem/1418/C', difficulty: 'MEDIUM', tagNames: ['Grafos'] },
  { title: 'Rumor', source: 'Codeforces 893C', url: 'https://codeforces.com/problemset/problem/893/C', difficulty: 'MEDIUM', tagNames: ['Grafos'] },
  { title: 'Polygon', source: 'Codeforces 1360E', url: 'https://codeforces.com/problemset/problem/1360/E', difficulty: 'MEDIUM', tagNames: ['Grafos'] },
  { title: 'Ball in Berland', source: 'Codeforces 1475C', url: 'https://codeforces.com/problemset/problem/1475/C', difficulty: 'MEDIUM', tagNames: ['Grafos'] },
  { title: 'Dijkstra?', source: 'Codeforces 20C', url: 'https://codeforces.com/problemset/problem/20/C', difficulty: 'HARD', tagNames: ['Grafos'] },
  { title: 'Roads not only in Berland', source: 'Codeforces 25D', url: 'https://codeforces.com/problemset/problem/25/D', difficulty: 'HARD', tagNames: ['Grafos'] },
  { title: 'Tree Queries', source: 'Codeforces 1328E', url: 'https://codeforces.com/problemset/problem/1328/E', difficulty: 'HARD', tagNames: ['Grafos'] },
  { title: 'Jzzhu and Cities', source: 'Codeforces 449B', url: 'https://codeforces.com/problemset/problem/449/B', difficulty: 'HARD', tagNames: ['Grafos'] },
  { title: 'Minimum Spanning Tree for Each Edge', source: 'Codeforces 609E', url: 'https://codeforces.com/problemset/problem/609/E', difficulty: 'HARD', tagNames: ['Grafos'] },
];

const GREEDY: ProblemSeed[] = [
  { title: 'Team', source: 'Codeforces 231A', url: 'https://codeforces.com/problemset/problem/231/A', difficulty: 'EASY', tagNames: ['Greedy'] },
  { title: 'Helpful Maths', source: 'Codeforces 339A', url: 'https://codeforces.com/problemset/problem/339/A', difficulty: 'EASY', tagNames: ['Greedy'] },
  { title: 'Chat Room', source: 'Codeforces 58A', url: 'https://codeforces.com/problemset/problem/58/A', difficulty: 'EASY', tagNames: ['Greedy'] },
  { title: 'Twins', source: 'Codeforces 160A', url: 'https://codeforces.com/problemset/problem/160/A', difficulty: 'EASY', tagNames: ['Greedy'] },
  { title: 'Gravity Flip', source: 'Codeforces 405A', url: 'https://codeforces.com/problemset/problem/405/A', difficulty: 'EASY', tagNames: ['Greedy'] },
  { title: 'Little Girl and Maximum Sum', source: 'Codeforces 276C', url: 'https://codeforces.com/problemset/problem/276/C', difficulty: 'MEDIUM', tagNames: ['Greedy'] },
  { title: 'Woodcutters', source: 'Codeforces 545C', url: 'https://codeforces.com/problemset/problem/545/C', difficulty: 'MEDIUM', tagNames: ['Greedy'] },
  { title: 'Exams', source: 'Codeforces 479C', url: 'https://codeforces.com/problemset/problem/479/C', difficulty: 'MEDIUM', tagNames: ['Greedy'] },
  { title: 'Just Eat It!', source: 'Codeforces 1285B', url: 'https://codeforces.com/problemset/problem/1285/B', difficulty: 'MEDIUM', tagNames: ['Greedy'] },
  { title: 'Potions (Hard Version)', source: 'Codeforces 1526C2', url: 'https://codeforces.com/problemset/problem/1526/C2', difficulty: 'MEDIUM', tagNames: ['Greedy'] },
  { title: 'Painting Fence', source: 'Codeforces 448C', url: 'https://codeforces.com/problemset/problem/448/C', difficulty: 'HARD', tagNames: ['Greedy'] },
  { title: 'Shichikuji and Power Grid', source: 'Codeforces 1245D', url: 'https://codeforces.com/problemset/problem/1245/D', difficulty: 'HARD', tagNames: ['Greedy'] },
  { title: 'Ciel the Commander', source: 'Codeforces 321C', url: 'https://codeforces.com/problemset/problem/321/C', difficulty: 'HARD', tagNames: ['Greedy'] },
  { title: 'Gargari and Bishops', source: 'Codeforces 463C', url: 'https://codeforces.com/problemset/problem/463/C', difficulty: 'HARD', tagNames: ['Greedy'] },
  { title: 'Orac and Medians', source: 'Codeforces 1349B', url: 'https://codeforces.com/problemset/problem/1349/B', difficulty: 'HARD', tagNames: ['Greedy'] },
];

const TWO_POINTERS: ProblemSeed[] = [
  { title: 'Sereja and Dima', source: 'Codeforces 381A', url: 'https://codeforces.com/problemset/problem/381/A', difficulty: 'EASY', tagNames: ['Two Pointers'] },
  { title: 'Prepend and Append', source: 'Codeforces 1791C', url: 'https://codeforces.com/problemset/problem/1791/C', difficulty: 'EASY', tagNames: ['Two Pointers'] },
  { title: 'BerSU Ball', source: 'Codeforces 489B', url: 'https://codeforces.com/problemset/problem/489/B', difficulty: 'EASY', tagNames: ['Two Pointers'] },
  { title: 'Ski Resort', source: 'Codeforces 1840C', url: 'https://codeforces.com/problemset/problem/1840/C', difficulty: 'EASY', tagNames: ['Two Pointers'] },
  { title: 'Favorite Sequence', source: 'Codeforces 1462A', url: 'https://codeforces.com/problemset/problem/1462/A', difficulty: 'EASY', tagNames: ['Two Pointers'] },
  { title: 'Pair of Topics', source: 'Codeforces 1324D', url: 'https://codeforces.com/problemset/problem/1324/D', difficulty: 'MEDIUM', tagNames: ['Two Pointers'] },
  { title: 'Kefa and Company', source: 'Codeforces 580B', url: 'https://codeforces.com/problemset/problem/580/B', difficulty: 'MEDIUM', tagNames: ['Two Pointers'] },
  { title: 'Zero Remainder Array', source: 'Codeforces 1374D', url: 'https://codeforces.com/problemset/problem/1374/D', difficulty: 'MEDIUM', tagNames: ['Two Pointers'] },
  { title: 'Shuffle', source: 'Codeforces 1366B', url: 'https://codeforces.com/problemset/problem/1366/B', difficulty: 'MEDIUM', tagNames: ['Two Pointers'] },
  { title: '2^Sort', source: 'Codeforces 1692G', url: 'https://codeforces.com/problemset/problem/1692/G', difficulty: 'MEDIUM', tagNames: ['Two Pointers'] },
  { title: 'Prefixes and Suffixes', source: 'Codeforces 432D', url: 'https://codeforces.com/problemset/problem/432/D', difficulty: 'HARD', tagNames: ['Two Pointers'] },
  { title: 'Yet Another Yet Another Task', source: 'Codeforces 1359D', url: 'https://codeforces.com/problemset/problem/1359/D', difficulty: 'HARD', tagNames: ['Two Pointers'] },
  { title: 'Maximum Value', source: 'Codeforces 484B', url: 'https://codeforces.com/problemset/problem/484/B', difficulty: 'HARD', tagNames: ['Two Pointers'] },
  { title: 'Valuable Cards', source: 'Codeforces 1992F', url: 'https://codeforces.com/problemset/problem/1992/F', difficulty: 'HARD', tagNames: ['Two Pointers'] },
  { title: 'Mr. Kitayuta, the Treasure Hunter', source: 'Codeforces 505C', url: 'https://codeforces.com/problemset/problem/505/C', difficulty: 'HARD', tagNames: ['Two Pointers'] },
];

const DSU: ProblemSeed[] = [
  { title: 'The Lakes', source: 'Codeforces 1829E', url: 'https://codeforces.com/problemset/problem/1829/E', difficulty: 'EASY', tagNames: ['DSU'] },
  { title: 'Ice Skating', source: 'Codeforces 217A', url: 'https://codeforces.com/problemset/problem/217/A', difficulty: 'EASY', tagNames: ['DSU'] },
  { title: "Sakurako's Hobby", source: 'Codeforces 2008D', url: 'https://codeforces.com/problemset/problem/2008/D', difficulty: 'EASY', tagNames: ['DSU'] },
  { title: 'Equal or Not Equal', source: 'Codeforces 1620A', url: 'https://codeforces.com/problemset/problem/1620/A', difficulty: 'EASY', tagNames: ['DSU'] },
  { title: 'Books Exchange (easy version)', source: 'Codeforces 1249B1', url: 'https://codeforces.com/problemset/problem/1249/B1', difficulty: 'EASY', tagNames: ['DSU'] },
  { title: 'News Distribution', source: 'Codeforces 1167C', url: 'https://codeforces.com/problemset/problem/1167/C', difficulty: 'MEDIUM', tagNames: ['DSU'] },
  { title: 'Cyclic Components', source: 'Codeforces 977E', url: 'https://codeforces.com/problemset/problem/977/E', difficulty: 'MEDIUM', tagNames: ['DSU'] },
  { title: 'Learning Languages', source: 'Codeforces 277A', url: 'https://codeforces.com/problemset/problem/277/A', difficulty: 'MEDIUM', tagNames: ['DSU'] },
  { title: 'K-Complete Word', source: 'Codeforces 1332C', url: 'https://codeforces.com/problemset/problem/1332/C', difficulty: 'MEDIUM', tagNames: ['DSU'] },
  { title: 'Solve The Maze', source: 'Codeforces 1365D', url: 'https://codeforces.com/problemset/problem/1365/D', difficulty: 'MEDIUM', tagNames: ['DSU'] },
  { title: 'Lomsat gelral', source: 'Codeforces 600E', url: 'https://codeforces.com/problemset/problem/600/E', difficulty: 'HARD', tagNames: ['DSU'] },
  { title: 'Replace the Numbers', source: 'Codeforces 1620E', url: 'https://codeforces.com/problemset/problem/1620/E', difficulty: 'HARD', tagNames: ['DSU'] },
  { title: '0-1 MST', source: 'Codeforces 1242B', url: 'https://codeforces.com/problemset/problem/1242/B', difficulty: 'HARD', tagNames: ['DSU'] },
  { title: 'Holes', source: 'Codeforces 13E', url: 'https://codeforces.com/problemset/problem/13/E', difficulty: 'HARD', tagNames: ['DSU'] },
  { title: 'Dominant Indices', source: 'Codeforces 1009F', url: 'https://codeforces.com/problemset/problem/1009/F', difficulty: 'HARD', tagNames: ['DSU'] },
];

const MATH_EXTRA: ProblemSeed[] = [
  { title: 'Young Physicist', source: 'Codeforces 69A', url: 'https://codeforces.com/problemset/problem/69/A', difficulty: 'EASY', tagNames: ['Matemáticas'] },
  { title: 'Calculating Function', source: 'Codeforces 486A', url: 'https://codeforces.com/problemset/problem/486/A', difficulty: 'EASY', tagNames: ['Matemáticas'] },
  { title: 'Drinks', source: 'Codeforces 200B', url: 'https://codeforces.com/problemset/problem/200/B', difficulty: 'EASY', tagNames: ['Matemáticas'] },
  { title: 'Even Odds', source: 'Codeforces 318A', url: 'https://codeforces.com/problemset/problem/318/A', difficulty: 'EASY', tagNames: ['Matemáticas'] },
  { title: 'Divisibility Problem', source: 'Codeforces 1328A', url: 'https://codeforces.com/problemset/problem/1328/A', difficulty: 'EASY', tagNames: ['Matemáticas'] },
  { title: 'Divisibility by Eight', source: 'Codeforces 550C', url: 'https://codeforces.com/problemset/problem/550/C', difficulty: 'MEDIUM', tagNames: ['Matemáticas'] },
  { title: 'K-th Beautiful String', source: 'Codeforces 1328B', url: 'https://codeforces.com/problemset/problem/1328/B', difficulty: 'MEDIUM', tagNames: ['Matemáticas'] },
  { title: 'Powered Addition', source: 'Codeforces 1338A', url: 'https://codeforces.com/problemset/problem/1338/A', difficulty: 'MEDIUM', tagNames: ['Matemáticas'] },
  { title: 'Strong Vertices', source: 'Codeforces 1857D', url: 'https://codeforces.com/problemset/problem/1857/D', difficulty: 'MEDIUM', tagNames: ['Matemáticas'] },
  { title: 'Orac and Models', source: 'Codeforces 1350B', url: 'https://codeforces.com/problemset/problem/1350/B', difficulty: 'MEDIUM', tagNames: ['Matemáticas'] },
  { title: 'A/B Matrix', source: 'Codeforces 1360G', url: 'https://codeforces.com/problemset/problem/1360/G', difficulty: 'HARD', tagNames: ['Matemáticas'] },
  { title: 'Gerald and Giant Chess', source: 'Codeforces 559C', url: 'https://codeforces.com/problemset/problem/559/C', difficulty: 'HARD', tagNames: ['Matemáticas'] },
  { title: 'Nikita and LCM', source: 'Codeforces 1977C', url: 'https://codeforces.com/problemset/problem/1977/C', difficulty: 'HARD', tagNames: ['Matemáticas'] },
  { title: 'Dual (Hard Version)', source: 'Codeforces 1854A2', url: 'https://codeforces.com/problemset/problem/1854/A2', difficulty: 'HARD', tagNames: ['Matemáticas'] },
  { title: 'Strange Beauty', source: 'Codeforces 1475G', url: 'https://codeforces.com/problemset/problem/1475/G', difficulty: 'HARD', tagNames: ['Matemáticas'] },
];

const GAME_THEORY: ProblemSeed[] = [
  { title: 'Buttons', source: 'Codeforces 1858A', url: 'https://codeforces.com/problemset/problem/1858/A', difficulty: 'EASY', tagNames: ['Teoría de Juegos'] },
  { title: 'Mahmoud and Ehab and the Even-Odd Game', source: 'Codeforces 959A', url: 'https://codeforces.com/problemset/problem/959/A', difficulty: 'EASY', tagNames: ['Teoría de Juegos'] },
  { title: '01 Game', source: 'Codeforces 1373B', url: 'https://codeforces.com/problemset/problem/1373/B', difficulty: 'EASY', tagNames: ['Teoría de Juegos'] },
  { title: 'The 67th Integer Problem', source: 'Codeforces 2218A', url: 'https://codeforces.com/problemset/problem/2218/A', difficulty: 'EASY', tagNames: ['Teoría de Juegos'] },
  { title: 'Wallet Exchange', source: 'Codeforces 1919A', url: 'https://codeforces.com/problemset/problem/1919/A', difficulty: 'EASY', tagNames: ['Teoría de Juegos'] },
  { title: 'Little Girl and Game', source: 'Codeforces 276B', url: 'https://codeforces.com/problemset/problem/276/B', difficulty: 'MEDIUM', tagNames: ['Teoría de Juegos'] },
  { title: 'Number Game', source: 'Codeforces 1370C', url: 'https://codeforces.com/problemset/problem/1370/C', difficulty: 'MEDIUM', tagNames: ['Teoría de Juegos'] },
  { title: "Anna and the Valentine's Day Gift", source: 'Codeforces 1931E', url: 'https://codeforces.com/problemset/problem/1931/E', difficulty: 'MEDIUM', tagNames: ['Teoría de Juegos'] },
  { title: 'MEX Game 1', source: 'Codeforces 1943A', url: 'https://codeforces.com/problemset/problem/1943/A', difficulty: 'MEDIUM', tagNames: ['Teoría de Juegos'] },
  { title: 'Game On Leaves', source: 'Codeforces 1363C', url: 'https://codeforces.com/problemset/problem/1363/C', difficulty: 'MEDIUM', tagNames: ['Teoría de Juegos'] },
  { title: 'Palindrome Game (hard version)', source: 'Codeforces 1527B2', url: 'https://codeforces.com/problemset/problem/1527/B2', difficulty: 'HARD', tagNames: ['Teoría de Juegos'] },
  { title: 'Tree Tag', source: 'Codeforces 1404B', url: 'https://codeforces.com/problemset/problem/1404/B', difficulty: 'HARD', tagNames: ['Teoría de Juegos'] },
  { title: 'A Lot of Games', source: 'Codeforces 455B', url: 'https://codeforces.com/problemset/problem/455/B', difficulty: 'HARD', tagNames: ['Teoría de Juegos'] },
  { title: "Let's Go Hiking", source: 'Codeforces 1495B', url: 'https://codeforces.com/problemset/problem/1495/B', difficulty: 'HARD', tagNames: ['Teoría de Juegos'] },
  { title: 'Omkar and Circle', source: 'Codeforces 1372D', url: 'https://codeforces.com/problemset/problem/1372/D', difficulty: 'HARD', tagNames: ['Teoría de Juegos'] },
];

const ALL_PROBLEMS: ProblemSeed[] = [
  ...BINARY_SEARCH,
  ...BINARY_SEARCH_ON_ANSWER,
  ...BITMASKING,
  ...DP,
  ...NUMBER_THEORY,
  ...MATH,
  ...GRAPHS,
  ...GREEDY,
  ...TWO_POINTERS,
  ...DSU,
  ...MATH_EXTRA,
  ...GAME_THEORY,
  ...SPARSE_TABLE,
  ...FENWICK_TREE,
  ...SEGMENT_TREE,
  ...STACKS,
  ...PRIORITY_QUEUE,
];

async function main() {
  let created = 0;
  let skipped = 0;

  for (const item of ALL_PROBLEMS) {
    const existing = await prisma.problem.findFirst({ where: { url: item.url } });
    if (existing) {
      skipped += 1;
      continue;
    }

    const tags = await Promise.all(
      item.tagNames.map((name) =>
        prisma.tag.upsert({ where: { name }, update: {}, create: { name } }),
      ),
    );

    await prisma.problem.create({
      data: {
        title: item.title,
        source: item.source,
        url: item.url,
        difficulty: item.difficulty,
        tags: {
          create: tags.map((tag) => ({ tag: { connect: { id: tag.id } } })),
        },
      },
    });
    created += 1;
  }

  console.log(`Problemas creados: ${created}. Ya existentes (omitidos): ${skipped}.`);
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
