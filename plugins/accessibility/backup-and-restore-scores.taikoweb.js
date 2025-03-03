export default class Plugin extends Patch {
  name = "Backup and Restore Scores";
  name_lang = {
    ja: "スコアのバックアップと復元",
    en: "Backup and Restore Scores",
    cn: "备份和恢复分数",
    tw: "備份和恢復分數",
    ko: "점수 백업 및 복원",
  }
  
  version = "25.03.01"
  description = "Save and load score data to a file"
  
  description_lang = {
    ja: "スコアデータを保存、読み込みします",
    en: "Save and load score data to a file",
    cn: "将分数数据保存和加载到文件中",
    tw: "儲存及載入得分資料至檔案",
    ko: "점수 데이터를 파일에 저장 및 불러오기",
  }
  
  author = "Katie Frogs(translated by ryo)"

  settingsOpts = {
    saveScores: {
      name: "Save Scores",
      name_lang: {
        ja: "スコアを保存",
        en: "Save Scores",
        cn: "分数保存",
        tw: "分數保存",
        ko: "점수 저장",
      },
      description: "Exports all the crowns and scores to a .json file",
      description_lang: {
        ja: "jsonファイルにスコアと王冠の記録を保存します",
        en: "Save Scores",
        cn: "将所有皇冠和分数导出到 .json 文件中",
        tw: "匯出所有冠軍和得分至 .json 檔案",
        ko: "모든 크라운과 점수를 .json 파일로 내보내기",
      },
      options: ["Download"],
      options_lang: {
        ja: "ダウンロード",
        en: "Download",
        cn: "下载",
        tw: "下載",
        ko: "다운로드",
      },
      setItem: this.export.bind(this),
    },
    loadScores: {
      name: "Load Scores",
      name_lang: {
        ja: "スコアの読み込み",
        en: "Load Scores",
        cn: "加载分数",
        tw: "加載分數",
        ko: "로드 점수",
      },
      description: "Imports all the scores from a .json file, merging with existing ones",
      description_lang: {
        ja: ".jsonファイルからすべてのスコアをインポートし、既存の記録に反映させます",
        en: "Load Scores",
        cn: "从 .json 文件中导入所有分数，并与现有分数合并",
        tw: "從 .json 檔案匯入所有得分，與現有得分合併",
        ko: ".json 파일에서 모든 악보를 가져와 기존 악보와 병합합니다.",
      },
      options: ["Browse..."],
      options_lang: {
        ja: "ファイルを閲覧...",
        en: "Browse...",
        cn: "浏览....",
        tw: "瀏覽....",
        ko: "찾아보기....",
      },
      setItem: this.import.bind(this),
    },
  }

  strings = {
    scoresInvalid: "Selected file is not a valid scores file",
    scoresInvalid_lang: {
      ja: "選択したファイルは有効なスコアファイルではありません",
      en: "Selected file is not a valid scores file",
      cn: "所选文件不是有效的分数文件",
      tw: "所選文件不是有效的分數文件",
      ko: "선택한 파일은 유효한 점수 파일이 아닙니다",
    },
    noScores: "No scores were found in the provided file",
    noScores_lang: {
      ja: "提供されたファイルにスコアは見つかりませんでした",
      en: "No scores were found in the provided file",
      cn: "提供的文件中未找到分数",
      tw: "提供的文件中未找到分數",
      ko: "제공된 파일에서 점수를 찾을 수 없습니다",
    },
    scoresImported: "%s scores imported",
    scoresImported_lang: {
      ja: "%s 件のスコアをインポートしました",
      en: "%s scores imported",
      cn: "已导入 %s 个分数",
      tw: "已導入 %s 個分數",
      ko: "%s개의 점수가 가져와졌습니다",
    },
    scoresNotImported: "Scores could not be imported, please try again",
    scoresNotImported_lang: {
      ja: "スコアをインポートできませんでした。もう一度お試しください",
      en: "Scores could not be imported, please try again",
      cn: "无法导入分数，请重试",
      tw: "無法導入分數，請重試",
      ko: "점수를 가져올 수 없습니다. 다시 시도해 주세요",
    },
  }
  
  selectSupported = SettingsView.prototype.getValue.toString().indexOf("current.options_lang") !== -1

  export() {
    let obj = {}
    if (account.loggedIn) {
      obj.display_name = account.displayName
      obj.don = account.don
    } else {
      obj.display_name = strings.defaultName
      obj.don = defaultDon
    }
    obj.scores = scoreStorage.prepareScores(scoreStorage.scoreStrings)
    obj.status = "ok"
    obj.username = account.loggedIn ? account.username : allStrings.en.defaultName

    let text = JSON.stringify(obj) + "\n"
    let blob = new Blob([text], { type: "application/octet-stream" })

    let url = URL.createObjectURL(blob)
    let link = document.createElement("a")
    link.href = url
    link.download = "taiko-web scores.json"
    link.style.opacity = "0"
    document.body.appendChild(link)

    setTimeout(() => {
      link.click();
      document.body.removeChild(link)
      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 5000)
    })
  }

  import() {
    this.cleanup()
    pageEvents.add(window, "song-select", this.cleanup.bind(this), this)
    let browse = document.createElement("input")
    this.browseButton = browse
    browse.type = "file"
    browse.style.opacity = "0"
    document.body.appendChild(browse)

    setTimeout(() => {
      browse.click()
    })
  }

  browseChange(event) {
    if (event.target.files.length) {
      let file = new LocalFile(event.target.files[0])
      file.read()
        .then(data => {
          let obj
          try {
            obj = JSON.parse(data)
          } catch (e) {
            return alert(plugins.getLocalTitle(this.strings.scoresInvalid, this.strings.scoresInvalid_lang))
          }
          if (Array.isArray(obj.scores) && obj.scores.length) {
            let scores = {}
            obj.scores.forEach(scoreObj => {
              let { hash, score } = scoreObj
              if (typeof hash === "string" && typeof score === "string" && hash && score) {
                let diffArray = score.split(";")
                let songAdded = false
                for (let i in scoreStorage.difficulty) {
                  if (diffArray[i]) {
                    let crown = parseInt(diffArray[i][0]) || 0
                    let scoreData = { crown: scoreStorage.crownValue[crown] || "" }
                    let scoreArray = diffArray[i].slice(1).split(",")
                    for (let j in scoreStorage.scoreKeys) {
                      let name = scoreStorage.scoreKeys[j]
                      scoreData[name] = parseInt(scoreArray[j] || 0, 36) || 0
                    }
                    if (!songAdded) {
                      scores[hash] = { title: null }
                      songAdded = true
                    }
                    scores[hash][scoreStorage.difficulty[i]] = scoreData
                  }
                }
              }
            })

            let amount = Object.keys(scores).length
            if (amount) {
              return scoreStorage.save().then(() => {
                alert(plugins.getLocalTitle(this.strings.scoresImported, this.strings.scoresImported_lang).replace("%s", amount))
              }).catch(() => {
                alert(plugins.getLocalTitle(this.strings.scoresNotImported, this.strings.scoresNotImported_lang))
              })
            } else {
              alert(plugins.getLocalTitle(this.strings.scoresImported, this.strings.scoresImported_lang).replace("%s", amount))
            }
          } else {
            alert(plugins.getLocalTitle(this.strings.noScores, this.strings.noScores_lang))
          }
        })
        .finally(() => {
          this.cleanup()
        })
    }
  }

  cleanup() {
    pageEvents.remove(window, "song-select", this)
    if (this.browseButton) {
      pageEvents.remove(this.browseButton, "change")
      this.browseButton.remove()
      this.browseButton = null
    }
  }

  unload() {
    this.cleanup()
  }

  settings() {
    return Object.keys(this.settingsOpts).map(name => {
      let str = this.settingsOpts[name]
      return {
        name: str.name,
        name_lang: str.name_lang,
        description: str.description,
        description_lang: str.description_lang,
        type: this.selectSupported ? "select" : "toggle",
        options: str.options,
        options_lang: str.options_lang,
        default: this.selectSupported ? str.options[0] : false,
        getItem: () => (this.selectSupported ? str.options[0] : false),
        setItem: str.setItem,
      }
    })
  }
}
