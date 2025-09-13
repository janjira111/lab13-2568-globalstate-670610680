import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { type TaskItemProps } from "../libs/Task";
import { persist, createJSONStorage } from "zustand/middleware";

export const useTaskStore = create<TaskItemProps>()(
  persist(
    (set) => ({
      tasks: [], // เริ่มต้น
      setTasks: (tasks) => set({ tasks }),
      addTask: (title, description, dueDate, assignees) =>
        set((state) => ({
          tasks: [
            {
              id: uuidv4(),
              title,
              description,
              dueDate,
              assignees,
              isDone: false,
              doneAt: null,
            },
            ...state.tasks, // New task อยู่ด้านบน
          ],
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  isDone: !task.isDone,
                  doneAt: task.isDone ? null : new Date().toISOString(),
                }
              : task
          ),
        })),
      removeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
    }),
    {
      name: "task-storage", // ชื่อ key ใน Local Storage
      storage: createJSONStorage(() => localStorage), // ใช้ localStorage ของ browser
    }
  )
);
