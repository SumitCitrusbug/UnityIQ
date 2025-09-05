export type UserRole = "admin" | "manager" | "staff";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  location?: string;
  avatar?: string;
}

export interface TaskTemplate {
  id: string;
  name: string;
  department: string;
  location: string;
  title: string;
  description?: string;
  expectedOutcome?: string;
  tags: TaskTag[];
  requiredInputs: RequiredInput[];
  status: "draft" | "published" | "archived";
  version: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export type TaskTag = "team" | "individual" | "recurring";
export type RequiredInput = "photo" | "note";

export interface Task {
  id: string;
  templateId?: string;
  title: string;
  description?: string;
  location: string;
  assignee: TaskAssignee;
  dueDate: Date;
  windowStart?: Date;
  windowEnd?: Date;
  requiredInputs: RequiredInput[];
  status:
    | "assigned"
    | "in_progress"
    | "awaiting_review"
    | "completed"
    | "failed"
    | "disputed";
  isAdHoc: boolean;
  completedBy?: string;
  completedAt?: Date;
  proof?: TaskProof;
  grade?: TaskGrade;
  dispute?: TaskDispute;
  createdAt: Date;
  createdBy: string;
}

export interface TaskAssignee {
  type: "individual" | "team" | "role";
  id: string;
  name: string;
}

export interface TaskProof {
  photos?: string[];
  notes?: string;
  submittedAt: Date;
  submittedBy: string;
}

export interface TaskGrade {
  result: "pass" | "fail";
  reason?: string;
  gradedAt: Date;
  gradedBy: string;
  overridden?: boolean;
  overrideReason?: string;
}

export interface TaskDispute {
  id: string;
  reason: string;
  proof?: string;
  submittedAt: Date;
  submittedBy: string;
  status: "pending" | "approved" | "rejected";
  resolvedAt?: Date;
  resolvedBy?: string;
  resolution?: string;
}

export interface Shift {
  id: string;
  title: string;
  location: string;
  brand?: string;
  brandId?: string;
  locationId?: string;
  startTime: Date;
  endTime: Date;
  assignedTo: string;
  role?: string;
  shiftType?: "full" | "split";
  status: "scheduled" | "in_progress" | "completed" | "missed";
  breaks?: Break[];
  clockIn?: Date;
  clockOut?: Date;
  createdAt: Date;
  createdBy: string;
  isRecurring?: boolean;
  recurrencePattern?: RecurrencePattern;
  parentShiftId?: string; // For recurring shifts, links to the original shift
}

export interface RecurrencePattern {
  type: "daily" | "weekly" | "monthly";
  interval: number; // Every X days/weeks/months
  daysOfWeek?: number[]; // 0=Sunday, 1=Monday, etc. for weekly recurrence
  endDate?: Date;
  occurrences?: number; // Number of occurrences instead of end date
}

export interface Break {
  id: string;
  startTime: Date;
  endTime?: Date;
  type: "lunch" | "break";
  status: "scheduled" | "in_progress" | "completed";
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: Date;
  clockIn?: Date;
  clockOut?: Date;
  breaks: Break[];
  status: "present" | "absent" | "late" | "partial";
  score: number;
}

export interface PTORequest {
  id: string;
  userId: string;
  staffName?: string;
  staffId?: string;
  startDate: Date;
  endDate: Date;
  type: "full" | "partial";
  reason: "travel" | "leisure" | "sick" | "emergency" | "other";
  status: "pending" | "approved" | "denied";
  submittedAt: Date;
  submittedBy?: string;
  reviewedAt?: Date;
  reviewedBy?: string;
  notes?: string;
  hoursRequested?: number;
  partialStartTime?: Date;
  partialEndTime?: Date;
  approvedAt?: Date;
  approvedBy?: string;
  approvalNotes?: string;
  deniedAt?: Date;
  deniedBy?: string;
  denialReason?: string;
}

export interface PTOEarning {
  id: string;
  userId: string;
  staffName?: string;
  staffId?: string;
  type: "sick" | "vacation" | "personal" | "holiday" | "bonus";
  hours: number;
  earnedDate: Date;
  description?: string;
  approvedBy?: string;
  approvedAt?: Date;
  status: "pending" | "approved" | "denied";
}

export interface PTOBalance {
  userId: string;
  staffName?: string;
  sickHours: number;
  vacationHours: number;
  personalHours: number;
  holidayHours: number;
  bonusHours: number;
  totalHours: number;
  usedHours: number;
  availableHours: number;
  lastUpdated: Date;
}

export interface Dispute {
  id: string;
  userId: string;
  staffName?: string;
  staffId?: string;
  type:
    | "time_clock"
    | "attendance"
    | "grove_score"
    | "bonus"
    | "task"
    | "other";
  title: string;
  description: string;
  status: "pending" | "under_review" | "resolved" | "rejected";
  priority: "low" | "medium" | "high" | "urgent";
  submittedAt: Date;
  submittedBy?: string;
  assignedTo?: string;
  assignedAt?: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolution?: string;
  evidence?: DisputeEvidence[];
  relatedRecordId?: string; // ID of related time clock, attendance, etc.
  relatedRecordType?: string; // Type of related record
}

export interface DisputeEvidence {
  id: string;
  disputeId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
  uploadedBy: string;
  description?: string;
}

// Groove Score Types (EPIC GS1)
export interface GrooveScore {
  id: string;
  userId: string;
  staffName: string;
  weekStartDate: Date;
  weekEndDate: Date;
  totalScore: number; // Overall percentage
  attendanceScore: number; // Percentage
  punctualityScore: number; // Percentage
  taskEfficiencyScore: number; // Percentage
  customerReviewsScore: number; // Percentage
  isFinalized: boolean;
  finalizedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  locationBreakdown?: LocationScoreBreakdown[];
}

export interface LocationScoreBreakdown {
  locationId: string;
  locationName: string;
  daysWorked: number;
  customerReviewsScore: number; // Location-wide score
  attendanceScore: number;
  punctualityScore: number;
  taskEfficiencyScore: number;
}

export interface GrooveScoreHistory {
  weekStartDate: Date;
  weekEndDate: Date;
  totalScore: number;
  isEligible: boolean; // Had ≥1 completed shift
  isFinalized: boolean;
}

export interface ScoreEvent {
  id: string;
  userId: string;
  weekStartDate: Date;
  type: "false_completion" | "dispute_approved" | "manual_adjustment";
  impact: number; // Percentage change
  description: string;
  createdAt: Date;
  createdBy: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface Report {
  id: string;
  title: string;
  type: "weekly" | "monthly" | "custom";
  filters: ReportFilters;
  data: any;
  generatedAt: Date;
  generatedBy: string;
}

export interface ReportFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  locations?: string[];
  departments?: string[];
  users?: string[];
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: any;
  timestamp: Date;
  ipAddress?: string;
}

export interface BonusRule {
  id: string;
  name: string;
  description: string;
  type: "attendance" | "performance" | "teamwork" | "safety";
  target: number;
  bonus: number;
  status: "active" | "inactive";
  createdAt: Date;
  createdBy: string;
}

export interface BonusEarning {
  id: string;
  employeeName: string;
  ruleName: string;
  amount: number;
  earnedDate: Date;
  status: "pending" | "paid";
}

export interface PayrollRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  position: string;
  hoursWorked: number;
  hourlyRate: number;
  overtimeHours: number;
  overtimeRate: number;
  bonuses: number;
  deductions: number;
  grossPay: number;
  netPay: number;
  status: "pending" | "processed" | "error";
  payPeriod: string;
}
