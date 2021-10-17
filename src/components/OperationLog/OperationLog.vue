<template>
  <v-container>
    <v-list class="overflow-y-auto" max-height="400">

      <v-list-item v-for="(item, i) in items" :key="i">

        <v-alert
            v-if="item.content.type === 'CREATE'"
            border="left" color="green lighten-2" dark>
          {{ item }}
        </v-alert>
        <v-alert
            v-else-if="item.content.type === 'UPDATE'"
            border="left" color="blue lighten-2" dark>
          {{ item }}
        </v-alert>
        <v-alert
            v-else-if="item.content.type === 'REMOVE'"
            border="left" color="red lighten-2" dark>
          {{ item }}
        </v-alert>

      </v-list-item>

      <v-skeleton-loader v-if="items.length < total" v-intersect="loadNextPage" type="list-item@5" />
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
    size: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  beforeUpdate () {
    console.log(this.items)
    console.log(this.items.length)
    console.log(this.total)
  },
  methods: {
    loadNextPage () {
      const { items, current, size, total } = this
      this.$emit('load-next-page', { items, current, size, total })
    },
  },
}
</script>

<style scoped lang="scss">

</style>
