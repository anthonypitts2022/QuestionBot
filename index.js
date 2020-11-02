const tmi = require('tmi.js');
var original_questions = require('./questions');
var questions = require('./questions');
const twitch_channel = process.env.channel


try{
    const options = {
        options: {
            debug: true
        },
        connection: {
            cluster: 'aws',
            reconnect: true
        },
        identity: {
            username: 'Question___Bot',
            password: process.env.TWITCH_TOKEN
        },
        channels: [twitch_channel]
    }
    
    const client = new tmi.client(options)
    
    client.connect();
    
    client.on('connected', (address, port) => {
        client.action(twitch_channel, 'Hey! Question Bot here!')
    })

    //ask a question when prompted by command
    client.on('chat', (channel, user, message, self) => {
        if(message === '!question'){
            client.action(twitch_channel, get_question())
        }
    })

    //ask a question every 7 minutes
    setInterval(function(){ 
        client.action(twitch_channel, get_question())
    }, 420000);

} catch(err){
    console.log(err);
}


function get_question(){

    //if out of questions, reset the questions variable
    if(questions.length==0)
        reset_questions()

    //get question
    question_num = Math.floor(Math.random() * questions.length)
    var question = questions[question_num];
    questions.splice(question_num, 1)
    return question

}

function reset_questions(){
    questions = []
    for(i=0; i<original_questions.length; i++){
        questions.push(original_questions[i])
    }
}
