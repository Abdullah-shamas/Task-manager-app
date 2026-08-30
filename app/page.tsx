export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { createTask, toggleTaskStatus, deleteTask } from './actions';

export default async function HomePage() {
  const projects = await prisma.project.findMany({
    include: {
      tasks: {
        orderBy: { id: 'asc' },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Task Manager</h1>

      <div className="space-y-8">
        {projects.map((project) => (
          <div key={project.id} className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{project.title}</h2>

            {/* Form to Add Task */}
            <form action={createTask} className="flex gap-2 mb-6">
              <input type="hidden" name="projectId" value={project.id} />
              <input
                type="text"
                name="title"
                placeholder="New task title..."
                required
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add
              </button>
            </form>

            {/* Task List */}
            <ul className="space-y-3">
              {project.tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <form
                    action={toggleTaskStatus.bind(null, task.id, task.status)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <button
                      type="submit"
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                        task.status === 'DONE'
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-amber-100 text-amber-700 border-amber-200'
                      }`}
                    >
                      {task.status}
                    </button>
                    <span
                      className={`text-sm ${
                        task.status === 'DONE'
                          ? 'line-through text-gray-400'
                          : 'text-gray-800 font-medium'
                      }`}
                    >
                      {task.title}
                    </span>
                  </form>

                  {/* Delete Button */}
                  <form action={deleteTask.bind(null, task.id)}>
                    <button
                      type="submit"
                      className="text-xs text-red-500 hover:text-red-700 hover:underline px-2 py-1"
                    >
                      Delete
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}