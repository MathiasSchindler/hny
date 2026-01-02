// Configuration for all calendars
const calendarConfigs = [
    { id: 'gregory', name: 'Gregorian', region: 'International', icon: 'globe', type: 'intl', calendar: 'gregory' },
    { id: 'chinese', name: 'Chinese (Lunar)', region: 'East Asia', icon: 'moon', type: 'intl', calendar: 'chinese' },
    { id: 'korean', name: 'Korean (Dangi)', region: 'Korea', icon: 'moon', type: 'intl', calendar: 'dangi' },
    { id: 'hebrew', name: 'Hebrew', region: 'Jewish / Israel', icon: 'sun', type: 'intl', calendar: 'hebrew' },
    { id: 'islamic', name: 'Islamic (Hijri)', region: 'Muslim World', icon: 'moon', type: 'intl', calendar: 'islamic-umalqura' },
    { id: 'islamic-civil', name: 'Islamic Civil', region: 'Muslim World', icon: 'moon', type: 'intl', calendar: 'islamic-civil' },
    { id: 'persian', name: 'Persian (Jalali)', region: 'Iran / Afghanistan', icon: 'sun', type: 'intl', calendar: 'persian' },
    { id: 'indian', name: 'Indian National', region: 'India', icon: 'globe', type: 'intl', calendar: 'indian' },
    { id: 'coptic', name: 'Coptic', region: 'Egypt', icon: 'sun', type: 'intl', calendar: 'coptic' },
    { id: 'ethiopic', name: 'Ethiopic', region: 'Ethiopia', icon: 'sun', type: 'intl', calendar: 'ethiopic' },
    { id: 'japanese', name: 'Japanese', region: 'Japan', icon: 'sun', type: 'intl', calendar: 'japanese' },
    { id: 'buddhist', name: 'Buddhist', region: 'Southeast Asia', icon: 'sun', type: 'intl', calendar: 'buddhist' },
    { id: 'roc', name: 'Minguo (ROC)', region: 'Taiwan', icon: 'globe', type: 'intl', calendar: 'roc' },
    { id: 'orthodox', name: 'Orthodox (Old NY)', region: 'Eastern Europe', icon: 'sparkles', type: 'static', month: 1, day: 14 },
    { id: 'thai', name: 'Thai (Songkran)', region: 'Thailand', icon: 'flower', type: 'static', month: 4, day: 13 },
    { id: 'berber', name: 'Berber (Yennayer)', region: 'North Africa', icon: 'mountain', type: 'static', month: 1, day: 12 },
    // Spring equinox celebrations (March 20/21, historically related)
    { id: 'nowruz', name: 'Nowruz (Spring)', region: 'Central Asia / Persia', icon: 'flower-2', type: 'static', month: 3, day: 21 },
    { id: 'bahai', name: 'Bahá\'í (Naw-Rúz)', region: 'Worldwide', icon: 'star', type: 'static', month: 3, day: 21 },
    { id: 'kurdish', name: 'Kurdish (Newroz)', region: 'Kurdistan', icon: 'flame', type: 'static', month: 3, day: 21 },
    { id: 'assyrian', name: 'Assyrian (Akitu)', region: 'Middle East', icon: 'sun', type: 'static', month: 4, day: 1 },
    // Vietnamese Tết follows the same lunar calendar as Chinese New Year
    { id: 'vietnamese', name: 'Vietnamese (Tết)', region: 'Vietnam', icon: 'moon', type: 'intl', calendar: 'chinese' },
    // Additional calendars for better coverage
    { id: 'bengali', name: 'Bengali (Pohela Boishakh)', region: 'Bangladesh / West Bengal', icon: 'sunrise', type: 'static', month: 4, day: 14 },
    { id: 'tamil', name: 'Tamil (Puthandu)', region: 'Tamil Nadu / Sri Lanka', icon: 'leaf', type: 'static', month: 4, day: 14 },
    { id: 'sinhalese', name: 'Sinhalese (Aluth Avuruddu)', region: 'Sri Lanka', icon: 'sunset', type: 'static', month: 4, day: 14 },
    { id: 'tibetan', name: 'Tibetan (Losar)', region: 'Tibet / Himalayas', icon: 'mountains', type: 'intl', calendar: 'chinese' },
    { id: 'nepali', name: 'Nepali (Bikram Sambat)', region: 'Nepal', icon: 'triangle', type: 'static', month: 4, day: 14 },
    { id: 'balinese', name: 'Balinese Saka (Nyepi)', region: 'Bali', icon: 'waves', type: 'static', month: 3, day: 22 }
];

function calculateAndRender() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const results = calendarConfigs.map(config => {
        let isTodayNewYear = false;
        let currentDateString = '';
        let nextNewYearDate = '';
        let daysUntil = -1;

        // --- Logic for INTL calendars ---
        if (config.type === 'intl') {
            try {
                const yearFormatter = new Intl.DateTimeFormat('en-US', { calendar: config.calendar, year: 'numeric' });
                const displayFormatter = new Intl.DateTimeFormat('en-US', { calendar: config.calendar, dateStyle: 'long' });
                
                currentDateString = displayFormatter.format(today);
                const todayYear = yearFormatter.format(today);
                const yesterdayYear = yearFormatter.format(yesterday);

                // If the year string changed since yesterday, it's New Year
                isTodayNewYear = todayYear !== yesterdayYear;

                if (isTodayNewYear) {
                    daysUntil = 0;
                    nextNewYearDate = today.toLocaleDateString();
                } else {
                    // Look ahead loop
                    let testDate = new Date(today);
                    let currentYearVal = todayYear;
                    let found = false;
                    
                    for (let i = 1; i <= 450; i++) {
                        testDate.setDate(testDate.getDate() + 1);
                        const testYear = yearFormatter.format(testDate);
                        
                        if (testYear !== currentYearVal) {
                            daysUntil = i;
                            nextNewYearDate = testDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
                            found = true;
                            break;
                        }
                    }
                    if (!found) nextNewYearDate = "Unknown";
                }
            } catch (e) {
                currentDateString = "Not supported by browser";
                nextNewYearDate = "N/A";
            }
        } 
        // --- Logic for STATIC calendars ---
        else if (config.type === 'static') {
            currentDateString = today.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
            
            if ((today.getMonth() + 1) === config.month && today.getDate() === config.day) {
                isTodayNewYear = true;
                daysUntil = 0;
                nextNewYearDate = today.toLocaleDateString();
            } else {
                const currentYear = today.getFullYear();
                let targetDate = new Date(currentYear, config.month - 1, config.day);
                
                if (targetDate < today) {
                    targetDate = new Date(currentYear + 1, config.month - 1, config.day);
                }
                
                const diffTime = Math.abs(targetDate - today);
                daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                nextNewYearDate = targetDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
            }
        }

        return { ...config, currentDateString, isTodayNewYear, daysUntil, nextNewYearDate };
    });

    // Sort results
    results.sort((a, b) => {
        if (a.isTodayNewYear && !b.isTodayNewYear) return -1;
        if (!a.isTodayNewYear && b.isTodayNewYear) return 1;
        if (a.daysUntil === -1) return 1; 
        if (b.daysUntil === -1) return -1;
        return a.daysUntil - b.daysUntil;
    });

    renderUI(results);
}

function renderUI(results) {
    const grid = document.getElementById('calendar-grid');
    const statusContainer = document.getElementById('status-container');
    const celebrating = results.filter(r => r.isTodayNewYear);
    
    // 1. Render Status Header
    if (celebrating.length > 0) {
        const names = celebrating.map(c => c.name).join(' & ');
        statusContainer.innerHTML = `
            <div class="animate-fade-in-up bg-green-500/10 border border-green-500/30 p-6 rounded-2xl backdrop-blur-sm">
                <p class="text-green-400 font-bold text-2xl mb-2">YES! 🎉</p>
                <p class="text-slate-300 text-lg">
                    Happy New Year according to the <span class="text-white font-bold">${names}</span> calendar${celebrating.length > 1 ? 's' : ''}!
                </p>
            </div>
        `;
    } else {
        statusContainer.innerHTML = `
            <div class="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                <p class="text-slate-400 font-bold text-2xl mb-2">Not exactly.</p>
                <p class="text-slate-400">
                    It's not New Year's Day in these calendar systems today. <br/>
                    <span class="text-slate-500 text-sm">(But don't let that stop you from celebrating life!)</span>
                </p>
            </div>
        `;
    }

    // 2. Render Cards
    grid.innerHTML = results.map(item => {
        const isCelebration = item.isTodayNewYear;
        const cardClass = isCelebration 
            ? 'border-yellow-400 bg-gradient-to-br from-yellow-900/20 to-black shadow-yellow-500/20' 
            : 'border-white/10 bg-white/5 hover:border-white/20';
        
        const iconBg = isCelebration ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white';
        
        const glowEffect = isCelebration 
            ? `<div class="absolute -top-12 -right-12 w-24 h-24 bg-yellow-500/20 rounded-full blur-xl animate-pulse"></div>` 
            : '';

        const badge = isCelebration 
            ? `<span class="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <i data-lucide="party-popper" class="w-3 h-3"></i> HAPPY NEW YEAR!
               </span>` 
            : '';
        
        const daysDisplay = item.daysUntil === 0 
            ? 'Today!' 
            : `${item.daysUntil} <span class="text-sm text-white/50 font-normal">days away</span>`;

        return `
        <div class="relative p-6 rounded-xl border ${cardClass} transition-all duration-300 hover:shadow-lg overflow-hidden group">
            ${glowEffect}
            
            <div class="flex justify-between items-start mb-6">
                <div class="flex items-center gap-3">
                    <div class="p-2 rounded-lg ${iconBg}">
                        <i data-lucide="${item.icon}" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-white">${item.name}</h3>
                        <p class="text-sm text-white/50">${item.region}</p>
                    </div>
                </div>
                ${badge}
            </div>

            <div class="space-y-4">
                <div>
                    <p class="text-white/40 text-xs font-medium uppercase tracking-wider">Today's Date</p>
                    <p class="text-white/90 font-mono text-lg">${item.currentDateString}</p>
                </div>
                
                <div class="bg-black/20 p-3 rounded-lg">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-white/60 text-xs">Next New Year</span>
                        <span class="text-yellow-400/80 font-mono text-xs">${item.nextNewYearDate}</span>
                    </div>
                    <div class="text-white font-bold text-2xl flex items-baseline gap-1">
                        ${daysDisplay}
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');

    // 3. Initialize Icons
    lucide.createIcons();
}

// Run on load
document.addEventListener('DOMContentLoaded', () => {
    // Add a small delay to simulate calculation/make it feel substantial
    setTimeout(calculateAndRender, 100);
});
