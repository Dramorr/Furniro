class Tab {
  static map = new WeakMap();

  html = { tab: null, content: null };
  isActive = false;

  constructor(html, toggleContent) {
    this.html.tab = html;
    this.html.content = toggleContent;

    this.html.tab.classList.add('tab-item');
    Tab.map.set(this.html.tab, this);
  }

  activate() {
    if (this.isActive) return;
    this.isActive = true;

    this.html.tab.classList.add('active');
    this.html.content.classList.add('open');
  }
  deactivate() {
    if (!this.isActive) return;
    this.isActive = false;

    this.html.tab.classList.remove('active');
    this.html.content.classList.remove('open');
  }
}

export default class TabsManager {
  static map = new WeakMap();
  html = { tabs: null, contents: null };

  constructor(tabs, contents, openFirst = false) {
    if (!tabs || !contents) throw new Error('TabsSystem: tabs/contents required');

    this.html.tabs = tabs;
    this.html.contents = contents;

    contents = [...contents.children];
    this.tabs = [...tabs.children].map((tab, i) => new Tab(tab, contents[i]));
    if (openFirst) this.tabs[0].activate();

    this.bindEvents();
  }
  bindEvents() {
    this.html.tabs.addEventListener('click', (e) => {
      const tab = Tab.map.get(e.target.closest('.tab-item'));
      if (!tab) return;

      this.activateTab(tab);
    });
  }

  activateTab(tab) {
    const activeTab = this.tabs.find((tab) => tab.isActive);
    if (tab === activeTab) return;

    if (activeTab) activeTab.deactivate();
    tab.activate();
  }
}
