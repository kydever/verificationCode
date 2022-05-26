// 样式引入.
import './verification.css';

class verificationCode {
  constructor(el, _params) {
    // params
    this.params = {
      getUrl: _params.getUrl,
      postUrl: _params.postUrl,
      bgWidth: _params.bgWidth || 1125,
      bgHeight: _params.bgHeight || 702,
      Api: _params.api, // 请求
      shotWidth: _params.shotWidth || 200,
      shotHeight: _params.shotHeight || 200,
    };
    // 校验时间.
    this.durationTime = 0;

    // 单位换算- 300是验证码背景图展示宽度.
    this.unitSize = this.params.bgWidth / 300;
    // 根节点
    this.el = document.getElementById(el);
    this.el.style = `width: 324px;`;
    // 绑定监听事件对象。
    this.temp = {};

    console.log(this.unitSize, 'unitSize');
    // 验证码背景大小
    this.drag = {
      x: 0, // X轴坐标.
      y: 0, // Y轴坐标.
      id: '', // 验证码ID
    };
    // 校验通过返回id
    this.verification_code = '';
    this.innerHTMLElement();
  }
  // 初始化Dom节点
  innerHTMLElement() {
    const temp = `
      <div class="code-cntr">
        <div class="code-tips">拖动下方滑块完成拼图</div>
        <div class="code-box">
          <div class="code-background"></div>
          <div class="code-screenshot"></div>
          <div class="code-success">
            <div class="code-success-icon"></div>
            <div class="code-success-title"></div>
          </div>
        </div>
        <div class="code-drag">
            <div class="code-left"></div>
            <div class="code-range-before"></div>
            <input type="range" class="code-range" value="0">
          </div>
        <div class="code-btn-cntr">
          <div class="code-again" title="重试"></div>
          <div class="code-closed" title="关闭"></div>
        </div>
      </div>
    `;
    this.el.innerHTML = temp;
    // 节点获取.
    this.temp = {
      box: document.querySelector('.code-background'), // 背景图
      gap: document.querySelector('.code-screenshot'), // 验证图
      left: document.querySelector('.code-left'), // 左侧拖动进度条
      ipt: document.querySelector('.code-range'), // input range
      btn: document.querySelector('.code-again'), // 重试按钮
      closed: document.querySelector('.code-closed'), // 重试按钮
      success: document.querySelector('.code-success'), // 重试按钮
      icon: document.querySelector('.code-success-icon'),
      title: document.querySelector('.code-success-title'),
    };
    const { box, gap, left, ipt, btn, closed } = this.temp;
    // 获取容器的宽度.
    this.boxWidth = parseInt(window.getComputedStyle(box, null)['width']);
    //获取滑块的宽度.
    this.gapWidth = parseInt(window.getComputedStyle(gap, null)['width']);

    // 绑定关闭按钮.
    closed.addEventListener('click', () => {
      this.el.style.display = 'none';
    });

    // 绑定重试按钮
    btn.addEventListener('click', () => {
      ipt.value = 0;
      ipt.disabled = false;
      gap.style.left = '13px';
      left.style.width = '52px';
      this.getCaptureInfo();
      this.temp.success.style.opacity = 0;
      this.temp.icon.style.backgroundImage = '';
    });

    // 图片位置实时移动
    ipt.addEventListener('input', () => {
      const width = ((this.boxWidth - this.gapWidth) * ipt.value) / 100;
      gap.style.left = width + 12 + 'px';
      left.style.width = width + 54 + 'px';
      if (!this.durationTime) {
        this.durationTime = new Date().getTime();
        console.log(this.durationTime, 'durationTime');
      }
    });
    // 图片拖动结束.
    ipt.addEventListener('change', () => {
      ipt.disabled = true;
      // 获取截图当前坐标
      var gap_ps = this.getElementPagePosition(gap);
      // 获取背景图坐标
      var box_ps = this.getElementPagePosition(box);
      // 获取当前坐标x
      this.drag.x = gap_ps.x - box_ps.x;
      console.log('当前坐标ps:', gap_ps, box_ps);
      // 请求验证码
      this.sumbitReq();
    });

    // 获取验证码信息
    this.getCaptureInfo();
  }
  // 触发请求.
  sumbitReq() {
    var params = Object.assign(
      {},
      {
        ...this.drag,
        x: this.drag.x * this.unitSize,
      }
    );
    this.params.Api.post(this.params.postUrl, params).then((response) => {
      // 请求成功
      const { status, result } = response.data;
      if (status == 'success') {
        this.verification_code = result.code;
        this.closed();
      } else {
        this.temp.success.style.opacity = 1;
        const img =
          'https://cdn-public.knowyourself.cc/kyapp_vest_post/2022/05/26/09c0cc1b42e74a46ae4852baf5ad5ae2---88x88.png';
        this.temp.icon.style.backgroundImage = `url("${img}")`;
        this.temp.title.innerHTML = JSON.stringify(result.error_msg);
      }
    });
  }

  // 关闭
  closed() {
    // 提示
    this.temp.success.style.opacity = 1;
    const curTime = new Date().getTime();
    const duration_time = (curTime - this.durationTime) / 1000;
    this.temp.title.innerHTML = `只用了${duration_time.toFixed(1)}秒，简直比闪电还快`;
    // 清除节点.
    setTimeout(() => {
      this.el.innerHTML = '';
      this.durationTime = 0;
    }, 1 * 1000);
  }

  // 获取验证码信息
  getCaptureInfo() {
    this.params.Api.get(this.params.getUrl).then((response) => {
      const { status, result } = response.data;
      if (status == 'success') {
        this.drag.id = result.id; // 验证码
        this.drag.y = result.y; //纵向坐标周
        // 背景图
        this.temp.box.style.backgroundImage = 'url(' + result.bg + ')';
        // 验证码截图.
        this.temp.gap.style.backgroundImage = 'url(' + result.dg + ')';
        this.temp.box.style.width = Math.ceil(this.params.bgWidth / this.unitSize) + 'px';
        this.temp.box.style.height = Math.ceil(this.params.bgHeight / this.unitSize) + 'px';
        // 验证码截图样式设置.
        this.temp.gap.style.width = Math.ceil(this.params.shotWidth / this.unitSize) + 'px';
        this.temp.gap.style.height = Math.ceil(this.params.shotHeight / this.unitSize) + 'px';
        this.temp.gap.style.top = Math.ceil(result.y / this.unitSize) + 'px';
      } else {
        alert('请求验证码失败～');
      }
    });
  }

  // 获取坐标
  getElementPagePosition(element) {
    //计算x坐标
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;
    while (current !== null) {
      actualLeft += current.offsetLeft;
      current = current.offsetParent;
    }
    //计算y坐标
    var actualTop = element.offsetTop;
    var currentY = element.offsetParent;
    while (currentY !== null) {
      actualTop += currentY.offsetTop + currentY.clientTop;
      currentY = currentY.offsetParent;
    }
    //返回结果
    return { x: actualLeft, y: actualTop };
  }
}

export default verificationCode;
