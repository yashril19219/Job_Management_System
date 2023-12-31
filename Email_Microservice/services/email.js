var nodemailer =require('nodemailer');
require('dotenv').config({path : "config/.env"});

async function sendEmail(emails,content){
    var transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD
        }
      });

      var subject=content.subject;
      var text=content.body;

      var mailOptions = {
        from: process.env.MAIL_USER,
        to: emails,
        subject: subject,
        text: text
      };
      
    
      console.log(emails);
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } 
        else {

          console.log('Email sent: ' + info.response);
         
            return {status:"Success"};
         }

      });
}

module.exports={
    sendEmail
}