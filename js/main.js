/**
 * MINISPRIN Official Website - Main Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 初始化 Lucide 图标
    lucide.createIcons();

    // 2. Hero 区域粒子背景 (Canvas 实现)
    initHeroParticles();

    // 3. Play 区域粒子背景
    initPlayParticles();

    // 4. 实机演示系统逻辑
    initDemoSlider();

    // 5. 世界观 Boss 轮播
    initBossCarousel();

    // 6. 勇者小队折叠面板
    initTeamContacts();

    // 7. 导航栏与滚动逻辑
    initScrollLogic();

    // 8. 入场动画监听 (Intersection Observer)
    initEntranceAnimations();

    // 9. 时间轴 Tooltip
    initTimelineTooltip();

    // 10. 吉祥物交互
    initMascot();

    // 彩蛋弹窗关闭
    const modalClose = document.getElementById('modal-close');
    const secretModal = document.getElementById('secret-modal');
    if (modalClose && secretModal) {
        modalClose.addEventListener('click', () => {
            secretModal.style.display = 'none';
        });
    }
});

/**
 * Hero 区域动态粒子效果
 */
function initHeroParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let isVisible = true;
    let animationId = null;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.s = Math.random() * 2.5;
            this.o = Math.random() * 0.6;
            this.v = Math.random() * 0.2 + 0.1;
        }
        update() {
            this.y -= this.v;
            if (this.y < 0) this.reset();
        }
        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.o})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.s, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < 120; i++) particles.push(new Particle());
    }

    function animate() {
        if (!isVisible) {
            animationId = requestAnimationFrame(animate);
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        animationId = requestAnimationFrame(animate);
    }

    // Pause animation when hero is off-screen
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
        });
    }, { threshold: 0 });

    const heroSection = document.getElementById('hero');
    if (heroSection) heroObserver.observe(heroSection);

    window.addEventListener('resize', init);
    init();
    animate();
}

/**
 * Play 区域粒子效果
 */
function initPlayParticles() {
    const canvas = document.getElementById('play-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let isVisible = true;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.s = Math.random() * 2.5;
            this.o = Math.random() * 0.5;
            this.v = Math.random() * 0.15 + 0.05;
        }
        update() {
            this.y -= this.v;
            if (this.y < 0) this.reset();
        }
        draw() {
            ctx.fillStyle = `rgba(230, 57, 70, ${this.o})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.s, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < 80; i++) particles.push(new Particle());
    }

    function animate() {
        if (!isVisible) {
            requestAnimationFrame(animate);
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    const playObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
        });
    }, { threshold: 0 });

    const playSection = document.getElementById('play');
    if (playSection) playObserver.observe(playSection);

    window.addEventListener('resize', init);
    init();
    animate();
}

/**
 * 实机演示轮播逻辑
 */
function initDemoSlider() {
    const demoData = {
        combat: { t: "战斗系统", d: "通过控制角色左右移动发射弹幕来抵御不断靠近防线的敌人，击败敌人获得经验值，根据局势选择不同流派的技能来强化自身吧！" },
        upgrade: { t: "强化系统", d: "通过战斗获得金币，获得永久属性提升" },
        gacha: { t: "抽卡系统", d: "通过战斗和解锁成就获取稀有货币，抽取各种不同的道具吧！说不定下一个欧皇就是你～" },
        gallery: { t: "图鉴系统", d: "在这里查看已获取的道具信息，收集道具进度会带来属性加成" },
        achieve: { t: "成就系统", d: "随着游戏进程的不断推进会解锁各项成就，并获得奖励" }
    };

    let curCat = 'combat';
    let curIdx = 0;

    const screen = document.getElementById('phoneScreen');
    const dots = document.getElementById('dotIndicators');
    const title = document.getElementById('demoTitle');
    const desc = document.getElementById('demoDesc');
    const navItems = document.querySelectorAll('.demo-nav-item');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    function updateView() {
        // 更新文字
        title.innerText = demoData[curCat].t;
        desc.innerText = demoData[curCat].d;

        // 更新图片和圆点
        screen.innerHTML = '';
        dots.innerHTML = '';

        // 实机截图映射
        const demoImages = {
            combat: ['images/combat-1.png', 'images/combat-2.png', 'images/combat-3.png'],
            upgrade: ['images/upgrade-1.png', 'images/upgrade-2.png', null],
            gacha: ['images/gacha-1.png', 'images/gacha-2.png', null],
            gallery: ['images/gallery-1.png', 'images/gallery-2.png', null],
            achieve: ['images/achieve-1.png', 'images/achieve-2.png', null]
        };

        for (let i = 0; i < 3; i++) {
            const img = document.createElement('img');
            const realImg = demoImages[curCat]?.[i];
            img.src = realImg || `https://placehold.co/430x932/${i === 0 ? '6C63FF' : '7F8C8D'}/white?text=${curCat}+${i + 1}`;
            img.alt = '';
            if (i === curIdx) img.className = 'active';
            screen.appendChild(img);

            // 圆点
            const dot = document.createElement('div');
            dot.className = `dot ${i === curIdx ? 'active' : ''}`;
            dots.appendChild(dot);
        }
    }

    // 标签切换
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            curCat = item.dataset.type;
            curIdx = 0;
            updateView();
        });
    });

    // 翻页
    if(prevBtn) prevBtn.addEventListener('click', () => {
        curIdx = (curIdx - 1 + 3) % 3;
        updateView();
    });
    
    if(nextBtn) nextBtn.addEventListener('click', () => {
        curIdx = (curIdx + 1) % 3;
        updateView();
    });

    updateView(); // 初始渲染
}

/**
 * 世界观 Boss 轮播
 */
function initBossCarousel() {
    const bossData = [
        { name: "关卡1：奶茶村郊外", desc: "无数冒险者踏出第一步的地方，空气中弥漫着廉价植脂末的香甜，在温柔乡的表面下似乎潜藏着不明觉厉的危险......", tags: ["本关boss：重力系小猫", "通关道具：92学历"] },
        { name: "关卡2：拖延丛林", desc: "植被异常茂密的原始森林，树木的年轮生长得极其缓慢——正如这里的时间流速。当地原住民\"DDL部落\"擅长一种名为\"不到最后一秒绝不行动\"的古老咒术。即便你心急如焚，身体也会不由自主地在大树下坐下，思考一些诸如宇宙起源的问题。", tags: ["本关boss：凑整点", "通关道具：镀金的简历"] },
        { name: "关卡3：五彩斑斓的黑色沼泽", desc: "这是地理学上的奇迹，也是审美上的灾难。粘稠的沼泽中翻涌着无数被毙掉的方案残骸。曾让无数冒险者道心破碎的强大生物\"甲方之龙\"驻守于此。", tags: ["本关boss：甲方之龙", "通关道具：面经宝典"] },
        { name: "关卡4：脏活沙漠", desc: "没有一丝生机的荒芜之地。没有补给，没有方向，只有永无止境的\"对齐\"与\"拉通\"。这里唯一的植被是仙人掌，可能是因为它们比较能抗压。", tags: ["本关boss：mentor", "通关道具：垂直实习"] },
        { name: "关卡5：决策层神殿", desc: "通过层层阻碍，你终于来到此地直面一切的罪魁祸首，你要在此击碎魔王把这片大地变为自己的韭菜的邪恶计划，夺回拯救世界的圣物\"offer\"。", tags: ["本关boss：魔王", "通关道具：offer"] }
    ];

    let curIdx = 0;

    const screen = document.getElementById('bossScreen');
    const dots = document.getElementById('bossDots');
    const nameEl = document.getElementById('bossName');
    const descEl = document.getElementById('bossDesc');
    const tagsEl = document.getElementById('bossTags');
    const prevBtn = document.getElementById('bossPrev');
    const nextBtn = document.getElementById('bossNext');

    function updateView() {
        const boss = bossData[curIdx];
        nameEl.innerText = boss.name;
        descEl.innerText = boss.desc;

        tagsEl.innerHTML = boss.tags.map(t => `<span class="boss-tag">${t}</span>`).join('');

        const bossImages = [
            'images/boss1.png',
            'images/boss2.png',
            'images/boss3.png',
            'images/boss4.png',
            'images/boss5.png'
        ];
        screen.innerHTML = `<img src="${bossImages[curIdx]}" alt="${boss.name}" class="active">`;

        dots.innerHTML = bossData.map((_, i) => `<div class="dot ${i === curIdx ? 'active' : ''}"></div>`).join('');
    }

    prevBtn.addEventListener('click', () => {
        curIdx = (curIdx - 1 + bossData.length) % bossData.length;
        updateView();
    });

    nextBtn.addEventListener('click', () => {
        curIdx = (curIdx + 1) % bossData.length;
        updateView();
    });

    dots.addEventListener('click', (e) => {
        if (e.target.classList.contains('dot')) {
            const index = [...dots.children].indexOf(e.target);
            if (index !== -1) {
                curIdx = index;
                updateView();
            }
        }
    });

    updateView();
}

/**
 * 勇者小队联系方式折叠
 */
function initTeamContacts() {
    const contactBtns = document.querySelectorAll('.contact-btn');
    contactBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.team-card');
            const links = card.querySelector('.contact-links');
            const isExpanded = links.classList.toggle('expanded');
            btn.setAttribute('aria-expanded', isExpanded);
        });
    });
}

/**
 * 滚动逻辑 (导航栏样式切换与高亮)
 */
function initScrollLogic() {
    const navbar = document.getElementById('navbar');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');
    const main = document.querySelector('main');

    if (!main) return;

    main.addEventListener('scroll', () => {
        const scrollTop = main.scrollTop;
        const clientHeight = main.clientHeight;

        // 当前位置高亮
        let currentSection = "";
        sections.forEach(s => {
            const sectionTop = s.offsetTop;
            if (scrollTop >= sectionTop - clientHeight / 2) {
                currentSection = s.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(currentSection)) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * 元素入场动画
 */
function initEntranceAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

/**
 * 时间轴 Tooltip
 */
function initTimelineTooltip() {
    const nodes = document.querySelectorAll('.timeline-node');
    const tooltip = document.getElementById('timelineTooltip');
    const container = document.querySelector('.timeline-track');
    if (!tooltip || nodes.length === 0 || !container) return;

    nodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            const date = node.dataset.date;
            const info = node.dataset.info;
            tooltip.innerHTML = `<div class="tooltip-date">${date}</div><div class="tooltip-info">${info}</div>`;
            tooltip.classList.add('visible');

            // 定位到节点正上方
            const nodeRect = node.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();

            const left = nodeRect.left - containerRect.left + (nodeRect.width / 2) - (tooltipRect.width / 2);
            const top = nodeRect.top - containerRect.top - tooltipRect.height - 12;

            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
        });

        node.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    });

    // 重新初始化 Lucide 图标
    lucide.createIcons();
}

/**
 * 吉祥物交互
 */
function initMascot() {
    const mascot = document.getElementById('mascot');
    const img = document.getElementById('mascot-img');
    const bubble = document.getElementById('mascot-bubble');
    if (!mascot || !img) return;

    const states = [
        'images/mascot-normal.png',
        'images/mascot-state1.png',
        'images/mascot-state2.png',
        'images/mascot-state3.png',
        'images/mascot-state4.png'
    ];
    const dialogues = [
        'hi～',
        '喵喵喵？',
        '产品一定要懂产品',
        '前端实在是太简单了～',
        '太阳升起后，就把昨天忘掉',
        '汪汪汪？',
        '更新在路上了',
        '豆包豆包给我生成一个发布会小巧思',
        '我从来没觉得当吉祥物开心过...',
        '我无心与你一决高下',
        '啦啦啦啦啦～好想玩minisprin～'
    ];

    let stateIndex = 0;
    let isDragging = false;
    let hasMoved = false;
    let startX, startY, offsetX, offsetY;
    let animating = null;
    let bubbleTimer = null;

    // 摇晃彩蛋
    let shakeCount = 0;
    let shakeTimer = null;
    let lastX = 0, lastY = 0;
    let isShaking = false;

    // 设置图片
    function setState(index) {
        stateIndex = index % states.length;
        img.src = states[stateIndex];
    }

    // 显示气泡
    function showBubble(text) {
        if (bubble) {
            clearTimeout(bubbleTimer);
            bubble.textContent = text;
            bubble.classList.add('visible');
            bubbleTimer = setTimeout(() => {
                bubble.classList.remove('visible');
            }, 2000);
        }
    }

    // 显示弹窗
    function showSecretModal() {
        const modal = document.getElementById('secret-modal');
        if (modal) modal.style.display = 'flex';
    }

    // 拖拽开始
    mascot.addEventListener('mousedown', (e) => {
        isDragging = true;
        hasMoved = false;
        startX = e.clientX;
        startY = e.clientY;
        offsetX = mascot.offsetLeft;
        offsetY = mascot.offsetTop;
        lastX = e.clientX;
        lastY = e.clientY;
        cancelAnimationFrame(animating);
    });

    // 拖拽移动
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
            hasMoved = true;
            setState(1); // 拖拽时显示state2

            // 摇晃检测
            const moveDelta = Math.abs(e.clientX - lastX) + Math.abs(e.clientY - lastY);
            if (moveDelta > 20) {
                if (!isShaking) {
                    isShaking = true;
                    shakeTimer = setTimeout(() => {
                        shakeCount++;
                        isShaking = false;
                        if (shakeCount >= 4) {
                            showSecretModal();
                            shakeCount = 0;
                        } else {
                            const msgs = ['救命...', '头好晕...', '救命...'];
                            showBubble(msgs[shakeCount - 1]);
                        }
                    }, 2000);
                }
            }
            lastX = e.clientX;
            lastY = e.clientY;
        }
        mascot.style.left = (offsetX + dx) + 'px';
        mascot.style.top = (offsetY + dy) + 'px';
        mascot.style.bottom = 'auto';
    });

    // 拖拽结束 - 落到网页底部
    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        isShaking = false;
        clearTimeout(shakeTimer);
        if (hasMoved) {
            fallToBottom();
        }
    });

    // 点击切换
    mascot.addEventListener('click', () => {
        setState(stateIndex + 1);
        showBubble(dialogues[Math.floor(Math.random() * dialogues.length)]);
    });

    // 下落到底部
    function fallToBottom() {
        const maxX = window.innerWidth - mascot.offsetWidth;
        const maxY = window.innerHeight - mascot.offsetHeight;

        let x = mascot.offsetLeft;
        let y = mascot.offsetTop;

        // 水平边界限制
        if (x < 0) x = 0;
        if (x > maxX) x = maxX;
        // 上边界限制
        if (y < 0) y = 0;

        // 落到网页底部
        mascot.style.left = x + 'px';
        mascot.style.top = y + 'px';
        mascot.style.bottom = 'auto';

        const step = () => {
            y += 8;
            if (y >= maxY) {
                y = maxY;
                mascot.style.left = x + 'px';
                mascot.style.top = y + 'px';
                mascot.style.bottom = 'auto';
                return;
            }
            mascot.style.top = y + 'px';
            animating = requestAnimationFrame(step);
        };
        step();
    }
}