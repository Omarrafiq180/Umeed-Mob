import { Announcement, AppNotification, Complaint, User, Welfare } from "../types";

const day = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

export const mockUser: User = {
  _id: "u1",
  name: "Ali Khan",
  email: "ali@student.edu",
  studentId: "CS-2023-045",
  department: "Computer Science",
  phone: "0300-1234567",
};

export const mockComplaints: Complaint[] = [
  {
    _id: "c1",
    title: "Broken bench",
    description: "The bench outside the library is broken in the middle; someone could get hurt.",
    category: "Facilities",
    priority: "Medium",
    images: [],
    location: { building: "Library", room: "Main Gate" },
    status: "In Progress",
    assignedTo: { name: "Usman (Maintenance)" },
    timeline: [
      { status: "Pending", note: "Complaint submitted", by: "Ali Khan", at: day(3) },
      { status: "In Progress", note: "Assigned to maintenance staff", by: "Admin", at: day(2) },
    ],
    createdAt: day(3),
  },
  {
    _id: "c2",
    title: "Washroom cleaning",
    description: "The Block B washroom has not been cleaned for several days.",
    category: "Cleanliness",
    priority: "High",
    images: [],
    location: { building: "Block B", room: "Ground Floor" },
    status: "Pending",
    assignedTo: null,
    timeline: [{ status: "Pending", note: "Complaint submitted", by: "Ali Khan", at: day(1) }],
    createdAt: day(1),
  },
  {
    _id: "c3",
    title: "No water in hostel",
    description: "There has been no water on the second floor of Hostel 2 since morning.",
    category: "Hostel",
    priority: "High",
    images: [],
    location: { building: "Hostel 2", room: "Floor 2" },
    status: "Resolved",
    assignedTo: { name: "Bilal (Plumber)" },
    timeline: [
      { status: "Pending", note: "Complaint submitted", by: "Ali Khan", at: day(8) },
      { status: "In Progress", note: "Plumber sent", by: "Admin", at: day(7) },
      { status: "Resolved", note: "Pipe has been fixed", by: "Bilal", at: day(6) },
    ],
    createdAt: day(8),
  },
  {
    _id: "c4",
    title: "Classroom projector not working",
    description: "The projector in Room 12 does not turn on.",
    category: "Academic",
    priority: "Low",
    images: [],
    location: { building: "Block A", room: "Room 12" },
    status: "Rejected",
    assignedTo: null,
    timeline: [
      { status: "Pending", note: "Complaint submitted", by: "Ali Khan", at: day(12) },
      { status: "Rejected", note: "A request is already open with the IT department", by: "Admin", at: day(11) },
    ],
    createdAt: day(12),
  },
];

export const mockWelfare: Welfare[] = [
  {
    _id: "w1",
    type: "Fee Aid",
    details: "I need help paying this semester's fee.",
    documents: [],
    status: "Under Review",
    createdAt: day(5),
  },
  {
    _id: "w2",
    type: "Medical",
    details: "Help with medical treatment costs.",
    documents: [],
    status: "Approved",
    adminNote: "Please contact the medical office.",
    createdAt: day(20),
  },
];

export const mockAnnouncements: Announcement[] = [
  { _id: "a1", title: "Campus closed tomorrow", body: "All classes are off tomorrow due to the weather.", category: "Notice", createdAt: day(0) },
  { _id: "a2", title: "Fee aid deadline", body: "Submit your welfare request by this Friday.", category: "Welfare", createdAt: day(2) },
  { _id: "a3", title: "New library hours", body: "The library will now be open from 8 am to 9 pm.", category: "Notice", createdAt: day(6) },
];

export const mockNotifications: AppNotification[] = [
  { _id: "n1", title: "Work started on your complaint", message: "Work has started on your complaint 'Broken bench'.", read: false, createdAt: day(2) },
  { _id: "n2", title: "Complaint resolved", message: "'No water in hostel' has been resolved. Please share your feedback.", read: false, createdAt: day(6) },
  { _id: "n3", title: "Welfare request", message: "Your Medical request has been approved.", read: true, createdAt: day(15) },
];