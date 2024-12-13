// This line tells React that this is a client-side component
"use client"

// Importing necessary dependencies and components
import * as React from "react"
import { Drawer } from "vaul"
import { Button } from "@/components/ui/button"
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

// Defining the structure of props that this component expects
interface AddTaskDrawerProps {
  onAddTask: (text: string) => void
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

// The main component function
export function AddTaskDrawer({ onAddTask, isOpen, setIsOpen }: AddTaskDrawerProps) {
  // Using React's useState hook to manage the task text input
  const [taskText, setTaskText] = React.useState("")

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault() // Prevents the default form submission behavior
    if (taskText.trim()) { // Checks if the task text is not just whitespace
      onAddTask(taskText) // Calls the function passed from the parent to add the task
      setTaskText("") // Clears the input field
      setIsOpen(false) // Closes the drawer
    }
  }

  // Determines if the "Add Task" button should be disabled
  const isButtonDisabled = taskText.trim() === ""

  // The component's JSX structure
  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
      {/* The button that opens the drawer */}
      <Drawer.Trigger asChild>
        <Button variant="secondary" className="w-full py-6">
          Add Task
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        {/* The semi-transparent overlay behind the drawer */}
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        {/* The main content of the drawer */}
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-[96vh] mt-24 fixed bottom-0 left-0 right-0">
          <div className="p-4 flex-1 overflow-y-auto">
            {/* The handle at the top of the drawer */}
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
            <div className="max-w-[600px] mx-auto h-full flex flex-col justify-center">
              {/* Hidden title for accessibility */}
              <VisuallyHidden asChild>
                <Drawer.Title>Add a new task</Drawer.Title>
              </VisuallyHidden>
              {/* The form for adding a new task */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Add to-do here..."
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  onFocus={(e) => e.target.placeholder = ""}
                  onBlur={(e) => e.target.placeholder = "Add to-do here..."}
                  className="w-full text-lg focus:outline-none border-none p-0 placeholder-gray-600 hover:placeholder-gray-950 transition-colors duration-200"
                  style={{ boxShadow: 'none' }}
                />
                {/* Button for larger screens */}
                <div className="hidden sm:block">
                  <Button type="submit" className="w-full" disabled={isButtonDisabled}>
                    Add Task
                  </Button>
                </div>
              </form>
            </div>
          </div>
          {/* Button for mobile screens */}
          <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
            <Button type="submit" className="w-full" onClick={handleSubmit} disabled={isButtonDisabled}>
              Add Task
            </Button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

