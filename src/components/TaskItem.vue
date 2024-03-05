<template>
    <li>
      <input type="checkbox" v-model="isChecked" @change="completeTask" />
      <span :class="{ 'done': isChecked }">{{ todo.text }}</span>
      <input type="date" v-model="todo.date" />
      <input type="time" v-model="todo.time" />
    </li>
  </template>
  
    <script>
    export default {
      props: {
        todo: Object, // Define the todo prop as an Object
      },
      data() {
        return {
          isChecked: this.todo.done, // Initialize isChecked data with the todo's done status
        };
      },
      methods: {
        completeTask() {
          // Method to emit 'complete' event with the task ID when checkbox is clicked
          this.$emit('complete', this.todo.id);
        },
      },
    };
    </script>
      <style scoped>

      .done {
        text-decoration: line-through;
        
      }
      </style>