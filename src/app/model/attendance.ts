export interface Attendance {
  groupedResult: Array<GroupedResult>;
  total: TotalResult;
}



export interface GroupedResult {
  serviceId: number;
  serviceName: string;
  total: number;
  attended: number;
}

export interface TotalResult {
  totalSlots: number;
  totalSlotsBooked: number;
  totalAttended: number;
}
