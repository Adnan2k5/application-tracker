"use client";

import { useState, lazy, Suspense, useMemo, memo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Dialog = lazy(() =>
  import("@/components/ui/dialog").then((m) => ({ default: m.Dialog })),
);
const DialogContent = lazy(() =>
  import("@/components/ui/dialog").then((m) => ({ default: m.DialogContent })),
);
const DialogHeader = lazy(() =>
  import("@/components/ui/dialog").then((m) => ({ default: m.DialogHeader })),
);
const DialogTitle = lazy(() =>
  import("@/components/ui/dialog").then((m) => ({ default: m.DialogTitle })),
);
const DialogDescription = lazy(() =>
  import("@/components/ui/dialog").then((m) => ({
    default: m.DialogDescription,
  })),
);
const DialogFooter = lazy(() =>
  import("@/components/ui/dialog").then((m) => ({ default: m.DialogFooter })),
);
const DialogTrigger = lazy(() =>
  import("@/components/ui/dialog").then((m) => ({ default: m.DialogTrigger })),
);

const Drawer = lazy(() =>
  import("@/components/ui/drawer").then((m) => ({ default: m.Drawer })),
);
const DrawerContent = lazy(() =>
  import("@/components/ui/drawer").then((m) => ({ default: m.DrawerContent })),
);
const DrawerHeader = lazy(() =>
  import("@/components/ui/drawer").then((m) => ({ default: m.DrawerHeader })),
);
const DrawerTitle = lazy(() =>
  import("@/components/ui/drawer").then((m) => ({ default: m.DrawerTitle })),
);
const DrawerDescription = lazy(() =>
  import("@/components/ui/drawer").then((m) => ({
    default: m.DrawerDescription,
  })),
);
const DrawerFooter = lazy(() =>
  import("@/components/ui/drawer").then((m) => ({ default: m.DrawerFooter })),
);
const DrawerTrigger = lazy(() =>
  import("@/components/ui/drawer").then((m) => ({ default: m.DrawerTrigger })),
);
const DrawerClose = lazy(() =>
  import("@/components/ui/drawer").then((m) => ({ default: m.DrawerClose })),
);

type Status = "applied" | "interviewing" | "offered" | "rejected";

interface Application {
  id: string;
  company: string;
  appliedDate: Date;
  status: Status;
  role: string;
  notes: string;
}

const applications: Application[] = [
  {
    id: "1",
    company: "Stripe",
    appliedDate: new Date(2026, 0, 15),
    status: "interviewing",
    role: "Senior Frontend Engineer",
    notes: "Completed first round. Waiting for system design.",
  },
  {
    id: "2",
    company: "Linear",
    appliedDate: new Date(2026, 0, 10),
    status: "applied",
    role: "Product Engineer",
    notes: "Applied through website.",
  },
  {
    id: "3",
    company: "Vercel",
    appliedDate: new Date(2026, 0, 8),
    status: "offered",
    role: "Software Engineer",
    notes: "Received offer. Need to respond by Jan 25.",
  },
  {
    id: "4",
    company: "Figma",
    appliedDate: new Date(2026, 0, 5),
    status: "rejected",
    role: "Design Engineer",
    notes: "Rejected after final round.",
  },
  {
    id: "5",
    company: "Notion",
    appliedDate: new Date(2026, 0, 3),
    status: "interviewing",
    role: "Full Stack Engineer",
    notes: "Technical screen scheduled for Jan 22.",
  },
];

const statusStyles: Record<Status, string> = {
  applied: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  interviewing: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  offered:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  rejected: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
};

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const StatusBadge = memo(({ status }: { status: Status }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full capitalize ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
});

StatusBadge.displayName = "StatusBadge";

const ApplicationDetails = memo(
  ({ application }: { application: Application }) => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
      application.appliedDate,
    );

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Role</span>
            <span className="text-sm font-medium">{application.role}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <StatusBadge status={application.status} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Applied</span>
            <span className="text-sm font-medium">
              {formatDate(application.appliedDate)}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-sm text-muted-foreground">Notes</span>
          <p className="text-sm">{application.notes}</p>
        </div>
      </div>
    );
  },
);

ApplicationDetails.displayName = "ApplicationDetails";

export default function DashboardPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Check session periodically
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/check-session");
        if (!response.ok) {
          router.push("/login");
        }
      } catch (error) {
        console.error("Session check failed:", error);
        router.push("/login");
      }
    };

    // Check session immediately
    checkSession();

    // Check session every 5 minutes
    const interval = setInterval(checkSession, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const formattedApplications = useMemo(
    () =>
      applications.map((app) => ({
        ...app,
        formattedDate: formatDate(app.appliedDate),
      })),
    [],
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Applications
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track your job applications
            </p>
          </div>
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isLoggingOut && <Spinner className="size-4" />}
            Logout
          </Button>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-50">Company</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formattedApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.company}</TableCell>
                  <TableCell>{app.formattedDate}</TableCell>
                  <TableCell>
                    <StatusBadge status={app.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="hidden md:block">
                      <Suspense fallback={<Spinner className="size-4" />}>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>{app.company}</DialogTitle>
                              <DialogDescription>
                                Application details
                              </DialogDescription>
                            </DialogHeader>
                            <ApplicationDetails application={app} />
                            <DialogFooter>
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button variant="destructive" size="sm">
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </Suspense>
                    </div>
                    <div className="md:hidden">
                      <Suspense fallback={<Spinner className="size-4" />}>
                        <Drawer>
                          <DrawerTrigger asChild>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </DrawerTrigger>
                          <DrawerContent>
                            <DrawerHeader>
                              <DrawerTitle>{app.company}</DrawerTitle>
                              <DrawerDescription>
                                Application details
                              </DrawerDescription>
                            </DrawerHeader>
                            <div className="px-4 overflow-y-auto">
                              <ApplicationDetails application={app} />
                            </div>
                            <DrawerFooter>
                              <Button variant="outline">Edit</Button>
                              <DrawerClose asChild>
                                <Button variant="ghost">Close</Button>
                              </DrawerClose>
                            </DrawerFooter>
                          </DrawerContent>
                        </Drawer>
                      </Suspense>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
