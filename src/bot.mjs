import DiscordJS, { Intents, Message } from 'discord.js'
import dotenv from 'dotenv'
import { string } from 'zod'
dotenv.config()

const client = new DiscordJS.Client({
    intents:[
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
})

client.on('ready',() => {
    console.log(`${client.user.tag} bot ready.`)
    
    const guildID = '718615889364123720'
    const guild = client.guilds.cache.get(guildID)
    let commands

    if(guild) {
        commands = guild.commands
    } else {
        commands = client.applicaiton?.commands
    }

    commands?.create({
        name: 'binthis',
        description: 'Converts following message into binary.',
        options: [
            {
                name: 'text',
                description: 'Text to be converted',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
            }
        ]
    })

    commands?.create({
        name: 'unbinthis',
        description: 'Converts following binary into plaintext message.',
        options: [
            {
                name: 'binary',
                description: 'binary to be converted',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
            }
        ]
    })
    
})

client.on('interactionCreate', async (interaction) =>{
    if(!interaction.isCommand){
        return
    }
    const {commandName, options } = interaction
    

    if(commandName === 'binthis') {
        var text = options.getString('text') || 0
        var binary_output = textToBin(text)

        interaction.reply({
            content: `${binary_output}`,
            ephemeral: true,
        })

    }

    else if(commandName === 'unbinthis') {
        var binary = options.getString('binary') || 0
        var string_output = binToText(binary)
            
        interaction.reply({
            content: `${string_output}`,
            ephemeral: true,
        })
    }
})

client.on('messageCreate', (messageCreate) => {
    if(messageCreate.author==client.user){
        return
    }

    var str = messageCreate.content
    
    if (containsBinary(str)){
        var out = binToTextFull(str);
        messageCreate.reply(`I translated that message for you :) It says:\n${out}`)
    }
})

/** https://stackoverflow.com/questions/14430633/how-to-convert-text-to-binary-code-in-javascript/14430733 **/
function textToBin(text) {
    var length = text.length,
        output = [];
    for (var i = 0;i < length; i++) {
        var bin = text[i].charCodeAt().toString(2);
        output.push(Array(8-bin.length+1).join("0") + bin);
    } 
    return output.join(" ");
}

function binToText(bin) {
    const byteArray = bin.toString().split(' ')
    var str = ''
    for(var i = 0; i < byteArray.length ; i++){
        str += String.fromCharCode(parseInt(byteArray[i], 2))
    }
    if(str==="\u0000"){return "Something went wrong! Sorry :/"}
    return str

}

function binToTextFull(text) {
    var output_text = ''
    for(var i = 0; i < text.length; i++){
        var char = text[i]
        if(!((char==='0') || (char==='1'))){
            output_text+= char
        }
        else if (!containsBinary(text.substring(i,i+8))){
            output_text+= char
        }
        else{
            output_text+= binToText(extractBinary(text.substring(i, i+8)))
            i+=8
        }
    }
    return output_text
    
}

function containsBinary(text) {
    if(!(text.includes('0')||text.includes('1'))){
        return false
    }
    var consecutive = 0;
    for(var i = 0; i < text.length; i++){
        if(text[i]==='0'||text[i]==='1'){
            consecutive++
            if(consecutive === 8) return true
        }
        else{
            consecutive = 0
        }
    }
}

function extractBinary(text) {
    var str = ''
    var consecutive = 0;
    for(var i = 0; i < text.length; i++){
        if(text[i]==='0'||text[i]==='1'){
            consecutive++
            if(consecutive === 8) {
                for(var y = i-7; y <= i; y++){
                    str += text[y]
                }
                return str
            }
        }
        else{
            consecutive = 0
        }
    }
    return str
}

client.login(process.env.DISCORDJS_BOT_TOKEN);