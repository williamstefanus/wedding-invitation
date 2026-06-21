import type { Metadata } from "next";
import {
  Users,
  Mail,
  CheckSquare,
  TrendingUp,
  Heart,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Overview",
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  trend?: string;
}) {
  return (
    <Card shadow="sm">
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-400">{description}</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
            <Icon className="h-5 w-5 text-slate-600" />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-green-500" />
            <span className="text-xs text-green-600 font-medium">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminOverviewPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
          <p className="mt-1 text-sm text-slate-500">
            Wedding &amp; Sangjit platform — at a glance.
          </p>
        </div>
        <Badge variant="gold" dot>
          Platform Active
        </Badge>
      </div>

      {/* Event cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card shadow="sm" className="border-amber-200 bg-amber-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-amber-600 fill-amber-600" />
              <CardTitle className="text-amber-900">Wedding</CardTitle>
            </div>
            <CardDescription className="text-amber-700">
              Holy Matrimony &amp; Reception Dinner
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-amber-800">
              <Calendar className="h-3.5 w-3.5" />
              <span>Date not set — configure in Settings</span>
            </div>
          </CardContent>
        </Card>

        <Card shadow="sm" className="border-rose-200 bg-rose-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-rose-600 fill-rose-600" />
              <CardTitle className="text-rose-900">Sangjit</CardTitle>
            </div>
            <CardDescription className="text-rose-700">
              Sangjit Ceremony
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-rose-800">
              <Calendar className="h-3.5 w-3.5" />
              <span>Date not set — configure in Settings</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Total Guests"
          value="—"
          description="Guests added to the system"
          icon={Users}
        />
        <StatCard
          title="Invitations Sent"
          value="—"
          description="Active invitation links"
          icon={Mail}
        />
        <StatCard
          title="RSVPs Received"
          value="—"
          description="Responses collected"
          icon={CheckSquare}
        />
      </div>

      {/* Coming soon notice */}
      <Card shadow="none" className="border-dashed">
        <CardContent className="py-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <TrendingUp className="h-6 w-6 text-slate-400" />
          </div>
          <p className="mt-4 text-base font-semibold text-slate-700">
            Live data will appear here
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Connect Supabase and add guests to see real-time stats.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
