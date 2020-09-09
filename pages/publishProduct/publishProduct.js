// pages/product/product.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        safeBottom:app.safeBottom,
        title:'',
        summarize:'',
        total: 0,
        imagesList:[],//图片
        shadeShowing:false,
        currTreeSelectNavIndex:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
    bindTitleInput(e) {
        let title=e.detail.value;
        this.setData({
            title
        });
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
        let summarize=this.deleteHtmlTag(e.detail.html);
        if(summarize.length > 300){
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
    },
    //删除html标签
    deleteHtmlTag(html) {
        var dd=html.replace(/<[^>]+>/g,"");//截取html标签
        var dds=dd.replace(/&nbsp;/ig,"");//截取空格等特殊标签
        return dds
    },
    //上传作品
    tapUpload(e) {
        if(this.data.imagesList.length >= 8){
            wx.showToast({
                title: '最多上传8张哦',
                icon: 'none',
                duration: 2000
            });
            return
        }
        wx.chooseImage({
            count: 8-this.data.imagesList.length,
            sizeType: ['compressed'],
            success: (res) => {
                this.setData({
                    imagesList: this.data.imagesList.concat(res.tempFilePaths)
                });
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
    //显示隐藏
    shadeShowing(e) {
        console.log(111);
        if (e.currentTarget.dataset.id != "shadeMain") {
             this.setData({
                shadeShowing: !this.data.shadeShowing
            });
        }
    },    
    //点击树形左侧菜单
    tapTreeSelectNav(e) {
        let currTreeSelectNavIndex=e.currentTarget.dataset.index
        this.setData({
            currTreeSelectNavIndex
        })
    }
})