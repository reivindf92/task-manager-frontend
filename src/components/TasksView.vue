<script setup>
import { ref } from 'vue'
import api from '../services/api'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const message = ref('')
const loadingTasks = ref(false)
const loadingAction = ref(false)
const editingTaskId = ref(null)
const editedTitle = ref('')

const startEdit = (task) => {
  editingTaskId.value = task.id
  editedTitle.value = task.title
}
const cancelEdit = () => {
  editingTaskId.value = null
  editedTitle.value = ''
}
const updateTask = async (task) => {
  if (!editedTitle.value.trim()) return

  loadingAction.value = true

  try {
    await api.put(`/tasks/${task.id}`, {
      title: editedTitle.value,
      completed: task.completed
    })

    editingTaskId.value = null
    editedTitle.value = ''

    await getTasks()
    showMessage('Tarea actualizada')

  } catch (error) {
    console.log(error)
    showMessage('Error al actualizar')
  } finally {
    loadingAction.value = false
  }
}
const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
onMounted(() => {
  getTasks()
})

const tasks = ref([])
const newTask = ref('')

const getTasks = async () => {
  loadingTasks.value = true

  try {
    await new Promise(r => setTimeout(r, 500))
    const res = await api.get('/tasks')
    tasks.value = res.data
  } catch (error) {
    console.log(error)
  } finally {
    loadingTasks.value = false
  }
}

const showMessage = (text) => {
  message.value = text

  setTimeout(() => {
    message.value = ''
  }, 2000)
}

const createTask = async () => {
  if (!newTask.value.trim()) return

  loadingAction.value = true

  try {
    await api.post('/tasks', {
      title: newTask.value
    })

    newTask.value = ''
    getTasks()

    showMessage('Tarea creada')

  } catch (error) {
    console.log(error)
    showMessage('Error al crear')
  } finally {
    loadingAction.value = false
  }
}

const completeTask = async (task) => {
  loadingAction.value = true

  try {
    await api.put(`/tasks/${task.id}`, {
      title: task.title,
      completed: true
    })

    getTasks()
    showMessage('Tarea completada')

  } catch (error) {
    console.log(error)
    showMessage('Error al actualizar')
  } finally {
    loadingAction.value = false
  }
}
const deleteTask = async (id) => {
  loadingAction.value = true

  try {
    await api.delete(`/tasks/${id}`)

    getTasks()
    showMessage('Tarea eliminada')

  } catch (error) {
    console.log(error)
    showMessage('Error al eliminar')
  } finally {
    loadingAction.value = false
  }
}
</script>

<template>
 <div class="container">
  <p v-if="message">{{ message }}</p>
 <p v-if="loadingTasks">Cargando tareas...</p>
  <p v-if="loadingAction">procesando...</p>
  <div class="header">
  <h1>Tareas</h1>
  <button class="btn-logout" @click="logout">
    Cerrar sesión
  </button>
</div> 

  <div>
    <input v-model="newTask" placeholder="Nueva tarea" />
   <button :disabled="loadingAction || !newTask.trim()" @click="createTask">
  {{ loadingAction ? 'Creando...' : 'Crear' }}
    </button>
  </div>
      <p v-if="!loadingTasks && tasks.length === 0">
      No hay tareas aún
    </p>

 <ul v-if="!loadingTasks">
      <li 
      class="task-item"
      :class="{ completed: task.completed }"
      v-for="task in tasks" 
      :key="task.id"
    >
  <span v-if="editingTaskId !== task.id" class="task-text">
      {{ task.title }} - {{ task.completed ? '✔️' : '❌' }}
    </span>

    <div v-else class="edit-actions">
  <input 
    v-model="editedTitle" 
    @keyup.enter="updateTask(task)" 
  />

      <div class="buttons">
        <button @click="updateTask(task)">Guardar</button>
        <button @click="cancelEdit">Cancelar</button>
      </div>
    </div>

  <div class="actions">
    <button 
      class="btn-complete"
      v-if="!task.completed"
      :disabled="loadingAction"
      @click="completeTask(task)">
      Completar
    </button>
    <button 
      class="btn-edit"
      :disabled="loadingAction"
      @click="startEdit(task)">
      Editar
    </button>
    <button 
      class="btn-delete"
      :disabled="loadingAction"
      @click="deleteTask(task.id)">
      Eliminar
    </button>
  </div>
</li>
  </ul>
 </div>
</template>
<style>
.task-text {
  flex: 1;
  margin-right: 10px;
  word-break: break-word;
}
.btn-edit {
  background-color: #f39c12;
}

.btn-edit:hover {
  background-color: #d68910;
}
.container {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}
input {
  padding: 10px;
  margin-right: 10px;
  width: 65%;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 10px 14px;
  border: none;
  background-color: #3498db;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
li {
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions button {
  margin-left: 8px;
}
.task-item {
  background: #f9f9f9;
  padding: 12px;
  margin: 10px 0;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.task-item:hover {
  background: #f1f1f1;
}
.task-item.completed {
  opacity: 0.6;
  text-decoration: line-through;
}
.btn-complete {
  background-color: #2ecc71;
}

.btn-complete:hover {
  background-color: #27ae60;
}

.btn-delete {
  background-color: #e74c3c;
}

.btn-delete:hover {
  background-color: #c0392b;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-logout {
  background-color: #555;
}

.btn-logout:hover {
  background-color: #333;
}
.edit-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.buttons button {
  margin-left: 8px;
}
</style>