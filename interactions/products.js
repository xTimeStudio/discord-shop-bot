module.exports = {
    customId: 'products',
    description: 'Products interaction',
    async execute(client, interaction, Discord, wait, UserModel, { account }, addon) {
        const embed = new Discord.MessageEmbed()
            .setTitle('**Products menu: **')
            .setDescription(`**
Choose the product you want to buy!
Before you buy, check your balance!
**`)
        const row2 = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageSelectMenu()
                    .setCustomId('product-menu')
                    .setPlaceholder('Choose product')
                    .addOptions([
                        {
                            label: `Test product`,
                            value: 'f',
                            emoji: {
                                name: 'red',
                                id: '951586432324096100'
                              },
                            description: 'Test product description here.'
                        },
                    ])
            )

        addon ? (await interaction.reply(), await interaction.update({ embeds: [embed], components: [row2], ephemeral: true, flags: 64 }).catch(err => { 
            console.log(err)
        })) : await interaction.reply({ embeds: [embed], components: [row2], ephemeral: true, flags: 64 }).catch(err => { 
            console.log(err)
        });
    
    }
}