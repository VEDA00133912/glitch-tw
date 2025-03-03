export default class Plugin extends Patch {
	name = "D-pad Axis Input";
	name_langs = {
		ja: "D-pad スティック入力",
		en: "D-pad Axis Input",
		cn: "D-pad 轴输入",
		tw: "D-pad 軸輸入",
		ko: "D-pad 축 입력"
	};
	version = "25.03.01";
	description = "Binds axis input to D-pad for gamepads";
	description_langs = {
		ja: "ゲームパッドのD-padにスティック入力を紐づけします",
		en: "Binds axis input to D-pad for gamepads",
		cn: "将轴输入绑定到游戏手柄的D-pad",
		tw: "將軸輸入綁定到遊戲手柄的D-pad",
		ko: "게임 패드의 D-pad에 축 입력을 바인딩합니다"
	};
	author = "Katie Frogs (translated by ryo)";

	leftRightAxis = 0;
	upDownAxis = 1;

	strings = {
		leftRightAxis: {
			name: "Left-Right Axis",
			name_lang: {
				ja: "左右スティック",
				en: "Left-Right Axis",
				cn: "左右轴",
				tw: "左右軸",
				ko: "좌우 축"
			},
			description: "The number for the left-right axis, can be checked on gamepad-tester.com",
			description_lang: {
				ja: "左右スティックの番号は gamepad-tester.com で確認できます",
				en: "The number for the left-right axis, can be checked on gamepad-tester.com",
				cn: "左右轴的编号可以在 gamepad-tester.com 上检查",
				tw: "左右軸的編號可以在 gamepad-tester.com 上檢查",
				ko: "좌우 축 번호는 gamepad-tester.com에서 확인할 수 있습니다"
			}
		},
		upDownAxis: {
			name: "Up-Down Axis",
			name_lang: {
				ja: "上下スティック",
				en: "Up-Down Axis",
				cn: "上下轴",
				tw: "上下軸",
				ko: "상하 축"
			},
			description: "The number for the up-down axis, can be checked on gamepad-tester.com",
			description_lang: {
				ja: "上下スティックの番号は gamepad-tester.com で確認できます",
				en: "The number for the up-down axis, can be checked on gamepad-tester.com",
				cn: "上下轴的编号可以在 gamepad-tester.com 上检查",
				tw: "上下軸的編號可以在 gamepad-tester.com 上檢查",
				ko: "상하 축 번호는 gamepad-tester.com에서 확인할 수 있습니다"
			}
		}
	};

	load() {
		this.addEdits(
			new EditFunction(Gamepad.prototype, "play").load(str => {
				return plugins.insertBefore(
					str,
					`var leftRightAxis = this.getLeftRightAxis();
					var upDownAxis = this.getUpDownAxis();
					if (axes.length >= leftRightAxis) {
						force.l = force.l || axes[leftRightAxis] <= -0.5;
						force.r = force.r || axes[leftRightAxis] >= 0.5;
					}
					if (axes.length >= upDownAxis) {
						force.u = force.u || axes[upDownAxis] <= -0.5;
						force.d = force.d || axes[upDownAxis] >= 0.5;
					}
					if (leftRightAxis === 0 || upDownAxis === 0) {
						force.lsl = false;
						force.lsr = false;
					}
					if (leftRightAxis === 1 || upDownAxis === 1) {
						force.lsu = false;
						force.lsd = false;
					}`,
					'if(axes.length >= 10){'
				);
			}),
			new EditValue(Gamepad.prototype, "getLeftRightAxis").load(() => this.getLeftRightAxis.bind(this)),
			new EditValue(Gamepad.prototype, "getUpDownAxis").load(() => this.getUpDownAxis.bind(this))
		);
	}

	getLeftRightAxis() {
		return this.leftRightAxis;
	}

	getUpDownAxis() {
		return this.upDownAxis;
	}

	settings() {
		return Object.keys(this.strings).map(name => {
			var str = this.strings[name];
			return {
				name: str.name,
				name_lang: str.name_lang,
				description: str.description,
				description_lang: str.description_lang,
				type: "number",
				min: 0,
				default: this[name],
				getItem: () => this[name],
				setItem: value => {
					this[name] = value;
				}
			};
		});
	}
}
