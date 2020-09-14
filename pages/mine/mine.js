const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        selectedTab: 0,
        tabs: ['我的需求', '我的订单', '我的作品'],
        safeBottom: app.safeBottom,
        selecteddemandTab:0,
        dropdownShowing1:false,
        options1Text:'全部订单',
        options2Text:'全部状态',
        dropdownShowing2:false,
        options1:[
            {'text':'我发起的','value':'0','checked':false},
            {'text':'我收到的','value':'1','checked':false}
        ],
        options2:[
            {'text':'全部','value':'0','checked':false},
            {'text':'进行中','value':'1','checked':false},
            {'text':'待接单','value':'2','checked':false},
            {'text':'已完成','value':'3','checked':false},
            {'text':'已关闭','value':'4','checked':false},
        ]
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
        console.log(app.globalData.selectedTab);
        this.setData({
            selectedTab:app.globalData.selectedTab || 0
        })
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
    //tab切换
    tapTab(e) {
      let tab = e.currentTarget.dataset.tab
      this.setData({
          selectedTab: tab,
          dropdownShowing1:false,
          dropdownShowing2:false,
      })
    },
    //我的需求 二级菜单切换事件
    tapdemandTab(e){
        let tab = e.currentTarget.dataset.tab
        this.setData({
            selecteddemandTab: tab,
        })
    },
    //跳转到我的需求详情
    tapToOrderDetails(e){
        wx.navigateTo({
            url: '/pages/orderDetails/orderDetails',
        })
    },
    //我的订单 下拉菜单显示隐藏1
    dropdownShowing1(e) {
        if (e.currentTarget.dataset.id != "shadeMain") {
            this.setData({
                dropdownShowing1: !this.data.dropdownShowing1,
                dropdownShowing2:false
            });
        }
    },
    //下拉菜单切换事件1
    tapChangedropdown1(e){
        let index = e.currentTarget.dataset.index
        let item = e.currentTarget.dataset.item
        let optionss = [...this.data.options1]
        let options1Text=""
        for(let i = 0; i < optionss.length; i++){
            if(i == index){
                optionss[i].checked = true
                options1Text = optionss[i].text
            }else{
                optionss[i].checked = false
            }
        }
        this.setData({
            options1:optionss,
            dropdownShowing1: !this.data.dropdownShowing1,
            options1Text:options1Text
        })
    },
    //我的订单 下拉菜单显示隐藏2
    dropdownShowing2(e) {
        if (e.currentTarget.dataset.id != "shadeMain") {
            this.setData({
                dropdownShowing2: !this.data.dropdownShowing2,
                dropdownShowing1:false,

            });
        }
    },
    //下拉菜单切换事件2
    tapChangedropdown2(e){
        let index = e.currentTarget.dataset.index
        let optionss = [...this.data.options2]
        let options2Text = ""
        for(let i = 0; i < optionss.length; i++){
            if(i == index){
                optionss[i].checked = true
                options2Text = optionss[i].text
            }else{
                optionss[i].checked = false
            }
        }
        this.setData({
            options2:optionss,
            dropdownShowing2: !this.data.dropdownShowing2,
            options2Text: options2Text
        })
    },
    //跳转到作品详情
    tapToProductDetails(){
        wx.navigateTo({
            url: '/pages/productDetails/productDetails',
        })
    }
})