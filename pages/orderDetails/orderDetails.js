const API = require("../../utils/api.js")
const REST = require("../../utils/restful.js")

// pages/orderDetails/orderDetails.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        safeBottom: app.safeBottom,
        imagesList: [], //图片
        shadeShowing: false,
        total: 0,
        summarize: '',
        userType: 0, //0 雇佣者 ，2自由职业者
        currentStep: 2, //当前步骤
        isreject: false, //是否验收不通过
        steps: [{
            text: '下单'
        }, {
            text: '接单'
        }, {
            text: '支付'
        }, {
            text: '制作'
        }, {
            text: '验收'
        }, {
            text: '完成'
        }, {
            text: '评价'
        }],
        canClick: false,
        orderId: 10000 //订单ID
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        //todo 调用订单查询接口

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    //跳转到需求推送人列表
    tapToPushUserList() {
        wx.navigateTo({
            url: '/pages/pushUserList/pushUserList',
        })
    },
    //显示隐藏
    shadeShowing(e) {
        console.log(111);
        if (e.currentTarget.dataset.id != "shadeMain") {
            this.setData({
                shadeShowing: !this.data.shadeShowing,
                currPicker: e.currentTarget.dataset.type
            });
        }
    },
    //初始化富文本编辑器
    onEditorReady() {
        const that = this
        wx.createSelectorQuery().select('#editor').context(function (res) {
            that.editorCtx = res.context
        }).exec()
    },
    //编辑器内容改变时触发
    bindEditorInput(e) {
        let summarize = this.deleteHtmlTag(e.detail.html);
        if (summarize.length > 300) {
            wx.showToast({
                title: '请输入300字以内',
                icon: 'none',
                duration: 2000
            });
            return
        }
        this.setData({
            total: summarize.length,
            summarize: e.detail.html
        });
        this.watchOperation()
    },
    //删除html标签
    deleteHtmlTag(html) {
        var dd = html.replace(/<[^>]+>/g, ""); //截取html标签
        var dds = dd.replace(/&nbsp;/ig, ""); //截取空格等特殊标签
        return dds
    },
    //上传作品
    tapUpload(e) {
        if (this.data.imagesList.length >= 8) {
            wx.showToast({
                title: '最多上传8张哦',
                icon: 'none',
                duration: 2000
            });
            return
        }
        wx.chooseImage({
            count: 8 - this.data.imagesList.length,
            sizeType: ['compressed'],
            success: (res) => {
                this.setData({
                    imagesList: this.data.imagesList.concat(res.tempFilePaths)
                });
                this.watchOperation()
            }
        });
    },
    //删除图片
    deletePhotos(e) {
        let currIndex = e.currentTarget.dataset.index;
        console.log(currIndex);
        this.data.imagesList.splice(currIndex, 1);
        this.setData({
            imagesList: this.data.imagesList,
        })
        this.watchOperation()
    },
    // 点击图片
    tapBanner(e) {
        //let current = 'http:' + e.currentTarget.dataset.item
        let current = e.currentTarget.dataset.item

        let urls = []
        for (let item of this.data.imagesList) {
            //urls.push('http:' + item)
            urls.push(item)
        }

        wx.previewImage({
            current,
            urls,
        })
    },
    //一键复制
    tapCopy(e) {
        let content = e.currentTarget.dataset.content;
        wx.setClipboardData({
            data: content,
            success(res) {
                console.log(res);
            }
        })
    },
    watchOperation() {
        if (this.data.total == 0 || this.data.imagesList.length == 0) {
            this.setData({
                canClick: false
            })
        } else {
            this.setData({
                canClick: true
            })
        }
    },
    //支付
    payOrder(event) {
        //todo zyc mock订单数据
        let that=this
        wx.requestPayment({
            timeStamp: '123456',
            nonceStr: 'test',
            package: 'test',
            signType: 'test',
            paySign: 'test',
            success(res) {},
            fail(res) {},
            complete(res) {
                console.log("支付完成，调用订单状态改变接口")
                that.updateOrderStatus(event.currentTarget.dataset.status)
            }
        })
    },
    updateOrderStatus(status) {
        REST.put({
            url: API.updateOrderStatus,
            data: {
                id: this.data.orderId,
                status: status
            },
            success: (data) => {
                console.log('同步订单状态成功')
            },
            failed: (resp) => {}
        })
    },
    //验收不通过提交时间
    tapshadeNopass() {
        if (this.data.total == 0) {
            wx.showToast({
                title: '请填写验收不通过理由',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if (this.data.imagesList.length == 0) {
            wx.showToast({
                title: '至少上传一张图片',
                icon: 'none',
                duration: 2000
            });
            return
        }
        this.setData({
            shadeShowing: false,
            isreject: true
        })
    },
    //确认验收
    confirmAgree() {
        this.setData({
            shadeShowing: false,
            isreject: false,
            currentStep: 5
        })
    },
    //取消订单
    tapCancleOrder() {
        wx.showModal({
            title: '提示信息',
            content: '确认取消订单？',
            showCancel: true,
            confirmColor: '#FFBA20',
            confirmText: '确定',
            success: res => {
                if (res.confirm) {
                    wx.navigateBack({
                        delta: 1
                    })
                }
            },
        })
    }
})