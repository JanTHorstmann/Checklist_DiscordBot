// Importiere die benötigten Module von discord.js
const { Client, GatewayIntentBits, Partials, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

// Erstelle einen neuen Client mit den entsprechenden Intents und Partials
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// Präfix für die Bot-Befehle
const prefix = '!';

// Checkliste mit Aufgaben und ihrem Status
let checklistItems = [
    { name: 'Königin Luna', completed: false },
    { name: 'Der graf', completed: false },
    { name: 'Kralj Tvrto I', completed: false },
    { name: 'Faranee', completed: false },
    { name: 'MyladyAytian', completed: false },
    { name: 'Mell', completed: false },
    { name: 'Felix c.', completed: false },
    { name: 'Jonathan van Del', completed: false },
    { name: 'Sir Morton', completed: false },
    { name: 'Xanisa', completed: false },
    { name: 'Timotheus', completed: false },
    { name: 'Rei Furuya', completed: false },
    { name: 'Countess Akasha', completed: false },
    { name: 'Lara Alexis', completed: false },
    { name: 'Cathi911', completed: false }
];
let checklistTitle = '';

// Event-Listener, wenn der Bot erfolgreich gestartet ist
client.once('ready', () => {
    console.log('Bot is online!');
});

// Event-Listener, wenn eine neue Nachricht erstellt wird
client.on('messageCreate', message => {
    if (message.content.startsWith(prefix)) {
        const [command, ...args] = message.content.slice(prefix.length).trim().split(' ');
        if (command === 'createChecklist') {
            const checklistName = args.join(' ');
            createChecklist(message, checklistName);
        } else if (command === 'addItem') {
            const itemName = args.join(' ');
            addItem(message, itemName);
        } else if (command === 'removeItem') {
            const itemName = args.join(' ');
            removeItem(message, itemName);
        } else if (command === 'checkliste') {
            sendChecklist(message);
        }
    }
});

// Funktion zum Erstellen einer neuen Checkliste
function createChecklist(message, checklistName) {
    checklistItems = [];
    message.channel.send(`Eine neue Checkliste mit dem Namen "${checklistName}" wurde erstellt.`);
    checklistTitle = checklistName
}

// Funktion zum Hinzufügen eines Items zur Checkliste
function addItem(message, itemName) {
    const existingItem = checklistItems.find(item => item.name === itemName);
    if (existingItem) {
        message.channel.send(`Das Item "${itemName}" existiert bereits.`);
    } else {
        checklistItems.push({ name: itemName, completed: false });
        message.channel.send(`Das Item "${itemName}" wurde zur Checkliste hinzugefügt.`);
    }
}

// Funktion zum Entfernen eines Items aus der Checkliste
function removeItem(message, itemName) {
    const index = checklistItems.findIndex(item => item.name === itemName);
    if (index !== -1) {
        checklistItems.splice(index, 1);
        message.channel.send(`Das Item "${itemName}" wurde aus der Checkliste entfernt.`);
    } else {
        message.channel.send(`Das Item "${itemName}" existiert nicht in der Checkliste.`);
    }
}

// Funktion zum Erstellen und Senden der Checkliste
async function sendChecklist(message) {
    // Erstelle ein Embed für die Checkliste
    const checklistEmbed = new EmbedBuilder()
        .setTitle('MVP')
        .setDescription('Wähle folgenden Teilnehmer:')
        .setColor('#0099ff');

    // Füge die Checkliste-Items zum Embed hinzu
    checklistItems.forEach((item, index) => {
        checklistEmbed.addFields({ name: item.name, value: item.completed ? `☑ gewählt ${new Date().getDate()}.${new Date().getMonth()}.${new Date().getFullYear()}` : '☐ Nicht gewählt' });
    });

    // Erstelle Buttons für jede Aufgabe
    const buttons = checklistItems.map((item, index) => {
        return new ButtonBuilder()
            .setCustomId(`checklist_${index}`)
            .setLabel(item.name)
            .setStyle(item.completed ? ButtonStyle.Success : ButtonStyle.Secondary);
    });

    // Erstelle Action Rows für die Buttons (maximal 5 Buttons pro Row)
    const actionRows = [];
    for (let i = 0; i < buttons.length; i += 5) {
        actionRows.push(new ActionRowBuilder().addComponents(buttons.slice(i, i + 5)));
    }

    // Sende das Embed und die Buttons in den Channel
    await message.reply({ embeds: [checklistEmbed], components: actionRows });
}

// Event-Listener für Button-Interaktionen
client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        const index = parseInt(interaction.customId.split('_')[1]);
        if (checklistItems[index]) {
            checklistItems[index].completed = !checklistItems[index].completed;
            await interaction.deferUpdate();
            sendChecklist(interaction.message);
        }
    }
});

// Logging for Your Bot Token
//--------------------------//