<template>
  <transition name="fade">
    <slot/>
  </transition>
</template>

<script>
export default {

}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all .5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(100px);
}
</style>