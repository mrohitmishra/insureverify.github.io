import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon: React.ReactNode;
  className?: string;
}

export function StatsCard({ title, value, change, icon, className }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-card rounded-xl border border-card-border p-5 shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1" style={{ fontFamily: "var(--font-display)" }}>
            {value}
          </p>
          {change && (
            <p
              className={cn(
                "text-xs font-medium mt-1",
                change.type === "increase" ? "text-emerald-600" : "text-red-600"
              )}
            >
              {change.type === "increase" ? "↑" : "↓"} {Math.abs(change.value)}% from last month
            </p>
          )}
        </div>
        <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
