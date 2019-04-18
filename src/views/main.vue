<template>
    <div class="layout">
        <Layout style="width:100%">
            <Header>
                <Menu mode="horizontal" theme="dark" active-name="1"  @on-select="logout">
                  <Icon @click.native="collapsedSider" type="md-menu" size="24"></Icon>
                    <div class="layout-logo"></div>
                    <div class="layout-nav">
                        <Submenu name="1">
                            <template slot="title">
                                <Icon type="icon iconfont icon-qunzu" size="24" />
                                {{userName}}
                            </template>
                            <MenuItem name="logout">退出登录</MenuItem>
                        </Submenu>
                    </div>
                </Menu>
            </Header>
            <Layout>
                <Sider ref="side" hide-trigger collapsible :collapsed-width="75" :value="isCollapsed" :style="{background: '#333333'}">
                    <Menu :active-name="activemenu" theme="dark" ref="side_menu" width="auto" @on-select="goTodo">
                        <MenuItem v-for="item in MenuData" :key="item.name" :name="item.name" :style="{height: '56px'}">
                            <Icon :class="item.icon" size="25"></Icon>
                            <span class="my-menu-label">{{item.text}}</span>
                        </MenuItem>
                    </Menu>
                </Sider>
                <Layout>
                    <Content :style="{padding: '20px 20px 0px 20px',position:'relative',minHeight: '280px', paddingBottom: '70px',height:'100%'}">
                          <router-view></router-view>
                          <Spin fix :style="{zIndex:999}" v-if="spinShow" size="large"></Spin>
                    </Content>
                    <div ref='isHide' class="layout-copy" :style="{textAlign: 'center', lineHeight: '50px'}">
                        &copy; Copyright 2009-2018 项目质量监控系统
                    </div>
                </Layout>
            </Layout>
        </Layout>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'Main',
  data () {
    return {
      activemenu: ''
    }
  },
  computed: {
    spinShow: function () {
      return this.$store.state.spinShow
    },
    isCollapsed: function () {
      return this.$store.state.isCollapsed
    },
    userName: function () {
      return this.$store.state.user.UserName
    },
    MenuData: function () {
      let menuList = []
      if (this.$store.state.user.UserType === 0) {
        menuList = [
          {
            name: 'plan',
            text: '计划管理',
            icon: 'icon iconfont icon-jihuaguanli'
          }
        ]
        this.updateActiveMenu()
      } else if (this.$store.state.user.UserType === 1) {
        menuList = [
          { name: 'home', text: '主页', icon: 'icon iconfont icon-zhuye' },
          {
            name: 'plan',
            text: '计划管理',
            icon: 'icon iconfont icon-jihuaguanli'
          },
          {
            name: 'test',
            text: '测试标准管理',
            icon: 'icon iconfont icon-ceshibiaozhunguanli'
          },
          {
            name: 'user',
            text: '用户管理',
            icon: 'icon iconfont icon-yonghuguanli'
          },
          {
            name: 'ftp',
            text: '服务器管理',
            icon: 'icon iconfont icon-fuwuqiguanli'
          },
          {
            name: 'subcontractor',
            text: '分包商管理',
            icon: 'icon iconfont icon-fenbaoshangguanli'
          },
          // {
          //   name: 'operator',
          //   text: '运营商管理',
          //   icon: 'icon iconfont icon-yunyingshangguanli'
          // },
          {
            name: 'log',
            text: '上传日志管理',
            icon: 'icon iconfont icon-rizhiguanli'
          }
        ]
        this.updateActiveMenu()
      }
      return menuList
    }
  },
  methods: {
    ...mapActions([
      'handleLogout'
    ]),
    goTodo (name) {
      this.$router.push({
        name: name
      })
    },
    updateActiveMenu () {
      this.$nextTick(() => {
        this.activemenu = this.$route.name
      })
    },
    logout (name) {
      if (name === 'logout') {
        this.handleLogout().then(res => {
          this.$router.push({
            name: 'login'
          })
        })
      }
    },
    collapsedSider () {
      this.$store.state.isCollapsed = !this.$store.state.isCollapsed
      this.$refs.side.toggleCollapse()
      this.$nextTick(() => {
        if (this.$refs.side.$el.className.indexOf('ivu-layout-sider-collapsed') > -1) {
          this.$refs.isHide.style.paddingRight = '75px'
        } else {
          this.$refs.isHide.style.paddingRight = '200px'
        }
      })
    }
  }
}
</script>
<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  border-radius: 4px;
  overflow: hidden;
}
.ivu-layout-header {
  background-color: #333333 !important;
}
.ivu-menu-dark {
  background-color: #333333 !important;
}
.layout-logo {
  width: 171px;
  height: 45px;
  background: url("../assets/logo.png");
  border-radius: 3px;
  float: left;
  position: relative;
  top: 7px;
  left: 25px;
}
.layout-nav {
  width: 180px;
  margin: 0 auto;
  position: absolute;
  right: -110px;
}
.layout-copy {
  background: #ddd;
  position: fixed;
  bottom: 0;
  width: 100%;
  padding-right: 75px;
  z-index: 999;
  font-size: 14px;
  transition-duration: 200ms;
}
.ivu-menu-item{
  display: flex;
}
.my-menu-label{
  line-height: 25px;
  font-size: 15px;
  white-space:nowrap;
}
.ivu-icon-md-menu{
  margin: 0 20px;
  position: absolute;
  color:rgba(255,255,255,.6);
  top: 20px;
  left: -46px;
  cursor: pointer;
  transition-duration: 500ms;
}
.ivu-icon-md-menu:hover{
  color:rgba(255,255,255,1);
}
.ivu-layout-sider-collapsed .my-menu-label{
  display: none;
}
</style>
