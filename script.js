document.addEventListener('DOMContentLoaded', () => {
    
    const input = document.getElementById('cmd-input');
    const outputLog = document.getElementById('output-log');
    const contentViewer = document.getElementById('content-viewer');
    const terminalWindow = document.getElementById('window-terminal');
    const contentWindow = document.getElementById('window-content');
    
    // Init
    updateClock();
    setInterval(updateClock, 10000);
    loadContent('tmpl-home');

    // Enter Key logic
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const raw = input.value.trim();
            if (!raw) return;
            
            const args = raw.split(' ');
            const cmd = args[0].toLowerCase();

            // History
            addToLog(`user@zslinux ~ $ ${raw}`);
            input.value = '';
            
            // Logic
            processCommand(cmd, args);
            scrollToBottom();
        }
    });

    function processCommand(cmd, args) {
        switch(cmd) {
            case 'navigate':
            case 'goto':
                if(args[1]) {
                    const t = args[1].toLowerCase();
                    const map = { 'home':'tmpl-home', 'features':'tmpl-features', 'specs':'tmpl-specs' };
                    if(map[t]) {
                        loadContent(map[t]);
                        addToLog(`Navigating: ${t}`);
                        bringToFront(contentWindow);
                    } else addToLog(`Error: Page '${t}' not found.`, 'red');
                } else addToLog('Usage: navigate [home/features/specs]', 'orange');
                break;
            case 'help':
                addToLog(`
                CMD LIST:
                ---------
                navigate [loc] :: home, features, specs
                theme [mode]   :: light, dark
                install        :: download iso
                clear          :: clear logs
                `);
                break;
            case 'theme':
                if(args[1]==='dark') {
                    document.body.setAttribute('data-theme', 'dark');
                    addToLog('Theme: Dark Mode Active');
                } else if (args[1]==='light') {
                    document.body.removeAttribute('data-theme');
                    addToLog('Theme: Light Mode Active');
                }
                break;
            case 'clear': outputLog.innerHTML = ''; break;
            case 'install': addToLog('Init Install Sequence...', 'green'); break;
            default: addToLog(`Command not found: ${cmd}`, 'red');
        }
    }

    function loadContent(id) {
        const tmpl = document.getElementById(id);
        if(!tmpl) return;
        contentViewer.innerHTML = '';
        contentViewer.appendChild(tmpl.content.cloneNode(true));
        animateContent();
    }

    async function animateContent() {
        const textNodes = contentViewer.querySelectorAll('.type-target');
        const fades = contentViewer.querySelectorAll('.fade-target');
        
        // Hide logic
        const queue = [];
        textNodes.forEach(el => {
            queue.push({ el:el, txt:el.textContent });
            el.textContent = '';
            el.style.opacity = 1;
        });

        // Type logic
        for (const item of queue) {
            await typeString(item.el, item.txt);
        }
        
        // Fade in tables/grids
        fades.forEach(f => f.style.opacity = 1);
    }

    function typeString(el, txt) {
        return new Promise(res => {
            let i=0;
            function s(){
                if(i < txt.length) {
                    el.textContent += txt.charAt(i);
                    i++;
                    // typing speed
                    if(i%2===0) setTimeout(s, 10); 
                    else s(); 
                } else res();
            }
            s();
        });
    }

    // Draggables
    document.querySelectorAll('.title-bar').forEach(bar => {
        const w = bar.parentElement;
        let isDown=false, sX, sY, l, t;
        
        bar.addEventListener('mousedown', e => {
            isDown=true; sX=e.clientX; sY=e.clientY;
            l = w.offsetLeft; t = w.offsetTop;
            bringToFront(w);
        });

        window.addEventListener('mousemove', e => {
            if(!isDown) return;
            w.style.left = (l + (e.clientX - sX)) + 'px';
            w.style.top = (t + (e.clientY - sY)) + 'px';
        });
        window.addEventListener('mouseup', ()=> isDown=false);
    });

    function bringToFront(w) {
        document.querySelectorAll('.window').forEach(x => {
            x.style.zIndex=10; x.classList.remove('active-window');
        });
        w.style.zIndex=50; w.classList.add('active-window');
        if(w.id==='window-terminal') input.focus();
    }

    function addToLog(txt, c) {
        const d=document.createElement('div'); d.innerText=txt; d.style.marginBottom="4px";
        if(c==='red') d.style.color='#ef4444';
        if(c==='green') d.style.color='#22c55e';
        if(c==='orange') d.style.color='#f97316';
        outputLog.appendChild(d);
    }
    
    function scrollToBottom() { const a=document.getElementById('terminal-scroll-area'); a.scrollTop=a.scrollHeight; }
    function updateClock() { document.getElementById('clock').innerText=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}); }
});