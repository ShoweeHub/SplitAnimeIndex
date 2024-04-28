// 背后大头的数量
const IMG_COUNT = 30;
// 移动时背后大头移动的距离系数
const FACTOR = 0.1;

let mousedown = false;
let touchStart = false;
let windowWidth = document.documentElement.clientWidth;
let windowHeight = document.documentElement.clientHeight;
let ori = windowWidth > windowHeight ? "landscape" : "portrait";

const clamp = (min, val, max) => {
    if (min > val) return min;
    if (max < val) return max;
    return val;
};

document.addEventListener("DOMContentLoaded", function () {
    const scene = document.getElementById("scene");
    const resetBtn = document.getElementById("reset");

    // 创建 IMG_COUNT 个守一大头
    Array.from({ length: IMG_COUNT }, () => {
        const img = document.createElement("img");
        img.src = "favicon.png";
        img.classList.add("avatar");
        scene.appendChild(img);
    });

    // 处理鼠标或手指移动
    const parseMove = (client) => {
        const { clientX, clientY } = client;
        const { windowSize, clientSize } =
            ori === "landscape"
                ? { windowSize: windowWidth, clientSize: clientX }
                : { windowSize: windowHeight, clientSize: clientY };

        const delta = Math.min(clientSize - windowSize / 2, 0);
        const position = clamp(0, clientSize, windowSize);

        handle.style = `--position: ${position}px`;

        // 上下移动还是左右移动，设置的样式名称不同
        if (ori === "landscape") {
            top.style.width = `${position}px`;
            top.style.height = "100%";

            scene.childNodes.forEach((node, index) => {
                node.style.transform = `translate3d(${Math.max(
                    0,
                    -delta * (IMG_COUNT - index) * FACTOR
                )}px, 0, 0)`;
            });
        } else {
            top.style.height = `${position}px`;
            top.style.width = "100%";

            scene.childNodes.forEach((node, index) => {
                node.style.transform = `translate3d(0, ${Math.max(
                    0,
                    -delta * (IMG_COUNT - index) * FACTOR
                )}px, 0)`;
            });
        }
    };

    // 重置分割线与按钮位置
    const reset = () => {
        parseMove({ clientX: windowWidth / 2, clientY: windowHeight / 2 });
        resetBtn.style.bottom = "0";
    };
    resetBtn.addEventListener("click", reset);

    const top = document.getElementById("top");
    const handle = document.getElementById("handle");

    // 鼠标拖拽
    handle.addEventListener("mousedown", () => (mousedown = true));
    handle.addEventListener("mouseup", () => (mousedown = false));
    window.addEventListener("mousemove", (e) => {
        if (!mousedown) return;
        // 分割线有移动，展示重置按钮
        resetBtn.style.bottom = "calc(5% + 4rem)";
        parseMove(e);
    });

    // 手指拖拽
    handle.addEventListener("touchstart", () => (touchStart = true));
    handle.addEventListener("touchend", () => (touchStart = false));
    window.addEventListener("touchmove", (e) => {
        if (!touchStart) return;
        // 分割线有移动，展示重置按钮
        resetBtn.style.bottom = "calc(5% + 4rem)";
        parseMove(e.touches[0]);
    });

    // 页面大小变化时重新计算宽高和方向，并重置状态
    window.addEventListener("resize", () => {
        windowWidth = document.documentElement.clientWidth;
        windowHeight = document.documentElement.clientHeight;
        ori = windowWidth > windowHeight ? "landscape" : "portrait";
        reset();
    });
});
