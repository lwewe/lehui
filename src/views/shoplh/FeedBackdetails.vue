<template>
  <div class="feedback-container">
    <!-- 反馈类型（根据路由id动态显示） -->
    <div class="feedback-type">
      <div>
        <img :src="feedbackInfo.img || defaultImg" alt="" class="lfimg"></img>
      </div>
      <div>
        <div class="type-title">{{ feedbackInfo.title || '' }}</div>
        <div class="type-desc">{{ feedbackInfo.content || '' }}</div>
      </div>
    </div>

    <!-- 问题与意见 -->
    <div class="feedback-content">
      <div class="section-title">问题与意见</div>
      <p class="hint-text">请详细描述您的问题，以便我们为您提供更好的帮助</p>

      <!-- 文本输入区 -->
      <textarea v-model="feedbackText" class="feedback-textarea" placeholder="请输入您的具体问题和建议..." maxlength="200"
        rows="5"></textarea>
      <div class="text-count">{{ feedbackText.length }}/200</div>

      <!-- 图片上传 -->
      <div class="upload-section">
        <div class="upload-title">
          提供相关的图片（选填）
          <span class="upload-limit">最多4张</span>
        </div>
        <p class="hint-text">上传【有效图片】可以让问题能更好的被解决</p>

        <div class="upload-images">
          <!-- 已上传的图片 -->
          <div v-for="(image, index) in uploadedImages" :key="index" class="image-item">
            <img :src="image.url" alt="反馈图片" />
            <div class="image-actions">
              <span class="delete-btn" @click="removeImage(index)">×</span>
            </div>
          </div>

          <!-- 上传按钮 -->
          <div v-if="uploadedImages.length < 4" class="upload-btn" @click="triggerFileInput">
            <div class="upload-icon">+</div>
            <div class="upload-text">上传图片</div>
            <input ref="fileInput" type="file" accept="image/*" multiple style="display: none"
              @change="handleImageUpload" />
          </div>
        </div>
      </div>
    </div>

    <!-- 提交按钮 -->
    <div class="submit-btn" :class="{ 'disabled': !canSubmit }" @click="submitFeedback">
      提交
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant';
import { feedback, feedbackClass } from "@/api/lhjdtm";

export default {
  name: 'FeedbackForm',
  data() {
    return {
      defaultImg: '', // 默认图片（可以是后端返回的默认分类图标，或留空）
      feedbackInfo: {}, // 当前反馈分类信息
      feedbackText: '',
      uploadedImages: [], // 存储上传的图片（本地预览）
      maxImages: 4, 
      ids: '', 
      token: "",
      imgList: [],        // 存储上传成功的图片路径
    }
  },
  computed: {
    canSubmit() {
      return this.feedbackText.trim().length > 0
    }
  },
  created() {
    this.token = localStorage.getItem("token")
    this.ids = this.$route.query.id || '9' // 默认分类ID为9（其他）

    // 1. 调用获取反馈分类接口
    this.getFeedbackClass()
  },
  methods: {
    // 获取反馈分类信息
    getFeedbackClass() {
      feedbackClass().then(res => {
        if (res.code == 200) {
          // 2. 从返回的数组中，找到当前 id 对应的分类
          let currentType = (res.data || []).find(item => item.id == this.ids)
          if (currentType) {
            this.feedbackInfo = currentType
            // 如果分类有图片，就用分类图片，否则用默认图
            this.defaultImg = currentType.img || ''
          } else {
            // 找不到就默认显示第一条（或者写个默认）
            this.feedbackInfo = (res.data || [])[0] || {}
            this.defaultImg = this.feedbackInfo.img || ''
          }
        }
      })
    },

    // 触发文件选择
    triggerFileInput() {
      this.$refs.fileInput.click()
    },

    // 处理图片上传
    handleImageUpload(event) {
      const files = event.target.files
      const remainingSlots = this.maxImages - this.uploadedImages.length

      if (files.length > remainingSlots) {
        Toast(`最多只能上传${this.maxImages}张图片`)
        return
      }

      // 处理每个文件
      for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
        const file = files[i]

        if (!file.type.startsWith('image/')) {
          Toast('请上传图片文件')
          continue
        }

        if (file.size > 5 * 1024 * 1024) {
          Toast('图片大小不能超过5MB')
          continue
        }

        // 预览图片
        this.previewImage(file)

        // 这里为了简化，你可以将 `imgList` 存为本地文件对象
        // 实际项目中需要将其上传到服务器，获取URL
        // 这里我们假设直接把图片路径存入 imgList
        this.imgList.push(file) // 此处需要改为真实上传后的URL
      }

      // 重置文件输入
      event.target.value = ''
    },

    // 预览图片
    previewImage(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.uploadedImages.push({
          file: file,
          url: e.target.result
        })
      }
      reader.readAsDataURL(file)
    },

    // 移除图片
    removeImage(index) {
      this.uploadedImages.splice(index, 1)
      this.imgList.splice(index, 1)
    },

    // 提交反馈
    async submitFeedback() {
      if (!this.canSubmit) {
        Toast('请输入反馈内容')
        return
      }

      try {
        // 1. 组装图片路径，多张用 | 分隔
        let imgStr = ''
        if (this.imgList.length > 0) {
          // 实际项目中，这些图片应该是在选择后立即上传，然后拿到URL，再拼接
          // 这里假设已经上传拿到了URL，并用 | 分隔
          imgStr = this.imgList.join('|')
        }

        // 2. 调用最新接口 /jdtmshop/feedback
        feedback({
          pid: this.ids,                // 分类ID，默认9(其他)
          content: this.feedbackText.trim(), // 反馈内容
          img: imgStr                   // 图片地址，多张用|分隔
        }).then(res => {
          if (res.code == 200) {
            Toast.success('提交成功！感谢您的建议')
            setTimeout(() => {
              this.$router.go(-1)
            }, 1500)
            // 重置表单
            this.resetForm()
          } else {
            Toast.fail(res.msg || '提交失败')
          }
        }).catch(err => {
          Toast.fail('提交失败，请稍后重试')
        })
      } catch (error) {
        console.error('提交失败:', error)
        Toast.fail('提交失败，请稍后重试')
      }
    },

    // 重置表单
    resetForm() {
      this.feedbackText = ''
      this.uploadedImages = []
      this.imgList = []
    }
  }
}
</script>

<style lang="less">
.my-toast-center {
  text-align: center !important;

  .van-toast__text {
    text-align: center !important;
    display: block !important;
    width: 100% !important;
  }
}
</style>
<style scoped lang="less">
.feedback-container {
  padding: 16px;
  background: #f5f5f5;
  min-height: 100vh;
}

.feedback-type {
  display: flex;
  background: white;
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 12px;

  .type-title {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
  }

  .type-desc {
    font-size: 12px;
    color: #666;
    line-height: 1.4;
  }
}

.feedback-content {
  background: white;
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.hint-text {
  font-size: 12px;
  color: #999;
  margin-bottom: 12px;
  line-height: 1.4;
}

.feedback-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 12px;
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #409eff;
  }
}

.text-count {
  text-align: right;
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.upload-section {
  margin-top: 20px;
}

.upload-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .upload-limit {
    font-size: 12px;
    color: #999;
    font-weight: normal;
  }
}

.upload-images {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}

.lfimg {
  width: 40px;
  margin-right: 10px;
}

.image-item {
  width: 73px;
  height: 73px;
  border-radius: 6px;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-actions {
    position: absolute;
    top: 2px;
    right: 2px;

    .delete-btn {
      width: 20px;
      height: 20px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      cursor: pointer;

      &:hover {
        background: rgba(0, 0, 0, 0.9);
      }
    }
  }
}

.upload-btn {
  width: 80px;
  height: 80px;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #409eff;
    color: #409eff;
  }

  .upload-icon {
    font-size: 24px;
    color: #999;
    margin-bottom: 4px;
  }

  .upload-text {
    font-size: 12px;
    color: #999;
  }
}

.submit-btn {
  background: linear-gradient(to bottom, #4896FF, #4896FF);
  color: white;
  font-size: 14px;
  text-align: center;
  padding: 14px;
  border-radius: 8px;
  margin-top: 20px;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.9;
  }

  &.disabled {
    background: #ccc;
    cursor: not-allowed;

    &:hover {
      opacity: 1;
    }
  }
}

// 响应式设计
@media (max-width: 375px) {

  .image-item,
  .upload-btn {
    width: 70px;
    height: 70px;
  }
}
</style>