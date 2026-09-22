import Vue from 'vue'
import App from './App.vue'
import router from "./router";
// 时间格式化过滤器
import moment from 'moment';
Vue.filter('dateFormat',(dateStr,pattern = 'YYYY-DD-MM HH:mm:ss')=>{
    return moment(dateStr).format(pattern)
})

// 导入进度条插件
import NProgress from './components/EnterLoging.vue';
import loading from './components/loding.vue';

// vue vant 组件
// import Vant from 'vant';
import 'vant/lib/index.css'
import {Tabbar, TabbarItem} from 'vant';

Vue.use(Tabbar).use(TabbarItem);
import {Field} from 'vant';
import { Loading } from 'vant';
Vue.use(Loading);
Vue.use(Field);
import {Button} from 'vant';

Vue.use(Button);

Vue.use(Swipe).use(SwipeItem);
import { Cell, CellGroup,Search,Icon,Swipe, SwipeItem,Tab, Tabs,Checkbox, CheckboxGroup,Lazyload,Toast,Overlay,Radio,RadioGroup,Badge} from 'vant';
Vue.use(Cell).use(CellGroup).use(Search).use(Icon).use(Swipe).use(SwipeItem).use(Tab).use(Tabs).use(Checkbox).use(CheckboxGroup).use(Lazyload).use(Toast).use(Badge);
import { Popup,Dialog,showConfirmDialog} from 'vant';
 
Vue.use(Popup).use(Dialog);
import { PasswordInput, NumberKeyboard,TreeSelect  } from 'vant';

Vue.use(PasswordInput).use(NumberKeyboard).use(TreeSelect);
import { Uploader } from 'vant';
Vue.use(Uploader);
import { Stepper } from 'vant';
Vue.use(Stepper);
import { DatetimePicker } from 'vant';
Vue.use(DatetimePicker);
Vue.use(Popup).use(Overlay).use(Radio).use(RadioGroup);
import {
    GoodsAction,
    GoodsActionBigBtn,
    GoodsActionMiniBtn
} from 'vant';

Vue
    .use(GoodsAction)
    .use(GoodsActionBigBtn)
    .use(GoodsActionMiniBtn);
import { AddressList } from 'vant';

Vue.use(AddressList);
import { Switch } from 'vant';

Vue.use(Switch);
import { NoticeBar } from 'vant';

Vue.use(NoticeBar);
//vant 组件结束

import ReturnBack from '../src/components/ReturnBack.vue'

Vue.component("ReturnBack",ReturnBack)
// ASCLL 和 md5
import * as utils from './utils'

Vue.prototype.$utils = utils;
// vuex
import store from './store/index';

Vue.config.productionTip = false

Vue.component('NProgress', NProgress);
Vue.component('loading', loading);

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
