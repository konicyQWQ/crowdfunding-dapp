<template>
  <div class="footer">
    <ul v-for="list in category" class="list">
      <li class="title">{{ list.title }}</li>
      <li v-for="item in list.linkList">
        <a :href="item.link" target="_blank">{{ item.name }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import {defineComponent, readonly} from 'vue'

export default defineComponent({
  name: 'mFooter',
  setup() {
    let category = readonly([
      {
        title: '技术支持',
        linkList: [
          {name: 'Vue', link: 'https://cn.vuejs.org/'},
          {name: 'Ant Design Vue', link: 'https://2x.antdv.com/docs/vue/introduce-cn/'}
        ]
      }
    ])
    return { category }
  }
})
</script>

<style scoped>
.footer {
  display: flex;
  padding: 2em 5%;
  background: #222;
}
.footer .list {
  list-style: none;
  margin-right: 5%;
}
.footer .list li {
  margin-bottom: 0.3em;
}
.footer .list li.title {
  font-size: 18px;
  font-weight: 300;
  color: #fff;
  margin-bottom: 0.5em;
}
.footer .list li a {
  color: #fff;
  font-size: 14px;
}
</style>