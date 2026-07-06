-- AlterEnum
ALTER TYPE "ChangeLogEntity" ADD VALUE 'USER';

-- DropForeignKey
ALTER TABLE "ChangeLog" DROP CONSTRAINT "ChangeLog_editorId_fkey";

-- DropForeignKey
ALTER TABLE "ContestPostMortem" DROP CONSTRAINT "ContestPostMortem_authorId_fkey";

-- DropForeignKey
ALTER TABLE "ContestSubmission" DROP CONSTRAINT "ContestSubmission_userId_fkey";

-- DropForeignKey
ALTER TABLE "Editorial" DROP CONSTRAINT "Editorial_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_invitedById_fkey";

-- DropForeignKey
ALTER TABLE "NotebookEntry" DROP CONSTRAINT "NotebookEntry_authorId_fkey";

-- DropForeignKey
ALTER TABLE "PublicTodo" DROP CONSTRAINT "PublicTodo_authorId_fkey";

-- DropForeignKey
ALTER TABLE "RatingSnapshot" DROP CONSTRAINT "RatingSnapshot_userId_fkey";

-- DropForeignKey
ALTER TABLE "Solution" DROP CONSTRAINT "Solution_authorId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingSession" DROP CONSTRAINT "TrainingSession_userId_fkey";

-- AlterTable
ALTER TABLE "ChangeLog" ALTER COLUMN "editorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ContestPostMortem" ALTER COLUMN "authorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ContestSubmission" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Editorial" ALTER COLUMN "authorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Invitation" ALTER COLUMN "invitedById" DROP NOT NULL;

-- AlterTable
ALTER TABLE "NotebookEntry" ALTER COLUMN "authorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PublicTodo" ALTER COLUMN "authorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RatingSnapshot" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Solution" ALTER COLUMN "authorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TrainingSession" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PublicTodo" ADD CONSTRAINT "PublicTodo_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Editorial" ADD CONSTRAINT "Editorial_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestSubmission" ADD CONSTRAINT "ContestSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestPostMortem" ADD CONSTRAINT "ContestPostMortem_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingSnapshot" ADD CONSTRAINT "RatingSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingSession" ADD CONSTRAINT "TrainingSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotebookEntry" ADD CONSTRAINT "NotebookEntry_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeLog" ADD CONSTRAINT "ChangeLog_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
