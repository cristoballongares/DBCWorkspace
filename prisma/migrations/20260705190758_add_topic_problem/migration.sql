-- CreateTable
CREATE TABLE "TopicProblem" (
    "notebookEntryId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,

    CONSTRAINT "TopicProblem_pkey" PRIMARY KEY ("notebookEntryId","problemId")
);

-- CreateIndex
CREATE INDEX "TopicProblem_problemId_idx" ON "TopicProblem"("problemId");

-- AddForeignKey
ALTER TABLE "TopicProblem" ADD CONSTRAINT "TopicProblem_notebookEntryId_fkey" FOREIGN KEY ("notebookEntryId") REFERENCES "NotebookEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicProblem" ADD CONSTRAINT "TopicProblem_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
