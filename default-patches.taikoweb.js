export default class Plugin extends Patch {
  name = "Default patches"
  name_lang = {
    ja: "デフォルトパッチ",
    en: "Default patches",
    cn: "默认补丁",
    tw: "預設補丁",
    ko: "기본 패치",
    fr: "Patch par défaut",
    de: "Standard-Patches",
    es: "Parche predeterminado"
  }
  version = "23.01.11"
  description = "Opens the correct privacy file. Suppresses multiplayer errors. Allows importing assets through gdrive. Does not include the custom code in loader.js, which uses correct paths for api files."
  description_lang = {
    ja: "正しいプライバシーファイルを開きます。マルチプレイヤーエラーを抑制します。gdriveを通じてアセットのインポートを許可します。apiファイルの正しいパスを使用するloader.js内のカスタムコードは含まれていません。",
    en: "Opens the correct privacy file. Suppresses multiplayer errors. Allows importing assets through gdrive. Does not include the custom code in loader.js, which uses correct paths for api files.",
    cn: "打开正确的隐私文件。抑制多人游戏错误。允许通过gdrive导入资产。未包含在loader.js中使用正确路径的自定义代码。",
    tw: "打開正確的隱私文件。抑制多人遊戲錯誤。允許通過gdrive導入資產。未包含在loader.js中使用正確路徑的自訂代碼。",
    ko: "올바른 개인정보 파일을 엽니다. 멀티플레이어 오류를 억제합니다. gdrive를 통해 자산을 가져올 수 있습니다. api 파일에 대한 올바른 경로를 사용하는 loader.js의 사용자 정의 코드는 포함되지 않습니다.",
    fr: "Ouvre le fichier de confidentialité correct. Supprime les erreurs multijoueurs. Permet l'importation des ressources via gdrive. Ne comprend pas le code personnalisé dans loader.js, qui utilise les bons chemins pour les fichiers api.",
    de: "Öffnet die richtige Datenschutzdatei. Unterdrückt Multiplayer-Fehler. Ermöglicht das Importieren von Assets über gdrive. Enthält keinen benutzerdefinierten Code in loader.js, der die richtigen Pfade für API-Dateien verwendet.",
    es: "Abre el archivo de privacidad correcto. Suprime los errores multijugador. Permite importar activos a través de gdrive. No incluye el código personalizado en loader.js, que usa rutas correctas para los archivos api."
  }
  author = "Katie Frogs"

  load() {
    this.addEdits(
      new EditFunction(CustomSongs.prototype, "openPrivacy").load(str => {
        return plugins.insertAfter(str, 'open("privacy', `.txt`)
      }),
      new EditFunction(Account.prototype, "openPrivacy").load(str => {
        return plugins.insertAfter(str, 'open("privacy', `.txt`)
      }),
      new EditFunction(ImportSongs.prototype, "load").load(str => {
        return plugins.strReplace(str, '!this.limited && (path.indexOf("/taiko-web assets/")', `(path.indexOf("/taiko-web assets/")`)
      }),
      new EditFunction(LoadSong.prototype, "run").load(str => {
        str = plugins.strReplace(str, ' + "img/touch_drum.png"', ` + (gameConfig.assets_no_dir ? "touch_drum.png" : "img/touch_drum.png")`)
        return plugins.strReplace(str, ' + "img/"', ` + (gameConfig.assets_no_dir ? "" : "img/")`)
      }),
      new EditFunction(LoadSong.prototype, "loadSongBg").load(str => {
        return plugins.strReplace(str, ' + "img/"', ` + (gameConfig.assets_no_dir ? "" : "img/")`)
      })
    )
  }

  start() {
    p2.disable()
  }

  stop() {
    p2.enable()
  }
}