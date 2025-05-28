'use client';

import { useRealtimeVisitors } from '@/lib/realtimeVisitors';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Users, MapPin, Clock } from 'lucide-react';

export function VisitorStats() {
  const { visitors, currentVisitor } = useRealtimeVisitors();
  
  const uniqueCountries = new Set(visitors.map(v => v.country)).size;
  const uniqueCities = new Set(visitors.map(v => `${v.city}, ${v.country}`)).size;
  
  return (
    <div className="space-y-4">
      <Card className="backdrop-blur-sm bg-background/80">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="h-5 w-5 text-blue-500" />
            Live Visitors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">{visitors.length} Active</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">{uniqueCountries} Countries</span>
            </div>
          </div>
          
          {currentVisitor && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  You're visiting from:
                </span>
              </div>
              <p className="text-sm font-semibold">
                {currentVisitor.city}, {currentVisitor.country}
              </p>
            </div>
          )}
          
          {visitors.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Recent Visitors:</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {visitors.slice(0, 5).map((visitor) => (
                  <div key={visitor.id} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      {visitor.city}, {visitor.country}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {Math.round((Date.now() - visitor.timestamp) / 1000 / 60)}m ago
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 