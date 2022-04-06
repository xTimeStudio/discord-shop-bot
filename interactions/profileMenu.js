module.exports = {
    customId: 'profile-menu',
    description: 'Profile menu interaction',
    async execute(client, interaction, Discord, wait, UserModel, { account }) {
        if (!interaction.isSelectMenu()) return;
        switch (interaction.values[0]) {
            case 'history':
                (async function () {
                    const data = await UserModel.findOne({ login: interaction.user.id })
                    let string = "";
                    if (data.history.length > 0) {
                        if (data.history.length == 1) {
                            string = `Название: ${data.history[0].productName}(${data.history[0].productPrice}RUB)\nТовар: ${data.history[0].productLink}\n`
                        } else {
                            data.history.forEach(async dat => {
                                if (data.history.length == 1) {
                                    string = `Название: \`${dat.productName}(${dat.productPrice}RUB)\`\nТовар: \`${dat.productLink}\`\n`
                                } else if((data.history.length -1)== data.history.indexOf(dat)) {
                                    string += `Название: \`${dat.productName}(${dat.productPrice}RUB)\`\nТовар: \`${dat.productLink}\`\n`
                                } else {
                                string += `Название: \`${dat.productName}(${dat.productPrice}RUB)\`\nТовар: \`${dat.productLink}\`\n`
                                }
                            })
                        }
                    }
                    const embed = new Discord.MessageEmbed()
                        .setTitle(account.Embed.title)
                        .setDescription(`
**Balance:** \`${data.balance}\`
**You spend:** \`${data.total}\`
**Purchase History:**
${data.history.length > 0 ? string : '**`Empty`**'}
`)
.setFooter(interaction.user.username + '#' + interaction.user.discriminator)
.setTimestamp();
                    const row = new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageButton()
                                .setEmoji('🔙')
                                .setLabel('Return')
                                .setCustomId('profile_return')
                                .setStyle('SECONDARY'),
                        );
                    const row2 = new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageSelectMenu()
                                .setCustomId('profile-menu')
                                .setPlaceholder('Choose category')
                                .addOptions([
                                ])
                        );

                    await interaction.update({ embeds: [embed], components: [row2, row], ephemeral: true, flags: 64 }).catch(err => { })
                })()
                break;
            
        }
    }
}