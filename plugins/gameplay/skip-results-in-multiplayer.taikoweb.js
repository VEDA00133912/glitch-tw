export default class Plugin extends Patch{
	name = "Skip Results in Multiplayer"
	version = "25.03.01"
	description = "Enables skipping the results screen in multiplayer, however, the other player will not get to see the full results screen without the plugin"
	author = "Katie Frogs(translated by ryo)"
	
  name_lang = {
    ja: "リザルトスキップ(ネットプレイ)",
    en: "Skip Results in Multiplayer",
    cn: "在多人遊戲中跳過的結果",
    tw: "跳过 结果 在 多人游戏",
    ko: "멀티플레이어에서 결과 건너뛰기"
  }
  
  description_lang = {
    ja: "ネットプレイ時にリザルト画面をスキップできます。ただし相手側はこのプラグインを使用していないとリザルト画面をうまく表示できません",
    en: "Multiplayer Custom Songs",
    cn: "可在多人游戏中跳过结果屏幕，但如果没有插件，其他玩家将无法看到完整的结果屏幕",
    tw: "可在多人遊戲中跳過結果畫面，但是，如果沒有外掛程式，其他玩家將無法看到完整的結果畫面",
    ko: "멀티플레이어에서 결과 화면 건너뛰기를 활성화하지만, 플러그인이 없으면 다른 플레이어는 전체 결과 화면을 볼 수 없습니다."
  }
  
	load(){
		this.addEdits(
			new EditFunction(Scoresheet.prototype, "init").load(str => {
				str = plugins.insertAfter(str, 'if(this.session){', `
				var noteValue = p2.getMessage("note")
				if(noteValue){
					if(noteValue.skipResults){
						this.toScoresShown(true)
					}else if(noteValue.donSound){
						this.playSound("neiro_1_don", p2.player === 1 ? 1 : 0)
					}
				}`)
				return plugins.insertBefore(str,
				`if(response.type === "note" && response.value){
					if(response.value.skipResults){
						this.toScoresShown(true)
					}else if(response.value.donSound){
						this.playSound("neiro_1_don", p2.player === 1 ? 1 : 0)
					}
				}else `, 'if(response.type === "songsel"){')
			})
		),
		this.addEdits(
			new EditFunction(Scoresheet.prototype, "redraw").load(str => {
				return plugins.strReplace(str, 'this.session ? "" : "pointer"', `"pointer"`)
			})
		),
		this.addEdits(
			new EditFunction(Scoresheet.prototype, "toScoresShown").load((str, args) => {
				args.push("fromP2")
				str = plugins.strReplace(str, '!p2.session', `this.state.screen === "fadeIn"`)
				str = plugins.insertBefore(str,
				`if(!p2.session)
				`, 'this.controller.playSound')
				return str + `
				if(p2.session){
					if(fromP2){
						this.playSound("neiro_1_don", p2.player === 1 ? 1 : 0)
					}else{
						this.playSound("neiro_1_don", p2.player === 1 ? 0 : 1)
						p2.send("note", {
							score: 450,
							ms: 0,
							dai: 0,
							skipResults: true
						})
					}
				}`
			})
		),
		this.addEdits(
			new EditFunction(Scoresheet.prototype, "toSongsel").load(str => {
				str = plugins.insertAfter(str, 'if(!fromP2', ` && !p2.session`)
				return str + `
				if(p2.session && !fromP2){
					this.playSound("neiro_1_don", p2.player === 1 ? 0 : 1)
					p2.send("note", {
						score: 450,
						ms: 0,
						dai: 0,
						donSound: true
					})
					p2.send("songsel")
				}`
			})
		)
	}
}