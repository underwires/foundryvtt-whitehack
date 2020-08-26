export const preloadHandlebarsTemplates = async function () {
    const templatePaths = [
        //Character Sheets
        'systems/whitehack/templates/actors/character-html.html',
        'systems/whitehack/templates/actors/monster-html.html',
        //Actor partials
        //Sheet tabs
        'systems/whitehack/templates/actors/partials/character-header.html',
        'systems/whitehack/templates/actors/partials/character-attributes-tab.html',
        'systems/whitehack/templates/actors/partials/character-abilities-tab.html',
        'systems/whitehack/templates/actors/partials/character-spells-tab.html',
        'systems/whitehack/templates/actors/partials/character-inventory-tab.html',
        'systems/whitehack/templates/actors/partials/character-notes-tab.html',

        'systems/whitehack/templates/actors/partials/monster-header.html',
        'systems/whitehack/templates/actors/partials/monster-attributes-tab.html'
    ];
    return loadTemplates(templatePaths);
};
