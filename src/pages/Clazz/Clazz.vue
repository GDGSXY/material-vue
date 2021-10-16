<template>
  <v-container>
    <v-row>
      <v-col md="2">
        <v-select :items="academyOptions"
                  item-text="name"
                  item-value="id"
                  label="请选择学院"
                  @click="getItems"
                  @change="getValue"></v-select>
      </v-col>
      <v-col md="2">
        <v-select :items="majorOptions"
                  item-text="name"
                  item-value="id"
                  label="请选择专业"
                  @change="getValue1"></v-select>
      </v-col>
      <v-col md="2">
        <v-text-field label="请输入班级名称"
                      v-model="search"
                      append-outer-icon="fa-search"
                      @click:append-outer="getClassData"></v-text-field>
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
</template>

<script>
import { getRequest } from "@/utils/request";
import academyApi from '@/api/AcademyInfo'
import majorApi from '@/api/MajorInfo'
import classApi from '@/api/ClassInfo'

export default {
  name: "Clazz",
  data () {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 5,
      academyOptions: [],
      majorOptions: [],
      majorId: null,
      search: '',
      tableData: [],
      headers: [
        { text: '班级名称', sortable: false, value: 'name', align: 'start' },
        { text: '学制', sortable: false, value: 'schoolYear' },
        { text: '班级人数', sortable: false, value: 'count' },
        { text: '开设年份', sortable: false, value: 'establishYear' },
        { text: '校区名称', sortable: false, value: 'campusName' },
        { text: '校区代码', sortable: false, value: 'campusCode' },
      ]
    }
  },
  created() {
    this.getClassData()
  },
  methods: {
    getClassData () {
      getRequest(classApi.getClass, {
        current: this.page,
        pageSize: this.itemsPerPage,
        search: this.search,
        majorId: this.majorId
      }).then(response => {
        if (response.code === 0) {
          this.tableData = response.data.records
          this.pageCount = response.data.total / this.itemsPerPage + 1
        } else {
          this.$toast(response.msg, {
            position: this.position,
            timeout: 3000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: "button",
            icon: true
          })
        }
      })
    },
    getItems () {
      getRequest(academyApi.getAcademyByPermission).then(response => {
        if (response.code === 0) {
          this.academyOptions = response.data
        } else {
          this.$toast.error(response.msg, {
            position: this.position,
            timeout: 6000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: "button",
            icon: true
          });
        }
      })
    },
    getValue (value) {
      getRequest(majorApi.getMajorByPermission + `?academyId=${value}`)
      .then(response => {
        if (response.code === 0) {
          this.majorOptions = response.data
        } else {
          this.$toast.error(response.msg, {
            position: this.position,
            timeout: 6000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: "button",
            icon: true
          });
        }
      })
    },
    getValue1 (value) {
      this.majorId = value
      this.getClassData()
    }
  }
}
</script>

<style scoped>

</style>