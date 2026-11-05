export type User = {
  _id: string;
  name: string;
  email: string;
  studentId?: string;
  department?: string;
  phone?: string;
  role?: string;
};

export type TimelineEntry = { status: string; note?: string; by?: any; at: string };

export type Complaint = {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  images: string[];
  location: { building?: string; room?: string };
  status: string;
  assignedTo: { name: string } | null;
  timeline: TimelineEntry[];
  rating?: number;
  feedback?: string;
  createdAt: string;
};

export type Welfare = {
  _id: string;
  type: string;
  details: string;
  documents: string[];
  status: string;
  adminNote?: string;
  createdAt: string;
};

export type Announcement = { _id: string; title: string; body: string; category?: string; createdAt: string };
export type AppNotification = { _id: string; title: string; message: string; read: boolean; createdAt: string };
