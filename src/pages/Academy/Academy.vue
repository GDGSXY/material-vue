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
                <v-text-field label="请输入学院名称"
                              v-model="search"
                              append-outer-icon="fa-search"
                              @click:append-outer="getAcademyData">
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
                添加学院
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="8">
                      <v-text-field v-model="editedItem.name" label="学院名称"></v-text-field>
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
              <v-card-title class="text-h5">该学院下可能有绑定的数据，确定要删除该学院吗?</v-card-title>
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
import config from "@/config";
import OperationLog from "@/components/OperationLog/OperationLog";
import operationLogApi from "@/api/OperationLog";

export default {
  name: "Depart",
  components: { OperationLog },
  data () {
    return {
      dialog: false,
      dialogDelete: false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 5,
      search: '',
      tableData: [],
      editedIndex: -1,
      academyId: null,
      headers: [
        { text: '学院代码', sortable: false, value: 'id', align: 'start' },
        { text: '学院名称', sortable: false, value: 'name' },
        { text: '操作', value: 'actions', sortable: false }
      ],
      editedItem: {
        name: ''
      },
      operationLogListPageSize: 5,
      operationLogList: [],
      operationLogListTotal: 0,
      operationLogListCurrent: 1,
    }
  },
  created() {
    this.getAcademyData()
    this.getOperationLogData(1, this.operationLogListPageSize)
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
          this.pageCount = response.data.pages
          this.$toast.success("查询成功", config.options)
        } else {
          this.$toast.error(response.msg, config.options)
        }
      })
    },
    editItem (item) {
      this.editedIndex = this.tableData.indexOf(item)
      this.academyId = item.id
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      this.academyId = item.id
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      deleteRequest(academyApi.getAcademy + `/${this.academyId}`)
          .then(response => {
            if (response.code === 0) {
              this.closeDelete()
              this.getAcademyData()
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
        postRequest(academyApi.getAcademy, {
          name: this.editedItem.name
        }).then(response => {
          if (response.code === 0) {
            this.close()
            this.getAcademyData()
            this.getOperationLogData(1, this.operationLogListPageSize)
          } else {
            this.$toast.error(response.msg, config.options)
          }
        })
      } else {
        putRequest(academyApi.getAcademy, {
          id: this.academyId,
          name: this.editedItem.name
        }).then(response => {
          if (response.code === 0) {
            this.close()
            this.getAcademyData()
            this.getOperationLogData(1, this.operationLogListPageSize)
          } else {
            this.$toast.error(response.msg,config.options)
          }
        })
      }
    },

    appendOperationLogData (current, pageSize) {
      getRequest(operationLogApi.getOperationLog, {
        current, pageSize,
        position: operationLogApi.position.ACADEMY_MANAGEMENT,
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
        position: operationLogApi.position.ACADEMY_MANAGEMENT,
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

    updatePage (number) {
      this.page = number
      this.getAcademyData()
    }
  },

  comments: {
    OperationLog,
  }
}
</script>

<style scoped>

</style>
