import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    // Send email verify with token
    async sendUserConfirmation(user: User, token: string) {
        const url = `/user/signin?token=${token}`;
        try{
            console.log('222222222222');
            
            const result = await this.mailerService.sendMail({
              to: user.email,
              // from: '"Support Team" <support@example.com>', // override default from
              subject: 'Verify email',
              html:`<p>Hey ${user.name},</p>
              <p>Please click below to confirm your email</p>
              <p>
                  <a href=${url}>Confirm</a>
              </p>
              
              <p>If you did not request this email you can safely ignore it.</p>`,
            });
            console.log(result);
            
            return result;


        }catch(error){
            console.log(error);
            
            throw new BadRequestException(`Send mail fail!`)
        }
      }
    // send verify email with verify code
    async sendVerifyEmail(url: string, email: string){
        try{
            console.log('222222222222');   
            const result = await this.mailerService.sendMail({
              to: email,
              from: '"Support Team" <joy.nguyen.bot@gmail.com>', // override default from
              subject: 'Verify email',
              html:`
              <p>Please click below to confirm your email</p>
              <p>
                  <a href=${url}>Confirm</a>
              </p>
              
              <p>If you did not request this email you can safely ignore it.</p>`,
            });
            
            return result;


        }catch(error){
            console.log(error);
            
            throw new BadRequestException(`Send mail fail!`)
        }
    }
    
    async sendEmailForgotPassword(url: string, email: string){
        try{
            console.log('222222222222');
            
            const result = await this.mailerService.sendMail({
              to: email,
              from: '"Support Team" <joy.nguyen.bot@gmail.com>', // override default from
              subject: 'Forgot password',
              html:`
              <p>Please click below to reset your password</p>
              <p>
                  <a href=${url}>Reset</a>
              </p>
              
              <p>If you did not request this email you can safely ignore it.</p>`,
            });
            
            return {status: 200, message:'Send email successfully!'};

        }catch(error){
            console.log(error);
            
            throw new BadRequestException(`Send mail fail!`)
        }
    }
    async sendEmailFlashsale(url: string, flashsale_name: string,flashsale_description: string, mail: string, startSale: string,   ){
        try{
            console.log('222222222222');
            
            const result = await this.mailerService.sendMail({
              to: mail,
              // from: '"Support Team" <support@example.com>', // override default from
              subject: 'Chương trình sale lớn !!!! Đừng bỏ lỡ !!!!!!!',
              html:`
              <!DOCTYPE html>
              <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
              
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width">
                <meta name="x-apple-disable-message-reformatting">
                <title>Email templates</title>
                <link href="style.css" rel="stylesheet" type="text/css">
                <!-- bootstrap linked -->
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
                <style>
                  @import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@300&display=swap');
              
                  body {
                    font-family: 'Inconsolata', monospace;
                    max-width: 800px;
                    font-size: 18px;
                  }
                  #main{
                    /* background-color: #aaaaff; */
                    background-image: url("https://i.stack.imgur.com/SvWWN.png");
                    background-size: cover;
                    background-repeat: no-repeat;
                    height: auto;
                  }
                  .one_col{
                    border: 1px;
                    border-color: white;
                    color: white;
                    position: relative;
                    left: 250px;
                    width: 100%; 
                    display: inline; 
                    background-color:#fffaaa;
                  }
                  #wrapper{
                    text-align: center;
                    display:block;
                    width:50%; 
                    margin: 10px;
                    padding: 0px 30px 0px 40px; 
                    position: relative;
                    /* top: 0px; */
                
                  }
                  #socials{
                    position: relative;
                    top: 10px;
                    left: 530px;
                    display: inline;
                    justify-content: center;
                  }
                  #foot{
                    color: white;
                    position: relative;
                    left: 550px;
                  }
                  hr{
                    color: white;
                    position: relative;
                    left: 250px;
                  }
                </style>
              </head>
              
              <body id="main">
                <script src="script.js"></script>
                <!-- wrapper div -->
                <div id="wrapper">
                  <header>
                    <!-- banner -->
                    <div id="banner">
                      <img src="https://raw.githubusercontent.com/mdbootstrap/knowledge-base/main/CSS/responsive-email/img/banner.png" alt="banner_image">
                    </div>
                  </header>
                </div>
                <!-- paragraphs -->
                <div class="one_col">
              
                  <h1>${flashsale_name}</h1>
              
                  <p id="sec_para">${flashsale_description}
                  </p>
              
                  <h1 id="sec_para">Vào ngày: <strong>${startSale}</strong>
                  </h1>
                  <!-- <button type="button" class="btn btn-light">Learn More</button> -->
                  <a href=${url} target="_blank" class="btn btn-primary btn-lg active" role="button" aria-pressed="true">Learn More</a>
                </div>
              
                <!-- facebook logo -->
                <div id="socials">
                  <p id="social_logo">
              
                    <a href="#" target="_blank"><img src="https://raw.githubusercontent.com/mdbootstrap/knowledge-base/main/CSS/responsive-email/img/fb-bw.png"></a>
              
                    <!-- twitter -->
              
                    <a href="#" target="_blank"><img src="https://raw.githubusercontent.com/mdbootstrap/knowledge-base/main/CSS/responsive-email/img/tw-bw.png"></a>
              
                    <!-- youtube -->
              
                    <a href="#" target="_blank"><img src="https://raw.githubusercontent.com/mdbootstrap/knowledge-base/main/CSS/responsive-email/img/yt-bw.png"></a>
              
                  </p>
              
                </div>
                <hr>
                <footer style="font-size: 14px;">
                  <p id="contacts">
              
                  <p id="foot"> <cite>created by</cite> @RDtemplates</p>
                  <p id="foot">
                    <email>rdranbir1999@gmail.com</email>
                  </p>
                  <p id="foot">
                    <phone>7439102985</phone>
                  </p>
                  <p id="foot"><cite>&copy; All Copyrights 2022 reserved</cite></p>
              
                  </p>
                </footer>
              
                <div id="scroll">
              
                </div>
              </body>
              
              </html>
              `,
            });
            
            return {status: 200, message:'Send email successfully!'};

        }catch(error){
            console.log(error);
            
            throw new BadRequestException(`Send mail fail!`)
        }
    }
}
