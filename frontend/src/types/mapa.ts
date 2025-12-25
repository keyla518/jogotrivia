export type Status = "locked" | "current" | "completed";

export interface Regiao {
  id: number;
  status: Status;
  nome?: string; 
}
