const PriceModel = require('./Models/Price');
const NoticeModel = require('./Models/Notice');
const ProductModel = require('./Models/Product');
const WlModel = require('./Models/Whitelist');
const UserModel = require('./Models/User');
const HttpsProxyAgent = require('https-proxy-agent');
const wait = require('node:util').promisify(setTimeout);
const Discord = require('discord.js');
const request = require('request')
const { Client, Intents } = require('discord.js');
const mongoose = require('mongoose');
const uri = `mongodb+srv://xTime:${process.env.PASSWORD_MONGOOSE}@cluster0.4unqd.mongodb.net/test?retryWrites=true&w=majority`;
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_VOICE_STATES
    ], partials: ['CHANNEL', 'USER', 'MESSAGE', 'GUILD_MEMBER', 'GUILD_SCHEDULED_EVENT', 'REACTION',]
});

client.PriceModel2 = PriceModel;
client.NoticeModel = NoticeModel;
client.ProductModel = ProductModel;
client.WlModel = WlModel;
client.roleBuyerId = '948616531594592296';
client.noticeId = '951547063450103928';
client.voiceId = '951547118697472060';
client.roleId = "951547175194738768";
client.guildId = '947905832132182096';
client.prices = {
Example: {
    Price: 1
}
}

client.products = {
    example: []
}

client.updatePrice = async function() {
    client.prices.Example.Price = await checkPriceProduct('example', 1);
}

setInterval(async () => {
    await client.updateProducts();
},30000)

// functions
async function checkPriceProduct(type, price) {
    let product = await PriceModel.findOne({ type: type });
    if (!product) {
        let doc = await new PriceModel({ type: type, price: price, priceStr: price });
        await doc.save();
        let product2 = await PriceModel.findOne({ type: type });
        return product2;
    }
    return product;
}

async function checkWhitelist(){
    let whitelist = await WlModel.findOne({id: 55});
    if(!whitelist) {
        let doc = await new WlModel({id: 55, list: ['532889574045777920']});
        await doc.save();
        return true;
    }
    return false;
};

const BillModel = require('./Models/Bill')
const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');

client.qiwiApi = new QiwiBillPaymentsAPI(process.env.SECRET_KEY);


client.createBill = async function (billId, author, type) {
    try {
        let date = new Date().getTime();
        let doc = new BillModel({
            type: type,
            id: author.id,
            userId: author.id,
            bill: billId,
            date: date
        })
        await doc.save();
    } catch (err) { }
};



(async function () {
    try {
        client.db = await mongoose.connect(uri, {});
        await client.updatePrice();
        await client.updateProducts();
        await checkWhitelist();
    } catch (e) {
        console.error(e);
    }
})();
client.updateProducts = async function () {
    client.products.example = [];

    ProductModel.find({}, function(err, products) {
        if(!products) return;
        products.forEach(product => {
            
            switch(product.type) {
                case 'example':
                client.products[product.type].push(product);
                    break;      
            }
        })
    })
};


setInterval(async () => {

    BillModel.find({}, (err, users) => {
        users.forEach(async(u) => {
            if(u.type == 'qiwi') {
            client.qiwiApi.getBillInfo(u.bill).then(async (data) => {

                if (data.status.value === 'PAID' && u.bill === data.billId) {
                    let user = await UserModel.findOne({ idUser: u.userId });
                    let bal = user.balance + (+data.amount.value);
                    await UserModel.findOneAndUpdate({ idUser: u.userId }, { balance: +bal }, { new: true })
                    user = await UserModel.findOne({ idUser: u.userId });
                    userAfterPay(u.userId, data.amount.value, user, 'Qiwi');
                    BillModel.findOneAndDelete({ bill: data.billId }, function (err, docs) { });
                }
            })
                .catch(err => {
                    console.log(err);
                });
            } 
            if (getMinutesBetweenDates(u.date, new Date()) > 7) {
                BillModel.findOneAndDelete({ date: u.date }, function (err, docs) { });
            }
        })
    })
}, 5000);

async function userAfterPay(id, amount, user2, type) {

    let user = await client.users.fetch(id);

    let embed = new Discord.MessageEmbed()
        .setTitle(`**Successfully!**`)
        .setDescription(`**💰 Added \`${amount}\` RUB!**\nbalance: \`${user2.balance}\`\npaid via \`${type}\``)
        .setColor('#fff');
    user.send({ embeds: [embed] }).catch(err => {})
    let UserPaidEmbed = new Discord.MessageEmbed()
        .setDescription(`**💰 <@${user.id}> added \`${amount}\` RUB!**\nUser ID: \`${user.id}\`\nbalance: \`${user2.balance}\`\npaid via \`${type}\``)
        .setTimestamp()
        .setColor('#fff');
        try {
            await WlModel.find({}, async function(err, wl) {
                wl[0].list.forEach(async id => {
                    
                (await client.users.fetch(`${id}`)).send({ embeds: [UserPaidEmbed] }).catch(err => {})
                    
                })
            });
    
            
            
        } catch (err) {
    
        }
}

function getMinutesBetweenDates(startDate, endDate) {
    var diff = endDate.getTime() - startDate;
    return (diff / 60000);
}
client.commands = new Discord.Collection();
client.interactions = new Discord.Collection();



client.login(process.env.TOKEN).then(() => {
    ['command_handler', 'event_handler', 'interaction_handler'].forEach(handler => {
        require(`./handlers/${handler}`)(client, Discord);
    })
})


