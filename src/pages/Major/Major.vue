<template>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col md="2">
          <v-select :items="options"
                    item-text="name"
                    item-value="id"
                    label="请选择学院"
                    @click="getItems"
                    @change="getValue"></v-select>
        </v-col>
        <v-col md="2">
          <v-text-field label="请输入专业名称" v-model="search"
                        append-outer-icon="fa-search"
                        @click:append-outer="getMajorData"></v-text-field>
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
          ></v-data-table>
          <div class="text-center pt-2">
            <v-pagination
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
import majorApi from '@/api/MajorInfo'
import academyApi from '@/api/AcademyInfo'

export default {
  name: "Major",
  data () {
    return {
      valid: false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 5,
      options: [],
      academyId: null,
      search: '',
      tableData: [],
      headers: [
        { text: '专业代码', sortable: false, value: 'id', align: 'start' },
        { text: '专业名称', sortable: false, value: 'name' },
        { text: '学院代码', sortable: false, value: 'academyId' }
      ]
    }
  },
  created() {
    this.getMajorData()
  },
  methods: {
    getMajorData () {
      getRequest(majorApi.getMajor, {
        current: this.page,
        pageSize: this.itemsPerPage,
        search: this.search,
        academyId: this.academyId
      }).then(response => {
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
    getItems () {
      getRequest(academyApi.getAcademyByPermission).then(response => {
        if (response.code === 0) {
          this.options = response.data
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
    getValue (value) {
      this.academyId = value
      this.getMajorData()
    }
  }
}
</script>

<style scoped>

</style>