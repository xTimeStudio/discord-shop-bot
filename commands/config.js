
module.exports = {
    name: 'config',
    aliases: ['c'],
    isHidden: false,
    description: 'Config to change prices\nExample: c price example 1000',
    dm: [true, false],
    async execute(client, message, args, Discord, wait, UserModel, {}) {
        const ArgumentEmbed = new Discord.MessageEmbed()
.setColor('#fff')
.setDescription(`**No arguments provided!**`)
.setTimestamp()
.setTitle('❌ Denied!')
        const permission = (await UserModel.findOne({login: message.author.id})).permission;
        if(!permission) return;
        let configType = args[0];
                switch (configType) {
                    case 'price':

                        let type = args[1];
                        if (!type) return message.reply({ content: `Types: \`f | c | fg | cg | fy | cy\``, embeds: [ArgumentEmbed] }).catch(err => {

                        })

                        switch (type) {
                            case 'example':
                                let price = args[2];
                                if (isNaN(price)) return message.reply({ content: `Price must be a number!`, embeds: [ArgumentEmbed] }).catch(err => {

                                })
                                await client.PriceModel2.findOneAndUpdate({ type: 'example' }, { price: +price, priceStr: `${price}` }, { new: true })
                                let nitrof = await client.PriceModel2.findOne({ type: 'example' })
                                let messageFull = new Discord.MessageEmbed()
                                    .setTitle('✅ Success !')
                                    .setDescription(`
                            **Обновил базу данных цен**:
                            Type: \`${nitrof.type}\`
                            Price: \`${nitrof.price}\`
                            PriceStringed: \`\'${nitrof.priceStr}\'\`
                            `)
                                    .setTimestamp()
                                message.reply({ embeds: [messageFull] }).catch(err => {

                                })
                                client.updatePrice();
                                break;
                        
                            default:
                                return message.reply({ content: `Types: \`example\``, embeds: [ArgumentEmbed] }).catch(err => {

                                })
                                break;
                        }
                        break;
                    default:
                        return message.reply({ content: `Config Types: \`price\``, embeds: [ArgumentEmbed] }).catch(err => {

                        })
                        break;
                }
    }
}
