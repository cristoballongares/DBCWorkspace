import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Solo el ADMIN se siembra directamente. Briana y David se crean via el
// link de invitacion que el ADMIN genera desde el panel (registro solo
// por invitacion, sin cuentas placeholder).
const ADMIN_EMAIL = 'cristoballongares@gmail.com';
const ADMIN_NAME = 'Cristobal';
const ADMIN_SEED_PASSWORD = 'changeme';

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_SEED_PASSWORD, 10);
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      role: Role.ADMIN,
      passwordHash,
    },
  });

  await seedDemoProblems(admin.id);
}

// Datos de prueba para poder previsualizar la app (problemas, soluciones,
// editoriales). Idempotente: si ya existe un problema con ese titulo, se
// omite en vez de duplicar.
async function seedDemoProblems(authorId: string) {
  const demoProblems = [
    {
      title: 'Suma de subarreglo maximo',
      source: 'Codeforces 455A',
      url: 'https://codeforces.com/problemset/problem/455/A',
      difficulty: 'EASY' as const,
      tagNames: ['dp', 'arrays'],
      statementNotes: 'Dado un arreglo, encontrar la suma maxima de un subarreglo contiguo.',
      solution: `## Enfoque

Es el clasico **Kadane**: mantenemos la mejor suma que termina en la posicion actual.

$$best[i] = \\max(a[i],\\ best[i-1] + a[i])$$

\`\`\`cpp
long long kadane(vector<long long>& a) {
    long long best = a[0], cur = a[0];
    for (size_t i = 1; i < a.size(); i++) {
        cur = max(a[i], cur + a[i]);
        best = max(best, cur);
    }
    return best;
}
\`\`\`

Complejidad: $O(n)$ tiempo, $O(1)$ espacio.`,
      editorial: `## Idea clave

Para cada posicion $i$, la mejor suma de subarreglo que **termina exactamente en $i$** solo tiene dos opciones:
empezar de nuevo en $i$, o extender el subarreglo anterior.

$$best[i] = \\max(a[i],\\ best[i-1] + a[i])$$

La respuesta final es $\\max_i best[i]$.

**Errores comunes**: olvidar que el arreglo puede tener solo numeros negativos (la respuesta es el maximo elemento, no 0).`,
    },
    {
      title: 'Camino minimo en grafo con pesos',
      source: 'Codeforces 20C',
      url: 'https://codeforces.com/problemset/problem/20/C',
      difficulty: 'MEDIUM' as const,
      tagNames: ['graphs', 'shortest-path'],
      statementNotes: 'Encontrar el camino de menor costo entre dos nodos y reconstruirlo.',
      solution: `## Dijkstra + reconstruccion de camino

Guardamos el nodo padre de cada vertice al relajar una arista.

\`\`\`cpp
vector<long long> dist(n, LLONG_MAX);
vector<int> parent(n, -1);
priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
dist[src] = 0;
pq.push({0, src});
while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    if (d > dist[u]) continue;
    for (auto [v, w] : adj[u]) {
        if (dist[u] + w < dist[v]) {
            dist[v] = dist[u] + w;
            parent[v] = u;
            pq.push({dist[v], v});
        }
    }
}
\`\`\`

Complejidad: $O((n + m) \\log n)$.`,
      editorial: null,
    },
    {
      title: 'Segment tree con actualizaciones de rango',
      source: 'CSES 1735',
      url: null,
      difficulty: 'HARD' as const,
      tagNames: ['segment-tree', 'range-queries'],
      statementNotes: 'Soporta suma en rango y actualizacion (asignar valor) en rango.',
      solution: null,
      editorial: `## Lazy propagation

Cuando actualizamos un rango completo cubierto por un nodo, no bajamos la actualizacion de inmediato:
guardamos una marca (*lazy tag*) y la propagamos solo cuando un hijo necesita ser visitado.

Invariante: el valor almacenado en un nodo siempre refleja su subarbol **como si** todas las marcas pendientes
ya se hubieran aplicado a el (pero no necesariamente a sus hijos).

$$\\text{sum}(node) = \\text{sum}(left) + \\text{sum}(right)$$

Complejidad: $O(\\log n)$ por consulta o actualizacion.`,
    },
    {
      title: 'Two pointers en arreglo ordenado',
      source: 'LeetCode 167',
      url: null,
      difficulty: 'EASY' as const,
      tagNames: ['two-pointers', 'arrays'],
      statementNotes: 'Encontrar dos indices cuyos valores sumen un objetivo dado.',
      solution: null,
      editorial: null,
    },
    {
      title: 'Conteo de inversiones',
      source: 'CSES 2168',
      url: null,
      difficulty: 'MEDIUM' as const,
      tagNames: ['merge-sort', 'arrays'],
      statementNotes: 'Contar pares $(i, j)$ con $i < j$ y $a[i] > a[j]$.',
      solution: `## Merge sort modificado

Durante el *merge*, cada vez que tomamos un elemento de la mitad derecha antes que uno de la izquierda,
todos los elementos restantes de la izquierda forman una inversion con el.

\`\`\`cpp
long long merge_count(vector<int>& a, int l, int m, int r) {
    vector<int> tmp;
    long long inv = 0;
    int i = l, j = m;
    while (i < m && j < r) {
        if (a[i] <= a[j]) tmp.push_back(a[i++]);
        else { inv += (m - i); tmp.push_back(a[j++]); }
    }
    while (i < m) tmp.push_back(a[i++]);
    while (j < r) tmp.push_back(a[j++]);
    copy(tmp.begin(), tmp.end(), a.begin() + l);
    return inv;
}
\`\`\`

Complejidad: $O(n \\log n)$.`,
      editorial: null,
    },
    {
      title: 'Problema sin resolver todavia',
      source: 'Codeforces 1900A',
      url: null,
      difficulty: 'UNRATED' as const,
      tagNames: ['implementation'],
      statementNotes: 'Pendiente de intentar - reservado para la proxima sesion de entrenamiento.',
      solution: null,
      editorial: null,
    },
  ];

  for (const demo of demoProblems) {
    const existing = await prisma.problem.findFirst({ where: { title: demo.title } });
    if (existing) continue;

    const tagIds = await Promise.all(
      demo.tagNames.map((name) =>
        prisma.tag.upsert({ where: { name }, update: {}, create: { name } }),
      ),
    );

    const hasSolution = Boolean(demo.solution);
    const problem = await prisma.problem.create({
      data: {
        title: demo.title,
        source: demo.source,
        url: demo.url,
        difficulty: demo.difficulty,
        status: hasSolution ? 'SOLVED_INDIVIDUAL' : 'UNSOLVED',
        statementNotes: demo.statementNotes,
        tags: { create: tagIds.map((tag) => ({ tag: { connect: { id: tag.id } } })) },
      },
    });

    if (demo.solution) {
      await prisma.solution.create({
        data: {
          problemId: problem.id,
          authorId,
          content: demo.solution,
          reasoning: 'Resuelto durante practica individual.',
          timeSpentMin: 25,
          attemptCount: 1,
        },
      });
    }

    if (demo.editorial) {
      await prisma.editorial.create({
        data: { problemId: problem.id, authorId, content: demo.editorial },
      });
    }
  }
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
