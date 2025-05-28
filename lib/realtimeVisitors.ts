import { useState, useEffect } from 'react';

export interface VisitorLocation {
  id: string;
  ip: string;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  timestamp: number;
  userAgent?: string;
}

// Get visitor's IP and location
export async function getVisitorLocation(): Promise<VisitorLocation | null> {
  try {
    // First get the IP address
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const { ip } = await ipResponse.json();
    
    // Then get location data from the IP
    const locationResponse = await fetch(`https://ipapi.co/${ip}/json/`);
    const locationData = await locationResponse.json();
    
    if (locationData.latitude && locationData.longitude) {
      return {
        id: `visitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ip,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        city: locationData.city || 'Unknown',
        country: locationData.country_name || 'Unknown',
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting visitor location:', error);
    
    // Fallback to ipapi.co free service
    try {
      const fallbackResponse = await fetch('https://ipapi.co/json/');
      const data = await fallbackResponse.json();
      
      if (data.latitude && data.longitude) {
        return {
          id: `visitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ip: data.ip,
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city || 'Unknown',
          country: data.country_name || 'Unknown',
          timestamp: Date.now(),
          userAgent: navigator.userAgent
        };
      }
    } catch (fallbackError) {
      console.error('Fallback geolocation failed:', fallbackError);
    }
    
    return null;
  }
}

// Store visitor data (you can extend this to use a real database)
class VisitorStore {
  private visitors: Map<string, VisitorLocation> = new Map();
  private listeners: ((visitors: VisitorLocation[]) => void)[] = [];
  
  addVisitor(visitor: VisitorLocation) {
    this.visitors.set(visitor.id, visitor);
    this.notifyListeners();
    
    // Remove visitor after 5 minutes of inactivity
    setTimeout(() => {
      this.removeVisitor(visitor.id);
    }, 5 * 60 * 1000);
  }
  
  removeVisitor(id: string) {
    this.visitors.delete(id);
    this.notifyListeners();
  }
  
  getActiveVisitors(): VisitorLocation[] {
    const now = Date.now();
    const activeVisitors = Array.from(this.visitors.values())
      .filter(visitor => now - visitor.timestamp < 5 * 60 * 1000); // Active in last 5 minutes
    
    return activeVisitors;
  }
  
  subscribe(callback: (visitors: VisitorLocation[]) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }
  
  private notifyListeners() {
    const activeVisitors = this.getActiveVisitors();
    this.listeners.forEach(listener => listener(activeVisitors));
  }
  
  updateVisitorActivity(id: string) {
    const visitor = this.visitors.get(id);
    if (visitor) {
      visitor.timestamp = Date.now();
      this.notifyListeners();
    }
  }
}

export const visitorStore = new VisitorStore();

// Hook for React components
export function useRealtimeVisitors() {
  const [visitors, setVisitors] = useState<VisitorLocation[]>([]);
  const [currentVisitor, setCurrentVisitor] = useState<VisitorLocation | null>(null);
  
  useEffect(() => {
    // Track current visitor
    getVisitorLocation().then(visitor => {
      if (visitor) {
        setCurrentVisitor(visitor);
        visitorStore.addVisitor(visitor);
        
        // Update activity every 30 seconds
        const activityInterval = setInterval(() => {
          visitorStore.updateVisitorActivity(visitor.id);
        }, 30000);
        
        return () => clearInterval(activityInterval);
      }
    });
    
    // Subscribe to visitor updates
    const unsubscribe = visitorStore.subscribe(setVisitors);
    
    return unsubscribe;
  }, []);
  
  return { visitors, currentVisitor };
} 