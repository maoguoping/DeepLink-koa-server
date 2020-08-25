#DeepLink-koa-server
##功能介绍##
实现DeepLinkweb端的多角色登录，分级内容管理
## usage

安装依赖
npm i
运行
npm run start
开发模式运行
npm run dev
单元测试
npm run test
单元测试（带报告）
npm run test:report

## 目录结构

src:.
│  page.ts  # 原始项目类待移除
│  passport.ts  # passport策略文件
│  server.ts  # 主入口
│  
├─aliyun
│      aliYun.ts # 阿里云库类待适配
│      
├─controllers
│      apiController.ts # 通用api路由
│      manageCenterConroller.ts # 管理中心api路由
│      settingController.ts # 设置中心路由
│      userController.ts # 用户模块路由
│      
├─model # 数据库实例目录
│      elementType.ts # 元素
│      folderType.ts # 目录
│      index.ts
│      module.ts # 模块
│      project.ts # 工程
│      right.ts # 权限
│      role.ts # 角色
│      roleRightRelation.ts # 角色权限表
│      user.ts # 用户表
│      userRoleRelation.ts # 用户角色表
│      
├─services
│  │  settingService.ts # 设置服务
│  │  
│  ├─common
│  │      userService.ts # 通用用户服务
│  │      
│  ├─manage-center
│  │      elementService.ts # 元素服务
│  │      moduleService.ts # 模块服务
│  │      projectService.ts # 项目服务
│  │      
│  └─setting
│          rightSettingService.ts # 权限管理服务
│          roleSettingService.ts # 角色管理服务
│          userSettingService.ts # 用户管理服务
│          
├─sql-link # sqlLink 目录（暂不分离）
│  │  dispatch.ts # Fn执行函数
│  │  fn.ts # Fn拓展库
│  │  FnObj.ts # 对象参数处理库
│  │  model.ts # 实例
│  │  modelList.ts # 多实例处理
│  │  page.ts # 分页处理
│  │  sqlLink.ts  # 主入口
│  │  
│  └─sentence
│          insert.ts # 插入
│          update.ts # 更新
│          where.ts # 删除
│          
└─utils # 工具目录（暂不分离）
        idUtil.ts # id工具
        qrCodeUtil.ts # 二维码工具