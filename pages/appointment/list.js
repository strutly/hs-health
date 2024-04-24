const app = getApp()
var that;
import Api from '../../config/api';
import Util from '../../utils/util';
import CustomPage from '../../CustomPage';
CustomPage({
  data: {
    tabIndex:0,
    bgs:['bg-green','bg-red','bg-grey'],
    statusArr:[{title:'是',value:1},{title:'否',value:2}],
    navs:[{title:'全部',status:''},{title:'待确认',status:0},{title:'已同意',status:1},{title:'已拒绝',status:2}],
    appointments:[],
    today:Util.formatTime(new Date(),'yyyy-MM-dd')
  },
  onLoad(options) {
    that = this;
    that.setData({
      appointmentTime:Util.formatTime((options.appointmentTime|| new Date()),'yyyy-MM-dd')
    })
  },
  onReady() {
    that.getList(Util.formatTime(that.data.appointmentTime,'yyyy-MM-dd'));
  },
  getList(appointmentTime){
    Api.appointmentDay({appointmentTime}).then(res=>{
      console.log(res);
      that.setData({
        appointments:res.data
      })
    },err=>{
      console.log(err)
    });
  },
  dayChange(e){
    let appointmentTime = that.data.appointmentTime;
    let date = new Date(appointmentTime);
    let day = date.getDate();
    let add = e.currentTarget.dataset.add;
    date.setDate(day + parseInt(add));
    that.setData({
      appointmentTime:Util.formatTime(date,'yyyy-MM-dd')
    })
    that.getList(Util.formatTime(date,'yyyy-MM-dd'));
  },
  onShow() {

  },
  navChange(e){
    console.log(e);
    let tabIndex = that.data.tabIndex;
    let index = e.currentTarget.dataset.index;
    if(tabIndex==index) return;
    that.setData({
      tabIndex:index
    })
  },
  handle(e){
    console.log(e);
    that.setData({
      modalhandle:true,
      ['formData.id']:e.currentTarget.dataset.id
    })
  },
  pickerChange(e){
    console.log(e);
    let name = e.currentTarget.dataset.name;
    that.setData({
      ['formData.'+name]:e.detail.value
    })
  },
  submit(e){
    console.log(e);
    let data = e.detail.value;
    console.log(data);
    if(!data.status) return that.showTips("请选择是否接单");
    if(data.status==1 && !data.startDay){
      return that.showTips("请选择服务开始日期");
    }
    if(data.status==2 && !data.suggest){
      return that.showTips("请输入拒绝接单原因");
    }
    Api.appointmentUpdate(JSON.stringify(data)).then(res=>{
      console.log(res);
      let appointments = that.data.appointments;
      let appointment = appointments.filter(item=>item.id==data.id);
      appointment[0].status = data.status;
      console.log(appointment)
      that.setData({
        modalhandle:false,
        appointments:appointments
      })
    },err=>{
      console.log(err);
    })
  }
})