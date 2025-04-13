<template>
  <div class="fyf-page">
    <h2 class="page-title">New Task</h2>

    <form @submit.prevent="createTodo" class="task-form">
      <div class="form-group">
        <label for="title">Task Title</label>
        <input
            type="text"
            id="title"
            v-model="title"
            required
            placeholder="What needs to be done?"
        >
      </div>

      <div class="form-group">
        <label for="text">Description</label>
        <textarea
            id="text"
            v-model="text"
            rows="4"
            placeholder="Add details about this task..."
        ></textarea>
      </div>

      <div class="form-group form-checkbox">
        <input
            type="checkbox"
            id="hasDueDate"
            v-model="hasDueDate"
        >
        <label for="hasDueDate">Set a deadline</label>
      </div>

      <div class="form-group" v-if="hasDueDate">
        <label for="dueDate">Due Date</label>
        <input
            type="datetime-local"
            id="dueDate"
            v-model="dueDate"
            :required="hasDueDate"
        >
      </div>

      <div class="form-actions">
        <router-link to="/" class="cancel-button">
          Cancel
        </router-link>
        <button type="submit" class="submit-button">
          Create Task
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTodoStore } from '../stores/todoStore'

const router = useRouter()
const todoStore = useTodoStore()

const title = ref('')
const text = ref('')
const hasDueDate = ref(false)
const dueDate = ref('')

const createTodo = () => {
  const todoId = todoStore.addTodo(
      title.value,
      text.value,
      hasDueDate.value ? dueDate.value : null
  )
  router.push(`/todo/${todoId}`)
}
</script>

<style scoped>
.fyf-page {
  padding: 0 10px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: normal;
  color: #5a5338;
  margin-bottom: 20px;
  border-bottom: 1px dotted #d0c9b5;
  padding-bottom: 10px;
}

.task-form {
  background-color: #fff;
  padding: 20px;
  border-left: 3px solid #8a7e55;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #5a5338;
  font-size: 0.9rem;
}

.form-group input[type="text"],
.form-group input[type="datetime-local"],
.form-group textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #d0c9b5;
  background-color: #f8f5e6;
  color: #5a5338;
  font-family: 'Times New Roman', Times, serif;
}

.form-group textarea {
  resize: vertical;
}

.form-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-checkbox input {
  margin: 0;
}

.form-checkbox label {
  margin: 0;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  border-top: 1px dotted #d0c9b5;
  padding-top: 20px;
}

.cancel-button {
  padding: 8px 15px;
  background: none;
  border: 1px solid #d0c9b5;
  color: #8a7e55;
  text-decoration: none;
  transition: all 0.2s;
}

.cancel-button:hover {
  background-color: #f0ead6;
}

.submit-button {
  padding: 8px 15px;
  background-color: #8a7e55;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-button:hover {
  background-color: #776c49;
}

@media (max-width: 600px) {
  .form-actions {
    flex-direction: column;
  }

  .cancel-button, .submit-button {
    text-align: center;
  }
}
</style>