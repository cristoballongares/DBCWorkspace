-- AlterTable
ALTER TABLE "NotebookEntry" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "parentId" TEXT;

-- CreateIndex
CREATE INDEX "NotebookEntry_parentId_idx" ON "NotebookEntry"("parentId");

-- AddForeignKey
ALTER TABLE "NotebookEntry" ADD CONSTRAINT "NotebookEntry_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "NotebookEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
