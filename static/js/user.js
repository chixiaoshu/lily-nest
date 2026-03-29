// 1. 滚动显现动画
(() => {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(ent => {
            if (ent.isIntersecting) ent.target.classList.add('in');
            else ent.target.classList.remove('in');
        });
    }, { threshold: 0.1 });

    // 等待 DOM 加载完成后再查找元素
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    });
})();

// 2. 健康检查功能
async function checkHealth() {
    const statusBg = document.querySelector('.avatar-status-bg');
    if (!statusBg) return;

    // 设置为加载状态
    statusBg.className = 'avatar-status-bg loading';

    try {
        // 请求健康检查接口
        const response = await fetch('/api/v1/health', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // 设置超时时间为 5 秒
            signal: AbortSignal.timeout(5000)
        });

        if (response.ok) {
            const data = await response.json();
            // 检查返回的 status 是否为 "ok"
            if (data.status === 'ok') {
                statusBg.className = 'avatar-status-bg healthy';
            } else {
                statusBg.className = 'avatar-status-bg unhealthy';
            }
        } else {
            // HTTP 状态码不是 200
            statusBg.className = 'avatar-status-bg unhealthy';
        }
    } catch (error) {
        // 网络错误或超时
        console.error('Health check failed:', error);
        statusBg.className = 'avatar-status-bg unhealthy';
    }
}

// 页面加载完成后执行健康检查
document.addEventListener('DOMContentLoaded', () => {
    checkHealth();

    // 每隔 60 秒重新检查一次
    setInterval(checkHealth, 60000);
});