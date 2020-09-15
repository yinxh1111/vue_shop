<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- clearable 可清空输入框 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" @change="getUsersList" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addSDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="usersList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- slot-scope 作用域插槽,scope.row获取当前行的所以参数 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userInfoChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editDialogVisible = true,showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 4, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户弹出对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="addSDialogVisible"
      width="50%"
      @close="resetForm('addUserForm')"
    >
      <el-form :model="addUserForm" :rules="addUserRules" ref="addUserForm" label-width="100px">
        <el-form-item label="名称" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email" type="email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addSDialogVisible = false;">取 消</el-button>
        <el-button
          type="primary"
          @click="test('addUserForm','post','/users',201),addSDialogVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户弹出对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="resetForm('editUserForm')"
    >
      <el-form :model="editUserForm" :rules="addUserRules" ref="editUserForm" label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editDialogVisible = false,test('editUserForm','put',`/users/${editUserForm.id}`,200)"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    //自定义验证规则
    let checkPhone = (rule, value, cb) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      usersList: [],
      total: 0,
      addSDialogVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 3 到 15 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入正确邮箱', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur'],
          },
        ],
        mobile: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' },
        ],
      },
      editDialogVisible: false,
      editUserForm: {
        username: '',
        email: '',
        mobile: '',
      },
    }
  },
  created() {
    this.getUsersList()
  },
  methods: {
    //获取用户列表
    async getUsersList() {
      const { data: res } = await this.axios.get('/users', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.total = res.data.total
      this.usersList = res.data.users
    },
    //处理页面大小
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUsersList()
    },
    //处理当前页数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUsersList()
    },
    //改变用户状态
    async userInfoChange(userInfo) {
      const { data: res } = await this.axios.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        this.$message.error(res.meta.msg)
      } else {
        this.$message.success(res.meta.msg)
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    //根据id获取编辑用户的信息
    async showEditDialog(id) {
      const { data: res } = await this.axios.get(`/users/+${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editUserForm = res.data
    },
    //预验证表单
    test(formName, method, path, status) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请填写正确的数据')
        }
        //预校验成功则发起请求
        const { data: res } = await this.axios[method](
          `${path}`,
          this[formName]
        )
        if (res.meta.status !== status) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)

        this.getUsersList()
      })
    },
    //删除用户
    async deleteUser(id) {
      const confirmRes = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if(confirmRes !== 'confirm'){
        return this.$message('取消删除用户')
      }
      const{data:res} =  await this.axios.delete('users/'+id)
      if(res.meta.status !==200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.getUsersList()
    },
  },
}
</script>