<template>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col md="2">
          <v-text-field label="请输入角色名称"
                        v-model="search"
                        append-outer-icon="fa-search"
                        @click:append-outer="getAcademyData">
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
import { getRequest } from "@/utils/request";
import academyApi from '@/api/AcademyInfo'

export default {
  name: "Depart",
  data () {
    return {
      valid: false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 5,
      search: '',
      tableData: [],
      headers: [
        { text: '学院代码', sortable: false, value: 'id', align: 'start' },
        { text: '学院名称', sortable: false, value: 'name' },
      ]
    }
  },
  created() {
    this.getAcademyData()
  },
  methods: {
    getAcademyData () {
      getRequest(academyApi.getAcademy, {
        current: this.page,
        pageSize: this.itemsPerPage,
        search: this.search
      })
      .then(response => {
        if (response.code === 0) {
          this.tableData = response.data.records
          this.pageCount = response.data.total / this.itemsPerPage + 1
        } else {
          this.$toast.error(response.msg, {
            position: this.position,
            timeout: 3000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: "button",
            icon: true
          });
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