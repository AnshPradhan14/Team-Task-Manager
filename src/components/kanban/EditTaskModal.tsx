"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { updateTask } from "@/actions/task";
import { getEmployees } from "@/actions/user";
import { useRouter } from "next/navigation";
import { Edit2, ChevronDown, User, Shield, X } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  designation: string;
}

interface Task {
  id: number;
  projectId: string;
  title: string;
  description?: string | null;
  priority: string;
  dueDate?: string | Date | null;
  assignedToUserId?: string | null;
}

export function EditTaskModal({
  task,
  projectId,
  isOpen,
  onClose,
}: {
  task: Task;
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState(task.assignedToUserId || "");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

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
      await updateTask(task.id, {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        priority: formData.get("priority") as "LOW" | "MEDIUM" | "HIGH",
        dueDate: formData.get("dueDate") ? new Date(formData.get("dueDate") as string) : undefined,
        assignedToUserId: selectedEmployee || null,
      });
      onClose();
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
    setLoading(false);
  }

  if (!isOpen) return null;

  const selectedEmp = employees.find((e) => e.id === selectedEmployee);

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-background rounded-3xl shadow-2xl w-full max-w-lg p-8 border animate-in fade-in zoom-in duration-300 relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-muted rounded-full transition-colors"
        >
          <X size={20} className="text-muted-foreground" />
        </button>

        <div className="mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
             <Edit2 size={24} />
          </div>
          <h2 className="text-3xl font-black tracking-tight">Edit Task</h2>
          <p className="text-muted-foreground">Modify task details and team assignments.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Task Title</label>
              <input
                required
                name="title"
                defaultValue={task.title}
                className="w-full border rounded-2xl p-4 bg-muted/30 focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                placeholder="What is the task?"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Description</label>
              <textarea
                name="description"
                defaultValue={task.description || ""}
                className="w-full border rounded-2xl p-4 bg-muted/30 focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all min-h-[100px] text-sm leading-relaxed"
                placeholder="Provide some context..."
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Priority</label>
                <select
                  name="priority"
                  defaultValue={task.priority}
                  className="w-full border rounded-2xl p-4 bg-muted/30 focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/10 font-bold appearance-none cursor-pointer"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  defaultValue={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ""}
                  className="w-full border rounded-2xl p-4 bg-muted/30 focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/10 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Assigned Team Member</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full border rounded-2xl p-4 bg-muted/30 text-left flex items-center justify-between hover:bg-background focus:ring-4 focus:ring-primary/10 transition-all"
                >
                  {selectedEmp ? (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-[10px] font-black text-white shadow-sm">
                        {selectedEmp.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate leading-tight">{selectedEmp.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">{selectedEmp.designation}</p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm font-bold">Not Assigned</span>
                  )}
                  <ChevronDown size={18} className={`text-muted-foreground transition-transform duration-300 ${showDropdown ? "rotate-180" : ""}`} />
                </button>

                {showDropdown && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-background border rounded-2xl shadow-2xl z-[110] max-h-60 overflow-y-auto animate-in slide-in-from-bottom-2 duration-300">
                    <button
                      type="button"
                      onClick={() => { setSelectedEmployee(""); setShowDropdown(false); }}
                      className="w-full p-4 text-left hover:bg-muted/50 flex items-center gap-3 border-b border-dashed"
                    >
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <User size={14} />
                      </div>
                      <span className="text-sm font-bold text-muted-foreground">Unassigned</span>
                    </button>
                    {employees.map((emp) => (
                      <button
                        key={emp.id}
                        type="button"
                        onClick={() => { setSelectedEmployee(emp.id); setShowDropdown(false); }}
                        className="w-full p-4 text-left hover:bg-primary/5 flex items-center gap-3 group transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-xs font-black text-primary group-hover:scale-110 transition-transform">
                          {emp.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold flex items-center gap-2">
                            {emp.name}
                            {emp.role === "ADMIN" && <Shield size={12} className="text-amber-500" />}
                          </p>
                          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{emp.designation}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-14 rounded-2xl font-bold border-2"
              onClick={onClose}
            >
              Discard
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="flex-1 h-14 rounded-2xl font-extrabold text-lg shadow-xl shadow-primary/20"
            >
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helper to open the modal from parent
export function useEditTaskModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const openEditModal = (task: Task) => {
    setActiveTask(task);
    setIsOpen(true);
  };

  return {
    isOpen,
    setIsOpen,
    activeTask,
    openEditModal,
  };
}
