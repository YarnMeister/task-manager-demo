import { createClient } from "@supabase/supabase-js"

// Check if Supabase environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create Supabase client only if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Types for our database
export interface Tab {
  id: string
  name: string
  color: string
  created_at: string
}

export interface Category {
  id: string
  name: string
  tab_id: string
  color: string
  created_at: string
}

export interface Task {
  id: string
  title: string
  completed: boolean
  priority: boolean
  category_id: string
  created_at: string
  updated_at: string
}

// Mock data for when Supabase is not available
const mockTabs: Tab[] = [
  { id: "1", name: "Work", color: "#3B82F6", created_at: new Date().toISOString() },
  { id: "2", name: "Personal", color: "#10B981", created_at: new Date().toISOString() },
  { id: "3", name: "RTSE", color: "#F59E0B", created_at: new Date().toISOString() },
]

const mockCategories: Category[] = [
  { id: "1", name: "Ad hoc", tab_id: "1", color: "#3B82F6", created_at: new Date().toISOString() },
  {
    id: "2",
    name: "Connectors / API Pilot project",
    tab_id: "1",
    color: "#8B5CF6",
    created_at: new Date().toISOString(),
  },
  { id: "3", name: "Customer First / Program", tab_id: "1", color: "#EC4899", created_at: new Date().toISOString() },
  { id: "4", name: "REA general", tab_id: "1", color: "#06B6D4", created_at: new Date().toISOString() },
  { id: "5", name: "Emails/Online", tab_id: "2", color: "#10B981", created_at: new Date().toISOString() },
  { id: "6", name: "Weekend jobs", tab_id: "2", color: "#10B981", created_at: new Date().toISOString() },
  { id: "7", name: "Home improvement", tab_id: "2", color: "#06B6D4", created_at: new Date().toISOString() },
  { id: "8", name: "Shopping", tab_id: "2", color: "#8B5CF6", created_at: new Date().toISOString() },
  { id: "9", name: "Research", tab_id: "2", color: "#3B82F6", created_at: new Date().toISOString() },
  { id: "10", name: "Ad hoc", tab_id: "2", color: "#EC4899", created_at: new Date().toISOString() },
  { id: "11", name: "Xero improvements", tab_id: "3", color: "#F59E0B", created_at: new Date().toISOString() },
  { id: "12", name: "Katana improvements", tab_id: "3", color: "#F59E0B", created_at: new Date().toISOString() },
  { id: "13", name: "Pipedrive improvements", tab_id: "3", color: "#F59E0B", created_at: new Date().toISOString() },
  { id: "14", name: "Board meeting tasks", tab_id: "3", color: "#EF4444", created_at: new Date().toISOString() },
  { id: "15", name: "General", tab_id: "3", color: "#8B5CF6", created_at: new Date().toISOString() },
  { id: "16", name: "Research", tab_id: "3", color: "#EC4899", created_at: new Date().toISOString() },
]

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Better documentation for Pilot project at Epic level",
    completed: false,
    priority: false,
    category_id: "2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Design Program Governance structure",
    completed: false,
    priority: false,
    category_id: "3",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Update the new About section on JPD",
    completed: false,
    priority: true,
    category_id: "3",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "New Amp - speakers",
    completed: false,
    priority: false,
    category_id: "8",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Prune plant in entrance",
    completed: false,
    priority: false,
    category_id: "7",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Investigate how to integrate invoices into Katana",
    completed: false,
    priority: false,
    category_id: "12",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "7",
    title: "Set up shade for new car",
    completed: false,
    priority: false,
    category_id: "6",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "8",
    title: "Mow lawn",
    completed: false,
    priority: false,
    category_id: "6",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "9",
    title: "Update REA searches",
    completed: false,
    priority: false,
    category_id: "10",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "10",
    title: "Update ING bank move saving to spending",
    completed: false,
    priority: false,
    category_id: "5",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "11",
    title: "Supplements for gym",
    completed: false,
    priority: false,
    category_id: "9",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "12",
    title: "Heatmap of Mine visits",
    completed: false,
    priority: false,
    category_id: "14",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// In-memory storage for mock mode
const mockDataStore = {
  tabs: [...mockTabs],
  categories: [...mockCategories],
  tasks: [...mockTasks],
}

// Helper function to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9)

// Database operations with fallback to mock data
export const dbOperations = {
  // Tab operations
  async getTabs(): Promise<Tab[]> {
    if (supabase) {
      const { data, error } = await supabase.from("tabs").select("*").order("created_at", { ascending: true })
      if (error) throw error
      return data || []
    }

    // Return mock data
    return mockDataStore.tabs
  },

  async createTab(name: string, color: string): Promise<Tab> {
    if (supabase) {
      const { data, error } = await supabase.from("tabs").insert({ name, color }).select().single()
      if (error) throw error
      return data
    }

    // Mock implementation
    const newTab: Tab = {
      id: generateId(),
      name,
      color,
      created_at: new Date().toISOString(),
    }
    mockDataStore.tabs.push(newTab)
    return newTab
  },

  async deleteTab(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from("tabs").delete().eq("id", id)
      if (error) throw error
      return
    }

    // Mock implementation
    mockDataStore.tabs = mockDataStore.tabs.filter((tab) => tab.id !== id)
    mockDataStore.categories = mockDataStore.categories.filter((cat) => cat.tab_id !== id)
    mockDataStore.tasks = mockDataStore.tasks.filter((task) => {
      const category = mockDataStore.categories.find((cat) => cat.id === task.category_id)
      return category?.tab_id !== id
    })
  },

  // Category operations
  async getCategories(): Promise<Category[]> {
    if (supabase) {
      const { data, error } = await supabase.from("categories").select("*").order("created_at", { ascending: true })
      if (error) throw error
      return data || []
    }

    return mockDataStore.categories
  },

  async createCategory(name: string, tabId: string, color: string): Promise<Category> {
    if (supabase) {
      const { data, error } = await supabase.from("categories").insert({ name, tab_id: tabId, color }).select().single()
      if (error) throw error
      return data
    }

    const newCategory: Category = {
      id: generateId(),
      name,
      tab_id: tabId,
      color,
      created_at: new Date().toISOString(),
    }
    mockDataStore.categories.push(newCategory)
    return newCategory
  },

  async updateCategory(id: string, name: string): Promise<Category> {
    if (supabase) {
      const { data, error } = await supabase.from("categories").update({ name }).eq("id", id).select().single()
      if (error) throw error
      return data
    }

    const categoryIndex = mockDataStore.categories.findIndex((cat) => cat.id === id)
    if (categoryIndex !== -1) {
      mockDataStore.categories[categoryIndex].name = name
      return mockDataStore.categories[categoryIndex]
    }
    throw new Error("Category not found")
  },

  async deleteCategory(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from("categories").delete().eq("id", id)
      if (error) throw error
      return
    }

    mockDataStore.categories = mockDataStore.categories.filter((cat) => cat.id !== id)
    mockDataStore.tasks = mockDataStore.tasks.filter((task) => task.category_id !== id)
  },

  // Task operations
  async getTasks(): Promise<Task[]> {
    if (supabase) {
      const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: true })
      if (error) throw error
      return data || []
    }

    return mockDataStore.tasks
  },

  async createTask(title: string, categoryId: string): Promise<Task> {
    if (supabase) {
      const { data, error } = await supabase.from("tasks").insert({ title, category_id: categoryId }).select().single()
      if (error) throw error
      return data
    }

    const newTask: Task = {
      id: generateId(),
      title,
      completed: false,
      priority: false,
      category_id: categoryId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockDataStore.tasks.push(newTask)
    return newTask
  },

  async updateTask(id: string, updates: Partial<Omit<Task, "id" | "created_at" | "updated_at">>): Promise<Task> {
    if (supabase) {
      const { data, error } = await supabase.from("tasks").update(updates).eq("id", id).select().single()
      if (error) throw error
      return data
    }

    const taskIndex = mockDataStore.tasks.findIndex((task) => task.id === id)
    if (taskIndex !== -1) {
      mockDataStore.tasks[taskIndex] = {
        ...mockDataStore.tasks[taskIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      }
      return mockDataStore.tasks[taskIndex]
    }
    throw new Error("Task not found")
  },

  async deleteTask(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from("tasks").delete().eq("id", id)
      if (error) throw error
      return
    }

    mockDataStore.tasks = mockDataStore.tasks.filter((task) => task.id !== id)
  },
}
