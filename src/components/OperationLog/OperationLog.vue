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

      <v-skeleton-loader v-if="hasNext" v-intersect="loadNextPage" type="list-item@1" />
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
  },
}
</script>

<style scoped lang="scss">

</style>
