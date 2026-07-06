"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

type PublicTodo = {
  id: string;
  text: string;
  completed: boolean;
  author: { name: string } | null;
};

export function TodoList({ initialTodos }: { initialTodos: PublicTodo[] }) {
  const [todos, setTodos] = useState(initialTodos)
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    setLoading(true)
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      if (res.ok) {
        const newTodo = await res.json()
        setTodos((prev) => [...prev, newTodo])
        setText("")
        router.refresh()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTodo = async (id: string, currentStatus: boolean) => {
    // Optimistic UI
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !currentStatus } : t))
    try {
      await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentStatus }),
      })
      router.refresh()
    } catch (error) {
      console.error(error)
      // Revert on error
      setTodos(todos.map(t => t.id === id ? { ...t, completed: currentStatus } : t))
    }
  }

  return (
    <div className="rounded-xl border border-border-default bg-bg-surface p-6">
      <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-text-muted" /> Tareas Públicas (To-Do)
      </h2>
      
      <form onSubmit={addTodo} className="flex items-center gap-2 mb-4">
        <Input 
          placeholder="Nueva tarea..." 
          value={text} 
          onChange={(e) => setText(e.target.value)}
          className="h-8 text-sm"
          disabled={loading}
        />
        <Button size="sm" type="submit" disabled={loading || !text.trim()} className="h-8 w-8 p-0 shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {todos.length === 0 ? (
          <p className="text-xs text-text-muted text-center italic py-2">No hay tareas pendientes.</p>
        ) : (
          todos.map(todo => (
            <div key={todo.id} className="flex items-start gap-2 p-2 rounded hover:bg-bg-elevated transition-colors group">
              <input 
                type="checkbox" 
                className="mt-1 cursor-pointer" 
                checked={todo.completed} 
                onChange={() => toggleTodo(todo.id, todo.completed)} 
              />
              <div className="flex flex-col flex-1 min-w-0">
                <span className={`text-sm break-words ${todo.completed ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                  {todo.text}
                </span>
                <span className="text-[10px] text-text-muted">Por: {todo.author?.name ?? "Usuario eliminado"}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
