import { ref, computed, watch } from "vue"

const todos = ref([])
const nextId = ref(1)

const STORAGE_KEY = "fyf-todos"

const loadTodos = () => {
    const storedTodos = localStorage.getItem(STORAGE_KEY)
    if (storedTodos) {
        const parsedTodos = JSON.parse(storedTodos)
        parsedTodos.forEach((todo) => {
            if (todo.dueDate) todo.dueDate = new Date(todo.dueDate)
            if (todo.createdAt) todo.createdAt = new Date(todo.createdAt)
        })
        todos.value = parsedTodos

        const maxId = Math.max(0, ...parsedTodos.map((todo) => todo.id))
        nextId.value = maxId + 1
    }
}

const saveTodos = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
}

loadTodos()

watch(
    todos,
    () => {
        saveTodos()
    },
    { deep: true },
)

export function useTodoStore() {
    const addTodo = (title, text, dueDate) => {
        const todo = {
            id: nextId.value++,
            title,
            text,
            dueDate: dueDate ? new Date(dueDate) : null,
            completed: false,
            createdAt: new Date(),
        }
        todos.value.push(todo)
        saveTodos() // Save immediately after adding
        return todo.id
    }

    const getTodoById = (id) => {
        return todos.value.find((todo) => todo.id === Number.parseInt(id))
    }

    const toggleTodo = (id) => {
        const todo = getTodoById(id)
        if (todo) {
            todo.completed = !todo.completed
            saveTodos() // Save immediately after toggling
        }
    }

    const getTodosForDate = (date) => {
        const startOfDay = new Date(date)
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date(date)
        endOfDay.setHours(23, 59, 59, 999)

        return todos.value.filter((todo) => {
            if (!todo.dueDate) return false
            const todoDate = new Date(todo.dueDate)
            return todoDate >= startOfDay && todoDate <= endOfDay
        })
    }

    const getTodosForMonth = (year, month) => {
        const startOfMonth = new Date(year, month, 1)
        const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999)

        return todos.value.filter((todo) => {
            if (!todo.dueDate) return false
            const todoDate = new Date(todo.dueDate)
            return todoDate >= startOfMonth && todoDate <= endOfMonth
        })
    }

    const getTodosForYear = (year) => {
        const startOfYear = new Date(year, 0, 1)
        const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999)

        return todos.value.filter((todo) => {
            if (!todo.dueDate) return false
            const todoDate = new Date(todo.dueDate)
            return todoDate >= startOfYear && todoDate <= endOfYear
        })
    }

    const completedTodos = computed(() => {
        return todos.value.filter((todo) => todo.completed)
    })

    const pendingTodos = computed(() => {
        return todos.value.filter((todo) => !todo.completed)
    })

    const onTimeTodos = computed(() => {
        const now = new Date()
        return todos.value.filter((todo) => !todo.completed && todo.dueDate && new Date(todo.dueDate) > now)
    })

    const lateTodos = computed(() => {
        const now = new Date()
        return todos.value.filter((todo) => !todo.completed && todo.dueDate && new Date(todo.dueDate) < now)
    })

    return {
        todos,
        addTodo,
        getTodoById,
        toggleTodo,
        getTodosForDate,
        getTodosForMonth,
        getTodosForYear,
        completedTodos,
        pendingTodos,
        onTimeTodos,
        lateTodos,
    }
}
