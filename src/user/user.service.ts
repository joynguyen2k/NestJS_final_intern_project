import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user..dto';
import { User } from './entities/user.entity';
import * as moment from 'moment';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { Role } from './role.enum';
import { SignInDto } from './dtos/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './user-payload.interface';
import { CreateAddressDto } from './dtos/create-address.dto';
import { AddressShipping } from './entities/addressShipping.entity';
import { GetUserDto } from './dtos/get-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from 'src/common/mail/mail.service';
import { VerifyUserDto } from './dtos/verify-user.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { EditMyProfileDto } from './dtos/edit-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private UserRepository: Repository<User>,
        @InjectRepository(AddressShipping)
        private AddressShippingRepository: Repository<AddressShipping>,
        private jwtService: JwtService,
        private mailService: MailService

    ){}
    async findOne(username:string){
        const user = await this.UserRepository.findOne({username: username});
        return user;
    }
    // Register user
    async signUp(createUserDto: CreateUserDto, file: any ){
        const {name, username, phone, email, password, dateOfBirth, avatar}= createUserDto;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const verifyCode= uuid();

        const currentDate= new Date();
        const user = await this.UserRepository.findOne({username: username});
        if(user){
            throw new ConflictException('Username already exists');
        }else{
            const userCreated = await this.UserRepository.create({
                ...createUserDto,
                password: hashedPassword,
                role: Role.USER,
                verify: false,
                verifyCode: verifyCode,
                avatar: file.path,
                createdAt:currentDate,
            });
            await userCreated.save();
            await this.verifyAccount(email);
            return userCreated;

        }
    }
    // Verify account by send mail
    async verifyAccount(email: string){
        const user = await this.UserRepository.findOne({email});
        const currentDate = new Date();
        if(!user){
            throw new NotFoundException(`User: ${email} not found`)
        }
        if(user.verify) throw new BadRequestException('This account was verified')
        const url = process.env.HOST + `/user/signup/verify?email=${user.email}&verifyCode=${user.verifyCode}`
        const result = await this.mailService.sendVerifyEmail(url, email);
        user.updatedAt= currentDate;
        await user.save();
    }
    // Verify user by click link verify
    async verifiedUser(verifyUserDto: VerifyUserDto){
        const {email, verifyCode}= verifyUserDto;
        const user = await this.UserRepository.findOne({email});
        if(!user){
            throw new NotFoundException(`User ${email} not found`)
        }
        // Compare with verify code in table and verify code in link
        if(user.verifyCode === verifyCode){
            user.verify = true;
            user.verifyCode = null;
            await user.save()
            return {status:200, message: 'Verified Successfully'}

        }
    }

    // Click send email if forgot password by enter email
    async sendEmailForgot(email: string){
        const user = await this.UserRepository.findOne({email});  
        // Use new verify code to verify user
        const newVerifyCode = uuid();
        const currentDate = new Date();
        if(!user){
            throw new NotFoundException(`User with ${email} not found`)
        }
        if (!user.verify) {
            throw new BadRequestException(`Please verify your email.`);
          }
      
        //   const time = new Date().getTime() - user.updatedAt.getTime();
        //   const getTimeSendMail = time / (1000 * 60 * 5);
      
        //   if (getTimeSendMail < 1) {
        //     throw new BadRequestException(
        //       `Please wait ${(1 - getTimeSendMail) * 5 * 60}s`,
        //     );
        //   }
        user.verifyCode = newVerifyCode;
        user.updatedAt = currentDate;
        await user.save();        
        const url = process.env.HOST + `/user/forgot/?email=${user.email}&verifyCode=${user.verifyCode}`
        const result = await this.mailService.sendEmailForgotPassword(url, email);
    }
    async forgotPassword(verifyUserDto: VerifyUserDto,forgotPasswordDto: ForgotPasswordDto){
        const {email, verifyCode}= verifyUserDto
        const {password}= forgotPasswordDto;
     
        const user = await this.UserRepository.findOne({email});
        if(!user){
            throw new NotFoundException(`User ${email} not found`)
        }

        if(user.verifyCode === verifyCode){
             const salt = await bcrypt.genSalt();
             const hashedPassword = await bcrypt.hash(password, salt)//, salt);

            user.password = hashedPassword;
            user.verifyCode = null;
            await user.save();
            return {status:200, message: 'Reset password successfully!'}

        }else{
            throw new BadRequestException(`Please check email again!`)
        }
        
        
    }
    async signIn(signInDto: SignInDto){
        const {username, password} = signInDto;
        const user = await this.UserRepository.findOne({username: username});
        if(!user.verify){
            throw new BadRequestException('Please verify your email')
        }
        if(user && (await bcrypt.compare( password,user.password))){
            const payload: UserPayload = {username: user.username};
            const accessToken = await this.jwtService.sign(payload);
            // await this.mailService.sendUserConfirmation(user, accessToken)
            return {accessToken};
        }else{
            throw new UnauthorizedException('Please check your login credentials')
        }
    }
    async getAllUser(getUserDto: GetUserDto){
        const{keyword,size, order, by, page}= getUserDto;
        const query = this.UserRepository.createQueryBuilder('user')
        if(keyword){
            query.andWhere(
                // 'MATCH(category.name) AGAINST(:keyword)',
                'user.username LIKE :keyword',
                { keyword: `%${keyword}%` },
            )
        }
        if(order){
            if(by==='DESC') query.orderBy(`user.${order}`, 'DESC')
            else query.orderBy(`user.${order}`)
            // query.andWhere(
            //     // 'MATCH(category.name) AGAINST(:keyword)',
            //     'ORDER BY :order',
            //     { order: `${order}` },
            // )
        }
        if(size){
            if(page) {query.limit(Number(size)); query.offset(Number(size*(page-1))) } 
            else {query.limit(Number(size)); query.offset(0) } 
        }else {
            if(page) {query.limit(Number(8)); query.offset(Number(8*(page-1))) } 
            else {query.limit(Number(8)); query.offset(0) } 
        }

        const result = await query.getMany();
        console.log(query.getSql());
        
        return result;               
    }
    async deleteAccount(id:string, user: User){
        const userDelete = await this.UserRepository.findOne(id); 
        if(userDelete){
            if(user.role === 'ADMIN' && userDelete.role === 'USER'){
                return await this.UserRepository.delete(id)
            }else if(user.role === 'SUPERADMIN' &&( userDelete.role === 'USER' || userDelete.role === 'ADMIN') ){
                return await this.UserRepository.delete(id)
            }else{
                throw new BadRequestException(`Cannot delete this account`)
            }
        }else{
            throw new NotFoundException(`User Not Found`)
        }
    }
    async createAddress(createAddressDto: CreateAddressDto, user: User){
        const{name, phone, address}= createAddressDto;
        const addressShipping = await this.AddressShippingRepository.create({
            name,
            phone,
            address,
            user
        })
        return await addressShipping.save()
        // return await address.save();
    }
    async getAdressByUser(user:User){
        return await this.AddressShippingRepository.find({user});
    }
    async getAllMail(){
        const emails = await this.UserRepository.createQueryBuilder('user')
                                                .select('user.email')
                                                .getMany();
        let emailList =[];
        await emails.map((e)=> emailList.push(e.email));
        return await emailList;
    }
    async editProfile(editMyProfileDto: EditMyProfileDto, user: User, file: any){
        const {name, phone, email, dateOfBirth, password, avatar } = editMyProfileDto;
        
        user.name = name;
        user.phone= phone;
        user.email = email;
        user.dateOfBirth = dateOfBirth;
        user.avatar = file.path;
        if(password){
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt)//, salt);
            user.password = hashedPassword;
        }
        return await user.save()
    }

}
