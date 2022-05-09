import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports:[
        PassportModule.register({ defaultStrategy: 'jwt' }),
        // TypeOrmModule.forFeature([User]),

        // JwtModule.register({
        //     secret: "nestjs",
        //     signOptions: { expiresIn: 12*3600 },
        // }),
        forwardRef(()=> UserModule),
    ],
    providers: [ JwtStrategy],
    exports: [ PassportModule, JwtStrategy]

})
export class AuthModule {

}
