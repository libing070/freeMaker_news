// pages/loginPages/authModal/authModal.js

const app = getApp()

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        show: Boolean,
    },
    /**
     * 组件的初始数据
     */
    data: {

    },

    pageLifetimes: {
        // 页面被隐藏
        hide() {
            this.dismiss()
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        tapCancel() {
            this.dismiss()
        },

        authDone(e) {
            // e.detail
            this.dismiss()
        },

        dismiss() {
            this.setData({
                show: false
            })
        }
    }
})
