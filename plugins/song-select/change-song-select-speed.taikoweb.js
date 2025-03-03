export default class Plugin extends Patch {
  name = "Change Song Select Speed";
  name_lang = {
    ja: "曲選択速度変更",
    en: "Change Song Select Speed",
    cn: "更改歌曲选择速度",
    tw: "更改歌曲選擇速度",
    ko: "곡 선택 속도 변경"
  };
  
  version = "25.03.01";
  description = "Changes the song selection scroll speed";
  description_lang = {
    ja: "曲選択のスクロール速度を変更します",
    en: "Changes the song selection scroll speed",
    cn: "更改歌曲选择滚动速度",
    tw: "更改歌曲選擇滾動速度",
    ko: "곡 선택 스크롤 속도를 변경합니다"
  };
  
  author = "Katie Frogs (translated by ryo)";
  
  selectRate = 0.5;
  
  strings = {
    selectRate: {
      name: "Song Select Speed",
      name_lang: {
        ja: "曲選択速度",
        en: "Song Select Speed",
        cn: "歌曲选择速度",
        tw: "歌曲選擇速度",
        ko: "곡 선택 속도"
      },
      description: null,
      description_lang: {
        ja: null,
        en: null,
        cn: null,
        tw: null,
        ko: null
      },
      format: "%sx",
      format_lang: {
        ja: "%sx",
        en: "%sx",
        cn: "%sx",
        tw: "%sx",
        ko: "%sx"
      }
    }
  };
  
  load() {
    this.addEdits(
      new EditFunction(SongSelect.prototype, "init").load(str => {
        return plugins.insertAfter(str, 'speed: 400', `/ this.getSelectRate()`);
      }),
      new EditValue(SongSelect.prototype, "getSelectRate").load(() => this.getSelectRate.bind(this))
    );
  }
  
  getSelectRate() {
    return this.selectRate;
  }
  
  settings() {
    var str = this.strings.selectRate;
    return [{
      name: str.name,
      name_lang: str.name_lang,
      description: str.description,
      description_lang: str.description_lang,
      format: str.format,
      format_lang: str.format_lang,
      type: "number",
      min: 0.25,
      fixedPoint: 2,
      step: 25,
      default: this.selectRate,
      getItem: () => this.selectRate,
      setItem: value => {
        this.selectRate = value;
      }
    }];
  }
}
