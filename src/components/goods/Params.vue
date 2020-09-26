<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-alert
        title="只能选择三级菜单"
        type="warning"
        :closable="false"
        show-icon
        class="top_alert"
      >
      </el-alert>

      <el-row>
        <el-col>
          <span> 选择商品分类: </span>
          <!-- v-model 表示被选中的 v-options:渲染的数据 props:配置项 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="propsObj"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isDisabled">添加参数</el-button>
          <el-table :data="manyTableList" stripe border>
              <el-table-column type="expand"></el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="attr_name" label="参数名称">
              </el-table-column>
              <el-table-column label = "操作">
                  <el-button type="primary" icon="el-icon-edit">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete">删除</el-button>
              </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isDisabled">添加参数</el-button>
          <el-table :data="onlyTableList" stripe border>
              <el-table-column type="expand"></el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="attr_name" label="参数名称">
              </el-table-column>
              <el-table-column label = "操作">
                  <el-button type="primary" icon="el-icon-edit">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete">删除</el-button>
              </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: 'many',
      cateList: [],
      selectedCateKeys: [],
      options: [],
      propsObj: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      manyTableList:[],
      onlyTableList:[],
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    getCateKeysLength() {
      return this.selectedCateKeys.length
    },
    isDisabled() {
      return this.getCateKeysLength == 3 ? false : true
    },
    cateId(){
        return this.selectedCateKeys[2]
    }
  },
  methods: {
    //应该详细处理请求错误,但此处为了节约时间,仅处理了成功
    //获取三级选择器
    async getCateList() {
      const { data: res } = await this.axios.get('categories')
      console.log(res)
      this.cateList = res.data
    },
    handleChange() {
      this.getParamsData()
    },
    handleClick(tab) {
      this.getParamsData()
    },
    async getParamsData(){
        if (this.getCateKeysLength !== 3) {
        this.selectedCateKeys = []
        return
      }
        const {data:res} =  await this.axios.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
        if(this.activeName === 'only'){
            this.onlyTableList = res.data
        }
        if(this.activeName ==="many"){
            this.manyTableList = res.data
        }
    }
  },
}
</script>
<style lang="less" scoped>
.top_alert {
  margin-bottom: 10px;
}
</style>