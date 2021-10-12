<template>
  <v-card class="support-requests mx-1 mb-1">
    <v-card-text class="pa-0">
      <v-data-table
          @click:row="getStudentData"
          :headers="bjdmDessertHeaders"
          :items="classTableData"
          item-key="id"
          show-expand
          :page.sync="page"
          :items-per-page="itemsPerPage"
          hide-default-footer
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Expandable Table</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>
        <template v-slot:expanded-item="{ headers }">
          <td :colspan="headers.length">
            <v-data-table
                :headers="studentDessertHeaders"
                :items="studentTableData"
                hide-default-header
                hide-default-footer
            ></v-data-table>
          </td>
        </template>
      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination
            v-model="page"
            :length="5"
        ></v-pagination>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { getRequest } from "@/utils/request";
import studentInfo from "@/api/StudentInfo";
import classInfo from "@/api/ClassInfo";

export default {
  name: "InfoManager",
  data () {
    return {
      classTableData: [],
      studentTableData: [],
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      bjdmDessertHeaders: [
        { text: '班级代码', value: 'bjdm', align: 'start' },
        { text: '班级名称', value: 'bjmc' },
        { text: '学院代码', value: 'xydm' },
        { text: '学院名称', value: 'xymc' },
        { text: '开设年份', value: 'ksnf' },
        { text: '学制', value: 'xz' },
        { text: '专业代码', value: 'zydm' },
        { text: '专业名称', value: 'zymc' },
        { text: '培养层次', value: 'pycc' },
        { text: '校区代码', value: 'xqdm' },
        { text: '校区名称', value: 'xqmc' },
        { text: '毕业状态', value: 'status' },
        { text: '班级人数', value: 'count' }
      ],
      studentDessertHeaders: [
        { text: '学号', value: 'xh', align: 'start' },
        { text: '姓名', value: 'xm', },
        { text: '性别', value: 'xb' },
        { text: '姓名拼音', value: 'xmpy' },
        { text: '准考证号', value: 'zkzh' },
        { text: '出生日期', value: 'csrq' },
        { text: '民族', value: 'mz' },
        { text: '学院', value: 'xymc' },
        { text: '二级学院代码', value: 'xydm' },
        { text: '专业', value: 'zymc' },
        { text: '专业代码', value: 'zydm' },
        { text: '班级', value: 'bjdm' },
        { text: '班级代码', value: 'bjmc' },
        { text: '学制', value: 'zx' },
        { text: '学籍状态', value: 'zjzt' },
        { text: '年级', value: 'nj' },
        { text: '入学日期', value: 'rxnf' },
        { text: '考生类别', value: 'kslb' },
        { text: '原毕业学校', value: 'xyxx' },
        { text: '入学方式', value: 'rxfs' },
        { text: '办学形式', value: 'bxxs' },
        { text: '培养层次', value: 'pycc' },
        { text: '生源所在地', value: 'syszd' },
        { text: '', value: 'data-table-expand' }
      ]
    }
  },
  created() {
    this.getClassData()
  },
  methods: {
    getClassData() {
      getRequest(classInfo.getClassTableData, {
        current: this.page,
        pageSize: this.itemsPerPage
      })
          .then(response => {
            if (response.code === 0) {
              this.classTableData = response.data.records
            } else {
              alert(response.msg)
            }
          })
    },
    getStudentData (item) {
      getRequest(studentInfo.getStudentTable + '/' + item.id)
          .then(response => {
            if (response.code === 0) {
              this.studentTableData = response.data
            } else {
              alert(response.msg)
            }
          })
    },
  }
}
</script>

<style scoped>

</style>