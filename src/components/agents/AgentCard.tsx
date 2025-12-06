import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AIAgent } from "@/types/ai-agents";
import { MessageSquare, Lock } from "lucide-react";
import * as Icons from "lucide-react";

interface AgentCardProps {
  agent: AIAgent;
  isUnlocked: boolean;
  onChat: () => void;
}

const AgentCard = ({ agent, isUnlocked, onChat }: AgentCardProps) => {
  const IconComponent = (Icons as any)[agent.icon] || Icons.Bot;

  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/30' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/30' },
    pink: { bg: 'bg-pink-500/10', text: 'text-pink-500', border: 'border-pink-500/30' },
    green: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/30' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/30' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/30' },
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-500', border: 'border-cyan-500/30' },
    yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/30' },
    violet: { bg: 'bg-violet-500/10', text: 'text-violet-500', border: 'border-violet-500/30' },
    indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', border: 'border-indigo-500/30' },
    teal: { bg: 'bg-teal-500/10', text: 'text-teal-500', border: 'border-teal-500/30' },
    rose: { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/30' },
    fuchsia: { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-500', border: 'border-fuchsia-500/30' },
    red: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30' },
    slate: { bg: 'bg-slate-500/10', text: 'text-slate-500', border: 'border-slate-500/30' },
  };

  const colors = colorClasses[agent.color] || colorClasses.amber;

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${!isUnlocked ? 'opacity-70' : ''} ${colors.border} border`}>
      {agent.isAnnualOnly && (
        <Badge className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
          Plan Anual
        </Badge>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className={`p-3 rounded-xl ${colors.bg}`}>
            <IconComponent className={`h-6 w-6 ${colors.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate">{agent.name}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground line-clamp-1">
              {agent.title}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {agent.description}
        </p>
        
        <div className="flex flex-wrap gap-1">
          {agent.capabilities.slice(0, 3).map((capability, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {capability}
            </Badge>
          ))}
          {agent.capabilities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{agent.capabilities.length - 3}
            </Badge>
          )}
        </div>
        
        <Button 
          onClick={onChat}
          disabled={!isUnlocked}
          className={`w-full ${isUnlocked ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white' : ''}`}
          variant={isUnlocked ? "default" : "secondary"}
        >
          {isUnlocked ? (
            <>
              <MessageSquare className="h-4 w-4 mr-2" />
              Chatear con {agent.name}
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Plan GOLD requerido
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AgentCard;
