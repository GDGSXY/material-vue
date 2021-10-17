<template>
  <v-container>
    <v-list-item-title>操作记录</v-list-item-title>
    <v-list class="overflow-y-auto" max-height="400">

      <v-list-item v-for="(item, i) in items" :key="i">

        <v-alert
            v-if="item.content.type === 'CREATE'"
            border="left" color="green lighten-2" dark>
          在 {{ item.date }}:<br />
          用户 {{ item.userId }} 创建了 {{ item.content.after.id }}
        </v-alert>
        <v-alert
            v-else-if="item.content.type === 'UPDATE'"
            border="left" color="blue lighten-2" dark>
          在 {{ item.date }}:<br />
          用户 {{ item.userId }} 修改了 {{ item.content.before.id }}
          <v-btn @click="() => openUpdateDetail(item)">查看明细</v-btn>
        </v-alert>
        <v-alert
            v-else-if="item.content.type === 'REMOVE'"
            border="left" color="red lighten-2" dark>
          在 {{ item.date }}:<br />
          用户 {{ item.userId }} 删除了 {{ item.content.before.id }}
        </v-alert>

      </v-list-item>

      <v-skeleton-loader v-if="hasNext" v-intersect="loadNextPage" type="list-item@5" />
    </v-list>
  </v-container>
</template>

<script>
export default {
  name: 'OperationLog',
  props: {
    items: {
      type: Array,
      required: true,
    },
    current: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      default: Number.MAX_VALUE,
      required: true,
    },
  },
  computed: {
    hasNext () {
      return this.items.length < Number(this.total)
    },
  },
  methods: {
    loadNextPage () {
      this.$emit('load-next-page', { current: this.current })
    },
    openUpdateDetail (item) {
      alert(`修改前：\n${JSON.stringify(item.content.before)}\n修改后：\n${JSON.stringify(item.content.after)}`)
    },
  },
}
</script>

<style scoped lang="scss">

</style>
