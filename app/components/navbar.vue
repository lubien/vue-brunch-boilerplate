<template>
  <nav class="nav">
    <div class="nav-left">
      <a class="nav-item">
        Vue Brunch Boilerplate
      </a>
    </div>

    <div class="nav-center">
      <a class="nav-item" href="https://github.com/lubien/vue-brunch-boilerplate" target="_blank">
        <span class="icon">
          <i class="fa fa-github"></i>
        </span>
      </a>
      <a class="nav-item" href="https://twitter.com/@joao_lubien" target="_blank">
        <span class="icon">
          <i class="fa fa-twitter"></i>
        </span>
      </a>
    </div>

    <!-- This "nav-toggle" hamburger menu is only visible on mobile -->
    <!-- You need JavaScript to toggle the "is-active" class on "nav-menu" -->
    <span class="nav-toggle" @click='toggleNav'>
      <span></span>
      <span></span>
      <span></span>
    </span>

    <!-- This "nav-menu" is hidden on mobile -->
    <!-- Add the modifier "is-active" to display it on mobile -->
    <div class="nav-right nav-menu" :class="{'is-active': navOpen}">
      <router-link :to='{name: "home"}' class="nav-item">
        Home
      </router-link>
      <router-link :to='{name: "about"}' class="nav-item">
        About
      </router-link>
      <router-link :to='{path: "foo"}' class="nav-item">
        Error 404
      </router-link>
      <router-link :to='{name: "error401"}' class="nav-item">
        Error 401
      </router-link>
    </div>
  </nav>
</template>

<script>
  export default {
    name: 'Navbar',

    data() {
      return {
        navOpen: false
      }
    },

    methods: {
      toggleNav() {
        this.navOpen = !this.navOpen
      }
    }
  }
</script>
