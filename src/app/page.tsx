// This line tells React that this component will use client-side features
"use client"

// Importing necessary functions and components
import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Homemade_Apple } from 'next/font/google'
import { AddTaskDrawer } from "@/components/add-task-drawer"
import { Trash2 } from 'lucide-react'
import Image from "next/image"

// Setting up the custom font
const homemadeApple = Homemade_Apple({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

// Defining what a Task looks like in our app
interface Task {
  id: number
  text: string
  completed: boolean
}

// The main component of our Todo app
export default function TodoList() {
  // Setting up state variables using React's useState hook
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<"All" | "Active" | "Completed">("All")
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // useEffect hook to load tasks from localStorage when the app starts
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks')
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  // useEffect hook to save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  // Getting current date information
  const date = new Date()
  const day = date.getDate().toString().padStart(2, "0")
  const month = date.toLocaleString("default", { month: "long" })
  const year = date.getFullYear()
  const weekday = date.toLocaleString("default", { weekday: "long" })

  // Filtering tasks based on the current filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "Active") return !task.completed
    if (filter === "Completed") return task.completed
    return true
  })

  // Function to toggle a task's completed status
  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  // Function to add a new task
  const addTask = (text: string) => {
    setTasks([
      ...tasks,
      { id: Date.now(), text: text.trim(), completed: false },
    ])
    setIsDrawerOpen(false)
  }

  // Function to delete a task
  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  // The JSX that defines what will be rendered on the page
  return (
    <div className="min-h-screen bg-white p-4 flex flex-col items-center">
      <div className="w-full max-w-[600px] mx-auto">
        {/* Date display */}
        <div className="flex justify-between items-start mb-8">
          <div className="text-5xl sm:text-7xl font-bold">{day}</div>
          <div className="text-right">
            <div className="text-sm sm:text-base text-gray-600">{`${month} ${year}`}</div>
            <div className="text-xs sm:text-sm text-gray-400">{weekday}</div>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2 sm:gap-4 mb-6">
          {["All", "Active", "Completed"].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption as typeof filter)}
              className={`px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm ${
                filter === filterOption
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500"
              }`}
            >
              {filterOption}
            </button>
          ))}
        </div>

        {/* Task list */}
        <div className="space-y-4 mb-6">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="group flex items-center gap-3 border-b border-dashed border-gray-200 pb-4"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                <span
                  className={`${homemadeApple.className} text-lg sm:text-xl flex-grow ${
                    task.completed ? "line-through text-gray-400" : "text-gray-900"
                  }`}
                >
                  {task.text}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-100 rounded"
                  aria-label="Delete task"
                >
                  <Trash2 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ))
          ) : (
            // Empty state when there are no tasks
            <div className="flex flex-col items-center justify-center py-24 px-4 bg-gray-50 rounded-lg">
              <Image
                src="/checklist-icon.svg?height=40&width=40"
                alt="Empty state illustration"
                width={40}
                height={40}
                className="mb-4"
              />
              <p className="text-gray-500 text-center">
                Looks like you're all caught up! Take a break or plot your next move?
              </p>
            </div>
          )}
        </div>

        {/* Add Task Drawer component */}
        <AddTaskDrawer onAddTask={addTask} isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />
      </div>
    </div>
  )
}

