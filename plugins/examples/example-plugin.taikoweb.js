export default class Plugin extends Patch {
  name = "Example Plugin"
  name_lang = {
    ja: "簡単なプラグイン",
    en: "Example Plugin",
    cn: "示例插件",
    tw: "範例插件",
    ko: "예시 플러그인"
  }

  version = "25.03.01"
  description = "Replaces the judge score with great/cool/miss"
  author = "Katie Frogs(translated by ryo)"
  
  description_lang = {
    ja: "判定点数をGREAT/COOL/MISSに置き換えます",
    en: "Replaces the judge score with great/cool/miss",
    cn: "用‘GREAT/COOL/MISS’替换判定分数",
    tw: "用‘GREAT/COOL/MISS’取代判定分數",
    ko: "판정 점수를 GREAT/COOL/MISS로 교체합니다"
  }

  load() {
    this.log("load")
    this.addEdits(
      new EditValue(allStrings.en, "good").load(() => "GREAT"),
      new EditValue(allStrings.en, "ok").load(() => "COOL"),
      new EditValue(allStrings.en, "bad").load(() => "MISS")
    )
  }

  start() {
    this.log("start")
  }

  stop() {
    this.log("stop")
  }

  unload() {
    this.log("unload")
  }
}
