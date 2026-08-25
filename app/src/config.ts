/**
 * 站点运行模式开关。
 * STATIC_MODE = true：纯静态模式——内容来自内置数据，不请求数据库，
 *   登录/报名/后台/在线申请等需要后端的功能自动隐藏。
 * STATIC_MODE = false：全栈模式——恢复 tRPC + 数据库，所有功能开启。
 */
export const STATIC_MODE = true;
