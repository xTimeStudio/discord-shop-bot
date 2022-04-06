
const ProductModel = require('../Models/Product');
module.exports = {
    name: 'removeproduct',
    aliases: ['remove-product','remprod','rp','rproduct'],
    description: 'Remove product\nExample: rp f https://example.com/',
    isHidden: false,
    dm: [true],
    async execute(client, message, args, Discord, wait, UserModel, {}) {
        const permission = (await UserModel.findOne({login: message.author.id})).permission;
        if(!permission) return;
        const embed = new Discord.MessageEmbed()
        .setTitle(`Successfully!`)
        .setDescription(`**Removed product(-s) from database**`)
        .setFooter(message.author.username + '#' + message.author.discriminator)
        .setTimestamp();
        switch(args[0]) {
            case 'example':
                removeProductType(args[0], args);
                break;
            default:
                message.reply('types: [`example`]').catch(err => {});
                break;
        }
        async function removeProductType(type, args) {
                for (let i = 2; i < args.length; i++) {
                    let links = args[i].split('\n').join(' ');
                    let gg = links.split(' ');
                    gg.forEach(async (g) => {
                        ProductModel.findOneAndDelete({ link: g, type: type }, function (err, docs) { })
                    })
                }
            await message.reply({embeds: [embed]}).catch(err => {});
            wait(2000);
            await client.updateProducts()
        }
    }
}