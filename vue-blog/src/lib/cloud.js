// 云服务配置：endpoint / publishableKey 均来自激活环境时返回的 publicConfig，不要改写
export const publicConfig = {
  endpoint: 'https://linwan-blog.app.workbuddy.host',
  publishableKey: 'wbpk_zYecCNReRGYhoEIsJqB9Mn_YuXv8MUgycT3008hmMbKPPsLNLKZwgm0'
}

let clientPromise = null

// 懒加载：SDK 只在留言簿页面被打开时才下载，不影响首屏
export const getCloud = () => {
  if (!clientPromise) {
    clientPromise = import('@tencent-ai/workbuddy-cloud-sdk').then(
      ({ createWorkBuddyCloud }) =>
        createWorkBuddyCloud({
          endpoint: publicConfig.endpoint,
          publishableKey: publicConfig.publishableKey
        })
    )
  }
  return clientPromise
}

export const isLocalOrigin = () => {
  if (typeof window === 'undefined') return false
  const h = window.location.hostname
  return h === 'localhost' || h === '127.0.0.1'
}
