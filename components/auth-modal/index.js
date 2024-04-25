const app = getApp();
import Api from '../../config/api';
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    modalauth: {
      type: Boolean,
      value: false
    },
    modalorg: {
      type: Boolean,
      value: false
    }
  },
  ready() {
    let that = this;
    Api.getAllAgencyOrg().then(res => {
      that.setData({
        orgs: res.data
      })
    }, err => {
      console.log(err);
      that.showTips(err.msg);
    })
  },
  /**
   * 组件的初始数据
   */
  data: {
    orgs: [],
    formData: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getPhoneNumber(e) {
      let that = this;
      console.log(e);
      if (e.detail.errMsg === "getPhoneNumber:ok") {
        Api.getPhoneNumber({
          code: e.detail.code
        }).then(res => {
          console.log(res);
          let status = app.globalData.status;
          status.auth = true;
          app.globalData.status = status;
          that.showTips("授权成功", "success");
        }, err => {
          console.log(err);
        })
        that.setData({
          modalauth: false
        })
      }
    },
    modalStatus(e) {
      let name = e.currentTarget.dataset.name;
      this.setData({
        ['modal' + name]: !this.data['modal' + name]
      })
    },
    showTips(msg = "出错了~", errorType = "error") {
      this.setData({
        errorMsg: msg || '出错了~',
        errorType: errorType,
        errorShow: true
      })
    },
    reg() {
      wx.navigateTo({
        url: '/pages/index/reg',
      })
    },
    pickerChange(e) {
      let that = this;
      console.log(e);
      let type = e.currentTarget.dataset.type;
      let formData = that.data.formData || {};
      formData[type] = e.detail.value;
      that.setData({
        formData: formData
      })
    },
    bindOrg(e) {
      console.log(e);
      let that = this;
      let data = e.detail.value;
      if (!data.agencyOrgId) return that.showTips("请选择要挂靠的机构");
      Api.caregiverBindOrg(JSON.stringify(data)).then(res => {
        console.log(res);
        that.showTips("申请挂靠成功,请等待机构审核", "success");
        that.setData({
          modalorg: false
        })
      }, err => {
        console.log(err);
        that.showTips(err.msg);
      })

    }
  }
})