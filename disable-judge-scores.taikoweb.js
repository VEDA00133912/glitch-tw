export default class Plugin extends Patch {
  name = "Disable Judge Scores"
  name_lang = {
    ja: "判定表示を無効化",
    en: "Disable Judge Scores",
    cn: "禁用评分",
    tw: "禁用評分",
    ko: "판정 점수 비활성화",
  }
  version = "25.03.01"
  description = "Disable Judge Scores"
  description_lang = {
    ja: "良、可、不可の表示を無効化します。",
    en: "Disable Judge Scores",
    cn: "禁用评分功能。",
    tw: "禁用評分功能。",
    ko: "판정 점수 기능을 비활성화합니다.",
  }
  author = "Katie Frogs (translated by ryo)"
  
  load() {
    this.addEdits(
      new EditFunction(CanvasDraw.prototype, "score").load(str => {
        return ""
      }),
      new EditFunction(View.prototype, "refresh").load(str => {
        return plugins.strReplace(str, 'this.assets.drawAssets("notes")', "")
      })
    )
  }
}
