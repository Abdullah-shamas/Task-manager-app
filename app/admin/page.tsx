// app/admin/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await auth();

  // 1. Authentication check
  if (!session?.user?.id) {
    redirect("/login");
  }

  // 2. Authorization check (Only ADMIN allowed)
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // 3. Sabhi users aur unke tasks fetch karein
  const users = await prisma.user.findMany({
    include: {
      tasks: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Control Panel</h1>
            <p className="text-gray-600 text-sm">Overview of all system users and tasks</p>
          </div>
          <Link
            href="/dashboard"
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-black text-sm"
          >
            ← Back to My Tasks
          </Link>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total Tasks</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((u) => {
                const completedCount = u.tasks.filter((t) => t.isCompleted).length;
                return (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{u.name || "No Name"}</div>
                      <div className="text-sm text-gray-500">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                          u.role === "ADMIN"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{u.tasks.length}</td>
                    <td className="px-6 py-4 text-sm text-green-600 font-medium">
                      {completedCount} / {u.tasks.length}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}