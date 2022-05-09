import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from 'src/user/entities/user.entity';
import { UserPayload } from 'src/user/user-payload.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {
    
    super({
      secretOrKey: 'nestjs',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(userPayload: UserPayload) :Promise<User>{
    const { username } = userPayload;

    const user = await this.userService.findOne(username);
    if(!user){
      throw new UnauthorizedException(`Please check again`)
    }

    
    return user;
  }
}