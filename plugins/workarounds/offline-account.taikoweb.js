export default class Plugin extends Patch {
  name = "Offline Account";
  version = "25.03.01";
  description = "Allows setting your name and customizing your Don without logging in";
  author = "Katie Frogs(translated by ryo)";
  
  name_lang = {
    ja: "オフラインアカウント",
    en: "Offline Account",
    cn: "离线账户",
    tw: "離線帳戶",
    ko: "오프라인 계정"
  };

  description_lang = {
    ja: "ログインせずに名前を設定したり、どんちゃんをカスタマイズしたりすることができます",
    en: "Allows setting your name and customizing your Don without logging in",
    cn: "允许在不登录的情况下设置用户名并自定义Don",
    tw: "允許在不登錄的情況下設置名稱並自定義Don",
    ko: "로그인하지 않고 이름을 설정하고 Don을 사용자화할 수 있습니다."
  };

  strings = {
    accountSettings: {
      name: "Account Settings",
      name_lang: {
        ja: "アカウント設定",
        en: "Account Settings",
        cn: "账户设置",
        tw: "帳戶設置",
        ko: "계정 설정"
      },
      description: "Customize your offline account.",
      description_lang: {
        ja: "オフラインアカウントをカスタマイズします",
        en: "Customize your offline account.",
        cn: "自定义您的离线账户。",
        tw: "自定義您的離線帳戶。",
        ko: "오프라인 계정을 사용자화합니다."
      }
    }
  };

  load() {
    this.offlineAccount = {
      loggedIn: true,
      username: "Don-chan",
      displayName: "Don-chan",
      don: {
        body_fill: defaultDon.body_fill,
        face_fill: defaultDon.face_fill
      }
    };
    this.loadAccount();
    
    this.addEdits(
      new EditValue(gameConfig, "accounts").load(() => true),
      new EditValue(window, "account").load(() => {
        return this.offlineAccount;
      }),
      new EditFunction(Account.prototype, "accountForm").load(str => {
        str = plugins.strReplace(str, 'this.items.push(this.logoutButton)', ``);
        return str + `
          this.accountPass.style.display = "none";
          this.accountDel.style.display = "none";
          this.logoutButton.style.display = "none";`;
      }),
      new EditValue(Account.prototype, "request").load(() => this.request.bind(this)),
      new EditFunction(ScoreStorage.prototype, "load").load(str => {
        return plugins.strReplace(str, 'account.loggedIn', `false`);
      }),
      new EditFunction(scoreStorage, "load").load(str => {
        return str.replace('account.loggedIn', `false`);
      }),
      new EditFunction(ScoreStorage.prototype, "write").load(str => {
        return plugins.strReplace(str, 'account.loggedIn', `false`);
      }),
      new EditFunction(scoreStorage, "write").load(str => {
        return str.replace('account.loggedIn', `false`);
      }),
      new EditFunction(ScoreStorage.prototype, "sendToServer").load(str => {
        return plugins.strReplace(str, 'if(account.loggedIn){', `if(false){`);
      }),
      new EditFunction(scoreStorage, "sendToServer").load(str => {
        return str.replace('if(account.loggedIn){', `if(false){`);
      })
    );
  }

  request(url, obj, get) {
    switch(url) {
      case "account/display_name":
        this.offlineAccount.username = obj.display_name;
        this.offlineAccount.displayName = obj.display_name;
        this.saveAccount();
        return Promise.resolve({
          display_name: this.offlineAccount.displayName
        });
      case "account/don":
        this.offlineAccount.don.body_fill = obj.body_fill;
        this.offlineAccount.don.face_fill = obj.face_fill;
        this.saveAccount();
        return Promise.resolve({
          don: this.offlineAccount.don
        });
      default:
        return Promise.reject({
          status: "error"
        });
    }
  }

  saveAccount() {
    localStorage.setItem("offlineAccount", JSON.stringify({
      name: this.offlineAccount.displayName,
      don: this.offlineAccount.don
    }));
  }

  loadAccount() {
    var account = localStorage.getItem("offlineAccount");
    if (account) {
      try {
        account = JSON.parse(account);
      } catch (e) {}
    }
    if (account) {
      if (account.name) {
        this.offlineAccount.username = account.name;
        this.offlineAccount.displayName = account.name;
      }
      if (account.don) {
        if (account.don.body_fill) {
          this.offlineAccount.don.body_fill = account.don.body_fill;
        }
        if (account.don.face_fill) {
          this.offlineAccount.don.face_fill = account.don.face_fill;
        }
      }
    }
  }

  unload() {
    delete this.offlineAccount;
  }
}
