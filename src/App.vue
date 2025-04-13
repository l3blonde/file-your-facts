<template>
  <div class="fyf-container">
    <div class="fyf-binder">

      <header class="fyf-header">
        <div class="logo-container">
          <svg class="logo-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 197.89 184.17">
            <polygon
                points="64.31 183.46 .71 119.4 25.07 95.49 64.31 133.39 76.04 122.11 38.38 85.57 64.31 60.31 101.3 98.2 197.39 1.22 197.39 50.38 64.31 183.46"
                fill="#8a7e55"
                stroke="#8a7e55"
                stroke-miterlimit="10"
            />
          </svg>
          <h1>FileYourFacts</h1>
        </div>
        <nav class="fyf-nav">
          <router-link to="/" class="nav-link">Overview</router-link>
          <router-link to="/create" class="nav-link">New Task</router-link>
          <router-link to="/overview" class="nav-link">Todos</router-link>
        </nav>
      </header>

      <main class="fyf-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.fyf-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  padding: 20px;
  font-family: 'Times New Roman', Times, serif;
}

.fyf-binder {
  position: relative;
  width: 100%;
  max-width: 800px;
  min-height: 600px;
  background-color: #f8f5e6;
  border-radius: 5px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 30px 40px;
  margin: 0 auto;
}

.fyf-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #d0c9b5;
  margin-bottom: 30px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-svg {
  width: 24px;
  height: 24px;
}

.fyf-header h1 {
  font-family: 'Times New Roman', Times, serif;
  font-weight: 300;
  font-style: italic;
  color: #8a7e55;
  font-size: 1.8rem;
  margin: 0;
}

.fyf-nav {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: #8a7e55;
  text-decoration: none;
  font-size: 0.9rem;
  padding: 5px 10px;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.nav-link:hover, .router-link-active {
  border-bottom: 1px solid #8a7e55;
}

.fyf-content {
  padding: 10px 0;
}

@media (max-width: 600px) {
  .fyf-binder {
    padding: 20px;
  }
}
</style>
