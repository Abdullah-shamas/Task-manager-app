// app/dashboard/page.tsx
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createTask, toggleTaskStatus, deleteTask } from "@/app/actions";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Safe type-casting for role
  const userRole = (session.user as { role?: string })?.role || "USER";

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        {/* Header with Role, Admin Link & Logout */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
            <p className="text-xs text-gray-500">{session.user.email}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Admin shortcut (Sirf ADMIN ko dikhega) */}
            {userRole === "ADMIN" && (
              <Link
                href="/admin"
                className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-md font-medium transition-colors"
              >
                Admin Panel →
              </Link>
            )}

            <span
              className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                userRole === "ADMIN"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {userRole}
            </span>

            {/* Logout Action */}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md font-medium transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>

        {/* Task Creation Form */}
        <form action={createTask} className="flex gap-2 mb-6">
          <input
            type="text"
            name="title"
            placeholder="Naya task likhein..."
            required
            className="flex-1 border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium transition-colors"
          >
            Add Task
          </button>
        </form>

        {/* Tasks List */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Koi task mojood nahi hai.</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <form action={toggleTaskStatus.bind(null, task.id, task.isCompleted)}>
                    <button
                      type="submit"
                      className={`h-5 w-5 rounded border flex items-center justify-center text-xs transition-colors ${
                        task.isCompleted
                          ? "bg-green-500 text-white border-green-500"
                          : "border-gray-400 hover:border-gray-600"
                      }`}
                      title="Click to toggle status"
                    >
                      {task.isCompleted ? "✓" : ""}
                    </button>
                  </form>

                  <span
                    className={
                      task.isCompleted
                        ? "line-through text-gray-400"
                        : "text-gray-800 font-medium"
                    }
                  >
                    {task.title}
                  </span>
                </div>

                <form action={deleteTask.bind(null, task.id)}>
                  <button
                    type="submit"
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}