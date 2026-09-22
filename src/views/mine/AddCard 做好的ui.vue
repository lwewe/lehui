<template>
  <div class="conPage">
    
    <!-- 1. 顶部卡片区域（有卡时显示） -->
    <div class="card-section" v-if="hasCard">
      <div class="black-card">
        <!-- 背景装饰图案（模拟截图中的隐约logo） -->
        <div class="card-bg-pattern"></div>
        
        <!-- 卡片上半部分 -->
        <div class="card-top">
          <div class="card-title-group">
            <div class="card-name">乐汇卡</div>
            <div class="card-number">YL20220650635</div>
          </div>
          <div class="use-btn">
            立即使用 <span class="arrow">›</span>
          </div>
        </div>

        <!-- 卡片下半部分 -->
        <div class="card-bottom">
          <div class="info-item">
            <div class="label">余额（点）</div>
            <div class="value">100</div>
          </div>
          <div class="info-item">
            <div class="label">有效期</div>
            <div class="value">2026-12-13</div>
          </div>
          <div class="right-link"  @click="RightsRecord()">查看权益 ›</div>
        </div>
      </div>
    </div>

    <!-- 1.1 顶部空状态区域（无卡时显示） -->
    <div class="empty-state" v-else>
      <img src="../../assets/lh/no-1.png" alt="暂无卡券" class="card-img" />
      <div class="empty-text">您暂无绑定卡券</div>
    </div>

    <!-- 2. 标题 -->
   

    <!-- 3. 表单区域 -->
    <div class="form-section">
      <div class="form-item">
        <span class="label">卡号</span>
        <div class="input-wrapper">
          <input type="text" placeholder="请输入卡号" v-model="form.cardNo" />
          <div class="scan-btn" @click="scanQRCode">
            <img class="img" src="http://yxfmm.bjyxfl.com/imgs/add/sys.png" alt="" style="width: 20px;"><span>扫一扫</span> 
          </div>
        </div>
      </div>

      <div class="form-item">
        <span class="label">密码</span>
        <div class="input-wrapper">
          <input type="password" placeholder="请输入密码" v-model="form.password" />
        </div>
      </div>
    </div>

    <!-- 4. 温馨提示区域 -->
    <div class="notice-section">
      <div class="notice-title">温馨提示</div>
      <ul class="notice-list">
        <li>请在卡/券有效期内完成绑定使用，过期后不支持绑定和使用！</li>
        <li>绑定后卡/券不支持解绑！</li>
        <li>此卡/券不记名、不挂失、不提供发票信息，丢失后不可补办！</li>
        <li>兑换商品后，可登录查询订单状态和物流信息！</li>
        <li>客服电话：400-996-5938（9:00-21:00）</li>
      </ul>
    </div>

    <!-- 5. 底部操作区域 -->
    <div class="footer-section">
      <div class="agreement-box" @click="toggleAgree">
        <div class="radio-circle" :class="{ active: isAgree }"></div>
        <span>同意绑卡</span>
      </div>

      <button class="bind-btn" @click="handleBind">
        绑定新卡
      </button>
    </div>
  </div>
</template>

<script>
// import { getSetting } from "@/api/mine"; // 按需保留你的接口

export default {
  name: "AddCard",
  data() {
    return {
      // 控制顶部显示“有卡”还是“无卡”
      hasCard: true, // true: 显示黑金卡, false: 显示暂无卡券
      
      form: {
        cardNo: '',
        password: ''
      },
      isAgree: false // 是否同意绑卡
    }
  },
  methods: {
    RightsRecord(){
      this.$router.push({ path: "/RightsRecord" })
    },
    // 模拟扫一扫功能
    handleScan() {
      alert("唤起扫一扫功能");
    },
      scanQRCode() {
      let _that = this;
      wx.ready(function () {
        wx.checkJsApi({
          jsApiList: ['scanQRCode'],
          success: function (res) {
            if (res.checkResult.scanQRCode === true) {
              wx.scanQRCode({ // 微信扫一扫接口
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                  let url = res.resultStr // 当needResult 为 1 时，扫码返回的结果
                  let token = localStorage.getItem("token")
                  qrcodeBinging({
                    token,
                    content: url
                  }).then(res => {
                    if (res.code == 200) {
                      setTimeout(() => {
                        _that.$router.go(-1)
                        _that.$toast(res.data)
                      }, 1000)
                    } else {
                      _that.$toast(res.msg)
                    }
                  })
                }
              })
            } else {
              _that.$toast("抱歉，当前客户端版本不支持扫一扫");
            }
          },
          fail: function (res) { // 检测getNetworkType该功能失败时处理
            _that.$toast('fail' + res)
          }
        });
      });
      //错误信息
      wx.error(function (res) {
        _that.$toast("出错了：" + res.errMsg);
      });
    },
    // 切换同意状态
    toggleAgree() {
      this.isAgree = !this.isAgree;
    },
    // 提交绑定
    handleBind() {
      if (!this.form.cardNo) {
        this.$toast('请输入卡号');
        return;
      }
      if (!this.form.password) {
        this.$toast('请输入密码');
        return;
      }
      if (!this.isAgree) {
        this.$toast('请先同意绑卡协议');
        return;
      }
      
      console.log('提交绑定', this.form);
      this.$toast('绑定成功');
    }
  },
  created() {
    // 实际业务中这里调用接口获取用户是否已有卡
    // this.hasCard = true/false; 
  }
}
</script>

<style scoped lang="less">
.conPage {
  padding: 20px;
  background-color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  min-height: 100vh;
}

/* ================= 1. 黑金卡卡片 ================= */
.card-section {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.black-card {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 120px;
  background: linear-gradient(135deg, #1a1a1a, #333333);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden; /* 确保背景图案不溢出 */
  color: #fff;

  // 背景隐约水印
  .card-bg-pattern {
    position: absolute;
    right: -20px;
    top: 50%;
    transform: translateY(-50%);
    width: 120px;
    height: 120px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    border: 10px solid rgba(255, 255, 255, 0.03);
    pointer-events: none;
  }

  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    z-index: 2;

    .card-title-group {
      .card-name {
        font-size: 18px;
        font-weight: 500;
        letter-spacing: 1px;
        margin-bottom: 4px;
      }
      .card-number {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }
    }

    .use-btn {
      background: #f0d098; // 香槟金色
      color: #1a1a1a;
      font-size: 12px;
      padding: 6px 14px;
      border-radius: 20px;
      font-weight: 500;
      display: flex;
      align-items: center;
      cursor: pointer;
      
      .arrow {
        margin-left: 4px;
        font-size: 14px;
        line-height: 1;
      }
    }
  }

  .card-bottom {
    display: flex;
    align-items: flex-end;
    z-index: 2;

    .info-item {
      margin-right: 40px;
      .label {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.5);
        margin-bottom: 2px;
      }
      .value {
        font-size: 16px;
        font-weight: 500;
      }
    }
    
    .right-link {
      margin-left: auto;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      
      &:hover {
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }
}

/* ================= 1.1 空状态 ================= */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0 20px 0;
  
  .card-img {
    width: 120px;
    height: auto;
    margin-bottom: 10px;
    opacity: 0.8;
  }
  .empty-text {
    color: #999;
    font-size: 14px;
  }
}

/* ================= 2. 标题 ================= */
.main-title {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #d4880f; // 橙金色
  margin: 10px 0 30px 0;
}

/* ================= 3. 表单区域 ================= */
.form-section {
  .form-item {
    display: flex;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid #f5f5f5;
    
    .label {
      width: 60px;
      color: #333;
      font-size: 15px;
      font-weight: 500;
    }
    
    .input-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 14px;
        color: #333;
        background: transparent;
        padding-right: 10px;
        
        &::placeholder {
          color: #ccc;
        }
      }
      
      .scan-btn {
        display: flex;
        align-items: center;
        color: #e69630;
        font-size: 14px;
        cursor: pointer;
        padding: 5px 0;
        
        .scan-icon {
          margin-right: 4px;
          font-size: 16px;
        }
      }
    }
  }
}

/* ================= 4. 温馨提示 ================= */
.notice-section {
  margin-top: 30px;
  
  .notice-title {
    font-size: 14px;
    color: #333;
    font-weight: bold;
    margin-bottom: 12px;
  }
  
  .notice-list {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      position: relative;
      padding-left: 14px;
      font-size: 13px;
      color: #999;
      line-height: 1.8;
      margin-bottom: 4px;
      
      &::before {
        content: "·";
        position: absolute;
        left: 0;
        top: 0;
        color: #b3b3b3;
        font-size: 20px;
        line-height: 1.6;
      }
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

/* ================= 5. 底部操作 ================= */
.footer-section {
  margin-top: 40px;
  
  .agreement-box {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    cursor: pointer;
    
    .radio-circle {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 1px solid #ccc;
      margin-right: 10px;
      position: relative;
      
      &.active {
        border-color: #ff6b35;
        background-color: #ff6b35;
        
        &::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 6px;
          height: 6px;
          background: #fff;
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
    
    span {
      font-size: 14px;
      color: #333;
    }
  }
  
  .bind-btn {
    width: 100%;
    height: 48px;
    border: none;
    border-radius: 24px;
    background: linear-gradient(90deg, #ff8c42, #ff5e3a);
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 1px;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(255, 94, 58, 0.3);
    
    &:active {
      opacity: 0.8;
      transform: scale(0.98);
    }
  }
}
</style>