import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AI_AGENTS, AGENT_TEAMS, AIAgent, AgentTeam } from "@/types/ai-agents";
import AgentCard from "./AgentCard";
import AgentChatInterface from "./AgentChatInterface";
import { Building2, Users, Zap, Crown, ArrowLeft } from "lucide-react";

interface AgencyDashboardProps {
  isUnlocked: boolean;
  isAnnualPlan?: boolean;
  businessContext?: Record<string, any>;
  onBack: () => void;
}

const AgencyDashboard = ({ isUnlocked, isAnnualPlan = false, businessContext, onBack }: AgencyDashboardProps) => {
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [activeTeam, setActiveTeam] = useState<AgentTeam>('strategic');

  const teamIcons: Record<AgentTeam, React.ReactNode> = {
    strategic: <Crown className="h-4 w-4" />,
    content: <Zap className="h-4 w-4" />,
    technology: <Building2 className="h-4 w-4" />,
    bonus: <Users className="h-4 w-4" />
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
      <AgentChatInterface
        agent={selectedAgent}
        onBack={() => setSelectedAgent(null)}
        businessContext={businessContext}
      />
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
            Tu equipo de 16+ especialistas virtuales trabajando 24/7
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
              <div className="text-3xl font-bold text-amber-500">16+</div>
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
