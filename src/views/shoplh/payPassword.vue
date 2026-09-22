<template>
  <div class="password-page">
    <div class="back" @click="goBack">
      <van-icon name="arrow-left" size="20" />
    </div>

    <div class="title">{{ isSet ? '修改支付密码' : '设置支付密码' }}</div>

    <!-- 已设置过密码，必须输入旧密码  v-if="isSet"-->
    <div class="input-box" v-if="isSet">
      <div class="label">原支付密码</div>
      <input type="password" maxlength="6" inputmode="numeric" v-model="old_pwd" placeholder="请输入原6位支付密码" />
    </div>

    <!-- 新密码 -->
    <div class="input-box">
      <div class="label">新支付密码</div>
      <input type="password" maxlength="6" inputmode="numeric" v-model="pay_pwd" placeholder="请输入新6位支付密码" />
    </div>

    <!-- 确认密码 -->
    <div class="input-box">
      <div class="label">确认支付密码</div>
      <input type="password" maxlength="6" inputmode="numeric" v-model="confirm_pwd" placeholder="请再次输入新6位支付密码" />
    </div>

    <div class="submit-btn" @click="submit">确认提交</div>
  </div>
</template>

<script>
import { setPayPwd, userInfo } from "@/api/lhjdtm";

export default {
  name: "SetPayPwd",
  data() {
    return {
      isSet: false,       // 是否已设置支付密码
      old_pwd: "",        // 原支付密码
      pay_pwd: "",        // 新支付密码
      confirm_pwd: ""     // 确认新支付密码
    }
  },
  created() {
    this.checkPayPwdStatus()
  },
  methods: {
    // 检查是否已设置支付密码
    checkPayPwdStatus() {
      userInfo().then(res => {
        if (res.code == 200) {
          if (res.data && res.data.has_pay_pwd == 1) {
            this.isSet = true
            localStorage.setItem('has_pay_pwd', '1')
          } else {
            this.isSet = false
            localStorage.removeItem('has_pay_pwd')
          }
        }
      })
    },

    // 提交
    submit() {
      // 1. 修改场景：先校验原密码
      if (this.isSet && (!this.old_pwd || this.old_pwd.length != 6)) {
        this.$toast("请输入6位原支付密码")
        return
      }
      // 2. 新密码格式：6位数字
      if (!/^\d{6}$/.test(this.pay_pwd)) {
        this.$toast("请输入6位数字新支付密码")
        return
      }
      // 3. 两次输入一致
      if (this.pay_pwd !== this.confirm_pwd) {
        this.$toast("两次输入的密码不一致")
        return
      }

      // 组装参数
      let params = {
        pay_pwd: this.pay_pwd
      }
      // 已设置过密码，必须带 old_pwd
      if (this.isSet) {
        params.old_pwd = this.old_pwd
      }

      // 调用接口
      setPayPwd(params).then(res => {
        if (res.code == 200) {
          this.$toast(res.msg || '设置成功')
          // 写入本地标记
          localStorage.setItem('has_pay_pwd', '1')

          setTimeout(() => {
            if (this.$route.query.from === 'confirm') {
              this.$router.replace({
                path: '/confirmOrder',
                query: { data: sessionStorage.getItem('confirmOrderData') || '{}' }
              })
            } else {
              this.$router.go(-1)
            }
          }, 1000)
        } else {
          this.$toast(res.msg || '设置失败')
        }
      })
    },

    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="less">
.password-page {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 20px 16px;
  box-sizing: border-box;
}

.back {
  width: 30px;
  height: 30px;
  cursor: pointer;
  margin-bottom: 20px;
}

.title {
  font-size: 16px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 30px;
  color: #333;
}

.input-box {
  background-color: #fff;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;

  .label {
    font-size: 14px;
    color: #333;
    width: 100px;
    flex-shrink: 0;
  }

  input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 12px;
  }
}

.submit-btn {
  background: linear-gradient(90deg, #FF7675, #DA0200);
  color: #fff;
  border-radius: 30px;
  text-align: center;
  height: 45px;
  line-height: 45px;
  font-size: 14px;
  margin-top: 30px;
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }
}
</style>