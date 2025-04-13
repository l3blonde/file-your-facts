<template>
  <div class="overview-container">
    <div class="paper">
      <!-- View Selector -->
      <div class="view-selector">
        <span class="view-label">View:</span>
        <div class="view-options">
          <button
              @click="currentView = 'day'"
              :class="['view-option', currentView === 'day' ? 'active' : '']"
          >
            Today
          </button>
          <button
              @click="currentView = 'month'"
              :class="['view-option', currentView === 'month' ? 'active' : '']"
          >
            This Month
          </button>
          <button
              @click="currentView = 'year'"
              :class="['view-option', currentView === 'year' ? 'active' : '']"
          >
            This Year
          </button>
        </div>
      </div>

      <!-- Slogan -->
      <div class="slogan">
        "Complete One Task Today, Check One Overdue, Plan One for Tomorrow"
      </div>

      <div class="two-columns">
        <!-- Todo List Column -->
        <div class="column">
          <h3 class="section-title">
            {{ listTitle }}
          </h3>

          <div v-if="filteredTodos.length > 0" class="todo-list">
            <div
                v-for="(todo, index) in filteredTodos"
                :key="todo.id"
                class="todo-item"
            >
              <div class="todo-number">{{ index + 1 }}</div>
              <div class="todo-text">{{ todo.title }}</div>
              <input
                  type="checkbox"
                  class="todo-checkbox"
                  :checked="todo.completed"
                  @change="toggleTodo(todo.id)"
              >
            </div>
          </div>

          <div v-else class="empty-state">
            <p>No tasks found for this period</p>
            <router-link to="/create" class="create-button">
              Create a new task
            </router-link>
          </div>
        </div>

        <!-- Calendar Column -->
        <div class="column">
          <div class="date-header">
            <button class="nav-arrow prev" @click="navigatePrevious">
              &lt;
            </button>

            <div class="date-display">
              <div v-if="currentView === 'day'">
                <div class="day-name">{{ dayOfWeek }}</div>
                <div class="day-number">{{ selectedDay }}</div>
                <div class="month-year">{{ monthName }} {{ year }}</div>
              </div>

              <div v-if="currentView === 'month'">
                <div class="month-year">{{ monthName }} {{ year }}</div>
              </div>

              <div v-if="currentView === 'year'">
                <div class="year-display">{{ year }}</div>
              </div>
            </div>

            <button class="nav-arrow next" @click="navigateNext">
              &gt;
            </button>
          </div>

          <!-- Calendar for day view -->
          <div v-if="currentView === 'day'" class="mini-calendar">
            <div class="calendar-header">
              <div v-for="day in ['S', 'M', 'T', 'W', 'T', 'F', 'S']" :key="day" class="weekday">
                {{ day }}
              </div>
            </div>

            <div class="calendar-grid">
              <div
                  v-for="(day, index) in calendarDays"
                  :key="index"
                  :class="[
                  'calendar-day',
                  day.isCurrentMonth ? '' : 'other-month',
                  day.date && day.date.getDate() === selectedDay &&
                  day.date.getMonth() === selectedDate.getMonth() ? 'selected-day' : '',
                  day.date && day.date.getDate() === today.getDate() &&
                  day.date.getMonth() === today.getMonth() &&
                  day.date.getFullYear() === today.getFullYear() ? 'today' : '',
                  day.hasTodos ? 'has-todos' : ''
                ]"
                  @click="day.isCurrentMonth && selectDay(day.date)"
              >
                {{ day.date ? day.date.getDate() : '' }}
              </div>
            </div>
          </div>

          <!-- Calendar for month view - now matching the mini-calendar style -->
          <div v-if="currentView === 'month'" class="month-view-calendar">
            <div class="calendar-header">
              <div v-for="day in ['S', 'M', 'T', 'W', 'T', 'F', 'S']" :key="day" class="weekday">
                {{ day }}
              </div>
            </div>

            <div class="month-calendar-grid">
              <div
                  v-for="(day, index) in calendarDays"
                  :key="index"
                  :class="[
                  'month-calendar-day',
                  day.isCurrentMonth ? '' : 'other-month',
                  day.date && day.date.getDate() === selectedDay &&
                  day.date.getMonth() === selectedDate.getMonth() ? 'selected-day' : '',
                  day.date && day.date.getDate() === today.getDate() &&
                  day.date.getMonth() === today.getMonth() &&
                  day.date.getFullYear() === today.getFullYear() ? 'today' : '',
                  day.hasTodos ? 'has-todos' : ''
                ]"
                  @click="day.isCurrentMonth && selectDay(day.date)"
              >
                {{ day.date ? day.date.getDate() : '' }}
                <div v-if="day.hasTodos" class="todo-indicator">{{ getTodosForDate(day.date).length }}</div>
              </div>
            </div>
          </div>

          <!-- Year view shows months -->
          <div v-if="currentView === 'year'" class="year-grid">
            <div
                v-for="(month, index) in months"
                :key="month"
                :class="['year-month', getMonthTodos(index).length > 0 ? 'has-todos' : '']"
                @click="selectMonth(index)"
            >
              <div class="month-name">{{ month }}</div>
              <div class="month-indicator" v-if="getMonthTodos(index).length > 0">
                {{ getMonthTodos(index).length }}
              </div>
            </div>
          </div>
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
      today: new Date(),
      currentView: 'day',
      selectedDate: new Date(),
      months: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ]
    };
  },
  computed: {
    selectedDay() {
      return this.selectedDate.getDate();
    },
    selectedMonth() {
      return this.selectedDate.getMonth();
    },
    year() {
      return this.selectedDate.getFullYear();
    },
    dayOfWeek() {
      return this.selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    },
    monthName() {
      return this.selectedDate.toLocaleDateString('en-US', { month: 'long' });
    },
    listTitle() {
      switch(this.currentView) {
        case 'day':
          return `Today's Todo`;
        case 'month':
          return `Tasks for ${this.monthName} ${this.year}`;
        case 'year':
          return `Tasks for ${this.year}`;
        default:
          return "Tasks";
      }
    },
    filteredTodos() {
      switch(this.currentView) {
        case 'day':
          return this.todoStore.getTodosForDate(this.selectedDate);
        case 'month':
          return this.todoStore.getTodosForMonth(this.year, this.selectedMonth);
        case 'year':
          return this.todoStore.getTodosForYear(this.year);
        default:
          return [];
      }
    },
    calendarDays() {
      const days = [];
      const month = this.selectedDate.getMonth();
      const year = this.selectedDate.getFullYear();

      // Previous month days
      const firstDay = new Date(year, month, 1);
      const firstDayOfWeek = firstDay.getDay();

      if (firstDayOfWeek > 0) {
        const prevMonth = new Date(year, month, 0);
        const prevMonthDays = prevMonth.getDate();

        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
          const day = prevMonthDays - i;
          const date = new Date(year, month - 1, day);
          days.push({
            date,
            isCurrentMonth: false,
            hasTodos: this.todoStore.getTodosForDate(date).length > 0
          });
        }
      }

      // Current month days
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();

      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        days.push({
          date,
          isCurrentMonth: true,
          hasTodos: this.todoStore.getTodosForDate(date).length > 0
        });
      }

      // Next month days
      const lastDayOfWeek = lastDay.getDay();

      if (lastDayOfWeek < 6) {
        for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
          const date = new Date(year, month + 1, i);
          days.push({
            date,
            isCurrentMonth: false,
            hasTodos: this.todoStore.getTodosForDate(date).length > 0
          });
        }
      }

      return days;
    },
    daysInMonth() {
      return new Date(this.year, this.selectedMonth + 1, 0).getDate();
    }
  },
  methods: {
    navigatePrevious() {
      const newDate = new Date(this.selectedDate);

      switch(this.currentView) {
        case 'day':
          newDate.setDate(newDate.getDate() - 1);
          break;
        case 'month':
          newDate.setMonth(newDate.getMonth() - 1);
          break;
        case 'year':
          newDate.setFullYear(newDate.getFullYear() - 1);
          break;
      }

      this.selectedDate = newDate;
    },
    navigateNext() {
      const newDate = new Date(this.selectedDate);

      switch(this.currentView) {
        case 'day':
          newDate.setDate(newDate.getDate() + 1);
          break;
        case 'month':
          newDate.setMonth(newDate.getMonth() + 1);
          break;
        case 'year':
          newDate.setFullYear(newDate.getFullYear() + 1);
          break;
      }

      this.selectedDate = newDate;
    },
    selectDay(date) {
      this.selectedDate = date;
      this.currentView = 'day';
    },
    selectDayInMonth(day) {
      const newDate = new Date(this.selectedDate);
      newDate.setDate(day);
      this.selectedDate = newDate;
      this.currentView = 'day';
    },
    selectMonth(month) {
      const newDate = new Date(this.selectedDate);
      newDate.setMonth(month);
      this.selectedDate = newDate;
      this.currentView = 'month';
    },
    toggleTodo(id) {
      this.todoStore.toggleTodo(id);
    },
    getDayTodos(day) {
      const date = new Date(this.year, this.selectedMonth, day);
      return this.todoStore.getTodosForDate(date);
    },
    getMonthTodos(month) {
      return this.todoStore.getTodosForMonth(this.year, month);
    },
    getTodosForDate(date) {
      return this.todoStore.getTodosForDate(date);
    }
  }
};
</script>

<style scoped>
.overview-container {
  padding: 20px;
  height: 100%;
}

.paper {
  background-color: #f8f5e6;
  border: 1px solid #d0c9b5;
  padding: 30px;
  height: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.view-selector {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.view-label {
  font-weight: bold;
  color: #5a5338;
  margin-right: 15px;
}

.view-options {
  display: flex;
  gap: 10px;
}

.view-option {
  background-color: #f8f5e6;
  border: 1px solid #8a7e55;
  color: #5a5338;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.view-option:hover {
  background-color: #f0ead6;
}

.view-option.active {
  background-color: #8a7e55;
  color: white;
}

.slogan {
  text-align: center;
  font-style: italic;
  color: #5a5338;
  margin: 20px 0;
  padding: 10px 0;
  border-top: 1px dashed #d0c9b5;
  border-bottom: 1px dashed #d0c9b5;
}

.two-columns {
  display: flex;
  gap: 30px;
  margin-top: 20px;
}

.column {
  flex: 1;
}

.section-title {
  color: #5a5338;
  font-size: 1.2rem;
  margin-bottom: 15px;
  font-weight: bold;
}

.todo-list {
  background-color: white;
  border: 1px solid #d0c9b5;
  padding: 15px;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px dotted #d0c9b5;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-number {
  width: 25px;
  height: 25px;
  background-color: #f0ead6;
  border: 1px solid #8a7e55;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: #5a5338;
  font-size: 0.9rem;
}

.todo-text {
  flex: 1;
  color: #5a5338;
}

.todo-checkbox {
  width: 18px;
  height: 18px;
  border: 1px solid #8a7e55;
  cursor: pointer;
}

.date-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.nav-arrow {
  width: 30px;
  height: 30px;
  background-color: #f0ead6;
  border: 1px solid #8a7e55;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #5a5338;
  font-weight: bold;
}

.nav-arrow:hover {
  background-color: #e6e0cc;
}

.date-display {
  text-align: center;
}

.day-name {
  color: #5a5338;
  font-size: 1rem;
}

.day-number {
  color: #5a5338;
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1;
}

.month-year {
  color: #5a5338;
  font-size: 1rem;
}

.year-display {
  color: #5a5338;
  font-size: 2rem;
  font-weight: bold;
}

/* Mini Calendar (Day View) */
.mini-calendar {
  background-color: white;
  border: 1px solid #d0c9b5;
  padding: 15px;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 10px;
}

.weekday {
  text-align: center;
  color: #8a7e55;
  font-weight: bold;
  font-size: 0.9rem;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.calendar-day {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #5a5338;
  position: relative;
  border-radius: 50%;
}

.calendar-day:hover {
  background-color: #f0ead6;
}

.calendar-day.other-month {
  color: #d0c9b5;
}

.calendar-day.selected-day {
  background-color: #8a7e55;
  color: white;
}

.calendar-day.today {
  font-weight: bold;
  border: 1px solid #8a7e55;
}

.calendar-day.has-todos::after {
  content: '';
  display: block;
  width: 4px;
  height: 4px;
  background-color: #8a7e55;
  border-radius: 50%;
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
}

/* Month View Calendar */
.month-view-calendar {
  background-color: white;
  border: 1px solid #d0c9b5;
  padding: 15px;
}

.month-calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.month-calendar-day {
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #5a5338;
  position: relative;
  border: 1px solid #d0c9b5;
  font-size: 1.1rem;
}

.month-calendar-day:hover {
  background-color: #f0ead6;
}

.month-calendar-day.other-month {
  color: #d0c9b5;
  background-color: #f9f7f0;
}

.month-calendar-day.selected-day {
  background-color: #8a7e55;
  color: white;
}

.month-calendar-day.today {
  font-weight: bold;
  border: 2px solid #8a7e55;
}

.month-calendar-day.has-todos {
  background-color: rgba(240, 234, 214, 0.3);
}

.todo-indicator {
  position: absolute;
  bottom: 2px;
  font-size: 0.7rem;
  color: #8a7e55;
  background-color: #f0ead6;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Year View */
.year-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  background-color: white;
  padding: 15px;
  border: 1px solid #d0c9b5;
}

.year-month {
  height: 80px;
  border: 1px dotted #d0c9b5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.year-month:hover {
  background-color: #f0ead6;
}

.year-month.has-todos {
  background-color: rgba(240, 234, 214, 0.5);
}

.month-name {
  font-size: 1rem;
  color: #5a5338;
}

.month-indicator {
  font-size: 0.8rem;
  color: white;
  background-color: #8a7e55;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
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

@media (max-width: 768px) {
  .two-columns {
    flex-direction: column;
  }

  .year-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>