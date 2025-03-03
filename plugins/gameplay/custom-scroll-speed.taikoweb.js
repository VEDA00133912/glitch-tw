export default class Plugin extends Patch {
  name = "Custom Scroll Speed"
  name_lang = {
    ja: "スクロール速度の変更",
    en: "Custom Scroll Speed",
    cn: "自定义滚动速度",
    tw: "自訂滾動速度",
    ko: "사용자 정의 스크롤 속도"
  }
  version = "25.03.01"
  description = "Changes the speed the notes scroll at in game"
  description_lang = {
    ja: "音符のスクロール速度を変更します",
    en: "Changes the speed the notes scroll at in game",
    cn: "更改游戏内音符的滚动速度",
    tw: "更改遊戲內音符的滾動速度",
    ko: "게임 내 노트의 스크롤 속도를 변경합니다"
  }
  author = "Katie Frogs(translated by ryo)"

  scrollRate = 0.5

  strings = {
    scrollRate: {
      name: "Scroll Speed Multiplier",
      name_lang: {
        ja: "スクロール速度倍率",
        en: "Scroll Speed Multiplier",
        cn: "滚动速度倍数",
        tw: "滾動速度倍數",
        ko: "스크롤 속도 배율"
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
  }

  load() {
    this.addEdits(
      new EditFunction(Controller.prototype, "init").load(str => {
        return plugins.insertAfter(str,
          'this.view = new View(this)', `
          if(this.view.getScrollRate() < 1){
            this.saveScore = false
          }`)
      }),
      new EditFunction(View.prototype, "drawCircles").load(str => {
        return plugins.insertAfter(str, 'circle.speed', ` * this.getScrollRate()`)
      }),
      new EditFunction(View.prototype, "drawCircle").load(str => {
        return plugins.insertAfter(str, 'circle.speed', ` * this.getScrollRate()`)
      }),
      new EditFunction(View.prototype, "drawMeasures").load(str => {
        str = plugins.strReplace(str, 'measure.speed)', `measure.speed * this.getScrollRate())`)
        str = plugins.strReplace(str, 'measure.speed)', `measure.speed * this.getScrollRate())`)
        return plugins.strReplace(str, 'measure.speed)', `measure.speed * this.getScrollRate())`)
      }),
      new EditValue(View.prototype, "getScrollRate").load(() => this.getScrollRate.bind(this))
    )
  }

  getScrollRate() {
    return this.scrollRate
  }

  settings() {
    var str = this.strings.scrollRate
    return [{
      name: str.name,
      name_lang: str.name_lang,
      description: str.description,
      description_lang: str.description_lang,
      format: str.format,
      format_lang: str.format_lang,
      type: "number",
      min: 0,
      fixedPoint: 2,
      step: 1,
      default: this.scrollRate,
      getItem: () => this.scrollRate,
      setItem: value => {
        this.scrollRate = value
      }
    }]
  }
}
