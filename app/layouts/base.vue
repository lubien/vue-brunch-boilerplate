<template>
  <div>
    <nav class="nav">
      <div class="nav-left">
        <a class="nav-item">
          Vue Brunch Boilerplate
        </a>
      </div>

      <div class="nav-center">
        <a class="nav-item" href="https://gitub.com/lubien/vue-brunch-boilerplate" target="_blank">
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

    <div>
      <router-view/>
    </div>

    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          <p>
            <strong>Vue Brunch Boilerplate</strong> by <a href="http://lubien.me">Lubien</a>.
            The source code is licensed <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
          </p>
          <p>
            <a class="icon" href="https://gitub.com/lubien/vue-brunch-boilerplate" target="_blank">
              <i class="fa fa-github"></i>
            </a>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
  export default {
    name: 'BaseLayout',

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
