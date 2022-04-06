module.exports = {
    name: 'stats',
    description: 'Bot\'s statistic',
    aliases: ['stat'],
    isHidden: false,
    dm: [false, true],
    async execute(client, message, args, Discord, wait, UserModel, { start }) {

        const permission = (await UserModel.findOne({login: message.author.id})).permission;
        if(!permission) return;
        await getInfo(message, UserModel, Discord)
        
        message.delete().catch(err => { })
    }
}
function getMinutesBetweenDates(startDate, endDate) {
    var diff = endDate.getTime() - startDate;
    return (diff / 60000);
}
async function getInfo(message, UserModel, Discord) {
    try {
            let count = {
                notices: 0,
                lastUse: 0,
                buyers: 0,
                buyers_wait: 0,
                buyers_wait_arr: [],
                buyers_wait_total: 0,
                total: 0,
                lastBuyer: [],
                total_all: 0
            }

                UserModel.find({}, async function (err, users) {
                users.forEach(async(user) => {
                    count.total_all++;
                    
                     if(user.notice) {
                         count.notices++;
                     }
                     if(user.ad) {
                         count.notices++;
                     }
                     if(user.lastUse) {
                        if(getMinutesBetweenDates(user.lastUse, new Date()) < 1440) {
                            count.lastUse++;
                        }
                     }
                     if(user.total > 0) {
                         count.buyers++;
                         count.total = count.total + Number(user.total);
                     }
                    if(user.userSpend > 0) {
                       count.total = count.total + Number(user.userSpend);
                        }
                     if(user.balance > 0) {
                         count.buyers_wait++;
                         count.buyers_wait_total+= user.balance;
                     }
                 })
             }).clone()
             .then(async() => {
             setTimeout(async () => {
                const embed = new Discord.MessageEmbed()
               .setTitle(`Bot's statistic`)
               .setDescription(`
               **Enabled push notices: \`${count.notices}\` from \`${count.total_all}\` users**
               \n**Last 24 hours bot used by \`${count.lastUse}\` users**
               \n**Users Count: \`${count.buyers}\` , count = \`${count.total}\`**
               \n**Count users with balance: \`${count.buyers_wait}\`, their balance equils to \`${count.buyers_wait_total}\`**
               `)
               .setFooter(message.author.username + '#' + message.author.discriminator)
               .setTimestamp();
   
           await message.reply({ embeds: [embed], ephemeral: true, flags: 64, components: [] }).catch(err => {})
        },4000)
       })
            
            
             } catch (err) {
                 console.log(err)
             }
}
