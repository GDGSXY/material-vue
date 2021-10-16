<template>
  <v-form v-model="valid">
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
          <v-select :disabled="majorDisabled"
                    :items="majorOptions"
                    item-text="name"
                    item-value="id"
                    label="请选择专业"
                    @change="getValue1"></v-select>
        </v-col>
        <v-col md="2">
          <v-select :disabled="classDisabled"
                    :items="classOptions"
                    item-text="name"
                    item-value="id"
                    label="请选择班级"
                    @change="getValue2"></v-select>
        </v-col>
        <v-col md="2">
          <v-text-field label="请输入学生姓名"
                        v-model="search"
                        append-outer-icon="fa-search"
                        @click:append-outer="getStudentData">
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
import studentApi from '@/api/StudentInfo'
import academyApi from '@/api/AcademyInfo'
import majorApi from '@/api/MajorInfo'
import classApi from '@/api/ClassInfo'

export default {
  name: "Student",
  data () {
    return {
      valid: false,
      majorDisabled: true,
      classDisabled: true,
      academyOptions: [],
      page: 1,
      pageCount: 0,
      itemsPerPage: 5,
      search: '',
      majorOptions: [],
      classId: null,
      classOptions: [],
      tableData: [],
      headers: [
        { text: '姓名', sortable: false, value: 'name', align: 'start'},
        { text: '学号', sortable: false, value: 'studentCode' },
        { text: '性别', sortable: false, value: 'gender' },
        { text: '学籍状态', sortable: false, value: 'studentStatus' },
        { text: '年级', sortable: false, value: 'grade' },
        { text: '入学日期', sortable: false, value: 'enrollmentDate' },
        { text: '培养层次', sortable: false, value: 'educationLevel' },
        { text: '籍贯', sortable: false, value: 'nativePlace' },
        { text: '政治面貌', sortable: false, value: 'politicalOutlook' },
        { text: '是否报到', sortable: false, value: 'checkIn' },
        { text: '联系电话', sortable: false, value: 'concatPhone' },
      ],
    }
  },
  created() {
    this.getStudentData()
  },
  methods: {
    getStudentData () {
      getRequest(studentApi.getStudentTable, {
        current: this.page,
        pageSize: this.itemsPerPage,
        search: this.search,
        classId: this.classId
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
          this.academyOptions = response.data
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
      this.majorDisabled = false
      getRequest(majorApi.getMajorByPermission + `?academyId=${value}`).then(response => {
        if (response.code === 0) {
          this.majorOptions = response.data
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
    getValue1 (value) {
      this.classDisabled = false
      getRequest(classApi.getClassByPermission + `?majorId=${value}`).then(response => {
        if (response.code === 0) {
          this.classOptions = response.data
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
    getValue2 (value) {
      console.log(value)
      this.classId = value
      this.getStudentData()
    },
    updatePage (number) {
      this.page = number
      this.getStudentData()
    }
  }
}
</script>

<style scoped>

</style>