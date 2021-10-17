<template>
  <v-container>
    <v-data-table
        :headers="headers"
        :items="tableData"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        hide-default-footer
        class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
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
          </v-container>
          <v-spacer></v-spacer>
          <v-dialog
              v-model="dialog"
              max-width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
              >
                添加学生
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-select :items="academyOptions"
                                item-text="name"
                                item-value="id"
                                label="请选择学院"
                                @click="getItems"
                                @change="getValue"></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select :disabled="majorDisabled"
                                :items="majorOptions"
                                item-text="name"
                                item-value="id"
                                label="请选择专业"
                                @change="getValue1"></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select :disabled="classDisabled"
                                :items="classOptions"
                                item-text="name"
                                item-value="id"
                                label="请选择班级"
                                @change="v => editedItem.classId = v"></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.name" label="学生姓名"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.studentCode" label="学生学号"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.phoneNumber" label="个人电话"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.qq" label="QQ号"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select :items="gender"
                                item-text="name"
                                item-value="value"
                                label="请选择性别"
                                @change="v => editedItem.gender = v"></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select :items="studentStatus"
                                item-text="name"
                                item-value="value"
                                label="学生状态"
                                @change="v => editedItem.studentStatus = v"></v-select>
                    </v-col>
                    '
                    <v-col cols="12" sm="6" md="4">
                      <v-select :items="politicalOutlook"
                                item-text="name"
                                item-value="value"
                                label="政治面貌"
                                @change="v => editedItem.politicalOutlook = v"></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.dormitoryNumber" label="宿舍号"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.studentType" label="学生类型"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.pinyinName" label="姓名拼音"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.identificationNumber" label="身份证号"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.homePhone" label="家庭电话（可选）"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.nationality" label="民族（可选）"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.concatPhone" label="联系电话（可选）"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  返回
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  保存
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="600px">
            <v-card>
              <v-card-title class="text-h5">该学生下可能有绑定的数据，确定要删除该学生吗?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">返回</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">确定</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination
          circle
          @input="updatePage"
          v-model="page"
          :length="pageCount"
      ></v-pagination>
    </div>
    <OperationLog
        :items="operationLogList"
        :current="operationLogListCurrent"
        :size="operationLogListSize"
        :total="operationLogListTotal"
        @load-next-page="loadNextOperationLog"
    />
  </v-container>
</template>

<script>
import { deleteRequest, getRequest, postRequest, putRequest } from '@/utils/request'
import studentApi from '@/api/StudentInfo'
import academyApi from '@/api/AcademyInfo'
import majorApi from '@/api/MajorInfo'
import classApi from '@/api/ClassInfo'
import operationLogApi from '@/api/OperationLog'
import OperationLog from '@/components/OperationLog/OperationLog'
import config from "@/config";

export default {
  name: 'Student',
  components: { OperationLog },
  data () {
    return {
      dialog: false,
      dialogDelete: false,
      majorDisabled: true,
      classDisabled: true,
      academyOptions: [],
      page: 1,
      pageCount: 0,
      itemsPerPage: 5,
      search: '',
      majorOptions: [],
      classId: null,
      studentId: null,
      classOptions: [],
      tableData: [],
      editedIndex: -1,
      headers: [
        { text: '姓名', sortable: false, value: 'name', align: 'start' },
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
        { text: '操作', value: 'actions', sortable: false },
      ],
      editedItem: {
        // 班级 id
        classId: null,
        // 学生名称
        name: '',
        // 学生学号
        studentCode: '',
        // 手机号码
        phoneNumber: '',
        // QQ 号码
        qq: '',
        // 性别
        gender: '',
        // 学生状态
        studentStatus: '',
        // 政治面貌
        politicalOutlook: '',
        // 宿舍号
        dormitoryNumber: '',
        // 学生类型
        studentType: '',
        // 姓名拼音
        pinyinName: '',
        // 身份证号
        identificationNumber: '',
        // 家庭电话（可选）
        homePhone: '',
        // 民族（可选）
        nationality: '',
        // 联系人电话（可选）
        concatPhone: '',
      },
      gender: [{ value: 'MALE', name: '男' }, { value: 'FEMALE', name: '女' }],
      studentStatus: [
        { value: 'DROPPED_OUT', name: '已退学' },
        { value: 'EXPELLED', name: '已开除' },
        { value: 'REGISTERED', name: '已注册' },
        { value: 'SUSPENDED', name: '已休学' },
        { value: 'UNREGISTERED', name: '未注册' },
      ],
      politicalOutlook: [
        { value: 'CPC', name: '中共党员' },
        { value: 'P_CPC', name: '中共预备党员' },
        { value: 'CYL', name: '共青团员' },
        { value: 'NORMAL', name: '群众' },
        { value: 'OTHER', name: '其他' },
      ],
      operationLogList: [],
      operationLogListTotal: 0,
      operationLogListCurrent: 0,
      operationLogListSize: 0,
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '添加学生信息' : '编辑学生信息'
    },
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },
  created () {
    this.getStudentData()
  },
  methods: {
    getStudentData () {
      getRequest(studentApi.getStudentTable, {
        current: this.page,
        pageSize: this.itemsPerPage,
        search: this.search,
        classId: this.classId,
      }).then(response => {
        if (response.code === 0) {
          this.getOperationLogData(1, 1)
          this.tableData = response.data.records
          this.pageCount = response.data.pages
          this.$toast.success("查询成功", config.options)
        } else {
          this.$toast.error(response.msg, config.options)
        }
      })
    },
    getItems () {
      getRequest(academyApi.getAcademyByPermission).then(response => {
        if (response.code === 0) {
          this.academyOptions = response.data
        } else {
          this.$toast.error(response.msg, config.options)
        }
      })
    },
    getValue (value) {
      this.majorDisabled = false
      getRequest(majorApi.getMajorByPermission + `?academyId=${value}`).then(response => {
        if (response.code === 0) {
          this.majorOptions = response.data
        } else {
          this.$toast.error(response.msg, config.options)
        }
      })
    },
    getValue1 (value) {
      this.classDisabled = false
      getRequest(classApi.getClassByPermission + `?majorId=${value}`).then(response => {
        if (response.code === 0) {
          this.classOptions = response.data
        } else {
          this.$toast.error(response.msg, config.options)
        }
      })
    },
    editItem (item) {
      this.editedIndex = this.tableData.indexOf(item)
      this.studentId = item.id
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      this.studentId = item.id
      this.dialogDelete = true
    },
    getValue2 (value) {
      this.classId = value
      this.getStudentData()
    },
    updatePage (number) {
      this.page = number
      this.getStudentData()
    },
    deleteItemConfirm () {
      deleteRequest(studentApi.getStudentTable + `/${this.studentId}`)
          .then(response => {
            if (response.code === 0) {
              this.closeDelete()
              this.getStudentData()
            } else {
              this.$toast.error(response.msg, config.options)
            }
          })
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedIndex = -1
      })
    },
    save () {
      if (this.editedIndex === -1) {
        postRequest(studentApi.getStudentTable, {
          classId: this.editedItem.classId,
          name: this.editedItem.name,
          studentCode: this.editedItem.studentCode,
          phoneNumber: this.editedItem.phoneNumber,
          qq: this.editedItem.qq,
          gender: this.editedItem.gender,
          studentStatus: this.editedItem.studentStatus,
          politicalOutlook: this.editedItem.politicalOutlook,
          dormitoryNumber: this.editedItem.dormitoryNumber,
          studentType: this.editedItem.studentType,
          pinyinName: this.editedItem.pinyinName,
          identificationNumber: this.editedItem.identificationNumber,
          homePhone: this.editedItem.homePhone,
          nationality: this.editedItem.nationality,
          concatPhone: this.editedItem.concatPhone,
        }).then(response => {
          if (response.code === 0) {
            this.close()
            this.getStudentData()
            this.getOperationLogData(1, 1)
          } else {
            this.$toast.error(response.msg, config.options)
          }
        })
      } else {
        putRequest(studentApi.getStudentTable, {
          id: this.studentId,
          classId: this.editedItem.classId,
          name: this.editedItem.name,
          studentCode: this.editedItem.studentCode,
          phoneNumber: this.editedItem.phoneNumber,
          qq: this.editedItem.qq,
          gender: this.editedItem.gender,
          studentStatus: this.editedItem.studentStatus,
          politicalOutlook: this.editedItem.politicalOutlook,
          dormitoryNumber: this.editedItem.dormitoryNumber,
          studentType: this.editedItem.studentType,
          pinyinName: this.editedItem.pinyinName,
          identificationNumber: this.editedItem.identificationNumber,
          homePhone: this.editedItem.homePhone,
          nationality: this.editedItem.nationality,
          concatPhone: this.editedItem.concatPhone,
        }).then(response => {
          if (response.code === 0) {
            this.close()
            this.getStudentData()
            this.getOperationLogData(1, 1)
          } else {
            this.$toast.error(response.msg,config.options)
          }
        })
      }
    },

    getOperationLogData (current, pageSize) {
      getRequest(operationLogApi.getOperationLog, {
        current, pageSize,
        position: operationLogApi.position.STUDENT_MANAGEMENT,
      }).then(res => {
        if (res.code === 0) {
          this.operationLogList = [...this.operationLogList, ...res.data.records]
          this.operationLogListTotal = Number(res.data.total)
          this.operationLogListCurrent = Number(res.data.current)
          this.operationLogListSize = Number(res.data.size)
        } else {
          this.$toast.error(res.msg, config.options)
        }
      })
    },
    loadNextOperationLog ({ current, size }) {
      this.getOperationLogData(current + 1, size)
    },
  },
  comments: {
    OperationLog,
  },
}
</script>

<style scoped>

</style>
