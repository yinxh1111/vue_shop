<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt />
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 内容区域 -->
    <el-container>
      <!-- 左侧栏 -->
      <el-aside :width="isCollapse?'64px': '200px'">
        <div class="toggle-button" @click="toggleButton">|||</div>
        <!-- unique-opened 表示当前只能展开一个 collapse是否折叠 collapse-transition 折叠动画  router开启路由模式并且以index作为path路径 default-active激活当前菜单的index,故需要动态绑定-->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router :default-active="activePath"
        >
          <!-- index也必须唯一,不然会重复折叠 -->
          <el-submenu :index="'/'+item.path" v-for=" item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/'+son.path" v-for="son in item.children" :key="son.id" @click="saveNavState('/'+son.path)">
              <template>
                <i class="el-icon-menu"></i>
                <span>{{son.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧栏 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      isCollapse: false,
      activePath:'/users'
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    //获取左侧菜单栏
    async getMenuList() {
      const { data: res } = await this.axios.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    toggleButton() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(state){
      window.sessionStorage.setItem('activePath',state)
      this.activePath = state
    }
  },
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    height: 60px;
    display: flex;
    align-items: center;
    img {
      height: 100%;
    }
    span {
      padding-left: 10px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .toggle-button {
    text-align: center;
    color: #fff;
    background-color: #4a5064;
    font-size: 10px;
    letter-spacing: 0.2em;
    line-height: 24px;
    cursor: pointer;
  }
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
</style>