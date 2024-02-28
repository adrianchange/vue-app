<template>
    <div class="todo-container bg-antiquewhite p-4 rounded-lg shadow text-center">
        <div class="container">
            <h1>ToDo App</h1>
            <input v-model="newTodo" placeholder="Add a new ToDo*" required />
            <input type="date" v-model="newTodoDate"  required/>
            <input type="time" v-model="newTodoTime"  />
            <label for="entireDay">Entire Day:</label>
            <input type="checkbox" v-model="entireDay" id="entireDay" @click="handleCheckboxClick('entireDay')" />
            <div>
                <label for="flagTask">Flag Task:</label>
                <input type="checkbox" v-model="flagTask" id="flagTask" @click="handleCheckboxClick('flag')" />
                <label for="scheduledTask">Scheduled Task:</label>
                <input type="checkbox" v-model="scheduledTask" id="scheduledTask"
                @click="handleCheckboxClick('scheduled')" />
            </div>
            <button @click="addTodo">Add</button>

            <!-- Section for displaying today's tasks -->
            <section class="section" ref="today">
                <h2>Today Tasks</h2>
                <ul>
                    <li v-for="todo in todayTodos" :key="todo.id">
                        <input type="checkbox" v-model="todo.done" @change="completeTask(todo.id)" />
                        <span :class="{ 'done': todo.done }">{{ todo.text }}</span>
                        <input type="date" v-model="todo.date" />
                        <input type="time" v-model="todo.time" />
                    </li>
                </ul>
            </section>

            <!-- Section for displaying all tasks -->
            <section class="section" ref="all">
                <h2>All Tasks</h2>
                <ul>
                    <li v-for="todo in allTasks" :key="todo.id">
                        <input type="checkbox" v-model="todo.done" @change="completeTask(todo.id)" />
                        <span :class="{ 'done': todo.done }">{{ todo.text }}</span>
                        <input type="date" v-model="todo.date" />
                        <input type="time" v-model="todo.time" />
                    </li>
                </ul>
            </section>


            <!-- Section for displaying flagged tasks -->
            <section class="section" ref="flagged">
                <h2>Flagged Tasks</h2>
                <ul>
                    <li v-for="todo in flaggedTodos" :key="todo.id">
                        <input type="checkbox" v-model="todo.done" @change="completeTask(todo.id)" />
                        <span :class="{ 'done': todo.done }">{{ todo.text }}</span>
                        <input type="date" v-model="todo.date" />
                        <input type="time" v-model="todo.time" />
                    </li>
                </ul>
            </section>


            <!-- Section for displaying scheduled tasks -->
            <section class="section" ref="scheduled">
                <h2>Scheduled Tasks</h2>
                <ul>
                    <li v-for="todo in scheduledTodos" :key="todo.id">
                        <input type="checkbox" v-model="todo.done" @change="completeTask(todo.id)" />
                        <span :class="{ 'done': todo.done }">{{ todo.text }}</span>
                        <input type="date" v-model="todo.date" />
                        <input type="time" v-model="todo.time" />
                    </li>
                </ul>
            </section>


            <!-- Section for displaying completed tasks -->
            <section class="section" ref="completeTodo">
                <h2>Completed Tasks</h2>
                <ul>
                    <li v-for="todo in completedTasks" :key="todo.id">
                        <input type="checkbox" v-model="todo.done" @change="completeTask(todo.id)" />
                        <span :class="{ 'done': todo.done }">{{ todo.text }}</span>
                        <input type="date" v-model="todo.date" />
                        <input type="time" v-model="todo.time" />
                    </li>
                </ul>
            </section>
        </div>
    </div>
</template>
  
<script setup>
import { ref, computed, } from 'vue';


// Define reactive variables for managing tasks and their properties
const newTodo = ref('');
const newTodoDate = ref('');
const newTodoTime = ref('');
const flagTask = ref(false);
const scheduledTask = ref(false);

// Initial list of tasks
const todos = ref([
    { id: 1, text: 'Learn Vue.js', done: false },
    { id: 2, text: 'Build a ToDo app', done: false },

]);

// Computed property for today's date
const today = computed(() => new Date().toISOString().split('T')[0]);

// Computed properties for different task categories
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


// Reactive variable for completed tasks
const completedTasks = ref([]);


// Function to handle checkbox clicks
const handleCheckboxClick = (type) => {
    if (type === 'flag') {
        scheduledTask.value = false;
    } else if (type === 'scheduled') {
        flagTask.value = false;
    }
};

// Function to add a new task
const addTodo = () => {
    if (newTodo.value.trim() !== '' && newTodoDate.value && newTodoTime.value) {
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

        // Add the new task to the todos array
        todos.value.push(newTask);



 // Clear input fields and reset checkboxes
        newTodo.value = '';
        newTodoDate.value = '';
        newTodoTime.value = '';
        flagTask.value = false;
        scheduledTask.value = false;


    }
};

// Function to move a task to the completed section
const moveTaskToCompleted = (task) => {
    task.done = true;
    completedTasks.value.push(task);

    // Remove the task from the current section 
    if (task.date === today.value && !task.scheduled && !task.flagged) {
        todayTodos.value.splice(todayTodos.value.indexOf(task), 1);
    } else if (!task.scheduled && !task.flagged) {
        allTasks.value = allTasks.value.filter((todo) => todo.id !== task.id);
    }
};


// Function to complete a task
const completeTask = (id) => {
    const taskIndex = todos.value.findIndex((todo) => todo.id === id);

    if (taskIndex !== -1) {
        const task = todos.value[taskIndex];
        task.done = true;

        // Use the moveTaskToCompleted function to move the task to completed section
        moveTaskToCompleted(task);

        // Remove the task from the current section 
        if (task.date === today.value && !task.scheduled && !task.flagged) {
            todayTodos.value.splice(todayTodos.value.indexOf(task), 1);
        } else if (!task.scheduled && !task.flagged) {
            allTasks.value = allTasks.value.filter((todo) => todo.id !== id);
        }
    }
};
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

button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 8px 16px;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
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
    background-color: antiquewhite;
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
    border-radius: 10px;
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
}
</style>

  