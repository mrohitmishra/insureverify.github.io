import { cn } from "@/lib/utils";
import { Lock, Clock, CheckCircle2, AlertCircle, Play } from "lucide-react";

// Enhancement: align status labels with the finalized workflow while keeping legacy statuses.
type Status =
  | "created"
  | "assigned"
  | "inspected"
  | "verified"
  | "completed"
  | "started"
  | "pending"
  | "in-progress"
  | "locked";

interface StatusBadgeProps {
  status: Status;
  showIcon?: boolean;
  className?: string;
}

const statusConfig: Record<Status, { label: string; icon: React.ElementType; className: string }> = {
  created: {
    label: "Created",
    icon: Clock,
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  assigned: {
    label: "Assigned",
    icon: Play,
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  inspected: {
    label: "Inspected",
    icon: AlertCircle,
    className: "bg-purple-100 text-purple-700 border-purple-200",
  },
  verified: {
    label: "Verified",
    icon: CheckCircle2,
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  started: {
    label: "Started",
    icon: Play,
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  "in-progress": {
    label: "In Progress",
    icon: AlertCircle,
    className: "bg-purple-100 text-purple-700 border-purple-200",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  locked: {
    label: "Locked",
    icon: Lock,
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
};

export function StatusBadge({ status, showIcon = true, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
      data-testid={`status-badge-${status}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {config.label}
    </span>
  );
}
