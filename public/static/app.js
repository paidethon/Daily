// ===== Family Photo Diary - Main Application =====

const App = {
  currentTab: 'today',
  currentSubTab: 'today', // today, month, year
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth() + 1,
  selectedDate: null,
  galleryMode: 3,
  recallSettings: { polaroid: true, showText: false, showScore: false },
  showAlbumSheet: false,
  showRecallDropdown: false,
  records: [],
  calendarDates: [],
  galleryPhotos: [],
  stats: null,
  createModal: null,

  // Demo photos (placeholder URLs)
  demoPhotos: {
    'desk-setup.jpg': 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600&h=400&fit=crop',
    'burger-meal.jpg': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop',
    'sunset-sky.jpg': 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=600&h=400&fit=crop'
  },

  init() {
    this.bindTabEvents();
    this.renderPage();
    this.loadData();
  },

  bindTabEvents() {
    document.querySelectorAll('.tab-item').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        this.switchTab(tabName);
      });
    });
  },

  switchTab(tabName) {
    this.currentTab = tabName;
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

    const tabBar = document.getElementById('tab-bar');
    if (['gallery', 'recall', 'albums'].includes(tabName)) {
      tabBar.classList.add('dark');
    } else {
      tabBar.classList.remove('dark');
    }

    if (tabName === 'today') {
      this.currentSubTab = 'today';
    }

    this.renderPage();
    this.loadData();

    // Scroll to top
    document.getElementById('page-container').scrollTop = 0;
  },

  async loadData() {
    try {
      if (this.currentTab === 'today') {
        await this.loadRecords();
        if (this.currentSubTab === 'month' || this.currentSubTab === 'year') {
          await this.loadCalendar();
        }
      } else if (this.currentTab === 'gallery') {
        await this.loadGallery();
      } else if (this.currentTab === 'me') {
        await this.loadStats();
      }
    } catch (e) {
      console.error('Load data error:', e);
    }
  },

  async loadRecords() {
    try {
      const res = await fetch('/api/records?limit=50');
      const data = await res.json();
      this.records = data.records || [];
      this.renderRecordCards();
    } catch (e) {
      // Use empty state
      this.records = [];
      this.renderRecordCards();
    }
  },

  async loadCalendar() {
    try {
      let url = `/api/calendar?year=${this.currentYear}`;
      if (this.currentSubTab === 'month') {
        url += `&month=${this.currentMonth}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      this.calendarDates = data.dates || [];
      if (this.currentSubTab === 'month') this.renderMonthView();
      else if (this.currentSubTab === 'year') this.renderYearView();
    } catch (e) {
      this.calendarDates = [];
      if (this.currentSubTab === 'month') this.renderMonthView();
      else if (this.currentSubTab === 'year') this.renderYearView();
    }
  },

  async loadGallery() {
    try {
      const res = await fetch('/api/gallery?limit=200');
      const data = await res.json();
      this.galleryPhotos = data.photos || [];
      this.renderGalleryGrid();
    } catch (e) {
      this.galleryPhotos = [];
      this.renderGalleryGrid();
    }
  },

  async loadStats() {
    try {
      const res = await fetch('/api/stats');
      this.stats = await res.json();
      this.renderMeStats();
    } catch (e) {
      this.stats = { totalRecords: 0, completeWeeks: 0, daysSinceFirst: 0 };
      this.renderMeStats();
    }
  },

  renderPage() {
    const container = document.getElementById('page-container');
    switch (this.currentTab) {
      case 'today': container.innerHTML = this.getTodayHTML(); break;
      case 'gallery': container.innerHTML = this.getGalleryHTML(); break;
      case 'recall': container.innerHTML = this.getRecallHTML(); break;
      case 'albums': container.innerHTML = this.getAlbumsHTML(); break;
      case 'me': container.innerHTML = this.getMeHTML(); break;
    }
    this.bindPageEvents();
  },

  // ===== TODAY PAGE =====
  getTodayHTML() {
    return `
      <div class="today-page page">
        <div class="page-header">
          <a class="tab-link ${this.currentSubTab === 'today' ? 'active' : ''}" data-subtab="today">今日</a>
          <a class="tab-link ${this.currentSubTab === 'month' ? 'active' : ''}" data-subtab="month">本月</a>
          <a class="tab-link ${this.currentSubTab === 'year' ? 'active' : ''}" data-subtab="year">今年</a>
          <div class="header-actions">
            <i class="fa-solid fa-sliders" title="筛选"></i>
          </div>
        </div>
        <div id="sub-content">
          ${this.getSubContent()}
        </div>
      </div>
    `;
  },

  getSubContent() {
    switch (this.currentSubTab) {
      case 'today': return this.getTodayView();
      case 'month': return this.getMonthViewHTML();
      case 'year': return this.getYearViewHTML();
    }
    return '';
  },

  getTodayView() {
    return `
      <div class="date-strip" id="date-strip"></div>
      <div id="record-list"></div>
    `;
  },

  renderRecordCards() {
    if (this.currentSubTab !== 'today') return;

    // Render date strip
    const strip = document.getElementById('date-strip');
    if (strip) strip.innerHTML = this.getDateStripHTML();

    const list = document.getElementById('record-list');
    if (!list) return;

    const today = new Date();
    const todayStr = this.formatDate(today);

    // Check if today has a record
    const todayRecord = this.records.find(r => r.record_date === todayStr);

    let html = '';

    // Today's prompt card if no record
    if (!todayRecord) {
      html += this.getPromptCardHTML(today, '+ 记录今日');
    }

    // Record cards
    this.records.forEach(r => {
      html += this.getRecordCardHTML(r);
    });

    if (this.records.length === 0 && todayRecord) {
      html += '<div style="text-align:center;padding:40px;color:#bbb;font-size:14px;">暂无记录</div>';
    }

    list.innerHTML = html;
    this.bindRecordEvents();
  },

  getDateStripHTML() {
    const today = new Date();
    const days = [];

    // Show days: 2 days before today, then today, then 4 days after
    for (let i = -2; i <= 4; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      days.push(d);
    }

    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const shortWeekDays = ['周日+', '周一+', '周二+', '周三+', '周四', '周五', '周六'];
    const todayStr = this.formatDate(today);

    let html = '';
    days.forEach((d, idx) => {
      const dateStr = this.formatDate(d);
      const isToday = dateStr === todayStr;
      const hasRecord = this.records.some(r => r.record_date === dateStr);
      const prevDay = idx > 0 ? days[idx - 1] : null;
      const isNewMonth = prevDay && d.getMonth() !== prevDay.getMonth();

      let dayContent = d.getDate().toString().padStart(2, '0');
      let dayLabel = weekDays[d.getDay()];

      // If this is the first day of current month in the strip, show month indicator
      if (isNewMonth || (idx === 0 && d.getDate() === 1)) {
        dayContent = `${d.getMonth() + 1}月`;
        dayLabel = '';
      }

      html += `
        <div class="date-chip ${isToday ? 'active' : ''} ${hasRecord ? 'has-record' : ''}" data-date="${dateStr}">
          <span class="day-num">${dayContent}</span>
          <span class="day-label">${dayLabel}</span>
        </div>
      `;
    });

    // Export chip
    html += `
      <div class="date-chip export-chip" onclick="App.showToast('导出功能开发中')">
        <i class="fa-solid fa-print"></i>
        <span>导出</span>
      </div>
    `;

    return html;
  },

  getPromptCardHTML(date, btnText) {
    const d = typeof date === 'string' ? new Date(date) : date;
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

    return `
      <div class="prompt-card">
        <div class="card-header">
          <div class="date-block">
            <div class="day-big">${String(d.getDate()).padStart(2, '0')}</div>
            <div class="month-info">${months[d.getMonth()]} / ${weekDays[d.getDay()]}</div>
          </div>
          <div class="full-date">${this.formatDate(d)}</div>
        </div>
        <div class="prompt-text">
          平淡的日子里总有动人的风景<br>
          每天用一张照片和一段随笔的&lt;片羽集&gt;<br>
          记录这日常生活中的小确幸
        </div>
        <button class="btn-accent" onclick="App.openCreateModal('${this.formatDate(d)}')">
          ${btnText}
        </button>
      </div>
    `;
  },

  getRecordCardHTML(record) {
    const d = new Date(record.record_date + 'T00:00:00');
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

    const photos = record.photos || [];
    const firstPhoto = photos[0];
    let photoHTML = '';

    if (firstPhoto) {
      const src = this.demoPhotos[firstPhoto.fileName] || firstPhoto.thumbnail || '/static/placeholder.svg';
      const safeLocation = (record.location || '').replace(/'/g, "\\'");
      photoHTML = `
        <div class="card-photo" onclick="App.showPhotoDetail('${src}', '${safeLocation}', '${record.record_date}')">
          <img src="${src}" alt="" loading="lazy">
        </div>
      `;
    }

    return `
      <div class="record-card" data-id="${record.id}">
        <div class="card-header">
          <div class="date-block">
            <div class="day-big">${String(d.getDate()).padStart(2, '0')}</div>
            <div class="month-info">${months[d.getMonth()]} / ${weekDays[d.getDay()]}</div>
          </div>
          <div class="full-date">${record.record_date}</div>
        </div>
        ${photoHTML}
        ${record.content ? `<div class="card-content">${this.escapeHTML(record.content)}</div>` : ''}
        ${record.location ? `
          <div class="card-location">
            <i class="fa-solid fa-location-dot"></i>
            <span>${this.escapeHTML(record.location)}</span>
          </div>
        ` : ''}
      </div>
    `;
  },

  // ===== MONTH VIEW =====
  getMonthViewHTML() {
    return `
      <div class="month-view">
        <div class="month-header">
          <span class="month-title">${this.currentYear}年${this.currentMonth}月</span>
          <i class="fa-regular fa-calendar cal-icon"></i>
          <i class="fa-solid fa-chevron-left nav-arrow" onclick="App.changeMonth(-1)"></i>
          <i class="fa-solid fa-chevron-right nav-arrow" onclick="App.changeMonth(1)"></i>
          <button class="share-btn" onclick="App.showToast('分享月历功能开发中')">
            <i class="fa-solid fa-print"></i> 分享月历
          </button>
        </div>
        <div class="cal-grid" id="cal-grid"></div>
        <div id="month-record-area"></div>
      </div>
    `;
  },

  renderMonthView() {
    const grid = document.getElementById('cal-grid');
    if (!grid) return;

    const year = this.currentYear;
    const month = this.currentMonth;
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const today = new Date();
    const todayStr = this.formatDate(today);

    const recordDates = new Set(this.calendarDates.map(d => d.record_date));

    const weekLabels = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

    let html = '<div class="cal-weekdays">';
    weekLabels.forEach(w => html += `<span>${w}</span>`);
    html += '</div><div class="cal-days">';

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      html += '<div class="cal-day empty"></div>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = dateStr === todayStr;
      const isSelected = this.selectedDate === dateStr || (!this.selectedDate && isToday);
      const hasRecord = recordDates.has(dateStr);

      let classes = 'cal-day';
      if (isToday) classes += ' today';
      if (isSelected) classes += ' selected';
      if (hasRecord) classes += ' has-record';

      html += `<div class="${classes}" data-date="${dateStr}" onclick="App.selectDate('${dateStr}')">${day}</div>`;
    }

    html += '</div>';
    grid.innerHTML = html;

    // Show selected date record
    this.renderMonthSelectedRecord();
  },

  renderMonthSelectedRecord() {
    const area = document.getElementById('month-record-area');
    if (!area) return;

    const date = this.selectedDate || this.formatDate(new Date());
    const record = this.records.find(r => r.record_date === date);

    if (record) {
      area.innerHTML = this.getRecordCardHTML(record);
    } else {
      area.innerHTML = this.getPromptCardHTML(date, '+ 补充记录');
    }
    this.bindRecordEvents();
  },

  selectDate(dateStr) {
    this.selectedDate = dateStr;
    this.renderMonthView();
  },

  changeMonth(delta) {
    this.currentMonth += delta;
    if (this.currentMonth > 12) { this.currentMonth = 1; this.currentYear++; }
    if (this.currentMonth < 1) { this.currentMonth = 12; this.currentYear--; }
    this.selectedDate = null;

    // Update header
    const title = document.querySelector('.month-title');
    if (title) title.textContent = `${this.currentYear}年${this.currentMonth}月`;

    this.loadCalendar();
  },

  // ===== YEAR VIEW =====
  getYearViewHTML() {
    return `
      <div class="year-view">
        <div class="year-header">
          <span class="year-title">${this.currentYear}年</span>
          <i class="fa-solid fa-chevron-left nav-arrow" onclick="App.changeYear(-1)"></i>
          <i class="fa-solid fa-chevron-right nav-arrow" onclick="App.changeYear(1)"></i>
          <button class="share-btn" onclick="App.showToast('分享年历功能开发中')">
            <i class="fa-solid fa-print"></i> 分享年历
          </button>
        </div>
        <div class="year-grid" id="year-grid"></div>
      </div>
    `;
  },

  renderYearView() {
    const grid = document.getElementById('year-grid');
    if (!grid) return;

    const year = this.currentYear;
    const today = new Date();
    const todayStr = this.formatDate(today);
    const recordDates = new Set(this.calendarDates.map(d => d.record_date));

    let html = '';
    for (let month = 1; month <= 12; month++) {
      const firstDay = new Date(year, month - 1, 1).getDay();
      const daysInMonth = new Date(year, month, 0).getDate();

      html += `<div class="year-month-block"><div class="ym-title">${month}月</div><div class="ym-days">`;

      for (let i = 0; i < firstDay; i++) {
        html += '<div class="ym-day"></div>';
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = dateStr === todayStr;
        const hasRecord = recordDates.has(dateStr);

        let classes = 'ym-day';
        if (isToday) classes += ' today-mark';
        if (hasRecord) classes += ' has-record';

        html += `<div class="${classes}">${day}</div>`;
      }

      html += '</div></div>';
    }

    grid.innerHTML = html;
  },

  changeYear(delta) {
    this.currentYear += delta;
    const title = document.querySelector('.year-title');
    if (title) title.textContent = `${this.currentYear}年`;
    this.loadCalendar();
  },

  // ===== GALLERY PAGE =====
  getGalleryHTML() {
    return `
      <div class="gallery-page page">
        <div class="gallery-header">
          <h2>图墙</h2>
        </div>
        <div class="gallery-grid cols-${this.galleryMode}" id="gallery-grid"></div>
        <div class="gallery-bottom">
          <div class="gallery-toggle">
            <button class="${this.galleryMode === 3 ? 'active' : ''}" onclick="App.setGalleryMode(3)">一行三图</button>
            <button class="${this.galleryMode === 6 ? 'active' : ''}" onclick="App.setGalleryMode(6)">一行六图</button>
            <button class="${this.galleryMode === 9 ? 'active' : ''}" onclick="App.setGalleryMode(9)">一行九图</button>
          </div>
          <button class="gallery-more" onclick="App.showToast('更多选项开发中')">
            <i class="fa-solid fa-ellipsis"></i>
          </button>
        </div>
      </div>
    `;
  },

  renderGalleryGrid() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    const totalCells = this.galleryMode * Math.ceil(60 / this.galleryMode);
    let html = '';

    for (let i = 0; i < totalCells; i++) {
      const photo = this.galleryPhotos[i];
      if (photo) {
        const src = this.demoPhotos[photo.file_name] || photo.thumbnail_data || '/static/placeholder.svg';
        const safeLocation = (photo.location || '').replace(/'/g, "\\'");
        html += `
          <div class="gallery-cell" onclick="App.showPhotoDetail('${src}', '${safeLocation}', '${photo.record_date}')">
            <img src="${src}" alt="" loading="lazy">
          </div>
        `;
      } else {
        html += `
          <div class="gallery-cell">
            <span class="placeholder-text">片羽集</span>
          </div>
        `;
      }
    }

    grid.innerHTML = html;
  },

  setGalleryMode(mode) {
    this.galleryMode = mode;
    const grid = document.getElementById('gallery-grid');
    if (grid) {
      grid.className = `gallery-grid cols-${mode}`;
      this.renderGalleryGrid();
    }

    // Update buttons
    document.querySelectorAll('.gallery-toggle button').forEach(btn => {
      btn.classList.remove('active');
      if (btn.textContent.includes(mode === 3 ? '三' : mode === 6 ? '六' : '九')) {
        btn.classList.add('active');
      }
    });
  },

  // ===== RECALL PAGE =====
  getRecallHTML() {
    return `
      <div class="recall-page page">
        <div class="recall-header">
          <h2>随机回顾</h2>
          <button class="settings-btn" onclick="App.toggleRecallDropdown(event)">
            <i class="fa-solid fa-sliders"></i>
          </button>
          <div class="recall-dropdown ${this.showRecallDropdown ? '' : 'hidden'}" id="recall-dropdown">
            <div class="dd-item" onclick="App.toggleRecallSetting('polaroid')">
              <span>深色拍立得样式</span>
              ${this.recallSettings.polaroid ? '<i class="fa-solid fa-check check"></i>' : ''}
            </div>
            <div class="dd-item" onclick="App.toggleRecallSetting('showText')">
              <span>显示记录详情文字</span>
              ${this.recallSettings.showText ? '<i class="fa-solid fa-check check"></i>' : ''}
            </div>
            <div class="dd-item" onclick="App.toggleRecallSetting('showScore')">
              <span>显示AI图片评分</span>
              ${this.recallSettings.showScore ? '<i class="fa-solid fa-check check"></i>' : ''}
            </div>
          </div>
        </div>
        <div class="polaroid-wrapper" id="polaroid-area">
          <div style="color:#555;font-size:14px;text-align:center;">加载中...</div>
        </div>
        <div class="recall-actions">
          <button onclick="App.showToast('分享功能开发中')" title="分享">
            <i class="fa-solid fa-arrow-up-from-bracket"></i>
          </button>
          <button onclick="App.loadRandomRecall()" title="换一个">
            <i class="fa-solid fa-rotate-right"></i>
          </button>
        </div>
      </div>
    `;
  },

  async loadRandomRecall() {
    const area = document.getElementById('polaroid-area');
    if (!area) return;

    try {
      const res = await fetch('/api/recall/random');
      const data = await res.json();

      if (data.record) {
        const r = data.record;
        const photos = r.photos || [];
        const photo = photos[0];
        const src = photo ? (this.demoPhotos[photo.fileName] || photo.medium || photo.thumbnail || '') : '';

        const d = new Date(r.record_date + 'T00:00:00');
        const location = r.location || '';
        const dateStr = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${String(d.getFullYear()).slice(2)}`;

        area.innerHTML = `
          <div class="polaroid-card">
            <div class="polaroid-photo">
              ${src ? `<img src="${src}" alt="">` : '<div style="width:100%;height:100%;background:#e0e0e0;display:flex;align-items:center;justify-content:center;color:#999;">暂无照片</div>'}
            </div>
            <div class="polaroid-info">${location ? location + '  ' : ''}${dateStr}</div>
          </div>
        `;
      } else {
        area.innerHTML = `
          <div style="color:#666;text-align:center;">
            <i class="fa-regular fa-image" style="font-size:48px;margin-bottom:16px;display:block;"></i>
            还没有记录，快去创建第一条吧
          </div>
        `;
      }
    } catch (e) {
      area.innerHTML = `
        <div class="polaroid-card">
          <div class="polaroid-photo">
            <div style="width:100%;height:100%;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;">
              点击刷新加载回忆
            </div>
          </div>
          <div class="polaroid-info">Family Photo Diary</div>
        </div>
      `;
    }
  },

  toggleRecallDropdown(e) {
    e?.stopPropagation();
    this.showRecallDropdown = !this.showRecallDropdown;
    const dd = document.getElementById('recall-dropdown');
    if (dd) dd.classList.toggle('hidden');
  },

  toggleRecallSetting(key) {
    this.recallSettings[key] = !this.recallSettings[key];
    this.renderPage();
    this.loadRandomRecall();
  },

  // ===== ALBUMS PAGE =====
  getAlbumsHTML() {
    return `
      <div class="albums-page page">
        <div class="albums-header">
          <h2>画册</h2>
          <button class="settings-btn" onclick="App.toggleAlbumSheet()">
            <i class="fa-solid fa-sliders"></i>
          </button>
        </div>
        <div class="albums-grid" id="albums-grid">
          <div class="album-cover" onclick="App.showToast('画册详情开发中')">
            <div class="cover-img">
              <img src="https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=200&h=260&fit=crop" alt="">
              <div class="cover-overlay">
                <div class="cover-title">我的片羽集</div>
                <div class="cover-count">3 篇</div>
              </div>
            </div>
            <div class="album-name">我的片羽集</div>
          </div>
        </div>
        <div class="albums-caption">以上画册由照片日记自动生成 · 片羽集</div>
      </div>
      <div class="album-sheet ${this.showAlbumSheet ? 'show' : ''}" id="album-sheet">
        <div class="sheet-header">
          <button class="sheet-close" onclick="App.toggleAlbumSheet()">&times;</button>
          <div class="sheet-title">画册(照片日记本)管理</div>
          <div style="width:24px"></div>
        </div>
        <div class="sheet-item">
          <span class="item-name">我的片羽集</span>
          <span class="item-badge">(默认)</span>
          <i class="fa-regular fa-pen-to-square item-edit"></i>
          <i class="fa-solid fa-ellipsis item-more"></i>
        </div>
        <button class="sheet-add" onclick="App.showToast('新增照片日记功能开发中')">新增照片日记 +</button>
      </div>
    `;
  },

  toggleAlbumSheet() {
    this.showAlbumSheet = !this.showAlbumSheet;
    const sheet = document.getElementById('album-sheet');
    const overlay = document.getElementById('modal-overlay');

    if (this.showAlbumSheet) {
      sheet?.classList.add('show');
      overlay?.classList.remove('hidden');
      overlay.onclick = () => this.toggleAlbumSheet();
    } else {
      sheet?.classList.remove('show');
      overlay?.classList.add('hidden');
      overlay.onclick = null;
    }
  },

  // ===== ME PAGE =====
  getMeHTML() {
    return `
      <div class="me-page page">
        <div class="me-profile">
          <div class="me-avatar">
            <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=128&h=128&fit=crop" alt="头像">
          </div>
          <div class="me-info">
            <div class="me-name">霁影</div>
            <span class="me-role">编辑</span>
          </div>
        </div>

        <div class="pro-banner">
          <div class="pro-text">
            <div class="pro-title">片羽集 Pro</div>
            <div class="pro-desc">还未开通，感受更心动的记录体验</div>
          </div>
          <button class="pro-btn" onclick="App.showToast('Pro功能开发中')">了解更多</button>
        </div>

        <div class="me-stats" id="me-stats">
          <div class="stat-item">
            <div class="stat-num">-</div>
            <div class="stat-unit">篇</div>
            <div class="stat-label">已记录创作</div>
          </div>
          <div class="stat-item">
            <div class="stat-num">-</div>
            <div class="stat-unit">周</div>
            <div class="stat-label">已完整记录</div>
          </div>
          <div class="stat-item">
            <div class="stat-num">-</div>
            <div class="stat-unit">天</div>
            <div class="stat-label">已加入片羽集</div>
          </div>
        </div>

        <div class="me-menu">
          <div class="me-menu-item" onclick="App.showToast('当前照片日记')">
            <i class="fa-solid fa-book-open menu-icon"></i>
            <span class="menu-label">当前照片日记</span>
            <span class="menu-value">我的片羽集</span>
            <i class="fa-solid fa-chevron-right menu-arrow"></i>
          </div>
          <div class="me-menu-item" onclick="App.showToast('下载导出功能开发中')">
            <i class="fa-solid fa-download menu-icon"></i>
            <span class="menu-label">下载导出</span>
            <i class="fa-solid fa-chevron-right menu-arrow"></i>
          </div>
          <div class="me-menu-item" onclick="App.showToast('小组件管理')">
            <i class="fa-solid fa-puzzle-piece menu-icon"></i>
            <span class="menu-label">小组件管理</span>
            <i class="fa-solid fa-chevron-right menu-arrow"></i>
          </div>
          <div class="me-menu-item" onclick="App.showToast('标签管理')">
            <i class="fa-solid fa-hashtag menu-icon"></i>
            <span class="menu-label">标签管理</span>
            <i class="fa-solid fa-chevron-right menu-arrow"></i>
          </div>
        </div>

        <div class="me-menu" style="margin-top:12px">
          <div class="me-menu-item" onclick="App.showToast('反馈与建议')">
            <i class="fa-regular fa-comment-dots menu-icon"></i>
            <span class="menu-label">反馈与建议</span>
            <span class="menu-value">微信:lentowow</span>
            <i class="fa-solid fa-chevron-right menu-arrow"></i>
          </div>
          <div class="me-menu-item" onclick="App.showToast('更多设置')">
            <i class="fa-solid fa-gear menu-icon"></i>
            <span class="menu-label">更多设置</span>
            <i class="fa-solid fa-chevron-right menu-arrow"></i>
          </div>
        </div>
      </div>
    `;
  },

  renderMeStats() {
    const container = document.getElementById('me-stats');
    if (!container || !this.stats) return;

    container.innerHTML = `
      <div class="stat-item">
        <div class="stat-num">${this.stats.totalRecords}</div>
        <div class="stat-unit">篇</div>
        <div class="stat-label">已记录创作</div>
      </div>
      <div class="stat-item">
        <div class="stat-num">${this.stats.completeWeeks}</div>
        <div class="stat-unit">周</div>
        <div class="stat-label">已完整记录</div>
      </div>
      <div class="stat-item">
        <div class="stat-num">${this.stats.daysSinceFirst || 0}</div>
        <div class="stat-unit">天</div>
        <div class="stat-label">已加入片羽集</div>
      </div>
    `;
  },

  // ===== CREATE MODAL =====
  openCreateModal(date) {
    const d = date || this.formatDate(new Date());
    const modal = document.createElement('div');
    modal.className = 'create-modal';
    modal.id = 'create-modal';
    modal.innerHTML = `
      <div class="modal-header">
        <button class="modal-close" onclick="App.closeCreateModal()">&times;</button>
        <div class="modal-title">新建记录</div>
        <button class="modal-save" onclick="App.saveRecord()">保存</button>
      </div>
      <div class="create-form">
        <div class="form-group">
          <label>日期</label>
          <input type="date" id="record-date" value="${d}">
        </div>
        <div class="form-group">
          <label>照片（最多3张）</label>
          <div class="photo-upload-area" id="photo-upload-area">
            <div class="photo-upload-box" onclick="document.getElementById('photo-input').click()">
              <i class="fa-solid fa-plus"></i>
              <span>添加照片</span>
            </div>
          </div>
          <input type="file" id="photo-input" accept="image/*" multiple style="display:none" onchange="App.handlePhotoSelect(event)">
        </div>
        <div class="form-group">
          <label>内容</label>
          <textarea id="record-content" placeholder="记录今天的故事..."></textarea>
        </div>
        <div class="form-group">
          <label>位置（可选）</label>
          <input type="text" id="record-location" placeholder="例如：江苏省南京市">
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.createModal = { date: d, photos: [] };
  },

  closeCreateModal() {
    const modal = document.getElementById('create-modal');
    if (modal) modal.remove();
    this.createModal = null;
  },

  handlePhotoSelect(event) {
    const files = Array.from(event.target.files);
    if (!this.createModal) return;

    const remaining = 3 - this.createModal.photos.length;
    if (files.length > remaining) {
      this.showToast('每个日期最多只能选择 3 张照片');
    }

    const toAdd = files.slice(0, remaining);
    toAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.createModal.photos.push({
          file,
          dataUrl: e.target.result
        });
        this.renderPhotoUploads();
      };
      reader.readAsDataURL(file);
    });

    event.target.value = '';
  },

  renderPhotoUploads() {
    const area = document.getElementById('photo-upload-area');
    if (!area || !this.createModal) return;

    let html = '';
    this.createModal.photos.forEach((p, i) => {
      html += `
        <div class="photo-preview">
          <img src="${p.dataUrl}" alt="">
          <button class="remove-btn" onclick="App.removePhoto(${i})">&times;</button>
        </div>
      `;
    });

    if (this.createModal.photos.length < 3) {
      html += `
        <div class="photo-upload-box" onclick="document.getElementById('photo-input').click()">
          <i class="fa-solid fa-plus"></i>
          <span>添加照片</span>
        </div>
      `;
    }

    area.innerHTML = html;
  },

  removePhoto(index) {
    if (!this.createModal) return;
    this.createModal.photos.splice(index, 1);
    this.renderPhotoUploads();
  },

  async saveRecord() {
    if (!this.createModal) return;

    const date = document.getElementById('record-date').value;
    const content = document.getElementById('record-content').value;
    const location = document.getElementById('record-location').value;

    if (!content && this.createModal.photos.length === 0) {
      this.showToast('请添加照片或文字内容');
      return;
    }

    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          record_date: date,
          content,
          location: location || null
        })
      });
      const data = await res.json();

      if (data.success) {
        // Upload photos
        for (const photo of this.createModal.photos) {
          await fetch(`/api/records/${data.id}/photos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              file_name: photo.file.name,
              mime_type: photo.file.type,
              thumbnail: photo.dataUrl,
              medium: photo.dataUrl,
              original: photo.dataUrl
            })
          });
        }

        this.showToast('记录已保存');
        this.closeCreateModal();
        this.loadData();
      }
    } catch (e) {
      this.showToast('保存失败，请重试');
    }
  },

  // ===== PHOTO DETAIL =====
  showPhotoDetail(src, location, date) {
    const modal = document.createElement('div');
    modal.className = 'photo-detail-modal';
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    modal.innerHTML = `
      <button class="close-btn" onclick="this.parentElement.remove()">&times;</button>
      <img src="${src}" alt="">
      <div class="detail-info">${location ? location + ' · ' : ''}${date || ''}</div>
    `;
    document.body.appendChild(modal);
  },

  // ===== EVENTS =====
  bindPageEvents() {
    // Sub-tab switching
    document.querySelectorAll('.tab-link').forEach(link => {
      link.addEventListener('click', () => {
        const subtab = link.dataset.subtab;
        if (subtab && subtab !== this.currentSubTab) {
          this.currentSubTab = subtab;
          this.selectedDate = null;
          this.renderPage();
          this.loadData();
        }
      });
    });

    // Load recall on recall page
    if (this.currentTab === 'recall') {
      this.loadRandomRecall();
    }

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (this.showRecallDropdown && !e.target.closest('.recall-header')) {
        this.showRecallDropdown = false;
        const dd = document.getElementById('recall-dropdown');
        if (dd) dd.classList.add('hidden');
      }
    });
  },

  bindRecordEvents() {
    // Date chip click
    document.querySelectorAll('.date-chip[data-date]').forEach(chip => {
      chip.addEventListener('click', () => {
        const date = chip.dataset.date;
        // Highlight
        document.querySelectorAll('.date-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });
  },

  // ===== UTILS =====
  formatDate(date) {
    const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  showToast(msg) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => App.init());
