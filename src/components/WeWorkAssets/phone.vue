<template>
  <div class="iphone-frame">
    <div class="message-wrap">
      <div class="message-item">
        <el-avatar shape="square" size="large" :src="require('@/assets/wework/avatar.png')" />
        <div class="message-info type-text">
          <div class="dec" />
          <div class="content-wrap">
            <pre>{{ _vm.form.content }}</pre>
          </div>
        </div>
      </div>

      <div v-for="(item, index) in _vm.attachmentList" :key="index" class="message-item">
        <el-avatar shape="square" size="large" :src="require('@/assets/wework/avatar.png')" />
        <div class="message-info" :class="'type-'+item.mediaType">
          <div class="content-wrap">
            <el-image v-if="item.mediaType === 'image'" fil="fil" :src="item.thum" class="img-pre" :preview-src-list="[item.thum]" />
            <div v-if="item.mediaType === 'video'" class="video-wrap">
              <div class="video-icon" />
              <el-image fil="fil" :src="item.thum" class="img-pre" />
            </div>
            <div v-if="item.mediaType === 'file'" class="file-wrap">
              <div class="left">
                <div class="name">{{ item.mediaFileName }}</div>
              </div>
              <div class="right">
                <i class="el-icon-document" />
              </div>
            </div>
            <div v-if="item.mediaType === 'link'" class="link-wrap">
              <div class="title">{{ item.title }}</div>
              <div class="detail">
                <div class="text">{{ item.desc }}</div>
                <div class="right">
                  <i class="el-icon-link" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['_vm']
}
</script>

<style lang="scss" scoped>
.iphone-frame {
  width: 375px;
  height: 667px;
  background: url('~@/assets/wework/preivew.png') no-repeat center center;
  background-size: contain;
  border-radius: 8px;
  position: relative;
  .message-wrap {
    display: flex;
    flex-direction: column;
    height: 500px;
    overflow-y: auto;
    padding: 0 12px 12px;
    position: absolute;
    top: 112px;
    width: 100%;
  }
  .message-item {
    display: flex;
    &:nth-child(n+1) {
      margin-top: 16px;
    }
    .message-info {
      background-color: #fff;
      border-radius: 5px;
      margin-left: 10px;
      max-width: 260px;
      padding: 12px;
      position: relative;
      .dec {
        border-color: #fff transparent transparent #fff;
        border-style: solid;
        border-width: 3px;
        height: 0;
        left: -3px;
        position: absolute;
        top: 20px;
        transform: rotate(-45deg);
        width: 5px;
      }
      &.type {
        &-image, &-video{
          background-color: transparent;
          max-height: 140px;
          max-width: 140px;
          padding: 0;
          .img-pre {
            border-radius: 5px;
            max-height: 140px;
            max-width: 140px;
          }
        }
        &-video {
          .video-wrap {
            border-radius: 5px;
            max-height: 100%;
            max-width: 100%;
            overflow: hidden;
            position: relative;
            .video-icon {
              background-image: url('~@/assets/wework/play.png');
              background-position: 50%;
              background-repeat: no-repeat;
              border-radius: 50%;
              height: 36px;
              left: 50%;
              position: absolute;
              top: 50%;
              transform: translate(-50%,-50%);
              width: 36px;
              z-index: 1;
            }
          }
        }
        &-file {
          width: 234px;
          .file-wrap {
            display: flex;
            justify-content: space-between;
            .left{
              width: 150px;
              padding-right: 5px;
              .name {
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                color: #494a4b;
                display: -webkit-box;
                font-size: 17px;
                font-weight: 500;
                line-height: 1;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
            .right {
              width: 60px;
              height: 60px;
              border-radius: 4px;
              background: #6CCBFF;
              font-size: 42px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #FFF;
            }
          }
        }
        &-link {
          height: 110px;
          width: 234px;
          .link-wrap {
            .title {
              color: #494a4b;
              font-size: 17px;
              font-weight: 500;
              line-height: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 210px;
            }
            .detail {
              display: flex;
              justify-content: space-between;
              margin-top: 10px;
              .text {
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                color: #7c7d7e;
                display: -webkit-box;
                font-size: 14px;
                line-height: 1.4;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
              }
              .right {
                margin-left: 10px;
                height: 50px;
                flex: 50px 0 0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 42px;
                color: #999;
              }
            }
          }
        }
      }
      &.type-text {
        color: #494a4b;
        font-size: 16px;
        font-weight: 500;
        max-width: 260px;
        pre {
          line-height: 22px;
          margin-bottom: 0;
          margin-top: 0;
          white-space: pre-wrap;
          font-size: 15px;
          font-weight: 400;
        }
        .content-wrap {
          height: 100%;
          position: relative;
        }
      }
    }
  }
}
</style>
