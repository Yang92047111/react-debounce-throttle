// Type definitions for the application
export interface DemoConfig {
  delay: number;
  interval: number;
  leading: boolean;
  trailing: boolean;
  maxWait?: number;
}

export interface MetricData {
  normalCount: number;
  optimizedCount: number;
  timestamp: number;
}
