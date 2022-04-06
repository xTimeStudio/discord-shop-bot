module.exports = {
    name: 'start',
    description: 'GUI bot',
    aliases: ['s'],
    isHidden: false,
    dm: [false, true],
    async execute(client, message, args, Discord, wait, UserModel, {start}) {
        const row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setEmoji(start.introductionLabel.emoji).setLabel(start.introductionLabel.label).setCustomId(start.introductionLabel.customId).setStyle(start.introductionLabel.style),new Discord.MessageButton().setEmoji(start.ProfileLabel.emoji).setLabel(start.ProfileLabel.label).setCustomId(start.ProfileLabel.customId).setStyle(start.ProfileLabel.style),new Discord.MessageButton().setEmoji(start.ProductLabel.emoji).setLabel(start.ProductLabel.label).setCustomId(start.ProductLabel.customId).setStyle(start.ProductLabel.style),
        new Discord.MessageButton().setEmoji(start.ReviewLabel.emoji).setLabel(start.ReviewLabel.label).setURL(start.ReviewLabel.URL).setStyle(start.ReviewLabel.style),
        );
        const embed = new Discord.MessageEmbed()
        .setTitle(start.Embed.title)
        .setDescription(start.Embed.description)
        .setFooter(message.author.username + '#' + message.author.discriminator)
        .setTimestamp();
        
        await message.reply({embeds: [embed], ephemeral: true, flags: 64, components: [row]}).catch(err => {})
        message.delete().catch(err => {})
    }
}
