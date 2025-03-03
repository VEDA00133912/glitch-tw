export default class Plugin extends Patch {
  name = "Convert Lyrics to vtt"
  name_lang = {
    ja: "歌詞をvttに変換",
    en: "Convert Lyrics to vtt",
    cn: "将歌词转换为vtt",
    tw: "將歌詞轉換為vtt",
    ko: "가사를 vtt로 변환"
  }
  version = "25.03.01"
  description = "Adds an option to the pause screen to download converted lyrics in WEBVTT format"
  description_lang = {
    ja: "一時停止画面に、変換された歌詞をWEBVTT形式でダウンロードするオプションを追加します",
    en: "Adds an option to the pause screen to download converted lyrics in WEBVTT format",
    cn: "在暂停屏幕上添加一个选项，用于下载转换后的歌词，以WEBVTT格式",
    tw: "在暫停畫面上添加一個選項，下載轉換後的歌詞，格式為WEBVTT",
    ko: "일시 정지 화면에 변환된 가사를 WEBVTT 형식으로 다운로드하는 옵션을 추가합니다."
  }
  author = "Katie Frogs(translated by ryo)"

  load() {
    this.addEdits(
      new EditFunction(View.prototype, "init").load(str => {
        return plugins.insertAfter(str,
          'this.pauseOptions = strings.pauseOptions', `
        if(controller.lyrics){
          this.pauseOptions = [...this.pauseOptions, "Convert Lyrics"]
          this.pauseLyrics = this.pauseOptions.length - 1
        }`)
      }),
      new EditFunction(View.prototype, "pauseConfirm").load(str => {
        return plugins.insertAfter(str,
          'switch(pos){', `
        case this.pauseLyrics:
          this.getVtt()
          break`)
      }),
      new EditValue(View.prototype, "timeSeconds").load(() => this.timeSeconds),
      new EditValue(View.prototype, "getVtt").load(() => this.getVtt)
    )
  }

  timeSeconds(ms) {
    var s = ms / 1000
    var m = Math.floor(s / 60)
    var h = Math.floor(m / 60)
    s = (s % 60).toFixed(3).padStart(6, "0")
    m = (m % 60).toString().padStart(2, "0")
    if (h === 0) {
      return [m, s].join(":")
    } else {
      return [h.toString().padStart(2, "0"), m, s].join(":")
    }
  }

  getVtt() {
    if (!this.controller.lyrics) {
      return
    }
    var lyricsText = [
      ["WEBVTT Offset: 0"],
      ...this.controller.lyrics.lines.filter(line => line.text).map(line => [
        this.timeSeconds(line.start) + " --> " + this.timeSeconds(line.end),
        line.text
      ].join("\n"))
    ].join("\n\n") + "\n"
    
    var blob = new Blob([lyricsText], {
      type: "application/octet-stream"
    })
    
    var url = URL.createObjectURL(blob)
    var link = document.createElement("a")
    link.href = url
    if ("download" in HTMLAnchorElement.prototype) {
      link.download = this.controller.selectedSong.title + ".vtt"
    } else {
      link.target = "_blank"
    }
    link.innerText = "."
    link.style.opacity = "0"
    document.body.appendChild(link)
    setTimeout(() => {
      link.click()
      document.body.removeChild(link)
      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 5000)
    })
  }
}
