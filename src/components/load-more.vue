<template>
  <div class="load-more">
    <div class="load-more__track" :style="style" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd" @touchcancel="onTouchEnd">
      <div class="load-more__head">
        <slot v-if="status === 'normal'" name="normal" />
        <slot v-if="status === 'pulling'" name="pulling">
          <span :class="b('text')">{{ pullingText || '下拉加载' }}</span>
        </slot>
        <slot v-if="status === 'loosing'" name="loosing">
          <span :class="b('text')">{{ loosingText || '松开刷新' }}</span>
        </slot>
        <slot v-if="status === 'loading'" name="loading">
          <div :class="load-more__loading">
            <jc-loading color="black" inline/>
            <span>{{ loadingText || '正在加载' }}</span>
          </div>
        </slot>
      </div>
      <slot />
      <div :class="load-more__finished" v-if="finished">已无更多数据</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'load_more',
    props: {
      disabled: Boolean,
      pullingText: String,
      loosingText: String,
      loadingText: String,
      value: {
        type: Boolean,
        required: true
      },
      animationDuration: {
        type: Number,
        default: 300
      },
      headHeight: {
        type: Number,
        default: 50
      },
      bottomLoaded: Boolean,
      finish: Boolean
    },

    data() {
      return {
        status: 'normal',
        scrollT: 0,
        height: 0,
        duration: 1,
        finished: false
      };
    },
    computed: {
      style() {
        return {
          transition: `${this.duration}ms`,
          transform: `translate3d(0,${this.height}px, 0)`
        };
      },

      untouchable() {
        return this.status === 'loading' || this.disabled;
      }
    },

    mounted() {
      this.scrollEl = scrollUtils.getScrollEventTarget(this.$el);
      this.handler(true)
    },

    watch: {
      value(val) {
        this.duration = this.animationDuration;
        this.getStatus(val ? this.headHeight : 0, val);
      },
      bottomLoaded(v) {
        this.load = v
      },
      finish(v) {
        console.log(v)
        this.finished = v
      }
    },
    methods: {
      handler(bind) {
        if(this.binded !== bind) {
          this.binded = bind;
          (bind ? on : off)(this.scrollEl, 'scroll', this.loadmore);
        }
      },
      loadmore(e) {
        if(this.finished) return
        let height = scrollUtils.getVisibleHeight(this.scrollEl)
        let top = scrollUtils.getScrollTop(this.scrollEl)
        let all = this.scrollEl.scrollHeight
        if(top > this.scrollT && !this.load) {
          if(all - top - height <= 100) {
            this.$emit('loadmore')
          }
        }
        this.scrollT = top
      },
      onTouchStart(event) {
        if(this.untouchable) {
          return;
        }
        if(this.getCeiling()) {
          this.duration = 0;
          this.touchStart(event);
        }
      },

      onTouchMove(event) {
        if(this.untouchable) {
          return;
        }

        this.touchMove(event);

        if(!this.ceiling && this.getCeiling()) {
          this.duration = 0;
          this.startY = event.touches[0].clientY;
          this.deltaY = 0;
        }

        if(this.ceiling && this.deltaY >= 0) {
          if(this.direction === 'vertical') {
            this.getStatus(this.ease(this.deltaY));
            event.preventDefault();
          }
        }
      },

      onTouchEnd() {
        if(this.untouchable) {
          return;
        }

        if(this.ceiling && this.deltaY) {
          this.duration = this.animationDuration;
          if(this.status === 'loosing') {
            this.getStatus(this.headHeight, true);
            this.$emit('input', true);
            this.$emit('refresh');
          } else {
            this.getStatus(0);
          }
        }
      },

      getCeiling() {
        this.ceiling = scrollUtils.getScrollTop(this.scrollEl) === 0;
        return this.ceiling;
      },

      ease(height) {
        const {
          headHeight
        } = this;
        return height < headHeight ?
          height :
          height < headHeight * 2 ?
          Math.round(headHeight + (height - headHeight) / 2) :
          Math.round(headHeight * 1.5 + (height - headHeight * 2) / 4);
      },

      getStatus(height, isLoading) {
        this.height = height;

        const status = isLoading ?
          'loading' : height === 0 ?
          'normal' : height < this.headHeight ?
          'pulling' : 'loosing';

        if(status !== this.status) {
          this.status = status;
        }
      }
    },
    destroyed() {
      this.handler(false);
    },

    activated() {
      this.handler(true);
    },

    deactivated() {
      this.handler(false);
    },
  }
</script>
<style lang="scss">
  .load-more {
    user-select: none;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    &__track {
      position: relative;
    }
    &__head {
      width: 100%;
      height: 50px;
      left: 0;
      overflow: hidden;
      position: absolute;
      text-align: center;
      top: -50px;
      font-size: 14px;
      color: $global-color-darkgrey;
      line-height: 50px;
    }
    &__loading {
      .jc-loading {
        width: 16px;
        height: 16px;
        margin-right: 5px;
      }
      span,
      .jc-loading {
        vertical-align: middle;
        display: inline-block;
      }
    }
    &__text {
      display: block;
    }
    &__finished {
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 14px;
      color: #999;
    }
  }
</style>