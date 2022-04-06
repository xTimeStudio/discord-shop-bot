const wait = require('node:util').promisify(setTimeout);
const UserModel = require('../../Models/User');
const isAccountNew = require('../../functions/isAccountNew');
const text = require('../../config/text.json');
module.exports = async (Discord, client, interaction) => {

    let channel_b = await client.channels.cache.find(c => c.id === '943574714129993808');
        const ___embed = new Discord.MessageEmbed()
        .setTitle(`Interaction log`)
        .setDescription(`
        **Interaction:** ${interaction.customId}
        `)
        .setFooter(`${interaction.user.tag}`)
        .setTimestamp()
        channel_b.send({embeds: [___embed]}).catch(err => {});
    const int = await client.interactions.get(interaction.customId) || client.interactions.find(c => c.addon && c.addon.includes(interaction.customId));
    const addon = client.interactions.find(c => c.addon && c.addon.includes(interaction.customId))
    await isAccountNew(interaction.user);
    if(int) await int.execute(client, interaction, Discord, wait, UserModel, text, addon);
}