import { deleteMemo } from "@/libs/debateMemo";

export async function removeMemo(serverMemoId: string) {
  await deleteMemo(serverMemoId);
}