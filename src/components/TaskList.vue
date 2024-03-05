<template>
    <!-- Sección  container  -->
    <section class="section">
      <h2>{{ title }}</h2>
      <TaskList :todos="filteredTodos" @complete="completeTodo" @remove="removeTodo" />
    </section>
  </template>

  <script>


    
    export default {
      props: {
        title: String, 
        filteredTodos: Array, 
      },
      methods: {
        completeTodo(id) {
          this.$emit('complete', id);
        }
  
      }
    };

  </script>
     
  <style scoped>

  </style > 