export default class Plugin extends Patch {
  name = "Old Song List";
  name_lang: {
		ja: "bui.pmの曲リスト",
		en: "Old Song List",
		cn: "旧歌单",
		tw: "舊歌清單",
		ko: "이전 노래 목록"
  }
  version = "25.03.01";
  description = "Restores the default taiko.bui.pm song list to show non-custom songs";
  description_lang: {
		ja: "taiko.bui.pmの曲リストを元に戻し、カスタム以外の曲を表示するようにする",
		en: "English",
		cn: "恢复默认的 taiko.bui.pm 歌曲列表，以显示非自定义歌曲",
		tw: "還原預設的 taiko.bui.pm 歌曲清單，以顯示非自訂歌曲",
		ko: "사용자 지정이 아닌 노래를 표시하도록 기본 taiko.bui.pm 노래 목록을 복원합니다."
  }
  author = "Katie Frogs(translated by ryo)";
  
  load() {
    this.categoriesDefault = assets.categoriesDefault ? assets.categoriesDefault.slice() : assets.categories.slice();
    this.oldLoader = plugins.pluginMap.ese;
    
    if (this.oldLoader) {
      this.oldHide = this.oldLoader.hide;
      
      let str = this.oldLoader.module.constructor.toString();
      str = plugins.insertBefore(str, `export default `, 'class Plugin extends Patch');
      str = plugins.insertAfter(str, 'new EditValue(assets, "songsDefault', `2`);
      
      str = plugins.insertBefore(str, 
        `new EditValue(assets, "songsDefault").load(() => assets.songsDefault.slice()),
        new EditFunction(SongSelect.prototype, "init").load(str => {
          return plugins.insertBefore(str,
            \`if(p2.session && assets.songs === assets.songsDefault){
              assets.songs = assets.songsDefault2
            } else if(!p2.session && assets.songs === assets.songsDefault2){
              assets.songs = assets.songsDefault
            }\`,
            'for(let song of assets.songs){')
        }),
        new EditFunction(SongSelect.prototype, "toSession").load(str => {
          return plugins.insertAfter(str,
            'this.state.moveHover = null', \`
            if(assets.songs === assets.songsDefault2){
              localStorage["selectedSong"] = this.selectedSong
              this.clean()
              setTimeout(() => {
                new SongSelect(false, false, this.touchEnabled)
              }, 500)
            }\`)
        }),
        `, 'new EditValue(assets, "songsDefault2")'
      );
      
      this.newLoader = plugins.add(str, {
        name: this.oldLoader.name,
        raw: true,
        hide: true
      });
      
      if (this.newLoader) {
        const newIndex = plugins.allPlugins.findIndex(obj => obj.plugin === this.newLoader);
        const newObj = plugins.allPlugins.splice(newIndex, 1);
        const oldIndex = plugins.allPlugins.findIndex(obj => obj.plugin === this.oldLoader);
        plugins.allPlugins.splice(oldIndex + 1, 0, ...newObj);
        
        return this.newLoader.load();
      }
    }
  }
  
  start() {
    setTimeout(() => {
      if (this.newLoader) {
        if (this.oldLoader.started) {
          this.oldLoader.stop();
          assets.categories = this.categoriesDefault;
          this.newLoader.start();
        }
        
        if (!this.oldHide) {
          this.oldLoader.hide = true;
          this.newLoader.hide = false;
        }
        
        setTimeout(() => {
          if (assets.categories_ese) {
            assets.categories = gameConfig.ese ? assets.categories_ese : assets.categoriesDefault;
          }
        });
      }
    });
  }
  
  stop() {
    setTimeout(() => {
      if (this.newLoader) {
        if (this.newLoader.started) {
          this.newLoader.stop();
          assets.categories = this.categoriesDefault;
          this.oldLoader.start();
        }
        
        if (!this.oldHide) {
          this.newLoader.hide = true;
          this.oldLoader.hide = false;
        }
        
        setTimeout(() => {
          if (assets.categories_ese) {
            assets.categories = gameConfig.ese ? assets.categories_ese : assets.categoriesDefault;
          }
        });
      }
    });
  }
  
  unload() {
    setTimeout(() => {
      if (this.newLoader) {
        this.newLoader.unload();
      }
      delete this.newLoader;
      delete this.oldLoader;
    });
  }
}
