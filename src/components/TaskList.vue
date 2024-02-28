<template>
    <!-- Section container with a title and TaskList component -->
    <section class="section">
      <h2>{{ title }}</h2>
      <!-- TaskList component to display filtered todos -->
      <TaskList :todos="filteredTodos" @complete="completeTodo" @remove="removeTodo" />
    </section>
  </template>
    <script>


    
    export default {
      props: {
        title: String, // Define the title prop as a String
        filteredTodos: Array, // Define the filteredTodos prop as an Array
      },
      methods: {
        completeTodo(id) {
          // Method to emit 'complete' event with the provided id
          this.$emit('complete', id);
        }
  
      }
    };
    </script>
     <style scoped>
  
    </style> 