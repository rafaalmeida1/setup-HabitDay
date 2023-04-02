import * as Progress from "@radix-ui/react-progress";

interface ProgressProps {
  progress: number;
}

export function ProgressBar({progress}: ProgressProps) {
  const progressStyles = {
    width: `${progress}%`
  }

  return (
    <Progress.Root className="h-3 rounded-xl bg-zinc-700 w-full mt-4">
      <Progress.Indicator className="h-3 rounded-xl bg-violet-600 transition-all duration-150" style={progressStyles} />
    </Progress.Root>
  );
}
