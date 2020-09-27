// pages/demand/demand.js
const util = require("../../utils/util");
const area = require("../../utils/area");
const app = getApp()
const citys = {
    浙江: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
    福建: ['福州', '厦门', '莆田', '三明', '泉州'],
  };
const watch = require("../../utils/watch.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type:0,//type: 0 发布需求 ,1 购买服务
        safeBottom:app.safeBottom,
        collect:false,
        title:'',
        summarize:'',
        total: 0,
        shadeShowing:false,
        currTreeSelectNavIndex:0,
        currPicker:'',
        minDate: new Date().getTime(),
        maxDate: new Date().getTime() +(86400000 * 365 * 10),
        currentDate: new Date().getTime(),
        currentDateStr:'请选择',//交付时间
        formatter(type, value) {
            if (type === 'year') {
              return `${value}年`;
            } else if (type === 'month') {
              return `${value}月`;
            } else if (type === 'day') {
                return `${value}日`;
            }
            return value;
        },

        currrArea:[],//省市区
        currrAreaCode:'',
        
        demandType:'请选择',
        demandColumns: [
            // {
            //   values: Object.keys(citys),
            //   className: 'column1',
            // },
            // {
            //   values: citys['浙江'],
            //   className: 'column2',
            //   defaultIndex: 2,
            // },
        ],
        budget:'',
        hourlywage:'¥400/时',
        isClickbtn:false,
        buysum:1,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        watch.setWatcher(this); // 设置监听器，建议在onLoad下调用
        this.setData({
            areaList:area.default,
            type: options.type || 0
        });
        wx.setNavigationBarTitle({
            title: this.data.type == 0 ? '发布需求' : '购买服务'
        })
        this.loadjobTree()
        
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
    //获取技能数据
    loadjobTree(){
        app.request({
            url: '/v1/jobTree/treeData',
            method: 'GET',
            success: res => {
                console.log(res);
                this.filterTreeData(res);
            },
            fail: res => {
                wx.showToast({
                    title: '获取失败',
                    icon: 'none',
                    duration: 2000
                });
            },
        })
    },
    filterTreeData(data){
        let selectFromatArray=[],compareFromatList=[],selectFromatObject={}
        if(data.length > 0){
            let level1=[]
            for(let i in data){
                 level1=data[i].value.cateName
                 let level2=[]
                 let childs=data[i].childs
                for(let child of childs){
                     level2.push(child.value.cateName)
                }
                //暂且废弃
                // selectFromatArray.push({
                //     [level1]:level2
                // });

                
                selectFromatObject[level1]=level2
            }
        }
        console.log(selectFromatObject)

        let demandColumns=[
            {
              values: Object.keys(selectFromatObject),
              className: 'column1',
            },
            {
              values:selectFromatObject[Object.keys(selectFromatObject)[0]],
              className: 'column2',
              defaultIndex: 0,
            },
        ]
        this.setData({
            demandColumns,
            selectFromatObject
        })
     
    },
    watch:{
        'title':function(value, oldValue){
            if(value ==''){
                this.setData({
                  //  isClickbtn:false
                })
            }

        },
    },
    tapCollect(e){
        this.setData({
            collect:!this.data.collect
        })

        if(this.data.collect){
            wx.showToast({
                title: '收藏成功',
                icon: 'none',
                duration: 2000
            });
        }else{
            wx.showToast({
                title: '已取消收藏',
                icon: 'none',
                duration: 2000
            });  
        }
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
    //监听输入框，选择框 状态
    watchInputSelectStatus(){
        console.log(this.data.demandType)
        console.log(this.data.currentDateStr)
        console.log(this.data.budget)
        console.log(this.data.currrArea)
        if(this.data.type == 0){ //发布需求
            if( this.trimStr(this.data.title) == '' 
            || this.data.total <= 0 
            || this.data.demandType=='请选择' 
            || this.data.currentDateStr=='请选择'
            || this.data.budget==''
            || this.data.currrArea.length <=0 ){
                this.setData({
                    isClickbtn:false
                })
            }else{
                this.setData({
                    isClickbtn:true
                })
            }
        }else if(this.data.type == 1){//购买服务
            if( this.trimStr(this.data.title) == '' 
            || this.data.total <= 0 
            || this.data.demandType=='请选择' 
            || this.data.currentDateStr=='请选择'
            || this.data.currrArea.length <=0 ){
                this.setData({
                    isClickbtn:false
                })
            }else{
                this.setData({
                    isClickbtn:true
                })
            }
        }


    },
    bindTitleInput(e) {
        let title=e.detail.value;
        this.setData({
            title,
        });
        this.watchInputSelectStatus();
    },
    //预算
    bindbudgetInput(e){
        let budget = this.clearNoNum(e.detail.value)
        this.setData({
            budget,
        });
        this.watchInputSelectStatus();
    },
    //时薪
    bindhourlywageInput(e){
        let hourlywage = this.clearNoNum(e.detail.value)
        this.setData({
            hourlywage,
        });
        this.watchInputSelectStatus();
    },
    //计算购买数量
    calcQuantity(e){
        let type =  e.currentTarget.dataset.type
        let buysum=this.data.buysum
        if(type == 'plussign'){
            buysum++
        }
        else{
            if(buysum >1){
                buysum--
            }else{
                wx.showToast({
                    title: '至少购买一份，不能再减啦',
                    icon: 'none',
                    duration: 2000
                });
                return
            }

        }
   
        this.setData({
            buysum
        })


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
        console.log(this.data.summarize)
        this.watchInputSelectStatus();
    },
    //删除html标签
    deleteHtmlTag(html) {
        var dd=html.replace(/<[^>]+>/g,"");//截取html标签
        var dds=dd.replace(/&nbsp;/ig,"");//截取空格等特殊标签
        return dds
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
    onDemandConfirm(event) {
        const { picker, value, index } = event.detail;
        console.log(`当前值：${value}, 当前索引：${index}`);
        console.log(index)
        this.setData({
            shadeShowing:false,
            demandType:`${value}`
        });
        // let demandColumns=[
        //     {
        //       values: Object.keys(this.data.selectFromatObject),
        //       className: 'column1',
        //     },
        //     {
        //       values:this.data.selectFromatObject[Object.keys(this.data.selectFromatObject)[index[0]]],
        //       className: 'column2',
        //       defaultIndex: index[1],
        //     },
        // ]
        // this.setData({
        //     demandColumns,
        // })
        this.watchInputSelectStatus();
    },
    onDemandChange(event) {
        const { picker, value, index } = event.detail;
        picker.setColumnValues(1, this.data.selectFromatObject[value[0]]);
        // let demandColumns=[
        //     {
        //       values: Object.keys(this.data.selectFromatObject),
        //       className: 'column1',
        //     },
        //     {
        //       values:this.data.selectFromatObject[Object.keys(this.data.selectFromatObject)[index[0]]],
        //       className: 'column2',
        //       defaultIndex: index[1],
        //     },
        // ]
        // this.setData({
        //     demandColumns,
        // })

    },
    onCancel(){
        this.setData({
            shadeShowing:false,
        });
    },
    //点击树形左侧菜单
    tapTreeSelectNav(e) {
        let currTreeSelectNavIndex=e.currentTarget.dataset.index
        this.setData({
            currTreeSelectNavIndex
        })
    },
    //时间下拉确定按钮事件
    dateTapDone(e) {
        let currentDate=e.detail;
        let currentDateStr=util.formatDate(currentDate)
        this.setData({
            shadeShowing: false,
            currentDate:currentDate,
            currentDateStr:currentDateStr,
        });
        this.watchInputSelectStatus();
    },
    //省份下拉确认按钮事件
    areaTapDone(e) {
        console.log(e);
        let currrArea=e.detail.values;
        if(currrArea[0].name == "" || currrArea[0].name == "请选择"){
            wx.showToast({
                title: '请选择所在省份',
                icon: 'none',
                duration: 2000
            });
            return 
        }
        if(currrArea[1].name == "" || currrArea[1].name == "请选择"){
            wx.showToast({
                title: '请选择所在城市',
                icon: 'none',
                duration: 2000
            });
            return 
        }
        if(currrArea[2].name == "" || currrArea[2].name == "请选择"){
            wx.showToast({
                title: '请选择所在区域',
                icon: 'none',
                duration: 2000
            });
            return 
        }


        this.setData({
            shadeShowing: false,
            currrArea: [currrArea[0].name,currrArea[1].name,currrArea[2].name],
            currrAreaCode: currrArea[2].code,
        });
        this.watchInputSelectStatus();
    },
    //取消按钮事件
    // 点击遮罩层
    tapCancel(e) {
        this.setData({
            shadeShowing: false
        });
    },
     //跳转到我的作品列表
     tapToMyDemand(){
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
                title: '请填写需求描述',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if(this.data.demandType=='请选择'){
            wx.showToast({
                title: '请选择需求类型',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if( this.data.currentDateStr=='请选择'){
            wx.showToast({
                title: '请选择期望交付时间',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if(this.data.type==0 && this.data.budget==''){
            wx.showToast({
                title: '请填写您的预算',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if(this.data.currrArea.length <=0){
            wx.showToast({
                title: '请选择省份城市',
                icon: 'none',
                duration: 2000
            });
            return
        }
        if(this.data.type==0){
            app.globalData.selectedTab = 0
            wx.switchTab({
              url: '/pages/mine/mine',
            })
        }else{
            wx.navigateTo({
                url: '/pages/orderDetails/orderDetails?currentStep=1&buysum='+this.data.buysum,
            })
        }

    }
})