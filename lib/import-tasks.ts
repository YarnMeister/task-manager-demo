import { dbOperations } from "./supabase"

interface ImportTask {
  id: number
  description: string
  category: string
  contactPerson: string
  completed: boolean
  tabType: "work" | "personal" | "rtse"
  starred: boolean
  originalPosition: {
    tabType: string
    category: string
  } | null
}

interface ImportData {
  timestamp: string
  version: string
  totalTaskCount: number
  workTaskCount: number
  personalTaskCount: number
  rtseTaskCount: number
  tasks: ImportTask[]
}

// Embedded JSON data from your backup file
const importData: ImportData = {
  timestamp: "2025-07-29T05:53:30.796Z",
  version: "1.0",
  totalTaskCount: 12,
  workTaskCount: 3,
  personalTaskCount: 7,
  rtseTaskCount: 2,
  tasks: [
    {
      id: 1749610299780,
      description: "Better documentation for Pilot project at Epic level",
      category: "Connectors / API Pilot project",
      contactPerson: "",
      completed: false,
      tabType: "work",
      starred: false,
      originalPosition: {
        tabType: "work",
        category: "Connectors / API Pilot project",
      },
    },
    {
      id: 1749610779405,
      description: "Design Program Governance structure",
      category: "Customer First / Program",
      contactPerson: "Bec",
      completed: false,
      tabType: "work",
      starred: false,
      originalPosition: null,
    },
    {
      id: 1749687857905,
      description: "Update the new About section on JPD",
      category: "Customer First / Program",
      contactPerson: "",
      completed: false,
      tabType: "work",
      starred: true,
      originalPosition: {
        tabType: "work",
        category: "Customer First / Program",
      },
    },
    {
      id: 1749794520155.4053,
      description: "New Amp - speakers",
      category: "Shopping",
      contactPerson: "",
      completed: false,
      tabType: "personal",
      starred: false,
      originalPosition: null,
    },
    {
      id: 1749866416489,
      description: "Prune plant in entrance",
      category: "Home improvement",
      contactPerson: "",
      completed: false,
      tabType: "personal",
      starred: false,
      originalPosition: null,
    },
    {
      id: 1749866936281.1772,
      description: "Investigate how to integrate invoices into Katana",
      category: "Katana improvements",
      contactPerson: "",
      completed: false,
      tabType: "rtse",
      starred: false,
      originalPosition: null,
    },
    {
      id: 1750386907881.0454,
      description: "Set up shade for new car",
      category: "Weekend jobs",
      contactPerson: "",
      completed: false,
      tabType: "personal",
      starred: false,
      originalPosition: null,
    },
    {
      id: 1750386907881.9133,
      description: "Mow lawn",
      category: "Weekend jobs",
      contactPerson: "",
      completed: false,
      tabType: "personal",
      starred: false,
      originalPosition: null,
    },
    {
      id: 1751499648367.915,
      description: "Update REA searches ",
      category: "Ad hoc",
      contactPerson: "",
      completed: false,
      tabType: "personal",
      starred: false,
      originalPosition: null,
    },
    {
      id: 1751586591762.8672,
      description: "Update ING bank move saving to spending",
      category: "Emails/Online",
      contactPerson: "",
      completed: false,
      tabType: "personal",
      starred: false,
      originalPosition: null,
    },
    {
      id: 1751635972295.98,
      description: "Supplements for gymm ",
      category: "Research",
      contactPerson: "",
      completed: false,
      tabType: "personal",
      starred: false,
      originalPosition: null,
    },
    {
      id: 1751942609834.0808,
      description: "Heatmap of Mine visits",
      category: "Board meeting tasks",
      contactPerson: "",
      completed: false,
      tabType: "rtse",
      starred: false,
      originalPosition: null,
    },
  ],
}

export async function importTasksFromJSON(): Promise<{ success: boolean; message: string; imported: number }> {
  try {
    // Get current tabs and categories from database
    const [tabs, categories, existingTasks] = await Promise.all([
      dbOperations.getTabs(),
      dbOperations.getCategories(),
      dbOperations.getTasks(),
    ])

    // Create a mapping of tab names to IDs
    const tabMap = new Map<string, string>()
    tabs.forEach((tab) => {
      tabMap.set(tab.name.toLowerCase(), tab.id)
    })

    // Create a mapping of category names to IDs (within each tab)
    const categoryMap = new Map<string, string>()
    categories.forEach((category) => {
      const tab = tabs.find((t) => t.id === category.tab_id)
      if (tab) {
        const key = `${tab.name.toLowerCase()}-${category.name.toLowerCase()}`
        categoryMap.set(key, category.id)
      }
    })

    // Create a set of existing task titles to avoid duplicates
    const existingTaskTitles = new Set(existingTasks.map((task) => task.title.toLowerCase().trim()))

    let importedCount = 0
    let skippedCount = 0
    const errors: string[] = []

    // Import each task
    for (const task of importData.tasks) {
      try {
        // Check if task already exists
        if (existingTaskTitles.has(task.description.toLowerCase().trim())) {
          skippedCount++
          continue
        }

        // Map tab type to actual tab name
        let tabName = task.tabType
        if (task.tabType === "rtse") {
          tabName = "RTSE"
        } else {
          tabName = task.tabType.charAt(0).toUpperCase() + task.tabType.slice(1)
        }

        // Find the tab ID
        const tabId = tabMap.get(tabName.toLowerCase())
        if (!tabId) {
          errors.push(`Tab not found: ${tabName}`)
          continue
        }

        // Find the category ID
        const categoryKey = `${tabName.toLowerCase()}-${task.category.toLowerCase()}`
        const categoryId = categoryMap.get(categoryKey)
        if (!categoryId) {
          errors.push(`Category not found: ${task.category} in ${tabName}`)
          continue
        }

        // Create the task in database
        const newTask = await dbOperations.createTask(task.description, categoryId)

        // If the task was starred, update it to set priority
        if (task.starred) {
          await dbOperations.updateTask(newTask.id, { priority: true })
        }

        importedCount++
      } catch (error) {
        errors.push(`Failed to import task: ${task.description} - ${error}`)
      }
    }

    let message = `Successfully imported ${importedCount} tasks`
    if (skippedCount > 0) {
      message += `, skipped ${skippedCount} duplicates`
    }
    if (errors.length > 0) {
      message += `, ${errors.length} errors`
      console.warn("Import errors:", errors)
    }

    return {
      success: true,
      message,
      imported: importedCount,
    }
  } catch (error) {
    console.error("Import failed:", error)
    return {
      success: false,
      message: `Import failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      imported: 0,
    }
  }
}
