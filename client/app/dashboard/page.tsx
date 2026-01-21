"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full capitalize ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

function ApplicationDetails({ application }: { application: Application }) {
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
      <div className="space-y-2">
        <span className="text-sm text-muted-foreground">Follow-up Date</span>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            Applications
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your job applications
          </p>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Company</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.company}</TableCell>
                  <TableCell>{formatDate(app.appliedDate)}</TableCell>
                  <TableCell>
                    <StatusBadge status={app.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="hidden md:block">
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
                    </div>
                    <div className="md:hidden">
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
