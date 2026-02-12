// --- 1. Database & Config ---
const questions = {
    hello: ["สีอะไรที่บ่งบอกอารมณ์วันนี้?", "เรื่องเล็กๆ ที่ทำให้ยิ้มได้?", "เปรียบตัวเองเป็นสภาพอากาศแบบไหน?" , "ถ้าวันนี้เป็นรสชาติ จะเป็นรสอะไร (หวาน, ขม, เปรี้ยว, จืด)?" , "แบตเตอรี่ในตัวตอนนี้ เต็ม 100 เหลือเท่าไหร่?", "เพลงไหนที่เปิดฟังแล้ว ตรงกับอารมณ์ช่วงนี้ที่สุด?", "ถ้าเปรียบวันนี้เป็นฤดู คิดว่าเป็นฤดูอะไร?" , "ดอกไม้ชนิดไหน ที่สื่อถึงตัวเราในวันนี้ได้ดีที่สุด?" , "ถ้าตอนนี้วาร์ปไปพักผ่อนได้ 1 ที่ อยากไปโผล่ที่ไหน?" , "สัตว์ชนิดไหน ที่บ่งบอกความเป็นตัวเราในวันนี้?"],
    listen: ["เล่าเรื่องทริปที่ประทับใจที่สุด", "งานอดิเรกที่ทำแล้วลืมเวลา?", "หนังสือหรือหนังที่ชอบล่าสุด?" , "เมนูอาหารที่กินทีไร ก็รู้สึกมีความสุขเสมอ?" , "ของขวัญชิ้นไหนที่เคยได้รับ แล้วประทับใจไม่ลืม?" , "ช่วงเวลาในวัยเด็กตอนไหน ที่นึกถึงที่ไรก็ยิ้มได้?" , "เสียงธรรมชาติแบบไหน ที่ฟังแล้วผ่อนคลายที่สุด?" , "ใครคือ 'คนโปรด' ที่คุยด้วยแล้วสบายใจที่สุด?" ,"สถานที่ไหน ที่ไปแล้วรู้สึกเหมือนได้ชาร์จพลังเต็มที่?", "กิจกรรมอะไรที่ยังไม่เคยทำ แต่อยากลองสักครั้งในชีวิต?"],
    learn: ["บทเรียนสำคัญในปีที่ผ่านมา?", "ความผิดพลาดที่เป็นครูที่ดีที่สุด?", "ถ้าขอบคุณตัวเองได้จะบอกว่า?" , "ถ้าเจอตัวเองในวัยเด็กได้ 1 นาที อยากบอกอะไรเขา/เธอ?" , "นิสัยเล็กๆ อะไรที่เปลี่ยนแล้ว ชีวิตดีขึ้น?" , "คำแนะนำที่ดีที่สุด ที่เคยได้รับจากคนอื่นคืออะไร?" , "เรื่องอะไรที่เมื่อก่อนเคยเครียดมาก แต่ตอนนี้ปล่อยวางได้แล้ว?" , "ทักษะใหม่อะไร ที่เพิ่งเรียนรู้แล้วรู้สึกภูมิใจในตัวเอง?" , "ความล้มเหลวครั้งไหน ที่พาเรามาไกลกว่าเดิม?" , "ใครคือต้นแบบ (Idol) ในการใช้ชีวิตของคุณ?"],
    empathy: ["ในวันที่เหนื่อย อยากได้ยินคำว่า?", "ความฝันที่ยังไม่ได้ลงมือทำ?", "ความกลัวที่อยากก้าวข้าม?" , "ตอนนี้มีความกังวลใจเรื่องอะไร ที่อยากระบายหรือวางลงบ้าง?" , "วิธีปลอบใจตัวเองในวันที่แย่ คือการทำอะไร?" , "ถ้าขอพรวิเศษได้ 1 ข้อเพื่อคนอื่น จะขอให้ใครและขอว่าอะไร?" , "เรื่องอะไรที่คนมักเข้าใจผิดเกี่ยวกับตัวเรา และอยากอธิบายให้เข้าใจ?" , "ความสุขง่ายๆ รอบตัว ที่เรามักจะเผลอมองข้ามไปคืออะไร?"
, "ระหว่าง 'กอดแน่นๆ' กับ 'คำพูดดีๆ' ตอนนี้ต้องการแบบไหนมากกว่ากัน?" ,"เป้าหมายเล็กๆ ที่อยากทำให้สำเร็จเพื่อตัวเองในเดือนนี้คืออะไร?"]
};

const stages = ['hello', 'listen', 'learn', 'empathy'];
const stageColors = { 
    hello: '#FFDB58', listen: '#8A9A5B', learn: '#779ECB', empathy: '#E2725B' 
};

// --- 2. System Variables ---
let peer;
let conn; // Connection Object
let connections = []; // Host stores all player connections
let myRole = 'player'; // 'host' or 'player'
let currentStageIndex = 0;
let questionCount = 0; // Count questions per stage

// Audio System
const sfxBell = new Audio('sounds/bell.mp3');
const sfxSuccess = new Audio('sounds/success.mp3');
sfxBell.volume = 0.6; 

// --- 3. Initialization ---
window.onload = function() {
    // A. Handle Splash Screen
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        splash.classList.add('fade-out');
        setTimeout(() => splash.style.display = 'none', 1000);
    }, 2500);

    // B. Check URL for Join Room
    const urlParams = new URLSearchParams(window.location.search);
    const roomID = urlParams.get('room');
    if (roomID) {
        joinRoom(roomID);
    }
};

function unlockAudio() {
    sfxBell.play().then(() => {
        sfxBell.pause(); sfxBell.currentTime = 0;
    }).catch(e => console.log("Audio unlock:", e));
}

function showScene(id) {
    document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// --- 4. Network Logic (PeerJS) ---
function createRoom() {
    unlockAudio();
    myRole = 'host';
    const roomId = Math.floor(1000 + Math.random() * 9000);
    
    peer = new Peer('joy-' + roomId);

    peer.on('open', (id) => {
        const joinLink = `${window.location.origin}${window.location.pathname}?room=${roomId}`;
        document.getElementById('qrcode-display').innerHTML = "";
        new QRCode(document.getElementById("qrcode-display"), { text: joinLink, width: 180, height: 180 });
        document.getElementById('room-id-display').innerText = roomId;
        showScene('scene-waiting');
    });

    peer.on('connection', (c) => {
        connections.push(c);
        document.getElementById('connection-status').innerText = `เพื่อนมาแล้ว ${connections.length} คน!`;
        setupConnection(c);
    });
}

function joinRoom(roomId) {
    unlockAudio();
    showScene('scene-game'); // Wait scene essentially
    document.getElementById('question-text').innerText = "กำลังเชื่อมต่อกับวงสนทนา...";
    
    peer = new Peer(); // Random ID
    peer.on('open', () => {
        conn = peer.connect('joy-' + roomId);
        conn.on('open', () => {
            document.getElementById('question-text').innerText = "เชื่อมต่อสำเร็จ! รอ Host เริ่ม...";
        });
        conn.on('data', (data) => handleGameData(data));
    });
    
    peer.on('error', (err) => {
        alert("ไม่พบห้องนี้ หรือการเชื่อมต่อขัดข้อง");
        location.href = location.pathname;
    });
}

function joinRoomManually() {
    const code = prompt("กรอกรหัสห้อง 4 หลัก:");
    if (code) joinRoom(code);
}

function setupConnection(c) {
    // Handle data from players if needed (e.g., gifts)
    c.on('data', (data) => {
        if(data.type === 'gift') {
            // Forward gift to everyone or handle logic
        }
    });
}

// --- 5. Game Logic ---

// Step 1: Start -> Show Rules
function startGame() {
    if (myRole !== 'host') return;
    const data = { type: 'showRules' };
    handleGameData(data); // Local
    broadcastData(data);  // Network
}

// Step 2: Confirm Rules -> Start Questions
function confirmRules() {
    if (myRole !== 'host') return;
    nextCard(); // Start first card
    // Prepare UI for host
    document.getElementById('host-controls').style.display = 'block';
    document.getElementById('player-role-text').innerText = "คุณคือ Host (กดเปลี่ยนการ์ด)";
}

// Step 3: Next Card Logic
function nextCard() {
    // Check if game ended
    if (currentStageIndex >= stages.length) {
        finishGame();
        return;
    }

    const stageName = stages[currentStageIndex];
    const list = questions[stageName];
    const randomText = list[Math.floor(Math.random() * list.length)];

    const data = {
        type: 'update',
        stage: stageName,
        color: stageColors[stageName],
        text: randomText
    };

    handleGameData(data);
    broadcastData(data);

    // Logic: 3 Questions then change stage
    questionCount++;
    if (questionCount >= 3) {
        currentStageIndex++;
        questionCount = 0;
    }
}

function finishGame() {
    const data = { type: 'end' };
    handleGameData(data);
    broadcastData(data);
}

function broadcastData(data) {
    connections.forEach(c => c.send(data));
}

// --- 6. Display Logic (Receiver) ---
function handleGameData(data) {
    if (data.type === 'showRules') {
        showScene('scene-rules');
        if (myRole === 'host') {
            document.getElementById('host-rule-controls').style.display = 'block';
            document.getElementById('waiting-host-text').style.display = 'none';
        } else {
            document.getElementById('host-rule-controls').style.display = 'none';
            document.getElementById('waiting-host-text').style.display = 'block';
        }
    } 
    else if (data.type === 'update') {
        showScene('scene-game');
        document.getElementById('category-title').innerText = `หมวด: ${data.stage.toUpperCase()}`;
        
        const card = document.getElementById('question-card');
        const text = document.getElementById('question-text');

        // Fade Out
        card.style.opacity = 0;
        setTimeout(() => {
            // Update Content
            card.style.borderTopColor = data.color;
            text.innerText = data.text;
            // Fade In & Sound
            card.style.opacity = 1;
            sfxBell.currentTime = 0;
            sfxBell.play().catch(e=>{});
        }, 200);
    } 
    else if (data.type === 'end') {
        showScene('scene-reflection'); // Go to Gift Selection first
    }
}

// --- 7. Evaluation Logic ---
// แก้ไขฟังก์ชัน selectGift ให้ทำงานได้ชัวร์ 100%
function selectGift(giftType) {
    console.log("เลือกของขวัญ:", giftType); // เช็คว่าปุ่มกดติดไหม
    
    // 1. พยายามหา Element ที่จะแสดงผล (รองรับทั้งชื่อเก่าและใหม่)
    let resultElement = document.getElementById('gift-result'); // ชื่อใหม่
    if (!resultElement) {
        resultElement = document.getElementById('received-gift-display'); // ชื่อเก่า (เผื่อใช้ HTML เดิม)
    }

    // 2. ถ้าเจอ ให้ใส่ข้อความ (ถ้าไม่เจอ ข้ามไป จะได้ไม่ error)
    if (resultElement) {
        resultElement.innerText = `คุณได้รับ ${giftType} จากเพื่อนๆ`;
    }

    // 3. เล่นเสียง (ใส่ Try/Catch กัน error ถ้าไม่มีไฟล์เสียง)
    if (typeof sfxSuccess !== 'undefined') {
        sfxSuccess.play().catch(e => console.log("หาไฟล์เสียงไม่เจอ หรือ Browser บล็อก: ", e));
    }

    // 4. เปลี่ยนหน้า (สำคัญที่สุด!)
    showScene('scene-end');



    sfxSuccess.play().catch(e=>{});
}

function restartApp() {
    // ลบค่า ?room=... ออก ให้เหลือแค่ชื่อเว็บเพียวๆ
    const cleanURL = window.location.href.split('?')[0];
    window.location.href = cleanURL;
}