<template>
  <div>
    <Header />
    <main>
      <fade>
        <router-view></router-view>
      </fade>
    </main>
    <m-footer />
  </div>
</template>

<script lang="ts">
import Header from "./components/header.vue";
import fade from "./components/base/fade.vue"
import mFooter from "./components/footer.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { 
    Header, 
    fade, 
    mFooter 
  }
});
</script>

<style scoped>
main {
  padding: 2em;
  min-height: 600px;
  background: #F6F6F6;
}
</style>

