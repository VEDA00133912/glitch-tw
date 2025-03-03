export default class Plugin extends Patch {
  name = "Display Game Cache"
  name_lang = {
    ja: "ゲームキャッシュの表示",
    en: "Display Game Cache",
    cn: "显示游戏缓存",
    tw: "顯示遊戲快取",
    ko: "게임 캐시 표시"
  }
  version = "22.02.11"
  description = "Appends cached assets below the game"
  description_lang = {
    ja: "ゲームの下にキャッシュされたアセットを追加します",
    en: "Appends cached assets below the game",
    cn: "在游戏下方追加缓存的资源",
    tw: "在遊戲下方追加快取資源",
    ko: "게임 아래에 캐시된 자산을 추가합니다"
  }
  author = "Katie Frogs(translated by ryo)"

  load() {
    this.addEdits(
      new EditFunction(CanvasCache.prototype, "resize").load(str => {
        return plugins.insertAfter(str,
          'this.ctx = this.canvas.getContext("2d")', `
        document.body.appendChild(this.canvas)`)
      }),
      new EditFunction(CanvasCache.prototype, "clean").load(str => {
        return plugins.insertAfter(str,
          'this.resize(1, 1, 1)', `
        document.body.removeChild(this.canvas)`)
      }),
      new EditValue(document.body.style, "overflow").load(() => "auto")
    )
  }
}
