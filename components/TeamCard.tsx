import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
// Reusable Team Card component for dashboards
export function TeamCard({ name, product, progress, members }: any) {
  return (
    <Card className="border-border/40 overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-electric-blue transition-colors">{name}</h3>
            <p className="text-sm text-muted-foreground">{product}</p>
          </div>
          <Badge variant="premium">{members} Members</Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-white font-medium">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-electric-blue transition-all duration-500" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs">View Log</Button>
          <Button size="sm" className="flex-1 text-xs premium">Review</Button>
        </div>
      </CardContent>
    </Card>
  );
}
