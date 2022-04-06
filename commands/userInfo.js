module.exports = {
    name: 'infouser',
    description: 'User information\nExample: i 532889574045777920',
    aliases: ['i'],
    isHidden: false,
    dm: [false, true],
    async execute(client, message, args, Discord, wait, UserModel, {}) {
        const permission = (await UserModel.findOne({login: message.author.id})).permission;
        if(!permission) return;
        if(!args[0]) return message.reply('No arguments').catch(err => {});
        if(isNaN(args[0])) return message.reply('Please enter user id!').catch(err => {});

        let member = await client.users.fetch(args[0])
        if (!member) return message.author.send(`Undefined user`).catch(err => {});
        let userData = await UserModel.findOne({ idUser: args[0] });
        if(!userData) return;
        try {
        let embed  = new Discord.MessageEmbed()
.setTitle(`${member.username}'s Кошелёк:`)
.setDescription(`
Login: ${userData.login}
Spend money: ${userData.total}
Balance: ${userData.balance}
Subscrubtion: ${userData.subscribe.name}
${userData.subscribe.subscribedAt ? `Active to...\n Month count: ${userData.subscribe.duration}` : ''}
`)
                    .setColor('#fff');
                    message.reply({ embeds: [embed] }).catch(err => {

                    });
                } catch(err ) {}
        }
}