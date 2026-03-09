export type ExportRequest = {
  month: number;
  year: number;
};

export type ExportProgressMessage = {
  status: "PREPARING" | "GENERATING" | "COMPLETE" | "ERROR";
  progressPercent: number;
  message: string;
  csvData?: string;
};
