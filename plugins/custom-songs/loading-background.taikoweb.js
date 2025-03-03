export default class Plugin extends Patch{
	name = "Loading Background"
	version = "25.03.01"
	description = "Shows a custom loading background if a loading.png file is in the same directory as the chart"
	author = "Katie Frogs(translated by ryo)"
	
  name_lang = {
    ja: "背景画像の読み込み",
    en: "Loading Background",
    cn: "载入背景",
    tw: "載入背景",
    ko: "배경 로드"
  };
  
  description_lang = {
    ja: "譜面フォルダ内にloading.pngがある場合、読み込み時にそれを表示します",
    en: "Shows a custom loading background if a loading.png file is in the same directory as the chart",
    cn: "如果与图表位于同一目录下的是 loading.png 文件，则显示自定义加载背景",
    tw: "如果 loading.png 檔案與圖表位於同一目錄，則會顯示自訂的載入背景。",
    ko: "loading.png 파일이 차트와 같은 디렉터리에 있는 경우 사용자 지정 로딩 배경을 표시합니다."
  };

    
	load(){
		this.addEdits(
			new EditFunction(ImportSongs.prototype, "addTja").load(str => {
				return plugins.insertBefore(str,
				`songObj.loadingBg = this.otherFiles[file.path.slice(0, file.path.lastIndexOf("/") + 1).toLowerCase() + "loading.png"]
				`, 'if(titleLangAdded){')
			}),
			new EditFunction(ImportSongs.prototype, "addOsu").load(str => {
				return plugins.insertBefore(str,
				`songObj.loadingBg = this.otherFiles[file.path.slice(0, file.path.lastIndexOf("/") + 1).toLowerCase() + "loading.png"]
				`, 'if(title){')
			}),
			new EditFunction(SongSelect.prototype, "toLoadSong").load(str => {
				str = plugins.insertBefore(str,
				`var loadingBg
				if(selectedSong.loadingBg){
					var promise = selectedSong.loadingBg.blob().then(blob => {
						var blobUrl = URL.createObjectURL(blob)
						var img = document.createElement("img")
						var promise2 = pageEvents.load(img).then(() => {
							assets.image["loading.png"] = img
							loader.assetsDiv.appendChild(img)
							loadingBg = blobUrl
						}, () => Promise.resolve())
						img.id = "loading.png"
						img.src = blobUrl
						return promise2
					}, () => Promise.resolve())
				}else{
					var promise = Promise.resolve()
				}
				promise.then(() => {
				`, 'new LoadSong({')
				str = plugins.insertAfter(str, '"lyrics": selectedSong.lyrics', `,
				loadingBg: loadingBg`)
				return str + `
				})`
			}),
			new EditFunction(LoadSong.prototype, "run").load(str => {
				return plugins.insertBefore(str,
				`if(song.loadingBg){
					this.loadingBg = song.loadingBg
					var loadSongDiv = document.getElementById("load-song")
					loadSongDiv.style.backgroundImage = "url('" + this.loadingBg + "')"
					loadSongDiv.style.backgroundSize = "cover"
					this.addPromise(new Promise(resolve => setTimeout(resolve, 1000)))
				}
				`, 'this.songObj = songObj')
			}),
			new EditFunction(LoadSong.prototype, "clean").load(str => {
				return str + `
				if(this.loadingBg){
					loader.assetsDiv.removeChild(assets.image["loading.png"])
					delete assets.image["loading.png"]
					URL.revokeObjectURL(this.loadingBg)
				}`
			})
		)
	}
}