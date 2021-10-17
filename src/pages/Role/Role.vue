<template>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col md="2">
          <v-text-field label="请输入角色名称"
                        v-model="search"
                        append-outer-icon="fa-search"
                        @click:append-outer="getRoleData">
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="12">
          <v-data-table
              :headers="headers"
              :items="tableData"
              :page.sync="page"
              :items-per-page="itemsPerPage"
              hide-default-footer
              class="elevation-1"
          >
          </v-data-table>
          <div class="text-center pt-2">
            <v-pagination
                circle
                @input="updatePage"
                v-model="page"
                :length="pageCount"
            ></v-pagination>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import {getRequest} from "@/utils/request";
import roleApi from '@/api/Role'
import config from "@/config";

export default {
  name: "Role",
  data () {
    return {
      valid: false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 5,
      search: '',
      tableData: [],
      headers: [
        { text: '角色代码', sortable: false, value: 'id', align: 'start'},
        { text: '角色名称', sortable: false, value: 'name' }
      ]
    }
  },
  created() {
    this.getRoleData()
  },
  methods: {
    getRoleData () {
      getRequest(roleApi.getRole, {
        current: this.page,
        pageSize: this.itemsPerPage,
        search: this.search
      }).then(response => {
        if (response.code === 0) {
          this.$toast.success('查询成功', config.options)
          this.tableData = response.data.records
          this.pageCount = response.data.pages
        } else {
          this.$toast.error(response.msg, config.options);
        }
      })
    },
    updatePage (number) {
      this.page = number
      this.getRoleData()
    }
  }
}
</script>

<style scoped>

</style>