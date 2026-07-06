export const SKILL_AREAS = [
  'Matematicas',
  'Programacion Dinamica',
  'Grafos',
  'Estructuras de Datos',
  'Geometria',
  'Teoria de Numeros',
] as const;

export type SkillArea = (typeof SKILL_AREAS)[number];

// Mapeo manual tag -> area. Los tags no listados aqui (arrays, two-pointers,
// merge-sort, implementation, contest-test, ...) no cuentan para ninguna
// area todavia. Actualizar esta tabla cuando aparezcan tags nuevos.
export const TAG_TO_AREA: Record<string, SkillArea> = {
  dp: 'Programacion Dinamica',
  graphs: 'Grafos',
  'shortest-path': 'Grafos',
  'segment-tree': 'Estructuras de Datos',
  'range-queries': 'Estructuras de Datos',
  math: 'Matematicas',
  combinatorics: 'Matematicas',
  probability: 'Matematicas',
  geometry: 'Geometria',
  'convex-hull': 'Geometria',
  'number-theory': 'Teoria de Numeros',
  'modular-arithmetic': 'Teoria de Numeros',
};
