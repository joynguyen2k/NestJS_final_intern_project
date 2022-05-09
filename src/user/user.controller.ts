import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FormDataRequest } from 'nestjs-form-data';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { editFileName, imageFileFilter } from 'src/ultils/file-uploading';
import { CreateAddressDto } from './dtos/create-address.dto';
import { CreateUserDto } from './dtos/create-user..dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { GetUserDto } from './dtos/get-user.dto';
import { SignInDto } from './dtos/signin.dto';
import { VerifyUserDto } from './dtos/verify-user.dto';
import { User } from './entities/user.entity';
import { Role } from './role.enum';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ){}
    @Post('/signup')
    @UseInterceptors(FileInterceptor('avatar',{
            storage: diskStorage({
              destination: './uploads',
              filename: editFileName,
            }), 
            fileFilter:imageFileFilter
    }))
    async signUp(@Body() createUserDto: CreateUserDto, @UploadedFile() file: Express.Multer.File){
        return await this.userService.signUp(createUserDto,file)
    }
    @Post('/signin')
    // @FormDataRequest()
    async signIn(@Body() signInDto: SignInDto){
        return await this.userService.signIn(signInDto)
    }
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Delete(':id')
    async deleteAccount(@Param('id') id:string ){
        return await this.userService.deleteAccount(id)
    }
    @UseGuards(AuthGuard())
    @Post('address')
    @FormDataRequest()
    async createAddress(
        @Body() createAddressDto: CreateAddressDto,
        @GetUser() user: User
    ){
        return await this.userService.createAddress(createAddressDto, user)
    }
    
    @UseGuards(AuthGuard())
    @Get('address')
    async getAdressByUser(@GetUser() user: User){
        return await this.userService.getAdressByUser(user)
    }
    @UseGuards(AuthGuard())
    @Get('email')
    async getAllMail(){
        return await this.userService.getAllMail()
    }

    @Get('/signup/verify')
    async verifiedUser(@Query() verifyUserDto: VerifyUserDto ){
        console.log(verifyUserDto);
        
        return await this.userService.verifiedUser(verifyUserDto)

    }
    @Get('/send_mail_forgot')
    async sendMailForgot(@Query('email') email: string ){
        console.log(email);
        
        return await this.userService.sendEmailForgot(email)
    }
    @Patch('/forgot')
    async forgotPassword(@Query() verifyUserDto: VerifyUserDto, @Body() forgotPasswordDto: ForgotPasswordDto){
        console.log('verify', verifyUserDto);
        console.log('pass', forgotPasswordDto);
        
        
        return await this.userService.forgotPassword(verifyUserDto, forgotPasswordDto)
    }
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get()
    async getAllUser(@Body() getUserDto: GetUserDto){
        return await this.userService.getAllUser(getUserDto)
    }
}
