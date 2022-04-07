const ProductModel = require('../Models/Product')
const WlModel = require('../Models/Whitelist');
module.exports = {
    customId: 'product-menu',
    description: 'Money Menu interaction',
    async execute(client, interaction, Discord, wait, UserModel, { link, account }) {
        try {
        switch (interaction.values[0]) {
            case 'f':
            case 'c':
            case 'fg':
            case 'cg':
            case 's':
            case 'example':
            case 'fy':
            case 'cy':
                const NoStock = new Discord.MessageEmbed()
                    .setTitle('**No stock**')
                    .setDescription('Turn on notifications!')
                    .setFooter(interaction.user.username + '#' + interaction.user.discriminator)
                    .setTimestamp();
                const NoMoney = new Discord.MessageEmbed()
                    .setTitle('**No money!**')
                    .setDescription('Refill your balance in your profile!')
                    .setFooter(interaction.user.username + '#' + interaction.user.discriminator)
                    .setTimestamp();
                const Bought = new Discord.MessageEmbed()
                    .setTitle('**Thanks for buying**')
                    .setDescription('Thanks')
                    .setFooter(interaction.user.username + '#' + interaction.user.discriminator)
                    .setTimestamp();
                const userBuy = new Discord.MessageEmbed()
                .setTitle(`**<a:Verificado_:939231511192928327> Пользователь приобрел товар!**`)
                .setTimestamp();
                const rowRev = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setEmoji('<a:iPinkArrow:815817886005329930>')
                            .setLabel("Review")
                            .setURL(link)
                            .setStyle('LINK'),
                    );
                const row = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setEmoji(account.AddLabel.emoji)
                            .setLabel(account.AddLabel.label)
                            .setCustomId(account.AddLabel.customId)
                            .setStyle(account.AddLabel.style),
                    );
                (async function (type, interaction) {
                    let Arr = {
                        example: {
                            product: client.products.example,
                            price: client.prices.Example.Price.price
                        },
                        c: {
                            product: client.products.c,
                            price: client.prices.Classic.Price.price
                        },
                        fg: {
                            product: client.products.fg,
                            price: client.prices.FullGuar.Price.price
                        },
                        cg: {
                            product: client.products.cg,
                            price: client.prices.ClassicGuar.Price.price
                        },
                        fy: {
                            product: client.products.fy,
                            price: client.prices.FullY.Price.price
                        },
                        cy: {
                            product: client.products.cy,
                            price: client.prices.ClassicY.Price.price
                        },
                        // s: {
                        //     product: client.products.s,
                        //     price: client.prices.Spotify.Price.price
                        // },
                    };
                    if (Arr[type].product.length < 1) return interaction.update({ embeds: [NoStock], components: [] }).catch(err => { });
                    let user = await UserModel.findOne({ login: interaction.user.id });
                    if (user.balance < Arr[type].price) return interaction.update({ embeds: [NoMoney], components: [row] }).catch(err => { });

                    const isPaid = (async function (user, price) {
                        const USER = await UserModel.findOne({ login: user.id });   
                        if (USER.balance < price) return false;
                        await UserModel.findOneAndUpdate({ login: user.id }, { total: (USER.total + +price), balance: (USER.balance - +price) })
                        return true;
                    })(interaction.user, Arr[type].price)
                    
                    if (isPaid) {
                        user = await UserModel.findOne({ login: interaction.user.id });
                        (async function (user) {
                            if (!client.roleBuyerId) return;
                            let guild = await client.guilds.fetch(client.guildId).catch(err => { });
                            let user_ = await guild.members.fetch(user.id).catch(err => { });
                            let role = await guild.roles.fetch(client.roleBuyerId).catch(err => { });
                            user_.roles.add(role).catch(err => { });
                        })(interaction.user);
                        const obj = {
                            productName: type == 'example' ? 'Example' : type == 'c' ? 'Nitro Classic' : type == 'fg' ? 'Nitro Full Гарантия' : type == 'cg' ? 'Nitro Classic Гарантия' : type == 'fy' ? 'Nitro Boost Year' : 'Nitro Classic Year',
                            productPrice: Arr[type].price,
                            productLink: Arr[type].product[0].link
                        };



                        typeof Arr[type].product[0].addressProduct == typeof String ?
                            interaction.update({
                                content: `
                                **<:FantasticGift:936484399199969300> Product:** ${Arr[type].product[0].link}
                                **Адрес (Доступ к подписке):** ${Arr[type].product[0].addressProduct}
                                `, embeds: [Bought], components: [rowRev]
                            }).catch(err => {

                            })
                            :
                            interaction.update({
                                content: `
                                 **<:FantasticGift:936484399199969300> Product:** ${Arr[type].product[0].link}
                                 `, embeds: [Bought], components: [rowRev]
                            }).catch(err => {

                            }), await UserModel.findOneAndUpdate({ login: interaction.user.id }, { $push: { history: obj } }, { new: true });
                            await ProductModel.findOneAndDelete({link: Arr[type].product[0].link,
                                 id: Arr[type].product[0].id}
                                 , (er, a) => {}).clone()
                                 .catch(err => {
                                     console.log(err);
                                 });

                                
                            await client.updateProducts();
                            user = await UserModel.findOne({ login: interaction.user.id });
                            try {
                                userBuy.setDescription(`
User <@${interaction.user.id}> | ${interaction.user.id} bought ${obj.productName} for ${obj.productPrice}rub
Current balance: ${user.balance} (before - ${(user.balance + obj.productPrice)})
Spend: ${user.total}
Product: ${obj.productLink}
`)
.setFooter(interaction.user.username + '#' + interaction.user.discriminator)
                                await WlModel.find({}, async function(err, wl) {
                                    wl[0].list.forEach(async id => {
                                    console.log(id);
                                    (await client.users.fetch(`${id}`)).send({ embeds: [userBuy] }).catch(err => {})
                                        
                                    })
                                }).clone()
                            } catch(err) {
                                console.log(err);
                            };
                                
                    } else {
                        await interaction.update({ embeds: [NoMoney], components: [row] }).catch(err => {

                        })
                    }
                    return true;
                })(interaction.values[0], interaction)
                break;
        }
    } catch (err) {

    }
    }
}

