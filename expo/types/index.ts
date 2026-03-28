export interface User {
  id: string;
  username: string;
  profilePicture?: string;
  totalAura: number;
}

export interface AuraEvent {
  id: string;
  groupId: string;
  fromUserId: string;
  toUserId: string;
  points: number;
  description: string;
  timestamp: number;
}

export interface Group {
  id: string;
  name: string;
  code: string;
  members: string[]; // User IDs
  events: string[]; // AuraEvent IDs
}