import { listTags } from '@/services/problem.service';
import { PracticePanel } from '@/components/practice/PracticePanel';
import { ContestSimulationPanel } from '@/components/practice/ContestSimulationPanel';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default async function PracticePage() {
  const tags = await listTags();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-text-primary">Práctica</h1>

      <Tabs defaultValue="individual">
        <TabsList>
          <TabsTrigger value="individual">Individual</TabsTrigger>
          <TabsTrigger value="simulacro">Simulacro</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4 pt-2">
          <p className="text-sm text-text-muted">
            Elige filtros (o deja &quot;Todas&quot; para un problema variado) y recibe un problema al azar de la
            base.
          </p>
          <PracticePanel tags={tags} />
        </TabsContent>

        <TabsContent value="simulacro" className="space-y-4 pt-2">
          <p className="text-sm text-text-muted">
            Define una duración y una mezcla de problemas al azar por tag/dificultad para simular un contest de
            entrenamiento.
          </p>
          <ContestSimulationPanel tags={tags} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
