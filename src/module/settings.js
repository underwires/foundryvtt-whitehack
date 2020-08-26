export const registerSettings = function () {

  game.settings.register("whitehack", "initiative", {
    name: game.i18n.localize("WH.Setting.Initiative"),
    hint: game.i18n.localize("WH.Setting.InitiativeHint"),
    default: "group",
    scope: "world",
    type: String,
    config: true,
    choices: {
      disabled: "WH.Setting.InitiativeOnce",
      rerolled: "WH.Setting.InitiativeReroll",
      reset: "WH.Setting.InitiativeReset",
      group: "WH.Setting.InitiativeGroup",
    },
    onChange: _ => window.location.reload()
  });

  game.settings.register("whitehack", "ascendingAC", {
    name: game.i18n.localize("WH.Setting.AscendingAC"),
    hint: game.i18n.localize("WH.Setting.AscendingACHint"),
    default: false,
    scope: "world",
    type: Boolean,
    config: true,
    onChange: _ => window.location.reload()
  });

  game.settings.register("whitehack", "morale", {
    name: game.i18n.localize("WH.Setting.Morale"),
    hint: game.i18n.localize("WH.Setting.MoraleHint"),
    default: false,
    scope: "world",
    type: Boolean,
    config: true,
  });

  game.settings.register("whitehack", "encumbranceOption", {
    name: game.i18n.localize("WH.Setting.Encumbrance"),
    hint: game.i18n.localize("WH.Setting.EncumbranceHint"),
    default: "detailed",
    scope: "world",
    type: String,
    config: true,
    choices: {
      disabled: "WH.Setting.EncumbranceDisabled",
      basic: "WH.Setting.EncumbranceBasic",
      detailed: "WH.Setting.EncumbranceDetailed",
      complete: "WH.Setting.EncumbranceComplete",
    },
    onChange: _ => window.location.reload()
  });

  game.settings.register("whitehack", "significantTreasure", {
    name: game.i18n.localize("WH.Setting.SignificantTreasure"),
    hint: game.i18n.localize("WH.Setting.SignificantTreasureHint"),
    default: 800,
    scope: "world",
    type: Number,
    config: true,
    onChange: _ => window.location.reload()
  });
};
