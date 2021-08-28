import {PassportStrategy} from "@nestjs/passport";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserRepository} from "./user.repository";
import {ExtractJwt, Strategy} from "passport-jwt";
import {User} from "./user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(UserRepository)
        private userRepository : UserRepository
    ) {
        super({
            secretOrKey: 'outframe',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })

    }

    async validate(payload){
        const {username} = payload;
        const user:User = await this.userRepository.findOne({username});
        if(!user){
            throw new UnauthorizedException();
        }
        return user;
    }
}