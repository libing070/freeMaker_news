module.exports = {
    /**
     * 网络请求 携带用户身份
     * @param url String PathName无需域名前缀
     * @param data Object [可选] request.body
     * @param method String [可选] 默认POST
     * @param success Function [可选] 成功
     * @param fail Function [可选] 失败
     * @param complete Function [可选] 完成
     */
    request(object, method) {
      const app = getApp()

        wx.request({
            url: app.globalData.domain + object.url,
            data: object.data,
            header: {
                cookie: app.globalData.cookie,
                'content-type': object.contentType || 'application/json',
                'userToken': app.globalData.userToken
            },
            method: object.method || 'POST',
            success: res => {
                let body = res.data
                if (body.code === 1) {
                    object.success(body.data)
                } else if (body.code != 1) {
                    object.failed(body.data)
                }
            },
            fail: res => {
                let body = res.data
                if (body.code != 1) {
                    object.failed(body.data)
                }
            },
            complete: res => {
                if (object.complete) {
                    object.complete(res)
                }
            }
        })
    },

    post(object) {
        this.request(object, 'POST')
    },
    put(object) {
        this.request(object, 'PUT')
    },

    get(object) {
        this.request(object, 'GET')
    }
}