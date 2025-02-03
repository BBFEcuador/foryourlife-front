export interface Criteria {
  filters: Filter[];
  limit: number;
  offset: number;
}

export interface Filter {
  column: string;
  value: string;
  joinTable: string;
  operation: 'EQUAL' | 'LIKE' | 'IN' | 'GREATER_THAN' | 'LESS_THAN' | 'BETWEEN' | 'JOIN';
  logicalOperator: 'AND' | 'OR';
}
