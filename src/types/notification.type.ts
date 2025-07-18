export type NotificationType =
  | "report"
  | "system"
  | "company"
  | "job_post_flagged"
  | "account_locked"
  | "recruiter_request"
  | "high_activity"
  | "payment_issue"
  | "admin_mention"
  | "weekly_summary"
  | "other";

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  time: string;
  link: string;
}
