<template>
  <div>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container is-fluid">
          <h1 class="title">
            HomePage
          </h1>
        </div>
      </div>
    </section>

    <div class="container">
      <br/>
      <p v-if="token">
        <article class="message">
          <div class="message-header">
            <p>Auth</p>
            <button class="delete"></button>
          </div>
          <div class="message-body">
            You are authenticated with the following token <strong>{{ token }}</strong></p>
          </div>
        </article>
      </p>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {Auth} from 'app/api'

  export default {
    name: 'HomeView',

    computed: mapState({
      token: state => state.auth.token
    }),

    created() {
      Auth.signin('username', 'password')
    }
  }
</script>
