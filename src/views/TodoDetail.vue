<template>
  <div class="fyf-page">
    <div v-if="todo" class="task-detail">
      <div class="task-header">
        <h2 class="task-title" :class="{ 'completed': todo.completed }">
          {{ todo.title }}
        </h2>
        <div class="task-status" :class="getStatusClass(todo)">
          {{ getStatusText(todo) }}
        </div>
      </div>

      <div class="task-content">
        <p class="task-description">{{ todo.text || 'No description provided.' }}</p>

        <div class="task-metadata">
          <div class="metadata-item">
            <span class="metadata-label">Created</span>
            <span class="metadata-value">{{ formatDate(todo.createdAt, true) }}</span>
          </div>

          <div v-if="todo.dueDate" class="metadata-item">
            <span class="metadata-label">Due Date</span>
            <span class="metadata-value" :class="{ 'overdue': isOverdue(todo) }">
              {{ formatDate(todo.dueDate, true) }}
            </span>
          </div>
        </div>
      </div>

      <div class="task-actions">
        <button
            @click="toggleTodo(todo.id)"
            class="action-button"
            :class="todo.completed ? 'undo-button' : 'complete-button'"
        >
          {{ todo.completed ? 'Mark as Incomplete' : 'Mark as Complete' }}
        </button>

        <router-link to="/" class="back-button">
          Back to List
        </router-link>
      </div>
    </div>

    <div v-else class="not-found">
      <p>Task not found</p>
      <router-link to="/" class="back-link">
        Back to Task List
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTodoStore } from '../stores/todoStore'

const route = useRoute()
const todoStore = useTodoStore()

const todoId = parseInt(route.params.id)
const todo = computed(() => todoStore.getTodoById(todoId))

const toggleTodo = (id) => {
  todoStore.toggleTodo(id)
}

const formatDate = (date, includeTime = false) => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  if (includeTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }

  return new Date(date).toLocaleDateString('en-US', options)
}

const isPlanned = (todo) => {
  return !todo.completed && todo.dueDate && new Date(todo.dueDate) > new Date()
}

const isPending = (todo) => {
  return !todo.completed && !todo.dueDate
}

const isOverdue = (todo) => {
  return !todo.completed && todo.dueDate && new Date(todo.dueDate) < new Date()
}

const getStatusText = (todo) => {
  if (todo.completed) return 'Done'
  if (isOverdue(todo)) return 'Overdue'
  if (isPending(todo)) return 'Pending'
  return 'Planned'
}

const getStatusClass = (todo) => {
  if (todo.completed) return 'status-done'
  if (isOverdue(todo)) return 'status-overdue'
  if (isPending(todo)) return 'status-pending'
  return 'status-planned'
}
</script>

<style scoped>
.fyf-page {
  padding: 0 10px;
}

.task-detail {
  background-color: #fff;
  border-left: 3px solid #8a7e55;
}

.task-header {
  padding: 20px;
  border-bottom: 1px dotted #d0c9b5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-title {
  font-size: 1.5rem;
  font-weight: normal;
  color: #5a5338;
  margin: 0;
}

.task-title.completed {
  text-decoration: line-through;
  color: #a9a9a9;
}

.task-status {
  font-size: 0.8rem;
  padding: 4px 10px;
  border-radius: 12px;
}

.status-planned {
  background-color: #f0ead6;
  color: #8a7e55;
}

.status-pending {
  background-color: #f0ead6;
  color: #c0b78e;
}

.status-done {
  background-color: #e6e6e6;
  color: #a9a9a9;
}

.status-overdue {
  background-color: #f5e6df;
  color: #b5836b;
}

.task-content {
  padding: 20px;
}

.task-description {
  color: #5a5338;
  line-height: 1.6;
  margin-bottom: 30px;
  white-space: pre-line;
}

.task-metadata {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dotted #d0c9b5;
}

.metadata-item {
  display: flex;
  flex-direction: column;
}

.metadata-label {
  font-size: 0.8rem;
  color: #8a7e55;
  margin-bottom: 5px;
}

.metadata-value {
  font-size: 0.9rem;
  color: #5a5338;
}

.metadata-value.overdue {
  color: #b5836b;
}

.task-actions {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  border-top: 1px dotted #d0c9b5;
}

.action-button {
  padding: 8px 15px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.complete-button {
  background-color: #8a7e55;
  color: #fff;
}

.complete-button:hover {
  background-color: #776c49;
}

.undo-button {
  background-color: #d0c9b5;
  color: #5a5338;
}

.undo-button:hover {
  background-color: #c0b78e;
}

.back-button {
  padding: 8px 15px;
  background: none;
  border: 1px solid #d0c9b5;
  color: #8a7e55;
  text-decoration: none;
  transition: all 0.2s;
}

.back-button:hover {
  background-color: #f0ead6;
}

.not-found {
  text-align: center;
  padding: 40px 0;
  color: #8a7e55;
}

.back-link {
  display: inline-block;
  margin-top: 15px;
  padding: 8px 15px;
  background-color: #f0ead6;
  color: #8a7e55;
  text-decoration: none;
  border: 1px solid #d0c9b5;
  transition: all 0.2s;
}

.back-link:hover {
  background-color: #e6e0cc;
}

@media (max-width: 600px) {
  .task-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .task-status {
    margin-top: 10px;
  }

  .task-actions {
    flex-direction: column;
    gap: 10px;
  }

  .action-button, .back-button {
    width: 100%;
    text-align: center;
  }
}
</style>