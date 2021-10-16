<template>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col md="2">
          <v-select :items="options"
                    item-text="name"
                    item-value="id"
                    label="请选择学院"
                    clearable
                    @click="getItems"
                    @change="getValue"></v-select>
        </v-col>
        <v-col md="2">
          <v-text-field label="请输入教职工姓名"
                        append-outer-icon="fa-search"
                        @click:append-outer="getTeacherData"></v-text-field>
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
import teacherApi from '@/api/Teacher'
import academyApi from '@/api/AcademyInfo'

export default {
  name: "Teacher",
  data () {
    return {
      valid: false,
      options: [],
      page: 1,
      pageCount: 0,
      itemsPerPage: 5,
      tableData: [],
      academyId: null,
      headers: [
        { text: '教师姓名',  sortable: false, value: 'name', align: 'start' },
        { text: '教师工号', value: 'teacherCode' },
        { text: '性别', value: 'gender' },
        { text: '身份证号', value: 'identificationNumber' },
        { text: '籍贯', value: 'nativePlace' },
        { text: '联系电话', value: 'concatNumber' },
        { text: '学院代码', value: 'academyId' },
      ]
    }
  },
  created() {
    this.getTeacherData()
  },
  methods: {
    getTeacherData () {
      getRequest(teacherApi.queryTeacher, {
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
      this.getTeacherData()
    }
  }
}
</script>

<style scoped>

</style>