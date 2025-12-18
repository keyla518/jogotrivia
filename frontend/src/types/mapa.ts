export type Status = "locked" | "current" | "completed";

export interface Regiao {
  id: number;
  status: Status;
  nome?: string; // opcional, pode ser usado para exibir o nome da região
}
