import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FolderOpen,
  Clock,
  Sparkles,
  Image,
  FileText,
  Plus,
  TrendingUp,
  Calendar,
  Zap
} from "lucide-react";

interface MaterialSidebarProps {
  className?: string;
}

export default function MaterialSidebar({ className = "" }: MaterialSidebarProps) {
  const [location] = useLocation();

  const recentProjects = [
    { 
      id: "1", 
      name: "Summer Campaign", 
      type: "campaign", 
      lastEdited: "2 hours ago",
      status: "generating"
    },
    { 
      id: "2", 
      name: "Product Catalog", 
      type: "catalog", 
      lastEdited: "1 day ago",
      status: "completed"
    },
    { 
      id: "3", 
      name: "Holiday Promo", 
      type: "campaign", 
      lastEdited: "3 days ago",
      status: "completed"
    }
  ];

  const quickActions = [
    {
      icon: Sparkles,
      label: "Generate Campaign",
      href: "/campaign-generator",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: FileText,
      label: "Build Catalog",
      href: "/catalog-generator", 
      color: "from-blue-500 to-cyan-500"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'generating': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'campaign' ? Image : FileText;
  };

  return (
    <aside className={`w-80 h-full bg-md-sys-color-surface-container-low/50 backdrop-blur-xl border-r border-md-sys-color-outline-variant ${className}`}>
      <div className="p-6 space-y-6">
        {/* Quick Actions */}
        <Card className="surface-elevation-1 border-md-sys-color-outline-variant">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-md-sys-color-on-surface flex items-center">
              <Zap className="w-5 h-5 mr-2 text-md-sys-color-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} href={action.href}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start h-auto p-4 rounded-2xl hover:bg-md-sys-color-surface-container transition-all duration-200 group"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mr-3 group-hover:scale-105 transition-transform duration-200`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-md-sys-color-on-surface">
                        {action.label}
                      </div>
                      <div className="text-xs text-md-sys-color-on-surface-variant">
                        Create new project
                      </div>
                    </div>
                  </Button>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card className="surface-elevation-1 border-md-sys-color-outline-variant">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-md-sys-color-on-surface flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-md-sys-color-secondary" />
                Recent Projects
              </div>
              <Button variant="ghost" size="sm" className="text-md-sys-color-primary hover:text-md-sys-color-on-primary-container">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentProjects.map((project) => {
              const TypeIcon = getTypeIcon(project.type);
              return (
                <div 
                  key={project.id}
                  className="p-3 rounded-2xl hover:bg-md-sys-color-surface-container transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-md-sys-color-primary-container flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                      <TypeIcon className="w-4 h-4 text-md-sys-color-on-primary-container" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-md-sys-color-on-surface truncate">
                        {project.name}
                      </h4>
                      <p className="text-xs text-md-sys-color-on-surface-variant">
                        {project.lastEdited}
                      </p>
                      <Badge 
                        variant="secondary"
                        className={`mt-1 text-xs px-2 py-0.5 ${getStatusColor(project.status)}`}
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="surface-elevation-1 border-md-sys-color-outline-variant">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-md-sys-color-on-surface flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-md-sys-color-tertiary" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-md-sys-color-on-surface-variant">
                Campaigns Created
              </span>
              <span className="font-semibold text-md-sys-color-on-surface">
                12
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-md-sys-color-on-surface-variant">
                Assets Generated
              </span>
              <span className="font-semibold text-md-sys-color-on-surface">
                148
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-md-sys-color-on-surface-variant">
                Time Saved
              </span>
              <span className="font-semibold text-md-sys-color-on-surface">
                32h
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}