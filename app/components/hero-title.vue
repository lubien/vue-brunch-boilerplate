<template>
  <section class="hero is-primary">
    <div class="hero-body">
      <div class="container is-fluid">
        <h1 class="title">
          {{text}}
        </h1>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'HeroTitle',

    props: ['text']
  }
</script>
