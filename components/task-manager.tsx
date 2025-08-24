"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Star, Edit2, Trash2, Check, X, ChevronLeft, Circle, CheckCircle2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { dbOperations, type Tab, type Category, type Task } from "@/lib/supabase"
import { importTasksFromJSON } from "@/lib/import-tasks"

export function TaskManager() {
  const [tabs, setTabs] = useState<Tab[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTab, setActiveTab] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [newTaskTitles, setNewTaskTitles] = useState<Record<string, string>>({})
  const [newCategoryName, setNewCategoryName] = useState("")
  const [showNewTabForm, setShowNewTabForm] = useState(false)
  const [newTabName, setNewTabName] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const [importMessage, setImportMessage] = useState<string | null>(null)

  // Load data from Supabase on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [tabsData, categoriesData, tasksData] = await Promise.all([
        dbOperations.getTabs(),
        dbOperations.getCategories(),
        dbOperations.getTasks(),
      ])

      setTabs(tabsData)
      setCategories(categoriesData)
      setTasks(tasksData)

      // Set active tab to first tab if none selected
      if (tabsData.length > 0 && !activeTab) {
        setActiveTab(tabsData[0].id)
      }
    } catch (error) {
      console.error("Error loading data:", error)
      setError(error instanceof Error ? error.message : "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  // Import tasks from JSON
  const handleImportTasks = async () => {
    try {
      setImporting(true)
      setImportMessage(null)

      const result = await importTasksFromJSON()
      setImportMessage(result.message)

      if (result.success && result.imported > 0) {
        // Reload data to show imported tasks
        await loadData()
      }
    } catch (error) {
      setImportMessage(`Import failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setImporting(false)
    }
  }

  // Filter tasks based on active tab and search query
  const filteredTasks = tasks.filter((task) => {
    const category = categories.find((cat) => cat.id === task.category_id)
    const matchesTab = category?.tab_id === activeTab
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  // Get priority tasks across all tabs
  const priorityTasks = tasks.filter((task) => task.priority && !task.completed)

  // Get categories for active tab
  const activeCategories = categories.filter((cat) => cat.tab_id === activeTab)

  // Add new task
  const addTask = async (categoryId: string, title: string) => {
    if (!title.trim()) return

    try {
      const newTask = await dbOperations.createTask(title.trim(), categoryId)
      setTasks([...tasks, newTask])
      setNewTaskTitles((prev) => ({ ...prev, [categoryId]: "" }))

      // Optional: Add subtle success feedback
      console.log("Task created successfully:", newTask.title)
    } catch (error) {
      console.error("Error creating task:", error)
      // Could add toast notification here
    }
  }

  // Update task
  const updateTask = async (taskId: string, updates: Partial<Omit<Task, "id" | "created_at" | "updated_at">>) => {
    try {
      const updatedTask = await dbOperations.updateTask(taskId, updates)
      setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)))
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  // Delete task
  const deleteTask = async (taskId: string) => {
    try {
      await dbOperations.deleteTask(taskId)
      setTasks(tasks.filter((task) => task.id !== taskId))
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  // Add new category
  const addCategory = async (tabId: string, name: string) => {
    if (!name.trim()) return

    try {
      const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4"]
      const color = colors[Math.floor(Math.random() * colors.length)]

      const newCategory = await dbOperations.createCategory(name.trim(), tabId, color)
      setCategories([...categories, newCategory])
      setNewCategoryName("")
    } catch (error) {
      console.error("Error creating category:", error)
    }
  }

  // Update category
  const updateCategory = async (categoryId: string, name: string) => {
    if (!name.trim()) return

    try {
      const updatedCategory = await dbOperations.updateCategory(categoryId, name.trim())
      setCategories(categories.map((cat) => (cat.id === categoryId ? updatedCategory : cat)))
      setEditingCategory(null)
    } catch (error) {
      console.error("Error updating category:", error)
    }
  }

  // Delete category
  const deleteCategory = async (categoryId: string) => {
    try {
      await dbOperations.deleteCategory(categoryId)
      setTasks(tasks.filter((task) => task.category_id !== categoryId))
      setCategories(categories.filter((cat) => cat.id !== categoryId))
    } catch (error) {
      console.error("Error deleting category:", error)
    }
  }

  // Add new tab
  const addTab = async (name: string) => {
    if (!name.trim()) return

    try {
      const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"]
      const color = colors[tabs.length % colors.length]

      const newTab = await dbOperations.createTab(name.trim(), color)
      setTabs([...tabs, newTab])
      setNewTabName("")
      setShowNewTabForm(false)
    } catch (error) {
      console.error("Error creating tab:", error)
    }
  }

  // Delete tab
  const deleteTab = async (tabId: string) => {
    if (tabs.length <= 1) return

    try {
      await dbOperations.deleteTab(tabId)

      // Remove from local state
      const categoriesToDelete = categories.filter((cat) => cat.tab_id === tabId)
      categoriesToDelete.forEach((cat) => {
        setTasks(tasks.filter((task) => task.category_id !== cat.id))
      })
      setCategories(categories.filter((cat) => cat.tab_id !== tabId))
      setTabs(tabs.filter((tab) => tab.id !== tabId))

      if (activeTab === tabId) {
        const remainingTabs = tabs.filter((tab) => tab.id !== tabId)
        setActiveTab(remainingTabs[0]?.id || "")
      }
    } catch (error) {
      console.error("Error deleting tab:", error)
    }
  }

  const currentTab = tabs.find((tab) => tab.id === activeTab)

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg-primary font-system flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue mx-auto mb-4"></div>
          <div className="text-dark-text-primary text-lg mb-2">Loading your tasks...</div>
          <div className="text-dark-text-secondary text-sm">Syncing with database</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg-primary font-system flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-accent-orange text-6xl mb-4">⚠️</div>
          <div className="text-dark-text-primary text-lg mb-2">Connection Error</div>
          <div className="text-dark-text-secondary text-sm mb-4">{error}</div>
          <Button onClick={loadData} className="bg-accent-blue hover:bg-accent-blue/80 text-white">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg-primary font-system">
      {/* iOS Header - Fixed height for mobile */}
      <div className="bg-dark-bg-primary border-b border-dark-separator sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3 pt-safe-top">
          <Button variant="ghost" size="sm" className="p-2 text-accent-blue hover:bg-dark-bg-tertiary">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-semibold text-dark-text-primary">Task Manager</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleImportTasks}
            disabled={importing}
            className="p-2 text-accent-blue hover:bg-dark-bg-tertiary"
          >
            {importing ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-blue"></div>
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Main Content Container - Responsive padding and max width */}
      <div className="px-3 sm:px-4 lg:px-6 xl:px-8 py-4 max-w-[2000px] mx-auto">
        {/* Import Message */}
        {importMessage && (
          <div className="mb-4 p-3 bg-dark-bg-secondary border border-dark-separator rounded-xl">
            <div className="text-dark-text-primary text-sm font-medium">Import Status</div>
            <div className="text-dark-text-secondary text-xs mt-1">{importMessage}</div>
          </div>
        )}

        {/* Search */}
        <div className="mb-4 lg:mb-6">
          <div className="relative max-w-md lg:max-w-lg mx-auto lg:mx-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-secondary w-4 h-4" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-dark-bg-secondary border-dark-separator text-dark-text-primary placeholder-dark-text-tertiary rounded-xl h-11 focus:border-accent-blue"
            />
          </div>
        </div>

        {/* Tab Selector - Responsive design */}
        <div className="mb-4 lg:mb-6">
          <div className="flex flex-col sm:flex-row gap-2 p-2 bg-dark-bg-secondary rounded-2xl shadow-dark-elevated">
            {/* Mobile: Scrollable horizontal tabs */}
            <div className="flex sm:hidden overflow-x-auto gap-2 pb-2 -mb-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant="ghost"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 min-w-[100px] h-10 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? "text-white shadow-md"
                      : "text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-tertiary"
                  }`}
                  style={{
                    backgroundColor: activeTab === tab.id ? tab.color : "transparent",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: activeTab === tab.id ? "rgba(255,255,255,0.3)" : tab.color,
                      }}
                    />
                    <span className="truncate">{tab.name}</span>
                    {(() => {
                      const tabCategories = categories.filter((cat) => cat.tab_id === tab.id)
                      const tabTaskCount = tasks.filter(
                        (task) => tabCategories.some((cat) => cat.id === task.category_id) && !task.completed,
                      ).length
                      return tabTaskCount > 0 ? (
                        <div
                          className="px-1.5 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: activeTab === tab.id ? "rgba(255,255,255,0.2)" : tab.color,
                            color: "white",
                          }}
                        >
                          {tabTaskCount}
                        </div>
                      ) : null
                    })()}
                  </div>
                </Button>
              ))}
            </div>

            {/* Desktop: Full width tabs */}
            <div className="hidden sm:flex gap-2 flex-1">
              {tabs.map((tab) => (
                <div key={tab.id} className="relative flex-1">
                  <Button
                    variant="ghost"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full h-12 rounded-xl font-semibold text-sm transition-all duration-200 relative overflow-hidden group pr-8 ${
                      activeTab === tab.id
                        ? "text-white shadow-md transform scale-[0.98]"
                        : "text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-tertiary"
                    }`}
                    style={{
                      backgroundColor: activeTab === tab.id ? tab.color : "transparent",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          activeTab === tab.id ? "bg-white/30" : "bg-transparent"
                        }`}
                        style={{
                          backgroundColor: activeTab === tab.id ? "rgba(255,255,255,0.3)" : tab.color,
                        }}
                      />
                      {tab.name}
                      {(() => {
                        const tabCategories = categories.filter((cat) => cat.tab_id === tab.id)
                        const tabTaskCount = tasks.filter(
                          (task) => tabCategories.some((cat) => cat.id === task.category_id) && !task.completed,
                        ).length
                        return tabTaskCount > 0 ? (
                          <div
                            className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-200 ${
                              activeTab === tab.id ? "bg-white/20 text-white" : "text-white"
                            }`}
                            style={{
                              backgroundColor: activeTab === tab.id ? "rgba(255,255,255,0.2)" : tab.color,
                            }}
                          >
                            {tabTaskCount}
                          </div>
                        ) : null
                      })()}
                    </div>

                    {/* Delete button for tabs */}
                    {tabs.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteTab(tab.id)
                        }}
                        className={`absolute top-1 right-1 h-6 w-6 p-0 rounded-full transition-all duration-200 ${
                          activeTab === tab.id
                            ? "bg-white/20 text-white hover:bg-white/30 opacity-0 group-hover:opacity-100"
                            : "bg-ios-red text-white hover:bg-ios-red/80 opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </Button>
                </div>
              ))}

              {/* Add Tab Button */}
              {showNewTabForm ? (
                <div className="flex-1 flex gap-2 items-center px-3">
                  <Input
                    placeholder="Tab name"
                    value={newTabName}
                    onChange={(e) => setNewTabName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addTab(newTabName)
                      if (e.key === "Escape") {
                        setShowNewTabForm(false)
                        setNewTabName("")
                      }
                    }}
                    className="flex-1 h-8 text-sm bg-dark-bg-tertiary border-dark-separator text-dark-text-primary rounded-lg"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={() => addTab(newTabName)}
                    className="h-8 w-8 p-0 bg-ios-green hover:bg-ios-green/80 text-white rounded-lg"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setShowNewTabForm(false)
                      setNewTabName("")
                    }}
                    className="h-8 w-8 p-0 text-dark-text-secondary hover:text-dark-text-primary rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => setShowNewTabForm(true)}
                  className="flex-1 h-12 rounded-xl text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-tertiary border-2 border-dashed border-dark-separator transition-all duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Tab
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Priority Tasks */}
        {priorityTasks.length > 0 && (
          <div className="mb-4 lg:mb-6">
            <h2 className="text-dark-text-secondary text-sm font-medium mb-3 px-1">Priority Tasks</h2>
            <div className="priority-glow-container max-w-4xl mx-auto lg:mx-0">
              <Card className="bg-dark-bg-secondary border-dark-separator rounded-xl shadow-priority-3d overflow-hidden relative">
                {/* Animated glow border */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-orange via-accent-orange to-accent-orange opacity-40 blur-sm"></div>
                <div className="absolute inset-[2px] bg-dark-bg-secondary rounded-xl"></div>

                {/* Content */}
                <div className="relative z-10">
                  {priorityTasks.map((task, index) => {
                    const category = categories.find((cat) => cat.id === task.category_id)
                    const tab = tabs.find((t) => t.id === category?.tab_id)
                    return (
                      <div
                        key={task.id}
                        className={`p-4 ${index !== priorityTasks.length - 1 ? "border-b border-dark-separator" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg flex-shrink-0"
                            style={{ backgroundColor: category?.color || "#3B82F6" }}
                          >
                            <Star className="w-4 h-4 text-white fill-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-dark-text-primary font-medium text-base truncate">{task.title}</p>
                            <p className="text-dark-text-secondary text-sm truncate">
                              {tab?.name} • {category?.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateTask(task.id, { priority: !task.priority })}
                              className="text-accent-orange p-1"
                            >
                              <Star className="w-4 h-4 fill-current" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateTask(task.id, { completed: true })}
                              className="text-ios-green hover:bg-ios-green/10 p-2"
                            >
                              <Check className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Categories - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-4 lg:gap-6 items-start">
          {activeCategories.map((category) => {
            const categoryTasks = filteredTasks.filter((task) => task.category_id === category.id)
            const completedTasks = categoryTasks.filter((task) => task.completed)
            const pendingTasks = categoryTasks.filter((task) => !task.completed)

            return (
              <div key={category.id} className="flex flex-col h-fit">
                {/* Category Header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  {editingCategory === category.id ? (
                    <div className="flex gap-2 flex-1">
                      <Input
                        defaultValue={category.name}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            updateCategory(category.id, e.currentTarget.value)
                          }
                          if (e.key === "Escape") {
                            setEditingCategory(null)
                          }
                        }}
                        className="text-sm bg-dark-bg-secondary border-dark-separator text-dark-text-primary rounded-lg"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingCategory(null)}
                        className="text-dark-text-secondary hover:text-dark-text-primary p-2 flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-dark-text-secondary text-sm font-medium truncate flex-1 mr-2">
                        {category.name}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge
                          variant="secondary"
                          className="bg-dark-bg-tertiary text-dark-text-secondary text-xs border-0"
                        >
                          {categoryTasks.length}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingCategory(category.id)}
                          className="text-dark-text-secondary hover:text-dark-text-primary p-1"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteCategory(category.id)}
                          className="text-dark-text-secondary hover:text-ios-red p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>

                {/* Tasks */}
                {categoryTasks.length > 0 && (
                  <Card className="bg-dark-bg-secondary border-dark-separator rounded-xl shadow-dark-elevated overflow-hidden mb-4">
                    {pendingTasks.map((task, index) => (
                      <div
                        key={task.id}
                        className={`p-4 ${index !== pendingTasks.length - 1 || completedTasks.length > 0 ? "border-b border-dark-separator" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateTask(task.id, { completed: !task.completed })}
                            className="text-dark-text-secondary hover:text-ios-green p-0 flex-shrink-0"
                          >
                            <Circle className="w-5 h-5" />
                          </Button>

                          <div className="flex-1 min-w-0">
                            {editingTask === task.id ? (
                              <Input
                                defaultValue={task.title}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    updateTask(task.id, { title: e.currentTarget.value })
                                    setEditingTask(null)
                                  }
                                  if (e.key === "Escape") {
                                    setEditingTask(null)
                                  }
                                }}
                                className="text-base bg-transparent border-0 text-dark-text-primary p-0 h-auto focus:ring-0"
                                autoFocus
                              />
                            ) : (
                              <p
                                className="text-dark-text-primary text-base font-medium cursor-pointer break-words"
                                onClick={() => setEditingTask(task.id)}
                              >
                                {task.title}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateTask(task.id, { priority: !task.priority })}
                              className={`p-1 ${
                                task.priority
                                  ? "text-accent-orange"
                                  : "text-dark-text-secondary hover:text-accent-orange"
                              }`}
                            >
                              <Star className={`w-4 h-4 ${task.priority ? "fill-current" : ""}`} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteTask(task.id)}
                              className="text-dark-text-secondary hover:text-ios-red p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Completed Tasks */}
                    {completedTasks.map((task, index) => (
                      <div
                        key={task.id}
                        className={`p-4 opacity-60 ${index !== completedTasks.length - 1 ? "border-b border-dark-separator" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateTask(task.id, { completed: !task.completed })}
                            className="text-ios-green p-0 flex-shrink-0"
                          >
                            <CheckCircle2 className="w-5 h-5 fill-current" />
                          </Button>

                          <div className="flex-1 min-w-0">
                            <p className="text-dark-text-secondary text-base font-medium line-through break-words">
                              {task.title}
                            </p>
                          </div>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteTask(task.id)}
                            className="text-dark-text-secondary hover:text-ios-red p-1 flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </Card>
                )}

                {/* Add Task */}
                <Card className="bg-dark-bg-secondary border-dark-separator rounded-xl shadow-dark-elevated">
                  <div className="p-4">
                    <div className="flex gap-3 items-center">
                      <Input
                        placeholder="Add task..."
                        value={newTaskTitles[category.id] || ""}
                        onChange={(e) => setNewTaskTitles((prev) => ({ ...prev, [category.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            addTask(category.id, newTaskTitles[category.id] || "")
                          }
                        }}
                        className="flex-1 text-base bg-transparent border-0 text-dark-text-primary placeholder-dark-text-tertiary px-0 py-1 h-6 focus:ring-0"
                      />

                      {/* Mini Save Button - Right Aligned */}
                      {(newTaskTitles[category.id] || "").trim() && (
                        <Button
                          size="sm"
                          onClick={() => addTask(category.id, newTaskTitles[category.id] || "")}
                          className="h-6 px-2 rounded-xl flex-shrink-0 hover:scale-105 transition-transform duration-200 text-xs font-medium"
                          style={{
                            backgroundColor: category.color,
                            color: "white",
                          }}
                        >
                          Save
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            )
          })}

          {/* Add Category */}
          <div className="flex flex-col">
            <div className="mb-3 px-1 h-6"></div> {/* Spacer to align with category headers */}
            <Card className="bg-dark-bg-secondary border-dark-separator rounded-xl shadow-dark-elevated border-dashed">
              <div className="p-4">
                <div className="flex gap-3 items-center">
                  <Input
                    placeholder="Add category..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addCategory(activeTab, newCategoryName)
                      }
                    }}
                    className="flex-1 text-base bg-transparent border-0 text-dark-text-primary placeholder-dark-text-tertiary px-0 py-1 h-6 focus:ring-0"
                  />

                  {/* Mini Save Button for Category */}
                  {newCategoryName.trim() && (
                    <Button
                      size="sm"
                      onClick={() => addCategory(activeTab, newCategoryName)}
                      className="h-6 px-2 rounded-xl flex-shrink-0 bg-dark-text-secondary hover:bg-dark-text-primary hover:scale-105 transition-all duration-200 text-white text-xs font-medium"
                    >
                      Save
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
