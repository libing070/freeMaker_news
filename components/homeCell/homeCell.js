// components/homeCell/homeCell.js
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        obj: Object,
    },
    
    /**
     * 组件的监听数据
     */
    observers:{
        'some.subfield': (subfield)=>{
            
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        indicatorDots: true,
    },

    /**
     * 在组件实例刚刚被创建时执行，注意此时不能调用 setData
     */
    created(){
    },
    /**
    * 在组件实例进入页面节点树时执行
    */
    attached(){
    },
    /**
    * 在组件布局完成后执行
    */
    ready(){
    },
    /**
     * 组件的方法列表
     */
    methods: {
        changeName() {
            this.triggerEvent('changeName', {
                obj: {id: this.data.obj.id ,name:'李四',time:new Date().getTime()}
            })
        },
        tapCollect(e){
            // 未登录
            if (!app.user) {
                this.setData({
                    showAuthModal: true
                })
                return
            }

            let id = e.currentTarget.dataset.id
            this.setData({
                [`obj.collect`]:!this.data.obj.collect
            })

            if(this.data.obj.collect){
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
        // 点击图片
        tapBanner(e) {
            let current =  e.currentTarget.dataset.path

            let urls = []
            for (let item of this.data.obj.images) {
                urls.push(item.path)
            }
            wx.previewImage({
                current,
                urls,
            })
        },
        //跳转到作品详情
        tapToWorksDetail(e) {
            app.globalData.myDemandDetailData = {} //清空数据 注意:存放的值是 title 和 description ，从我的需求-选择候选人-购买服务的步骤  回填 title，description
            let code = e.currentTarget.dataset.code
            let id = e.currentTarget.dataset.id
            wx.navigateTo({
                url: '/pages/productDetails/productDetails?code=' + code + '&productionId='+id,
            })
        }
    }
})
