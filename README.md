# Family Photo Diary

## 项目概述
- **名称**: Family Photo Diary (家庭照片日记)
- **目标**: 面向个人与家庭的私有化照片日记与回忆管理应用
- **技术栈**: Hono + TypeScript + Cloudflare Pages + D1 Database + Vanilla JS + CSS

## 功能模块

### 已完成功能
1. **今日 (Today)** - 今日/本月/今年三视图切换
   - 横向日期条快速跳转
   - 日记卡片展示（照片+文字+位置）
   - 空白日期的提示卡片
   - 月历网格（有记录日期标识）
   - 年度总览日历

2. **图墙 (Gallery)** - 深色沉浸式照片网格
   - 一行三图/六图/九图切换
   - 照片点击查看大图
   - 空位占位显示"片羽集"

3. **回顾 (Recall)** - 随机回顾模式
   - 拍立得风格卡片展示
   - 深色背景氛围
   - 设置下拉菜单（深色拍立得/显示文字/AI评分）
   - 分享和刷新操作

4. **画册 (Albums)** - 自动生成画册
   - 封面式画册展示
   - 画册管理底部弹窗
   - 新增照片日记入口

5. **我的 (Me)** - 个人中心
   - 头像/昵称/角色显示
   - Pro横幅
   - 统计数据（记录数/完整周/加入天数）
   - 菜单列表（照片日记/导出/小组件/标签管理等）

6. **记录创建** - 新建日记记录
   - 选择日期
   - 照片上传（最多3张限制）
   - 文字内容输入
   - 位置信息

### API 路由
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/records` | 获取记录列表 |
| GET | `/api/records/:id` | 获取单条记录 |
| POST | `/api/records` | 创建记录 |
| PUT | `/api/records/:id` | 更新记录 |
| DELETE | `/api/records/:id` | 删除记录 |
| POST | `/api/records/:recordId/photos` | 上传照片 |
| GET | `/api/gallery` | 获取图墙照片 |
| GET | `/api/recall/random` | 随机回顾 |
| GET | `/api/albums` | 获取画册列表 |
| GET | `/api/calendar` | 获取日历标记数据 |
| GET | `/api/stats` | 获取统计数据 |

### 待开发功能
- [ ] 照片分享卡片编辑（模板/色彩/配置/尺寸）
- [ ] 导出功能（月/年ZIP导出）
- [ ] 标签管理
- [ ] 家庭成员邀请与权限
- [ ] PWA离线支持
- [ ] 云端备份同步（OneDrive）
- [ ] 局域网P2P同步
- [ ] 高级搜索与筛选

## 数据架构
- **数据库**: Cloudflare D1 (SQLite)
- **数据模型**: records, photos, albums, tags
- **存储策略**: Local-First (IndexedDB) + Cloud Backup

## 部署
- **平台**: Cloudflare Pages
- **状态**: 开发中
- **最后更新**: 2026-04-09
