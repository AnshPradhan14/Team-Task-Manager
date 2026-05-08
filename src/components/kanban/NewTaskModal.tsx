"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createTask } from "@/actions/task";
import { getEmployees } from "@/actions/user";
import { useRouter } from "next/navigation";
import { Plus, ChevronDown, User, Shield } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  designation: string;
}

export function NewTaskModal({
  projectId,
  disabled,
}: {
  projectId: string;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  // Fetch employees when the modal opens
  useEffect(() => {
    if (isOpen) {
      getEmployees()
        .then(setEmployees)
        .catch(() => setEmployees([]));
    }
  }, [isOpen]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createTask({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        priority: formData.get("priority") as "LOW" | "MEDIUM" | "HIGH",
        status: "TODO",
        projectId: projectId,
        assignedToUserId: selectedEmployee || undefined,
      });
      setIsOpen(false);
      setSelectedEmployee("");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
    setLoading(false);
  }

  if (!isOpen)
    return (
      <Button
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className="gap-2"
      >
        <Plus size={16} />
        Create Task
      </Button>
    );

  const selectedEmp = employees.find((e) => e.id === selectedEmployee);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background rounded-xl shadow-2xl w-full max-w-lg p-6 border animate-in fade-in zoom-in duration-200">
        <h2 className="text-2xl font-bold mb-1">Create New Task</h2>
        <p className="text-sm text-muted-foreground mb-5">
          Fill in the details and optionally assign to a team member.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              required
              name="title"
              className="w-full border rounded-lg p-2.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              placeholder="Task title..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              className="w-full border rounded-lg p-2.5 bg-transparent min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              placeholder="What needs to be done..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                name="priority"
                className="w-full border rounded-lg p-2.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="LOW">🟢 Low</option>
                <option value="MEDIUM" selected>🟡 Medium</option>
                <option value="HIGH">🔴 High</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="date"
                name="dueDate"
                className="w-full border rounded-lg p-2.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Assign To Employee */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Assign To{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full border rounded-lg p-2.5 bg-background text-left flex items-center justify-between hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {selectedEmp ? (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {selectedEmp.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <span className="text-sm font-medium">
                        {selectedEmp.name}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {selectedEmp.designation}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">
                    Select an employee...
                  </span>
                )}
                <ChevronDown
                  size={16}
                  className={`text-muted-foreground transition-transform ${showDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                  {/* Unassign option */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedEmployee("");
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-muted/50 transition-colors text-sm text-muted-foreground flex items-center gap-2 border-b"
                  >
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                      <User size={14} />
                    </div>
                    Unassigned
                  </button>

                  {employees.map((emp) => (
                    <button
                      key={emp.id}
                      type="button"
                      onClick={() => {
                        setSelectedEmployee(emp.id);
                        setShowDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left hover:bg-muted/50 transition-colors flex items-center gap-3 ${
                        selectedEmployee === emp.id ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {emp.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">
                            {emp.name}
                          </span>
                          {emp.role === "ADMIN" && (
                            <span className="flex items-center gap-0.5 text-[10px] font-semibold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full shrink-0">
                              <Shield size={10} />
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {emp.designation} · {emp.email}
                        </div>
                      </div>
                      {selectedEmployee === emp.id && (
                        <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      )}
                    </button>
                  ))}

                  {employees.length === 0 && (
                    <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                      No employees found. Invite team members first.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setSelectedEmployee("");
                setShowDropdown(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? "Saving..." : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
