<template>
  <v-container>
    <v-data-table
        :loading="loading"
        loading-text="加载数据中......"
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
                <v-text-field label="请输入用户名称"
                              v-model="search"
                              append-outer-icon="fa-search"
                              @click:append-outer="getUserData">
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
                添加用户
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
                      <v-text-field v-model="editedItem.username" label="用户名称"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="8">
                      <v-select :items="roleOptions"
                                :value="editedItem.roleId"
                                item-text="name"
                                item-value="id"
                                label="角色"
                                @change="v => editedItem.roleId = v"></v-select>
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
              <v-card-title class="text-h5">该用户下可能有绑定的数据，确定要删除该用户吗?</v-card-title>
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
import OperationLog from "@/components/OperationLog/OperationLog";
import {getRequest, postRequest} from "@/utils/request";
import userApi from '@/api/User'
import roleApi from '@/api/Role'
import config from "@/config";
import operationLogApi from "@/api/OperationLog";

export default {
  name: "User",
  components: { OperationLog },
  data () {
    return {
      loading: true,
      dialog: false,
      dialogDelete: false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 5,
      search: '',
      tableData: [],
      editedIndex: -1,
      userId: null,
      headers: [
        { text: '用户代码', sortable: false, value: 'id', align: 'start'},
        { text: '用户名称', sortable: false, value: 'username' },
        { text: '角色', sortable: false, value: 'roleId' },
        { text: '操作', sortable: false, value: 'actions' }
      ],
      editedItem: {
        username: '',
        roleId: null
      },
      roleOptions: [],
      operationLogListPageSize: 5,
      operationLogList: [],
      operationLogListTotal: 0,
      operationLogListCurrent: 1,
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '添加用户信息' : '编辑用户信息'
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
    this.getUserData()
    this.getOperationLogData(1, this.operationLogListPageSize)
  },
  methods: {
    getUserData () {
      getRequest(userApi.userOperate, {
        current: this.page,
        pageSize: this.itemsPerPage,
        search: this.search
      }).then(response => {
        if (response.code === 0) {
          this.tableData = response.data.records
          this.$toast.success('查询成功', config.options)
          this.loading = false
        } else {
          this.$toast.error(response.msg, config.options)
          this.loading = false
        }
      })
    },
    updatePage (number) {
      this.page = number
      this.getUserData()
    },
    editItem (item) {
      console.log(item)
      this.editedIndex = this.tableData.indexOf(item)
      if (this.editedIndex !== -1) {
        getRequest(roleApi.getRole, {
          current: 1,
          pageSize: 100
        }).then(response => {
          if (response.code === 0) {
            response.data.records.forEach(item => {
              let { id, name } = item
              this.roleOptions.push({ id, name })
            })
          }
        })
      }
      this.userId = item.id
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      this.userId = item.id
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      this.$toast.success('删除成功', config.options)
      this.getUserData()
    },

    close () {
      this.editedItem = []
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
        this.$toast.success('添加成功', config.options)
        this.getUserData()
      } else {
        postRequest(userApi.userOperate1 + `/${this.userId}?roleId=${this.editedItem.roleId}`, {
          id: this.userId,
          username: this.editedItem.username,
          roleId: this.roleId
        }).then(response => {
          if (response.code === 0) {
            this.$toast.success('修改成功', config.options)
            this.close()
            this.getUserData()
            this.getOperationLogData(1, this.operationLogListPageSize)
          }
        })
      }
    },

    appendOperationLogData (current, pageSize) {
      getRequest(operationLogApi.getOperationLog, {
        current, pageSize,
        position: operationLogApi.position.USER_MANAGEMENT,
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
        position: operationLogApi.position.USER_MANAGEMENT,
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
    }
  },
  comments: {
    OperationLog,
  }
}
</script>

<style scoped>

</style>