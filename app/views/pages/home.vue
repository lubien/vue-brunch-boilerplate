<template>
  <div>
    <hero-title text="HomePage"/>

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
  import {HeroTitle} from 'app/components'

  export default {
    name: 'HomeView',

    components: {HeroTitle},

    computed: mapState({
      token: state => state.auth.token
    }),

    created() {
      Auth.signin('username', 'password')
    }
  }
</script>
