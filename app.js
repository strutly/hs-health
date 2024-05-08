import Api from './config/api';
App({
  onLaunch() {
    let that = this;
    Api.login().then(res => {
      console.log(res);
      setTimeout(function () {
        that.globalData.login = true;
        that.globalData.status = {code:res.code, msg:res.data?res.data.msg:res.msg,login: (res.data?res.data.login:false), auth: (res.data?res.data.auth:false)};
      }, 100);
    },err=>{
      console.log(err);
    })
  },
  globalData: {
    userInfo: null,
    systemInfo:wx.getSystemInfoSync(),
    status: { login: false, auth: false },
  },
  watch(method) {
    var obj = this.globalData;
    if (obj.login) {
      console.log("已经登录成功了")
      method(obj.status);
    } else {
      Object.defineProperty(obj, 'status', {
        configurable: true,
        enumerable: true,
        set: function (value) {
          this._status = value;
          method(value);
        },
        get: function () {
          console.log(this);

          return this._status;
        }
      })
    }
  }
})
