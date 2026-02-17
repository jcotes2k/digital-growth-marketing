import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AI_AGENTS, AGENT_TEAMS, AIAgent, AgentTeam, getAgentById } from "@/types/ai-agents";
import AgentCard from "./AgentCard";
import AgentChatInterface from "./AgentChatInterface";
import { Building2, Users, Zap, Crown, ArrowLeft } from "lucide-react";
import * as Icons from "lucide-react";

interface AgencyDashboardProps {
  isUnlocked: boolean;
  isAnnualPlan?: boolean;
  businessContext?: Record<string, any>;
  onBack: () => void;
  initialAgentId?: string;
}

const AgencyDashboard = ({ isUnlocked, isAnnualPlan = false, businessContext, onBack, initialAgentId }: AgencyDashboardProps) => {
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [activeTeam, setActiveTeam] = useState<AgentTeam>('strategic');

  useEffect(() => {
    if (initialAgentId) {
      const agent = getAgentById(initialAgentId as any);
      if (agent) {
        setSelectedAgent(agent);
      }
    }
  }, [initialAgentId]);

  const teamIcons: Record<AgentTeam, React.ReactNode> = {
    strategic: <Crown className="h-4 w-4" />,
    content: <Zap className="h-4 w-4" />,
    technology: <Building2 className="h-4 w-4" />,
    bonus: <Users className="h-4 w-4" />
  };

  const colorMap: Record<string, { bg: string; text: string }> = {
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-500' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-500' },
    pink: { bg: 'bg-pink-500/10', text: 'text-pink-500' },
    green: { bg: 'bg-green-500/10', text: 'text-green-500' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-500' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-500' },
    yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-500' },
    violet: { bg: 'bg-violet-500/10', text: 'text-violet-500' },
    indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-500' },
    teal: { bg: 'bg-teal-500/10', text: 'text-teal-500' },
    rose: { bg: 'bg-rose-500/10', text: 'text-rose-500' },
    fuchsia: { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-500' },
    red: { bg: 'bg-red-500/10', text: 'text-red-500' },
    slate: { bg: 'bg-slate-500/10', text: 'text-slate-500' },
    sky: { bg: 'bg-sky-500/10', text: 'text-sky-500' },
  };

  const getTeamAgents = (team: AgentTeam) => {
    return AI_AGENTS.filter(agent => agent.team === team);
  };

  const isAgentUnlocked = (agent: AIAgent) => {
    if (!isUnlocked) return false;
    if (agent.isAnnualOnly && !isAnnualPlan) return false;
    return true;
  };

  if (selectedAgent) {
    return (
      <div className="space-y-4">
        {/* Interactive agent bar */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSelectedAgent(null)} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <ScrollArea className="flex-1">
            <div className="flex items-center gap-2 pb-2">
              {AI_AGENTS.filter(a => !a.isAnnualOnly || isAnnualPlan).map((agent) => {
                const IconComp = (Icons as any)[agent.icon] || Icons.Bot;
                const colors = colorMap[agent.color] || colorMap.amber;
                const isActive = agent.id === selectedAgent.id;

                return (
                  <TooltipProvider key={agent.id} delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setSelectedAgent(agent)}
                          className={`p-2 rounded-lg transition-all shrink-0 ${
                            isActive
                              ? `${colors.bg} ring-2 ring-offset-1 ring-current ${colors.text} scale-110`
                              : `hover:${colors.bg} opacity-60 hover:opacity-100`
                          }`}
                        >
                          <IconComp className={`h-5 w-5 ${colors.text}`} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs">
                        <p className="font-semibold">{agent.name}</p>
                        <p className="text-muted-foreground">{agent.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        <AgentChatInterface
          agent={selectedAgent}
          onBack={() => setSelectedAgent(null)}
          businessContext={businessContext}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
            Agencia de Marketing IA
          </h2>
          <p className="text-muted-foreground">
            Tu equipo de 17+ especialistas virtuales trabajando 24/7
          </p>
        </div>
        <Badge className="ml-auto bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
          GOLD
        </Badge>
      </div>

      <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-yellow-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-amber-500" />
            Resumen de la Agencia
          </CardTitle>
          <CardDescription>
            Acceso a especialistas virtuales que utilizan el contexto de tus Fases Principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-background/50">
              <div className="text-3xl font-bold text-amber-500">17+</div>
              <div className="text-sm text-muted-foreground">Especialistas IA</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-background/50">
              <div className="text-3xl font-bold text-amber-500">24/7</div>
              <div className="text-sm text-muted-foreground">Disponibilidad</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-background/50">
              <div className="text-3xl font-bold text-amber-500">4</div>
              <div className="text-sm text-muted-foreground">Equipos</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-background/50">
              <div className="text-3xl font-bold text-amber-500">∞</div>
              <div className="text-sm text-muted-foreground">Conversaciones</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTeam} onValueChange={(v) => setActiveTeam(v as AgentTeam)} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          {AGENT_TEAMS.map((team) => (
            <TabsTrigger key={team.id} value={team.id} className="flex items-center gap-2">
              {teamIcons[team.id]}
              <span className="hidden sm:inline">{team.name.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {AGENT_TEAMS.map((team) => (
          <TabsContent key={team.id} value={team.id}>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{team.name}</h3>
                <p className="text-sm text-muted-foreground">{team.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getTeamAgents(team.id).map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    isUnlocked={isAgentUnlocked(agent)}
                    onChat={() => setSelectedAgent(agent)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AgencyDashboard;
