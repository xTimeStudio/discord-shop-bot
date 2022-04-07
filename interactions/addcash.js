module.exports = {
    customId: 'addcash',
    description: 'Cash interaction',
    async execute(client, interaction, Discord, wait, UserModel, { introduction }) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`**Choose price in menu**`)
            .setFooter(interaction.user.username + '#' + interaction.user.discriminator)
            .setTimestamp()

        const row2 = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageSelectMenu()
                    .setCustomId('money-menu')
                    .setPlaceholder('Choose how much you want to add')
                    .addOptions([
                        {
                            label: `${client.prices.Example.Price.price} - Example product`,
                            value: 'example',
                        },

                        // {
                        //     label: `${client.prices.Spotify.Price.price} - Spotify`,
                        //     value: 's',
                        // },
                        {
                            label: 'Other Price (1-15000)',
                            value: 'other'
                        }
                    ])
            );
        
        await interaction.update({ embeds: [embed], components: [row2], ephemeral: true, flags: 64 }).catch(err => { })
    }
}

