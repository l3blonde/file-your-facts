# FileYourFacts - Todo PWA
![FileYourFacts Logo](public/favicon.svg)

## Overview

FileYourFacts is a Progressive Web Application (PWA) for task management built with Vue.js and TailwindCSS. The application provides an intuitive interface for creating, tracking, and managing tasks with different views and filtering options.

## Features

- **Progressive Web App**: Works offline and can be installed on mobile devices
- **Multiple Views**:
    - Overview with calendar-based task visualization (day, month, year)
    - Todo list with filtering options (all, planned, pending, done, overdue)
    - Detailed task view
- **Task Management**:
    - Create tasks with title, description, and due date
    - Mark tasks as complete/incomplete
    - View tasks by different time periods
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Persistent Storage**: Tasks are saved in localStorage for persistence between sessions

## Technologies Used

- **Vue.js 3**: Frontend framework with Composition API
- **Vite**: Build tool and development server
- **TailwindCSS**: Utility-first CSS framework for styling
- **Vue Router**: For navigation and routing
- **LocalStorage API**: For data persistence
- **PWA**: Service workers for offline functionality

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/file-your-facts.git
   cd file-your-facts
