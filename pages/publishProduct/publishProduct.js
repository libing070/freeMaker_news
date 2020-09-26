// pages/product/product.js
const app = getApp()
const skillsList = {
    浙江: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
    福建: ['福州', '厦门', '莆田', '三明', '泉州'],
  };
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
        currTreeSelectNavIndex:0,
        skillType:'全部类型',
        skillsColumns: [
            {
              values: Object.keys(skillsList),
              className: 'column1',
            },
            {
              values: skillsList['浙江'],
              className: 'column2',
              defaultIndex: 2,
            },
        ],
        markList:[
            { val: 'UI设计', select: false },
            { val: '品牌设计', select: false},
            { val: 'UI设计', select: false },
            { val: '品牌设计', select: false},
            { val: 'UI设计', select: false },
            { val: '品牌设计', select: false},
            { val: 'UI设计', select: false },
            { val: '品牌设计', select: false},
            { val: 'UI设计', select: false },
            { val: '品牌设计', select: false},
        ],
        chooseMarkList:[],
        salary:''
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
            summarize: e.detail.html,
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
    // //点击树形左侧菜单
    // tapTreeSelectNav(e) {
    //     let currTreeSelectNavIndex=e.currentTarget.dataset.index
    //     this.setData({
    //         currTreeSelectNavIndex
    //     })
    // },
    //选择技能
    onSkillsChange(event) {
        const { picker, value, index } = event.detail;
        console.log(`当前值：${value}, 当前索引：${index}`);
        this.setData({
            shadeShowing:false,
            skillType:`${value}`
        });
    },
    //去除首尾空格
    trimStr(str){
        return str.replace(/(^\s*)|(\s*$)/g,"");
    },
    //对输入金额进行校验
    clearNoNum(value){
        value = value.replace(/[^\d.]/g,"");//清除"数字"和"."以外的字符
        value = value.replace(/^\./g,"");//验证第一个字符是数字而不是字符
        value = value.replace(/\.{2,}/g,".");//只保留第一个.清除多余的
        value = value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
        return value
    },
    //时薪
    bindhourlywageInput(e){
        let salary = this.clearNoNum(e.detail.value)
        this.setData({
            salary,
        });
    },
    //跳转到我的作品列表
    tapToMyProduct(){
        if( this.trimStr(this.data.title) == '' ){
            wx.showToast({
                title: '请填写标题',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if( this.data.total <= 0){
            wx.showToast({
                title: '请描述您的技能，尽可能清晰具体哦～',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if( this.data.imagesList.length <= 0){
            wx.showToast({
                title: '至少上传一张作品图片哦',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if(this.data.skillType=='全部类型'){
            wx.showToast({
                title: '请选择技能类型',
                icon: 'none',
                duration: 2000
            });
            return
        }
        let chooseMarkList=[]
        for(var i = 0; i < this.data.markList.length; i++){
            if(this.data.markList[i].select){
                chooseMarkList.push(this.data.markList[i]);
            }
        }
        this.setData({
            chooseMarkList 
        })

        if(this.data.chooseMarkList.length <= 0){
            wx.showToast({
                title: '请选择技能标签',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if(this.data.salary <= 0){
            wx.showToast({
                title: '请输入您的时薪',
                icon: 'none',
                duration: 2000
            });
            return
        }
        app.globalData.selectedTab = 2
        wx.switchTab({
          url: '/pages/mine/mine',
        })
    },
    //点击标签事件
    tapChooseMarks(e){
        let id = e.currentTarget.dataset.id
        this.setData({
            [`markList[${id}].select`]:!this.data.markList[id].select,
        })
    }
})