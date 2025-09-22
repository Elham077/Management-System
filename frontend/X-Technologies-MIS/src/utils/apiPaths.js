export const BASE_URL = "http://localhost:8000";
//* utils/apiPaths.js
export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", //? ===================================================> register new user
    LOGIN: "/api/auth/login", //? =====================================================> login user
    GET_PROFILE: "/api/auth/profile", //? ==============================================> get current user profile
  },
  USERS: {
    GET_ALL_USERS: "/api/users", //? ==================================================> fetch all users
    GET_USER_BY_ID: (userId) => `/api/users/${userId}`, //? ===========================> fetch single user by ID
    CREATE_USER: "/api/users", //? ====================================================> create a new user
    UPDATE_USER: (userId) => `/api/users/${userId}`, //? ==============================> update user by ID
    DELETE_USER: (userId) => `/api/users/${userId}`, //? ==============================> delete user by ID
  },
  TASKS: {
    GET_DASHBORAD_DATA: "/api/tasks/dashboard-data", //? ===================================> get overall tasks dashboard data (admin)
    GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data", //? ========> get dashboard data for a user
    GET_ALL_TASKS: "/api/tasks", //? ==================================================> fetch all tasks
    GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`, //? ===========================> fetch task by ID
    CREATE_TASK: "/api/tasks", //? ====================================================> create new task
    UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`, //? ==============================> update task by ID
    DELETE_TASK: (taskId) => `/api/tasks/${taskId}`, //? ==============================> delete task by ID

    UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`, //? ================> update status of a task
    UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`, //? ===============> update checklist of a task
  },
  Expenses: {
    GET_ALL_EXPENSES: "/api/expenses",
    GET_EXPENSES_DASHBORAD_DATA: "/api/expenses/dashboard",
    CREATE_EXPENSE: "/api/expenses",
    UPDATE_EXPENSE: (expenseId) => `/api/expenses/${expenseId}`,
    GET_EXPENSE_BY_ID: (expenseId) => `/api/expenses/${expenseId}`,
    DELETE_EXPENSE: (expenseId) => `/api/expenses/${expenseId}`,
  },
  PROJECTS: {
    GET_PROJECT_DASHBOARD: "/api/projects/dashboard/stats",
    GET_ALL_PROJECTS: "/api/projects",
    GET_PROJECT_BY_ID: (projectId) => `/api/projects/${projectId}`,
    CREATE_PROJECT: "/api/projects",
    UPDATE_PROJECT: (projectId) => `/api/projects/${projectId}`,
    DELETE_PROJECT: (projectId) => `/api/projects/${projectId}`,
  },
  REPORTS: {
    EXPORT_TASKS_REPORT: "/api/reports/export/tasks",
    EXPORT_USERS_REPORT: "/api/reports/export/users",
    EXPORT_PROJECTS_REPORT: "/api/reports/export/projects",
    EXPORT_EXPENSES_REPORT: "/api/reports/export/expenses",
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image", //? =======================================> upload user profile image
    UPLOAD_EXPENSES_ATTACHMENT: "/api/expenses/upload-attachment", //? =======================================> upload expenses attachment
    UPLOAD_PROJECTS_ATTACHMENT: "/api/projects/upload-attachment", //? =======================================> upload projects attachment
  },
};
