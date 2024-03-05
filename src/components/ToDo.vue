<template>
    <div class="todo-container">
        <!-- Encabezado -->
        <h1 class="text-3xl font-bold mb-4">Agenda App</h1>
        <div class="container ">
            <div> <!-- Formulario para agregar una nueva tarea -->
                <div class="flex items-center mb-4">
                    <input v-model="newTodo" placeholder="Add a new task"
                        class="mr-2 p-2 border border-gray-300 rounded-full" required />
                    <span class="text-red-500">*</span>
                </div>
                <div class="flex items-center mb-4">
                    <input type="date" v-model="newTodoDate"
                        class="border-2 border-gray-300 rounded-lg text-gray-700 focus:border-blue-500 hover:text-teal-400"
                        required />
                    <span class="text-red-500">*</span>
                </div>
                <div class="flex items-center mb-4">
                    <input type="time" v-model="newTodoTime" v-if="showTimeInput"
                        class="border-2 border-gray-300 rounded-lg text-gray-700 focus:border-blue-500 hover:text-teal-400" />
                    <label for="entireDay">Full Day</label>
                    <input type="checkbox" class="hidden border-2 border-teal-500 bg-teal-200 rounded-lg w-4 h-4"
                        id="entireDay" />
                    <input type="checkbox" v-model="entireDay" id="entireDay" @click="handleCheckboxClick('entireDay')"
                        @change="toggleTimeInput" />
                </div>

                <!-- Checkbox para marcar como tarea destacada o programada -->
                <div class="flex items-center mb-4">
                    <label for="flagTask">Flag Task</label>
                    <input type="checkbox" v-model="flagTask" id="flagTask" @click="handleCheckboxClick('flag')" />
                    <label for="scheduledTask">Scheduled Task</label>
                    <input type="checkbox" v-model="scheduledTask" id="scheduledTask"
                        @click="handleCheckboxClick('scheduled')" />
                </div>
                <!-- Botón para agregar una nueva tarea -->
                <button class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer" @click="addTodo">Add</button>
            </div>


            <!-- Sección para mostrar las tareas de hoy -->
            <section class="section" ref="today">
                <h2 class="text-xl font-semibold mb-2">Today Tasks</h2>
                <ul>
                    <li v-for="todo in todayTodos" :key="todo.id"
                        class="bg-gray-200 my-2 px-4 py-2 flex justify-between items-center">
                        <input type="checkbox" v-model="todo.done" @change="completeTask(todo.id)" />
                        <span :class="{ 'line-through': todo.done }">{{ todo.text }}</span>
                        <input type="date" v-model="todo.date" />
                    </li>
                </ul>
            </section>

            <!-- Sección para mostrar todas las tareas -->
            <section  class="section" ref="all">
                <h2 class="text-xl font-semibold mb-2">All Tasks</h2>
                <ul>
                    <li v-for="todo in allTasks" :key="todo.id"
                        class="bg-gray-200 my-2 px-4 py-2 flex justify-between items-center">
                        <input type="checkbox" v-model="todo.done" @change="completeTask(todo.id)" />
                        <span :class="{ 'line-through': todo.done }">{{ todo.text }}</span>
                        <input type="date" v-model="todo.date" />
                        <input type="time" v-model="todo.time" />
                    </li>
                </ul>
            </section>

            <!-- Sección para mostrar tareas destacadas -->
            <section class="section" ref="flagged">
                <h2 class="text-xl font-semibold mb-2">Flagged Tasks</h2>
                <ul>
                    <li v-for="todo in flaggedTodos" :key="todo.id"
                        class="bg-gray-200 my-2 px-4 py-2 flex justify-between items-center">
                        <input type="checkbox" v-model="todo.done" @change="completeTask(todo.id)" />
                        <span :class="{ 'line-through': todo.done }">{{ todo.text }}</span>
                        <input type="date" v-model="todo.date" />
                    </li>
                </ul>
            </section>

            <!-- Sección para mostrar tareas programadas -->
            <section class="section" ref="scheduled">
                <h2 class="text-xl font-semibold mb-2">Scheduled Tasks</h2>
                <ul>
                    <li v-for="todo in scheduledTodos" :key="todo.id"
                        class="bg-gray-200 my-2 px-4 py-2 flex justify-between items-center">
                        <input type="checkbox" v-model="todo.done" @change="completeTask(todo.id)" />
                        <span :class="{ 'line-through': todo.done }">{{ todo.text }}</span>
                        <input type="date" v-model="todo.date" />
                    </li>
                </ul>
            </section>

            <!-- Sección para mostrar tareas completadas -->
            <section class="section" ref="completeTodo">
                <h2 class="text-xl font-semibold mb-2">Completed Tasks</h2>
                <ul>
                    <li v-for="todo in completedTasks" :key="todo.id"
                        class="bg-gray-200 my-2 px-4 py-2 flex justify-between items-center">
                        <input type="checkbox" v-model="todo.done" @change="completeTask(todo.id)" />
                        <span :class="{ 'line-through': todo.done }">{{ todo.text }}</span>
                        <input type="date" v-model="todo.date" />
                    </li>
                </ul>
            </section>
        </div>
    </div>
</template>
  
<script setup>
import { ref, computed } from 'vue';



// Definir  variables reactivas
const newTodo = ref('');
const newTodoDate = ref('');
const newTodoTime = ref('');
const flagTask = ref(false);
const scheduledTask = ref(false);
const showTimeInput = ref(true);
const entireDay = ref(false);

const toggleTimeInput = () => {
    showTimeInput.value = !entireDay.value; // Oculta el input de la hora si entireDay está marcado
};

//  Handle checkbox clicks
const handleCheckboxClick = (type) => {
    if (type === 'flag') {
        scheduledTask.value = false;
    } else if (type === 'scheduled') {
        flagTask.value = false;
    }
};

// Lista inicial de tareas
const todos = ref([
    { id: 1, text: 'Learn Vue.js', done: false },
    { id: 2, text: 'Build a ToDo app', done: false },

]);



const today = computed(() => new Date().toISOString().split('T')[0]);


const todayTodos = computed(() =>
    todos.value.filter((todo) => todo.date === today.value && !todo.done)
);

const allTasks = computed(() =>
    todos.value.filter(
        (todo) => (!todo.date || todo.date <= today.value) && !todo.done
    )
);

const flaggedTodos = computed(() =>
    todos.value.filter((todo) => todo.flagged && !todo.done)
);

const scheduledTodos = computed(() =>
    todos.value.filter((todo) => todo.scheduled && !todo.done)
);


// Variable reactiva
const completedTasks = ref([]);


// Mover una tarea a la seccion Completed
const moveTaskToCompleted = (task) => {
    task.done = true;
    completedTasks.value.push(task);

    if (task.date === today.value && !task.scheduled && !task.flagged) {
        todayTodos.value.splice(todayTodos.value.indexOf(task), 1);
    } else if (!task.scheduled && !task.flagged) {
        allTasks.value = allTasks.value.filter((todo) => todo.id !== task.id);
    }
};


const completeTask = (id) => {
    const taskIndex = todos.value.findIndex((todo) => todo.id === id);

    if (taskIndex !== -1) {
        const task = todos.value[taskIndex];

        // Si la tarea está en la sección de "Completed", moverla a la sección de "All Tasks"
        if (completedTasks.value.some((todo) => todo.id === id)) {
            // Quitar la tarea de "Completed"
            completedTasks.value = completedTasks.value.filter((todo) => todo.id !== id);
            // Mover la tarea a "All Tasks" solo si no está ya presente
            if (!allTasks.value.some((todo) => todo.id === id)) {
                allTasks.value.push(task);
            }
        } else {
            // Si la tarea no está en "Completed", moverla a esa sección
            moveTaskToCompleted(task);
        }
    }
};


// Función para agregar una nueva tarea
const addTodo = () => {
    if (newTodo.value.trim() !== '' && newTodoDate.value && newTodoTime.value || entireDay.value) {
        const newTask = {
            id: todos.value.length + 1,
            text: newTodo.value,
            done: false,
            date: newTodoDate.value,
            time: newTodoTime.value,
            flagged: flagTask.value,
            scheduled: scheduledTask.value,
        };

        if (flagTask.value) {
            newTask.flagged = true;
        }


        if (scheduledTask.value) {
            newTask.scheduled = true;
        }

        // Añadir nueva tarea a todos array
        todos.value.push(newTask);



    }
};

// Limpiar los campos del formulario después de agregar la tarea
newTodo.value = '';
newTodoDate.value = '';
newTodoTime.value = '';
flagTask.value = false;
scheduledTask.value = false;

</script>

<style scooped>
.todo-container {
    background-color: antiquewhite;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    text-align: center;
}


h1 {
    font-size: 36px;
    color: #333;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    margin-bottom: 20px;
    font-weight: bold;
    letter-spacing: 2px;
    text-transform: uppercase;
}

ul {
    list-style-type: none;
    padding: 0px;
}

li {
    background-color: #f0f0f0;
    margin: 5px 0;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}





.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin: 0 auto;
    max-width: 600px;
    padding: 20px;
    flex-wrap: wrap;

}

.container>* {
    margin: 10px 0;
}

.input-group {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.input-group input,
.input-group button {
    flex: 1;
    max-width: 200px;
}

.checkbox-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.section {
    margin-top: 20px;
    border: 1px solid #ccc;
    border-radius: 20px;
    padding: 0px;
    min-height: 100px;
    flex: 1;
}

@media screen and (min-width: 1024px) {
    .container {
        display: flex;
        flex-wrap: wrap;

        align-items: center;
        justify-content: center;
    }

    .input-group {
        flex-direction: row;
        align-items: center;
    }

    .input-group input,
    .input-group button {
        max-width: none;
    }

    .section {
        width: 100%;
        margin-top: 0;
    }
}

@media screen and (max-width: 768px) {
    .section {
        width: 100%;
    }
}</style>


  