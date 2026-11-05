import api from "../api/client";
import { USE_MOCK } from "../config";
import {
  mockAnnouncements,
  mockComplaints,
  mockNotifications,
  mockUser,
  mockWelfare,
} from "../data/mock";
import { Announcement, AppNotification, Complaint, User, Welfare } from "../types";

/*
  ALL of the mobile app's API calls live in this file.
  If the backend response format is slightly different, only change it here;
  the screens do not need to be touched.
  Assumed: login/register -> { token, user }
*/

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));
const now = () => new Date().toISOString();

// In-memory mock data (only used when USE_MOCK = true)
let complaints = [...mockComplaints];
let welfare = [...mockWelfare];
let notifications = [...mockNotifications];

// The server may return a plain array or an object like { complaints: [...] }
const list = <T,>(data: any, key: string): T[] =>
  Array.isArray(data) ? data : data?.[key] ?? data?.items ?? [];

export const authService = {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    if (USE_MOCK) {
      await delay();
      return { token: "mock-token", user: mockUser };
    }
    const { data } = await api.post("/auth/login", { email, password });
    return data;
  },
  async register(form: {
    name: string; email: string; password: string;
    studentId: string; department: string; phone: string;
  }): Promise<{ token: string; user: User }> {
    if (USE_MOCK) {
      await delay();
      return { token: "mock-token", user: { ...mockUser, ...form, _id: "u1" } };
    }
    const { data } = await api.post("/auth/register", form);
    return data;
  },
  async me(): Promise<User> {
    if (USE_MOCK) {
      await delay(200);
      return mockUser;
    }
    const { data } = await api.get("/auth/me");
    return data.user ?? data;
  },
};

export const complaintService = {
  async mine(status?: string): Promise<Complaint[]> {
    if (USE_MOCK) {
      await delay();
      return status && status !== "All" ? complaints.filter((c) => c.status === status) : complaints;
    }
    const { data } = await api.get("/complaints/mine", {
      params: status && status !== "All" ? { status } : undefined,
    });
    return list<Complaint>(data, "complaints");
  },
  async get(id: string): Promise<Complaint> {
    if (USE_MOCK) {
      await delay(250);
      const c = complaints.find((x) => x._id === id);
      if (!c) throw new Error("Complaint not found");
      return c;
    }
    const { data } = await api.get(`/complaints/${id}`);
    return data.complaint ?? data;
  },
  async create(body: {
    title: string; description: string; category: string; priority: string;
    images: string[]; location: { building?: string; room?: string };
  }): Promise<Complaint> {
    if (USE_MOCK) {
      await delay(600);
      const c: Complaint = {
        _id: "c" + (complaints.length + 1) + Date.now(),
        ...body,
        status: "Pending",
        assignedTo: null,
        timeline: [{ status: "Pending", note: "Complaint submitted", by: "You", at: now() }],
        createdAt: now(),
      };
      complaints = [c, ...complaints];
      return c;
    }
    const { data } = await api.post("/complaints", body);
    return data.complaint ?? data;
  },
  async feedback(id: string, rating: number, feedback: string) {
    if (USE_MOCK) {
      await delay();
      complaints = complaints.map((c) => (c._id === id ? { ...c, rating, feedback } : c));
      return;
    }
    await api.post(`/complaints/${id}/feedback`, { rating, feedback });
  },
};

export const welfareService = {
  async mine(): Promise<Welfare[]> {
    if (USE_MOCK) {
      await delay();
      return welfare;
    }
    const { data } = await api.get("/welfare/mine");
    return list<Welfare>(data, "requests");
  },
  async create(body: { type: string; details: string; documents: string[] }): Promise<Welfare> {
    if (USE_MOCK) {
      await delay(600);
      const w: Welfare = { _id: "w" + Date.now(), ...body, status: "Submitted", createdAt: now() };
      welfare = [w, ...welfare];
      return w;
    }
    const { data } = await api.post("/welfare", body);
    return data.request ?? data;
  },
};

export const announcementService = {
  async list(): Promise<Announcement[]> {
    if (USE_MOCK) {
      await delay();
      return mockAnnouncements;
    }
    const { data } = await api.get("/announcements");
    return list<Announcement>(data, "announcements");
  },
};

export const notificationService = {
  async list(): Promise<AppNotification[]> {
    if (USE_MOCK) {
      await delay();
      return notifications;
    }
    const { data } = await api.get("/notifications");
    return list<AppNotification>(data, "notifications");
  },
  async markRead(id: string) {
    if (USE_MOCK) {
      notifications = notifications.map((n) => (n._id === id ? { ...n, read: true } : n));
      return;
    }
    await api.patch(`/notifications/${id}/read`);
  },
  async markAllRead() {
    if (USE_MOCK) {
      notifications = notifications.map((n) => ({ ...n, read: true }));
      return;
    }
    await api.patch("/notifications/read-all");
  },
};

export const uploadService = {
  // Photos are uploaded here first; the returned links are then sent with the complaint
  async upload(uris: string[]): Promise<string[]> {
    if (!uris.length) return [];
    if (USE_MOCK) {
      await delay();
      return uris;
    }
    const form = new FormData();
    uris.forEach((uri, i) => {
      form.append("files", { uri, name: `photo${i}.jpg`, type: "image/jpeg" } as any);
    });
    const { data } = await api.post("/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.urls as string[];
  },
};