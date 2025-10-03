import { Progress } from "@/components/ui/progress";

interface MultipleChoiceAnalyticsProps {
  optionCounts: Array<{
    option: string;
    count: number;
    percentage: string;
  }>;
}

export default function MultipleChoiceAnalytics({ optionCounts }: MultipleChoiceAnalyticsProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium">Seçenek Dağılımı:</h4>
      {optionCounts.map((option, index) => (
        <div key={index} className="flex items-center justify-between">
          <span className="text-sm">{option.option}</span>
          <div className="flex items-center gap-2">
            <Progress value={parseFloat(option.percentage)} className="w-24" />
            <span className="text-sm font-medium">{option.count} ({option.percentage}%)</span>
          </div>
        </div>
      ))}
    </div>
  );
}
