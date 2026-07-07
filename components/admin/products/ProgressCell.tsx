import { Progress } from "@/components/ui/Progress";

export function ProgressCell({ progress }: { progress: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <Progress value={progress} className="h-2" />
      </div>
      <span className="min-w-[2.5rem] text-right text-xs font-medium text-muted-foreground">
        {progress}%
      </span>
    </div>
  );
}