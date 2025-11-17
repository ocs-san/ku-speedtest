// ===== CONSTANTS =====
const CHART_CONFIG = {
    MAX_SPEED: 1000,
    COLORS: {
        KU_GREEN: '#006664',
        DARK_BG: '#334155',
        LIGHT_BG: '#f1f5f9'
    },
    ANIMATION: {
        FADE_DURATION: 500,
        FADE_DELAY: 10
    }
};

// ===== UTILITY FUNCTIONS =====
const I = (id) => document.getElementById(id);
const isDarkMode = () => document.documentElement.classList.contains('dark');

// ===== THEME MANAGEMENT =====
function toggleDarkMode() {
    const html = document.documentElement;
    html.classList.toggle('dark');
    const theme = html.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    
    if (speedChart) {
        updateChartTheme();
    }
}

function updateChartTheme() {
    const bgColor = isDarkMode() ? CHART_CONFIG.COLORS.DARK_BG : CHART_CONFIG.COLORS.LIGHT_BG;
    speedChart.data.datasets[0].backgroundColor[1] = bgColor;
    speedChart.update('none');
}

// Initialize theme on load
(function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
    }
})();

// ===== MODAL MANAGEMENT =====
const Modal = {
    open: () => I('serverModal').classList.remove('hidden'),
    close: () => I('serverModal').classList.add('hidden'),
    selectServer: (index) => {
        s.setSelectedServer(SPEEDTEST_SERVERS[index]);
        I('selectedServerName').textContent = SPEEDTEST_SERVERS[index].name;
        Modal.close();
    }
};

// Expose for HTML onclick attributes
const openServerModal = Modal.open;
const closeServerModal = Modal.close;
const selectServer = Modal.selectServer;

// ===== SPEEDTEST CONFIGURATION =====
var SPEEDTEST_SERVERS = "servers.json";
var s = new Speedtest();
s.setParameter("telemetry_level", "disabled");

// ===== SERVER SELECTION =====
function initServers() {
    if (typeof SPEEDTEST_SERVERS === "string") {
        s.loadServerList(SPEEDTEST_SERVERS, function(servers) {
            if (servers == null || servers.length == 0) {
                showUI();
            } else {
                SPEEDTEST_SERVERS = servers;
                runServerSelect();
            }
        });
    } else if (Array.isArray(SPEEDTEST_SERVERS) && SPEEDTEST_SERVERS.length == 0) {
        showUI();
    } else {
        runServerSelect();
    }
    
    function showUI() {
        I("loading").classList.add("hidden");
        I("serverArea").classList.add("hidden");
        I("testWrapper").classList.remove("hidden");
        initUI();
    }
    
    function runServerSelect() {
        s.addTestPoints(SPEEDTEST_SERVERS);
        s.selectServer(function(server) {
            if (server != null) {
                I("loading").classList.add("hidden");
                
                // Build server list for modal
                const serverList = I("serverList");
                if (serverList && SPEEDTEST_SERVERS.length > 0) {
                    serverList.innerHTML = "";
                    for (let i = 0; i < SPEEDTEST_SERVERS.length; i++) {
                        if (SPEEDTEST_SERVERS[i].pingT == -1) continue;
                        const div = document.createElement("div");
                        div.className = "p-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors duration-200";
                        div.onclick = function() { selectServer(i); };
                        
                        const name = document.createElement("div");
                        name.className = "font-semibold text-slate-900 dark:text-white";
                        name.textContent = SPEEDTEST_SERVERS[i].name;
                        
                        const ping = document.createElement("div");
                        ping.className = "text-sm text-slate-500 dark:text-slate-400";
                        ping.textContent = "Ping: " + SPEEDTEST_SERVERS[i].pingT.toFixed(0) + " ms";
                        
                        div.appendChild(name);
                        div.appendChild(ping);
                        serverList.appendChild(div);
                        
                        if (SPEEDTEST_SERVERS[i] === server) {
                            I('selectedServerName').textContent = server.name;
                        }
                    }
                    
                    if (SPEEDTEST_SERVERS.length > 1) {
                        I("serverArea").classList.remove("hidden");
                    }
                }
                
                I("testWrapper").classList.remove("hidden");
                initUI();
            } else {
                I("message").textContent = "No servers available";
            }
        });
    }
}

// ===== CHART MANAGEMENT =====
let speedChart = null;

const ChartManager = {
    init: function() {
        const canvas = I('mainMeter');
        if (!canvas) {
            console.error('Canvas mainMeter not found');
            return;
        }
        
        if (speedChart) {
            speedChart.destroy();
        }
        
        const ctx = canvas.getContext('2d');
        const bgColor = isDarkMode() ? CHART_CONFIG.COLORS.DARK_BG : CHART_CONFIG.COLORS.LIGHT_BG;
        
        speedChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [0, 100],
                    backgroundColor: [CHART_CONFIG.COLORS.KU_GREEN, bgColor],
                    borderWidth: 0
                }]
            },
            options: {
                aspectRatio: 2,
                circumference: 180,
                rotation: -90,
                responsive: true,
                maintainAspectRatio: true,
                cutout: '75%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    },
    
    update: function(speedMbps) {
        if (!speedChart) {
            this.init();
        }
        
        if (speedChart) {
            const percentage = Math.min((speedMbps / CHART_CONFIG.MAX_SPEED) * 100, 100);
            speedChart.data.datasets[0].data = [percentage, 100 - percentage];
            speedChart.update('none');
        }
    }
};

// Legacy function names for compatibility
const initChart = () => ChartManager.init();
const updateChart = (value) => ChartManager.update(value);
const drawMeter = (c, speed) => ChartManager.update(speed);

// ===== FORMATTING UTILITIES =====
const format = (value) => {
    const num = Number(value);
    if (num < 10) return num.toFixed(2);
    if (num < 100) return num.toFixed(1);
    return num.toFixed(0);
};

// Legacy conversion functions (kept for compatibility)
const mbpsToAmount = (s) => 1 - 1/Math.pow(1.3, Math.sqrt(s));
const msToAmount = (s) => 1 - 1/Math.pow(1.08, Math.sqrt(s));

// ===== ANIMATION HELPERS =====
const AnimationController = {
    fadeIn: function(element) {
        element.classList.remove('hidden');
        setTimeout(() => {
            element.classList.remove('opacity-0', 'scale-95');
            element.classList.add('opacity-100', 'scale-100');
        }, CHART_CONFIG.ANIMATION.FADE_DELAY);
    },
    
    fadeOut: function(element) {
        element.classList.remove('opacity-100', 'scale-100');
        element.classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
            element.classList.add('hidden');
        }, CHART_CONFIG.ANIMATION.FADE_DURATION);
    }
};

// ===== TEST STATE =====
let uiData = null;
let currentTestPhase = 'idle';

// ===== TEST CONTROL =====
function startStop() {
    const btn = I("startStopBtn");
    
    if (s.getState() === 3) {
        // Test running - abort
        s.abort();
        btn.textContent = "เริ่ม";
        btn.classList.remove("running");
        currentTestPhase = 'idle';
        AnimationController.fadeOut(I("meterArea"));
        ChartManager.update(0);
        initUI();
    } else {
        // Start test
        btn.textContent = "ยกเลิก";
        btn.classList.add("running");
        
        s.onupdate = (data) => { 
            uiData = data;
            currentTestPhase = data.testState === 1 ? 'download' : 
                              data.testState === 3 ? 'upload' : currentTestPhase;
        };
        
        s.onend = (aborted) => {
            btn.textContent = "เริ่ม";
            btn.classList.remove("running");
            currentTestPhase = 'idle';
            AnimationController.fadeOut(I("meterArea"));
            updateUI(true);
        };
        
        s.start();
    }
}

// ===== UI UPDATE =====
function updateUI(forced) {
    if (!forced && s.getState() !== 3) return;
    if (!uiData) return;
    
    // Update display values
    I("ip").textContent = uiData.clientIp;
    I("dlValue").textContent = format(uiData.dlStatus);
    I("ulValue").textContent = format(uiData.ulStatus);
    I("pingValue").textContent = format(uiData.pingStatus);
    I("jitValue").textContent = format(uiData.jitterStatus);
    
    // Meter management based on test phase
    const meterEl = I("meterArea");
    
    if (currentTestPhase === 'download') {
        if (meterEl.classList.contains('hidden')) {
            if (!speedChart) ChartManager.init();
            AnimationController.fadeIn(meterEl);
        }
        I("currentTestLabel").textContent = "DOWNLOAD";
        I("currentTestValue").textContent = format(uiData.dlStatus);
        I("currentTestUnit").textContent = "Mbps";
        ChartManager.update(uiData.dlStatus * oscillate());
    } else if (currentTestPhase === 'upload') {
        if (meterEl.classList.contains('hidden')) {
            AnimationController.fadeIn(meterEl);
        }
        I("currentTestLabel").textContent = "UPLOAD";
        I("currentTestValue").textContent = format(uiData.ulStatus);
        I("currentTestUnit").textContent = "Mbps";
        ChartManager.update(uiData.ulStatus * oscillate());
    } else if (currentTestPhase === 'ping') {
        AnimationController.fadeOut(meterEl);
        I("currentTestLabel").textContent = "PING";
        I("currentTestValue").textContent = format(uiData.pingStatus);
        I("currentTestUnit").textContent = "ms";
    } else if (currentTestPhase === 'idle') {
        AnimationController.fadeOut(meterEl);
        I("currentTestLabel").textContent = "READY";
        I("currentTestValue").textContent = "0.00";
        I("currentTestUnit").textContent = "Mbps";
    }
}

// ===== ANIMATION LOOP =====
const oscillate = () => 1 + 0.02 * Math.sin(Date.now() / 100);

window.requestAnimationFrame = window.requestAnimationFrame || 
                               window.webkitRequestAnimationFrame || 
                               window.mozRequestAnimationFrame || 
                               window.msRequestAnimationFrame || 
                               ((callback) => setTimeout(callback, 1000/60));

function frame() {
    requestAnimationFrame(frame);
    updateUI();
}
frame();

// ===== INITIALIZATION =====
function initUI() {
    if (!speedChart) {
        ChartManager.init();
    }
    ChartManager.update(0);
    
    const labels = I("currentTestLabel");
    const value = I("currentTestValue");
    const unit = I("currentTestUnit");
    
    labels.textContent = "READY";
    value.textContent = "0.00";
    unit.textContent = "Mbps";
    
    I("dlValue").textContent = "0.00";
    I("ulValue").textContent = "0.00";
    I("pingValue").textContent = "0.00";
    I("jitValue").textContent = "0.00";
    I("ip").textContent = "";
}

// Initialize when page loads
window.addEventListener('load', initServers);
