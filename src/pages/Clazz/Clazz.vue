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
                <v-text-field label="请输入班级名称"
                              v-model="search"
                              append-outer-icon="fa-search"
                              @click:append-outer="getClassData">
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
                添加班级
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
                      <v-select :items="counselorOptions"
                                item-text="name"
                                item-value="userId"
                                label="请选择辅导员"
                                @click="getCounselor"
                                @change="v => editedItem.counselorId = v"></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select :items="headTeacherOptions"
                                item-text="name"
                                item-value="userId"
                                label="请选择班主任"
                                @click="getHeadTeacher"
                                @change="v => editedItem.headTeacherId = v"></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.name" label="班级名称"></v-text-field>
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
              <v-card-title class="text-h5">该班级下可能有绑定的数据，确定要删除该班级吗?</v-card-title>
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
        :total="operationLogListTotal"
        @load-next-page="loadNextOperationLog"
    />
  </v-container>
</template>

<script>
import {deleteRequest, getRequest, postRequest, putRequest} from "@/utils/request";
import academyApi from '@/api/AcademyInfo'
import majorApi from '@/api/MajorInfo'
import classApi from '@/api/ClassInfo'
import teacherApi from '@/api/Teacher'
import config from "@/config";
import operationLogApi from "@/api/OperationLog";
import OperationLog from "@/components/OperationLog/OperationLog";

export default {
  name: "Clazz",
  components: { OperationLog },
  data () {
    return {
      dialog: false,
      dialogDelete: false,
      majorDisabled: true,
      page: 1,
      pageCount: 0,
      itemsPerPage: 5,
      academyOptions: [],
      majorOptions: [],
      counselorOptions: [],
      headTeacherOptions: [],
      classId: null,
      majorId: null,
      academyId: null,
      search: '',
      tableData: [],
      editedIndex: -1,
      headers: [
        { text: '班级名称', sortable: false, value: 'name', align: 'start' },
        { text: '学制', sortable: false, value: 'schoolYear' },
        { text: '班级人数', sortable: false, value: 'count' },
        { text: '开设年份', sortable: false, value: 'establishYear' },
        { text: '校区名称', sortable: false, value: 'campusName' },
        { text: '校区代码', sortable: false, value: 'campusCode' },
        { text: '操作', sortable: false, value: 'actions' }
      ],
      editedItem: {
        counselorId: null,
        headTeacherId: null,
        name: '',
        teacherCode: ''
      },
      // 操作日志
      operationLogListPageSize: 5,
      operationLogList: [],
      operationLogListTotal: 0,
      operationLogListCurrent: 1
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '添加班级信息' : '编辑班级信息'
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
  created() {
    this.getClassData()
    this.getOperationLogData(1, this.operationLogListPageSize)
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
          this.pageCount = Number(response.data.pages)
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
          this.$toast.error(response.msg, config.options);
        }
      })
    },
    getValue (value) {
      this.majorDisabled = false
      this.academyId = value
      getRequest(majorApi.getMajorByPermission + `?academyId=${value}`)
      .then(response => {
        if (response.code === 0) {
          this.majorOptions = response.data
        } else {
          this.$toast.error(response.msg, config.options);
        }
      })
    },
    getValue1 (value) {
      this.majorId = value
      this.getClassData()
    },

    getCounselor () {
      getRequest(teacherApi.queryCounselorByAcademyId + `?academyId=${this.academyId}`)
      .then(response => {
        if (response.code === 0) {
          response.data.forEach(item => {
            let { userId, name } = item
            this.counselorOptions.push({ userId, name })
          })
          console.log(this.counselorOptions);
        } else {
          this.$toast.error(response.msg, config.options)
        }
      })
    },

    getHeadTeacher () {
      getRequest(teacherApi.queryHeadTeacherByAcademyId + `?academyId=${this.academyId}`)
      .then(response => {
        if (response.code === 0) {
          response.data.forEach(item => {
            let { userId, name } = item
            this.headTeacherOptions.push({ userId, name })
          })
        } else {
          this.$toast.error(response.msg, config.options)
        }
      })
    },

    editItem (item) {
      this.editedIndex = this.tableData.indexOf(item)
      this.classId = item.id
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      this.classId = item.id
      this.dialogDelete = true
    },
    updatePage (number) {
      this.page = number
      this.getClassData()
    },
    deleteItemConfirm () {
      deleteRequest(classApi.getClass + `/${this.classId}`)
          .then(response => {
            if (response.code === 0) {
              this.closeDelete()
              this.getClassData()
              this.getOperationLogData(1, this.operationLogListPageSize)
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
        postRequest(classApi.getClass, {
          name: this.editedItem.name,
          counselorId: this.editedItem.counselorId,
          headTeacherId: this.editedItem.headTeacherId,
          majorId: this.majorId
        }).then(response => {
          if (response.code === 0) {
            this.close()
            this.getClassData()
            this.getOperationLogData(1, this.operationLogListPageSize)
          } else {
            this.$toast.error(response.msg, config.options)
          }
        })
      } else {
        putRequest(classApi.getClass, {
          id: this.classId,
          name: this.editedItem.name,
          counselorId: this.editedItem.counselorId,
          headTeacherId: this.editedItem.headTeacherId,
          majorId: this.majorId
        }).then(response => {
          if (response.code === 0) {
            this.close()
            this.getClassData()
            this.getOperationLogData(1, this.operationLogListPageSize)
          } else {
            this.$toast.error(response.msg, config.options)
          }
        })
      }
    },

    appendOperationLogData (current, pageSize) {
      getRequest(operationLogApi.getOperationLog, {
        current, pageSize,
        position: operationLogApi.position.CLASS_MANAGEMENT,
      }).then(res => {
        if (res.code === 0) {
          this.operationLogList = [...this.operationLogList, ...res.data.records]
          this.operationLogListTotal = Number(res.data.total)
          this.operationLogListCurrent = Number(res.data.current)
        } else {
          this.$toast.error(res.msg, config.options)
        }
      })
    },

    getOperationLogData (current, pageSize) {
      getRequest(operationLogApi.getOperationLog, {
        current, pageSize,
        position: operationLogApi.position.CLASS_MANAGEMENT,
      }).then(res => {
        if (res.code === 0) {
          this.operationLogList = res.data.records
          this.operationLogListTotal = Number(res.data.total)
          this.operationLogListCurrent = Number(res.data.current)
        } else {
          this.$toast.error(res.msg, config.options)
        }
      })
    },

    loadNextOperationLog ({ current }) {
      this.appendOperationLogData(current + 1, this.operationLogListPageSize)
    },
  },
  comments: {
    OperationLog,
  },
}
</script>

<style scoped>

</style>