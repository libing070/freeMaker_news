const app = getApp()
Page({

    /**
    * 页面的初始数据
    */
    data: {
        safeBottom:app.safeBottom,
        safeTop:app.safeTop,
        staticIcon:['/images/home/home-icon1.png','/images/home/home-icon2.png','/images/home/home-icon3.png','/images/home/home-icon3.png'],
        pageType:'',
        firstLevelJobs:[],//一级标签
        secondLevelJobs:[],//二级标签
        recommendProductInfos:[]//为你推荐
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {        
        this.loadFirstLevelJobs()
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
        this.loginSuccess()
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
    // mark: 登录成功
    loginSuccess(login) {
        this.setData({
            user: app.user,  
        })
        if(login){
            let customtabbarComponent = this.selectComponent('#customtabbarComponent'); // 页面获取自定义组件实例
            if(this.data.pageType=='demand'){
                customtabbarComponent.tapToDemand(); // 通过实例调用组件事件 跳转到发布需求
            }else if(this.data.pageType=='product'){
                customtabbarComponent.tapToProduct(); // 通过实例调用组件事件 跳转到发布作品
            }
        }
    },
    pageType(e){
        console.log(e.detail.pageType);
        this.setData({
            pageType: e.detail.pageType
        })
    },
    changeName(event) {
        
        console.log(event.detail)
    },
    //跳转到homelist
    tapTohomeList(e) {

        let id=e.currentTarget.dataset.id
        let cateName=e.currentTarget.dataset.catename
        wx.navigateTo({
            url: '/pages/homeList/homeList?cateName=' + cateName,
        })
    },
    //获取一级领域接口
    loadFirstLevelJobs(){
        app.request({
            url: '/v1/display/configs',
            method: 'GET',
            success: res => {
                this.setData({
                    firstLevelJobs:res.firstLevelJobs,
                    secondLevelJobs:res.secondLevelJobs,
                    recommendProductInfos:res.recommendProductInfos
                });
                console.log(res.recommendProductInfos);
            },
            fail: res => {
                wx.showToast({
                    title: '获取失败',
                    icon: 'none',
                    duration: 2000
                });
            },
        })
    }
})