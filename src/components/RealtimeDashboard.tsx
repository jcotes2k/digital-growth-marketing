import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, Eye, Heart, MessageCircle, Share2, Activity, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PlatformMetrics {
  platform: string;
  posts: number;
  engagement: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
}

interface PostPerformance {
  id: string;
  title: string;
  platform: string;
  date: string;
  engagement: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
}

export default function RealtimeDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  // Datos de ejemplo para demostración
  const platformMetrics: PlatformMetrics[] = [
    { platform: 'Facebook', posts: 24, engagement: 8547, reach: 45230, likes: 3245, comments: 567, shares: 234 },
    { platform: 'Instagram', posts: 32, engagement: 12350, reach: 67890, likes: 8920, comments: 890, shares: 450 },
    { platform: 'Twitter', posts: 45, engagement: 6234, reach: 34567, likes: 2890, comments: 234, shares: 678 },
    { platform: 'LinkedIn', posts: 15, engagement: 4567, reach: 23450, likes: 1234, comments: 345, shares: 123 },
    { platform: 'TikTok', posts: 18, engagement: 15678, reach: 89012, likes: 12340, comments: 1234, shares: 890 },
  ];

  const engagementTrend = [
    { date: '01/01', facebook: 820, instagram: 1240, twitter: 590, linkedin: 430 },
    { date: '02/01', facebook: 890, instagram: 1350, twitter: 620, linkedin: 460 },
    { date: '03/01', facebook: 950, instagram: 1450, twitter: 680, linkedin: 490 },
    { date: '04/01', facebook: 1020, instagram: 1560, twitter: 720, linkedin: 520 },
    { date: '05/01', facebook: 1100, instagram: 1680, twitter: 780, linkedin: 560 },
    { date: '06/01', facebook: 1180, instagram: 1790, twitter: 840, linkedin: 590 },
    { date: '07/01', facebook: 1250, instagram: 1890, twitter: 890, linkedin: 620 },
  ];

  const topPosts: PostPerformance[] = [
    {
      id: '1',
      title: 'Lanzamiento de nuevo producto',
      platform: 'Instagram',
      date: '2025-01-20',
      engagement: 2345,
      reach: 15670,
      likes: 1890,
      comments: 234,
      shares: 89,
    },
    {
      id: '2',
      title: 'Tutorial: Cómo usar nuestra plataforma',
      platform: 'TikTok',
      date: '2025-01-18',
      engagement: 3456,
      reach: 23450,
      likes: 2890,
      comments: 345,
      shares: 156,
    },
    {
      id: '3',
      title: 'Oferta especial del mes',
      platform: 'Facebook',
      date: '2025-01-15',
      engagement: 1890,
      reach: 12340,
      likes: 1234,
      comments: 156,
      shares: 67,
    },
    {
      id: '4',
      title: 'Caso de éxito: Cliente destacado',
      platform: 'LinkedIn',
      date: '2025-01-12',
      engagement: 1234,
      reach: 8900,
      likes: 890,
      comments: 234,
      shares: 45,
    },
    {
      id: '5',
      title: 'Tips de marketing digital',
      platform: 'Twitter',
      date: '2025-01-10',
      engagement: 890,
      reach: 5670,
      likes: 567,
      comments: 89,
      shares: 34,
    },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    toast({
      title: "Actualizando datos",
      description: "Obteniendo las últimas métricas...",
    });
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Datos actualizados",
        description: "Dashboard actualizado con éxito",
      });
    }, 1500);
  };

  const totalEngagement = platformMetrics.reduce((sum, m) => sum + m.engagement, 0);
  const totalReach = platformMetrics.reduce((sum, m) => sum + m.reach, 0);
  const totalPosts = platformMetrics.reduce((sum, m) => sum + m.posts, 0);
  const avgEngagement = Math.round(totalEngagement / totalPosts);

  const getEngagementRate = (engagement: number, reach: number) => {
    return ((engagement / reach) * 100).toFixed(2);
  };

  const getPlatformColor = (platform: string) => {
    const colors: { [key: string]: string } = {
      Facebook: 'bg-blue-500',
      Instagram: 'bg-pink-500',
      Twitter: 'bg-sky-500',
      LinkedIn: 'bg-blue-700',
      TikTok: 'bg-black',
    };
    return colors[platform] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard en Tiempo Real</h1>
            <p className="text-muted-foreground">Métricas y análisis de rendimiento de tus redes sociales</p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <TabsList>
                <TabsTrigger value="24hours">24h</TabsTrigger>
                <TabsTrigger value="7days">7 días</TabsTrigger>
                <TabsTrigger value="30days">30 días</TabsTrigger>
                <TabsTrigger value="90days">90 días</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{totalPosts}</div>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% vs período anterior
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Alcance Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{totalReach.toLocaleString()}</div>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +18% vs período anterior
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Engagement Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{totalEngagement.toLocaleString()}</div>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +24% vs período anterior
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Engagement Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{avgEngagement}</div>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +8% vs período anterior
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Engagement Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Engagement</CardTitle>
              <CardDescription>Últimos 7 días por plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={engagementTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="facebook" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="instagram" stroke="#ec4899" strokeWidth={2} />
                  <Line type="monotone" dataKey="twitter" stroke="#0ea5e9" strokeWidth={2} />
                  <Line type="monotone" dataKey="linkedin" stroke="#1e40af" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Platform Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Plataforma</CardTitle>
              <CardDescription>Total de posts publicados</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={platformMetrics}
                    dataKey="posts"
                    nameKey="platform"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {platformMetrics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Engagement by Platform */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement por Plataforma</CardTitle>
              <CardDescription>Comparativa de interacciones</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={platformMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="likes" fill="#ec4899" />
                  <Bar dataKey="comments" fill="#3b82f6" />
                  <Bar dataKey="shares" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Reach by Platform */}
          <Card>
            <CardHeader>
              <CardTitle>Alcance por Plataforma</CardTitle>
              <CardDescription>Personas alcanzadas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={platformMetrics} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="platform" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="reach" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Platform Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento Detallado por Plataforma</CardTitle>
            <CardDescription>Métricas completas de cada red social</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Plataforma</th>
                    <th className="text-right py-3 px-4">Posts</th>
                    <th className="text-right py-3 px-4">Alcance</th>
                    <th className="text-right py-3 px-4">Engagement</th>
                    <th className="text-right py-3 px-4">Tasa</th>
                    <th className="text-right py-3 px-4">Likes</th>
                    <th className="text-right py-3 px-4">Comentarios</th>
                    <th className="text-right py-3 px-4">Compartidos</th>
                  </tr>
                </thead>
                <tbody>
                  {platformMetrics.map((metric) => (
                    <tr key={metric.platform} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getPlatformColor(metric.platform)}`} />
                          <span className="font-medium">{metric.platform}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4">{metric.posts}</td>
                      <td className="text-right py-3 px-4">{metric.reach.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">{metric.engagement.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">
                        <Badge variant="secondary">
                          {getEngagementRate(metric.engagement, metric.reach)}%
                        </Badge>
                      </td>
                      <td className="text-right py-3 px-4">{metric.likes.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">{metric.comments.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">{metric.shares.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Posts con Mejor Rendimiento</CardTitle>
            <CardDescription>Publicaciones más exitosas del período</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPosts.map((post, index) => (
                <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{post.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className={getPlatformColor(post.platform)}>
                          {post.platform}
                        </Badge>
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-6 text-center">
                    <div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1 justify-center mb-1">
                        <Eye className="h-3 w-3" />
                        Alcance
                      </div>
                      <div className="font-bold">{post.reach.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1 justify-center mb-1">
                        <Heart className="h-3 w-3" />
                        Likes
                      </div>
                      <div className="font-bold">{post.likes.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1 justify-center mb-1">
                        <MessageCircle className="h-3 w-3" />
                        Comentarios
                      </div>
                      <div className="font-bold">{post.comments}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1 justify-center mb-1">
                        <Share2 className="h-3 w-3" />
                        Compartidos
                      </div>
                      <div className="font-bold">{post.shares}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}