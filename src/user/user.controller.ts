import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { FormDataRequest } from 'nestjs-form-data';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { editFileName, imageFileFilter } from 'src/ultils/file-uploading';
import { CreateAddressDto } from './dtos/create-address.dto';
import { CreateUserDto } from './dtos/create-user..dto';
import { EditMyProfileDto } from './dtos/edit-user.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { GetUserDto } from './dtos/get-user.dto';
import { SignInDto } from './dtos/signin.dto';
import { VerifyUserDto } from './dtos/verify-user.dto';
import { User } from './entities/user.entity';
import { Role } from './role.enum';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()

export class UserController {
    constructor(
        private userService: UserService
    ){}
//Sign up user && account
    @Public()
    @ApiConsumes('multipart/form-data')
    @Post('/signup')
    @UseInterceptors(FileInterceptor('avatar',{
            storage: diskStorage({
              destination: './uploads',
              filename: editFileName,
            }), 
            fileFilter:imageFileFilter
    }))
    async signUp(
                @Body() createUserDto: CreateUserDto, 
                @UploadedFile() file: Express.Multer.File
        ){
        return await this.userService.signUp(createUserDto,file)
    }
    // Verify user by sign up
    @Public()
    @Get('/signup/verify')
    async verifiedUser(@Query() verifyUserDto: VerifyUserDto ){
        return await this.userService.verifiedUser(verifyUserDto)
    }

    @Public()
    @Post('/signin')
    @ApiConsumes('multipart/form-data')
    @FormDataRequest()
    async signIn(@Body() signInDto: SignInDto){
        return await this.userService.signIn(signInDto)
    }

    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Delete(':id')
    async deleteAccount(@Param('id') id:string, @GetUser() user: User ){
        return await this.userService.deleteAccount(id, user)
    }

    @ApiConsumes('multipart/form-data')
    @Post('address')
    @FormDataRequest()
    async createAddress(
        @Body() createAddressDto: CreateAddressDto,
        @GetUser() user: User
    ){
        return await this.userService.createAddress(createAddressDto, user)
    }
    
    @Get('address')
    async getAdressByUser(@GetUser() user: User){
        return await this.userService.getAdressByUser(user)
    }


    @Public()
    @Get('/send_mail_forgot')
    async sendMailForgot(@Query('email') email: string ){
        return await this.userService.sendEmailForgot(email)
    }
    @Public()
    @Patch('/forgot')
    async forgotPassword(@Query() verifyUserDto: VerifyUserDto, @Body() forgotPasswordDto: ForgotPasswordDto){
        return await this.userService.forgotPassword(verifyUserDto, forgotPasswordDto)
    }

    @ApiConsumes('multipart/form-data')
    @Patch('/profile')
    @UseInterceptors(FileInterceptor('avatar',{
        storage: diskStorage({
          destination: './uploads',
          filename: editFileName,
        }), 
        fileFilter:imageFileFilter
    }))
    async editMyProfile(@Body() editMyProfile: EditMyProfileDto, @GetUser() user: User, @UploadedFile() file){
        return await this.userService.editProfile(editMyProfile, user, file)
    }
    
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @ApiConsumes('multipart/form-data')
    @Get()
    async getAllUser(@Body() getUserDto: GetUserDto){
        return await this.userService.getAllUser(getUserDto)
    }
}
