<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登陆表单区 -->
      <el-form
        ref="loginFormRef"
        label-width="0px"
        :model="loginForm"
        class="login_form"
        :rules="loginFormRules"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="restLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      //表单的验证规则
      loginFormRules: {
        //验证用户名
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }, //规则一
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }, //规则二
        ],
        //验证密码
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }, //规则一
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          }, //规则二
        ],
      },
    }
  },
  methods: {
    //重置表单
    restLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    //预验证表单
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        //预校验成功则发起请求
        const { data: res } = await this.axios.post('/login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.$message.error('密码或用户名不正确')
        }
        this.$message.success('登陆成功')
        //登陆成功把后台返回的token放在会话时有效数据中sessionStoreage
        window.sessionStorage.setItem('token', res.data.token)
        //跳转至其他页面
        this.$router.push('/home')
      })
    },
  },
}
</script>
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  border-radius: 3px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>