<template>
  <div class="todo-list-container">
    <div class="filter-tabs">
      <button
          v-for="option in filterOptions"
          :key="option.value"
          @click="filter = option.value"
          :class="['filter-tab', filter === option.value ? 'active' : '']"
      >
        {{ option.label }}
        <span class="count">{{ getFilterCount(option.value) }}</span>
      </button>
    </div>

    <div class="todo-items">
      <div v-if="filteredTodos.length === 0" class="empty-state">
        <p>No tasks found</p>
        <router-link to="/create" class="create-button">
          Create a new task
        </router-link>
      </div>

      <div
          v-for="todo in filteredTodos"
          :key="todo.id"
          class="todo-item"
          :class="{ 'completed': todo.completed, 'overdue': isOverdue(todo) }"
      >
        <div class="todo-content">
          <h3 class="todo-title">
            <router-link :to="`/todo/${todo.id}`">
              {{ todo.title }}
            </router-link>
          </h3>

          <p class="todo-text" v-if="todo.text">{{ todo.text }}</p>

          <div class="todo-meta">
            <span class="todo-status">{{ getStatusText(todo) }}</span>
            <span class="todo-date" v-if="todo.dueDate">
              Due: {{ formatDate(todo.dueDate) }}
            </span>
          </div>
        </div>

        <div class="todo-actions">
          <label class="checkbox-container">
            <input
                type="checkbox"
                :checked="todo.completed"
                @change="toggleTodo(todo.id)"
            >
            <span class="checkmark"></span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useTodoStore } from "../stores/todoStore";

export default {
  data() {
    return {
      todoStore: useTodoStore(),
      filter: "all",
      now: new Date(),
      intervalId: null,
      isTimerRunning: false,
      filterOptions: [
        { label: "All", value: "all" },
        { label: "Planned", value: "planned" },
        { label: "Pending", value: "pending" },
        { label: "Done", value: "done" },
        { label: "Overdue", value: "overdue" },
      ]
    };
  },
  computed: {
    todos() {
      return this.todoStore.todos;
    },
    plannedTodos() {
      return this.todos.filter(todo => this.isPlanned(todo));
    },
    pendingTodos() {
      return this.todos.filter(todo => this.isPending(todo));
    },
    doneTodos() {
      return this.todos.filter(todo => todo.completed);
    },
    overdueTodos() {
      return this.todos.filter(todo => this.isOverdue(todo));
    },
    filteredTodos() {
      switch (this.filter) {
        case "planned":
          return this.plannedTodos;
        case "pending":
          return this.pendingTodos;
        case "done":
          return this.doneTodos;
        case "overdue":
          return this.overdueTodos;
        default:
          return this.todos;
      }
    }
  },
  methods: {
    startTimer() {
      if (!this.isTimerRunning) {
        this.intervalId = setInterval(() => {
          this.now = new Date();
        }, 60000);
        this.isTimerRunning = true;
      }
    },
    stopTimer() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.isTimerRunning = false;
      }
    },
    isPlanned(todo) {
      return !todo.completed && todo.dueDate && new Date(todo.dueDate) > this.now;
    },
    isPending(todo) {
      return !todo.completed && !todo.dueDate;
    },
    isOverdue(todo) {
      return !todo.completed && todo.dueDate && new Date(todo.dueDate) < this.now;
    },
    getFilterCount(filterValue) {
      switch (filterValue) {
        case "planned":
          return this.plannedTodos.length;
        case "pending":
          return this.pendingTodos.length;
        case "done":
          return this.doneTodos.length;
        case "overdue":
          return this.overdueTodos.length;
        default:
          return this.todos.length;
      }
    },
    toggleTodo(id) {
      this.todoStore.toggleTodo(id);
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    },
    getStatusText(todo) {
      if (todo.completed) return "Done";
      if (this.isOverdue(todo)) return "Overdue";
      if (this.isPending(todo)) return "Pending";
      return "Planned";
    }
  },
  mounted() {
    this.startTimer();
  },
  beforeDestroy() {
    this.stopTimer();
  }
};
</script>

<style scoped>
.todo-list-container {
  padding: 20px 0;
}

.filter-tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #d0c9b5;
}

.filter-tab {
  padding: 10px 15px;
  background: none;
  border: none;
  color: #8a7e55;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.filter-tab:hover {
  background-color: #f0ead6;
}

.filter-tab.active {
  color: #5a5338;
  font-weight: bold;
  border-bottom: 2px solid #8a7e55;
}

.count {
  display: inline-block;
  background-color: #f0ead6;
  color: #8a7e55;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 0.8rem;
  margin-left: 5px;
}

.todo-items {
  margin-top: 20px;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #d0c9b5;
  transition: all 0.2s;
}

.todo-item:hover {
  background-color: #f8f5e6;
}

.todo-item.completed {
  background-color: #f0ead6;
  opacity: 0.7;
}

.todo-item.overdue {
  border-left: 3px solid #e57373;
}

.todo-content {
  flex: 1;
}

.todo-title {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  color: #5a5338;
}

.todo-title a {
  color: #5a5338;
  text-decoration: none;
}

.todo-title a:hover {
  text-decoration: underline;
}

.completed .todo-title {
  text-decoration: line-through;
  color: #8a7e55;
}

.todo-text {
  margin: 0 0 10px 0;
  color: #5a5338;
  font-size: 0.9rem;
}

.todo-meta {
  display: flex;
  gap: 15px;
  font-size: 0.8rem;
}

.todo-status {
  padding: 2px 8px;
  border-radius: 10px;
  background-color: #f0ead6;
  color: #8a7e55;
}

.completed .todo-status {
  background-color: #c8e6c9;
  color: #388e3c;
}

.overdue .todo-status {
  background-color: #ffcdd2;
  color: #d32f2f;
}

.todo-date {
  color: #8a7e55;
}

.todo-actions {
  margin-left: 15px;
}

.checkbox-container {
  display: block;
  position: relative;
  padding-left: 25px;
  cursor: pointer;
  user-select: none;
  height: 20px;
  width: 20px;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #f8f5e6;
  border: 1px solid #8a7e55;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #f0ead6;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #8a7e55;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.empty-state {
  text-align: center;
  padding: 30px 0;
  color: #8a7e55;
}

.create-button {
  display: inline-block;
  margin-top: 15px;
  padding: 8px 15px;
  background-color: #f0ead6;
  color: #8a7e55;
  text-decoration: none;
  border: 1px solid #d0c9b5;
  transition: all 0.2s;
}

.create-button:hover {
  background-color: #e6e0cc;
}
</style>