export type DashboardAggregate = 'count' | 'sum' | 'avg' |'calculated';

export interface DashboardMetricConfig {
  key: string;
  label: string;
  aggregate: DashboardAggregate;

  /**
   * Backend-only fields
   * Frontend DOES NOT use these directly
   */
  model?: string;
  column?: string;
  conditions?: Record<string, any>;

  /**
   * Optional UI control
   */
  roles?: string[]; // company, employee, superadmin
}
