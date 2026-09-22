<template>
  <div class="pageMax">
    <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack>
    <div style="margin-top: 20px">
      <div>
        <div class="title">卡号</div>
        <div class="inpBox">
          <input v-model="kahao" class="inp" type="text" placeholder="请输入卡号">
        </div>
      </div>
      <div style="margin-top: 15px">
        <div class="title">密码</div>
        <div class="inpBox">
          <input v-model="pass" class="inp" type="text" placeholder="请输入密码">
        </div>
      </div>
    </div>
    <div class="btn" @click="binding">绑定</div>
  </div>
</template>

<script>
// 注意：addbinding 需要从您的 lhcard.js 导入
import { AddBinding } from "@/api/lhcard";


export default {
  name: "CouponCode",
  data() {
    return {
      kahao: "", // 对应接口参数 kahao
      pass: ""   // 对应接口参数 pass
    }
  },
  methods: {
    binding() {
      if (this.kahao == "") {
        this.$toast("请输入卡号")
        return
      }
      if (this.pass == "") {
        this.$toast("请输入密码")
        return;
      }
      
      // 不再手动传 token，因为您的 setaxios.js 拦截器会自动拼装
      AddBinding({
        kahao: this.kahao,
        pass: this.pass
      }).then(res => {
        if (res.code == 200) {
          this.$toast("绑定成功")
          setTimeout(() => {
            // 绑定成功后，跳回福利卡管理页（通常需要刷新一下列表）
            this.$router.replace("/AddCard")
          }, 1000)
        } else {
          this.$toast(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
.pageMax {
  padding: 20px;
}

.title {
  font-weight: bold;
}

.inpBox {
  padding: 15px;
  background-color: #F0F0F0;
  border-radius: 8px;
  font-size: 15px;
  margin-top: 10px;
}

.inp {
  border: none;
  width: 100%;
  height: 100%;
  background-color: #F0F0F0;
}

.btn {
 background: linear-gradient( 90deg, #FF4A25 0%, #FEA345 100%);
  color: white;
  border-radius: 50px;
  text-align: center;
  padding: 8px 10px;
  font-size: 16px;
  letter-spacing: 2px;
  height: 28px;
  line-height: 28px;
  margin-top: 65px;
}
</style>