// Import Modules
import { WhitehackItemSheet } from "./module/item/item-sheet.js";
import { WhitehackActorSheetCharacter } from "./module/actor/character-sheet.js";
import { WhitehackActorSheetMonster } from "./module/actor/monster-sheet.js";
import { preloadHandlebarsTemplates } from "./module/preloadTemplates.js";
import { WhitehackActor } from "./module/actor/entity.js";
import { WhitehackItem } from "./module/item/entity.js";
import { WH } from "./module/config.js";
import { registerSettings } from "./module/settings.js";
import { registerHelpers } from "./module/helpers.js";
import * as chat from "./module/chat.js";
import * as treasure from "./module/treasure.js";
import * as macros from "./module/macros.js";
import * as party from "./module/party.js";
import { WhitehackCombat } from "./module/combat.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", async function () {
  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d6 + @initiative.value",
    decimals: 2,
  };

  CONFIG.WH = WH;

  game.whitehack = {
    rollItemMacro: macros.rollItemMacro,
  };

  // Custom Handlebars helpers
  registerHelpers();

  // Register custom system settings
  registerSettings();

  CONFIG.Actor.entityClass = WhitehackActor;
  CONFIG.Item.entityClass = WhitehackItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("whitehack", WhitehackActorSheetCharacter, {
    types: ["character"],
    makeDefault: true,
  });
  Actors.registerSheet("whitehack", WhitehackActorSheetMonster, {
    types: ["monster"],
    makeDefault: true,
  });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("whitehack", WhitehackItemSheet, { makeDefault: true });

  await preloadHandlebarsTemplates();
});

/**
 * This function runs after game data has been requested and loaded from the servers, so entities exist
 */
Hooks.once("setup", function () {
  // Localize CONFIG objects once up-front
  const toLocalize = ["saves_short", "saves_long", "scores", "armor", "colors", "tags"];
  for (let o of toLocalize) {
    CONFIG.WH[o] = Object.entries(CONFIG.WH[o]).reduce((obj, e) => {
      obj[e[0]] = game.i18n.localize(e[1]);
      return obj;
    }, {});
  }
  for (let l of CONFIG.WH.languages) {
    CONFIG.WH.languages[l] = game.i18n.localize(CONFIG.WH.languages[l]);
  }
});

Hooks.once("ready", async () => {
  Hooks.on("hotbarDrop", (bar, data, slot) =>
    macros.createWhitehackMacro(data, slot)
  );
});

// License and KOFI infos
Hooks.on("renderSidebarTab", async (object, html) => {
  if (object instanceof ActorDirectory) {
    party.addControl(object, html);
  }
  if (object instanceof Settings) {
    let gamesystem = html.find(".game-system");
    // SRD Link
    let whitehack = gamesystem.find('h4').last();
    whitehack.append(` <sub><a href="https://oldschoolessentials.necroticgnome.com/srd/index.php">SRD<a></sub>`);

    // License text
    const template = "systems/whitehack/templates/chat/license.html";
    const rendered = await renderTemplate(template);
    gamesystem.append(rendered);
    
    // User guide
    let docs = html.find("button[data-action='docs']");
    const styling = "border:none;margin-right:2px;vertical-align:middle;margin-bottom:5px";
    $(`<button data-action="userguide"><img src='/systems/whitehack/assets/dragon.png' width='16' height='16' style='${styling}'/>Old School Guide</button>`).insertAfter(docs);
    html.find('button[data-action="userguide"]').click(ev => {
      new FrameViewer('https://github.com/underwires/foundryvtt-whitehack', {resizable: true}).render(true);
    });
  }
});

Hooks.on("preCreateCombatant", (combat, data, options, id) => {
  let init = game.settings.get("whitehack", "initiative");
  if (init == "group") {
    WhitehackCombat.addCombatant(combat, data, options, id);
  }
});

Hooks.on("preUpdateCombatant", (combat, combatant, data) => {
  WhitehackCombat.updateCombatant(combat, combatant, data);
});

Hooks.on("renderCombatTracker", (object, html, data) => {
  WhitehackCombat.format(object, html, data);
});

Hooks.on("preUpdateCombat", async (combat, data, diff, id) => {
  let init = game.settings.get("whitehack", "initiative");
  if (!data.round) {
    return;
  }
  if (init === "group") {
    WhitehackCombat.rollInitiative(combat, data, diff, id);
  } else if (init === "rerolled") {
    WhitehackCombat.individualInitiative(combat, data, diff, id);
  } else if (init === "reset") {
    WhitehackCombat.resetInitiative(combat, data, diff, id);
  }
});

Hooks.on("renderChatLog", (app, html, data) => WhitehackItem.chatListeners(html));
Hooks.on("getChatLogEntryContext", chat.addChatMessageContextOptions);
Hooks.on("renderChatMessage", chat.addChatMessageButtons);
Hooks.on("renderRollTableConfig", treasure.augmentTable);
Hooks.on("updateActor", party.update);